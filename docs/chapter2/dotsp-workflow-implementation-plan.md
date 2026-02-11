# DOT-SP Workflow Alterations Implementation Plan

## Goal
Implement DOT-SP workflow behavior so it is operationally consistent with AFMAN24-604 Chapter 2 paragraph 2.4 (and 2.3.3 reference where applicable).

## Scope References
- AFMAN refs: 2.4, 2.4.1, 2.4.2, 2.4.3, 2.4.4, 2.4.5
- Related reference: 2.3.3 (Attachment 23, DOT-SP 7573/9232 context)
- Runtime flow entry: `src/components/PackagingScreen.tsx` (wired in `src/components/MainLayoutNavigator.tsx`)

## Step-by-Step Plan

1. Create DOT-SP compliance state model.
- Extend `HazProPreparerContext` (`src/contexts/HazProPreparerProvider/reducer.tsx`) with structured DOT-SP fields:
`isSelected`, `permitNumber`, `documentIds`, `issueDate`, `expirationDate`, `renewalRequested`, `timelyFilingLetterAttached`, `renewalStatementText`, `serviceFocalPointVerified`, `internationalApprovalsAcknowledged`.

2. Enforce single packaging authority selection.
- Use shared `packagingAuthority` enum (`POP | COE | CAA | DOT_SP`).
- Ensure selecting DOT-SP clears COE/CAA active state.

3. Make DOT-SP permit/document mandatory before flow exit.
- In `src/components/DotSpScreen.tsx`, disable `Save & Continue` until:
`permitNumber` exists and at least one DOT-SP document is attached.

4. Add missing DOT-SP form fields.
- Add UI inputs in `src/components/DotSpScreen.tsx` for:
issue date, expiration date, renewal requested, timely filing letter attached.
- Add visible field for waiver/permit description (currently state exists but no input).

5. Implement renewal/timely filing logic for 2.4.1.
- Build validation utility (for example `src/utils/compliance/validateDotSp.ts`) to enforce:
if permit expired and renewal requested, require timely filing continuation letter or required statement plus Service Focal Point verification evidence.

6. Add 2.4.4 international movement checks.
- Add attestation/validation for international approvals when shipment route indicates international movement.
- Block continuation if missing.

7. Add 2.4.3 facility-retention handling.
- Add export/copy action or acknowledgement that a permit copy is retained at each facility where used.
- Persist acknowledgement timestamp.

8. Update SDDG field mapping for DOT-SP.
- In `src/screens/preparer/ShippersDeclarationScreen.tsx`, integrate DOT-SP authority mapping:
`packingInstruction='DOT-SP'` (or organization-standard equivalent),
`authorization=<permitNumber>`.
- Ensure mapping precedence is deterministic when multiple legacy flags exist.

9. Include DOT-SP attachments in export packet.
- Extend SDDG merge logic in `src/screens/preparer/ShippersDeclarationScreen.tsx` to append DOT-SP PDFs when DOT-SP authority is selected.
- Do not allow DOT-SP certify path if required attachments are missing.

10. Add certification gate for 2.4.2.
- In `src/screens/preparer/CertifyFormScreen.tsx`, block certify until DOT-SP accompaniment requirement is satisfied (packet includes permit copy).

11. Add Attachment 23-specific branch support (2.3.3 linkage).
- Add conditional handling for known permit patterns (for example 7573/9232) when shipment context triggers AMC-contracted compatibility scenario.
- Add explicit warning/checklist if that scenario applies.

12. Update marking behavior if required by permit metadata.
- Introduce a permit-driven marking override hook (if permit requires special marks).
- Keep base marking logic in `src/utils/markingRequirements.ts`, then layer DOT-SP overrides from structured permit conditions.

13. Add tests.
- Unit tests:
expiration/renewal logic, SDDG DOT-SP field mapping, authority exclusivity.
- Integration/screen tests:
cannot continue without permit+doc, international approval gate, certify blocked until accompaniment ready.

14. Add migration and documentation updates.
- Migrate legacy shipments that only have `usesDotSpPermit` and `dotSpWaivers`.
- Update preparer architecture docs and chapter2 analysis docs with final behavior.

## Definition of Done
- DOT-SP cannot be selected as shipment authority without required permit metadata and permit document.
- Expired permit flows enforce timely filing/renewal requirements.
- SDDG fields and attachment packet include DOT-SP information when DOT-SP is selected.
- Certification is blocked until DOT-SP accompaniment/compliance checks pass.

