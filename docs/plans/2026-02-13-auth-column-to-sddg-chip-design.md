# Auth Column → SDDG Doc Chip Redesign

**Date:** 2026-02-13
**Status:** Design approved

## Problem

The inspections table has a dedicated "Auth" column for COE/CAA/DOT-SP status. These authorizations are used infrequently, so the column wastes horizontal space in most rows (showing "None"). Additionally, "Auth" is a misnomer — COE is a certification, CAA is an approval, DOT-SP is a special permit.

## Solution

Remove the Auth column. Instead, show a small label chip below the SDDG Doc icon when a COE/CAA/DOT-SP is attached to the inspection.

### Normal inspection (no authorization)

SDDG Doc cell: blue `file-document` icon only. No change.

### Inspection with COE/CAA/DOT-SP

SDDG Doc cell: blue `file-document` icon + small pill chip below showing `"COE"`, `"CAA"`, or `"DOT-SP"`.

Chip styling:
- fontSize 9, fontWeight 700
- Horizontal padding 4, vertical padding 1
- Background: `colors.infoLight`
- Text: `colors.primary`
- borderRadius: `borderRadius.sm`
- Centered under the icon

The chip appears in both normal mode (under the doc icon) and selection mode (under the checkbox).

### Table columns after change

TCN | UN/NA/ID | Proper Shipping Name | SDDG | Package | Inspector | SDDG Doc | AMC 1015

## Files

- Modify: `src/screens/inspector/InspectorHomeScreen.tsx`
  - Remove Auth header cell
  - Remove Auth column rendering
  - Add chip to SDDG Doc cell
  - Add styles: `sddgDocCell`, `authChip`, `authChipText`
  - Remove styles: `authColumn`, `authBadgeText`, `authBadgeActive`, `authBadgePending`, `authBadgeNone`, `authHeaderCell`

No database or schema changes.
