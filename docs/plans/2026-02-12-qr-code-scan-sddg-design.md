# QR Code Scan for SDDG Upload

**Date:** 2026-02-12
**Status:** Approved

## Summary

Add a "Scan QR Code" option to `SDDGUploadAndParse` that scans a QR code containing a TCN (shippersReferenceNumber), looks up the matching inspection in SQLite, populates the InspectionFormProvider context, and navigates to InteractiveSDDGComplianceScreen.

## Design Decisions

- **QR content**: TCN string (shippersReferenceNumber), exact match only — TCNs are unique per inspection
- **Scanner UI**: Inline state in SDDGUploadAndParse (matches existing `isScanning`/`showVerification` pattern)
- **DB lookup**: `listInspections({ tcn })` + JS exact match filter, then `loadInspectionForEdit(id)`
- **No new files**: All changes in `src/components/SDDGUploadAndParse.tsx`
- **No DataProvider changes**: Reuse existing `listInspections` and `loadInspectionForEdit`

## Flow

```
Tap "Scan QR Code"
  → showQRScanner = true
  → Full-screen CameraView with onBarcodeScanned + barcodeTypes: ['qr']
  → QR code scanned → extract TCN string
  → showQRScanner = false, isLoadingQR = true
  → listInspections({ tcn }) → find exact match
  → loadInspectionForEdit(match.id) → populates InspectionFormProvider
  → navigate("InteractiveSDDGComplianceScreen")
```

## Error Cases

- No match found: Alert "No inspection found with TCN: ..."
- DB error: Alert "Failed to look up inspection..."
- Empty/invalid QR data: Ignore scan
- Duplicate scan prevention: useRef guard (onBarcodeScanned fires rapidly)

## Implementation Changes (single file)

**File:** `src/components/SDDGUploadAndParse.tsx`

1. Add imports: `CameraView`, `useCameraPermissions` from `expo-camera`
2. Add state: `showQRScanner`, `isLoadingQR`, `scannedRef`
3. Add hooks: `useDatabase()` for `listInspections`; `loadInspectionForEdit` from existing `useInspectionFormActions()`
4. Replace placeholder `handleQRCodeScan` → sets `showQRScanner = true`
5. New `handleBarcodeScanned` handler with lookup + navigation + error handling
6. New render block for QR scanner (CameraView + back button + overlay)
7. Uncomment existing QR button (lines 2480-2496)
8. Loading state reuses existing `scanningContainer` pattern
