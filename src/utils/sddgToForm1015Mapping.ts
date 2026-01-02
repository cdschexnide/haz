import { FrustrationRecord, PackageFrustrationRecord } from "@//types/sddg";

// Mapping from SDDG field keys to Form 1015 line item identifiers
export const SDDG_TO_FORM1015_MAPPING: Record<string, string> = {
  // SDDG SHIPPER (Key 1) -> 2. SHIPPER'S ADDRESS AND PHONE NUMBER
  shipper: "2",

  // SDDG CONSIGNEE (Key 2) -> 3. CONSIGNEE DODAAC OR ADDRESS
  consignee: "3",

  // SDDG TCN (Key 5) -> 4. TRANSPORTATION CONTROL NUMBER (TCN)
  shippersReferenceNumber: "4",

  // SDDG AIRPORT OF DEPARTURE (Key 8) AND AIRPORT OF DESTINATION (Key 9) -> 5. AIRPORT OF DEPARTURE AND DESTINATION
  airportOfDeparture: "5",
  airportOfDestination: "5",

  // SDDG NAME/TITLE OF SIGNATORY (Key 20) -> 6. NAME AND TITLE OF PREPARER WITH SIGNATURE
  nameOfSignatory: "6",

  // SDDG PLACE AND DATE (Key 21) -> 7. PLACE AND DATE MATERIAL CERTIFIED
  placeAndDate: "7",

  // SDDG ADDITIONAL HANDLING INFORMATION (Key 19) -> 9. EMERGENCY RESPONSE NUMBER
  additionalHandlingInfo: "9",

  // SDDG AIRCRAFT TYPE (Key 7) -> 11. IDENTIFIES WHETHER PACKED WITHIN PASSENGER OR CARGO AIRCRAFT ONLY
  aircraftType: "11",

  // SDDG SHIPMENT TYPE (Key 10) -> 12. IDENTIFIES RADIOACTIVE OR NONRADIOACTIVE SHIPMENT
  shipmentType: "12",

  // SDDG UN or ID NO. (Key 11) -> 13. IDENTIFICATION NUMBER (UN, ID, NA)
  unIdNo: "13",

  // SDDG PROPER SHIPPING NAME (Key 12) -> 14. PSN (WITH TECHNICAL NAME IF REQUIRED)
  properShippingName: "14",

  // SDDG CLASS or DIVISION (Key 13) -> 15. PRIMARY HAZARD CLASS OR DIVISION
  hazardClass: "15",

  // SDDG SUBSIDIARY RISK (Key 14) -> 16. SUBSIDIARY RISK CLASS OR DIVISION, IF ASSIGNED
  subsidiaryRisk: "16",

  // SDDG PACKING GROUP (Key 15) -> 17. PACKAGING GROUP
  packingGroup: "17",

  // SDDG PACKING INSTRUCTION (Key 17) -> 23. PACKAGING PARAGRAPH (FROM ATTACHMENTS 5-13)
  packingInstruction: "23",
};

// Special case mappings that require content analysis
export interface SpecialMappingRule {
  form1015Id: string;
  checkCondition: (fieldValue: string) => boolean;
  description: string;
}

export const SPECIAL_MAPPINGS: SpecialMappingRule[] = [
  {
    // RQ requirement -> 28. "RQ" IDENTIFIES A PSN AS HAZARDOUS SUBSTANCE
    form1015Id: "28",
    checkCondition: (properShippingName: string) =>
      properShippingName?.toLowerCase().includes("rq") ||
      properShippingName?.toLowerCase().includes("reportable quantity"),
    description: "RQ (Reportable Quantity) designation in Proper Shipping Name",
  },
  {
    // Inhalation hazard -> 30. "INHALATION HAZARD (ZONE)"
    form1015Id: "30",
    checkCondition: (properShippingName: string) =>
      properShippingName?.toLowerCase().includes("inhalation hazard zone"),
    description: "Inhalation Hazard Zone designation in Proper Shipping Name",
  },
];

// Mapping from Package Marking/Label names to Form 1015 line item identifiers
export const PACKAGE_TO_FORM1015_MAPPING: Record<string, string> = {
  // Package markings from evaluateMarkingRequirementsInspector
  "PSN and UN Number": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Military Shipping Label (MSL) or DD Form 1387": "53", // Also maps to general PSN/ID requirement
  "Inhalation Hazard": "30", // Maps to 30. "INHALATION HAZARD (ZONE)"
  "This End Up": "59", // Maps to 59. "ORIENTATION ARROWS"
  "DOT Requirements": "63", // Maps to 63. DOT SPECIAL PERMIT
  "Inside Containers Comply": "62", // Maps to 62. "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"
  "Oxygen Generator": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Biological Substance": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Chemical Kit": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "First Aid Kit": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Machinery PSN UN": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER

  // Package labels from evaluateLabelingRequirements
  "Primary Hazard": "69", // Maps to 69. PRIMARY RISK LABEL
  "Subsidiary Hazard": "71", // Maps to 71. SUBSIDIARY RISK LABELS
  "Cargo Aircraft Only": "72", // Maps to 72. "CARGO AIRCRAFT ONLY" (NOT MANDATORY FOR MOBILITY OPERATIONS)
  "This Way Up": "59", // Maps to 59. "ORIENTATION ARROWS"
  "Keep Away From Heat": "75", // Maps to 75. OTHER
  OXYGEN: "75", // Maps to 75. OTHER
  "TOXIC INHALATION HAZARD": "75", // Maps to 75. OTHER
  TOXIC: "75", // Maps to 75. OTHER
  "Class 6 PG III": "75", // Maps to 75. OTHER
  "INFECTIOUS SUBSTANCE": "75", // Maps to 75. OTHER
  "Package Orientation": "59", // Maps to 59. "ORIENTATION ARROWS"
  "Chemical Kit Primary Hazard": "69", // Maps to 69. PRIMARY RISK LABEL
};

/**
 * Maps SDDG and Package frustrations to Form 1015 line item identifiers
 * @param sddgFrustrations Array of SDDG frustrations
 * @param packageFrustrations Array of package marking/label frustrations
 * @param verificationCopy Current SDDG verification data for special mappings
 * @returns Set of Form 1015 identifiers that should be marked with X
 */
export function mapFrustrationsToForm1015(
  sddgFrustrations: FrustrationRecord[],
  packageFrustrations: PackageFrustrationRecord[],
  verificationCopy: any
): Set<string> {
  const form1015Ids = new Set<string>();

  // Map SDDG frustrations
  sddgFrustrations.forEach(frustration => {
    const form1015Id = SDDG_TO_FORM1015_MAPPING[frustration.key];
    if (form1015Id) {
      form1015Ids.add(form1015Id);
    }
  });

  // Map package frustrations (markings and labels)
  packageFrustrations.forEach(frustration => {
    // Only include frustrated items (missing or incorrect)
    if (
      frustration.verificationStatus === "missing" ||
      frustration.verificationStatus === "incorrect"
    ) {
      const form1015Id = PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel];
      if (form1015Id) {
        form1015Ids.add(form1015Id);
      }
    }
  });

  // Check special mappings based on content
  if (verificationCopy?.properShippingName) {
    SPECIAL_MAPPINGS.forEach(rule => {
      if (rule.checkCondition(verificationCopy.properShippingName)) {
        form1015Ids.add(rule.form1015Id);
      }
    });
  }

  return form1015Ids;
}

/**
 * Maps frustrations to Form 1015 IDs, separating current and resolved frustrations
 * @param sddgFrustrations Current SDDG frustrations (still frustrated)
 * @param packageFrustrations Current package frustrations (still frustrated)
 * @param resolvedSddgFrustrations Resolved SDDG frustrations (passed reinspection)
 * @param resolvedPackageFrustrations Resolved package frustrations (passed reinspection)
 * @param verificationCopy Current SDDG verification data for special mappings
 * @returns Object with currentlyFrustrated and resolved sets of Form 1015 IDs
 */
export function mapFrustrationsToForm1015WithResolved(
  sddgFrustrations: FrustrationRecord[],
  packageFrustrations: PackageFrustrationRecord[],
  resolvedSddgFrustrations: FrustrationRecord[],
  resolvedPackageFrustrations: PackageFrustrationRecord[],
  verificationCopy: any
): { currentlyFrustrated: Set<string>; resolved: Set<string> } {
  // Map current frustrations (regular X)
  const currentlyFrustrated = mapFrustrationsToForm1015(
    sddgFrustrations,
    packageFrustrations,
    verificationCopy
  );

  // Map resolved frustrations (circled X)
  const resolved = new Set<string>();

  // Map resolved SDDG frustrations
  resolvedSddgFrustrations.forEach(frustration => {
    const form1015Id = SDDG_TO_FORM1015_MAPPING[frustration.key];
    if (form1015Id && !currentlyFrustrated.has(form1015Id)) {
      // Only add to resolved if not currently frustrated (current takes precedence)
      resolved.add(form1015Id);
    }
  });

  // Map resolved package frustrations
  resolvedPackageFrustrations.forEach(frustration => {
    if (
      frustration.verificationStatus === "missing" ||
      frustration.verificationStatus === "incorrect"
    ) {
      const form1015Id = PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel];
      if (form1015Id && !currentlyFrustrated.has(form1015Id)) {
        // Only add to resolved if not currently frustrated (current takes precedence)
        resolved.add(form1015Id);
      }
    }
  });

  return { currentlyFrustrated, resolved };
}

// Legacy function for backward compatibility
export function mapSDDGFrustrationsToForm1015(
  frustrations: FrustrationRecord[],
  verificationCopy: any
): Set<string> {
  return mapFrustrationsToForm1015(frustrations, [], verificationCopy);
}

/**
 * Gets the description for a Form 1015 line item that has a frustration
 * @param form1015Id The Form 1015 line identifier (e.g., "2", "14")
 * @param sddgFrustrations Array of SDDG frustrations
 * @param packageFrustrations Array of package frustrations
 * @returns Description of the frustration for this line item
 */
export function getForm1015FrustrationDescription(
  form1015Id: string,
  sddgFrustrations: FrustrationRecord[],
  packageFrustrations: PackageFrustrationRecord[] = []
): string | null {
  // Find the SDDG key that maps to this Form 1015 ID
  const sddgKey = Object.keys(SDDG_TO_FORM1015_MAPPING).find(
    key => SDDG_TO_FORM1015_MAPPING[key] === form1015Id
  );

  if (sddgKey) {
    const frustration = sddgFrustrations.find(f => f.key === sddgKey);
    if (frustration) {
      return frustration.fieldLabel;
    }
  }

  // Find package marking/label that maps to this Form 1015 ID
  const packageKey = Object.keys(PACKAGE_TO_FORM1015_MAPPING).find(
    key => PACKAGE_TO_FORM1015_MAPPING[key] === form1015Id
  );

  if (packageKey) {
    const packageFrustration = packageFrustrations.find(
      f =>
        f.itemLabel === packageKey &&
        (f.verificationStatus === "missing" ||
          f.verificationStatus === "incorrect")
    );
    if (packageFrustration) {
      return `${packageFrustration.itemLabel} (${packageFrustration.verificationStatus})`;
    }
  }

  // Check special mappings
  const specialMapping = SPECIAL_MAPPINGS.find(
    rule => rule.form1015Id === form1015Id
  );
  if (specialMapping) {
    return specialMapping.description;
  }

  return null;
}
