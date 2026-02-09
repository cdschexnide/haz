# CAA Implementation Gaps vs AFMAN24-604 Chapter 2

## Scope
This document maps **AFMAN24-604 Chapter 2, paragraph 2.5 (CAA)** requirements to the current app behavior and identifies what remains to be implemented.

Regulatory source used:
- `docs/chapter2/afman_chapter2.pdf` (sections 2.5 through 2.5.3)

Code paths reviewed:
- `src/screens/preparer/PackagingScreen.tsx`
- `src/components/PackagingScreen.tsx`
- `src/components/CoeAndCaaDisclaimer.tsx`
- `src/components/CoeAndCaaScreen.tsx`
- `src/screens/preparer/ShippersDeclarationScreen.tsx`
- `src/components/MainLayoutNavigator.tsx`

## Important Runtime Note
Current runtime flow enters packaging via `src/components/PackagingScreen.tsx` in `src/components/MainLayoutNavigator.tsx`, not the screen-layer packaging file.

## Requirement Crosswalk

| AFMAN ref | Requirement | Current implementation | Gap |
| --- | --- | --- | --- |
| 2.5 | CAA definition; approvals used domestic/international; approvals must be in English (T-0) | CAA path exists and allows document upload (`src/components/CoeAndCaaScreen.tsx`) | No validation/attestation that approval is in English |
| 2.5.1.1 | Use CAA as packaging authority for military air shipment | CAA flag set on upload (`usesCaaCertification`) | No explicit authority model; can coexist with COE/DOT-SP and produce ambiguous state |
| 2.5.1.2 | Follow all approval requirements | No structured requirement checklist | No enforcement that shipment conditions in CAA are satisfied |
| 2.5.1.3 | Shipping activity provides copy of CAA for each shipment | CAA PDF can be created and stored | User can continue without any CAA doc because `Save & Continue` has no guard |
| 2.5.1.4 (T-0) | CAA must accompany cargo in DTS and be attached to SDDG | Share flow can merge CAA docs into output (`src/screens/preparer/ShippersDeclarationScreen.tsx`) | Attachment is optional; certification can complete even if no SDDG+CAA package was generated |
| 2.5.1.5 | Request copies of existing CAAs per DTR | No DTR request aid in workflow | Missing operational guidance/capture for copy-request path |
| 2.5.2 | Explosive hazard classification approvals (CAA/EX): only usable as packaging authority when packaging requirements are included; attach approval copy to SDDG | No EX-specific fields, no packaging-instruction check, no explosive-approval subtype handling | Cannot verify or enforce this paragraph |
| 2.5.3 | CAA request procedures per referenced directives | No request workflow support | Missing request checklist/guidance capture |

## Additional Functional Gaps Found
- CAA and COE can both remain active; downstream logic prefers COE first in SDDG (`src/screens/preparer/ShippersDeclarationScreen.tsx`), which can silently hide selected CAA intent.
- CAA path stores only free-text document name/number and agency; no structured model for `approvalNumber`, `issuingCountry`, or `approvalType` (`CAA` vs `EX`).
- CAA document attachment is bound to the manual Share action, not to completion/certification requirements.

## Still Needed to Implement

### P0 (Compliance blocking)
- Require at least one CAA document before leaving CAA flow when CAA authority is selected.
- Enforce one active packaging authority at a time (`CAA` or `COE` or `DOT-SP`).
- Gate certification on CAA accompaniment requirement: must have an exportable SDDG package that includes CAA attachment.
- Add CAA-English attestation or validation step per 2.5.

### P1 (High-value compliance support)
- Add structured CAA data model:
`approvalNumber`, `approvalType` (`CAA` or `EX`), `issuingAuthority`, `issuingCountry`, `issueDate`, `expirationDate`.
- Add explosive-specific branch for 2.5.2:
requires checkbox/validation that packaging instructions are present in the approval; block use otherwise.
- Add clear in-app guidance and capture for DTR copy-request procedures.

### P2 (Quality/completeness)
- Add deterministic UI/state handling when user switches authority type mid-flow.
- Add tests for:
document-required gating, EX-without-packaging-instructions rejection, and certify-block when CAA accompaniment is missing.

## Suggested Acceptance Criteria
- CAA path cannot continue without at least one stored CAA/EX approval document.
- If approval type is `EX`, user must attest packaging instructions exist before CAA authority is accepted.
- Generated shipment packet always includes CAA attachment when `usesCaaCertification=true`.
- User cannot certify shipment with unresolved CAA compliance checks.

