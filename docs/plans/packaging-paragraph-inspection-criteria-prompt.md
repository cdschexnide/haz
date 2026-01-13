# Prompt: Document Class 2 Packaging Paragraph Inspection Criteria

Use this prompt with a new Claude Code instance to analyze AFMAN 24-604 attachments and document inspection criteria for each Class 2 packaging paragraph.

---

## Task Overview

Analyze the AFMAN 24-604 PDF attachments and create a comprehensive reference document that lists the **inspection criteria for each packaging paragraph** from A6.2 through A6.28.

**Goal:** Create a single markdown file that an inspector can use to understand what to validate for each packaging paragraph reference.

**IMPORTANT:**
- Use superpowers skills and subagents throughout this task
- The PDFs are large - use parallel subagents to analyze different sections
- Focus on extracting actionable inspection criteria, not just copying text
- Cross-reference between attachments (6, 14, 15) to get complete picture

---

## Source Documents

| Document | Path | Content |
|----------|------|---------|
| Attachment 6 | `docs/attachment6/afmanAttachment6.pdf` | Packaging requirements for Class 2 (A6.xx paragraphs) |
| Attachment 14 | `docs/attachment14/attachment14.pdf` | Marking requirements |
| Attachment 15 | `docs/attachment15/attachment15.pdf` | Labeling requirements |

---

## Output File

Create: `docs/reference/class2-packaging-inspection-criteria.md`

---

## Phase 1: Research with Parallel Subagents

Launch subagents to analyze each PDF in parallel. Since the PDFs are large, divide the work:

### Subagent 1: Attachment 6 - Paragraphs A6.2 through A6.9
```
Read docs/attachment6/afmanAttachment6.pdf

Extract for paragraphs A6.2 through A6.9:
- Paragraph title and purpose
- Authorized packaging types and codes
- Inner packaging requirements (if applicable)
- Outer packaging requirements
- Closure requirements
- Maximum quantity limits (per package and per aircraft)
- Special provisions referenced
- Any exceptions or variations

Focus on these paragraphs:
- A6.2: Aerosols
- A6.3: Small Receptacles Containing Gas (Compressed or Liquefied)
- A6.4: Liquefied Compressed Gases
- A6.5: Nonliquefied Compressed Gases
- A6.6: Liquefied Petroleum Gas
- A6.7: Fire Extinguishers
- A6.8: Fuel Cell Cartridges
- A6.9: Acetylene
```

### Subagent 2: Attachment 6 - Paragraphs A6.10 through A6.19
```
Read docs/attachment6/afmanAttachment6.pdf

Extract for paragraphs A6.10 through A6.19:
- Paragraph title and purpose
- Authorized packaging types and codes
- Inner packaging requirements
- Outer packaging requirements
- Closure requirements
- Maximum quantity limits
- Special provisions referenced
- Any exceptions or variations

Focus on these paragraphs:
- A6.10: Adsorbed Gases
- A6.11: Cryogenic Liquids
- A6.12: [If exists]
- A6.13: [If exists]
- A6.14: [If exists]
- A6.15: Division 2.3 Zone A Toxic Gases
- A6.16 through A6.19: [As applicable]
```

### Subagent 3: Attachment 6 - Paragraphs A6.20 through A6.28
```
Read docs/attachment6/afmanAttachment6.pdf

Extract for paragraphs A6.20 through A6.28:
- Paragraph title and purpose
- Authorized packaging types and codes
- Inner packaging requirements
- Outer packaging requirements
- Closure requirements
- Maximum quantity limits
- Special provisions referenced
- Any exceptions or variations

Note: Some paragraph numbers may not exist or may be reserved. Document which ones are present and which are not.
```

### Subagent 4: Attachment 14 - Marking Requirements for Class 2
```
Read docs/attachment14/attachment14.pdf

Extract marking requirements that apply to Class 2 materials:
- UN number marking requirements
- Proper shipping name marking requirements
- Technical name requirements for N.O.S.
- "INHALATION HAZARD" marking (Division 2.3)
- "MEETS DOT REQUIREMENTS" marking (fire extinguishers)
- Orientation marking for cryogenic liquids
- POP marking requirements for cylinders
- Overpak marking requirements
- Limited quantity marking
- Any Class 2-specific marking requirements

Map each marking requirement to the applicable packaging paragraphs (A6.xx).
```

### Subagent 5: Attachment 15 - Labeling Requirements for Class 2
```
Read docs/attachment15/attachment15.pdf

Extract labeling requirements that apply to Class 2 materials:
- Primary hazard labels:
  - Division 2.1: FLAMMABLE GAS (Red)
  - Division 2.2: NON-FLAMMABLE GAS (Green)
  - Division 2.3: TOXIC GAS (White) or TOXIC INHALATION HAZARD
- Subsidiary hazard labels (when applicable)
- Cargo Aircraft Only label requirements
- Orientation labels (This Side Up)
- Label placement requirements
- Label size requirements
- Any Division-specific labeling rules

Map labeling requirements to P1-P5 special provisions and packaging paragraphs.
```

---

## Phase 2: Synthesize Findings

After all subagents complete, synthesize the research into a single reference document.

### Document Structure

```markdown
# Class 2 Packaging Paragraph Inspection Criteria

## Overview
[Brief description of Class 2 (Gases) and the packaging paragraph system]

## How to Use This Document
[Instructions for inspectors on using this reference]

## Quick Reference Table
| Paragraph | Title | Division | P-Code | Key Inspection Points |
|-----------|-------|----------|--------|----------------------|
| A6.2 | Aerosols | 2.1/2.2 | P5 | Outer packaging, quantity limits |
| ... | ... | ... | ... | ... |

---

## A6.2 - Aerosols

### Purpose
[What this paragraph covers]

### Applicable Materials
- UN1950 AEROSOLS, flammable
- UN1950 AEROSOLS, non-flammable
- [etc.]

### Packaging Requirements

#### Authorized Outer Packaging
| Code | Description | Max Gross Weight |
|------|-------------|-----------------|
| 4G | Fiberboard box | XX kg |
| ... | ... | ... |

#### Inner Packaging
[Requirements for aerosol cans inside outer packaging]

#### Closure Requirements
[How packages must be closed/sealed]

### Quantity Limits
| Aircraft Type | Per Package | Per Aircraft |
|--------------|-------------|--------------|
| Passenger | X kg | X kg |
| Cargo Only | X kg | X kg |

### Labeling Requirements
- [ ] Primary: FLAMMABLE GAS (2.1) or NON-FLAMMABLE GAS (2.2)
- [ ] Subsidiary: [If applicable]
- [ ] CAO: Not required (P5)

### Marking Requirements
- [ ] UN number
- [ ] Proper shipping name
- [ ] [Other markings]

### Key 19 (Handling Information)
[Not required for aerosols - no cylinder position statement]

### Inspector Checklist
1. [ ] Outer packaging code matches authorized list
2. [ ] Gross weight within limits
3. [ ] All required labels present and correct
4. [ ] All required markings present and legible
5. [ ] [Additional checks]

### Common Alterations/Errors
- Wrong packaging code (e.g., A6.3 for aerosols)
- Missing subsidiary label when applicable
- [Other common errors from test scenarios]

---

## A6.3 - Small Receptacles Containing Gas

[Same structure as above]

---

[Continue for A6.4 through A6.28...]
```

---

## Phase 3: Validation Checklist per Paragraph

For each packaging paragraph, include a checklist that inspectors can use:

### Checklist Categories

1. **Packaging Validation**
   - Outer packaging type/code authorized
   - Inner packaging type/code authorized (if applicable)
   - Closure method correct
   - Package condition (undamaged)

2. **Quantity Validation**
   - Net quantity within limits
   - Per-package limits met
   - Per-aircraft limits met

3. **Labeling Validation**
   - Primary hazard label present and correct
   - Subsidiary label present (if applicable)
   - CAO label present (if required by P-code)
   - Orientation label present (if applicable)
   - Label placement correct

4. **Marking Validation**
   - UN number present and matches SDDG
   - PSN present and complete
   - Technical name present (for N.O.S.)
   - Special markings present (INHALATION HAZARD, MEETS DOT, etc.)
   - POP marking valid (for cylinders)

5. **SDDG Key Validation**
   - Key 7: Aircraft limitation matches P-code
   - Key 11: UN number correct
   - Key 12: PSN correct (with zone for 2.3)
   - Key 13: Hazard class correct
   - Key 14: Subsidiary risk (if applicable)
   - Key 15: Packing group (if applicable)
   - Key 16: Quantity and packaging description
   - Key 17: Packaging instruction matches paragraph
   - Key 19: Handling info present (cylinder position for most Class 2)

---

## Phase 4: Cross-Reference Tables

Include reference tables that connect everything:

### Table 1: P-Code to Aircraft Limitation
| P-Code | Aircraft Limitation | Packaging Paragraphs |
|--------|--------------------|--------------------|
| P1 | CAO (most restrictive) | A6.15 |
| P2 | CAO | A6.4, A6.5 (some) |
| P3 | CAO | [varies] |
| P4 | CAO | A6.3, A6.6, A6.9, A6.11 |
| P5 | Passenger and Cargo | A6.2, A6.7 |

### Table 2: Division to Labeling
| Division | Primary Label | Color | Common Subsidiaries |
|----------|--------------|-------|---------------------|
| 2.1 | FLAMMABLE GAS | Red | None typical |
| 2.2 | NON-FLAMMABLE GAS | Green | 5.1, 8 |
| 2.3 | TOXIC GAS / TOXIC INHALATION HAZARD | White | 2.1, 5.1, 8 |

### Table 3: Special Markings by Paragraph
| Marking | When Required | Applicable Paragraphs |
|---------|--------------|----------------------|
| INHALATION HAZARD | Division 2.3 only | A6.4, A6.5, A6.15 |
| MEETS DOT REQUIREMENTS | Fire extinguishers | A6.7 |
| Orientation (This Side Up) | Cryogenic liquids | A6.11 |
| Technical name | N.O.S. entries | All |

### Table 4: Inhalation Hazard Zones
| Zone | LC50 (ppm) | Special Packaging | Key 12 Format |
|------|------------|-------------------|---------------|
| A | ≤200 | A6.15 required | "PSN, TOXIC-INHALATION HAZARD, ZONE A" |
| B | >200 to ≤1000 | A6.4 or A6.5 | "PSN, TOXIC-INHALATION HAZARD, ZONE B" |
| C | >1000 to ≤3000 | A6.4 or A6.5 | "PSN, TOXIC-INHALATION HAZARD, ZONE C" |
| D | >3000 to ≤5000 | A6.4 or A6.5 | "PSN, TOXIC-INHALATION HAZARD, ZONE D" |

---

## Skills to Invoke

| When | Skill |
|------|-------|
| Start of task | `superpowers:using-superpowers` |
| Launching PDF analysis | `superpowers:dispatching-parallel-agents` |
| Writing the document | `superpowers:writing-plans` |
| Before claiming done | `superpowers:verification-before-completion` |

---

## Important Notes

1. **USE PARALLEL SUBAGENTS** - The PDFs are large; divide the work across multiple agents
2. **FOCUS ON ACTIONABLE CRITERIA** - Don't just copy text; extract what inspectors need to check
3. **CROSS-REFERENCE ATTACHMENTS** - Packaging (A6), Marking (A14), and Labeling (A15) work together
4. **DOCUMENT GAPS** - If a paragraph doesn't exist or has no content, note that
5. **INCLUDE CHECKLISTS** - Each paragraph should have a practical checklist for inspectors
6. **MAP TO TEST SCENARIOS** - Reference the scenarios in `src/testScenarios/class2.md` where applicable
7. **VERIFY COMPLETENESS** - Ensure all paragraphs A6.2 through A6.28 are covered (or documented as non-existent)

---

## Deliverables

1. **Reference Document:** `docs/reference/class2-packaging-inspection-criteria.md`
   - All packaging paragraphs A6.2 through A6.28
   - Complete inspection criteria for each
   - Cross-reference tables
   - Inspector checklists

2. **Summary Statistics:**
   - Total paragraphs documented
   - Paragraphs that don't exist (if any)
   - Key findings or patterns identified

3. **Gap Identification:**
   - Any areas where AFMAN is unclear
   - Any conflicts between attachments
   - Any criteria that can't be determined from source documents

---

## Example Output Format

For each paragraph, the output should follow this template:

```markdown
## A6.X - [Title]

### Purpose
Brief description of what materials/configurations this paragraph covers.

### Applicable UN Numbers
- UNXXXX - [PSN]
- UNXXXX - [PSN]

### Packaging Requirements

| Requirement | Specification |
|-------------|--------------|
| Outer Packaging | [Codes] |
| Inner Packaging | [Codes or N/A] |
| Closure | [Method] |
| Max Net Qty (PAX) | [Amount] |
| Max Net Qty (CAO) | [Amount] |

### Required Labels
- [ ] [Label 1]
- [ ] [Label 2]

### Required Markings
- [ ] [Marking 1]
- [ ] [Marking 2]

### SDDG Keys
| Key | Expected Value |
|-----|----------------|
| 7 | [PAX/CAO] |
| 17 | A6.X |
| 19 | [Handling info] |

### Inspector Checklist
- [ ] Check 1
- [ ] Check 2
- [ ] Check 3

### Notes
Any special considerations or common errors.
```

---

## Verification

Before completing, verify:
1. [ ] All paragraphs A6.2 through A6.28 are documented (or noted as non-existent)
2. [ ] Each paragraph has packaging, labeling, and marking requirements
3. [ ] Each paragraph has an inspector checklist
4. [ ] Cross-reference tables are complete
5. [ ] Document is well-organized and easy to navigate
