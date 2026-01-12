# Prompt: Create Class 2 (Gases) Test Scenarios

Use this prompt with a new Claude Code instance to generate comprehensive test scenarios for Class 2 hazardous materials.

---

## Prompt

```
This is a mobile app used for hazardous material inspection. The Inspector persona workflow is defined in docs/architecture/inspector-workflow-and-ml-detection.md. Read this file first to understand the inspection workflow. The application's business logic is built on AFMAN24-604.

I need you to create 20 comprehensive test scenarios for Class 2 (Gases) materials. These are manual test scenarios - I will physically run through the app with these scenarios, not Jest tests.

Each test scenario should include:
1. **Material Details**: UN number, PSN, hazard class/division, packaging paragraph, special provisions
2. **Expected SDDG Inspection (Successful)**: What each SDDG Key should contain for a passing inspection
3. **Expected Package Inspection (Successful)**: Required labels, markings, and POP marking validation
4. **Alterations**: 2-3 intentional errors per scenario to test frustration handling (e.g., missing labels, wrong SDDG fields, incorrect packaging codes, wrong packing group on POP marking)

## Required Research

Before writing the scenarios, you must read and analyze these AFMAN24-604 attachments:

1. **Attachment 6** (docs/attachment6/afmanAttachment6.pdf) - Packaging instructions for Class 2 (Gases)
   - Contains A6.xx paragraphs with allowed packaging codes
   - Covers Division 2.1 (Flammable), 2.2 (Non-flammable/Non-toxic), 2.3 (Toxic)

2. **Attachment 14** (docs/attachment14/attachment14.pdf) - Marking requirements
   - PSN and UN Number marking requirements
   - Special markings for specific materials

3. **Attachment 15** (docs/attachment15/attachment15.pdf) - Labeling requirements
   - Primary hazard labels for Class 2 divisions
   - Subsidiary hazard labels
   - Cargo Aircraft Only labels
   - Orientation labels (if applicable)

4. **Attachment 17** (server/attachment17/attachment17.pdf) - SDDG certification requirements
   - Table A17.1 with all Keys 1-22
   - Key 11: UN Number
   - Key 12: PSN (with technical name for N.O.S. entries)
   - Key 13: Class and Division
   - Key 14: Subsidiary Risk
   - Key 15: Packing Group
   - Key 16: Quantity and Type of Packing
   - Key 17: Packaging Instructions (A6.xx for Class 2)

Also read:
- src/hazardousMaterials/hazardousMaterialsList.ts - to find diverse Class 2 materials from Table A4.1
- src/utils/labelingRequirementsInspector.tsx - to understand labeling logic
- src/utils/markingRequirementsInspector.ts - to understand marking logic
- server/lookupFunctions/packagingLookupV2.ts - to understand packaging validation

## Class 2 Division Reference

| Division | Description | Label Color |
|----------|-------------|-------------|
| 2.1 | Flammable Gas | Red |
| 2.2 | Non-flammable, Non-toxic Gas | Green |
| 2.3 | Toxic Gas | White |

## Key Differences from Class 1

- Class 2 materials DO have Packing Groups (I, II, or III) - this appears in SDDG Key 15
- POP marking packing group codes: X (PG I/II/III), Y (PG II/III), Z (PG III only)
- No EX number marking (that's Class 1 only)
- Different packaging codes (cylinders like 3A, 3AA, 3AL, 3B, etc.)
- Some Class 2 materials have subsidiary risks (e.g., 2.3 with 8 Corrosive)

## Scenario Diversity Requirements

Ensure the 20 scenarios cover:
- All three divisions (2.1, 2.2, 2.3)
- Materials with subsidiary risks
- N.O.S. entries requiring technical names
- RQ (Reportable Quantity) materials
- Materials with P1-P4 special provisions (Cargo Aircraft Only)
- Materials with P5 special provision (Passenger and Cargo Aircraft allowed)
- Various packing groups (I, II, III)
- Different packaging types (cylinders, pressure receptacles)
- Cryogenic liquids (if applicable)
- Poison Inhalation Hazard (PIH) materials in Division 2.3

## Output

Write the complete test scenarios document to:
docs/plans/2026-XX-XX-class2-test-scenarios-design.md

(Replace XX-XX with the current date)

Use the same format as the Class 1 test scenarios in docs/plans/2026-01-09-class1-test-scenarios-design.md for consistency. Include:
- Overview section explaining the document purpose
- Class 2 Division reference table
- Key validation points summary
- All 20 scenarios with full details
- Quick reference table for alteration categories
- Test execution notes
- Division and feature coverage summaries
```

---

## Notes for the New Instance

- The brainstorming skill (`/superpowers:brainstorm`) can help structure the research and design process
- Present the design in sections for validation before writing the final document
- Use subagents to parallelize research (reading materials list, labeling logic, marking logic, packaging validation)
- Read the PDFs carefully - they contain the authoritative AFMAN requirements
- Reference the Class 1 test scenarios document for format consistency
