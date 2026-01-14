# Class 2 Compressed Gases Inspector Wizard Design

**Date:** 2026-01-14
**Status:** Approved
**Author:** Claude Code + User

---

## Overview

Build a Class 2 Compressed Gases inspection wizard component that dynamically loads the appropriate AFMAN 24-604 Attachment 6 checklist based on the SDDG's `packagingParagraph` value.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Checklist selection | `packagingParagraph` from SDDG | Most accurate - SDDG explicitly declares the packaging paragraph |
| Component structure | Single component + data file | Clean separation, maintainable data |
| Unmatched paragraphs | Skip screen entirely | Safe - proceed to next step if no A6.X match |
| Frustration category | `"class2"` | Aligns with hazard class naming |

## File Structure

### Files to Create

```
src/data/class2InspectionChecklists.ts           # Checklist data (27 sections)
src/components/Inspector/InspectorCompressedGasesScreen.tsx  # Wizard component
```

### Files to Modify

```
src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx  # Add routing
[Navigator config file]                                                # Register screen
```

## Data Model

### class2InspectionChecklists.ts

```typescript
export interface InspectionCondition {
  id: string;                    // e.g., "a6.2-gross-weight-limit"
  label: string;                 // e.g., "Package gross weight ≤ 30 kg (66 lbs)"
  description: string;           // Full inspection requirement text
  afmanRef: string;              // e.g., "AFMAN 24-604 A6.2"
}

export interface ChecklistSection {
  paragraphId: string;           // e.g., "A6.2"
  title: string;                 // e.g., "Aerosols"
  description: string;           // Brief section description
  conditions: InspectionCondition[];
}

export const CLASS2_CHECKLISTS: Record<string, ChecklistSection> = {
  "A6.2": { /* Aerosols */ },
  "A6.3": { /* Small Receptacles Containing Compressed Gas */ },
  // ... A6.4 through A6.28
};
```

### Checklist Sections (from Attachment 6)

| Paragraph | Title | Approx. Conditions |
|-----------|-------|-------------------|
| A6.2 | Aerosols | 12 |
| A6.3 | Small Receptacles Containing Compressed Gas | 11 |
| A6.4 | Liquefied Compressed Gases | 12 |
| A6.5 | Nonliquefied Compressed Gases | 12 |
| A6.6 | Liquefied Petroleum Gas | 8 |
| A6.7 | Fire Extinguishers | 12 |
| A6.8 | Refrigerating Machines, Air Conditioners | 12 |
| A6.9 | Acetylene Gas | 4 |
| A6.10 | Cigarette Lighters | 10 |
| A6.11 | Cryogenic Liquids | 12 |
| A6.12 | Ethyl Chloride | 10 |
| A6.13 | Ethylene Oxide | 12 |
| A6.14 | Ethylamine | 2 |
| A6.15 | Arsine, Cyanogen Chloride, etc. | 8 |
| A6.16 | Bromoacetone, Methyl Bromide, etc. | 12 |
| A6.17 | Gas Identification Sets | 9 |
| A6.18 | Hexaethyl Tetraphosphate Mixtures | 10 |
| A6.19 | Class 2.3 Poisonous by Inhalation (Zone A) | 11 |
| A6.20 | Nitric Oxide | 6 |
| A6.21 | Ethyl Methyl Ether | 5 |
| A6.22 | Chemical Under Pressure N.O.S. | 8 |
| A6.23 | Fuel Cell Cartridges | 2 |
| A6.24 | Fuel Cell Cartridges in Equipment | 1 |
| A6.25 | Fuel Cell Packed With Equipment | 2 |
| A6.26 | Metal Hydride Storage Systems | 4 |
| A6.27 | Flammable Gas Powered Engines | 12 |
| A6.28 | Articles Containing Flammable Gas | 8 |

## Component Architecture

### InspectorCompressedGasesScreen.tsx

**Pattern:** Follows `InspectorMagnetizedMaterialsScreen` and `InspectorGeneticallyModifiedOrganismsScreen`

**Props & State:**
```typescript
interface Props {
  navigation: any;
}

// State
const [currentStep, setCurrentStep] = useState(0);
const [isEditMode, setIsEditMode] = useState(false);
const [additionalComments, setAdditionalComments] = useState("");
```

**Key Logic:**

1. **Checklist Selection** - On mount, read `packagingParagraph` from `inspection.verificationCopy` and extract base paragraph ID (e.g., "A6.5" from "A6.5.1").

2. **Validation** - If no matching checklist found, show error state with "Go Back" button.

3. **Step-through UI** - Display one condition at a time with:
   - Progress bar
   - Condition label and description
   - AFMAN reference
   - Validate/Frustrate buttons
   - Back navigation

4. **Frustration handling:**
   ```typescript
   addPackageFrustration({
     category: "class2",
     itemId: condition.id,
     itemLabel: condition.label,
     expectedValues: ["Pass"],
     verificationStatus: "incorrect",
     defaultMessage: `This Class 2 compressed gas inspection requirement is not met. Requires re-inspection per AFMAN 24-604 ${paragraphId}.`,
     additionalComments: additionalComments.trim() || undefined,
     afmanReference: condition.afmanRef,
   });
   ```

5. **Completion** - After last step, navigate to `PackageFrustrationSummary` or `PackageInspectionCompleteScreen`.

## Routing Integration

### InspectorMarkingsLabelsValidationScreen.tsx

Add Class 2 routing in `navigateToNextScreen` function, **before** existing UN-number checks:

```typescript
// Get hazard class and packaging paragraph
const hazardClass = inspection.verificationCopy?.hazardClass ||
                    inspection.extractedContent?.hazardClass || "";
const packagingParagraph = inspection.verificationCopy?.packagingParagraph ||
                           inspection.extractedContent?.packagingParagraph || "";

// Check if Class 2 with valid A6.X packaging paragraph
const isClass2 = hazardClass.startsWith("2");
const hasA6Paragraph = /^A6\.\d+/i.test(packagingParagraph);

if (isClass2 && hasA6Paragraph) {
  navigation.navigate("InspectorCompressedGasesScreen");
  return;
}

// ... existing UN-number-based routing continues below
```

## Error Handling

### Paragraph ID Parsing

Normalize various formats to base paragraph:

```typescript
const extractA6Paragraph = (paragraph: string): string | null => {
  const match = paragraph.match(/^A6\.(\d+)/i);
  return match ? `A6.${match[1]}` : null;
};
```

Handles:
- `"A6.5"` → `"A6.5"`
- `"A6.5."` → `"A6.5"`
- `"A6.5.1"` → `"A6.5"`
- `"A6.5.1.2"` → `"A6.5"`

### Unmatched Checklist

If paragraph doesn't match any A6.X section:
- Log warning for debugging
- Display error screen with "Go Back" and "Skip & Continue" buttons

### Empty Conditions

If matched section has zero conditions:
- Skip directly to next screen (shouldn't happen with properly structured data)

## UI Components

The component uses the same UI pattern as existing material-specific screens:

- **Header** - Close button, title (dynamic based on section), step indicator
- **Progress Bar** - Visual progress through checklist
- **Condition Card** - Label, description, AFMAN reference, validation status
- **Action Buttons** - Validate (green), Frustrate (red)
- **Edit Mode** - Default message, additional comments input, Save/Cancel
- **Footer** - Back navigation

## Testing Considerations

1. **Unit Tests** - Verify paragraph parsing extracts correct A6.X values
2. **Routing Tests** - Verify Class 2 + A6.X paragraph routes correctly
3. **Checklist Data** - Verify all 27 sections have valid conditions
4. **Frustration Flow** - Verify frustrations save with correct category and data

## Implementation Order

1. Create `src/data/class2InspectionChecklists.ts` with all 27 sections
2. Create `src/components/Inspector/InspectorCompressedGasesScreen.tsx`
3. Register screen in navigator
4. Add routing logic to `InspectorMarkingsLabelsValidationScreen.tsx`
5. Test with sample Class 2 materials
