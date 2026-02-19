# Inspector Home Search: Preparer Shipment Lookup

**Date:** 2026-02-19
**Status:** Approved

---

## Problem

The InspectorHomeScreen search input filters existing inspector inspections but does not help when a TCN exists only in preparer records. Management requires that entering a preparer TCN in the search should allow starting an inspection directly from the home screen, mirroring the QR code scan flow.

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Prompt style | Inline card below empty table | Feels native to the table, minimal disruption |
| Lookup trigger | Debounced (600ms) when table results are empty | Seamless — no extra button press |
| Card content | Minimal — TCN + "Start Inspection" button | TCN is a unique identifier, no disambiguation needed |
| Not-found behavior | Muted message only, no redundant button | Existing "Start New Inspection" button in header suffices |
| Match type | Exact TCN match only | Avoids false positives, predictable behavior |

## Search Flow

```
User types in search
        │
        ▼
Filter inspector inspections (existing behavior, unchanged)
        │
        ├── Results found → Show filtered table (done)
        │
        └── Zero results
                │
                ▼
        Wait 600ms debounce
                │
                ▼
        Exact-match lookup in ShipmentDatabase by TCN
                │
                ├── Match found → Show inline card: TCN + "Start Inspection"
                │
                └── No match → Show muted message: "No shipment found for '[query]'"
```

## New State

Three new pieces of state in `InspectorHomeScreenComponent`:

```typescript
const [preparerMatch, setPreparerMatch] = useState<ShipmentMetadata | null>(null);
const [preparerSearchState, setPreparerSearchState] = useState<
  'idle' | 'searching' | 'found' | 'not-found'
>('idle');
const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
```

A `useEffect` watches `filteredInspections.length` and `searchQuery`:

- If `filteredInspections.length > 0` or `searchQuery` is empty: reset to `'idle'`, clear pending timer, clear `preparerMatch`.
- If `filteredInspections.length === 0` and `searchQuery` is non-empty: start 600ms debounce, then run the lookup.
- Lookup calls `ShipmentDatabase.initialize()`, then `ShipmentDatabase.searchShipments({ tcn: searchQuery.trim() })`, filters for exact TCN match (case-insensitive), **only considers `status === 'completed'` shipments** (in-progress shipments are not eligible).
- On match: set `preparerSearchState = 'found'` and store the shipment in `preparerMatch`.
- On no match: set `preparerSearchState = 'not-found'`.
- **Stale response guard:** The cleanup function sets a `cancelled` flag. The async callback checks this flag before writing state, preventing a slower prior request from overwriting a newer query's results.
- Cleanup function also cancels the debounce timer.

## Inline UI (FlatList ListFooterComponent)

Only renders when `filteredInspections.length === 0`.

| State | Display |
|-------|---------|
| `'idle'` | Nothing |
| `'searching'` | Small `ActivityIndicator` + "Searching preparer records..." — light gray background |
| `'found'` | Card with `colors.infoLight` background. Left: matched TCN in bold + "Found in Preparer Records" label in `colors.textSecondary`. Right: "Start Inspection" button (blue background, white text). |
| `'not-found'` | Muted text: "No shipment found for '[searchQuery]'" — no button |

## "Start Inspection" Action

When the user taps "Start Inspection", the handler follows the same pattern as `handleBarcodeScanned` in `SDDGUploadAndParse.tsx`:

1. Load full shipment: `ShipmentDatabase.loadShipment(preparerMatch.id)`
2. Extract `hazProPreparerContext`
3. Map to seed: `mapPreparerShipmentToInspectionSeed(preparerContext)`
4. `startNewInspection()` to reset state
5. `await setExtractedSDDGContent(seed.extractedContent)` (must be awaited before navigation, matching QR flow)
6. Seed special authorization data if present (COE/CAA/DOT-SP)
7. `completeSDDGSubstep("SDDGUploadAndParse")`
8. Navigate: `reset` to `InspectorWrappedStack → InteractiveSDDGComplianceScreen`

## Shared Utility Extraction

**New file:** `src/utils/loadPreparerShipmentForInspection.ts`

```typescript
export async function loadPreparerShipmentForInspection(
  shipmentId: string
): Promise<InspectionSeed>
```

Encapsulates:
- `ShipmentDatabase.loadShipment(shipmentId)`
- Null check on `hazProPreparerContext`
- `mapPreparerShipmentToInspectionSeed(preparerContext)`
- Returns the seed object

Callers (InspectorHomeScreen and SDDGUploadAndParse QR handler) remain responsible for context mutations and navigation. This keeps the utility pure with no context/navigation dependencies.

## Files Modified

| File | Changes |
|------|---------|
| `src/screens/inspector/InspectorHomeScreen.tsx` | New state, debounce useEffect, ListFooterComponent, start inspection handler |
| `src/utils/loadPreparerShipmentForInspection.ts` | **New file** — shared preparer shipment loading utility |
| `src/components/SDDGUploadAndParse.tsx` | Refactor `handleBarcodeScanned` to use shared utility |
