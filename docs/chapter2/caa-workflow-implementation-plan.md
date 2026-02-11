# CAA Workflow Alterations Implementation Plan

## Goal
Implement CAA workflow behavior so it is operationally consistent with AFMAN24-604 Chapter 2 paragraph 2.5.

## Scope References
- AFMAN refs: 2.5, 2.5.1.1, 2.5.1.2, 2.5.1.3, 2.5.1.4, 2.5.1.5, 2.5.2, 2.5.3
- Runtime flow entry: `src/components/PackagingScreen.tsx` (wired in `src/components/MainLayoutNavigator.tsx`)

## Step-by-Step Plan

1. Create CAA compliance state model.
- Add structured CAA fields in `HazProPreparerContext` (`src/contexts/HazProPreparerProvider/reducer.tsx`):
`isSelected`, `documentIds`, `approvalNumber`, `approvalType` (`CAA` or `EX`), `issuingAuthority`, `issuingCountry`, `languageConfirmedEnglish`, `packagingRequirementsIncluded`, `requirementsReviewed`.

2. Enforce single packaging authority selection.
- Introduce/consume `packagingAuthority` enum (`POP | COE | CAA | DOT_SP`).
- Ensure CAA selection clears COE and DOT-SP authority flags.

3. Make CAA document mandatory before flow exit.
- In `src/components/CoeAndCaaScreen.tsx`, disable CAA `Save & Continue` until at least one CAA/EX document is attached.
- Add clear user feedback for missing document.

4. Add CAA metadata capture fields.
- Extend CAA form inputs in `src/components/CoeAndCaaScreen.tsx`:
approval number, approval type, issuing country/agency, issue/expiration date.
- Store structured values separate from free-text filename.

5. Add English-language confirmation for 2.5.
- Add explicit attestation checkbox that approval is in English.
- Block continuation if unchecked.

6. Add requirement review checkpoint for 2.5.1.2.
- Add a checklist section where preparer confirms all CAA conditions were reviewed and met.
- Persist checklist completion in context.

7. Implement explosive approval branch for 2.5.2.
- If `approvalType === EX` or material class/division starts with `1`, require explicit confirmation that packaging instructions are included in approval.
- Prevent using EX/CAA as packaging authority when packaging instructions are absent.

8. Update marking requirements behavior.
- Preserve POP suppression for CAA via authority-driven logic in `src/utils/markingRequirements.ts`.
- Base suppression on `packagingAuthority === CAA`, not only legacy boolean flags.

9. Update SDDG field mapping for CAA.
- In `src/screens/preparer/ShippersDeclarationScreen.tsx`, set:
`packingInstruction='CAA'`, `authorization=<approvalNumber>`.
- Ensure display and export are sourced from structured CAA metadata.

10. Enforce accompaniment requirement before certification (2.5.1.4).
- Add a certification gate in `src/screens/preparer/CertifyFormScreen.tsx`:
if `packagingAuthority === CAA`, block certify until attachment package includes CAA docs.

11. Strengthen export packaging logic.
- In SDDG generation flow (`src/screens/preparer/ShippersDeclarationScreen.tsx`), require CAA docs when CAA authority is selected.
- Treat missing CAA docs as a blocking validation error.

12. Add DTR request guidance hooks (2.5.1.5 and 2.5.3).
- Add read-only guidance panel or support action links for requesting copies/new CAAs per referenced procedures.
- Capture optional request reference number for audit trail.

13. Add test coverage.
- Unit tests:
approval-type validation, EX packaging-instruction enforcement, authority exclusivity.
- Integration/screen tests:
CAA missing doc, English confirmation missing, EX without packaging instructions, certification gate behavior.

14. Add migration + documentation updates.
- Migrate legacy `usesCaaCertification` shipments into new authority model.
- Update `docs/architecture/preparer-workflow.md` with CAA-specific gating and SDDG behavior.

## Definition of Done
- CAA cannot be used without a valid attached CAA/EX document and required attestations.
- EX approvals without packaging instructions are rejected as packaging authority.
- CAA attachment accompanies the shipment packet when CAA is selected.
- Certification is blocked until all CAA compliance checks are complete.

