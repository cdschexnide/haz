# SDDG Inspector Stamp Design

## Goal

When an inspection is finalized, permanently stamp the scanned SDDG image with "Inspected by {rank} {name}" and "{title} Date: {date}" in the empty block area of the SDDG form (between Consignee and "COMPLETED AND SIGNED COPIES"). This is a standard part of every inspection — all finalized inspections must have the stamp applied.

## Decisions

- **Timing:** Stamp applied at inspection finalization only (not during upload or viewing)
- **Positioning:** Fixed relative percentages (SDDG is a standard IATA form layout; document scanner crops/straightens consistently)
- **Method:** Modify the image file on disk using `react-native-view-shot` (already installed, no new deps)
- **Font:** Clean printed font (not handwritten/script)
- **Stamp text:** Two lines matching the handwritten convention:
  - Line 1: `Inspected by {rank} {name}`
  - Line 2: `{title} Date: {formatted date}`
- **Original image retention:** Not required. The stamped image replaces the original.
- **Memory:** Downscale to a max dimension (e.g., 2048px) before offscreen render to avoid OOM on large camera images.

## Architecture

### New File: `src/utils/stampSddgImage.tsx`

Exports:

1. **`SddgStampOverlay`** — A React component rendered offscreen (`position: absolute, left: -9999`). Contains the SDDG image at scaled-down resolution with positioned text overlay.

2. **`stamp()` method** (via `useImperativeHandle`) — Exposed through a ref. Async function that:
   - Reads image dimensions via `Image.getSize()`
   - Scales dimensions down to max 2048px on the longest side (preserving aspect ratio)
   - Triggers the offscreen render
   - Calls `captureRef()` from `react-native-view-shot`
   - Saves result to `sddg_images/sddg_stamped_{timestamp}.jpg`
   - Returns the new URI, or null on failure

### Configuration

Position values are a tunable config object at the top of the file:

```ts
const STAMP_POSITION = {
  top: '28%',
  left: '62%',
  width: '30%',
};

const MAX_IMAGE_DIMENSION = 2048;
const STAMP_TIMEOUT_MS = 10000;
```

Adjust position values to fine-tune placement without digging through component code.

### Ownership & Integration

**The stamp is called from `InspectorAMC1015Form.tsx`** (the screen that triggers finalization), NOT from the provider. This is because `react-native-view-shot` requires a mounted component with a ref, and the provider has no render tree.

The flow in `InspectorAMC1015Form`:

1. User taps "Complete Inspection"
2. Screen calls `stampRef.current.stamp(...)` with a **timeout wrapper** (10s)
3. If stamp succeeds, pass `{ originalImageUri: stampedUri }` as overrides to `finalizeInspection(overrides)`
4. If stamp fails or times out, call `finalizeInspection()` without overrides (fail-open, unstamped image preserved)
5. Delete old unstamped file only AFTER `finalizeInspection()` succeeds

This uses the existing `finalizeInspection(overrides?: Partial<SDDGInspectionContext>)` API — no provider changes needed.

**Invariant risk:** If a future code path calls `finalizeInspection` outside of `InspectorAMC1015Form`, it would skip stamping. This is acceptable because `InspectorAMC1015Form` is currently the only finalization entry point, and it's architecturally the correct place (the "complete inspection" screen).

### Timeout & Deadlock Prevention

The `stamp()` method is wrapped in a `Promise.race` with a timeout:

```ts
const stampedUri = await Promise.race([
  stampRef.current.stamp(imageUri, inspector, date),
  new Promise<null>(resolve => setTimeout(() => resolve(null), STAMP_TIMEOUT_MS)),
]);
```

If `Image.getSize`, image load, or `captureRef` stalls beyond 10 seconds, the promise resolves to null and finalization proceeds without a stamp.

### Aspect Ratio / Non-Standard Images

If the scanned image has an unusual aspect ratio (e.g., gallery imports, cropped photos), the stamp still renders at the fixed percentage position. For non-SDDG-form images, the stamp may land in the wrong place — this is acceptable since the inspector workflow is designed specifically for SDDG form scans.

### Error Handling

Fail-open: if stamping fails for any reason (file not found, capture error, timeout, OOM), finalization proceeds with the original unstamped image. Error is logged via `console.error`.

### File Lifecycle

1. Stamp creates a NEW file: `sddg_stamped_{ts}.jpg`
2. `finalizeInspection(overrides)` saves the inspection with the stamped URI
3. Only after `finalizeInspection` returns success, delete the old unstamped file
4. If finalization fails, the stamped file is orphaned (acceptable — no data loss)

## Data Flow

```
User taps "Complete Inspection"
  -> stampRef.current.stamp(originalUri, inspector, date) WITH 10s timeout
    -> Image.getSize() to get dimensions
    -> Scale to max 2048px
    -> Render image + text in offscreen View
    -> captureRef() -> new image file
    -> Save to sddg_images/sddg_stamped_{ts}.jpg
    -> Return new URI (or null on failure/timeout)
  -> finalizeInspection({ originalImageUri: stampedUri }) OR finalizeInspection() if stamp failed
  -> On success: delete old unstamped file
```

## Files Modified

- **New:** `src/utils/stampSddgImage.tsx`
- **Modified:** `src/screens/inspector/InspectorAMC1015Form.tsx` — mount overlay, call stamp before finalize
- **Modified:** `src/screens/inspector/__tests__/InspectorAMC1015Form.test.tsx` — fix inspector mock to use object shape
