# A9 Ralph Wiggum Loop Log

## A9.5.
**Status**: UPDATED
**Changes**:
- Fixed composite plastic drum code from `6HH1` to `6HH` to match A9.5.3. source (source says "6HA1, 6HB1, 6HG1, 6HH, or 6HD1")
- Fixed referencedParagraphs from `["A3.3.5", "A20.3"]` to `["A3.3.5.", "A20.3."]` (added trailing periods)
**Files Modified**:
- `server/lookupFunctions/packagingLookupV2.ts`
**Tests**: N/A

## A9.6.
**Status**: UPDATED
**Changes**:
- Fixed referencedParagraphs from `["A3.3.5"]` to `["A3.3.5."]` (added trailing period)
- All packaging options (combination, single, composite_plastic, composite_glass, cylinders) verified correct against source
- A9.6.3 correctly uses `6HH1` (unlike A9.5.3 which uses `6HH`) matching the source of truth
- PG I restrictions for single packaging (plywood drums, wood barrels, certain boxes, bags) verified correct
**Files Modified**:
- `server/lookupFunctions/packagingLookupV2.ts`
**Tests**: N/A

## A9.7.
**Status**: VERIFIED
**Changes**:
- No changes needed. Cylinder option with acetylene restriction matches source exactly.
- referencedParagraphs is empty array, correct (source has no paragraph references).
**Files Modified**:
- None
**Tests**: N/A

## A9.8.
**Status**: UPDATED
**Changes**:
- Fixed referencedParagraphs from `["2.5"]` to `["2.5."]` (added trailing period)
- CAA approval packaging option and special requirements verified correct against source
**Files Modified**:
- `server/lookupFunctions/packagingLookupV2.ts`
**Tests**: N/A

## A9.9.
**Status**: VERIFIED
**Changes**:
- No changes needed. All 8 specification cylinder codes (3A150, 3AA150, 3B240, 3BN150, 3E1800, 4B240, 4BA240, 4BW240) match source exactly.
- Special requirements (handling warning, valve sealing, no pressure relief device, 3E1800 overpack) all verified correct.
- referencedParagraphs is empty array, correct.
**Files Modified**:
- None
**Tests**: N/A

## A9.10.
**Status**: UPDATED
**Changes**:
- Added missing "(T-0)" to A9.10.1 approval requirement description (source: "in accordance with the procedures specified in 49 CFR Section 173.56. (T-0).")
- Added missing "(T-0)" to A9.10.3.2 PBE conditional requirement description (source ends with "(T-0).")
- Packaging options (49 CFR Part 178 and ATA Spec 300), all special requirements (drop test, actuation prevention, flame/thermal tests, expiration), and conditional requirements (PBE vs non-PBE) verified correct
- referencedParagraphs contain external CFR/ATA references (no trailing periods needed as these are not document paragraph IDs)
**Files Modified**:
- `server/lookupFunctions/packagingLookupV2.ts`
**Tests**: N/A
