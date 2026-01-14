# Cylinder Type Selection Screen Design

**Date:** 2026-01-14
**Status:** Approved
**Author:** Claude Code + User

---

## Overview

Build a cylinder type selection screen for Class 2 (Compressed Gases) materials that replaces the POP marking entry flow. Since cylinders don't have UN specification package markings (POP), inspectors need to validate the cylinder type against the approved list for the material's packaging paragraph.

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Cylinder display | Only valid types for paragraph | Keeps UI clean, contextually relevant |
| On valid selection | Immediate pass, proceed | Simple efficient flow |
| "Not Listed" behavior | Show COE/CAA placeholders | Establishes pattern for future implementation |
| Flow placement | Replace POP marking for Class 2 | Parallel to non-Class 2 flow |
| Button layout | 3-column grid, full names | Tablet app has space for full names |

## File Structure

### Files to Create

```
src/data/cylinderTypesByParagraph.ts                           # Cylinder type data
src/components/Inspector/InspectorCylinderTypeSelectionScreen.tsx  # Selection screen
```

### Files to Modify

```
src/components/Inspector/InspectorLayoutNavigator.tsx          # Register screen
src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx  # Update routing
```

## Data Model

### cylinderTypesByParagraph.ts

```typescript
export interface CylinderType {
  id: string;           // e.g., "DOT-3A"
  label: string;        // e.g., "DOT 3A"
  restrictions?: string; // e.g., "NOT for Class 8 materials"
}

export const CYLINDER_TYPES_BY_PARAGRAPH: Record<string, CylinderType[]> = {
  "A6.2": [
    { id: "DOT-2P", label: "DOT 2P" },
    { id: "DOT-2Q", label: "DOT 2Q" },
    { id: "ICAO-IP7", label: "ICAO/IATA IP7" },
    { id: "ICAO-IP7A", label: "ICAO/IATA IP7A" },
    { id: "ICAO-IP7B", label: "ICAO/IATA IP7B" },
  ],
  "A6.4": [
    { id: "DOT-3A", label: "DOT 3A" },
    { id: "DOT-3AA", label: "DOT 3AA" },
    { id: "DOT-3AL", label: "DOT 3AL", restrictions: "NOT for Class 8" },
    // ... additional types
  ],
  // ... A6.3 through A6.28
};

export function getCylinderTypesForParagraph(paragraph: string): CylinderType[];
```

## UI Layout

### Main View (Cylinder Selection)

```
┌─────────────────────────────────────────────────────────┐
│  Header: "Cylinder Type Selection"          [X] Close   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Subtitle: "A6.5 - Nonliquefied Compressed Gases"       │
│  Instruction: "Select the cylinder type observed"       │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  DOT 3A  │  │ DOT 3AA  │  │ DOT 3AL  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  DOT 3B  │  │  DOT 3E  │  │ DOT 3HT  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  DOT 4B  │  │ DOT 4BA  │  │ DOT 4BW  │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│  ┌──────────┐                                          │
│  │  DOT 39  │                                          │
│  └──────────┘                                          │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              Not Listed                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Secondary View (After "Not Listed")

```
┌─────────────────────────────────────────────────────────┐
│  Header: "Cylinder Type Selection"          [X] Close   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  Subtitle: "Non-Standard Cylinder Authorization"        │
│  Instruction: "Select authorization type"               │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │     COE (Certificate of Equivalency)            │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │     CAA (Competent Authority Approval)          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │              ← Back to Cylinder Types           │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Styling

- 3-column grid using `flexWrap: "wrap"` with ~32% width per button
- Cylinder buttons: white background, blue border, blue text
- "Not Listed" button: full width, secondary gray styling
- COE/CAA buttons: full width, placeholder styling (dashed border to indicate non-functional)
- No scrolling - grid fits on tablet screen

## State Management

### Local Component State

```typescript
const [showCoeCAA, setShowCoeCAA] = useState(false);
```

### Context State (Optional - for tracking selection)

```typescript
interface CylinderInspection {
  selectedCylinderType: string | null;  // e.g., "DOT-3A"
  cylinderTypeLabel: string | null;     // e.g., "DOT 3A"
  validationStatus: "valid" | "coe_caa_pending" | null;
}
```

## Navigation Flow

### Class 2 Materials

```
InspectorMarkingsLabelsValidationScreen
    ↓
InspectorCylinderTypeSelectionScreen
    │
    ├─ (Cylinder selected) → InspectorCompressedGasesScreen
    │
    └─ (Not Listed → COE/CAA) → Placeholder (no navigation)
```

### Non-Class 2 Materials (unchanged)

```
InspectorMarkingsLabelsValidationScreen
    ↓
InspectorPOPMarkingDataEntry
    ↓
[Material-specific screens]
```

## Component Behavior

### On Mount

1. Read `packagingParagraph` from inspection context
2. Extract base paragraph ID (e.g., "A6.5" from "A6.5.1")
3. Look up valid cylinder types from `CYLINDER_TYPES_BY_PARAGRAPH`
4. If no cylinder types defined, skip screen and navigate directly to `InspectorCompressedGasesScreen`

### On Cylinder Button Press

1. Record selected cylinder type in state/context
2. Navigate to `InspectorCompressedGasesScreen`
3. No frustration created (valid selection = pass)

### On "Not Listed" Press

1. Set `showCoeCAA = true`
2. Render COE/CAA view instead of cylinder grid

### On COE/CAA Button Press

1. No action (placeholder for future implementation)
2. Could show an alert: "COE/CAA verification coming soon"

### On "Back to Cylinder Types" Press

1. Set `showCoeCAA = false`
2. Return to cylinder grid view

### On Back Navigation (hardware/gesture)

1. Reset any cylinder selection state
2. Navigate back to `InspectorMarkingsLabelsValidationScreen`

## Edge Cases

| Scenario | Handling |
|----------|----------|
| Paragraph has no cylinder types (A6.8, A6.23-25) | Skip screen, go directly to `InspectorCompressedGasesScreen` |
| Paragraph not in A6.X range | Existing logic skips compressed gases flow entirely |
| Unknown paragraph ID | Show "No cylinder types found" message with skip option |

## Routing Update

### InspectorMarkingsLabelsValidationScreen.tsx

Current:
```typescript
if (isClass2 && hasClass2Checklist(packagingParagraph)) {
  navigation.navigate("InspectorCompressedGasesScreen");
  return;
}
```

Updated:
```typescript
if (isClass2 && hasClass2Checklist(packagingParagraph)) {
  navigation.navigate("InspectorCylinderTypeSelectionScreen");
  return;
}
```

## Implementation Order

1. Create `src/data/cylinderTypesByParagraph.ts` with cylinder data for all A6.X paragraphs
2. Create `src/components/Inspector/InspectorCylinderTypeSelectionScreen.tsx`
3. Register screen in `InspectorLayoutNavigator.tsx`
4. Update routing in `InspectorMarkingsLabelsValidationScreen.tsx`
5. Test with various Class 2 materials
