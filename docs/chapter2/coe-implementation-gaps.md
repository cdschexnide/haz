# COE Implementation Gaps vs AFMAN24-604 Chapter 2

## Scope
This document maps **AFMAN24-604 Chapter 2, paragraph 2.6 (COE)** requirements to the current app behavior and lists what is still missing for workflow-level consistency.

Regulatory source used:
- `docs/chapter2/afman_chapter2.pdf` (sections 2.6 through 2.6.5)

Code paths reviewed:
- `src/screens/preparer/PackagingScreen.tsx`
- `src/components/PackagingScreen.tsx`
- `src/components/CoeAndCaaDisclaimer.tsx`
- `src/components/CoeAndCaaScreen.tsx`
- `src/screens/preparer/ShippersDeclarationScreen.tsx`
- `src/components/ShippersDeclarationForm.tsx`
- `src/components/MainLayoutNavigator.tsx`

## Important Runtime Note
The app navigator is currently wired to `src/components/PackagingScreen.tsx` (see `src/components/MainLayoutNavigator.tsx`), not `src/screens/preparer/PackagingScreen.tsx`. Any compliance implementation in the screen-layer file alone will not affect runtime behavior.

## Requirement Crosswalk

| AFMAN ref | Requirement | Current implementation | Gap |
| --- | --- | --- | --- |
| 2.6 | COE may be used as shipment authority, if applicable; follow approval requirements | COE flow exists with disclaimer + scan/upload path (`src/components/CoeAndCaaDisclaimer.tsx`, `src/components/CoeAndCaaScreen.tsx`) | No structured enforcement of COE-specific conditions from the approval document |
| 2.6.1 | Shipping activity provides a copy of COE for each shipment | User can scan COE PDF and store it (`src/components/CoeAndCaaScreen.tsx`) | `Save & Continue` does not require a COE document; user can proceed without any COE copy |
| 2.6.2 (T-0) | COE must accompany cargo in DTS | SDDG share flow can merge COE PDFs (`src/screens/preparer/ShippersDeclarationScreen.tsx`) | Merge is optional because `Share SDDG` is optional; user can certify without generating an attachment bundle |
| 2.6.3 | COE route/mode restrictions (domestic APOE/APOD or military-controlled aircraft path) | Restriction text is displayed in warning box (`src/components/CoeAndCaaScreen.tsx`) | Warning only; no eligibility validation against shipment route/mode data |
| 2.6.4 | COE not for international commercial air shipments unless specific exceptions; may need additional approvals | Warning text shown (`src/components/CoeAndCaaScreen.tsx`) | No system enforcement or required attestation for exemption/extra approvals |
| 2.6.5 | COE approvals for forbidden materials require coordination with Service Focal Point and AFMC/A4RT | No dedicated workflow/data capture | No capture of coordination authority, date, reference memo, or approval evidence |

## Additional Functional Gaps Found
- `src/components/CoeAndCaaScreen.tsx` can leave both `usesCoeCertification` and `usesCaaCertification` true across edits; no exclusivity rule.
- `src/components/ShippersDeclarationForm.tsx` renders COE additional text using `coeApprovalEntity`, but this field is not set anywhere in this workflow; COE sentence can render with undefined authority text.
- COE path does not set a compliance state that blocks certification when COE conditions are unmet.

## Still Needed to Implement

### P0 (Compliance blocking)
- Enforce **COE document required** before exiting COE flow when COE authority is selected.
- Enforce **single authority selection** for packaging authority (`COE` vs `CAA` vs `DOT-SP`) with deterministic conflict resolution.
- Add **pre-certification guard**: if COE is selected, block `Certify` until a COE attachment package is generated/validated as accompanying shipment documents.
- Implement **route/mode eligibility validator** for 2.6.3 and 2.6.4 using shipment route data and explicit military-controlled/commercial transport flag(s).

### P1 (High-value compliance support)
- Capture COE metadata separately from filename:
`coeNumber`, `issuingAuthority`, `issueDate`, `expirationDate`, `applicabilityNotes`.
- Add attestation/checklist that all COE conditions in the approval were reviewed and met.
- Add workflow for 2.6.5 coordination evidence when material is forbidden or otherwise requires higher-level approval.

### P2 (Quality/completeness)
- Fix COE additional handling text source to use actual captured authority metadata.
- Add tests for all gating scenarios (document missing, route invalid, multiple authorities selected, certify without COE bundle).

## Suggested Acceptance Criteria
- Selecting COE without an attached COE document prevents progress past COE screen.
- International commercial conditions that violate 2.6.4 block COE usage unless exemption/approval evidence is provided.
- `ShippersDeclarationScreen` and exported PDF always show consistent COE authority metadata.
- `Certify` is blocked until required COE accompaniment checks pass.

