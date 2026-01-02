import { SDDGData } from "@/types/sddg-template";

export interface ValidationError {
  field: string;
  value: string;
  rule: string;
  message: string;
  severity: "error" | "warning";
}

export interface ValidationResult {
  isValid: boolean;
  confidence: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  fieldScores: Record<string, number>;
}

/**
 * Validate extracted form data
 */
export function validateFormData(
  data: SDDGData,
  fieldResults: any[]
): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const fieldScores: Record<string, number> = {};

  // Validate shipper fields
  validateShipper(data, errors, warnings, fieldScores);

  // Validate consignee fields
  validateConsignee(data, errors, warnings, fieldScores);

  // Validate inspector field
  validateInspector(data, errors, warnings, fieldScores);

  // Validate air waybill
  validateAirWaybill(data, errors, warnings, fieldScores);

  // Validate transportation details
  validateTransportation(data, errors, warnings, fieldScores);

  // Validate dangerous goods table
  validateDangerousGoods(data, errors, warnings, fieldScores);

  // Validate signature block
  validateSignature(data, errors, warnings, fieldScores);

  // Calculate overall confidence
  const scores = Object.values(fieldScores);
  const avgConfidence =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;

  return {
    isValid: errors.length === 0,
    confidence: avgConfidence,
    errors,
    warnings,
    fieldScores,
  };
}

/**
 * Validate shipper section (single block)
 */
function validateShipper(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // Shipper - required, should contain some text
  if (!data.shipper || data.shipper.trim() === "") {
    errors.push({
      field: "shipper",
      value: data.shipper || "",
      rule: "required",
      message: "Shipper information is required",
      severity: "error",
    });
    scores["shipper"] = 0;
  } else {
    // Basic content validation - should have some minimum length
    if (data.shipper.trim().length < 10) {
      warnings.push({
        field: "shipper",
        value: data.shipper,
        rule: "content_length",
        message: "Shipper information seems incomplete",
        severity: "warning",
      });
      scores["shipper"] = 0.5;
    } else {
      scores["shipper"] = 1.0;
    }
  }
}

/**
 * Validate consignee section (single block)
 */
function validateConsignee(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // Consignee - required, should contain some text
  if (!data.consignee || data.consignee.trim() === "") {
    errors.push({
      field: "consignee",
      value: data.consignee || "",
      rule: "required",
      message: "Consignee information is required",
      severity: "error",
    });
    scores["consignee"] = 0;
  } else {
    // Basic content validation - should have some minimum length
    if (data.consignee.trim().length < 10) {
      warnings.push({
        field: "consignee",
        value: data.consignee,
        rule: "content_length",
        message: "Consignee information seems incomplete",
        severity: "warning",
      });
      scores["consignee"] = 0.5;
    } else {
      scores["consignee"] = 1.0;
    }
  }
}

/**
 * Validate inspector section (single block, optional - often contains handwriting)
 */
function validateInspector(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // Inspector is optional since it often contains handwriting which may not OCR well
  if (!data.inspector || data.inspector.trim() === "") {
    // Not an error, just give a neutral score
    scores["inspector"] = 0.7;
  } else {
    // If we captured something, that's good
    scores["inspector"] = 1.0;
  }
}

/**
 * Validate air waybill
 */
function validateAirWaybill(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // AWB number - required alphanumeric
  if (!data.awb_number || data.awb_number.trim() === "") {
    errors.push({
      field: "awb_number",
      value: data.awb_number || "",
      rule: "required",
      message: "Air Waybill number is required",
      severity: "error",
    });
    scores["awb_number"] = 0;
  } else {
    // AWB format: typically 3 digit airline code + 8 digit serial
    const awbRegex = /^\d{3}-?\d{8}$/;
    if (awbRegex.test(data.awb_number.replace(/\s/g, ""))) {
      scores["awb_number"] = 1.0;
    } else {
      warnings.push({
        field: "awb_number",
        value: data.awb_number,
        rule: "awb_format",
        message: "AWB format may be incorrect (expected: XXX-XXXXXXXX)",
        severity: "warning",
      });
      scores["awb_number"] = 0.7;
    }
  }

  // TCN validation - 17 character alphanumeric
  if (data.tcn) {
    const tcnRegex = /^[A-Z0-9]{17}$/;
    if (!tcnRegex.test(data.tcn)) {
      warnings.push({
        field: "tcn",
        value: data.tcn,
        rule: "tcn_format",
        message: "TCN should be 17 alphanumeric characters",
        severity: "warning",
      });
      scores["tcn"] = 0.5;
    } else {
      scores["tcn"] = 1.0;
    }
  }
}

/**
 * Validate transportation details
 */
function validateTransportation(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // Airport codes - 3 letter IATA codes
  const airportRegex = /^[A-Z]{3}$/;

  if (data.airport_departure) {
    if (!airportRegex.test(data.airport_departure)) {
      warnings.push({
        field: "airport_departure",
        value: data.airport_departure,
        rule: "airport_code",
        message: "Airport code should be 3 letters (e.g., JFK)",
        severity: "warning",
      });
      scores["airport_departure"] = 0.5;
    } else {
      scores["airport_departure"] = 1.0;
    }
  }

  if (data.airport_destination) {
    if (!airportRegex.test(data.airport_destination)) {
      warnings.push({
        field: "airport_destination",
        value: data.airport_destination,
        rule: "airport_code",
        message: "Airport code should be 3 letters (e.g., LAX)",
        severity: "warning",
      });
      scores["airport_destination"] = 0.5;
    } else {
      scores["airport_destination"] = 1.0;
    }
  }
}

/**
 * Validate dangerous goods (single row extraction)
 */
function validateDangerousGoods(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // UN Number - required, format UNXXXX
  if (!data.un_number || data.un_number.trim() === "") {
    errors.push({
      field: "un_number",
      value: data.un_number || "",
      rule: "required",
      message: "UN number is required",
      severity: "error",
    });
    scores["un_number"] = 0;
  } else {
    const unRegex = /^UN\d{4}$/i;
    if (!unRegex.test(data.un_number)) {
      warnings.push({
        field: "un_number",
        value: data.un_number,
        rule: "un_format",
        message: 'UN number format should be UN#### (e.g., UN1263)',
        severity: "warning",
      });
      scores["un_number"] = 0.7;
    } else {
      scores["un_number"] = 1.0;
    }
  }

  // Proper Shipping Name - required
  if (!data.proper_shipping_name || data.proper_shipping_name.trim() === "") {
    errors.push({
      field: "proper_shipping_name",
      value: data.proper_shipping_name || "",
      rule: "required",
      message: "Proper shipping name is required",
      severity: "error",
    });
    scores["proper_shipping_name"] = 0;
  } else {
    scores["proper_shipping_name"] = 1.0;
  }

  // Class/Division - required
  if (!data.class_division || data.class_division.trim() === "") {
    errors.push({
      field: "class_division",
      value: data.class_division || "",
      rule: "required",
      message: "Class/Division is required",
      severity: "error",
    });
    scores["class_division"] = 0;
  } else {
    scores["class_division"] = 1.0;
  }

  // Packing Group - optional, should be I, II, or III if present
  if (data.packing_group && data.packing_group.trim() !== "") {
    const pgRegex = /^I{1,3}$/;
    if (!pgRegex.test(data.packing_group.trim())) {
      warnings.push({
        field: "packing_group",
        value: data.packing_group,
        rule: "packing_group_format",
        message: "Packing group should be I, II, or III",
        severity: "warning",
      });
      scores["packing_group"] = 0.5;
    } else {
      scores["packing_group"] = 1.0;
    }
  } else {
    scores["packing_group"] = 0.7; // Optional field, neutral score if empty
  }

  // Quantity/Packing - not strictly required but recommended
  if (!data.quantity_packing || data.quantity_packing.trim() === "") {
    warnings.push({
      field: "quantity_packing",
      value: data.quantity_packing || "",
      rule: "recommended",
      message: "Quantity and packing information is recommended",
      severity: "warning",
    });
    scores["quantity_packing"] = 0.5;
  } else {
    scores["quantity_packing"] = 1.0;
  }

  // Packing Instructions - optional
  if (data.packing_inst && data.packing_inst.trim() !== "") {
    scores["packing_inst"] = 1.0;
  } else {
    scores["packing_inst"] = 0.7; // Optional field, neutral score if empty
  }

  // Authorization - optional
  if (data.authorization && data.authorization.trim() !== "") {
    scores["authorization"] = 1.0;
  } else {
    scores["authorization"] = 0.7; // Optional field, neutral score if empty
  }
}

/**
 * Validate signature block
 */
function validateSignature(
  data: SDDGData,
  errors: ValidationError[],
  warnings: ValidationError[],
  scores: Record<string, number>
) {
  // Name/Title required
  if (!data.name_title || data.name_title.trim() === "") {
    errors.push({
      field: "name_title",
      value: data.name_title || "",
      rule: "required",
      message: "Name and title are required",
      severity: "error",
    });
    scores["name_title"] = 0;
  } else {
    scores["name_title"] = 1.0;
  }

  // Place required
  if (!data.place_date || data.place_date.trim() === "") {
    warnings.push({
      field: "place_date",
      value: data.place_date || "",
      rule: "required",
      message: "Place is recommended",
      severity: "warning",
    });
    scores["place_date"] = 0.5;
  } else {
    scores["place_date"] = 1.0;
  }

  // Date validation
  if (data.signature_date) {
    // Format: "JAN 15, 2024" or similar
    const dateRegex = /^[A-Z]{3}\s+\d{1,2},\s+\d{4}$/i;
    if (!dateRegex.test(data.signature_date)) {
      warnings.push({
        field: "signature_date",
        value: data.signature_date,
        rule: "date_format",
        message: 'Date format should be "MMM DD, YYYY" (e.g., JAN 15, 2024)',
        severity: "warning",
      });
      scores["signature_date"] = 0.5;
    } else {
      scores["signature_date"] = 1.0;
    }
  }
}
