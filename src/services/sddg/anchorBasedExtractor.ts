import TextRecognition from "@react-native-ml-kit/text-recognition";
import {
  TextBlock,
  AnchorMatch,
  ValueRegion,
  ExtractionResult,
  AnchorExtractionResult,
} from "./anchorTypes";
import { SDDG_ANCHORS, getTableColumnAnchors, getAnchorConfig } from "./anchorConfig";
import { findAnchors, getMissingAnchors } from "./anchorDetection";
import {
  computeValueRegion,
  computeTableColumnRegions,
} from "./regionInference";
import {
  computeAdaptiveRegion,
  computeAdaptiveTableRegions,
  extractAdaptiveValue,
} from "./adaptiveRegionDetection";
import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
  extractAirportDestinationFallback,
} from "./valueExtraction";
import { SDDGData } from "@/types/sddg-template";
import { extractFieldsFromCells } from "./cellBasedExtraction";
import {
  detectInlineVariant,
  extractInlineDangerousGoods,
} from "./inlineDangerousGoodsParser";

// Use adaptive region detection instead of hardcoded inference
const USE_ADAPTIVE_DETECTION = true;

/**
 * Convert ML Kit recognition result to our TextBlock format
 * Uses LINES (not blocks) for more consistent granularity
 */
export function convertToMLKitFormat(mlKitResult: any): TextBlock[] {
  const textBlocks: TextBlock[] = [];

  // Use lines within blocks for more consistent granularity
  // ML Kit structure: blocks[] → lines[] → elements[]
  for (const block of mlKitResult.blocks || []) {
    // Process each line within the block
    for (const line of block.lines || []) {
      if (!line.cornerPoints || line.cornerPoints.length < 4) continue;

      const xs = line.cornerPoints.map((p: any) => p.x);
      const ys = line.cornerPoints.map((p: any) => p.y);

      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);

      textBlocks.push({
        text: line.text,
        boundingBox: {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY,
        },
        confidence: 1.0,
      });
    }
  }

  // Debug: log all text blocks
  console.log("📝 OCR Lines:", textBlocks.map(b => `"${b.text}" at (${Math.round(b.boundingBox.x)}, ${Math.round(b.boundingBox.y)})`).join("\n"));

  return textBlocks;
}

/**
 * Main anchor-based extraction function
 * Runs full-page OCR via Google ML Kit, finds anchors, computes regions, extracts values
 */
export async function extractWithAnchors(
  imageUri: string,
  onProgress?: (info: { current: number; total: number; field: string }) => void
): Promise<AnchorExtractionResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const results = new Map<string, ExtractionResult>();

  try {
    // Step 1: Run full-page OCR
    console.log("🔍 Running full-page OCR...");
    const mlKitResult = await TextRecognition.recognize(imageUri);
    const textBlocks = convertToMLKitFormat(mlKitResult);
    console.log(`✅ OCR complete: ${textBlocks.length} text blocks found`);

    // Step 1b: Try cell-based extraction (OpenCV cells + OCR text inside)
    console.log("🔲 Attempting cell-based extraction...");
    const { cellResults, cellDetection } = await extractFieldsFromCells(
      imageUri,
      textBlocks
    );
    console.log(`🔲 Cell-based extraction got ${cellResults.size} fields`);

    // Get image dimensions from OCR result (estimate from block positions)
    const imageWidth = Math.max(...textBlocks.map(b => b.boundingBox.x + b.boundingBox.width), 2550);
    const imageHeight = Math.max(...textBlocks.map(b => b.boundingBox.y + b.boundingBox.height), 3300);

    // Step 2: Find anchors
    console.log("🎯 Finding anchors...");
    const anchors = findAnchors(textBlocks, SDDG_ANCHORS);
    const missingAnchors = getMissingAnchors(anchors, SDDG_ANCHORS);

    console.log(`✅ Found ${anchors.size} anchors, missing ${missingAnchors.length}`);
    if (missingAnchors.length > 0) {
      warnings.push(`Missing anchors: ${missingAnchors.join(", ")}`);
    }

    // Position-based fallback for place_date: infer from name_title_signatory position
    if (!anchors.has("place_date") && anchors.has("name_title_signatory")) {
      const sigAnchor = anchors.get("name_title_signatory")!;
      // Place and Date label is always directly below Name/Title of Signatory on the SDDG form
      const searchY = sigAnchor.boundingBox.y + sigAnchor.boundingBox.height + 30;
      const searchHeight = 120;
      const searchX = sigAnchor.boundingBox.x - 50;
      const searchWidth = sigAnchor.boundingBox.width + 100;

      // Look for any text block in the expected position that could be the garbled label
      let bestFallback: TextBlock | null = null;
      for (const block of textBlocks) {
        const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;
        const blockCenterX = block.boundingBox.x + block.boundingBox.width / 2;
        if (
          blockCenterY >= searchY &&
          blockCenterY <= searchY + searchHeight &&
          blockCenterX >= searchX &&
          blockCenterX <= searchX + searchWidth
        ) {
          // Check if this looks like a label (contains "DATE", "PLACE", or is garbled text near expected position)
          const upper = block.text.toUpperCase();
          if (upper.includes("DATE") || upper.includes("PLACE") || upper.includes("AND")) {
            bestFallback = block;
            break;
          }
          // Even without keyword match, use position-based detection
          if (!bestFallback) {
            bestFallback = block;
          }
        }
      }

      if (bestFallback) {
        anchors.set("place_date", {
          fieldId: "place_date",
          boundingBox: bestFallback.boundingBox,
          matchedPattern: "PLACE AND DATE (position fallback)",
          confidence: 0.6,
        });
        console.log(`🎯 Anchor "place_date" found [position fallback]: "${bestFallback.text}" at (${Math.round(bestFallback.boundingBox.x)}, ${Math.round(bestFallback.boundingBox.y)})`);
      }
    }

    // Step 3: Compute value regions and extract values
    const totalFields = SDDG_ANCHORS.length;
    let processedFields = 0;

    // Detect form variant: inline (Labelmaster F07LB) vs tabular (AMC-IMT 1033)
    const isInlineVariant = detectInlineVariant(anchors, textBlocks);

    let tableRegions = new Map<string, ValueRegion>();

    if (isInlineVariant) {
      // Inline variant: extract dangerous goods from comma/slash-delimited text
      console.log("📋 Detected INLINE dangerous goods variant (Labelmaster F07LB)");
      const inlineResult = extractInlineDangerousGoods(textBlocks, anchors);

      // Map parsed fields into the results map
      // Note: anchorConfig uses "quantity_type_packing" as fieldId but SDDGData
      // uses "quantity_packing" — the mapping here bridges that naming mismatch
      const fieldMapping: [string, string | undefined][] = [
        ["un_number", inlineResult.un_number],
        ["proper_shipping_name", inlineResult.proper_shipping_name],
        ["class_division", inlineResult.class_division],
        ["subsidiary_risk", inlineResult.subsidiary_risk],
        ["packing_group", inlineResult.packing_group],
        ["quantity_type_packing", inlineResult.quantity_packing],
        ["packing_inst", inlineResult.packing_inst],
        ["authorization", inlineResult.authorization],
      ];

      for (const [fieldId, value] of fieldMapping) {
        results.set(fieldId, {
          fieldId,
          value: value || "",
          confidence: value ? 0.85 : 0,
          status: value ? "extracted" : "value_empty",
        });
      }
    } else {
      // Tabular variant: use existing table column region detection
      const tableAnchors = getTableColumnAnchors();
      const tableAnchorMatches = tableAnchors
        .map(cfg => anchors.get(cfg.fieldId))
        .filter((m): m is AnchorMatch => m !== undefined);

      tableRegions = USE_ADAPTIVE_DETECTION
        ? computeAdaptiveTableRegions(tableAnchorMatches, textBlocks, anchors)
        : computeTableColumnRegions(tableAnchorMatches, anchors, imageWidth, imageHeight);

      console.log(`🔄 Using ${USE_ADAPTIVE_DETECTION ? "ADAPTIVE" : "HARDCODED"} region detection`);
    }

    // Process each anchor config
    for (const config of SDDG_ANCHORS) {
      processedFields++;
      if (onProgress) {
        onProgress({ current: processedFields, total: totalFields, field: config.fieldId });
      }

      // Skip fields already extracted by inline variant parser
      // (must be checked before cellResults to prevent cell-based garbage
      // from overwriting correctly parsed inline fields)
      if (results.has(config.fieldId)) {
        continue;
      }

      // Check if cell-based extraction already got this field
      if (cellResults.has(config.fieldId)) {
        const cellValue = cellResults.get(config.fieldId)!;
        // Review fix #4: confidence based on whether we got content
        const confidence = cellValue.length > 0 ? 0.92 : 0.3;
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value: cellValue,
          confidence,
          status: "extracted",
        });
        console.log(`📦 ${config.fieldId}: using cell-based result`);
        continue;
      }

      const anchor = anchors.get(config.fieldId);

      // Handle different pattern types
      if (config.patternType === "inline-pattern") {
        // Inline patterns extract directly from OCR text
        const value = extractInlinePatternValue(
          textBlocks,
          config.valueRegionRules.regex || ""
        );
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value,
          confidence: value ? 1.0 : 0,
          status: value ? "extracted" : "value_empty",
        });
        continue;
      }

      if (config.patternType === "checkbox-pair") {
        // Checkbox pairs detect which option is NOT X'd out
        // Scope text blocks to the anchor's region to prevent cross-contamination
        // (e.g., aircraft type X-marks bleeding into shipment type detection)
        const checkboxBlocks = anchor
          ? textBlocks.filter(block => {
              const blockCenterY = block.boundingBox.y + block.boundingBox.height / 2;
              const anchorY = anchor.boundingBox.y;
              return Math.abs(blockCenterY - anchorY) < 150;
            })
          : textBlocks;
        const value = extractCheckboxValue(
          checkboxBlocks.length > 0 ? checkboxBlocks : textBlocks,
          config.valueRegionRules.options || []
        );
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value,
          confidence: 0.8, // Checkbox detection is less certain
          status: value ? "extracted" : "value_empty",
        });
        continue;
      }

      if (!anchor) {
        // Anchor not found
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value: "",
          confidence: 0,
          status: "anchor_not_found",
        });
        continue;
      }

      // Compute value region and extract value
      let region: ValueRegion | null = null;
      let value = "";

      if (config.patternType === "table-column-header") {
        // Table columns use pre-computed regions
        region = tableRegions.get(config.fieldId) || null;
        if (region) {
          value = extractValueFromRegion(textBlocks, region);
        }
      } else if (USE_ADAPTIVE_DETECTION) {
        // Use adaptive detection - finds blocks and extracts in one step
        const adaptive = extractAdaptiveValue(anchor, textBlocks, config, anchors);
        value = adaptive.value;
        region = adaptive.region;
      } else {
        // Use hardcoded region inference
        region = computeValueRegion(anchor, config, anchors, imageWidth, imageHeight);
        if (region) {
          value = extractValueFromRegion(textBlocks, region);
        }
      }

      // Apply post-processing
      if (config.postProcessing && config.postProcessing.length > 0) {
        value = applyPostProcessing(value, config.postProcessing);
      }

      if (!region && !value) {
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value: "",
          confidence: 0,
          status: "value_empty",
          anchorMatch: anchor,
        });
        continue;
      }

      // Debug: log extracted value
      console.log(`📦 ${config.fieldId}: "${value.substring(0, 50)}${value.length > 50 ? '...' : ''}"`);

      results.set(config.fieldId, {
        fieldId: config.fieldId,
        value,
        confidence: value ? 0.9 : 0,
        status: value ? "extracted" : "value_empty",
        anchorMatch: anchor,
        valueRegion: region || undefined,
      });
    }

    // Fallback: airport_destination when anchor detection failed
    // Handles cases where OCR merges the label and value into one block
    // (e.g., "Alirport of Destination (optional): SUU")
    const destResult = results.get("airport_destination");
    if (!destResult?.value) {
      const fallbackValue = extractAirportDestinationFallback(textBlocks);
      if (fallbackValue) {
        results.set("airport_destination", {
          fieldId: "airport_destination",
          value: fallbackValue,
          confidence: 0.75,
          status: "extracted",
        });
      }
    }

    return {
      success: true,
      results,
      errors,
      warnings,
      metadata: {
        extractionTime: Date.now() - startTime,
        anchorsFound: anchors.size,
        anchorsMissing: missingAnchors,
        totalTextBlocks: textBlocks.length,
      },
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    errors.push(`Extraction failed: ${errorMessage}`);
    console.error("❌ Anchor extraction error:", error);

    return {
      success: false,
      results,
      errors,
      warnings,
      metadata: {
        extractionTime: Date.now() - startTime,
        anchorsFound: 0,
        anchorsMissing: SDDG_ANCHORS.map(a => a.fieldId),
        totalTextBlocks: 0,
      },
    };
  }
}

/**
 * Convert anchor extraction results to SDDGData format
 * (Compatible with existing templateExtractor output)
 */
export function convertToSDDGData(extractionResult: AnchorExtractionResult): SDDGData {
  const get = (fieldId: string): string =>
    extractionResult.results.get(fieldId)?.value || "";

  return {
    formType: "AMC_IMT_1033",
    formVersion: "V1",
    extraction_method: "anchor-based" as any,
    extraction_timestamp: new Date().toISOString(),

    shipper: get("shipper"),
    consignee: get("consignee"),
    inspector: "", // Not typically on form
    awb_number: get("air_waybill"),
    page_info: get("page_info"),
    tcn: get("shipper_reference_tcn"),

    airport_departure: get("airport_departure"),
    airport_destination: get("airport_destination"),

    // Checkbox fields
    cargo_aircraft_only: get("aircraft_type") === "cargo_only",
    non_radioactive: get("shipment_type") === "non_radioactive",
    radioactive: get("shipment_type") === "radioactive",

    // Dangerous goods table
    un_number: get("un_number"),
    proper_shipping_name: get("proper_shipping_name"),
    // Split subsidiary risk from class_division (handles both table and inline paths)
    // Table-based: column contains "2.2 (5.1)" as a single string
    // Inline: already split, but subsidiary_risk may also come from the results map
    ...(() => {
      const rawClass = get("class_division");
      const existingSubRisk = get("subsidiary_risk");
      if (existingSubRisk) {
        return {
          class_division: rawClass,
          subsidiary_risk: existingSubRisk,
        };
      }
      const subMatch = rawClass.match(/\s*(\(\d(?:\.\d)?\))\s*$/);
      if (subMatch) {
        return {
          class_division: rawClass.slice(0, -subMatch[0].length).trim(),
          subsidiary_risk: subMatch[1],
        };
      }
      return { class_division: rawClass, subsidiary_risk: "" };
    })(),
    packing_group: get("packing_group"),
    quantity_packing: get("quantity_type_packing"),
    packing_inst: get("packing_inst"),
    authorization: get("authorization"),

    // Footer
    additional_handling: get("additional_handling"),
    emergency_phone: get("emergency_telephone"),
    name_title: get("name_title_signatory"),
    place_date: get("place_date"),
    signature_date: "", // Usually combined with place_date
    signature: get("signature"),
  };
}
