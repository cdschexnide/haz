# Smoke Test Checklists for HazPro Mobile App

## Purpose

These checklists ensure critical user workflows function correctly after each refactoring phase. A smoke test failure means the refactoring must be reverted.

---

## How to Use These Checklists

1. **Before each phase**: Run the relevant smoke tests to establish baseline
2. **After each change**: Run affected smoke tests
3. **Before merging PR**: Run full smoke test suite
4. **Any failure**: Revert changes immediately

### Pass/Fail Criteria
- **PASS**: Workflow completes as expected with no errors
- **FAIL**: Any deviation from expected behavior, error, or crash
- **BLOCKED**: Cannot test due to dependency issue

---

## Checklist 1: Application Launch & Authentication

**When to run**: After ANY code change

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 1.1 | Launch app via `expo start` | Metro bundler starts without errors | [ ] |
| 1.2 | Open app in iOS Simulator | App loads without crash | [ ] |
| 1.3 | Open app in Android Emulator | App loads without crash | [ ] |
| 1.4 | View Login screen | Login screen displays correctly | [ ] |
| 1.5 | Select "Hazardous Material Preparer" role | Role selection works | [ ] |
| 1.6 | Select "Hazardous Material Inspector" role | Role selection works | [ ] |
| 1.7 | Enter user name | Text input accepts input | [ ] |
| 1.8 | Enter rank/title | Text input accepts input | [ ] |
| 1.9 | Submit login form | Proceeds to Acknowledgement screen | [ ] |
| 1.10 | Accept acknowledgement | Proceeds to Home screen | [ ] |
| 1.11 | Open drawer menu | Drawer opens smoothly | [ ] |
| 1.12 | Switch roles via drawer | Role switches without error | [ ] |
| 1.13 | Logout via drawer | Returns to Login screen | [ ] |

**Estimated time**: 5 minutes

---

## Checklist 2: Preparer Home & Navigation

**When to run**: After changes to MainLayout, navigation, or home screen

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 2.1 | Login as Preparer | Home screen loads | [ ] |
| 2.2 | View top navigation bar | TopNavBar displays correctly | [ ] |
| 2.3 | Tap menu button | Drawer opens | [ ] |
| 2.4 | View left panel | Left panel displays current workflow state | [ ] |
| 2.5 | Tap "Create Shipment" | Navigates to ShipmentCreation | [ ] |
| 2.6 | Navigate back | Returns to Home | [ ] |
| 2.7 | Open Dry Ice Calculator | Calculator opens in modal/screen | [ ] |
| 2.8 | Close calculator | Returns to previous view | [ ] |
| 2.9 | Open Gas Calculator | Calculator opens | [ ] |
| 2.10 | Open Unit Conversion Tool | Tool opens | [ ] |
| 2.11 | Open Placarding Tool | Tool opens | [ ] |

**Estimated time**: 5 minutes

---

## Checklist 3: Preparer - Shipment Creation Flow

**When to run**: After changes to shipment or material ID screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 3.1 | Navigate to Shipment Creation | ShipmentCreationScreen loads | [ ] |
| 3.2 | Enter shipment details | Form accepts input | [ ] |
| 3.3 | Select aircraft type | Dropdown works | [ ] |
| 3.4 | Continue to Material ID | Navigation works | [ ] |
| 3.5 | Search for hazmat by UN number | Search returns results | [ ] |
| 3.6 | Select a hazmat material | Material selected, stored in state | [ ] |
| 3.7 | View material details | Details display correctly | [ ] |
| 3.8 | Continue to next step | Workflow progresses | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 4: Preparer - Quantity Entry & Special Provisions

**When to run**: After changes to quantity, packaging, or provision screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 4.1 | Navigate to Quantity Entry | QuantityEntryScreen loads | [ ] |
| 4.2 | Enter quantity value | Input accepts numbers | [ ] |
| 4.3 | Select unit of measure | Dropdown works | [ ] |
| 4.4 | View calculated values | Calculations display | [ ] |
| 4.5 | Continue to Special Provisions | Navigation works | [ ] |
| 4.6 | View special provisions list | List displays correctly | [ ] |
| 4.7 | Acknowledge provisions | Checkbox/button works | [ ] |
| 4.8 | Continue to next step | Workflow progresses | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 5: Preparer - Packaging Workflow

**When to run**: After changes to packaging screens or wizards

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 5.1 | Navigate to Packaging screen | PackagingScreen loads | [ ] |
| 5.2 | Select packaging type | Selection works | [ ] |
| 5.3 | Open Packaging Wizard V2 | Wizard loads | [ ] |
| 5.4 | Navigate through wizard steps | All steps accessible | [ ] |
| 5.5 | Select container type | Selection stored | [ ] |
| 5.6 | View packaging requirements | Requirements display | [ ] |
| 5.7 | Complete packaging selection | Returns to main flow | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 6: Preparer - POP Marking Flow

**When to run**: After changes to POP marking screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 6.1 | Navigate to POP Marking | POPMarkingDataEntry loads | [ ] |
| 6.2 | Enter marking data | Form accepts input | [ ] |
| 6.3 | Select physical state (liquid/solid) | Toggle works | [ ] |
| 6.4 | View marking preview | Preview renders | [ ] |
| 6.5 | Open POP Scanner | Camera screen loads | [ ] |
| 6.6 | Cancel scanner | Returns to data entry | [ ] |
| 6.7 | Save marking data | Data persists | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 7: Preparer - Labeling & Marking

**When to run**: After changes to labeling screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 7.1 | Navigate to Labeling & Marking | LabelingAndMarking loads | [ ] |
| 7.2 | View required labels | Labels display | [ ] |
| 7.3 | View required markings | Markings display | [ ] |
| 7.4 | Toggle label selections | Toggles work | [ ] |
| 7.5 | Continue to certification | Navigation works | [ ] |

**Estimated time**: 5 minutes

---

## Checklist 8: Preparer - Certification & Declaration

**When to run**: After changes to certification or declaration screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 8.1 | Navigate to Certify | CertifyForm loads | [ ] |
| 8.2 | View certification checkboxes | Checkboxes display | [ ] |
| 8.3 | Check all required boxes | Checkboxes work | [ ] |
| 8.4 | Sign with signature pad | Signature captures | [ ] |
| 8.5 | Navigate to Shipper's Declaration | Screen loads | [ ] |
| 8.6 | View declaration form | Form displays | [ ] |
| 8.7 | Generate PDF | PDF generates | [ ] |
| 8.8 | Share/Export PDF | Share sheet opens | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 9: Preparer - Grandfathered Wizard

**When to run**: After ANY changes to GrandfatheredWizard or related components

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 9.1 | Select explosive material requiring grandfathered packaging | Navigation to wizard | [ ] |
| 9.2 | Wizard Step 1 loads | First step displays | [ ] |
| 9.3 | Navigate to Step 2 | Step transition works | [ ] |
| 9.4 | Navigate to Step 3 | Step transition works | [ ] |
| 9.5 | Select container type | Selection works | [ ] |
| 9.6 | Enter container specifications | Inputs work | [ ] |
| 9.7 | View dimension validation | Validation displays | [ ] |
| 9.8 | Navigate through all remaining steps | All steps accessible | [ ] |
| 9.9 | Complete wizard | Returns to main flow with data | [ ] |
| 9.10 | Verify data persisted | Data shows in summary | [ ] |

**Estimated time**: 15 minutes

---

## Checklist 10: Inspector Home & Navigation

**When to run**: After changes to InspectorMainLayout or inspector navigation

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 10.1 | Login as Inspector | InspectorHome loads | [ ] |
| 10.2 | View inspector dashboard | Dashboard displays | [ ] |
| 10.3 | Tap workflow selection | InspectorWorkflowSelection loads | [ ] |
| 10.4 | Select Package Inspection | Navigation works | [ ] |
| 10.5 | Select SDDG Inspection | Navigation works | [ ] |
| 10.6 | Navigate back | Returns to home | [ ] |
| 10.7 | Open drawer | Drawer opens | [ ] |

**Estimated time**: 5 minutes

---

## Checklist 11: Inspector - SDDG Workflow

**When to run**: After changes to SDDG screens or extractors

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 11.1 | Start SDDG inspection | SDDGVerificationScreen loads | [ ] |
| 11.2 | Open camera for scanning | Camera launches | [ ] |
| 11.3 | Capture SDDG document | Photo captured | [ ] |
| 11.4 | View region adjustment | Adjustment screen loads | [ ] |
| 11.5 | Confirm region | Processing starts | [ ] |
| 11.6 | View extracted data | Data displays | [ ] |
| 11.7 | Edit extracted field | Edit modal opens | [ ] |
| 11.8 | Save edited field | Change persists | [ ] |
| 11.9 | Run compliance validation | Validation completes | [ ] |
| 11.10 | View validation results | Results display | [ ] |
| 11.11 | Complete SDDG inspection | Inspection marked complete | [ ] |

**Estimated time**: 15 minutes

---

## Checklist 12: Inspector - Package Verification

**When to run**: After changes to package verification screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 12.1 | Start Package inspection | Initial screen loads | [ ] |
| 12.2 | Answer initial questions | Questions navigate | [ ] |
| 12.3 | Enter hazmat identification | Form works | [ ] |
| 12.4 | Navigate to verification | Screen loads | [ ] |
| 12.5 | View verification checklist | Checklist displays | [ ] |
| 12.6 | Check verification items | Checkboxes work | [ ] |
| 12.7 | Report frustration | Frustration modal opens | [ ] |
| 12.8 | Complete verification | Summary screen loads | [ ] |

**Estimated time**: 10 minutes

---

## Checklist 13: Inspector - AMC 1015 Form

**When to run**: After changes to InspectorAMC1015Form

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 13.1 | Navigate to AMC 1015 | Form loads | [ ] |
| 13.2 | View form sections | All sections display | [ ] |
| 13.3 | Enter Section 1 data | Inputs work | [ ] |
| 13.4 | Enter Section 2 data | Inputs work | [ ] |
| 13.5 | Check packaging checklist | Checkboxes work | [ ] |
| 13.6 | Check labeling checklist | Checkboxes work | [ ] |
| 13.7 | Add comments | Text input works | [ ] |
| 13.8 | Sign form | Signature captures | [ ] |
| 13.9 | Generate PDF | PDF generates | [ ] |
| 13.10 | Share form | Share sheet opens | [ ] |

**Estimated time**: 15 minutes

---

## Checklist 14: Inspector - Specialty Screens

**When to run**: After changes to inspector specialty screens

| # | Test Step | Expected Result | Pass/Fail |
|---|-----------|-----------------|-----------|
| 14.1 | Navigate to Dry Ice Screen | Screen loads | [ ] |
| 14.2 | Navigate to Lithium Batteries | Screen loads | [ ] |
| 14.3 | Navigate to Magnetized Materials | Screen loads | [ ] |
| 14.4 | Navigate to Capacitors | Screen loads | [ ] |
| 14.5 | Navigate to Engines | Screen loads | [ ] |
| 14.6 | Navigate to Battery Powered Vehicle | Screen loads | [ ] |
| 14.7 | Navigate to Life Saving Appliances | Screen loads | [ ] |
| 14.8 | Navigate to Dangerous Goods | Screen loads | [ ] |
| 14.9 | Navigate to Safety Devices | Screen loads | [ ] |
| 14.10 | Navigate to First Aid Kit | Screen loads | [ ] |

**Estimated time**: 10 minutes

---

## Phase-Specific Smoke Test Requirements

### Phase 0: Testing Infrastructure Setup
- Run: Checklist 1 only (verify app still launches)

### Phase 1: Dead Code Removal
**After deleting each file:**
- Run: Checklist 1 (app launch)
- Run: Any checklist related to deleted component's domain

**After deleting SDDG extractors:**
- Run: Checklist 11 (SDDG workflow) completely

### Phase 2: Foundation Setup
- Run: Checklist 1 (verify build still works)

### Phase 3: UI Component Library
- Run: Checklist 1 (verify build still works)

### Phase 4: Type Safety
- Run: Checklist 1 (app launch)
- Run: Affected checklists based on files modified

### Phase 5: Component Migration
**Before modifying ANY component:**
- Run: ALL checklists related to that component

**After modifying:**
- Run: Same checklists
- Compare behavior to baseline

---

## Quick Reference: Checklist by Component

| Component | Checklists to Run |
|-----------|-------------------|
| MainLayout | 1, 2, 3, 4, 5, 6, 7, 8 |
| InspectorMainLayout | 1, 10, 11, 12, 13, 14 |
| GrandfatheredWizard | 1, 9 |
| SDDGUploadAndParse | 1, 11 |
| SDDGTemplateExtractor* | 1, 11 |
| InspectorAMC1015Form | 1, 13 |
| POPMarkingDataEntry | 1, 6 |
| PackagingWizardV2 | 1, 5 |
| ShipmentCreationScreen | 1, 3 |
| MaterialIDScreen | 1, 3 |
| LoginScreen | 1 |
| PreparerHomeScreen | 1, 2 |
| InspectorHomeScreen | 1, 10 |

---

## Smoke Test Log Template

Use this template to document smoke test runs:

```
## Smoke Test Run

**Date**: YYYY-MM-DD
**Tester**: [Name]
**Phase**: [Phase X]
**PR/Branch**: [Branch name or PR #]
**Changes Made**: [Brief description]

### Checklists Run
- [ ] Checklist 1: Application Launch
- [ ] Checklist [X]: [Name]

### Results
**Overall**: PASS / FAIL

**Failed Items**:
- Item X.X: [Description of failure]

**Notes**:
[Any additional observations]

**Conclusion**:
- [ ] Safe to merge
- [ ] Requires fixes
- [ ] Revert changes
```

---

## Emergency Rollback Procedure

If smoke tests fail:

1. **STOP** - Do not continue with more changes
2. **Document** - Record exactly what failed
3. **Revert** - `git revert <commit>` or `git checkout <previous-commit>`
4. **Verify** - Run failed smoke tests again to confirm rollback worked
5. **Investigate** - Determine root cause before attempting again
