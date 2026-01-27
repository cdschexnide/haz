# Form1015Viewer Design

## Problem

When viewing AMC Form 1015 from InspectorHomeScreen, the current approach of navigating to InspectorAMC1015Form is inefficient. The previous Modal-based approach failed because ScrollView doesn't work reliably inside Modal on Android (NullPointerException in native SQLite, scroll not responding).

## Solution

Create a FlatList-based `Form1015Viewer` component that:
1. Accepts inspection data as props (not from context)
2. Uses FlatList instead of ScrollView (works in Modal on Android)
3. Provides read-only view + PDF export functionality

## Architecture

### Props Interface

```typescript
interface Form1015ViewerProps {
  inspection: InspectorShipment;
  onClose: () => void;
}
```

### FlatList Structure

**ListHeaderComponent** (static content above grid):
- Title + TCN row
- Validation banner (complies / does not comply checkboxes)
- Inspector dates and names rows
- Instructions text

**FlatList data** (~50 items):
- Grid headers (SHIPPER'S DECLARATION | CARGO IDENTIFICATION)
- Checkbox rows 1-86 (paired left/right columns)
- Comments section
- Final row (opened for inspection, optional use)

### Data Flow

```
User clicks "View"
    → loadInspection(id)
    → store in selectedInspectionForForm state
    → setForm1015ModalVisible(true)
    → Modal renders <Form1015Viewer inspection={selectedInspectionForForm} />
```

## File Changes

### New: `src/components/Inspector/Form1015Viewer.tsx`

- FlatList-based component
- Receives `inspection` prop directly
- Contains PDF generation logic (from InspectorAMC1015Form)
- Footer with "Close" and "Share PDF" buttons
- Reuses `Form1015CheckBoxWithStatus` component
- Reuses mapping utilities:
  - `mapFrustrationsToForm1015WithResolved()`
  - `getLatestReinspectionInfo()`

### Update: `src/screens/inspector/InspectorHomeScreen.tsx`

- Add `form1015ModalVisible` state
- Add `selectedInspectionForForm: InspectorShipment | null` state
- Update `handleViewForm1015`:
  ```typescript
  const handleViewForm1015 = async (inspection: InspectorShipment) => {
    try {
      const fullInspection = await database.loadInspection(inspection.id);
      setSelectedInspectionForForm(fullInspection);
      setForm1015ModalVisible(true);
    } catch (error) {
      Alert.alert("Error", "Failed to load inspection data.");
    }
  };
  ```
- Add Modal with Form1015Viewer:
  ```tsx
  <Modal visible={form1015ModalVisible} animationType="slide">
    {selectedInspectionForForm && (
      <Form1015Viewer
        inspection={selectedInspectionForForm}
        onClose={() => setForm1015ModalVisible(false)}
      />
    )}
  </Modal>
  ```

### No Changes: `src/screens/inspector/InspectorAMC1015Form.tsx`

Keep as-is for full workflow (navigation-based with Complete Inspection action).

## Why FlatList Works

1. FlatList uses native virtualization - only renders visible items
2. FlatList has its own scroll implementation that works correctly in Modal
3. Avoids the ScrollView + Modal + Android combination that causes issues
4. Better performance with 50+ checkbox rows

## Functionality

| Feature | Form1015Viewer (Modal) | InspectorAMC1015Form (Screen) |
|---------|------------------------|-------------------------------|
| View form data | Yes | Yes |
| PDF export | Yes | Yes |
| Complete Inspection | No | Yes |
| Cancel/Go Back | Close modal | Navigate back |
| Context dependency | None (props) | useInspectionForm |
