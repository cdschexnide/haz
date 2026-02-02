# A5 Ralph Wiggum Loop Change Log

Log of changes made while reconciling `server/attachment5/documentNodes/A5.ts` (source of truth) with `packagingDatabaseV2` entries and Inspector access behavior.

---

## A5.10.
- Added `intermediatePackaging` definition to `A5.10.combination` to match the source table (bags in metal receptacles, metal drums, or wood receptacles).
- Updated restriction wording to include T-0 markers for temperature, box mass, and drum volume limits.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.11.
- Fixed `referencedParagraphs` to include trailing period.
- Updated packaging type selection expectation to combination-only (single option removed earlier to match source; only conditional inner-packaging exemptions remain).

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
- `src/utils/__tests__/packagingTypeSelection.test.ts`
## A5.12.
- Fixed `referencedParagraphs` to include trailing periods.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.13.
- Removed unsupported single-packaging option; source only specifies boxes/drums with conditional inner-packaging exemptions.
- Fixed `referencedParagraphs` to include trailing period.
- Updated packaging type selection expectation to combination-only.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
- `src/utils/__tests__/packagingTypeSelection.test.ts`
## A5.14.
- Removed unsupported single-packaging option; source only allows boxes/drums with conditional inner-packaging exemptions.
- Fixed `referencedParagraphs` to include trailing period.
- Updated packaging type selection expectation to combination-only.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
- `src/utils/__tests__/packagingTypeSelection.test.ts`
## A5.15.
- Fixed `referencedParagraphs` to include trailing periods.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.16.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.17.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.18.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.19.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.20.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.21.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.22.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.23.
- Added `applicableUNNumbers` to `A5.23.un0101_restricted` to enforce UN0101-only packaging option.
- Fixed `referencedParagraphs` to include trailing period.
- Updated packaging type and code validation to prefer explicit UN-scoped options when present.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
- `src/utils/getAllowedPackagingTypes.ts`
- `src/utils/packagingWizardV2Helpers.ts`
## A5.24.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.25.
- Fixed `referencedParagraphs` to include trailing period.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.26.
- Fixed `referencedParagraphs` to include trailing periods for A5.26, A5.26.1, and A5.26.2.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
## A5.27.
- Fixed `referencedParagraphs` to include trailing periods for A5.27, A5.27.1, and A5.27.2.

Files:
- `server/lookupFunctions/packagingLookupV2.ts`
