# Preparer Phase 5-6 Implementation Plan

**Date:** 2026-01-15
**Design Doc:** [2026-01-15-preparer-phase5-6-ui-refactor-design.md](./2026-01-15-preparer-phase5-6-ui-refactor-design.md)

---

## Implementation Order

1. UI Library Components (foundation)
2. Utility Extractions (business logic)
3. Preparer Components (domain-specific)
4. Screen Refactoring (integration)
5. Cleanup (delete old files, update navigation)

---

## Phase 1: UI Library Components

### Task 1.1: KeyValueRow Component

**File:** `src/components/ui/KeyValueRow.tsx`
**Test:** `src/components/ui/__tests__/KeyValueRow.test.tsx`

**Interface:**
```typescript
interface KeyValueRowProps {
  label: string;
  value?: string | React.ReactNode;
  valueStyle?: 'default' | 'bold' | 'accent';
}
```

**Behavior:**
- Renders label on left, value on right (or below on narrow screens)
- Supports string or ReactNode values
- `valueStyle: 'bold'` uses fontWeight 600
- `valueStyle: 'accent'` adds left border accent
- Returns null if value is undefined or empty string

**Test Cases:**
1. Renders label and string value
2. Renders label with ReactNode value
3. Returns null when value is undefined
4. Applies bold style when valueStyle='bold'
5. Applies accent style when valueStyle='accent'

**Commands:**
```bash
npm test -- --testPathPattern="KeyValueRow" --watchAll=false
```

**Commit:** `feat(ui): add KeyValueRow component for label-value display`

---

### Task 1.2: ChecklistItem Component

**File:** `src/components/ui/ChecklistItem.tsx`
**Test:** `src/components/ui/__tests__/ChecklistItem.test.tsx`

**Interface:**
```typescript
interface ChecklistItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  description?: string;
}
```

**Behavior:**
- Checkbox with label, optional description below
- Calls onChange with toggled value on press
- Disabled state grays out and prevents interaction
- Uses theme colors for checked/unchecked states

**Test Cases:**
1. Renders label and unchecked checkbox
2. Renders checked checkbox when checked=true
3. Calls onChange with true when unchecked item pressed
4. Calls onChange with false when checked item pressed
5. Does not call onChange when disabled
6. Renders description when provided

**Commands:**
```bash
npm test -- --testPathPattern="ChecklistItem" --watchAll=false
```

**Commit:** `feat(ui): add ChecklistItem component for verification lists`

---

### Task 1.3: LoadingOverlay Component

**File:** `src/components/ui/LoadingOverlay.tsx`
**Test:** `src/components/ui/__tests__/LoadingOverlay.test.tsx`

**Interface:**
```typescript
interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}
```

**Behavior:**
- Full-screen semi-transparent overlay (rgba white 0.8)
- Centered ActivityIndicator
- Optional message text below spinner
- Returns null when visible=false
- Uses Modal with transparent background

**Test Cases:**
1. Returns null when visible=false
2. Renders overlay with spinner when visible=true
3. Renders message when provided
4. Does not render message when not provided

**Commands:**
```bash
npm test -- --testPathPattern="LoadingOverlay" --watchAll=false
```

**Commit:** `feat(ui): add LoadingOverlay component for async operations`

---

### Task 1.4: DocumentModal Component

**File:** `src/components/ui/DocumentModal.tsx`
**Test:** `src/components/ui/__tests__/DocumentModal.test.tsx`

**Interface:**
```typescript
interface DocumentModalTab {
  key: string;
  label: string;
  content: string; // HTML content
}

interface DocumentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  htmlContent?: string; // Used when no tabs
  tabs?: DocumentModalTab[];
  defaultTabKey?: string;
}
```

**Behavior:**
- Modal with title header and close button (X)
- If tabs provided, renders tab bar and shows selected tab's content
- If no tabs, renders htmlContent directly
- Uses WebView to render HTML content
- Close button calls onClose

**Test Cases:**
1. Does not render when visible=false
2. Renders title and close button when visible
3. Calls onClose when close button pressed
4. Renders WebView with htmlContent when no tabs
5. Renders tab bar when tabs provided
6. Switches content when tab pressed

**Commands:**
```bash
npm test -- --testPathPattern="DocumentModal" --watchAll=false
```

**Commit:** `feat(ui): add DocumentModal for regulatory document display`

---

## Phase 2: Utility Extractions

### Task 2.1: Document Nodes Index

**File:** `src/server/attachment5-13/documentNodes/index.ts`

**Interface:**
```typescript
export const documentNodesMap: Record<string, DocumentNode[]>;
export const getDocumentNodes: (attachmentNumber: string) => DocumentNode[];
```

**Behavior:**
- Imports all attachment document node lists
- Exports map keyed by attachment number ('5', '6', ..., '13')
- getDocumentNodes returns empty array for unknown keys

**No tests needed** - simple re-export module.

**Commit:** `refactor(server): add documentNodes index for attachment lookup`

---

### Task 2.2: SDDG PDF Generator Utility

**File:** `src/utils/sddgPdfGenerator.ts`
**Test:** `src/utils/__tests__/sddgPdfGenerator.test.ts`

**Interface:**
```typescript
interface SDDGFormData {
  // All fields needed for SDDG generation
  shipperName: string;
  shipperAddress: string;
  // ... (extract from ShippersDeclarationScreen)
}

export const generateSDDGFormHtml: (data: SDDGFormData) => string;
export const generateSDDGDocumentHtml: (data: SDDGFormData, qrCodeDataUrl: string) => string;
export const convertHtmlToPdf: (html: string) => Promise<string>; // Returns file URI
export const mergeSDDGWithAttachments: (sddgUri: string, attachmentUris: string[]) => Promise<string>;
```

**Behavior:**
- Extract generateFormHtml logic from ShippersDeclarationScreen
- Extract generateDocumentHtml logic
- Extract PDF conversion using expo-print
- Extract PDF merging using pdf-lib

**Test Cases:**
1. generateSDDGFormHtml returns valid HTML string
2. generateSDDGDocumentHtml includes QR code image
3. convertHtmlToPdf returns file URI (mock expo-print)
4. mergeSDDGWithAttachments combines multiple PDFs (mock pdf-lib)

**Commands:**
```bash
npm test -- --testPathPattern="sddgPdfGenerator" --watchAll=false
```

**Commit:** `refactor(utils): extract SDDG PDF generation to utility module`

---

## Phase 3: Preparer Components

### Task 3.1: SignatureSection Component

**File:** `src/components/preparer/SignatureSection.tsx`
**Test:** `src/components/preparer/__tests__/SignatureSection.test.tsx`

**Interface:**
```typescript
interface SignatureSectionProps {
  signatureDataUrl?: string;
  onSignatureCapture: (dataUrl: string) => void;
  placeholder?: string;
  label?: string;
}
```

**Behavior:**
- Shows signature image if signatureDataUrl provided
- Shows placeholder box with text if no signature
- Pressing opens SignatureModal (existing component)
- Calls onSignatureCapture when signature captured

**Test Cases:**
1. Renders placeholder when no signature
2. Renders signature image when signatureDataUrl provided
3. Opens modal on press (verify modal visible)
4. Calls onSignatureCapture when signature captured

**Commands:**
```bash
npm test -- --testPathPattern="SignatureSection" --watchAll=false
```

**Commit:** `feat(preparer): add SignatureSection component`

---

### Task 3.2: CertificationInfoCard Component

**File:** `src/components/preparer/CertificationInfoCard.tsx`
**Test:** `src/components/preparer/__tests__/CertificationInfoCard.test.tsx`

**Interface:**
```typescript
interface CertificationInfoCardProps {
  preparerName: string;
  preparerRank?: string;
  preparerTitle: string;
  certificationPlace: string;
}
```

**Behavior:**
- Uses DetailCard to display preparer info
- Fields: Name, Rank (if provided), Title, Place
- Title: "Certification Information"

**Test Cases:**
1. Renders all fields when provided
2. Omits rank field when not provided
3. Displays correct title

**Commands:**
```bash
npm test -- --testPathPattern="CertificationInfoCard" --watchAll=false
```

**Commit:** `feat(preparer): add CertificationInfoCard component`

---

### Task 3.3: VehicleLabelingNotice Component

**File:** `src/components/preparer/VehicleLabelingNotice.tsx`
**Test:** `src/components/preparer/__tests__/VehicleLabelingNotice.test.tsx`

**Interface:**
```typescript
interface VehicleLabelingNoticeProps {
  // No props - static notice content
}
```

**Behavior:**
- Displays InfoBox (variant: info) with vehicle labeling notice
- Content explains that vehicles are exempt from most labeling requirements
- Uses SectionHeader for "Vehicle Shipment" title

**Test Cases:**
1. Renders info box with vehicle notice text
2. Renders section header

**Commands:**
```bash
npm test -- --testPathPattern="VehicleLabelingNotice" --watchAll=false
```

**Commit:** `feat(preparer): add VehicleLabelingNotice component`

---

### Task 3.4: StandardLabelingContent Component

**File:** `src/components/preparer/StandardLabelingContent.tsx`
**Test:** `src/components/preparer/__tests__/StandardLabelingContent.test.tsx`

**Interface:**
```typescript
interface StandardLabelingContentProps {
  requiredLabels: RequiredLabel[];
  requiredMarkings: RequiredMarking[];
  limitedQuantity: boolean;
  onInfoPress: (attachmentNumber: string) => void;
}
```

**Behavior:**
- Renders SectionHeader for "Required Labels" with label list
- Renders SectionHeader for "Required Markings" with marking list
- Uses KeyValueRow for each label/marking item
- Info icon buttons that call onInfoPress
- Shows limited quantity banner (InfoBox warning) if limitedQuantity=true

**Test Cases:**
1. Renders labels section with items
2. Renders markings section with items
3. Calls onInfoPress when info button pressed
4. Shows limited quantity banner when limitedQuantity=true
5. Hides limited quantity banner when limitedQuantity=false

**Commands:**
```bash
npm test -- --testPathPattern="StandardLabelingContent" --watchAll=false
```

**Commit:** `feat(preparer): add StandardLabelingContent component`

---

## Phase 4: Screen Refactoring

### Task 4.1: Refactor LabelingAndMarkingScreen

**File:** `src/screens/preparer/LabelingAndMarkingScreen.tsx`
**Old File:** `src/components/LabelingAndMarking.tsx` (delete after)

**Changes:**
1. Import and use DocumentModal instead of inline modal
2. Import and use VehicleLabelingNotice for vehicle shipments
3. Import and use StandardLabelingContent for standard shipments
4. Import and use ActionFooter for buttons
5. Use getDocumentNodes from new index
6. Apply theme tokens for all styles

**Target:** ~300 lines (from 862)

**Test:** Update existing tests or create new integration tests

**Commands:**
```bash
npm test -- --testPathPattern="LabelingAndMarking" --watchAll=false
npx tsc --noEmit
```

**Commit:** `refactor(preparer): migrate LabelingAndMarkingScreen to UI library`

---

### Task 4.2: Refactor ShippersDeclarationScreen

**File:** `src/screens/preparer/ShippersDeclarationScreen.tsx`
**Old File:** `src/components/ShippersDeclarationScreen.tsx` (delete after)

**Changes:**
1. Import PDF utilities from sddgPdfGenerator
2. Import and use LoadingOverlay
3. Import and use InfoBox for limited quantity banner
4. Import and use ActionFooter for buttons
5. Apply theme tokens for all styles
6. Simplify component to orchestration logic only

**Target:** ~500 lines (from 1,380)

**Test:** Update existing tests

**Commands:**
```bash
npm test -- --testPathPattern="ShippersDeclaration" --watchAll=false
npx tsc --noEmit
```

**Commit:** `refactor(preparer): migrate ShippersDeclarationScreen to UI library`

---

### Task 4.3: Refactor CertifyFormScreen

**File:** `src/screens/preparer/CertifyFormScreen.tsx`
**Old File:** `src/components/CertifyForm.tsx` (delete after)

**Changes:**
1. Import and use CertificationInfoCard
2. Import and use SignatureSection
3. Import and use LoadingOverlay
4. Import and use ActionFooter for buttons
5. Apply theme tokens for all styles

**Target:** ~150 lines (from 373)

**Test:** Update existing tests

**Commands:**
```bash
npm test -- --testPathPattern="CertifyForm" --watchAll=false
npx tsc --noEmit
```

**Commit:** `refactor(preparer): migrate CertifyFormScreen to UI library`

---

## Phase 5: Cleanup

### Task 5.1: Update Navigation

**File:** `src/navigation/MainLayoutNavigator.tsx`

**Changes:**
1. Update imports for refactored screens
2. Verify screen names match navigation calls

**Commands:**
```bash
npx tsc --noEmit
```

**Commit:** `refactor(nav): update imports for Phase 5-6 migrated screens`

---

### Task 5.2: Delete Old Files

**Files to Delete:**
- `src/components/LabelingAndMarking.tsx`
- `src/components/ShippersDeclarationScreen.tsx`
- `src/components/CertifyForm.tsx`

**Commands:**
```bash
rm src/components/LabelingAndMarking.tsx
rm src/components/ShippersDeclarationScreen.tsx
rm src/components/CertifyForm.tsx
npx tsc --noEmit
npm test -- --watchAll=false
```

**Commit:** `chore: delete old Phase 5-6 screen files`

---

### Task 5.3: Update UI Component Exports

**File:** `src/components/ui/index.ts`

**Changes:**
- Export KeyValueRow
- Export ChecklistItem
- Export LoadingOverlay
- Export DocumentModal

**Commands:**
```bash
npx tsc --noEmit
```

**Commit:** `feat(ui): export new Phase 5-6 components from index`

---

### Task 5.4: Update Preparer Component Exports

**File:** `src/components/preparer/index.ts`

**Changes:**
- Export SignatureSection
- Export CertificationInfoCard
- Export VehicleLabelingNotice
- Export StandardLabelingContent

**Commands:**
```bash
npx tsc --noEmit
```

**Commit:** `feat(preparer): export new Phase 5-6 components from index`

---

## Summary

| Phase | Tasks | New Files | Estimated Lines |
|-------|-------|-----------|-----------------|
| 1: UI Components | 4 | 4 components + 4 tests | ~400 |
| 2: Utilities | 2 | 2 files | ~450 |
| 3: Preparer Components | 4 | 4 components + 4 tests | ~400 |
| 4: Screen Refactoring | 3 | 3 screens | ~950 |
| 5: Cleanup | 4 | 0 (updates + deletions) | 0 |
| **Total** | **17** | **17 new files** | **~2,200** |

**Net reduction:** 2,615 (old) - 950 (new screens) = **~1,665 lines removed from screens**

---

## Execution Notes

1. Use TDD for all components: write tests first, verify they fail, implement, verify they pass
2. Run TypeScript check after each task: `npx tsc --noEmit`
3. Use fresh subagent for each task
4. Two-stage review after each task: spec compliance, then code quality
5. Mark tasks complete only after both reviews pass
