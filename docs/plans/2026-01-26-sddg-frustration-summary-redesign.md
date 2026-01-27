# SDDGFrustrationSummary UI/UX Redesign

## Overview

Redesign the SDDGFrustrationSummary screen to match the improved PackageFrustrationSummary design. Keep individual cards (SDDG frustrations don't have natural categories) but apply the same spacing, layout, and visual improvements.

## Current Problems

- Error icon on every card adds visual noise
- Value comparison boxes use more space than needed
- Metadata (Date/Time, Inspector) stacked vertically wastes horizontal space
- Overall layout feels inconsistent with the new Package design

## Design Decisions

| Decision | Choice |
|----------|--------|
| Card structure | Keep individual cards (no grouping) |
| Error indication | Subtle colored top border only |
| Value comparison | Keep side-by-side but cleaner |
| Metadata layout | Two-column with labels above values |
| Badge in screen header | Remove |
| Icons per card | Remove |

## Card Layout

```
┌─────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │  ← Red top border (colors.error)
├─────────────────────────────────────────┤
│  Proper Shipping Name                   │  ← Field label, bold
│                                         │
│  ┌──────────────┐  ┌──────────────┐    │
│  │ INCORRECT    │  │ SHOULD BE    │    │
│  │ Flamable Gas │  │ Flammable Gas│    │
│  └──────────────┘  └──────────────┘    │
│                                         │
│  DATE/TIME              INSPECTOR       │
│  Jan 26, 2026 1:03 PM   C. Schexnider  │
└─────────────────────────────────────────┘
```

## Component Specifications

### Card Container

- **Background**: `colors.surface` (white)
- **Border**: 1px `colors.border`, rounded corners
- **Top border**: 3px `colors.error` (red accent)
- **Padding**: `spacing.lg`
- **Shadow**: `shadows.light`

### Field Label (Title)

- Font size: 17
- Font weight: 700
- Color: `colors.textPrimary`
- No icon

### Value Comparison Row

- Two equal-width boxes side by side
- Gap: `spacing.md`
- Each box:
  - Background: `colors.background`
  - Border: 1px `colors.border` (incorrect) / `colors.success` (correct)
  - Padding: `spacing.md`
  - Border radius: `borderRadius.md`

### Value Box Labels

- "INCORRECT" / "SHOULD BE"
- Font size: 11
- Font weight: 600
- Color: `colors.textSecondary`
- Letter spacing: 0.5
- Text transform: uppercase

### Value Text

- Font size: 15
- Font weight: 700
- Color: `colors.error` (incorrect) / `colors.success` (correct)

### Metadata Row

- Two columns with `flexDirection: "row"` and `gap: spacing.xl`
- Each column has label above value
- Label: uppercase, 11px, `colors.textSecondary`
- Value: 14px, `colors.textPrimary`

## Implementation Notes

1. Remove error icon from card header
2. Remove badge from ScreenHeader
3. Add red top border to card instead of full border
4. Convert metadata to two-column layout matching Package design
5. Keep value comparison boxes but clean up spacing
