import { AnchorConfig } from "./anchorTypes";

/**
 * SDDG field anchor configurations
 * Defines how to find each field label and extract its value
 */
export const SDDG_ANCHORS: AnchorConfig[] = [
  // === HEADER SECTION ===
  {
    fieldId: "shipper",
    labelPatterns: ["SHIPPER", "Shipper"],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: {
      boundedBy: ["phone_number", "consignee", "air_waybill"],
      direction: "below-and-right"
    },
    postProcessing: ["remove_label_prefix", "trim"]
  },
  {
    fieldId: "phone_number",
    labelPatterns: ["PHONE NUMBER", "Phone Number", "PHONE NO"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right", includeDSN: true }
  },
  {
    fieldId: "consignee",
    labelPatterns: ["CONSIGNEE", "Consignee"],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: {
      boundedBy: ["airport_departure", "aircraft_type", "shipment_type"],
      direction: "below-and-right"
    },
    postProcessing: ["remove_label_prefix", "trim"]
  },
  {
    fieldId: "air_waybill",
    labelPatterns: ["AIR WAYBILL NO", "Air Waybill No", "AIR WAYBILL"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  },
  {
    fieldId: "page_info",
    labelPatterns: ["PAGE 1 OF", "PAGE1 OF"],
    patternType: "inline-pattern",
    // Handle OCR variations: "PAGE 1 OF 1 PAGES", "PAGE1 OF1 PAGES", etc.
    valueRegionRules: { regex: "PAGE\\s*\\d+\\s*OF\\s*\\d+\\s*PAGES?" }
  },
  {
    fieldId: "shipper_reference_tcn",
    labelPatterns: [
      "SHIPPER'S REFERENCE NUMBER",
      "Shipper's Reference Number",
      "SHIPPER'S REFERENCE",
      "Shipper's Reference",
      "TCN"
    ],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" },
    postProcessing: ["remove_tcn_prefix", "remove_spaces"]
  },

  // === TRANSPORTATION SECTION ===
  {
    fieldId: "airport_departure",
    labelPatterns: [
      "AIRPORT OF DEPARTURE",
      "Airport of Departure",
      "Airport of Departure (optional)"
    ],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "airport_destination",
    labelPatterns: [
      "AIRPORT OF DESTINATION",
      "Airport of Destination",
      "Airport of Destination (optional)"
    ],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below", fallback: "right" }
  },
  {
    fieldId: "aircraft_type",
    labelPatterns: [
      "PASSENGER AND CARGO AIRCRAFT",
      "CARGO AIRCRAFT ONLY",
      "CARGO AIRCRAFT",
      "PASSENGER AND\nCARGO AIRCRAFT",
      "CARGO AIRCRAFT\nONLY"
    ],
    patternType: "checkbox-pair",
    valueRegionRules: {
      options: [
        { label: "PASSENGER AND CARGO AIRCRAFT", value: "passenger_and_cargo" },
        { label: "CARGO AIRCRAFT ONLY", value: "cargo_only" },
        { label: "CARGO AIRCRAFT", value: "cargo_only" }
      ]
    }
  },
  {
    fieldId: "shipment_type",
    labelPatterns: [
      "NON-RADIOACTIVE",
      "RADIOACTIVE",
      "NONRADIOACTIVE",
      "NONADIOACTIVE",
      "NON RADIOACTIVE"
    ],
    patternType: "checkbox-pair",
    valueRegionRules: {
      options: [
        { label: "NON-RADIOACTIVE", value: "non_radioactive" },
        { label: "NONRADIOACTIVE", value: "non_radioactive" },
        { label: "RADIOACTIVE", value: "radioactive" }
      ]
    }
  },

  // === DANGEROUS GOODS TABLE ===
  {
    fieldId: "un_number",
    labelPatterns: [
      "UN or ID NO",
      "UN or ID No",
      "UN NO",
      "UN or\nID NO",
      "UN or\nID No",
      "UN\nor\nID\nNo"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 0, rowBoundedBy: ["additional_handling"] },
    postProcessing: ["extract_un_number"]
  },
  {
    fieldId: "proper_shipping_name",
    labelPatterns: [
      "PROPER SHIPPING NAME",
      "Proper Shipping Name"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 1, rowBoundedBy: ["additional_handling"] },
    postProcessing: ["extract_shipping_name"]
  },
  {
    fieldId: "class_division",
    labelPatterns: [
      "CLASS or DIVISION",
      "Class or Division",
      "CLASS OR DIVISION",
      "CLASS or",
      "DIVISION",
      "CLASS or DIVISION\n(SUBSIDIARY RISK)",
      "Class or Division\n(subsidiary hazard)",
      "SUBSIDIARY RISK"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 2, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "packing_group",
    labelPatterns: [
      "PACKING GROUP",
      "Packing Group",
      "PACKING\nGROUP",
      "Pack-\ning\nGroup",
      "GROUP"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 3, rowBoundedBy: ["additional_handling"] },
    postProcessing: ["validate_packing_group"]
  },
  {
    fieldId: "quantity_type_packing",
    labelPatterns: [
      "QUANTITY AND TYPE OF PACKING",
      "Quantity and Type of Packing",
      "QUANTITY AND\nTYPE of PACKING",
      "QUANTITY AND TYPE\nof PACKING",
      "Quantity and type of packing",
      "QUANTITYAND",
      "QUANTITY AND",
      "TYPE of PACKING"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 4, rowBoundedBy: ["additional_handling"] },
    postProcessing: ["clean_quantity"]
  },
  {
    fieldId: "packing_inst",
    labelPatterns: [
      "PACKING INST",
      "Packing Inst",
      "PACKING\nINST",
      "Packing\nInst",
      "PACKING sNST"
    ],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 5, rowBoundedBy: ["additional_handling"] }
  },
  {
    fieldId: "authorization",
    labelPatterns: ["AUTHORIZATION", "Authorization"],
    patternType: "table-column-header",
    valueRegionRules: { columnIndex: 6, rowBoundedBy: ["additional_handling"] }
  },

  // === FOOTER SECTION ===
  {
    fieldId: "additional_handling",
    labelPatterns: [
      "ADDITIONAL HANDLING INFORMATION",
      "Additional Handling Information",
      "ADDITIONAL HANDLING",
      "ADOITKONAL HAOLING",
      "HANDLING INFORMATION"
    ],
    patternType: "label-top-left-value-fills-box",
    valueRegionRules: {
      boundedBy: ["emergency_telephone", "name_title_signatory"],
      direction: "below-and-right"
    },
    postProcessing: ["remove_label_prefix"]
  },
  {
    fieldId: "emergency_telephone",
    labelPatterns: [
      "EMERGENCY TELEPHONE NUMBER",
      "Emergency Telephone Number",
      "EMERGENCY TELEPHONE",
      "EMERGENCY CONTACT"
    ],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  },
  {
    fieldId: "name_title_signatory",
    labelPatterns: [
      "NAME/TITLE OF SIGNATORY",
      "Name/Title of Signatory",
      "NAME OF SIGNATORY",
      "Name of Signatory"
    ],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "place_date",
    labelPatterns: [
      "PLACE AND DATE",
      "Place and Date"
    ],
    patternType: "label-top-value-bottom",
    valueRegionRules: { direction: "below" }
  },
  {
    fieldId: "signature",
    labelPatterns: ["SIGNATURE", "Signature"],
    patternType: "label-left-value-right",
    valueRegionRules: { direction: "right" }
  }
];

/**
 * Get anchor config by fieldId
 */
export function getAnchorConfig(fieldId: string): AnchorConfig | undefined {
  return SDDG_ANCHORS.find(a => a.fieldId === fieldId);
}

/**
 * Get all table column anchors sorted by columnIndex
 */
export function getTableColumnAnchors(): AnchorConfig[] {
  return SDDG_ANCHORS
    .filter(a => a.patternType === "table-column-header")
    .sort((a, b) => (a.valueRegionRules.columnIndex ?? 0) - (b.valueRegionRules.columnIndex ?? 0));
}
