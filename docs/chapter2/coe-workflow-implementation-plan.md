# COE Workflow Alterations Implementation Plan

## Goal
Implement COE workflow behavior so it is operationally consistent with AFMAN24-604 Chapter 2 paragraph 2.6.

## Scope References
- AFMAN refs: 2.6, 2.6.1, 2.6.2, 2.6.3, 2.6.4, 2.6.5
- Runtime flow entry: `src/components/PackagingScreen.tsx` (wired in `src/components/MainLayoutNavigator.tsx`)

## Step-by-Step Plan

1. Create COE compliance state model.
- Add a structured COE object in `HazProPreparerContext` (`src/contexts/HazProPreparerProvider/reducer.tsx`) with fields:
`isSelected`, `documentIds`, `coeNumber`, `issuingAuthority`, `issueDate`, `expirationDate`, `routeEligibilityValidated`, `internationalExceptionValidated`, `coordinationRequired`, `coordinationEvidence`.
- Keep backward compatibility with existing `usesCoeCertification` and `coeAndCaaDocuments` while migrating.

2. Enforce single packaging authority selection.
- Add a single `packagingAuthority` enum (`POP | COE | CAA | DOT_SP`) in context.
- Update selection logic in `src/components/PackagingScreen.tsx` and `src/components/CoeAndCaaScreen.tsx` so selecting COE clears CAA/DOT-SP active flags.

3. Split COE and CAA interaction paths.
- Keep shared scanner UI if desired, but make authority-specific validation logic explicit.
- In `src/components/CoeAndCaaScreen.tsx`, branch COE checks separately from CAA checks.

4. Require COE document presence before continuing.
- In `src/components/CoeAndCaaScreen.tsx`, disable `Save & Continue` for COE unless at least one COE doc exists.
- Add inline error summary when missing.

5. Add route/mode eligibility validation for 2.6.3.
- Build `validateCoeRouteEligibility(context)` in a new utility file (for example `src/utils/compliance/validateCoe.ts`).
- Validate APOE/APOD and movement mode rules against shipment and transport metadata.
- Block continue if route/mode is not eligible.

6. Add international commercial restrictions for 2.6.4.
- Add explicit inputs/attestation for allowed exception pathways (UN-spec exemption or military-controlled airlift path).
- Gate continuation on completion.

7. Add coordination evidence workflow for 2.6.5.
- Add conditional section in COE flow for forbidden-material coordination evidence:
Service Focal Point, AFMC/A4RT coordination reference, date, and notes.
- Require this section only when triggering conditions are met.

8. Update marking requirements behavior.
- Keep POP suppression for COE (`src/utils/markingRequirements.ts`) but make it driven by `packagingAuthority === COE`.
- Ensure no accidental POP requirements reappear when COE is selected.

9. Update SDDG field mapping for COE.
- In `src/screens/preparer/ShippersDeclarationScreen.tsx`, map COE authority from structured fields:
`packingInstruction='COE'`, `authorization=<coeNumber>`.
- Ensure additional handling text in `src/components/ShippersDeclarationForm.tsx` uses populated authority metadata instead of undefined `coeApprovalEntity`.

10. Enforce accompaniment requirement before certification (2.6.2).
- Add a compliance gate in `src/screens/preparer/CertifyFormScreen.tsx`:
if `packagingAuthority === COE`, block `Certify` until required COE attachment package has been generated/validated.
- Persist a `shipmentPacketReady` or equivalent boolean when packet generation completes.

11. Add deterministic attachment packaging behavior.
- In SDDG share/export flow (`src/screens/preparer/ShippersDeclarationScreen.tsx`), require COE docs when COE is selected.
- Fail fast with actionable message if docs are missing.

12. Add test coverage.
- Unit tests:
`validateCoeRouteEligibility`, authority exclusivity reducer logic, SDDG mapping.
- Integration/screen tests:
COE with no document, invalid route, international exception path, missing coordination evidence, certify blocked/unblocked states.

13. Add migration and telemetry.
- Add lightweight migration for old shipments that only have `usesCoeCertification`.
- Log compliance gate failures (non-PII) for field troubleshooting.

14. Update docs and QA scripts.
- Update `docs/architecture/preparer-workflow.md` for COE branch specifics.
- Add QA checklist for each AFMAN 2.6 subparagraph condition.

## Definition of Done
- COE can only be used when route/mode and exception checks pass.
- COE requires attached document(s) and accompanies the shipment packet.
- SDDG fields consistently show COE authority data.
- Certification is blocked when COE compliance requirements are incomplete.

