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

  // SDDG QUANTITY AND TYPE OF PACKING (Key 16) -> Split into two Form 1015 fields
  // Field 18: NUMBER AND TYPE OF PACKAGES (e.g., "1 Wooden Box (4G)")
  quantityAndPackingType: "18",
  // Field 19: NET QUANTITY PER PACKAGE (e.g., "10 Kg NEW")
  quantityAndPackingQuantity: "19",

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
  // POP Marking frustrations from InspectorPOPMarkingValidationScreen -> Field 54
  "UN Specification Marking": "54", // Maps to 54. UN SPECIFICATION PACKAGE MARKING
  "Packaging Code (Field B)": "54", // Maps to 54. UN SPECIFICATION PACKAGE MARKING
  "Packing Group (Field C)": "54", // Maps to 54. UN SPECIFICATION PACKAGE MARKING

  // Package markings from evaluateMarkingRequirementsInspector
  "PSN and UN Number": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Military Shipping Label (MSL) or DD Form 1387": "75", // Maps to 75. OTHER (Labeling section)
  "Inhalation Hazard": "30", // Maps to 30. "INHALATION HAZARD (ZONE)"
  "This End Up": "59", // Maps to 59. "ORIENTATION ARROWS"
  "DOT Requirements": "63", // Maps to 63. DOT SPECIAL PERMIT
  "Inside Containers Comply": "62", // Maps to 62. "INSIDE CONTAINERS COMPLY WITH PRESCRIBED SPECIFICATIONS"
  "Oxygen Generator": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Biological Substance": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Chemical Kit": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "First Aid Kit": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Machinery PSN UN": "53", // Maps to 53. PSN AND IDENTIFICATION NUMBER
  "Limited Quantity Marking": "60", // Maps to 60. LIMITED QUANTITY IDENTIFIED
  "Limited Quantity": "60", // Maps to 60. LIMITED QUANTITY IDENTIFIED
  "Excepted Quantity Marking": "68", // Maps to 68. OTHER (Marking)
  "Package does not match Key 16 of SDDG": "40", // Maps to 40. OTHER (Outer Packaging)

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
  "Package Orientation Labels (applied to opposite vertical sides)": "59", // Maps to 59. "ORIENTATION ARROWS" (UN3363)
  "Orientation (This Side Up with Arrows)": "59", // Maps to 59. "ORIENTATION ARROWS" (UN0247 - Class 1 liquid requiring both THIS SIDE UP and orientation arrows)
  "Chemical Kit Primary Hazard": "69", // Maps to 69. PRIMARY RISK LABEL
  "Cylinder Type Not Authorized": "39", // Maps to 39. CYLINDER TYPE

  // UN3166 fuel-powered vehicle inspection (A13.4)
  "Vehicle prepared per service/technical manual": "86",
  "Fuel tank not over 1/2 full (unless exception applies)": "77",
  "Drain/purge procedures followed (freight container/bulk fuel)": "82",
  "Gaseous fuel systems secured or emptied": "86",
  "Fuel cells protected; correct description used": "86",
  "Battery posts protected and batteries secured upright": "84",
  "Secondary loads certified and authorized": "81",

  // UN3171 battery-powered equipment/vehicle inspection (A13.6)
  "Prepared per service technical manuals": "86",
  "Batteries secured upright in designed holders": "84",
  "Battery terminals protected from short circuit": "84",
  "Original installed equipment securely fastened": "86",
  "No loose hazardous materials in racks or containers": "81",
  "Wheelchair non-spillable battery requirements met": "84",
  "Wheelchair spillable battery requirements met": "84",
  "Lithium batteries secured and protected (if applicable)": "84",
  "Lithium battery testing compliance verified (if applicable)": "86",

  // UN3090/UN3480 lithium batteries inspection (A13.7)
  "Compliance with A3.3.9.2 (except A3.3.9.2.3)": "86",
  "Non-metallic inner packaging fully encloses batteries": "46",
  "Outer packaging meets PG II performance": "41",
  "Heavy batteries secured and protected (over 12 kg)": "86",
  "Large packaging approved (if used)": "41",
  "Segregation restrictions met": "86",

  // UN3091/UN3481/UN3536 lithium batteries contained in equipment (A13.8)
  "Strong outer packaging or equivalent protection": "41",

  // UN1841/UN3334/UN3335 Class 9 general materials inspection (A13.14)
  "Appropriate non-bulk packaging used": "41",
  "Outage provided for liquid packagings": "41",
  "Primary packaging withstands vapor pressure": "41",
  "Water-reactive materials use waterproof packaging": "41",

  // NA2212/UN2212/UN2590 asbestos inspection (A13.16)
  "Exposure control during loading/handling": "86",
  "Packaging meets A3.1 general requirements": "41",
  "Rigid leak-tight drums used (if applicable)": "41",
  "Dust/sift-proof bags palletized or boxed": "41",

  // UN3316 chemical/first aid kit inspection (A13.18)
  "Kit PG and compatibility verified": "86",
  "Limited/excepted quantities compliance": "60",
  "Inner receptacle size limits met": "41",
  "Per kit and per package total limits": "41",
  "Outer packaging protects inner receptacles": "41",
  "Limited quantities table referenced (if applicable)": "60",

  // UN3499/UN3508 capacitors inspection (A13.19)
  "Uninstalled capacitors shipped uncharged": "86",
  "Short circuit protection applied": "84",
  "Pressure/venting requirements met": "86",
  "Energy storage capacity marked": "86",
  "Packaging protects capacitors": "41",
  "Exemptions evaluated (if applicable)": "86",

  // UN3528/UN3529 internal combustion engines/machinery inspection (A13.20)
  "Prepared per service technical manual": "86",
  "Fuel limits met": "82",
  "Drain/purge damaged or inoperable engines": "82",
  "Orientation secured when needed": "41",
  "Freight container procedures followed": "82",
  "Spill risk controls applied": "82",
  "Battery and accessorial hazards controlled": "84",

  // ID8000 consumer commodity inspection (A13.3)
  "Commodity scope and classes allowed": "86",
  "Limited quantity limits met": "60",
  "Strong outer packaging used": "41",
  "Gross mass does not exceed 30 kg": "41",
  "Drop test for brittle inner packagings": "41",
  "Aerosol limits and pressure requirements": "86",
  "Biological/medical aerosol limits": "86",
  "Liquid inner packaging limit": "41",
  "Solid inner packaging limit": "41",

  // UN3548 articles containing miscellaneous dangerous goods (A13.5)
  "Classification and quantity limits verified": "86",
  "Packaged articles meet PG II performance": "41",
  "Articles without inner receptacles secured": "41",
  "Robust articles protected in transport": "41",
  "Movement and short-circuit prevention": "84",
  "Additional batteries packaged per A13.7.2": "41",
  "Correct proper shipping name when packed with equipment": "53",
  "Equipment batteries secured and terminals protected": "84",
  "Airdrop missions handled per A13.8 allowance": "86",

  // UN3091/UN3481 lithium batteries packed with equipment (A13.9)
  "Inner packaging fully encloses cells/batteries": "41",
  "Outer packaging meets PG II performance": "41",
  "Large packaging approved (if used)": "41",
  "Airdrop missions handled per A13.9 allowance": "86",

  // UN1845 dry ice inspection (A13.10)
  "Handling and storage in ventilated areas": "86",
  "No hermetically sealed containers": "41",
  "Authorized vented packaging used": "41",
  "Medical shipment prep verified (if applicable)": "86",
  "Non-hazard shipments with dry ice use vented packaging": "41",

  // UN2807 magnetized material inspection (A13.11)
  "Handling separation from sensitive equipment": "86",
  "Field strength within limits": "86",
  "Blocking and bracing adequate": "41",
  "Protective distance from container exterior": "41",
  "Air eligibility confirmed": "86",

  // UN2990/UN3072 life-saving appliances inspection (A13.12)
  "Handling and storage precautions followed": "86",
  "Weather-resistant strong outer packaging": "41",
  "Inner packaging prevents accidental activation": "46",
  "General packaging requirements met": "41",
  "Individually assigned kits handled per exception (if applicable)": "86",

  // UN3363 dangerous goods in apparatus/machinery inspection (A13.13)
  "Contents limited to authorized types": "86",
  "Contents compatible": "86",
  "Quantity limits met": "86",
  "Receptacles secured and cushioned": "46",
  "Leakage control provided": "47",
  "Class 2.2 gases in authorized cylinders": "39",
  "Strong outer packaging or equivalent protection": "41",

  // Attachment 28 Packaging Inspection criteria
  "Drum Ullage": "41",
  "Inner Receptacle Ullage": "41",
  "External Visual Condition": "37",
  "Inner Receptacle Orientation": "48",
  "Inner Receptacle Secondary Closure": "49",
  "Absorbent and Cushioning Material": "46",
  "Leak-proof Liner": "47",
  "Air-Eligible": "57",
};

/**
 * Gets the Form 1015 field for a package frustration.
 * Handles explicit formField overrides for class2 wizard frustrations.
 * @param frustration The package frustration record
 * @returns The Form 1015 field ID or null if no mapping exists
 */
export function getPackageFrustrationField(
  frustration: PackageFrustrationRecord
): string | null {
  // 1. Check for explicit formField (class2 wizard frustrations)
  if (frustration.formField) {
    return frustration.formField;
  }

  // 2. Check category-based mapping for cylinder-type
  if (frustration.category === "cylinder-type") {
    return "39";
  }

  // 3. Fall back to label-based mapping (existing behavior)
  return PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel] || null;
}

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

  // Map package frustrations (markings, labels, and class2)
  packageFrustrations.forEach(frustration => {
    // Only include frustrated items (missing or incorrect)
    if (
      frustration.verificationStatus === "missing" ||
      frustration.verificationStatus === "incorrect"
    ) {
      const form1015Id = getPackageFrustrationField(frustration);
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
      const form1015Id = getPackageFrustrationField(frustration);
      if (form1015Id && !currentlyFrustrated.has(form1015Id)) {
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
      return packageFrustration.itemLabel;
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
