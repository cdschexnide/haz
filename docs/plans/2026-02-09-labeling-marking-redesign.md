# LabelingAndMarking Screen UI/UX Redesign

**Date:** 2026-02-09
**Type:** UI/UX Refactor
**File:** `src/screens/preparer/LabelingAndMarkingScreen.tsx`
**Target Device:** Tablet-first (iPad). Not designed for phone portrait.

---

## Problem

The current LabelingAndMarking screen has poor UI/UX:

1. **Flat layout** — plain text rows with no visual hierarchy or emphasis
2. **No hazard pictograms** — hazard labels are internationally recognized diamond symbols, but the screen just shows text like "5.1"
3. **3D preview buried at bottom** — forces scrolling, disconnected from the requirements it visualizes
4. **Redundant info buttons** — every row has an (i) icon, but they all open the same modal
5. **No material context** — no indication of which material/UN number this is for without scrolling

## User Context

Preparers use this screen in two contexts:
- **At a desk** — reviewing requirements before going to the package
- **At the package** — referencing while physically applying labels and markings

The design must be scannable, high-contrast, and readable at a glance on a tablet.

---

## Design

### Overall Layout: Two-Column Side-by-Side (Tablet)

```
┌──────────────────────────────────────────────────────────────────┐
│  Labeling & Marking Requirements                    [i Regs]    │
│  UN2719 · BARIUM BROMATE · Class 5.1                            │
├─────────────────────────────────┬────────────────────────────────┤
│                                 │                                │
│   (Scrollable left column)      │   (Fixed right column)         │
│                                 │                                │
│   Required Labels section       │   UnityPackagePreview          │
│   Required Markings section     │   (unchanged component,        │
│                                 │    just repositioned)          │
│                                 │                                │
├─────────────────────────────────┴────────────────────────────────┤
│  [Cancel]           [Save & Exit]           [Save & Continue]    │
└──────────────────────────────────────────────────────────────────┘
```

- **Left column (~45%):** Scrollable list of requirement cards
- **Right column (~55%):** `UnityPackagePreview` pinned in place, not scrolling
- **ActionFooter:** Full-width at bottom, unchanged
- **Single info button** in header area opens the existing `DocumentModal`

### Header Area

- Screen title: "Labeling & Marking Requirements"
- Subtitle: `{UNID} · {Proper Shipping Name} · Class {hazclassDiv}` — immediate material context
- Single info button (top-right) opens `DocumentModal` with packaging regulation content
- Replaces the per-row (i) buttons that all opened the same modal

### Required Labels — Card-Based with Inline Pictograms

**Hazard class labels (Primary Hazard, Subsidiary Risk):**

```
┌─────────────────────────────────────────┐
│  ┌──────┐                               │
│  │ ◆◆◆◆ │  Primary Hazard               │
│  │ 5.1  │  Oxidizer                      │
│  │ ◆◆◆◆ │                               │
│  └──────┘                               │
└─────────────────────────────────────────┘
```

- 48x48 hazard diamond thumbnail from existing assets in `assets/hazmatPngs/primaryHazardLabels/`
- Right side: label type bold, hazard class name in secondary text
- White card with subtle border

**Hazard class normalization:**
- Class 1 values include compatibility letters (e.g., `"1.1D"`, `"1.3G"`). The image lookup strips the trailing letter to find the base image (e.g., `"1.1D"` → lookup `"1.1"`).
- Classes 5.2 and 7 are never encountered in this app (out of scope materials) — no images mapped for these.
- If no image is found for a hazclass value, the card renders with a Material Icon fallback (`warning` icon) instead of a blank space.

**Multi-value subsidiary risks:**
- Real data includes comma-separated subsidiary risk values like `"2.1, 8"`.
- Each subsidiary risk value renders as a **separate card** with its own diamond pictogram.
- Example: subsidiary risk `"2.1, 8"` → two cards: one with flammable gas diamond, one with corrosive diamond.

**Non-pictogram labels (MSL, Cargo Aircraft Only):**

```
┌─────────────────────────────────────────┐
│  🚚  Military Shipping Label (MSL)      │
│      or DD Form 1387                    │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  ✈  Cargo Aircraft Only                │
│     Required per special provision P3   │
└─────────────────────────────────────────┘
```

- Material Icon on the left (`local-shipping` for MSL, `flight` for CAO)
- Title bold, subtitle in secondary text
- CAO card gets `warningLight` background tint — it's a restriction that must not be missed

### Required Markings — Prominent Text Cards

**Proper Shipping Name & UN Number:**

```
┌─────────────────────────────────────────┐
│  Proper Shipping Name & UN Number       │
│                                         │
│  BARIUM BROMATE UN2719                  │
└─────────────────────────────────────────┘
```

- Title in secondary text
- Marking value large, bold, monospace-style — mimics stenciled text on the package
- Easy to read at a glance while at the package

**POP Marking:**

```
┌─────────────────────────────────────────┐
│  POP Marking                            │
│                                         │
│  UN / 4G / Y / 75 / S / 24 / USA / AB  │
└─────────────────────────────────────────┘
```

- Same pattern: title + large formatted marking string
- Assembled from `inputPOPMarking` fields A-H when available
- Falls back to "Stenciled and/or printed" ONLY for POP marking type when metadata is empty

**Label-only markings (no stencil value):**
- Some markings are label-only identifiers with no stencil value (e.g., "Limited Quantity", "OVERPACK", kit markings).
- These render with just the label name — no fallback text, no "Stenciled and/or printed" message.

### Section Headers

Use existing `SectionHeader` component with count badge (e.g., "Required Labels" with "4" badge) for quick scope indication.

### Special Cases

**Vehicle (UN3166):** Left column shows existing `VehicleLabelingNotice` InfoBox instead of any cards. Right column still shows 3D preview. No other changes.

**Limited Quantity (DEFERRED):** LQ functionality is intentionally disabled in the current codebase (`isLimitedQuantity = false`). The `InfoBox` warning banner code path exists but will not trigger. Re-enabling LQ is out of scope for this UI refactor.

**Excepted Quantity (DEFERRED):** EQ auto-navigation is intentionally disabled in the current codebase. Re-enabling EQ is out of scope for this UI refactor.

---

## What Changes

| Item | Change |
|------|--------|
| `LabelingAndMarkingScreen.tsx` | Two-column layout, header with subtitle + single info button |
| `StandardLabelingContent.tsx` | Complete redesign — card-based labels with inline diamond thumbnails, prominent marking text, remove per-row info buttons, multi-value subsidiary risk parsing |
| `src/utils/hazardDiamondImages.ts` | New utility mapping hazclass-div strings to existing PNG assets in `assets/hazmatPngs/` |

## What Does NOT Change

| Item | Reason |
|------|--------|
| `UnityPackagePreview.tsx` | Identical component, just repositioned into right column |
| `ActionFooter` | Identical, full-width at bottom |
| `DocumentModal` | Identical, triggered from one button instead of many |
| `VehicleLabelingNotice` | Unchanged |
| Navigation handlers | `handleCancel`, `handleSaveAndExit`, `handleSaveAndContinue` — identical |
| State writes | `activeStep = 3`, `completedSubsteps` — identical |
| `prepareShipmentData()` | Unchanged — still passed to UnityPackagePreview |
| LQ/EQ disabled logic | Remains disabled — out of scope for this refactor |

---

## Asset Strategy

**No new assets needed.** Existing hazard diamond PNGs in `assets/hazmatPngs/primaryHazardLabels/` are used via `require()`. The mapping utility resolves hazclass-div strings to the correct file path within that existing directory structure.

Covered hazard classes (all that are in scope for this app):

| hazclassDiv | Asset Path |
|-------------|------------|
| `1` through `1.6` (+ compatibility letters) | `hazardClass1/explosives1.X.png` |
| `2.1`, `2.2`, `2.3` | `hazardClass2/*.png` |
| `3` | `hazardClass3/flammableLiquidHazmatClass3.png` |
| `4.1`, `4.2`, `4.3` | `hazardClass4/*.png` |
| `5.1` | `hazardClass5/oxidizerHazmatClass5.1.png` |
| `6.1`, `6.2` | `hazardClass6/*.png` |
| `8` | `hazardClass8/corrosiveHazmatClass8.png` |
| `9` | `hazardClass9/miscellaneousHazmatClass9.png` |

**Not mapped (out of scope):** Class 5.2 (Organic Peroxide), Class 7 (Radioactive) — these materials are not supported by this app.
