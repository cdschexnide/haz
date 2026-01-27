# Recommended Frustration One-Click Apply

## Problem

When the app detects a likely SDDG compliance issue (e.g., hazard class "6" should be "9"), it displays a "Potential Compliance Issue" modal. Currently, clicking "Confirm Frustration" navigates to a form requiring manual entry of the correct value—even though the app already knows what the correct value should be.

This is redundant and slows down the inspector's workflow.

## Solution

Replace the "Confirm Frustration" button with "Apply Frustration & Recommended Value" for fields that have a known expected value. One click creates the frustration with the correct value pre-populated and closes the modal.

## Data Flow Changes

### 1. sddgValidation.ts

Update `getAllRecommendedFrustrations()` return type:

```typescript
// Before
Array<{ fieldKey: string; recommendation: string }>

// After
Array<{ fieldKey: string; recommendation: string; expectedValue: string }>
```

The `expectedValue` comes from the existing validation functions which already compute it (e.g., `validateHazardClass` returns `{ expected: "9", ... }`).

### 2. InteractiveSDDGComplianceScreen.tsx

- Store `expectedValue` in the recommendations state alongside `recommendedMessage`
- Pass `expectedValue` to `SDDGFieldModal`

### 3. SDDGFieldModal.tsx

- Accept new prop: `expectedValue?: string`
- Pass to `RecommendedIssueView`
- Add handler `handleApplyRecommendedFrustration` that calls `onSave(fieldKey, expectedValue, recommendedMessage)` directly

### 4. RecommendedIssueView.tsx

- Accept new props: `expectedValue?: string`, `onApplyRecommended: () => void`
- Update UI: "APPLY FRUSTRATION & RECOMMENDED VALUE" with description showing the value
- One-click action calls `onApplyRecommended`

## UI Changes

### RecommendedIssueView - Updated Card

**Before:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ CONFIRM FRUSTRATION                      Frustrate → │
│   Apply the recommended frustration                    │
└─────────────────────────────────────────────────────────┘
```

**After:**
```
┌─────────────────────────────────────────────────────────┐
│ ⚠ APPLY FRUSTRATION & RECOMMENDED VALUE       Apply → │
│   Set correct value to "9" and frustrate this field    │
└─────────────────────────────────────────────────────────┘
```

## Files Modified

| File | Change |
|------|--------|
| `src/components/Inspector/utils/sddgValidation.ts` | Return `expectedValue` from `getAllRecommendedFrustrations()` |
| `src/screens/inspector/InteractiveSDDGComplianceScreen.tsx` | Store/pass `expectedValue` |
| `src/components/Inspector/SDDGFieldModal.tsx` | New prop, one-click handler |
| `src/components/Inspector/ModalViews/RecommendedIssueView.tsx` | Updated UI, new callback |

## Files Unchanged (Verification)

These files should NOT require changes:

- `InspectionFormProvider.tsx` - `addFrustration()` signature unchanged
- `sddgToForm1015Mapping.ts` - mapping logic unchanged
- `SDDGFrustrationSummary.tsx` - displays frustrations the same way
- `InspectorAMC1015Form.tsx` - form generation unchanged
- Reinspection flow - all handlers unchanged

## Edge Cases

1. **No expected value**: If validation can't determine expected value, fall back to current behavior (navigate to ReportIssueView)
2. **Binary fields**: aircraftType/shipmentType already have expected values from validation
3. **Non-validated fields**: shipper, consignee, etc. never get recommended frustrations, unchanged

## Behavior After Apply

1. Frustration created with:
   - `correctValue`: the expected value (e.g., "9")
   - `additionalComments`: the recommendation message
   - `fieldValue`: the current incorrect value (e.g., "6")
2. Modal closes
3. Field turns red (frustrated state)
4. Left panel (MainLayout) shows correction: `6 → 9`

## Testing Checklist

- [ ] One-click apply creates frustration with correct `correctValue`
- [ ] Field turns red after apply
- [ ] Left panel shows value change
- [ ] "Correct the Value" still works for manual override
- [ ] Fields without recommendations unchanged
- [ ] Form 1015 mapping still correct
- [ ] Reinspection flow still works
- [ ] Resolving frustration still works
