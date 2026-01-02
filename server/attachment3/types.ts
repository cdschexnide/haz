import { HazardousMaterialItem } from "../../src/hazardousMaterials/hazardousMaterialsList";

export interface HazardCategory {
  id: string;
  name: string; //
  generalInstructions: string[];
  packagingRequirements: string[];
  exceptions?: string[];
}

export interface HazardousMaterial {
  id: string;
  name: string;
  hazardCategory: HazardCategory;
  specialRequirements?: string[];
}

export type HazardCategoryMap = Map<string, HazardCategory>;
export type MaterialMap = Map<string, HazardousMaterial>;

export interface CheckAirEligibilityInput {
  materialId: string;
  quantity: number;
  aircraftType: string;
  altitudeInFt: number;
}

export interface EligibilityResult {
  isEligible: boolean;
  reason?: string;
}

export type TransportabilityParameters = {
  /* A3.1.2.1.1. Temperature changes (-40 to 65.5 degrees C [-40 to +150 degrees F]) */
  minTemperature: {
    fahrenheit: number;
    celsius: number;
  };
  maxTemperature: {
    fahrenheit: number;
    celsius: number;
  };
  /* A3.1.2.1.2. Pressure changes due to altitude changes (sea level to 3.7 km (12,000 feet)) */
  maxAltitude: {
    kilometers: number;
    feet: number;
  };
  /* A3.1.2.1.3. Pressure changes due to explosive decompression from 3.7 to 15.24 km (12,000 to 50,000 feet). */
  explosiveDecompressionRange: {
    minimum: {
      kilometers: number;
      feet: number;
    };
    maximum: {
      kilometers: number;
      feet: number;
    };
  };
  /* A3.1.2.2. Do not fill a UN specification packaging to a gross mass greater than the
authorized gross mass marked on the packaging. */
  grossMassOfPackage?: number;
  authorizedGrossMassBasedOnPackageMarking?: number;
};

export interface PackagingParameters {
  transportabilityParameters: TransportabilityParameters;
}

export interface HazardousMaterialContext {
  material: HazardousMaterialItem;
  packagingQuantities: PackagingParameters;
}

export interface RequirementCheckResult {
  isApplicable: boolean;
  isCompliant?: boolean;
  requirementId: string;
  reason: string;
}

export interface DocumentNode {
  id: string;
  parentId: string;
  title?: string;
  bodyText?: string;
  childNodeIds?: string[];
  requirement?: (input: HazardousMaterialContext) => RequirementCheckResult;
  answerType?: AnswerType;
}

export enum AnswerType {
  ACKNOWLEDGE = "Acknowledge",
  NUMBER = "Number",
  RANGE = "Range",
}
