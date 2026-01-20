# Inspector Workflow Plan: Attachment 19 (Excepted & Limited Quantities)

## Goal
Add first-class support in the Inspector workflow for Excepted Quantities (EQ) and Limited Quantities (LQ) per AFMAN24-604 Attachment 19, while respecting marking and labeling rules from Attachment 14 and Attachment 15.

## Source Summary (A19 + A14 + A15)

### Excepted Quantities (A19.2)
- **Disallowed materials (A19.2.1):** Class 1; Class 2.1/2.3; Class 2.2 with subsidiary hazard; aerosols; Class 4 PG I; Class 4.1 self-reactive; Class 5 PG I (except in kits); Class 6.1 PG I (inhalation); Class 6.2; Class 7; Class 8 PG I plus UN2803/UN2809; Class 9 magnetized material, dry ice, lithium batteries; “hazmat in device” items; items marked “Cargo Aircraft Only.”
- **Quantity limits (A19.2.2 + Table A19.1):** Per class/PG inner and outer limits; special notes for Class 2.2 water capacity, Class 5 kits, Class 8 UN exclusions, Class 9 PG defaults.
- **Packaging requirements (A19.2.3–A19.2.12):** Inner packaging materials and closures, intermediate packaging/cushioning, outer packaging strength and size (>=100mm), compatibility, no mixing with regulated hazmat, Q-value formula for mixed materials, performance tests (drop + stack).
- **Marking (A19.2.13):** Only the EQ “E” marking (100mm square, class/division + shipper/consignee). **A14/A15/A17 do not apply** to EQ shipments (A19.2.13.3).

### Limited Quantities (A19.3)
- **Not permitted (A19.3.1):** Forbidden items; PG I; Class 1/7 (except 1.4S per 49 CFR 173.63); Class 2.3/6.2; most Class 2.1/2.2 except specific UNs; refrigerated liquefied gases; Class 4.1 self-reactive; Class 4.2; Class 8 UN2794/2795/2803/2809/3028; Class 9 except specific list; “Cargo Aircraft Only.”
- **Permitted list (A19.3.2):** Specific class allowances and specific UNs (notably Class 9 list).
- **Packaging (A19.3):** Combination packaging only; gross weight <=30 kg; general packaging requirements per A3; limits per Table A19.2; mixed-material rules (A19.3.3); performance tests (A19.3.4); liquids must meet A3.1.7.
- **Marking/Labeling/Certification (A19.3.5):** **A14/A15/A17 apply**; A15.2.7 requires labels for each dangerous good. UN specification packaging/POP marking is not required (per A19.3 general rule).

## Current Inspector Workflow Impact
- Inspector flow assumes SDDG is always present and enforces POP marking + A14/A15 labeling/marking requirements.
- EQ shipments are exempt from A14/A15/A17 and may not require SDDG at all, which is currently unsupported.
- LQ shipments still require labels/markings, but **not POP marking**, and must enforce LQ quantity limits and combination packaging rules.

## Proposed Implementation Plan

### 1) Add Quantity Type State to Inspector Context
- **Add to InspectionFormProvider state:**
  - `quantityType: "standard" | "excepted" | "limited"`
  - `exceptedQuantityData?: ExceptedQuantityData`
  - `limitedQuantityData?: LimitedQuantityData`
- Populate from SDDG where possible; allow manual entry for missing quantities.
- Persist in saved inspection records and include in inspection summary views.

### 2) Determine Eligibility (EQ/LQ) After SDDG Verification
- **New helper module (shared):**
  - `evaluateAttachment19Eligibility(input)` that returns:
    - `isExceptedEligible`, `isLimitedEligible`, `exclusionReason`, `permissionReason`
    - references to A19.2.1.x and A19.3.1.x / A19.3.2.x for traceability
  - Use data from:
    - `hazardousMaterialsList` (hazclass, PG, subsidiary risk, special provisions)
    - `extractedContentFromSddg` (UN/NA, PSN, hazard class, packing group)
    - Quantity entries (inner, outer, gross weight, physical state)
    - CAO flags (`aircraftType` or P1–P4 special provisions)
- **Rules to encode:**
  - A19.2.1 exclusions (including CAO and specific UNs)
  - A19.3.1 exclusions and A19.3.2 allowed list
  - A19.2.2 / A19.3 quantity limits with unit conversions
  - A19.2.11 Q-value formula for mixed EQ materials
  - A19.3.3 mixed LQ rules (lowest limit, no Q-value)

### 3) Add Quantity Type Assessment Screen
- **New Inspector screen** after SDDG compliance:
  - Auto-calc EQ/LQ eligibility with explanation (A19 refs).
  - Collect missing data: number of inner packages, inner quantity, total outer quantity, gross weight, kit exception, mixture entries.
  - Allow inspector to confirm or override (with justification).
  - Persist decision to `quantityType` and data structs.

### 4) Modify Package Inspection Routing
- **Standard flow (existing):** ML Detection → POP → Markings/Labels → Material-specific → Summary.
- **EQ flow:**
  - Skip POP and A14/A15 marking/label validation.
  - New screens:
    - `InspectorExceptedQuantityPackagingScreen` (A19.2.3–A19.2.12 checklist)
    - `InspectorExceptedQuantityMarkingScreen` (A19.2.13 “E” marking + size/color/shipper/consignee)
  - Allow ML capture for evidence only (optional), but do not auto-frustrate labels/markings.
- **LQ flow:**
  - Skip POP marking data entry (A19.3).
  - Add `InspectorLimitedQuantityPackagingScreen`:
    - Combination packaging only
    - Gross weight <=30 kg
    - Quantity limits per Table A19.2
    - Performance test checks (A19.3.4)
  - Continue Markings/Labels validation, but include LQ marking/label requirements.

### 5) Update Marking & Label Requirements (Inspector)
- **Marking requirements (A14 + A19):**
  - EQ: only E marking (A19.2.13) and no A14 requirements.
  - LQ: A14 applies + LQ marking (if required by A14 policy) but no POP marking.
  - Update `evaluateMarkingRequirementsInspector` to honor `quantityType`.
- **Labeling requirements (A15 + A19):**
  - EQ: no hazard labels (A15.2.8).
  - LQ: hazard labels for each DG (A15.2.7) + CAO if required (but LQ disallowed if CAO).
  - Update `evaluateLabelingRequirements` to return empty for EQ, and to enforce LQ label set.

### 6) Add A19 Quantity Tables to Client Logic
- Add client-friendly data for Table A19.1 and Table A19.2 (inner/outer limits).
- Use existing `server/attachment19/tables` as source of truth; create a shared JSON or TS export in `src/data` for inspector screens.
- Build a small unit conversion utility (mL↔L, g↔kg, kg↔lb) for comparisons.

### 7) Frustration Mapping and Form 1015
- Decide Form 1015 mapping for EQ/LQ-specific failures:
  - **Option A:** map to existing “Other” (Field 75) with clear comments.
  - **Option B:** add new mapping entries if appropriate AFMAN line items exist.
- Add new frustration categories:
  - `excepted-quantity-packaging`
  - `excepted-quantity-marking`
  - `limited-quantity-packaging`
  - `limited-quantity-labeling`
- Update `sddgToForm1015Mapping.ts` and AMC 1015 screen rendering to include these.

### 8) Data Entry and Evidence Capture
- For EQ and LQ packaging screens, add:
  - Required fields and calculations (inner/outer quantities, gross weight).
  - Checkbox attestations for performance tests (drop/stack), compatibility, and packaging construction.
  - Optional photo capture of marking/packaging for evidence (store as attachments if supported).

### 9) Tests and Validation
- **Unit tests:**
  - Eligibility (A19.2/A19.3) with representative UNs and PGs.
  - Table A19.1 and A19.2 limit checks.
  - Marking/labeling requirements for EQ/LQ in inspector.
- **Flow tests:**
  - EQ flow bypasses A14/A15 validation and POP.
  - LQ flow bypasses POP but still requires labels and standard markings.

## Phased Delivery
1) Data + eligibility engine + inspector context flags.  
2) Quantity assessment screen and routing updates.  
3) EQ/LQ packaging screens + marking/labeling adjustments.  
4) Frustration mapping + AMC 1015 updates + tests.  

## Open Decisions
- EQ inspections without SDDG: allow a “No SDDG / EQ-only inspection” start path?
- Whether to reuse preparer EQ/LQ components for inspector (read-only vs. inspector-specific checklist).
- Form 1015 mapping for EQ/LQ failures (Field 75 vs. new mapping entries).
