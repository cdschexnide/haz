import TextRecognition from "@react-native-ml-kit/text-recognition";
import {
  TextBlock,
  AnchorMatch,
  ValueRegion,
  ExtractionResult,
  AnchorExtractionResult,
} from "./anchorTypes";
import { SDDG_ANCHORS, getTableColumnAnchors } from "./anchorConfig";
import { findAnchors, getMissingAnchors } from "./anchorDetection";
import {
  computeValueRegion,
  computeTableColumnRegions,
} from "./regionInference";
import {
  extractValueFromRegion,
  extractInlinePatternValue,
  extractCheckboxValue,
  applyPostProcessing,
} from "./valueExtraction";
import { SDDGData } from "@/types/sddg-template";

/**
 * Convert ML Kit recognition result to our TextBlock format
 */
export function convertToMLKitFormat(mlKitResult: any): TextBlock[] {
  const textBlocks: TextBlock[] = [];

  for (const block of mlKitResult.blocks || []) {
    if (!block.cornerPoints || block.cornerPoints.length < 4) continue;

    const xs = block.cornerPoints.map((p: any) => p.x);
    const ys = block.cornerPoints.map((p: any) => p.y);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    textBlocks.push({
      text: block.text,
      boundingBox: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      },
      confidence: 1.0, // ML Kit doesn't provide confidence per block
    });
  }

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

    // Step 3: Compute value regions and extract values
    const totalFields = SDDG_ANCHORS.length;
    let processedFields = 0;

    // Process table columns first (they need special handling)
    const tableAnchors = getTableColumnAnchors();
    const tableAnchorMatches = tableAnchors
      .map(cfg => anchors.get(cfg.fieldId))
      .filter((m): m is AnchorMatch => m !== undefined);

    const tableRegions = computeTableColumnRegions(
      tableAnchorMatches,
      anchors,
      imageWidth,
      imageHeight
    );

    // Process each anchor config
    for (const config of SDDG_ANCHORS) {
      processedFields++;
      if (onProgress) {
        onProgress({ current: processedFields, total: totalFields, field: config.fieldId });
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
        const value = extractCheckboxValue(
          textBlocks,
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

      // Compute value region
      let region: ValueRegion | null = null;

      if (config.patternType === "table-column-header") {
        region = tableRegions.get(config.fieldId) || null;
      } else {
        region = computeValueRegion(anchor, config, anchors, imageWidth, imageHeight);
      }

      if (!region) {
        results.set(config.fieldId, {
          fieldId: config.fieldId,
          value: "",
          confidence: 0,
          status: "value_empty",
          anchorMatch: anchor,
        });
        continue;
      }

      // Extract value from region
      let value = extractValueFromRegion(textBlocks, region);

      // Apply post-processing
      if (config.postProcessing && config.postProcessing.length > 0) {
        value = applyPostProcessing(value, config.postProcessing);
      }

      results.set(config.fieldId, {
        fieldId: config.fieldId,
        value,
        confidence: value ? 0.9 : 0,
        status: value ? "extracted" : "value_empty",
        anchorMatch: anchor,
        valueRegion: region,
      });
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
    class_division: get("class_division"),
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
