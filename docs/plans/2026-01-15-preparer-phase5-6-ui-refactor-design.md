# Preparer Phase 5-6 UI Refactor Design

**Date:** 2026-01-15
**Scope:** Documentation & Certification screens
**Goal:** Reduce technical debt, increase component reusability, apply theme consistently

---

## Problem Statement

Three screens in the Preparer workflow have significant technical debt:

| Screen | Lines | Issues |
|--------|-------|--------|
| LabelingAndMarking.tsx | 862 | Inline components, hardcoded styles, complex conditionals |
| ShippersDeclarationScreen.tsx | 1,380 | Large HTML generators, no component extraction |
| CertifyForm.tsx | 373 | Hardcoded styles, duplicate patterns |
| **Total** | **2,615** | |

---

## Design Decisions (Brainstormed)

1. **PDF Logic**: Extract to `src/utils/sddgPdfGenerator.ts`
2. **Document Modal**: Create reusable `DocumentModal` UI component
3. **Signature Section**: Create `SignatureSection` preparer component
4. **Vehicle Labeling**: Split into `VehicleLabelingNotice` + `StandardLabelingContent`
5. **Footer**: Use existing `ActionFooter` component as-is
6. **Document Nodes**: Create index file with lookup map

---

## New Components

### UI Library Components (`src/components/ui/`)

#### 1. KeyValueRow
Display label-value pairs (replaces inline LabelRow pattern).

```typescript
interface KeyValueRowProps {
  label: string;
  value?: string | React.ReactNode;
  valueStyle?: 'default' | 'bold' | 'accent';
}
```

#### 2. ChecklistItem
Checkbox with label for verification checklists.

```typescript
interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}
```

#### 3. LoadingOverlay
Full-screen semi-transparent loading indicator.

```typescript
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}
```

#### 4. DocumentModal
Modal with WebView for displaying regulatory documents.

```typescript
interface DocumentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  htmlContent: string;
  tabs?: { key: string; label: string; content: string }[];
}
```

### Preparer Components (`src/components/preparer/`)

#### 1. SignatureSection
Signature capture/display with modal trigger.

```typescript
interface SignatureSectionProps {
  signatureDataUrl?: string;
  onSignatureCapture: (dataUrl: string) => void;
  placeholder?: string;
}
```

#### 2. VehicleLabelingNotice
Notice component for UN3166 vehicle shipments.

```typescript
interface VehicleLabelingNoticeProps {
  // No props needed - displays static notice
}
```

#### 3. StandardLabelingContent
Labels/markings display for standard (non-vehicle) shipments.

```typescript
interface StandardLabelingContentProps {
  requiredLabels: RequiredLabel[];
  requiredMarkings: RequiredMarking[];
  limitedQuantity: boolean;
  onInfoPress: (attachmentNumber: string) => void;
}
```

#### 4. CertificationInfoCard
Displays preparer certification information.

```typescript
interface CertificationInfoCardProps {
  preparerName: string;
  preparerRank?: string;
  preparerTitle: string;
  certificationPlace: string;
}
```

---

## Utility Extractions

### 1. SDDG PDF Generator (`src/utils/sddgPdfGenerator.ts`)

Extract from ShippersDeclarationScreen:
- `generateFormHtml()` - Creates SDDG form HTML
- `generateDocumentHtml()` - Creates full document HTML with QR code
- `convertDocumentToPdf()` - HTML to PDF conversion
- `mergePdfs()` - Combine SDDG with COE/CAA documents

### 2. Document Nodes Index (`src/server/attachment5-13/documentNodes/index.ts`)

Create a lookup map for all attachment document nodes:

```typescript
export const documentNodesMap: Record<string, DocumentNode[]> = {
  '5': attachment5DocumentNodesList,
  '6': attachment6DocumentNodesList,
  // ... etc
};

export const getDocumentNodes = (attachmentNumber: string): DocumentNode[] => {
  return documentNodesMap[attachmentNumber] || [];
};
```

---

## Screen Refactoring

### LabelingAndMarking.tsx

**Before:** 862 lines
**After:** ~300 lines (estimated 65% reduction)

**Changes:**
- Replace inline `LabelRow` with `KeyValueRow`
- Extract modal to `DocumentModal` component
- Split vehicle/standard logic into separate components
- Use `ActionFooter` for buttons
- Apply theme tokens instead of hardcoded styles

**New Structure:**
```
LabelingAndMarkingScreen/
├── Uses: DocumentModal, InfoBox, ActionFooter, KeyValueRow
├── Uses: VehicleLabelingNotice (for UN3166)
├── Uses: StandardLabelingContent (for standard shipments)
└── Handles: Navigation, step completion
```

### ShippersDeclarationScreen.tsx

**Before:** 1,380 lines
**After:** ~500 lines (estimated 64% reduction)

**Changes:**
- Extract PDF generation to `src/utils/sddgPdfGenerator.ts`
- Use `LoadingOverlay` component
- Use `InfoBox` for limited quantity banner
- Use `ActionFooter` for buttons
- Apply theme tokens

**New Structure:**
```
ShippersDeclarationScreen/
├── Uses: ShippersDeclarationForm (existing)
├── Uses: InfoBox (for limited quantity)
├── Uses: LoadingOverlay
├── Uses: ActionFooter
├── Calls: sddgPdfGenerator utilities
└── Handles: Navigation, PDF sharing
```

### CertifyForm.tsx

**Before:** 373 lines
**After:** ~150 lines (estimated 60% reduction)

**Changes:**
- Extract info display to `CertificationInfoCard`
- Extract signature UI to `SignatureSection`
- Use `ActionFooter` for buttons
- Use `LoadingOverlay` for loading state
- Apply theme tokens

**New Structure:**
```
CertifyFormScreen/
├── Uses: CertificationInfoCard
├── Uses: SignatureSection
├── Uses: LoadingOverlay
├── Uses: ActionFooter
├── Uses: DatabaseErrorDisplay (existing)
└── Handles: Navigation, certification logic
```

---

## Existing Components to Leverage

| Component | Usage |
|-----------|-------|
| `ActionFooter` | All 3 screens - Cancel/Save/Continue buttons |
| `InfoBox` | Limited quantity banner (variant: warning) |
| `ScreenHeader` | Screen titles with back navigation |
| `SectionHeader` | Section titles within screens |
| `Button` | Individual buttons where needed |

---

## File Structure After Refactor

```
src/
├── components/
│   ├── ui/
│   │   ├── KeyValueRow.tsx (NEW)
│   │   ├── ChecklistItem.tsx (NEW)
│   │   ├── LoadingOverlay.tsx (NEW)
│   │   ├── DocumentModal.tsx (NEW)
│   │   └── ... (existing)
│   └── preparer/
│       ├── SignatureSection.tsx (NEW)
│       ├── VehicleLabelingNotice.tsx (NEW)
│       ├── StandardLabelingContent.tsx (NEW)
│       ├── CertificationInfoCard.tsx (NEW)
│       └── ... (existing)
├── screens/
│   └── preparer/
│       ├── LabelingAndMarkingScreen.tsx (REFACTORED, moved)
│       ├── ShippersDeclarationScreen.tsx (REFACTORED, moved)
│       ├── CertifyFormScreen.tsx (REFACTORED, moved)
│       └── ... (existing)
├── utils/
│   └── sddgPdfGenerator.ts (NEW)
└── server/
    └── attachment5-13/
        └── documentNodes/
            └── index.ts (NEW - lookup map)
```

---

## Expected Impact

| Screen | Before | After | Reduction |
|--------|--------|-------|-----------|
| LabelingAndMarking | 862 | ~300 | ~65% |
| ShippersDeclarationScreen | 1,380 | ~500 | ~64% |
| CertifyForm | 373 | ~150 | ~60% |
| **Total** | **2,615** | **~950** | **~64%** |

**New reusable code:**
- 4 UI library components (~250 lines)
- 4 preparer components (~300 lines)
- 1 utility module (~400 lines)
- 1 index file (~30 lines)

---

## Testing Strategy

Each new component will have:
1. Unit tests using React Native Testing Library
2. Snapshot tests for visual regression

Each refactored screen will have:
1. Integration tests verifying navigation flows
2. Existing tests updated for new imports

---

## Migration Notes

1. Old screen files will be deleted from `src/components/`
2. Navigation in `MainLayoutNavigator.tsx` will be updated
3. All imports across the app will be updated to new paths
