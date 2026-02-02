# Material Workflow Matrix

Living checklist for end-to-end Inspector workflow coverage by material. Each row is a material-specific walkthrough with expected SDDG keys, package requirements, and target frustrations. Update after each rehearsal run.

## Legend
- Status: Not started | In progress | Pass | Fail | Blocked
- Evidence: link to notes, screenshots, or run log (if available)

---

## Matrix

| Material | UN | Class/Div | Packaging Paragraph | Special Provisions | Subsidiary Risk | SDDG Key Expectations (7,11-17) | Package Requirements | Target Frustrations | Status | Evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| BARIUM AZIDE (dry or wetted <50% water) | UN0224 | 1.1A | A5.4 | P3, 111, 117 | 6.1 | K7 CAO; K11 UN0224; K12 PSN includes moisture clause; K13 1.1A; K14 6.1; K15 empty; K16 qty + packaging + NEW; K17 A5.4 | Labels: Explosive 1.1A, Toxic 6.1, CAO. Markings: UN0224, PSN, EX number, MSL. POP: A5.4 allowed codes; PG X/Y | Missing 6.1 label; K14 empty; POP code not in A5.4; PG Z | Not started |  |
| NITROCELLULOSE, PLASTICIZED (≥18% plasticizer) | UN0343 | 1.3C | A5.5 | P4 | None | K7 CAO; K11 UN0343; K12 PSN includes plasticizer %; K13 1.3C; K14 empty; K15 empty; K16 qty + packaging + NEW; K17 A5.5 | Labels: Explosive 1.3C, CAO. Markings: UN0343, PSN, EX number, MSL. POP: A5.5 allowed codes; PG X/Y | K12 missing plasticizer clause; label division mismatch; missing CAO; K17 wrong | Not started |  |

---

## Notes
- Source of material details: `src/hazardousMaterials/hazardousMaterialsList.ts`
- Reference scenarios: `src/testScenarios/class1-packaging-paragraphs.md`

## How to update this matrix
- After each rehearsal, fill Status + Evidence and note any deviations in a short addendum below the table.
- Add new materials as new rows in the matrix.

## Run Addenda

- (YYYY-MM-DD) — Material: UNXXXX — Notes:
  -
