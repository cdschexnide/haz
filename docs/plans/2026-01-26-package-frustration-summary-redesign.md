# PackageFrustrationSummary UI/UX Redesign

## Overview

Redesign the PackageFrustrationSummary screen to optimize for "quick scan & decide" workflow. Inspectors need to rapidly assess package frustrations and decide whether to reinspect or continue with frustrations.

## Current Problems

- Each frustration is a separate card taking significant vertical space
- DATE/TIME and INSPECTOR repeat on every card (usually same session/person)
- Visual noise from red icons/borders on every item
- Not optimized for quick scanning

## Design Decisions

| Decision | Choice |
|----------|--------|
| Grouping | Group frustrations by category |
| Metadata | Inline (name + time + inspector on one line) |
| Container | Card per category with items inside |
| Error indication | Colored header bar only (subtle) |
| Header bar color | Soft red `#FEE2E2` with dark text |
| Badge in screen header | Removed |
| Icons per item | Removed |

## Screen Layout

```
┌─────────────────────────────────────────────────┐
│  ✕         Package Frustration Summary         │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ MAGNETIZED MATERIAL             2 items │   │
│  ├─────────────────────────────────────────┤   │
│  │  Handling Separation from Sensitive...  │   │
│  │  Failed Separation from sensitive equip │   │
│  │  1:03 PM · C. Schexnider                │   │
│  │  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  │   │
│  │  Air Eligibility Confirmed              │   │
│  │  Failed air eligibility                 │   │
│  │  1:04 PM · C. Schexnider                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ PACKAGE MARKING                 1 item  │   │
│  ├─────────────────────────────────────────┤   │
│  │  PSN and UN Number                      │   │
│  │  1:04 PM · C. Schexnider                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ PACKAGE LABEL                   1 item  │   │
│  ├─────────────────────────────────────────┤   │
│  │  Magnetized Material                    │   │
│  │  1:04 PM · C. Schexnider                │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
├─────────────────────────────────────────────────┤
│ [Cancel]  [↻ Reinspect]  [Complete w/ Frust...] │
└─────────────────────────────────────────────────┘
```

## Component Specifications

### Category Card Header

- **Background**: `#FEE2E2` (soft red)
- **Text color**: Dark (`colors.textPrimary`)
- **Left**: Category name, bold, uppercase
- **Right**: Item count ("2 items" / "1 item")
- **Padding**: `spacing.sm` vertical, `spacing.md` horizontal
- **Border radius**: Rounded top corners only

### Item Row

Structure:
1. **Title** - Item label, sentence case, `fontWeight: 600`
2. **Description** - Only if `additionalComments` exists, `colors.textSecondary`
3. **Metadata** - Time + Inspector, smaller font, muted, separated by `·`

Styling:
- Card body background: `colors.surface` (white)
- Divider between items: Dashed line, `colors.border`
- Padding per item: `spacing.md`
- No divider after last item

### Footer Actions

Unchanged from current:
- Cancel (outline variant)
- Reinspect (secondary variant, refresh icon)
- Complete with Frustration & Continue (destructive variant)

## Categories

Map `frustration.category` to display labels:

| Category Value | Display Label |
|----------------|---------------|
| `marking` | Package Marking |
| `label` | Package Label |
| `magnetized` | Magnetized Material |
| `dryice` | Dry Ice |
| `packaging` | Packaging |
| `first-aid-chemical-kit` | First Aid / Chemical Kit |
| `life-saving` | Life-Saving Appliances |
| `dangerous-goods-apparatus` | Dangerous Goods in Apparatus |
| `class9-general` | Class 9 General |
| `asbestos` | Asbestos |
| `capacitor` | Capacitors |
| `engines-internal-combustion` | Internal Combustion Engines |
| `consumer-commodity` | Consumer Commodity |
| `misc-dangerous-goods-articles` | Misc Dangerous Goods Articles |
| `fuel-powered-vehicle` | Fuel-Powered Vehicle |
| `battery-vehicle` | Battery-Powered Vehicle |
| `lithium_battery` | Lithium Batteries |
| `lithium_battery_contained` | Lithium Batteries (Contained) |
| `lithium_battery_packed` | Lithium Batteries (Packed) |
| `infectious-substances` | Infectious Substances |
| `biological-category-b` | Biological Category B |

## Implementation Notes

1. Group frustrations using `Object.groupBy()` or reduce by category
2. Order categories consistently (consider alphabetical or by severity)
3. Format inspector name: handle both string and object formats
4. Format time: "1:03 PM" format (no date needed, same session)
5. Empty state kept as fallback but users typically won't see it
