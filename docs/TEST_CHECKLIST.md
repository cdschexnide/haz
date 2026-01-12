# Functional Parity Test Checklist

**Version:** 1.0
**Date:** 2026-01-07
**Purpose:** Verify no functionality is lost during performance optimization

---

## Overview

This checklist ensures 100% functional parity after the SQLite schema normalization. All tests should pass both **before** and **after** the migration. Any regression is a blocker.

### Test Categories

1. [Data Integrity Tests](#1-data-integrity-tests)
2. [CRUD Operations](#2-crud-operations)
3. [Inspection Workflow](#3-inspection-workflow)
4. [Frustration System](#4-frustration-system)
5. [List & Search](#5-list--search)
6. [Reinspection Flow](#6-reinspection-flow)
7. [Edge Cases](#7-edge-cases)
8. [Performance Validation](#8-performance-validation)

---

## Pre-Migration Baseline

Before starting migration, capture baseline metrics:

- [ ] Export 5 sample inspections as JSON (various status, frustration counts)
- [ ] Record list load time with current implementation
- [ ] Record single inspection load time
- [ ] Record save operation time
- [ ] Screenshot InspectorHomeScreen with test data
- [ ] Document any existing known issues

---

## 1. Data Integrity Tests

### 1.1 Field-by-Field Verification

For each migrated inspection, verify all fields match:

**Inspection Metadata:**
- [ ] `id` matches exactly
- [ ] `status` matches ('in-progress' | 'completed' | 'frustrated')
- [ ] `inspectedAt` date matches (allow ±1 second for conversion)
- [ ] `tcn` matches
- [ ] `unId` matches
- [ ] `properShippingName` matches
- [ ] `sddgStatus` matches
- [ ] `packageStatus` matches (including NULL for not-started)
- [ ] `totalFrustrations` count matches
- [ ] `sddgFrustrations` count matches
- [ ] `packageFrustrations` count matches

**Inspector Info:**
- [ ] `inspector.inspectorName` matches
- [ ] `inspector.inspectorRank` matches (including NULL)
- [ ] `inspector.inspectorTitle` matches (including NULL)

**SDDG Data:**
- [ ] All 22 ExtractedSDDGContent fields match
- [ ] `verificationCopy` matches (if different from extracted)
- [ ] `originalImageUri` matches

**ML Results (when present):**
- [ ] `bestPopMarking` fields match
- [ ] `allDetectedLabels` array matches
- [ ] `allUnNumbers` array matches
- [ ] `imagesProcessed` count matches
- [ ] `perImageResults` count and content match

### 1.2 Count Verification

- [ ] Total inspection count matches: `SELECT COUNT(*) FROM inspector_shipments` vs `SELECT COUNT(*) FROM inspections_v2`
- [ ] SDDG frustration count matches per inspection
- [ ] Package frustration count matches per inspection
- [ ] Reinspection attempt count matches per frustration

---

## 2. CRUD Operations

### 2.1 Create (Save New Inspection)

**Test: Save new inspection with all data**

Steps:
1. Create new inspection via SDDG workflow
2. Complete SDDG phase with 2 frustrations
3. Continue to package phase
4. Add 3 package frustrations
5. Complete inspection
6. Verify in database

Expected:
- [ ] Inspection record created in `inspections_v2`
- [ ] SDDG data stored in `inspection_sddg_data`
- [ ] ML results stored in `inspection_ml_results`
- [ ] 2 SDDG frustrations in `sddg_frustrations`
- [ ] 3 package frustrations in `package_frustrations`
- [ ] All counts correct on main record

### 2.2 Read (Load Inspection)

**Test: Load inspection and display correctly**

Steps:
1. Load existing inspection from list
2. Navigate through all screens
3. Verify data displays correctly

Expected:
- [ ] InspectorHomeScreen shows correct metadata
- [ ] SDDGInspectionCompleteScreen shows correct SDDG data
- [ ] MLDetectionScreen shows correct detections
- [ ] POP marking screen shows correct values
- [ ] Markings/Labels screen shows correct validation status
- [ ] Frustration summary shows all frustrations

### 2.3 Update (Modify Inspection)

**Test: Update inspection status**

Steps:
1. Load in-progress inspection
2. Complete package phase
3. Verify status updated

Expected:
- [ ] `status` changed to 'completed'
- [ ] `packageStatus` changed to 'verified' or 'frustrated'
- [ ] `updated_at` timestamp changed
- [ ] Other fields unchanged

**Test: Add frustration to existing inspection**

Steps:
1. Load inspection with 1 frustration
2. Add new SDDG frustration
3. Verify counts updated

Expected:
- [ ] New frustration record created
- [ ] `sddg_frustrations_count` incremented
- [ ] `total_frustrations` incremented
- [ ] Existing frustration unchanged

### 2.4 Delete (Remove Inspection)

**Test: Delete inspection and verify cascade**

Steps:
1. Note inspection ID with frustrations
2. Delete inspection via app
3. Verify all related data removed

Expected:
- [ ] Main inspection record deleted
- [ ] SDDG data deleted (cascade)
- [ ] ML results deleted (cascade)
- [ ] SDDG frustrations deleted (cascade)
- [ ] Package frustrations deleted (cascade)
- [ ] Reinspection attempts deleted (cascade)

---

## 3. Inspection Workflow

### 3.1 New Inspection - Complete Flow

- [ ] Start new inspection from home screen
- [ ] Upload SDDG image
- [ ] Adjust regions (if needed)
- [ ] OCR processing completes
- [ ] Review extracted fields
- [ ] Continue to package phase
- [ ] Capture package images
- [ ] ML detection runs
- [ ] Review POP marking
- [ ] Review markings & labels
- [ ] Complete inspection
- [ ] Verify saved in database

### 3.2 Save & Exit (Partial Inspection)

- [ ] Start new inspection
- [ ] Complete SDDG phase
- [ ] Click "Save & Exit"
- [ ] Verify inspection saved with status='in-progress'
- [ ] Verify packageStatus=NULL
- [ ] Return to home screen
- [ ] Inspection appears in list with correct status

### 3.3 Continue Partial Inspection

- [ ] Load inspection with status='in-progress'
- [ ] Click on Package "N/A" column
- [ ] Confirm continue dialog
- [ ] MLDetectionScreen loads
- [ ] Complete package phase
- [ ] Verify status updated to 'completed'

---

## 4. Frustration System

### 4.1 SDDG Frustrations

**Test: Add SDDG frustration**

- [ ] Navigate to InteractiveSDDGComplianceScreen
- [ ] Tap field to frustrate
- [ ] Enter frustration details
- [ ] Confirm frustration added
- [ ] Navigate to SDDGFrustrationSummary
- [ ] Frustration appears in list

**Test: Remove SDDG frustration**

- [ ] Navigate to frustration summary
- [ ] Remove frustration
- [ ] Verify count decremented
- [ ] Frustration no longer in list

### 4.2 Package Frustrations

**Test: Add marking frustration**

- [ ] Navigate to InspectorMarkingsLabelsValidationScreen
- [ ] Tap "Frustrate" on a marking
- [ ] Verify frustration created with category='marking'

**Test: Add label frustration**

- [ ] Navigate to InspectorMarkingsLabelsValidationScreen
- [ ] Tap "Frustrate" on a label
- [ ] Verify frustration created with category='label'

**Test: POP marking frustration**

- [ ] Navigate to InspectorPOPMarkingValidationScreen
- [ ] Mark as missing or frustrate a field
- [ ] Verify frustration created with correct itemId

### 4.3 Material-Specific Frustrations

Test each material-specific screen creates correct frustration category:

- [ ] Dry Ice (UN1845): category='dryice'
- [ ] Magnetized (UN2807): category='magnetized'
- [ ] Lithium Batteries (UN3480/3090): category='lithium_battery'
- [ ] Life-Saving Appliances (UN3072/2990): category='life-saving'
- [ ] Safety Devices (UN3268): category='safety-device'
- [ ] Capacitors (UN3508): category='capacitor'
- [ ] Engines (UN3528/3529): category='engines-internal-combustion'
- [ ] GMO (UN3245): category='gmo'
- [ ] First Aid Kit (UN3316): category='first-aid-chemical-kit'
- [ ] Dangerous Goods (UN3363): category='dangerous-goods-apparatus'
- [ ] Battery Vehicle (UN3171): category='battery-vehicle'

---

## 5. List & Search

### 5.1 List Display

**Test: InspectorHomeScreen table**

- [ ] All inspections appear
- [ ] TCN column shows correct value
- [ ] PSN column shows correct value
- [ ] SDDG status column shows 'Verified' or 'Frustrated'
- [ ] Package status column shows 'Verified', 'Frustrated', or 'N/A'
- [ ] Status colors correct (green/red/gray)
- [ ] Sorted by inspected_at DESC

### 5.2 Filtering

- [ ] Filter by status='in-progress' shows only in-progress
- [ ] Filter by status='completed' shows only completed
- [ ] Filter by status='frustrated' shows only frustrated
- [ ] Filter by inspector shows only that inspector's inspections
- [ ] Clear filters shows all inspections

### 5.3 Search

- [ ] Search by TCN finds correct inspection
- [ ] Search by UN ID finds correct inspection
- [ ] Search by PSN (partial) finds correct inspections
- [ ] Search by inspector name finds correct inspections
- [ ] Empty search shows all inspections

### 5.4 Pagination (If Implemented)

- [ ] First page shows correct count
- [ ] Navigate to next page shows next batch
- [ ] Navigate to previous page returns to correct batch
- [ ] Total count displayed correctly

---

## 6. Reinspection Flow

### 6.1 SDDG Reinspection

**Test: Reinspect SDDG frustration (Verify)**

Steps:
1. Load inspection with SDDG frustration
2. Click on SDDG "Frustrated" status
3. Navigate to frustration
4. Reinspect and verify
5. Confirm resolution

Expected:
- [ ] Frustration moved to resolvedFrustrations
- [ ] `resolved=1` in database
- [ ] `resolved_at` timestamp set
- [ ] Reinspection attempt record created
- [ ] `sddg_frustrations_count` decremented
- [ ] `total_frustrations` decremented

**Test: Reinspect SDDG frustration (Still Frustrated)**

Steps:
1. Load inspection with SDDG frustration
2. Reinspect and still frustrated
3. Confirm still frustrated

Expected:
- [ ] Frustration remains in frustrations array
- [ ] Reinspection attempt record created with action='frustrated'
- [ ] Counts unchanged

### 6.2 Package Reinspection

**Test: Reinspect package frustration**

- [ ] Load inspection with package frustration
- [ ] Navigate to PackageFrustrationSummary
- [ ] Click "Reinspect"
- [ ] Resolve frustration
- [ ] Verify moved to resolved
- [ ] Verify counts updated

### 6.3 Reinspection History

- [ ] View frustration details
- [ ] Reinspection history shows all attempts
- [ ] Each attempt shows date, inspector, action
- [ ] History ordered chronologically

---

## 7. Edge Cases

### 7.1 Empty States

- [ ] No inspections: Home screen shows appropriate message
- [ ] No frustrations: Frustration summary handles gracefully
- [ ] No ML results: Screens handle null mlAnalysisResults
- [ ] No POP marking detected: POP screen shows "Not Detected" state

### 7.2 Maximum Data

- [ ] Inspection with 20+ frustrations loads correctly
- [ ] Inspection with 10+ reinspection attempts on single frustration
- [ ] Inspection with 6 images and full ML results
- [ ] List with 100+ inspections (pagination if implemented)

### 7.3 Null/Optional Fields

- [ ] `packageStatus=NULL` displays as "N/A"
- [ ] `inspector.inspectorRank=NULL` handled gracefully
- [ ] `correctValue=NULL` on frustration handled
- [ ] `additionalComments=NULL` on frustration handled
- [ ] `afmanReference=NULL` on package frustration handled

### 7.4 Special Characters

- [ ] PSN with special characters (e.g., "FUZES, DETONATING") displays correctly
- [ ] TCN with dashes displays correctly
- [ ] Comments with newlines stored and displayed correctly

### 7.5 Date Handling

- [ ] Dates display in correct timezone
- [ ] Old inspections (year 2025) display correctly
- [ ] Future dates (if any) handled gracefully
- [ ] Date sorting works correctly

---

## 8. Performance Validation

### 8.1 Timing Benchmarks

Compare before/after for each operation:

| Operation | Before | After | Target | Pass? |
|-----------|--------|-------|--------|-------|
| List 20 inspections | ___ms | ___ms | < Before | [ ] |
| Load single inspection | ___ms | ___ms | < Before | [ ] |
| Save new inspection | ___ms | ___ms | < 1.2x Before | [ ] |
| Update status only | ___ms | ___ms | < 0.5x Before | [ ] |
| Add frustration | ___ms | ___ms | < 0.5x Before | [ ] |
| Search inspections | ___ms | ___ms | < Before | [ ] |

### 8.2 Memory Usage

- [ ] List view memory usage similar or lower
- [ ] No memory leaks after repeated load/unload
- [ ] App doesn't crash with 100+ inspections

### 8.3 UI Responsiveness

- [ ] List scrolling smooth (60 FPS)
- [ ] No visible delay on status tap
- [ ] No spinner for simple operations
- [ ] Pull-to-refresh completes quickly

---

## Sign-Off

### Phase 2: Tables Created

- [ ] All tests in section 2 pass
- [ ] Old table unchanged
- Tester: ____________ Date: ____________

### Phase 3: Dual-Write Active

- [ ] All tests in sections 2-6 pass
- [ ] Data matches between old and new tables
- Tester: ____________ Date: ____________

### Phase 4: Data Migrated

- [ ] All tests in section 1 pass (data integrity)
- [ ] Row counts match
- Tester: ____________ Date: ____________

### Phase 5: Reads Switched

- [ ] ALL tests pass
- [ ] Performance targets met
- [ ] Feature flag can toggle back (verified)
- Tester: ____________ Date: ____________

### Phase 6: Cleanup Complete

- [ ] ALL tests pass (final verification)
- [ ] Old table removed
- [ ] No orphaned code
- Tester: ____________ Date: ____________

---

## Rollback Verification

If rollback needed:

- [ ] Set feature flag to use old table
- [ ] Verify all functionality works with old table
- [ ] No data loss during rollback
- [ ] Document rollback reason

---

## Notes

Space for tester notes, edge cases found, issues discovered:

```
Date: _______________
Tester: _____________

Notes:
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
_____________________________________________________________________
```

---

*Test checklist generated by Claude Code - Performance Optimization Agent*
