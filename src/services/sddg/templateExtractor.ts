import {
  DEFAULT_ALIGNMENT_CONFIG,
  AMC_IMT_1033_ANCHORS,
} from "@/config/alignmentConfig";
import {
  PreprocessingConfig,
  DEFAULT_PREPROCESSING_CONFIG,
} from "@/config/preprocessingConfig";
import {
  SDDGData,
  TemplateAlignment,
  AlignmentConfig,
  SDDGTemplate,
  FieldRegion,
} from "@/types/sddg-template";
import {
  PreprocessingResult,
  preprocessFullImage,
  preprocessRegion,
} from "@/utils/sddg/imagePreprocessing";
import {
  correctImageOrientation,
  scaleRegion,
  cropRegion,
} from "@/utils/sddg/imageUtils";
import { extractText } from "./paddleOCREngine";
import { alignTemplate, validateAlignment } from "./templateAlignment";
import { getTemplate } from "@/templates";
import { validateFormData, ValidationResult } from "./validators";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";

export interface FieldExtractionResult {
  fieldPath: string;
  value: string;
  confidence: number;
  region: { x: number; y: number; w: number; h: number };
  rawOcrResult: any;
}

export interface TemplateExtractionResult {
  success: boolean;
  data: SDDGData;
  fieldResults: FieldExtractionResult[];
  validation: ValidationResult;
  errors: string[];
  warnings: string[];
  alignment?: TemplateAlignment;
  metadata: {
    formType: string;
    imageWidth: number;
    imageHeight: number;
    extractionTime: number;
    fieldsExtracted: number;
    fieldsFailed: number;
    overallConfidence: number;
    validationErrors: number;
    validationWarnings: number;
    imageRotated: boolean;
    rotationDegrees: number;
    preprocessingUsed: boolean;
    preprocessingTime: number;
    preprocessingOperations: string[];
    alignmentUsed: boolean;
    alignmentOffset: { x: number; y: number };
    alignmentConfidence: number;
  };
}

/**
 * Main extraction function
 * Extracts all fields from a form image using template coordinates
 */
export async function extractFormData(
  imageUri: string,
  formType: string = "AMC_IMT_1033",
  onProgress?: (progress: {
    current: number;
    total: number;
    field: string;
  }) => void,
  preprocessingConfig: PreprocessingConfig = DEFAULT_PREPROCESSING_CONFIG,
  alignmentConfig: AlignmentConfig = DEFAULT_ALIGNMENT_CONFIG,
  customTemplate?: SDDGTemplate
): Promise<TemplateExtractionResult | null> {
  const startTime = Date.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const fieldResults: FieldExtractionResult[] = [];

  try {
    // 1. Load template (use custom template if provided, otherwise load from registry)
    const template = customTemplate || getTemplate(formType);
    if (!template) {
      throw new Error(`Template not found: ${formType}`);
    }

    if (customTemplate) {
      console.log("✅ ========================================");
      console.log("✅ USING CUSTOM TEMPLATE (USER-ADJUSTED)");
      console.log("✅ - Padding: DISABLED");
      console.log("✅ - Alignment: DISABLED");
      console.log("✅ - Regions will be used EXACTLY as adjusted");
      console.log("✅ ========================================");
      // Log sample fields to verify custom template is being used
      if (customTemplate.regions?.shipper) {
        console.log("Sample field: shipper =", customTemplate.regions.shipper);
      }
      if (customTemplate.regions?.dangerous_goods?.un_number) {
        console.log(
          "Sample field: dangerous_goods.un_number =",
          customTemplate.regions.dangerous_goods.un_number
        );
      }
    } else {
      console.log("📋 Using DEFAULT template coordinates");
      console.log("📋 - Padding: ENABLED");
      console.log("📋 - Alignment: ENABLED");
    }

    // 2. Correct image orientation if needed
    const orientationResult = await correctImageOrientation(
      imageUri,
      2550, // Template width (300 DPI)
      3300 // Template height (300 DPI)
    );

    // Use the corrected image URI and dimensions
    const correctedImageUri = orientationResult.imageUri;
    const imageDims = {
      width: orientationResult.width,
      height: orientationResult.height,
    };

    console.log(
      `Image dimensions after orientation correction: ${imageDims.width}x${imageDims.height}`
    );
    if (orientationResult.rotated) {
      console.log(
        `✓ Image was rotated ${orientationResult.rotationDegrees}° to match template orientation`
      );
    }

    // 3. Apply full-image preprocessing (if enabled)
    let preprocessedImageUri = correctedImageUri;
    let preprocessingResult: PreprocessingResult | null = null;

    if (preprocessingConfig.enabled) {
      console.log("🔧 Applying full-image preprocessing...");
      preprocessingResult = await preprocessFullImage(
        correctedImageUri,
        preprocessingConfig
      );
      preprocessedImageUri = preprocessingResult.uri;
      console.log(
        `✓ Preprocessing complete: ${preprocessingResult.metrics.processingTime}ms`
      );
    }

    // 4. Align template to form
    // CRITICAL: Skip alignment when using custom template!
    // User has already positioned regions precisely, alignment would destroy their work.
    let alignedTemplate = template;
    let alignment: TemplateAlignment | undefined;

    if (
      alignmentConfig.enabled &&
      formType === "AMC_IMT_1033" &&
      !customTemplate
    ) {
      console.log("🎯 Detecting anchor points and aligning template...");

      try {
        const alignmentResult = await alignTemplate(
          preprocessedImageUri,
          template,
          imageDims,
          AMC_IMT_1033_ANCHORS,
          alignmentConfig
        );

        alignment = alignmentResult.alignment;

        if (!alignment) return await null;

        // Validate alignment
        const validation = validateAlignment(
          alignment.detectedAnchors,
          { offset: alignment.offset, confidence: alignment.confidence },
          alignmentConfig
        );

        if (validation.valid && alignment.success) {
          alignedTemplate = alignmentResult.alignedTemplate;
          console.log(
            `✓ Template aligned: offset=(${alignment.offset.x}, ${alignment.offset.y}), ` +
              `confidence=${(alignment.confidence * 100).toFixed(1)}%`
          );
        } else {
          console.warn(`⚠ Alignment validation failed: ${validation.reason}`);
          if (alignmentConfig.fallbackToOriginal) {
            console.log("↩ Falling back to original template");
          }
        }
      } catch (error) {
        console.error("✗ Alignment error:", error);
        console.log("↩ Falling back to original template");

        // Create failed alignment for metadata
        alignment = {
          success: false,
          offset: { x: 0, y: 0 },
          rotation: 0,
          confidence: 0,
          detectedAnchors: [],
          usedAnchors: [],
          skippedAnchors: [],
          metrics: {
            offsetMagnitude: 0,
            anchorAgreement: 0,
            processingTime: 0,
          },
        };
      }
    } else if (customTemplate) {
      console.log(
        "⚠️ SKIPPING template alignment - using user-adjusted custom template as-is"
      );
    }

    // 5. Extract all fields using aligned template
    const data: SDDGData = {
      formType: template.formType,
      formVersion: template.version,
      extraction_method: "template",
      extraction_timestamp: new Date().toISOString(),
    };

    // Get all text field regions from aligned template
    const textFields = getTextFieldRegions(alignedTemplate);
    const checkboxFields = getCheckboxRegions(alignedTemplate);
    let current = 0;
    const total = textFields.length + checkboxFields.length;

    // Extract text fields
    for (const { path, region } of textFields) {
      current++;
      if (onProgress) {
        onProgress({ current, total, field: path });
      }

      try {
        const result = await extractFieldValue(
          preprocessedImageUri,
          region,
          imageDims,
          path,
          preprocessingConfig,
          !!customTemplate // Disable padding if using custom template
        );

        // Apply field-specific text cleaning
        const cleanedValue = cleanFieldText(path, result.text);

        fieldResults.push({
          fieldPath: path,
          value: cleanedValue,
          confidence: result.confidence,
          region: result.scaledRegion,
          rawOcrResult: result.raw,
        });

        // Map to data structure
        setFieldValue(data, path, cleanedValue);
      } catch (error) {
        errors.push(`Failed to extract ${path}: ${error}`);
        console.error(`Field extraction error (${path}):`, error);
      }
    }

    // Extract checkbox fields
    for (const { path, region } of checkboxFields) {
      current++;
      if (onProgress) {
        onProgress({ current, total, field: path });
      }

      try {
        const isChecked = !(await extractCheckboxValue(
          preprocessedImageUri,
          region,
          imageDims
        ));

        fieldResults.push({
          fieldPath: path,
          value: isChecked ? "checked" : "unchecked",
          confidence: 0.85, // Checkbox detection confidence
          region: scaleRegion(region, imageDims.width, imageDims.height),
          rawOcrResult: { checked: isChecked },
        });

        // Map to data structure
        setFieldValue(data, path, isChecked.toString());
      } catch (error) {
        errors.push(`Failed to extract checkbox ${path}: ${error}`);
        console.error(`Checkbox extraction error (${path}):`, error);
      }
    }

    // 4a. Cross-validate class_division against hazmat database
    // This corrects common OCR digit confusions (e.g., "6" misread as "9")
    if (data.un_number && data.class_division) {
      const correctedClass = correctClassDivisionFromHazmatDb(
        data.un_number,
        data.class_division
      );
      if (correctedClass !== data.class_division) {
        console.log(
          `🔧 [OCR Correction] class_division corrected from "${data.class_division}" to "${correctedClass}" based on UN ${data.un_number}`
        );
        data.class_division = correctedClass;
        // Also update fieldResults for consistency
        const fieldResult = fieldResults.find(
          f => f.fieldPath === "dangerous_goods.class_division"
        );
        if (fieldResult) {
          fieldResult.value = correctedClass;
        }
      }
    }

    // 4. Validate extracted data
    console.log("Validating extracted data...");
    const validationResult = validateFormData(data, fieldResults);

    // Add validation warnings to warnings array
    warnings.push(...validationResult.warnings.map((w: any) => w.message));

    console.log(
      `Validation: ${validationResult.errors.length} errors, ${validationResult.warnings.length} warnings`
    );
    console.log(
      `Overall confidence: ${(validationResult.confidence * 100).toFixed(1)}%`
    );

    // 5. Return results
    return {
      success: errors.length < total * 0.5, // Success if <50% failures
      data,
      fieldResults,
      validation: validationResult,
      errors,
      warnings,
      alignment,
      metadata: {
        formType: template.formType,
        imageWidth: imageDims.width,
        imageHeight: imageDims.height,
        extractionTime: Date.now() - startTime,
        fieldsExtracted: fieldResults.length,
        fieldsFailed: errors.length,
        overallConfidence: validationResult.confidence,
        validationErrors: validationResult.errors.length,
        validationWarnings: validationResult.warnings.length,
        imageRotated: orientationResult.rotated,
        rotationDegrees: orientationResult.rotationDegrees,
        preprocessingUsed: preprocessingConfig.enabled,
        preprocessingTime: preprocessingResult?.metrics.processingTime || 0,
        preprocessingOperations: preprocessingResult?.appliedOperations || [],
        alignmentUsed: alignmentConfig.enabled && alignment?.success === true,
        alignmentOffset: alignment?.offset || { x: 0, y: 0 },
        alignmentConfidence: alignment?.confidence || 0,
      },
    };
  } catch (error) {
    errors.push(`Extraction failed: ${error}`);
    throw error;
  }
}

/**
 * Extract text from a single field region
 */
async function extractFieldValue(
  imageUri: string,
  fieldRegion: FieldRegion,
  imageDims: { width: number; height: number },
  fieldPath: string,
  preprocessingConfig: PreprocessingConfig,
  isCustomTemplate: boolean = false
): Promise<{
  text: string;
  confidence: number;
  scaledRegion: any;
  raw: any;
}> {
  // Scale region from template coordinates to actual image
  const scaledRegion = scaleRegion(
    fieldRegion,
    imageDims.width,
    imageDims.height,
    2550, // Template width (300 DPI)
    3300 // Template height (300 DPI)
  );

  // CRITICAL: When using custom template (user-adjusted regions),
  // DO NOT add padding! User has positioned regions precisely.
  let totalPadding = 0;

  if (!isCustomTemplate) {
    // Only add padding for default template (helps with alignment tolerance)
    let basePadding = preprocessingConfig.parameters.padding.basePadding; // Default: 10px

    // Adaptive padding: small fields get extra padding for alignment tolerance
    const fieldArea = scaledRegion.w * scaledRegion.h;
    const isSmallField = fieldArea < 5000; // Small if < 5000 sq pixels
    const isLargeField = fieldArea > 50000; // Large if > 50000 sq pixels

    let extraPadding = 0;
    if (preprocessingConfig.perRegion.adaptivePadding) {
      if (isSmallField) {
        extraPadding = preprocessingConfig.parameters.padding.smallFieldExtra; // Default: +5px
      } else if (isLargeField) {
        extraPadding = preprocessingConfig.parameters.padding.largeFieldExtra; // Default: 0px
      }
    }

    totalPadding = basePadding + extraPadding;
  }

  // Log extraction details for debugging
  console.log(`🔍 Extracting ${fieldPath}:`);
  console.log(
    `  Custom template: ${
      isCustomTemplate ? "YES (no padding)" : "NO (padding applied)"
    }`
  );
  console.log(
    `  Template coords: x=${fieldRegion.x}, y=${fieldRegion.y}, w=${fieldRegion.w}, h=${fieldRegion.h}`
  );
  console.log(
    `  Scaled coords: x=${scaledRegion.x.toFixed(
      0
    )}, y=${scaledRegion.y.toFixed(0)}, w=${scaledRegion.w.toFixed(
      0
    )}, h=${scaledRegion.h.toFixed(0)}`
  );
  console.log(`  Padding: ${totalPadding}px`);

  // Add padding to region (only if NOT using custom template)
  let paddedRegion = {
    x: Math.max(0, scaledRegion.x - totalPadding),
    y: Math.max(0, scaledRegion.y - totalPadding),
    w: scaledRegion.w + totalPadding * 2,
    h: scaledRegion.h + totalPadding * 2,
  };

  // ML Kit requires minimum 32x32 pixels - enforce this
  const MIN_SIZE = 32;

  if (paddedRegion.w < MIN_SIZE) {
    const expansion = MIN_SIZE - paddedRegion.w;
    paddedRegion.x = Math.max(0, paddedRegion.x - expansion / 2);
    paddedRegion.w = MIN_SIZE;
  }

  if (paddedRegion.h < MIN_SIZE) {
    const expansion = MIN_SIZE - paddedRegion.h;
    paddedRegion.y = Math.max(0, paddedRegion.y - expansion / 2);
    paddedRegion.h = MIN_SIZE;
  }

  // Ensure region doesn't exceed image boundaries
  if (paddedRegion.x + paddedRegion.w > imageDims.width) {
    paddedRegion.w = imageDims.width - paddedRegion.x;
  }
  if (paddedRegion.y + paddedRegion.h > imageDims.height) {
    paddedRegion.h = imageDims.height - paddedRegion.y;
  }

  // Final safety check - if still too small, crop from center of image
  if (paddedRegion.w < MIN_SIZE || paddedRegion.h < MIN_SIZE) {
    console.warn(
      `Region too small after adjustments, using minimum size centered on field`
    );
    paddedRegion = {
      x: Math.max(0, scaledRegion.x - MIN_SIZE / 2),
      y: Math.max(0, scaledRegion.y - MIN_SIZE / 2),
      w: Math.min(MIN_SIZE, imageDims.width),
      h: Math.min(MIN_SIZE, imageDims.height),
    };
  }

  // Crop the region
  let croppedUri = await cropRegion(imageUri, paddedRegion);

  // Apply per-region preprocessing (if enabled)
  if (preprocessingConfig.enabled && preprocessingConfig.perRegion) {
    const regionPreprocessingResult = await preprocessRegion(
      croppedUri,
      fieldRegion.fieldType,
      preprocessingConfig
    );
    croppedUri = regionPreprocessingResult.uri;

    // Log if region preprocessing skipped due to blur
    if (
      regionPreprocessingResult.appliedOperations.includes("blur_detected_skip")
    ) {
      console.warn(`⚠ Skipping OCR for ${fieldPath} - region too blurry`);
      return {
        text: "",
        confidence: 0,
        scaledRegion: paddedRegion,
        raw: { text: "", blocks: [] },
      };
    }
  }

  // Run OCR on the cropped (and preprocessed) region
  const ocrResult = await extractText(croppedUri);

  // Clean up the text (remove extra whitespace, but preserve newlines)
  let cleanedText = ocrResult.text
    .trim()
    .replace(/[ \t]+/g, " ") // Normalize horizontal whitespace (spaces/tabs), preserve newlines
    .replace(/[^\x20-\x7E\n]/g, ""); // Remove non-printable chars except newlines

  // Log final extraction result
  console.log(
    `  Final region (with padding): x=${paddedRegion.x.toFixed(
      0
    )}, y=${paddedRegion.y.toFixed(0)}, w=${paddedRegion.w.toFixed(
      0
    )}, h=${paddedRegion.h.toFixed(0)}`
  );
  console.log(`  Extracted text: "${cleanedText}"`);
  console.log(`  Confidence: ${ocrResult.confidence.toFixed(2)}`);

  return {
    text: cleanedText,
    confidence: ocrResult.confidence,
    scaledRegion: paddedRegion,
    raw: ocrResult,
  };
}

/**
 * Clean field-specific text (remove labels, prefixes, etc.)
 */
function cleanFieldText(fieldPath: string, text: string): string {
  if (!text) return text;

  // Shipper: Remove "SHIPPER" label
  if (fieldPath === "shipper") {
    text = text.replace(/^SHIPPER\s*/i, "");
    text = text.trim();
  }

  // Consignee: Remove "CONSIGNEE" label
  if (fieldPath === "consignee") {
    text = text.replace(/^CONSIGNEE\s*/i, "");
    text = text.trim();
  }

  // Inspector: Remove "INSPECTOR" label
  if (fieldPath === "inspector") {
    text = text.replace(/^INSPECTOR\s*/i, "");
    text = text.replace(/Inspected\s*by\s*:?\s*/gi, "");
    text = text.replace(/\(optional\)/gi, "");
    text = text.trim();
  }

  // AWB Number: If it only contains the label, return empty
  if (fieldPath === "air_waybill.awb_number") {
    if (text.match(/^Air\s*Waybill\s*No\.?$/i)) {
      return "";
    }
    text = text.replace(/^Air\s*Waybill\s*No\.?\s*:?\s*/gi, "");
    text = text.trim();
  }

  // TCN: Remove various label formats
  if (fieldPath === "shipper_reference.tcn") {
    text = text.replace(
      /Shipper'?s?\s*Reference\s*(Number|No\.?)\s*(TCN)?\s*:?\s*/gi,
      ""
    );
    text = text.replace(/SHIPPERS?\s*REFERENCE\s*NUMBER\s*TCN\s*:?\s*/gi, "");
    // Handle misspelling "Relerence" and various apostrophe characters
    text = text.replace(/shipper[''']?s?\s*Rele[rf]ence\s*No\.?\s*:?\s*/gi, "");
    text = text.replace(/TCN\s*:?\s*/gi, "");
    text = text.replace(/\(optional\)/gi, "");
    text = text.trim();
    // TCN values never contain spaces - remove any spaces introduced by OCR
    text = text.replace(/\s+/g, "");
  }

  // Departure Airport: Remove various label formats
  if (fieldPath === "transportation_details.airport_departure") {
    text = text.replace(
      /Airport\s*of\s*Departure\s*(\(optional\))?\s*:?\s*/gi,
      ""
    );
    text = text.replace(
      /Irport\s*of\s*Departure\s*(\(optional\))?\s*:?\s*/gi,
      ""
    );
    text = text.replace(/AIRPORT\s*OF\s*DEPARTURE\s*:?\s*/gi, "");
    text = text.trim();
  }

  // Destination Airport: Remove various label formats (including typo "ARPORT")
  if (fieldPath === "transportation_details.airport_destination") {
    text = text.replace(
      /Airport\s*of\s*Destination\s*(\(optional\))?\s*:?\s*/gi,
      ""
    );
    text = text.replace(
      /Irport\s*of\s*Destination\s*(\(optional\))?\s*:?\s*/gi,
      ""
    );
    text = text.replace(/AIRPORT\s*OF\s*DESTINATION\s*:?\s*/gi, "");
    text = text.replace(/ARPORT\s*OF\s*DESTINATION\s*:?\s*/gi, ""); // Common OCR typo
    text = text.trim();
  }

  // Additional Handling Information: Remove label
  // More robust pattern to handle OCR variations like:
  // "Additional Handing Information", "Additlonal Handling", etc.
  if (fieldPath === "additional_handling") {
    // Pattern handles common OCR errors:
    // - Add[di]t[io]on[ao]l: handles "Additional", "Additlonal", "Addltional"
    // - Hand[li][in][gn]: handles "Handling", "Handing", "Handllng"
    // - Informat[io][on][nm]: handles "Information", "Informatlon", "Informaton"
    text = text.replace(
      /^Add[di]t[io]on[ao]l\s+Hand[li][in][gn]\s+Informat[io][on][nm]\s*:?\s*/gi,
      ""
    );
    // Fallback: original strict pattern
    text = text.replace(/^ADDITIONAL\s*HANDLING\s*INFORMATION\s*:?\s*/gi, "");
    text = text.trim();
  }

  // Name/Title of Signatory: Remove label
  if (fieldPath === "signature_block.name_title") {
    text = text.replace(/^NAME\s*\/?\s*TITLE\s*OF\s*SIGNATORY\s*:?\s*/gi, "");
    text = text.trim();
  }

  // Signature Date: Remove "Date" or "Dale" prefix (OCR sometimes misreads)
  if (fieldPath === "signature_block.signature_date") {
    text = text.replace(/^Da[lt]e\s*:?\s*/i, "");
    text = text.trim();
  }

  // Place and Date: Remove common labels
  if (fieldPath === "signature_block.place_date") {
    text = text.replace(/^PLACE\s*AND\s*DATE\s*:?\s*/gi, "");
    text = text.trim();
  }

  return text;
}

/**
 * Get all text field regions from template (excludes tables)
 */
function getTextFieldRegions(
  template: SDDGTemplate
): Array<{ path: string; region: FieldRegion }> {
  const fields: Array<{ path: string; region: FieldRegion }> = [];

  function traverse(obj: any, path: string = "") {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // If it's a field region, add it
      if (
        value &&
        typeof value === "object" &&
        "fieldType" in value &&
        value.fieldType !== "checkbox"
      ) {
        fields.push({ path: currentPath, region: value as FieldRegion });
      }
      // Otherwise recurse if it's an object
      else if (value && typeof value === "object" && !("fieldType" in value)) {
        traverse(value, currentPath);
      }
    }
  }

  traverse(template.regions);
  return fields;
}

/**
 * Get all checkbox field regions from template
 */
function getCheckboxRegions(
  template: SDDGTemplate
): Array<{ path: string; region: FieldRegion }> {
  const fields: Array<{ path: string; region: FieldRegion }> = [];

  function traverse(obj: any, path: string = "") {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      // If it's a checkbox field region, add it
      if (
        value &&
        typeof value === "object" &&
        "fieldType" in value &&
        value.fieldType === "checkbox"
      ) {
        fields.push({ path: currentPath, region: value as FieldRegion });
      }
      // Otherwise recurse if it's an object
      else if (value && typeof value === "object" && !("fieldType" in value)) {
        traverse(value, currentPath);
      }
    }
  }

  traverse(template.regions);
  return fields;
}

/**
 * Set a value in the data object using a dot-notation path
 * Example: setFieldValue(data, 'shipper.shipper_id', 'ABC123')
 */
function setFieldValue(obj: any, path: string, value: string) {
  // Map template paths to SDDGData field names
  const pathMapping: Record<string, string> = {
    shipper: "shipper",
    consignee: "consignee",
    inspector: "inspector",
    "air_waybill.awb_number": "awb_number",
    "air_waybill.page_info": "page_info",
    "shipper_reference.tcn": "tcn",
    "transportation_details.airport_departure": "airport_departure",
    "transportation_details.airport_destination": "airport_destination",
    "dangerous_goods.un_number": "un_number",
    "dangerous_goods.proper_shipping_name": "proper_shipping_name",
    "dangerous_goods.class_division": "class_division",
    "dangerous_goods.packing_group": "packing_group",
    "dangerous_goods.quantity_packing": "quantity_packing",
    "dangerous_goods.packing_inst": "packing_inst",
    "dangerous_goods.authorization": "authorization",
    "signature_block.name_title": "name_title",
    "signature_block.place_date": "place_date",
    "signature_block.signature_date": "signature_date",
    additional_handling: "additional_handling",
    "emergency_phone.emergency_contact": "emergency_phone",
    "shipment_type.non_radioactive": "non_radioactive",
    "shipment_type.radioactive": "radioactive",
  };

  const mappedKey = pathMapping[path] || path.split(".").pop();
  if (mappedKey) {
    // Convert string "true"/"false" to boolean for checkbox fields
    if (value === "true" || value === "false") {
      obj[mappedKey] = value === "true";
    } else if (value) {
      obj[mappedKey] = value;
    }
  }
}

/**
 * Extract checkbox value (check if marked)
 */
async function extractCheckboxValue(
  imageUri: string,
  fieldRegion: FieldRegion,
  imageDims: { width: number; height: number }
): Promise<boolean> {
  // For checkboxes, we look for marks (X, checkmark, filled)
  // This is complex - for MVP, we can use OCR to detect "X" or look for dark pixels

  const scaledRegion = scaleRegion(
    fieldRegion,
    imageDims.width,
    imageDims.height
  );
  const croppedUri = await cropRegion(imageUri, scaledRegion);
  const ocrResult = await extractText(croppedUri);

  // Simple heuristic: if OCR finds X or check-like text, it's checked
  const text = ocrResult.text.toLowerCase().trim();
  return text.includes("x") || text.includes("✓") || text.includes("✔");
}

/**
 * Corrects class_division OCR errors by validating against the hazmat database
 *
 * Common OCR confusions for single digits:
 * - "6" ↔ "9" (upside down)
 * - "0" ↔ "8" (similar shapes)
 * - "1" ↔ "7" (depending on font)
 *
 * If the extracted value doesn't match the expected value but could be
 * an OCR confusion, we trust the hazmat database.
 */
function correctClassDivisionFromHazmatDb(
  unNumber: string,
  extractedClass: string
): string {
  if (!unNumber || !extractedClass) return extractedClass;

  // Normalize UN number (handle with/without "UN" prefix)
  const normalizedUn = unNumber.toUpperCase().startsWith("UN")
    ? unNumber.toUpperCase()
    : `UN${unNumber.toUpperCase()}`;

  // Look up in hazmat database
  const material = hazardousMaterialsList.find(
    item => item.unid && item.unid.toUpperCase() === normalizedUn
  );

  if (!material || !material.hazclassDiv) {
    return extractedClass; // Can't validate, keep original
  }

  const expectedClass = material.hazclassDiv.trim();
  const actualClass = extractedClass.trim();

  // If they already match, no correction needed
  if (actualClass === expectedClass) {
    return extractedClass;
  }

  // Define common OCR digit confusions
  const ocrConfusions: Record<string, string[]> = {
    "6": ["9"],
    "9": ["6"],
    "0": ["8", "O"],
    "8": ["0", "B"],
    "1": ["7", "I", "l"],
    "7": ["1"],
  };

  // Check if the mismatch could be an OCR confusion
  // For class/division like "9", "2.1", "6.1", etc.
  const actualPrimary = actualClass.split(".")[0];
  const expectedPrimary = expectedClass.split(".")[0];

  // If primary class digits could be confused
  if (
    ocrConfusions[actualPrimary]?.includes(expectedPrimary) ||
    ocrConfusions[expectedPrimary]?.includes(actualPrimary)
  ) {
    console.log(
      `🔍 [OCR Correction] Detected likely OCR confusion: extracted "${actualClass}" vs expected "${expectedClass}" for ${normalizedUn}`
    );
    return expectedClass;
  }

  // For subdivision matches (e.g., "6.1" misread as "9.1")
  if (actualClass.includes(".") && expectedClass.includes(".")) {
    const [actualMain, actualSub] = actualClass.split(".");
    const [expectedMain, expectedSub] = expectedClass.split(".");

    if (
      actualSub === expectedSub &&
      (ocrConfusions[actualMain]?.includes(expectedMain) ||
        ocrConfusions[expectedMain]?.includes(actualMain))
    ) {
      console.log(
        `🔍 [OCR Correction] Detected likely OCR confusion in subdivision: extracted "${actualClass}" vs expected "${expectedClass}" for ${normalizedUn}`
      );
      return expectedClass;
    }
  }

  // No recognized confusion pattern - keep original
  // (User will see the mismatch as a recommended frustration)
  return extractedClass;
}
