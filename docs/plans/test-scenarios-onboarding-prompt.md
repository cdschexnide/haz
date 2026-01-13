# Prompt: Understand the HazPro Test Scenarios Library

Use this prompt with a new Claude Code instance to familiarize them with the existing test scenarios for hazardous material inspection.

---

## Task Overview

This is a mobile app used for hazardous material inspection by US Air Force personnel. The application's business logic is built on **AFMAN 24-604** (Air Force Manual for Preparing Hazardous Materials for Military Air Shipments).

Your task is to **explore and understand** the existing test scenarios library. These are **manual test scenarios** - they define how to physically test the app with various hazardous materials, not automated Jest tests.

---

## Required Research

Use subagents to explore and study these files in parallel:

### 1. Inspector Workflow (Start Here)

Read this file first to understand the inspection workflow:
- `docs/architecture/inspector-workflow-and-ml-detection.md`

This document explains:
- The two-phase inspection process (SDDG Processing → Package Inspection)
- ML detection system for labels
- OCR extraction for markings
- POP marking validation
- Frustration (non-compliance) handling
- AMC Form 1015 generation

### 2. Test Scenario Files

Explore all files in `src/testScenarios/` directory. Each file covers a different hazard class:

| File | Hazard Class | Description |
|------|--------------|-------------|
| `class1.md` | Class 1 | Explosives (Divisions 1.1-1.6) |
| `class2.md` | Class 2 | Gases (Divisions 2.1, 2.2, 2.3) |
| `class3.md` | Class 3 | Flammable Liquids |
| `class4.md` | Class 4 | Flammable Solids (Divisions 4.1, 4.2, 4.3) |
| `class5.md` | Class 5 | Oxidizers & Organic Peroxides (Divisions 5.1, 5.2) |
| `class6.md` | Class 6 | Toxic & Infectious (Divisions 6.1, 6.2) |
| `class8.md` | Class 8 | Corrosives |
| `class9.md` | Class 9 | Miscellaneous Dangerous Goods |

**Note:** Class 7 (Radioactive) may not be present - this is intentional as radioactive materials have separate handling procedures.

---

## What to Extract from Each Test Scenario File

For each class file, understand and summarize:

### Document Structure
1. **Overview Section** - Purpose, class reference table, key validation points
2. **Scenarios (typically 20 per class)** - Individual test cases
3. **Quick Reference Tables** - Alteration categories, coverage summaries
4. **Test Execution Notes** - Before/during/after testing guidance

### Per-Scenario Structure
Each scenario follows this format:
- **Material Details Table**: UN number, PSN, hazard class/division, packing group, packaging paragraph, special provisions
- **Expected SDDG Inspection Table**: Keys 7, 11-17 expected values
- **Expected Package Inspection**: Labels required, markings required, POP marking validation
- **Alterations Table**: 2-3 intentional errors to test frustration handling

### Class-Specific Patterns
Note the differences between classes:
- **Divisions**: Classes 1, 2, 4, 5, 6 have divisions; Classes 3, 8, 9 do not
- **Packing Groups**: Varies by class (Class 1 has none, Class 9 varies by material)
- **Special Markings**: EX numbers (Class 1), Inhalation Hazard (Class 6), Lithium marks (Class 9)
- **Packaging Instructions**: A5.xx (Class 1), A6.xx (Class 2), A7.xx (Class 3), etc.

---

## Key Concepts to Understand

### SDDG Keys
The Shipper's Declaration for Dangerous Goods has 22 keys. Test scenarios focus on:
- **Key 7**: Aircraft Limitations (Cargo Aircraft Only vs Passenger and Cargo)
- **Key 11**: UN/NA/ID Number
- **Key 12**: Proper Shipping Name (with technical names for N.O.S.)
- **Key 13**: Class and Division
- **Key 14**: Subsidiary Hazard
- **Key 15**: Packing Group
- **Key 16**: Quantity and Type of Packing
- **Key 17**: Packaging Instructions

### Package Inspection Elements
- **Labels**: Primary hazard, subsidiary hazard, CAO, orientation
- **Markings**: UN number, PSN, technical names, special markings
- **POP Marking**: UN specification packaging marking with:
  - Field A: UN symbol
  - Field B: Packaging code (e.g., 4G, 1A1)
  - Field C: Packing group code (X, Y, or Z)
  - Fields D-H: Manufacturer info, certifications

### Alterations (Frustration Testing)
Each scenario includes intentional errors to test the app's ability to detect non-compliance:
- Wrong division/compatibility group
- Missing labels or markings
- SDDG key errors
- Packaging code mismatches
- Packing group code errors

---

## Output Requirements

After exploring all files, provide a summary that includes:

1. **Inventory**: List all test scenario files found with line counts
2. **Coverage Matrix**: Which hazard classes are covered, how many scenarios each
3. **Common Patterns**: Shared structure across all files
4. **Class-Specific Notes**: Unique aspects of each hazard class's scenarios
5. **Gaps or Inconsistencies**: Any missing classes or incomplete scenarios
6. **Alteration Coverage**: Types of frustration tests across all classes

---

## How to Execute This Research

```
Launch parallel subagents to:

1. Read and summarize docs/architecture/inspector-workflow-and-ml-detection.md
   - Focus on the inspection phases and validation logic

2. List all files in src/testScenarios/ directory
   - Note file names, sizes, modification dates

3. For each test scenario file found, extract:
   - Number of scenarios
   - Hazard class/divisions covered
   - Unique aspects (special markings, packing group rules, etc.)
   - Sample alteration types

4. Compile findings into a comprehensive summary
```

---

## Important Notes

1. **These are MANUAL test scenarios** - they guide human testers through the app, not automated tests
2. **AFMAN 24-604 is the regulatory basis** - all requirements come from this Air Force manual
3. **PDF attachments are the source of truth** - scenarios are derived from:
   - Attachment 5-13: Packaging instructions by class
   - Attachment 14: Marking requirements
   - Attachment 15: Labeling requirements
   - Attachment 17: SDDG certification requirements
4. **The app uses ML detection** - YOLOX for labels, Google ML Kit for OCR
5. **Frustration = non-compliance** - the app documents issues for remediation

---

## Questions to Answer After Research

1. How many total test scenarios exist across all classes?
2. What is the standard scenario structure?
3. Which classes have the most complex validation requirements?
4. What types of alterations are most commonly tested?
5. Are there any gaps in hazard class coverage?
6. How do packing group requirements vary by class?
7. What special markings are unique to each class?
