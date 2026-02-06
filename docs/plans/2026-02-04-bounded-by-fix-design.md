# Adaptive Region Detection `boundedBy` Fix — Design

**Date:** 2026-02-04
**Branch:** `inspector-persona-testing`

---

## Problem

The `findValueBlocks` function in `adaptiveRegionDetection.ts` uses fixed pixel-based search areas to find text blocks belonging to a field. For large multi-line fields like shipper and consignee, the search area overlaps with adjacent fields, causing data leakage:

- **Shipper** grabs consignee data, TCN value, and "(optiona)" text
- **Consignee** grabs transport details, warning text, and "(delete non-applicoble)"

The anchor configs in `anchorConfig.ts` already define `boundedBy` constraints that specify which other anchors should limit a field's region:

```typescript
shipper: { boundedBy: ["phone_number", "consignee", "air_waybill"] }
consignee: { boundedBy: ["airport_departure", "aircraft_type", "shipment_type"] }
additional_handling: { boundedBy: ["emergency_telephone", "name_title_signatory"] }
```

But `findValueBlocks` completely ignores these constraints.

---

## Fix

In `findValueBlocks` (line 179 of `adaptiveRegionDetection.ts`), after computing the initial search area from pixel configs, apply `boundedBy` constraints:

For each bounding anchor that was found:
- If the bounding anchor is **below** the current anchor → constrain `searchArea.maxY` to the bounding anchor's `y` position
- If the bounding anchor is **to the right** → constrain `searchArea.maxX` to the bounding anchor's `x` position

### Example: Shipper

| Anchor | Position | Constraint |
|--------|----------|------------|
| Shipper (self) | (77, 77) | — |
| Consignee (bound) | (74, 210) | Below → maxY = 210 |
| Air Waybill (bound) | (553, 96) | Right → maxX = 553 |
| Phone Number (bound) | Not found | Skipped |

Before fix: searchArea maxY=327, maxX=877 → **15 blocks** (includes consignee + TCN)
After fix: searchArea maxY=210, maxX=553 → **~6 blocks** (shipper only)

### Example: Consignee

| Anchor | Position | Constraint |
|--------|----------|------------|
| Consignee (self) | (74, 210) | — |
| Airport Departure (bound) | (321, 435) | Below → maxY = 435 |
| Shipment Type (bound) | (543, 552) | Right → maxX = 543 |
| Aircraft Type (bound) | Not found | Skipped |

This excludes transport details text, warning text, and other right-side content from the consignee region.

---

## Files modified

- `src/services/sddg/adaptiveRegionDetection.ts` — Apply `boundedBy` in `findValueBlocks`

---

## Testing

Unit tests for the bounding behavior are difficult to write in isolation because `findValueBlocks` requires the full anchor/textBlock infrastructure. Instead:

- Verify via manual scan that shipper and consignee no longer leak data from adjacent fields
- Add a debug log showing the constrained search area for easy verification
- Existing tests should continue to pass (this only tightens search boundaries)
