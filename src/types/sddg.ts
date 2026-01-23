import { Inspector, ExceptedQuantityData, LimitedQuantityData } from "../../types";
import { InnerPackagingInspectionData } from "./innerPackaging";
import type { AggregatedAnalysis } from "@/ml/types/ocr";

// SDDG Form Data Types
export interface ExtractedSDDGContent {
  shipper: string; // Key 1
  consignee: string; // Key 2
  airWaybillNumber: string; // Key 3
  pagination: string; // Key 4
  shippersReferenceNumber: string; // Key 5 (TCN)
  inspectionActivity: string; // Key 6
  aircraftType: string; // Key 7
  airportOfDeparture: string; // Key 8
  airportOfDestination: string; // Key 9
  shipmentType: string; // Key 10
  unIdNo: string; // Key 11
  properShippingName: string; // Key 12
  hazardClass: string; // Key 13
  subsidiaryRisk: string; // Key 14
  packingGroup: string; // Key 15
  quantityAndPacking: string; // Key 16
  packingInstruction: string; // Key 17
  authorization: string; // Key 18
  additionalHandlingInfo: string; // Key 19
  nameOfSignatory: string; // Key 20
  placeAndDate: string; // Key 21
  signature: string; // Key 22
}

// Reinspection attempt tracking
export interface ReinspectionAttempt {
  date: Date; // When reinspection occurred
  inspector: string; // Inspector who performed reinspection
  action: "verified" | "frustrated"; // Outcome of reinspection
  additionalComments?: string; // Optional comments about reinspection
}

// Frustration record for compliance validation
export interface FrustrationRecord {
  key: string; // Field key (e.g., 'shipper', 'consignee')
  fieldLabel: string; // Human-readable field name
  fieldValue: string; // The actual value being frustrated (incorrect value)
  correctValue?: string; // The correct value that should be present
  frustrationDate: Date; // When the frustration was recorded
  defaultMessage: string; // Standard frustration message
  additionalComments?: string; // Optional inspector comments
  inspector: Inspector;
  reinspectionHistory?: ReinspectionAttempt[]; // Track all reinspection attempts
}

enum MagnetizedMaterialInspectionItemResult {
  PASS = "PASS",
  FAIL = "FAIL",
  NOT_APPLICABLE = "NOT APPLICABLE",
}

enum MagnetizedMaterialInspectionComplianceResult {
  COMPLIANT = "COMPLIANT",
  NON_COMPLIANT = "NON COMPLIANT",
}

// Inspector Magnetized Material Data Interface
export interface InspectorMagnetizedMaterialData {
  // Physical Measurements (Inspector performs)
  magneticFieldReading1: number | null;
  magneticFieldReading2: number | null;
  compassDeviationReading1: number | null;
  compassDeviationReading2: number | null;
  measuringDevice1: string;
  measuringDevice2: string;

  // Visual Inspections (Pass/Fail/Not Applicable)
  shieldingPresent: MagnetizedMaterialInspectionItemResult | null;
  blockingBracingAdequate: MagnetizedMaterialInspectionItemResult | null;
  protectiveDistanceMaintained: MagnetizedMaterialInspectionItemResult | null;

  // Documentation Review
  outerPackagingDescription: string;
  packageWeight?: number;
  packageDimensions?: string;

  // Compliance Assessment
  overallCompliance: MagnetizedMaterialInspectionComplianceResult | null;
  frustrationReasons: string[];
  inspectorNotes: string;
}

// Package POP (Proof of Packaging) Marking Data
export interface PackagePopMarking {
  B: string; // Packaging code for outer packaging
  C: string; // Packing Group (X, Y, or Z)
  D: string; // Relative Density (liquid) or Maximum Gross Mass (solid)
  E: string; // Test Pressure (liquids) or "S" (solids/inner packagings)
  F: string; // Year of manufacture (2 digits)
  G: string; // State (Country) Authorizing Mark
  H: string; // Symbol of Manufacturer/Certifier
}

// Inspector labeling context for A15 edge cases
export interface LabelingContext {
  isUnenclosedEngineOrMachinery?: boolean;
  isVehicleUN3166WithNoLabelsRequired?: boolean;
  class1CompatibilityGroupLetter?: string;
  isRecoilMechanismOrArtilleryMount?: boolean;
  hasDiv42LabelApplied?: boolean;
  isCorrosiveOnlyForClass8With6_1?: boolean;
}

export interface KitInspectionItem {
  unid: string;
  properShippingName: string;
  hazardClass: string;
  subsidiaryRisk?: string;
}

export interface KitInspectionData {
  kitType: "CHEMICAL KIT" | "FIRST AID KIT";
  contents: KitInspectionItem[];
}

// SDDG Compliance Validation State
export interface SDDGInspectionContext {
  extractedContent: ExtractedSDDGContent | null;
  verificationCopy: ExtractedSDDGContent | null; // Post-verification copy with user corrections
  originalImageUri: string | null;
  frustrations: FrustrationRecord[];
  packageFrustrations: PackageFrustrationRecord[]; // Package marking/label frustrations
  resolvedFrustrations: FrustrationRecord[]; // Frustrations that passed reinspection
  resolvedPackageFrustrations: PackageFrustrationRecord[]; // Package frustrations that passed reinspection
  magnetizedMaterialInspection: InspectorMagnetizedMaterialData | null; // UN2807 specific inspection
  innerPackagingInspection: InnerPackagingInspectionData | null; // Combination packaging inner inspection
  kitInspectionData?: KitInspectionData | null; // UN3316 kit contents for labeling
  packagePopMarking: PackagePopMarking | null; // POP marking data entry
  labelingContext?: LabelingContext | null;
  mlAnalysisResults: AggregatedAnalysis | null; // ML detection + OCR analysis results
  quantityType?: "standard" | "excepted" | "limited";
  exceptedQuantityData?: ExceptedQuantityData | null;
  limitedQuantityData?: LimitedQuantityData | null;
  packagePackagingType?: "single" | "combination" | "composite" | null;
  inspector: {
    inspectorName: string;
    inspectorRank: string | null;
    inspectorTitle: string;
  };
  inspectionStartTime: Date | null;
  inspectionCompleteTime: Date | null;
}

// Inspector Shipment Management
export type InspectionStatus = "in-progress" | "completed" | "frustrated";
export type InspectionItemStatus = "verified" | "frustrated" | null;

export interface InspectorShipment {
  id: string;
  status: InspectionStatus;
  inspectedAt: Date;
  inspectionContext?: SDDGInspectionContext;
  tcn: string; // From extractedContent.shippersReferenceNumber
  unId: string; // From extractedContent.unIdNo
  properShippingName: string; // From extractedContent.properShippingName
  inspector: Inspector;
  sddgStatus: InspectionItemStatus;
  packageStatus: InspectionItemStatus;
  totalFrustrations: number;
  sddgFrustrations: number;
  packageFrustrations: number;
}

// Field definition for the wizard
export interface SDDGFieldDefinition {
  key: keyof ExtractedSDDGContent;
  label: string;
  isRequired: boolean;
}

// SDDG field definitions matching the form structure
export const SDDG_FIELD_DEFINITIONS: SDDGFieldDefinition[] = [
  { key: "shipper", label: "SHIPPER (Key 1)", isRequired: true },
  { key: "consignee", label: "CONSIGNEE (Key 2)", isRequired: true },
  {
    key: "airWaybillNumber",
    label: "AIRWAY BILL NO. (Key 3)",
    isRequired: false,
  },
  { key: "pagination", label: "PAGES (Key 4)", isRequired: false },
  { key: "shippersReferenceNumber", label: "TCN (Key 5)", isRequired: true },
  {
    key: "inspectionActivity",
    label: "INSPECTION ACTIVITY (Key 6)",
    isRequired: false,
  },
  { key: "aircraftType", label: "AIRCRAFT TYPE (Key 7)", isRequired: true },
  {
    key: "airportOfDeparture",
    label: "AIRPORT OF DEPARTURE (Key 8)",
    isRequired: true,
  },
  {
    key: "airportOfDestination",
    label: "AIRPORT OF DESTINATION (Key 9)",
    isRequired: true,
  },
  { key: "shipmentType", label: "SHIPMENT TYPE (Key 10)", isRequired: true },
  { key: "unIdNo", label: "UN or ID NO. (Key 11)", isRequired: true },
  {
    key: "properShippingName",
    label: "PROPER SHIPPING NAME (Key 12)",
    isRequired: true,
  },
  { key: "hazardClass", label: "CLASS or DIVISION (Key 13)", isRequired: true },
  {
    key: "subsidiaryRisk",
    label: "SUBSIDIARY RISK (Key 14)",
    isRequired: false,
  },
  { key: "packingGroup", label: "PACKING GROUP (Key 15)", isRequired: false },
  {
    key: "quantityAndPacking",
    label: "QUANTITY AND TYPE OF PACKING (Key 16)",
    isRequired: true,
  },
  {
    key: "packingInstruction",
    label: "PACKING INSTRUCTION (Key 17)",
    isRequired: true,
  },
  { key: "authorization", label: "AUTHORIZATION (Key 18)", isRequired: false },
  {
    key: "additionalHandlingInfo",
    label: "ADDITIONAL HANDLING INFORMATION (Key 19)",
    isRequired: true,
  },
  {
    key: "nameOfSignatory",
    label: "NAME/TITLE OF SIGNATORY (Key 20)",
    isRequired: true,
  },
  { key: "placeAndDate", label: "PLACE AND DATE (Key 21)", isRequired: true },
  { key: "signature", label: "SIGNATURE (Key 22)", isRequired: false },
];

// Package Frustration Types
export type PackageFrustrationCategory =
  | "marking"
  | "label"
  | "packaging"
  | "dryice"
  | "magnetized"
  | "cylinder-type"
  | "class2"
  | "gmo"
  | "life-saving"
  | "safety-device"
  | "battery-vehicle"
  | "fuel-powered-vehicle"
  | "capacitor"
  | "engines-internal-combustion"
  | "first-aid-chemical-kit"
  | "lithium_battery"
  | "lithium_battery_contained"
  | "lithium_battery_packed"
  | "dangerous-goods-apparatus"
  | "class9-general"
  | "asbestos"
  | "consumer-commodity"
  | "misc-dangerous-goods-articles"
  | "inner-packaging";

export interface PackageFrustrationRecord {
  id: string;
  category: PackageFrustrationCategory; // 'marking', 'label', or 'dryice'
  itemId: string; // ID of the marking or label being frustrated
  itemLabel: string; // Human-readable name of the item
  expectedValues: string[]; // What should be present
  verificationStatus: "missing" | "incorrect"; // Status that triggered frustration
  frustrationDate: Date; // When the frustration was recorded
  defaultMessage: string; // Standard frustration message
  additionalComments?: string; // Optional inspector comments
  inspector: Inspector;
  afmanReference?: string; // AFMAN reference if applicable
  reinspectionHistory?: ReinspectionAttempt[]; // Track all reinspection attempts
  formField?: string;
}
