# GraphQL Schema vs Inspector InspectionFormProvider Inconsistencies

**Analysis Date:** 2025-11-05
**GraphQL Schema:** `graphql/schema/schema.graphql`
**TypeScript Source:** `contexts/InspectionFormProvider/` and `types/sddg.ts`, `types/innerPackaging.ts`

## Executive Summary

This document catalogs all inconsistencies between the GraphQL schema and the Inspector's `InspectionFormProvider` state management types. The analysis reveals **12 major inconsistencies** that must be addressed to ensure data consistency between the TypeScript application layer and the GraphQL API layer.

---

## Severity Classification

- **CRITICAL**: Completely missing types/fields that will cause runtime errors
- **MAJOR**: Missing fields that cause data loss or functional degradation
- **MODERATE**: Type mismatches that could cause validation errors

---

## CRITICAL Inconsistencies (Blocking Issues)

### 1. Missing Type: `InspectorShipmentMetadata`

**Location:** Referenced in Query return type (schema.graphql:163) but not defined

**TypeScript Definition:** `types/sddg.ts:133-146`
```typescript
export interface InspectorShipmentMetadata {
  id: string;
  status: InspectionStatus;
  inspectedAt: string; // ISO string for serialization
  tcn: string;
  unId: string;
  properShippingName: string;
  inspector: string;
  sddgStatus: InspectionItemStatus;
  packageStatus: InspectionItemStatus;
  totalFrustrations: number;
  sddgFrustrations: number;
  packageFrustrations: number;
}
```

**GraphQL:** Type definition completely missing

**Impact:** Query `inspectorShipments` cannot return data. This is a blocking issue for listing inspections.

**Required Action:** Create complete `InspectorShipmentMetadata` GraphQL type with all fields.

---

### 2. Missing Type: `InnerPackagingInspectionData`

**Location:** Used in `SDDGInspectionContext.innerPackagingInspection`

**TypeScript Definition:** `types/innerPackaging.ts:46-76`
```typescript
export interface InnerPackagingInspectionData {
  hasInnerPackaging: boolean | null;
  containerType: ContainerType;
  inspectionItems: InnerPackagingInspectionItem[];
  openedAt: Date | null;
  inspectedAt: Date | null;
  closedAt: Date | null;
  newCertificationRequired: boolean;
  reclosureMethod: string;
  inspectorNotes: string;
  overallStatus: 'compliant' | 'non-compliant' | 'pending' | null;
}
```

**GraphQL:** Type does not exist in schema

**Impact:** Cannot store/retrieve inner packaging inspection data for combination packaging inspections (AFMAN 24-604, Attachment 28). This is a critical compliance feature.

**Required Action:** Create complete `InnerPackagingInspectionData` GraphQL type with all fields and proper Record wrappers.

---

### 3. Missing Type: `InnerPackagingInspectionItem`

**Location:** Used in `InnerPackagingInspectionData.inspectionItems`

**TypeScript Definition:** `types/innerPackaging.ts:25-40`
```typescript
export interface InnerPackagingInspectionItem {
  id: string;
  label: string;
  status: 'pass' | 'fail' | 'not-applicable' | 'pending';
  notes?: string;
  afmanReference: string;
}
```

**GraphQL:** Type does not exist in schema

**Impact:** Cannot store individual inspection checklist items for inner packaging compliance.

**Required Action:** Create `InnerPackagingInspectionItem` GraphQL type with Record wrappers.

---

### 4. Missing Enum: `ContainerType`

**Location:** Used in `InnerPackagingInspectionData.containerType`

**TypeScript Definition:** `types/innerPackaging.ts:12-19`
```typescript
export type ContainerType =
  | 'fiberboard-box'
  | 'wood-box'
  | 'drum'
  | 'overpack'
  | 'jerrican'
  | 'non-specification'
  | null;
```

**GraphQL:** Enum does not exist in schema

**Impact:** Cannot specify container type for inner packaging inspections.

**Required Action:** Create `ContainerType` enum in GraphQL schema.

---

### 5. Missing Field: `SDDGInspectionContext.innerPackagingInspection`

**Location:** `SDDGInspectionContext` type

**TypeScript:** `types/sddg.ts:98`
```typescript
innerPackagingInspection: InnerPackagingInspectionData | null;
```

**GraphQL:** Field does not exist in `SDDGInspectionContext` (schema.graphql:1055-1088)

**Impact:** Cannot persist inner packaging inspection data within inspection context. Data loss for combination packaging inspections.

**Required Action:** Add `innerPackagingInspection` field to GraphQL `SDDGInspectionContext` type.

---

### 6. Missing Field: `SDDGInspectionContext.packagePopMarking`

**Location:** `SDDGInspectionContext` type

**TypeScript:** `types/sddg.ts:99`
```typescript
packagePopMarking: PackagePopMarking | null;
```

**GraphQL:** Field does not exist in `SDDGInspectionContext` (schema.graphql:1055-1088)

**Note:** GraphQL has a `POPMarking` type but it differs from TypeScript `PackagePopMarking` (see inconsistency #11).

**Impact:** Cannot persist Performance Oriented Packaging marking data entered during package inspection.

**Required Action:** Add `packagePopMarking` field to GraphQL `SDDGInspectionContext` type after reconciling with `POPMarking` type (see inconsistency #11).

---

## MAJOR Inconsistencies (Data Loss Potential)

### 7. Missing Field: `FrustrationRecord.correctValue`

**Location:** `FrustrationRecord` type

**TypeScript:** `types/sddg.ts:42`
```typescript
correctValue?: string; // The correct value that should be present
```

**GraphQL:** Field does not exist in `FrustrationRecord` (schema.graphql:556-580)

**Usage in Code:** `InspectionFormProvider.tsx:562-566`
```typescript
// Update verificationCopy with correctValue if it exists
let updatedVerificationCopy = prev.verificationCopy;
if (existingFrustration?.correctValue && prev.verificationCopy) {
  updatedVerificationCopy = {
    ...prev.verificationCopy,
    [key]: existingFrustration.correctValue,
  };
}
```

**Impact:** When a frustration is resolved, the correct value cannot be automatically applied to the `verificationCopy`. Inspectors must manually re-enter correct values. Critical workflow degradation.

**Required Action:** Add `correctValueRecord: StringHazProFrustrationRecordRecord` field to `FrustrationRecord` type.

---

### 8. Missing Field: `SDDGFrustrationInput.correctValue`

**Location:** `SDDGFrustrationInput` input type

**TypeScript:** Inferred from `FrustrationRecord` (types/sddg.ts:42)
```typescript
correctValue?: string;
```

**GraphQL:** Field does not exist in `SDDGFrustrationInput` (schema.graphql:801-816)

**Impact:** When adding a frustration, inspectors cannot provide the correct value upfront. Must be added in a separate step.

**Required Action:** Add `correctValue: String` optional field to `SDDGFrustrationInput`.

---

### 9. Missing Enum Value: `PackageFrustrationCategory.INNER_PACKAGING`

**Location:** `PackageFrustrationCategory` enum

**TypeScript:** `types/sddg.ts:182`
```typescript
export type PackageFrustrationCategory =
  'marking' | 'label' | 'dryice' | 'magnetized' | 'gmo' |
  'life-saving' | 'safety-device' | 'battery-vehicle' | 'capacitor' |
  'engines-internal-combustion' | 'first-aid-chemical-kit' |
  'lithium_battery' | 'dangerous-goods-apparatus' | 'inner-packaging';
```

**GraphQL:** `PackageFrustrationCategory` enum (schema.graphql:74-88) has all values EXCEPT `INNER_PACKAGING`

**Impact:** Cannot create package frustrations for inner packaging inspection failures. This blocks the ability to frustrate combination packaging inspections.

**Required Action:** Add `INNER_PACKAGING` value to `PackageFrustrationCategory` enum.

---

### 10. Type Mismatch: `SDDGInspectionContext.currentInspector`

**Location:** `SDDGInspectionContext.currentInspector` field

**TypeScript:** `types/sddg.ts:100-108`
```typescript
currentInspector: string | {
  inspectorName: string;
  inspectorRank: string | null;
  inspectorTitle: string;
  inspectionPlace?: string | null;
  inspectionDate?: string | null;
  signature?: string | null;
  reinspectionDate?: string | null;
};
```

**GraphQL:** `schema.graphql:1080-1081`
```graphql
"""Current inspector name"""
currentInspectorRecord: StringHazProSDDGInspectionContextRecord!
```

**Impact:** Cannot store structured inspector information including rank, title, inspection place, dates, and signature. Only inspector name string is supported. Loss of audit trail and compliance data.

**Required Action:** Create `Inspector` object type and modify `currentInspector` field to support union type `String | Inspector` OR create separate fields for inspector details.

---

## MODERATE Inconsistencies (Type Mismatches)

### 11. Type Mismatch: `PackagePopMarking` vs `POPMarking`

**Location:** Package POP marking data structure

**TypeScript `PackagePopMarking`:** `types/sddg.ts:77-86`
```typescript
export interface PackagePopMarking {
  B: string; // Packaging code for outer packaging
  C: string; // Packing Group (X, Y, or Z)
  D: string; // Relative Density (liquid) or Maximum Gross Mass (solid)
  E: string; // Test Pressure (liquids) or "S" (solids/inner packagings)
  F: string; // Year of manufacture (2 digits)
  G: string; // State (Country) Authorizing Mark
  H: string; // Symbol of Manufacturer/Certifier
  overpackBeingUsed: boolean;
}
```

**GraphQL `POPMarking`:** `schema.graphql:2172-2205`
```graphql
type POPMarking {
  type: String
  A: String
  B: String
  C: String
  D: String
  E: String
  F: String
  G: String
  H: String
  overpackBeingUsed: Boolean!
  packingGroupOptions: [String!]!
}
```

**Differences:**
- TypeScript has fields **B through H** (7 fields)
- GraphQL has fields **type, A through H** (9 fields) plus `packingGroupOptions` array
- TypeScript is missing `type`, `A`, and `packingGroupOptions` fields
- Different purposes: GraphQL `POPMarking` appears to be for Preparer, TypeScript `PackagePopMarking` is for Inspector

**Impact:** Type confusion between Preparer POP marking (GraphQL) and Inspector package POP marking data entry (TypeScript). The Inspector's `PackagePopMarking` is simpler and focused on verification, not full POP creation.

**Required Action:**
1. Rename GraphQL `POPMarking` to `PreparerPOPMarking` for clarity
2. Create separate `InspectorPackagePopMarking` type matching TypeScript structure
3. Use `InspectorPackagePopMarking` in `SDDGInspectionContext.packagePopMarking`

---

### 12. Type Mismatch: `InspectorMagnetizedMaterialData` compliance fields

**Location:** `InspectorMagnetizedMaterialData` compliance status fields

**TypeScript:** `types/sddg.ts:61-63, 71`
```typescript
shieldingPresent: 'pass' | 'fail' | 'na' | null;
blockingBracingAdequate: 'pass' | 'fail' | null;
protectiveDistanceMaintained: 'pass' | 'fail' | null;
overallCompliance: 'compliant' | 'non_compliant' | null;
```

**GraphQL:** `schema.graphql:870-888` - All use `ComplianceStatus` enum

**GraphQL `ComplianceStatus` enum:** `schema.graphql:142-148`
```graphql
enum ComplianceStatus {
  COMPLIANT
  NON_COMPLIANT
  PASS
  FAIL
  NOT_APPLICABLE
}
```

**Differences:**
- TypeScript uses `'na'` but GraphQL uses `NOT_APPLICABLE`
- TypeScript uses `'compliant'` | `'non_compliant'` but GraphQL uses `COMPLIANT` | `NON_COMPLIANT`
- TypeScript explicitly defines allowed values per field, GraphQL uses same enum for all

**Impact:** Moderate - enum value mapping needed. `'na'` → `NOT_APPLICABLE`, `'compliant'` → `COMPLIANT`, `'non_compliant'` → `NON_COMPLIANT`. May cause validation errors if not handled.

**Required Action:** Update TypeScript types to use consistent naming OR create field-specific enums in GraphQL. Recommend updating TypeScript to match GraphQL enum for consistency.

---

### 13. Missing Input Fields: `SDDGInspectionContextInput`

**Location:** `SDDGInspectionContextInput` input type

**TypeScript `SDDGInspectionContext` has:** `types/sddg.ts:89-111`
- `innerPackagingInspection: InnerPackagingInspectionData | null`
- `packagePopMarking: PackagePopMarking | null`

**GraphQL `SDDGInspectionContextInput`:** `schema.graphql:1163-1178`
- Does NOT have `innerPackagingInspection` field
- Does NOT have `packagePopMarking` field

**Impact:** Cannot create or update inspections with inner packaging or package POP marking data via GraphQL mutations.

**Required Action:** Add both fields to `SDDGInspectionContextInput` after creating their respective input types:
```graphql
innerPackagingInspection: InnerPackagingInspectionDataInput
packagePopMarking: InspectorPackagePopMarkingInput
```

---

## Summary Table

| # | Type | Component | Issue | Severity |
|---|------|-----------|-------|----------|
| 1 | Missing Type | `InspectorShipmentMetadata` | Type completely missing | CRITICAL |
| 2 | Missing Type | `InnerPackagingInspectionData` | Type completely missing | CRITICAL |
| 3 | Missing Type | `InnerPackagingInspectionItem` | Type completely missing | CRITICAL |
| 4 | Missing Enum | `ContainerType` | Enum completely missing | CRITICAL |
| 5 | Missing Field | `SDDGInspectionContext.innerPackagingInspection` | Field not present | CRITICAL |
| 6 | Missing Field | `SDDGInspectionContext.packagePopMarking` | Field not present | CRITICAL |
| 7 | Missing Field | `FrustrationRecord.correctValue` | Field not present | MAJOR |
| 8 | Missing Field | `SDDGFrustrationInput.correctValue` | Field not present | MAJOR |
| 9 | Missing Enum Value | `PackageFrustrationCategory.INNER_PACKAGING` | Enum value missing | MAJOR |
| 10 | Type Mismatch | `SDDGInspectionContext.currentInspector` | String vs Object | MAJOR |
| 11 | Type Mismatch | `PackagePopMarking` vs `POPMarking` | Different structures | MODERATE |
| 12 | Type Mismatch | `InspectorMagnetizedMaterialData` | Enum value differences | MODERATE |
| 13 | Missing Input Fields | `SDDGInspectionContextInput` | Two fields missing | MODERATE |

---

## Recommended Resolution Order

### Phase 1: Critical Blockers (Must Fix)
1. Create `InspectorShipmentMetadata` type
2. Create `ContainerType` enum
3. Create `InnerPackagingInspectionItem` type
4. Create `InnerPackagingInspectionData` type
5. Add `innerPackagingInspection` field to `SDDGInspectionContext`
6. Resolve `PackagePopMarking` vs `POPMarking` confusion and add to `SDDGInspectionContext`

### Phase 2: Data Integrity (Should Fix)
7. Add `correctValue` field to `FrustrationRecord`
8. Add `correctValue` field to `SDDGFrustrationInput`
9. Add `INNER_PACKAGING` to `PackageFrustrationCategory` enum
10. Enhance `currentInspector` to support structured Inspector object

### Phase 3: Type Consistency (Nice to Fix)
11. Standardize `ComplianceStatus` enum values
12. Add missing fields to `SDDGInspectionContextInput`

---

## Notes

- All GraphQL types use the HazProRecord pattern for audit trails, adding `Record` suffix to field names
- TypeScript types access values directly; GraphQL requires `.currentValue` on Record fields
- This creates an impedance mismatch requiring transformation layer in resolvers
- Consider creating TypeScript codegen from GraphQL schema to maintain type consistency

---

## References

- **InspectionFormProvider:** `contexts/InspectionFormProvider/InspectionFormProvider.tsx`
- **Provider Types:** `contexts/InspectionFormProvider/types.ts`
- **SDDG Types:** `types/sddg.ts`
- **Inner Packaging Types:** `types/innerPackaging.ts`
- **GraphQL Schema:** `graphql/schema/schema.graphql`
