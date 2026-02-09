# DOT-SP Implementation Gaps vs AFMAN24-604 Chapter 2

## Scope
This document maps **AFMAN24-604 Chapter 2, paragraph 2.4 (DOT Special Permits)** requirements to current app behavior and lists missing implementation work.

Regulatory source used:
- `docs/chapter2/afman_chapter2.pdf` (sections 2.4 through 2.4.5)
- `docs/chapter2/afman_chapter2.pdf` paragraph 2.3.3 reference to Attachment 23 and DOT-SP 7573/9232

Code paths reviewed:
- `src/screens/preparer/PackagingScreen.tsx`
- `src/components/PackagingScreen.tsx`
- `src/components/DotSpScreen.tsx`
- `src/screens/preparer/ShippersDeclarationScreen.tsx`
- `src/utils/markingRequirements.ts`
- `src/components/MainLayoutNavigator.tsx`

## Important Runtime Note
The runtime packaging route is still `src/components/PackagingScreen.tsx` in `src/components/MainLayoutNavigator.tsx`.

## Requirement Crosswalk

| AFMAN ref | Requirement | Current implementation | Gap |
| --- | --- | --- | --- |
| 2.4 | DOT-SP is authority to deviate from 49 CFR; use for military-controlled air movement if applicable; follow permit requirements | DOT-SP upload screen exists and stores permit number + scanned PDF (`src/components/DotSpScreen.tsx`) | No applicability validator for military-controlled movement and no permit-condition checklist |
| 2.4.1 | Copy of permit for each shipment; expired permit requires timely filing continuation letter or renewal statement after Service Focal Point verification | No fields for permit expiration, renewal evidence, timely-filing letter, or Service Focal Point verification | Entire renewal/timely-filing branch is missing |
| 2.4.2 (T-0) | Permit must accompany cargo in DTS | DOT-SP docs are stored in context | DOT-SP docs are not merged into SDDG export flow; accompaniment is not enforced at certification |
| 2.4.3 | Maintain copy of permit at each facility where used | Permit is saved with shipment context | No facility-level retention workflow/attestation/export |
| 2.4.4 | DOT-SP may not cover international exceptions; additional approvals may be required | No international warning/validation step in DOT-SP workflow | Missing international additional-approval capture/gating |
| 2.4.5 | Forward requests for new or copied permits according to DTR | No request workflow support | Missing operational guidance/capture for request path |
| 2.3.3 | AMC-contracted incompatible material movement references DOT-SP 7573/9232 (Attachment 23) | Generic DOT-SP entry only | No dedicated logic for 7573/9232 conditions or Attachment 23 scenario checks |

## Additional Functional Gaps Found
- `usesDotSpPermit` is set in `src/components/DotSpScreen.tsx` but is not integrated into SDDG packing instruction/authorization derivation (`src/screens/preparer/ShippersDeclarationScreen.tsx` only checks COE/CAA).
- `ShippersDeclarationScreen` merges only COE/CAA attachments, never DOT-SP attachments.
- `Save & Continue` in `src/components/DotSpScreen.tsx` allows progression without any DOT-SP document.
- `waiverDescription` state exists but has no input field in the UI, so stored description is effectively always empty.
- `src/utils/markingRequirements.ts` has no DOT-SP-specific marking/annotation path; only COE/CAA suppress POP marking.

## Still Needed to Implement

### P0 (Compliance blocking)
- Make DOT-SP authority visible in SDDG data:
`packingInstruction='DOT-SP'` (or equivalent fielding) and `authorization=<permit number>`.
- Include DOT-SP attachments in shipment packet generation (same enforcement level as CAA/COE attachments, not optional-only).
- Require at least one DOT-SP document and permit number before leaving DOT-SP flow when DOT-SP is selected.
- Add single-authority enforcement (`DOT-SP` vs `COE` vs `CAA`).

### P1 (High-value compliance support)
- Add DOT-SP metadata model:
`permitNumber`, `issueDate`, `expirationDate`, `renewalRequested`, `timelyFilingLetterAttached`, `renewalStatementText`, `serviceFocalPointVerification`.
- Implement 2.4.1 branch logic:
if expired and renewal requested, require timely filing letter or required statement with verification evidence.
- Add international movement warning/gating for 2.4.4 with required additional-approval attestation.
- Add explicit Attachment 23 branch for DOT-SP 7573/9232 where applicable.

### P2 (Quality/completeness)
- Add `waiverDescription` input or remove dead state.
- Add DOT-SP coverage tests:
SDDG field propagation, attachment merge behavior, expiration branch validation, and certification blocks.

## Suggested Acceptance Criteria
- DOT-SP selections populate SDDG authorization fields with permit number.
- DOT-SP documents are included in the final generated shipment packet whenever DOT-SP authority is selected.
- Expired permit path cannot proceed without timely filing letter or required renewal statement + verification metadata.
- Certification is blocked if DOT-SP-required accompaniment checks fail.

