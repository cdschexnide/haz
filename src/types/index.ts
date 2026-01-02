/**
 * Types Barrel Export
 *
 * Provides a single entry point for specialized type definitions.
 * Import from '@/types' or 'src/types' to access these types.
 *
 * NOTE: Core domain types (Shipment, HazardousMaterial, Inspector, etc.)
 * are defined in the root-level types.ts file. Import those directly
 * from '../../types' or the appropriate relative path.
 *
 * Usage:
 *   import { ExtractedSDDGContent, InspectorShipment } from '@/types';
 *   import { InnerPackagingInspectionData } from '@/types';
 */

// SDDG Types
export {
  type ExtractedSDDGContent,
  type ReinspectionAttempt,
  type FrustrationRecord,
  type InspectorMagnetizedMaterialData,
  type PackagePopMarking,
  type SDDGInspectionContext,
  type InspectionStatus,
  type InspectionItemStatus,
  type InspectorShipment,
  type SDDGFieldDefinition,
  SDDG_FIELD_DEFINITIONS,
  type PackageFrustrationCategory,
  type PackageFrustrationRecord,
} from "./sddg";

// SDDG Template Types
export {
  type Region,
  type FieldRegion,
  type TableColumn,
  type TableRegion,
  type FormIdentifier,
  type SDDGTemplate,
  type DangerousGood,
  type SDDGData,
  type ExtractionResult,
  type AnchorPoint,
  type DetectedAnchor,
  type TemplateAlignment,
  type AlignmentConfig,
} from "./sddg-template";

// Inner Packaging Types
export {
  type ContainerType,
  type InnerPackagingInspectionItem,
  type InnerPackagingInspectionData,
} from "./innerPackaging";

// Dry Ice Inspection Types
export {
  type AircraftType,
  type DryIceShipmentData,
  type InspectionCategory,
  type VerificationStatus,
  type DryIceInspectionItem,
  type DryIceFrustrationRecord,
  type DryIceInspectionContext,
} from "./dryIceInspection";

// Packaging Structure Types
export {
  type PackagingParagraphEntry,
  type PackagingOption,
  type InnerPackaging,
  type IntermediatePackaging,
  type OuterPackaging,
  type PackagingCategory,
  type Container,
  type QuantityValue,
  type QuantityLimit,
  type SpecialRequirement,
  type PackingGroupRestriction,
  type ConditionalRequirement,
  type SpecializedChemicalEntry,
  type ConcentrationRange,
  type MaterialCompatibility,
  type EquipmentEntry,
  type PreparationStep,
  type FuelRequirement,
  type ContainerDatabase,
  type DrumSpecification,
  type BoxSpecification,
  type JerricanSpecification,
  type CylinderSpecification,
  type SpecializedContainerSpecification,
  type ContainerSpecification,
  type PackagingContext,
  type ValidationResult,
  type PackagingSelection,
  type MigrationResult,
  type ValidationError,
  type LegacyPackagingLookupOutput,
  type LegacyConversionContext,
} from "./packagingStructure";
