import { Inspector } from "../../types";

export type AircraftType =
  | "C17"
  | "C5"
  | "C130H"
  | "C130J"
  | "C130Other"
  | "KC10"
  | "PressurizedGeneric"
  | "NonPressurized"
  | "AMCContract";

export interface DryIceShipmentData {
  weight: number;
  unit: "kg" | "lbs";
  aircraftType: AircraftType;
  airChangesPerHour?: number;
  shipmentId: string;
  preparationDate: string;
  preparer: string;
}

export type InspectionCategory =
  | "Weight"
  | "Packaging"
  | "Safety"
  | "Documentation";
export type VerificationStatus = "unchecked" | "pass" | "fail";

export interface DryIceInspectionItem {
  id: string;
  category: InspectionCategory;
  label: string;
  description: string;
  requirement: string;
  verificationStatus: VerificationStatus;
  isRequired: boolean;
  inspector?: string;
  inspectionDate?: string;
  notes?: string;
}

export interface DryIceFrustrationRecord {
  id: string;
  inspectionItemId: string;
  fieldLabel: string;
  afmanReference: string;
  defaultMessage: string;
  additionalComments: string;
  inspector: string;
  frustrationDate: string;
}

export interface DryIceInspectionContext {
  shipmentData: DryIceShipmentData | null;
  inspectionItems: DryIceInspectionItem[];
  frustrations: DryIceFrustrationRecord[];
  inspector: Inspector;
  inspectionStatus: "pending" | "in_progress" | "completed" | "frustrated";
  calculatedSafeLimit?: number;
  actualWeight?: number;
  actualUnit?: "kg" | "lbs";
}
