  ## Task Overview

  **CRITICAL MISSION**: Attachment 3 of AFMAN 24-604 contains GENERAL requirements that apply ACROSS ALL hazard classes. Many paragraphs in Attachment 3 **OVERRIDE**, **SUPERSEDE**, or **MODIFY** the class-specific requirements found in Attachments 5-13 (packaging), Attachment 14 (marking), Attachment 15 (labeling), and Attachment 17 (SDDG).

  Your task is to perform exhaustive expert-level analysis of `docs/attachment3/attachment3.pdf` and document EVERY rule that would:
  1. Alter packing group performance requirements
  2. Modify SDDG Key requirements
  3. Change marking requirements
  4. Change labeling requirements
  5. Restrict or expand packaging options
  6. Impose additional requirements beyond class-specific attachments
  7. Create exemptions from standard requirements
  8. Establish aircraft-specific limitations
  9. Override technical manual or other source requirements

  **The PDF is the SOURCE OF TRUTH** - all findings must be verified against the actual PDF content.

  ---

  ## Why This Matters

  When an inspector validates a hazmat shipment, they typically reference:
  - Table A4.1 for material classification
  - Class-specific attachment (A5-A13) for packaging
  - Attachment 14 for marking
  - Attachment 15 for labeling
  - Attachment 17 for SDDG requirements

  **BUT** Attachment 3 contains GENERAL requirements that can OVERRIDE any of the above. For example:

  **A3.1.9**: "A packaging containing a Packing Group III material with a primary or subsidiary hazard of Class/Division 4.1, 4.2, 4.3, 5.1, or 8 must meet Packing Group II performance level."

  This means a PG III material that would normally be allowed in a "Z" marked package (PG III only) **MUST** be in a "Y" or "X" marked package if it has certain subsidiary hazards. This OVERRIDES what the class-specific attachment might otherwise allow.

  **Missing these override rules leads to inspection failures and safety violations.**

  ---

  ## Required Approach

  ### Use Superpowers and Subagents

  You MUST use the superpowers framework and deploy subagents for parallel analysis:

  1. **Invoke `/superpowers:brainstorm`** to structure your analysis approach
  2. **Deploy multiple Explore subagents in parallel** to analyze different sections of Attachment 3
  3. **Use systematic categorization** to ensure no override rules are missed

  ### Suggested Subagent Deployment Strategy

  Deploy subagents to analyze these major sections in parallel:

  | Subagent | Section | Focus |
  |----------|---------|-------|
  | Agent 1 | A3.1.1 - A3.1.9 | General packaging requirements, UN specification exemptions, PG upgrades |
  | Agent 2 | A3.1.10 - A3.1.17 | Inner packaging, quantity limits, empty packaging rules |
  | Agent 3 | A3.2 - A3.3.3 | MREs, polymerizable materials, Classes 1-3 specific overrides |
  | Agent 4 | A3.3.4 - A3.3.6 | Classes 4-6 specific overrides, infectious substance rules |
  | Agent 5 | A3.3.7 | Class 7 (Radioactive) - extensive section with many overrides |
  | Agent 6 | A3.3.8 - A3.3.9 | Classes 8-9, lithium batteries, dry ice, magnetized material |
  | Agent 7 | A3.4 + Cross-reference | Household goods, cross-reference all findings |

  ---

  ## Categories of Override Rules to Find

  ### 1. PACKING GROUP PERFORMANCE UPGRADES

  Find ALL paragraphs that require a HIGHER packing group performance level than the material's assigned packing group.

  **Known examples to verify:**
  - A3.1.9 - PG III with 4.1/4.2/4.3/5.1/8 subsidiary → PG II performance
  - A3.3.4.2 - Class 4 PG III → PG I/II performance
  - A3.3.5.3 - Class 5 PG III → PG I/II performance
  - A3.3.8.2 - Class 8 PG III liquids → PG I/II performance

  **Document**: Paragraph ID, exact text, which classes/materials affected, what PG upgrade is required.

  ### 2. PRESSURE/TEMPERATURE REQUIREMENTS

  Find ALL paragraphs that establish pressure or temperature requirements that differ from standard rules.

  **Known areas to examine:**
  - A3.1.7 - Air-eligible packaging pressure requirements
  - A3.1.5 - Ullage (outage) requirements
  - A3.3.2.6 - Cylinder pressure at temperature rules
  - A3.3.2.16 - Cryogenic liquid requirements

  **Document**: Paragraph ID, pressure/temperature values, which classes affected, whether stricter or more permissive than standard.

  ### 3. SDDG KEY MODIFICATIONS

  Find ALL paragraphs that require additional information in SDDG Keys beyond Attachment 17 requirements.

  **Known areas to examine:**
  - A3.3.2.16.2 - Cryogenic venting instructions in SDDG
  - A3.3.7.12 - Radioactive subsidiary hazard documentation
  - A3.3.1.4 - Explosives classification documentation

  **Document**: Paragraph ID, which SDDG Key affected, what additional information required.

  ### 4. MARKING REQUIREMENT MODIFICATIONS

  Find ALL paragraphs that add, modify, or exempt marking requirements beyond Attachment 14.

  **Known areas to examine:**
  - A3.3.7.12.1 - Radioactive materials with subsidiaries (UN2908, 2909, 2910, 2911, 2977, 2978 exceptions)
  - A3.3.9.2 - Lithium battery marking requirements
  - A3.3.9.6 - Dry ice net weight marking
  - A3.1.16 - Empty packaging marking

  **Document**: Paragraph ID, what marking is added/modified/exempted, which materials affected.

  ### 5. LABELING REQUIREMENT MODIFICATIONS

  Find ALL paragraphs that add, modify, or exempt labeling requirements beyond Attachment 15.

  **Known areas to examine:**
  - A3.3.7.12 - Radioactive subsidiary hazard labels
  - A3.3.9.2 - Lithium battery handling label requirements

  **Document**: Paragraph ID, what label is added/modified/exempted, which materials affected.

  ### 6. PACKAGING RESTRICTIONS/EXPANSIONS

  Find ALL paragraphs that restrict or expand packaging options beyond class-specific attachments.

  **Known areas to examine:**
  - A3.1.7.3 - Supplementary packaging requirements
  - A3.3.3.3.3 - DOT 5L jerrican prohibition for fuel
  - A3.3.2.10 - ICC cylinder authorization (expansion)
  - A3.3.2.13 - Mounted cylinder alternative (expansion)
  - A3.3.2.16.1.3 - Steel jacket requirement for flammable cryogenics
  - A3.3.2.16.1.5 - Aluminum prohibition for flammable cryogenics

  **Document**: Paragraph ID, packaging type affected, restriction or expansion, which materials affected.

  ### 7. QUANTITY LIMIT MODIFICATIONS

  Find ALL paragraphs that modify quantity limits beyond class-specific attachments.

  **Known areas to examine:**
  - A3.1.13 - Table A3.1 UN packaging capacity limits
  - A3.3.9.6 - Dry ice aircraft-specific limits (Tables A3.7, A3.8, Figures A3.6-A3.8)
  - A3.3.9.2.3 - Lithium battery size limits for exemptions

  **Document**: Paragraph ID, quantity limit values, which materials/aircraft affected.

  ### 8. AIRCRAFT LIMITATIONS/PROHIBITIONS

  Find ALL paragraphs that establish aircraft-specific restrictions or prohibitions.

  **Known areas to examine:**
  - A3.3.9.3 - Magnetized material forbidden on military aircraft (absolute)
  - A3.3.7.4.4 - Type B radioactive package restrictions
  - A3.3.7.12.3 - Radioactive with Division 2.1/2.3 subsidiary restrictions
  - A3.3.9.6 - Dry ice limits by aircraft type (C-17, C-5, C-130H, C-130J)

  **Document**: Paragraph ID, aircraft type affected, what is restricted/forbidden, any waiver provisions.

  ### 9. EXEMPTIONS FROM REQUIREMENTS

  Find ALL paragraphs that create exemptions from standard hazmat requirements.

  **Known areas to examine:**
  - A3.1.1.1 - UN specification test exemptions (9 categories)
  - A3.3.3.7 - Pads/swabs with flammable liquid exemption
  - A3.3.3.8 - Alcoholic beverages ≤5L exemption
  - A3.3.8.4 - Hypochlorite solution exemption
  - A3.3.9.2.3 - Excepted lithium batteries
  - A3.3.9.5 - Unregulated engines and fuel components
  - A3.2.1 - MRE with Flameless Ration Heaters
  - A3.3.6.2.4 - Category B infectious substances (non-culture)

  **Document**: Paragraph ID, what is exempted, conditions for exemption, which materials affected.

  ### 10. MATERIAL COMPATIBILITY REQUIREMENTS

  Find ALL paragraphs that establish compatibility requirements beyond class-specific attachments.

  **Known areas to examine:**
  - A3.1.3 - General compatibility and plastic testing
  - A3.3.2.2.1 - Cylinder content compatibility
  - A3.3.4.1 - Class 4 with corrosives
  - A3.3.5.2 - Class 5 with corrosives
  - A3.3.6.2.6 - Division 6.2 combination packaging contents

  **Document**: Paragraph ID, compatibility restriction, which material combinations affected.

  ### 11. CLOSURE AND INNER PACKAGING REQUIREMENTS

  Find ALL paragraphs that establish closure or inner packaging requirements.

  **Known areas to examine:**
  - A3.1.6 - Screw-type closure security requirements
  - A3.1.10 - Inner packaging securing and cushioning
  - A3.1.4 - Leak containment liner requirements

  **Document**: Paragraph ID, requirement details, which packaging types affected.

  ### 12. FUEL DRAINING/PURGING REQUIREMENTS

  Find ALL paragraphs that establish fuel handling requirements for vehicles and equipment.

  **Known areas to examine:**
  - A3.3.3.4 - Fuel-in-tank limitations
  - A3.3.3.5 - Bulk fuel draining/purging by flash point
  - A3.3.3.6 - Equipment fuel leakers list
  - A3.3.9.4 - Vehicle fuel levels
  - A3.3.9.5 - Unregulated engine draining requirements

  **Document**: Paragraph ID, draining vs purging requirement, flash point thresholds, specific equipment affected.

  ### 13. ORIENTATION REQUIREMENTS

  Find ALL paragraphs that establish orientation requirements.

  **Known areas to examine:**
  - A3.3.2.4 - Cylinder orientation
  - Cryogenic liquid orientation
  - Any other orientation references

  **Document**: Paragraph ID, orientation requirement, which materials affected.

  ### 14. SOLIDS IN LIQUID PACKAGING RULES

  Find ALL paragraphs that allow or restrict shipping solids in liquid containers.

  **Known areas to examine:**
  - A3.1.12 - Capacity multipliers for different PG combinations

  **Document**: Paragraph ID, multiplier values, which PG combinations affected.

  ---

  ## Output Requirements

  ### Create Document Structure

  Write your findings to:
  docs/plans/2026-XX-XX-attachment3-override-rules-analysis.md
  (Replace XX-XX with current date)

  ### Required Document Sections

  ```markdown
  # AFMAN 24-604 Attachment 3 - Override Rules Analysis

  ## Executive Summary
  - Total override rules identified
  - Most impactful categories
  - Critical rules every inspector must know

  ## Section 1: Packing Group Performance Upgrades
  [All PG upgrade rules with full details]

  ## Section 2: Pressure/Temperature Requirements
  [All pressure/temp rules with values and affected materials]

  ## Section 3: SDDG Key Modifications
  [Rules affecting Keys 1-22]

  ## Section 4: Marking Requirement Modifications
  [Additional, modified, or exempted markings]

  ## Section 5: Labeling Requirement Modifications
  [Additional, modified, or exempted labels]

  ## Section 6: Packaging Restrictions/Expansions
  [Packaging options affected]

  ## Section 7: Quantity Limit Modifications
  [Modified quantity limits by material/aircraft]

  ## Section 8: Aircraft Limitations/Prohibitions
  [Aircraft-specific restrictions]

  ## Section 9: Exemptions from Requirements
  [Complete list of exemptions with conditions]

  ## Section 10: Material Compatibility Requirements
  [Compatibility restrictions]

  ## Section 11: Closure and Inner Packaging Requirements
  [Closure and inner packaging rules]

  ## Section 12: Fuel Draining/Purging Requirements
  [Fuel handling rules by equipment type]

  ## Section 13: Orientation Requirements
  [Orientation rules]

  ## Section 14: Solids in Liquid Packaging Rules
  [Capacity multiplier rules]

  ## Quick Reference Tables

  ### Table 1: Packing Group Upgrades Summary
  | Paragraph | Material Class | Trigger Condition | Required PG Level |
  |-----------|---------------|-------------------|-------------------|

  ### Table 2: Exemptions Summary
  | Paragraph | Material/Situation | Exempted From | Conditions |
  |-----------|-------------------|---------------|------------|

  ### Table 3: Prohibitions Summary
  | Paragraph | What is Prohibited | Where/When | Waiver Available? |
  |-----------|-------------------|------------|-------------------|

  ### Table 4: Aircraft-Specific Limits
  | Paragraph | Material | Aircraft | Limit/Restriction |
  |-----------|----------|----------|-------------------|

  ## Cross-Reference Index
  [Alphabetical index by topic for quick lookup]

  ## Inspector Checklist
  [Critical override rules to check during every inspection]

  ---
  Process Checklist

  - Invoke /superpowers:brainstorm to structure approach
  - Deploy parallel subagents to analyze different sections
  - READ ENTIRE PDF - docs/attachment3/attachment3.pdf is SOURCE OF TRUTH
  - Document ALL override rules in categories 1-14
  - Verify each finding against PDF paragraph text
  - Include exact paragraph IDs (e.g., A3.1.9, A3.3.4.2)
  - Include exact regulatory text or accurate summary
  - Note Tier waiver levels (T-0, T-1, T-2, T-3) where specified
  - Create quick reference tables
  - Create cross-reference index
  - Create inspector checklist of critical rules
  - Review for completeness - did you miss any sections?

  ---
  Important Notes

  1. PDF IS SOURCE OF TRUTH - The PDF document docs/attachment3/attachment3.pdf is the authoritative source. Always verify findings against the actual PDF text.
  2. EXPERT-LEVEL ANALYSIS REQUIRED - This is not a surface-level review. You must identify EVERY rule that overrides, modifies, or supersedes other requirements. Missing an override rule could lead to safety violations.
  3. USE SUBAGENTS - The PDF is extensive (~50 pages). Deploy multiple subagents to analyze different sections in parallel for efficiency and thoroughness.
  4. EXACT PARAGRAPH IDs - Always include the exact paragraph identifier (e.g., A3.1.9, A3.3.4.2.1). Inspectors need to reference the source.
  5. TIER WAIVERS - Note Tier waiver levels where specified:
    - T-0: No waiver authority (absolute requirement)
    - T-1: MAJCOM/A4 or equivalent
    - T-2: Wing Commander or equivalent
    - T-3: Unit Commander or equivalent
  6. TABLES AND FIGURES - Attachment 3 contains important tables (A3.1, A3.2, A3.5, A3.7, A3.8) and figures (A3.1-A3.8). Document the content and purpose of each.
  7. CROSS-CLASS IMPACTS - Many override rules affect multiple hazard classes. Document all affected classes for each rule.
  8. LOOK FOR KEYWORDS - Search for these override indicators:
    - "must meet"
    - "must not"
    - "is forbidden"
    - "is not authorized"
    - "are not subject to"
    - "is excepted from"
    - "in lieu of"
    - "instead of"
    - "notwithstanding"
    - "regardless of"
    - "unless otherwise"
    - "(T-0)", "(T-1)", "(T-2)", "(T-3)"
  9. COMPLETE COVERAGE - Ensure you analyze:
    - A3.1 (General Packaging Requirements)
    - A3.2 (Requirements for Specific Items)
    - A3.3.1 through A3.3.9 (Class-Specific General Requirements)
    - A3.4 (Household Goods)
    - All Tables (A3.1, A3.2, A3.5, A3.7, A3.8)
    - All Figures (A3.1-A3.8)
  10. IMPACT ASSESSMENT - For each override rule, assess:
    - How common is this situation?
    - How severe is non-compliance?
    - Is this frequently missed during inspections?