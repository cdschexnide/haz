/**
 * Unified Packaging Structure Types
 * Based on AFMAN24-604 restructuring synthesis proposal
 * Phase 1, Week 1 - Core Type Definitions
 */

// ============================================================================
// CORE PACKAGING ENTRY TYPES
// ============================================================================

export interface PackagingParagraphEntry {
  // Metadata
  paragraphId: string;
  hazardClass: number;
  subclass?: string[];
  description: string;
  lastUpdated: string;
  title?: string;
  materials?: string[];
  hazardClasses?: number[];
  // Classification
  entryType: 'standard' | 'specialized' | 'equipment' | 'exception' | 'aviation_specialized';
  materialTypes?: string[];
  applicableUNNumbers?: string[];

  // Core packaging data
  packagingOptions: PackagingOption[];

  // Restrictions and requirements
  packingGroupRestrictions?: PackingGroupRestriction[];
  specialRequirements?: SpecialRequirement[];
  quantityLimits?: QuantityLimit[];

  // Conditional logic
  conditionalRequirements?: ConditionalRequirement[];

  // Cross-references
  referencedParagraphs?: string[];
  referencedTables?: string[];
}

export interface PackagingOption {
  id: string;
  type: 'combination' | 'single' | 'composite_plastic' | 'composite_glass' | 'cylinder' | 'specialized' | 'equipment';
  description: string;

  innerPackaging?: InnerPackaging;
  intermediatePackaging?: IntermediatePackaging;
  outerPackaging: OuterPackaging;

  restrictions?: string[];
  notes?: string[];
  quantityLimits?: QuantityLimit[];
  isComplete?: boolean;
}

export interface InnerPackaging {
  required: boolean;
  materials?: string[];
  receptacleTypes?: string[];
  maxCapacity?: QuantityValue;
  specialRequirements?: string[];
  description?: string;
}

export interface IntermediatePackaging {
  required: boolean;
  description: string;
  materials?: string[];
  maxQuantity?: number;
  maxCapacity?: QuantityValue;
  closureRequirements?: string[];
  specialRequirements?: string[];
}

export interface OuterPackaging {
  required?: boolean;
  categories: PackagingCategory[];
}

export interface PackagingCategory {
  // type: 'drums' | 'boxes' | 'jerricans' | 'barrels' | 'cylinders' | 'specialized' | 'bags' | 'composite' | 'large_packagings' | "composite_drum" | "composite_box" | "composite_plastic_packaging" | "equipment" | "protective_packaging" | "composite_plywood" | "strong_packaging" | "non_specification_packaging" | "unpackaged_or_pallets" | "specialized_containers" |"vehicle_transport" | "fuel_limited_transport" | "vehicle_with_accessories" | "unpackaged_transport" | "equipment_transport" | "wheelchair_transport" | "wheelchair_upright_transport" | "lithium_equipment_transport" | "strong_packaging_large_battery" | "large_packaging" | "suitable_outer_packaging" | "equipment_protection" | "vehicle_equipment_transport" | "airdrop_transport" | "pg_ii_performance_packaging" | "combined_equipment_packaging" | "large_packaging_equipment" | "airdrop_mission_packaging" | "pressure_release_packaging" | "medical_shipping_packaging" | "non_hazardous_shipping_packaging";
  type: string;
  subtype?: string;
  containers: Container[];
}

export interface Container {
  code: string;
  material: string;
  description: string;
  headType?: 'tight' | 'removable';
  restrictions?: PackingGroupRestriction[];
  specifications?: ContainerSpecification[];
}

// ============================================================================
// SUPPORTING VALUE TYPES
// ============================================================================

export interface QuantityValue {
  value: number;
  unit: 'kg' | 'L' | 'g' | 'ml' | 'pieces' | 'compartments';
}

type Scope = 'per_inner' | 'per_intermediate' | 'per_outer' | 'per_package' | 'per_aircraft' | 'per_box' | 'per_drum';

export interface QuantityLimit {
  scope: Scope | string;
  value: number | string;
  unit: 'kg' | 'L' | 'g' | 'ml' | 'pieces' | 'compartments' | 'percent' | "tank_fraction" | "cartridges" | "m" | "degrees_celsius" | "mm";
  conditions?: string[];
  description?: string;
  packingGroup?: "I" | "II" | "III";
}

export interface SpecialRequirement {
  type: 'temperature_control' | 'closure_type' | 'testing' | 'handling' | 'compatibility' |
        'orientation' | 'wetting' | 'quantity_control' | 'cushioning' | 'static_prevention' |
        'compartment_separation' | 'moisture_protection' | 'material_compatibility' |
        'lead_free' | 'sift_proof' | 'leakproof_drums' | 'selective_intermediate' |
        'paper_sheets_restriction' | 'pressure_resistant' | 'metal_prohibition' |
        'absorbent_material' | 'closure_security' | 'volume_limits' | 'mass_limits' |
        'water_oil_resistance' | 'impervious_material' | 'bag_prohibition' | "testing" | string;
  description: string;
  mandatory: boolean;
  applicableContainers?: string[];
}

export interface PackingGroupRestriction {
  packingGroup: 'I' | 'II' | 'III' | 'all';
  restriction?: 'prohibited' | 'required' | 'limited';
  description?: string;
  conditions?: string[];
  restrictions?: string[];
}

export interface ConditionalRequirement {
  condition: string;
  conditionType?: 'packing_group' | 'concentration' | 'temperature' | 'volume' | 'material_state' | 'un_number' | 'energy_capacity' | 'packaging_type' | string;
  operator?: 'equals' | 'greater_than' | 'less_than' | 'in_range' | 'contains' | 'not_equals' | 'not_contains';
  value?: any;
  effect?: 'restrict' | 'require' | 'modify' | 'prohibit' | 'recommend' | "allow" | "except";
  target?: string;
  description?: string;
  requirements?: SpecialRequirement[];
}

// ============================================================================
// SPECIALIZED ENTRY TYPES
// ============================================================================

/**
 * For specialized chemicals (Classes 4, 6, 8)
 * Example: A8.5 (Pyrophoric liquids), A8.6 (Organic peroxides)
 */
export interface SpecializedChemicalEntry extends PackagingParagraphEntry {
  entryType: 'specialized';
  chemicalName: string;
  unNumbers: string[];
  concentrationRanges?: ConcentrationRange[];
  materialCompatibility?: MaterialCompatibility[];
  handlingInstructions: string[];
}

export interface ConcentrationRange {
  min: number;
  max: number;
  unit: '%' | 'ppm' | 'molarity';
  packagingModifications: PackagingOption[];
}

export interface MaterialCompatibility {
  material: string;
  compatible: string[];
  incompatible: string[];
  notes?: string[];
}

/**
 * For equipment/technology (Classes 2, 9)
 * Example: A6.7 (Fire extinguishers), A13.7 (Lithium batteries)
 */
export interface EquipmentEntry extends PackagingParagraphEntry {
  entryType: 'equipment';
  equipmentType: string;
  operationalContext?: string[];
  preparationSteps: PreparationStep[];
  energyStorageCapacity?: QuantityValue;
  fuelRequirements?: FuelRequirement[];
}

export interface PreparationStep {
  step: number;
  instruction: string;
  applicableConditions?: string[];
  safetyNotes?: string[];
}

export interface FuelRequirement {
  fuelType: string;
  maxCapacity: QuantityValue;
  restrictions: string[];
}

// ============================================================================
// CONTAINER DATABASE TYPES
// ============================================================================

export interface ContainerDatabase {
  drums: Record<string, DrumSpecification>;
  boxes: Record<string, BoxSpecification>;
  jerricans: Record<string, JerricanSpecification>;
  cylinders: Record<string, CylinderSpecification>;
  specialized: Record<string, SpecializedContainerSpecification>;
}

export interface DrumSpecification {
  code: string;
  material: 'steel' | 'aluminum' | 'plastic' | 'fiber' | 'plywood' | 'other_metal';
  headType: 'tight' | 'removable';
  standardCapacities: number[];
  materialCompatibility: string[];
  restrictions: string[];
}

export interface BoxSpecification {
  code: string;
  material: 'steel' | 'aluminum' | 'wooden' | 'plywood' | 'fiberboard' | 'plastic';
  standardCapacities: number[];
  materialCompatibility: string[];
  restrictions: string[];
}

export interface JerricanSpecification {
  code: string;
  material: 'steel' | 'aluminum' | 'plastic';
  headType: 'tight' | 'removable';
  standardCapacities: number[];
  materialCompatibility: string[];
  restrictions: string[];
}

export interface CylinderSpecification {
  code: string;
  material: 'steel' | 'aluminum' | 'composite';
  pressureRating: number;
  standardCapacities: number[];
  gasCompatibility: string[];
  restrictions: string[];
}

export interface SpecializedContainerSpecification {
  code: string;
  containerType: string;
  material: string;
  specialFeatures: string[];
  restrictions: string[];
}

export interface ContainerSpecification {
  property: string;
  value: string | number;
  unit?: string;
  description?: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export interface PackagingContext {
  packingGroup?: 'I' | 'II' | 'III';
  materialState?: 'solid' | 'liquid' | 'gas';
  concentration?: number;
  temperature?: number;
  volume?: number;
  unNumber?: string;
  hazardClass?: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface PackagingSelection {
  packagingOption: PackagingOption;
  selectedContainers: Container[];
  additionalRequirements?: SpecialRequirement[];
}

// ============================================================================
// MIGRATION SUPPORT TYPES
// ============================================================================

export interface MigrationResult {
  success: boolean;
  paragraphId: string;
  originalEntry: any;
  convertedEntry?: PackagingParagraphEntry;
  errors: string[];
  warnings: string[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

// ============================================================================
// LEGACY COMPATIBILITY TYPES
// ============================================================================

/**
 * Legacy types for backward compatibility during migration
 * These will be removed in later phases
 */
export interface LegacyPackagingLookupOutput {
  packagingInstructions: Record<string, any> | null;
}

export interface LegacyConversionContext {
  preserveOriginalStructure: boolean;
  validateAgainstLegacy: boolean;
  migrationPhase: 'phase1' | 'phase2' | 'phase3';
}