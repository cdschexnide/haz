# Ralph Wiggum Loops & AFMAN Compliance Gap Analysis

**Date:** 2026-01-28
**Purpose:** Evaluate application of Ralph Wiggum loops methodology to systematically identify gaps in AFMAN 24-604 compliance implementation

---

## 1. Ralph Wiggum Loops Overview

### What Are Ralph Wiggum Loops?

Ralph Wiggum loops are an AI iterative verification technique designed to catch errors that accumulate during extended coding sessions. Named after the Simpsons character known for non-sequiturs, the technique acknowledges that AI models can develop "tunnel vision" or confirmation bias when working on complex tasks.

### Core Principles

1. **Fresh Context Per Iteration**: Each verification pass starts with a clean slate, preventing inherited assumptions from contaminating analysis
2. **Explicit Verification Criteria**: Define what "correct" looks like before checking
3. **Multiple Perspective Passes**: Same code reviewed from different angles (security, performance, compliance, etc.)
4. **Documented Findings**: Each iteration produces written artifacts for comparison

### Application to Compliance Verification

For AFMAN 24-604 compliance, Ralph Wiggum loops would involve:
- **Pass 1**: Compare app features against AFMAN table of contents
- **Pass 2**: For each attachment, verify implementation completeness
- **Pass 3**: Cross-reference implemented rules against AFMAN paragraph numbers
- **Pass 4**: Test edge cases and exception handling
- **Pass 5**: Verify error messages match AFMAN terminology

---

## 2. Current Implementation Analysis

### 2.1 packagingDatabaseV2 Coverage

**Location:** `src/packagingDatabaseV2/`

**Coverage Summary:**
| Attachment | AFMAN Section | Status | Notes |
|------------|---------------|--------|-------|
| Attachment 5 | Class 1 Explosives | ✅ Covered | Paragraphs A5.x mapped |
| Attachment 6 | Class 2 Gases | ✅ Covered | Paragraphs A6.x mapped |
| Attachment 7 | Class 3 Flammable Liquids | ✅ Covered | Paragraphs A7.x mapped |
| Attachment 8 | Class 4 Flammable Solids | ✅ Covered | Paragraphs A8.x mapped |
| Attachment 9 | Class 5 Oxidizers/Organic Peroxides | ✅ Covered | Paragraphs A9.x mapped |
| Attachment 10 | Class 6 Toxic/Infectious | ✅ Covered | Paragraphs A10.x mapped |
| Attachment 11 | **Class 7 Radioactive** | ❌ **NOT COVERED** | No A11.x entries |
| Attachment 12 | Class 8 Corrosives | ✅ Covered | Paragraphs A12.x mapped |
| Attachment 13 | Class 9 Miscellaneous | ✅ Covered | Paragraphs A13.x mapped |

**Database Statistics:**
- Total entries: 99
- Unique AFMAN paragraphs referenced: 50+
- Classes covered: 1, 2, 3, 4, 5, 6, 8, 9
- **Critical Gap: Class 7 (Radioactive) has zero entries**

### 2.2 labelingRequirementsInspector.tsx (Attachment 15)

**Location:** `src/utils/labelingRequirementsInspector.tsx`

**Implementation Status:**

| Hazard Class | Status | Label Types Implemented |
|--------------|--------|------------------------|
| Class 1 (Explosives) | ✅ Complete | 1.1, 1.2, 1.3, 1.4, 1.5, 1.6 |
| Class 2.1 (Flammable Gas) | ✅ Complete | Flammable Gas |
| Class 2.2 (Non-Flammable Gas) | ✅ Complete | Non-Flammable Gas |
| Class 2.3 (Toxic Gas) | ✅ Complete | Poison Gas |
| Class 3 (Flammable Liquid) | ✅ Complete | Flammable Liquid |
| Class 4.1 (Flammable Solid) | ✅ Complete | Flammable Solid |
| Class 4.2 (Spontaneously Combustible) | ✅ Complete | Spontaneously Combustible |
| Class 4.3 (Dangerous When Wet) | ✅ Complete | Dangerous When Wet |
| Class 5.1 (Oxidizer) | ✅ Complete | Oxidizer |
| Class 5.2 (Organic Peroxide) | ✅ Complete | Organic Peroxide |
| Class 6.1 (Toxic) | ✅ Complete | Poison/Toxic |
| Class 6.2 (Infectious) | ✅ Complete | Infectious Substance |
| **Class 7 (Radioactive)** | ❌ **MISSING** | None |
| Class 8 (Corrosive) | ✅ Complete | Corrosive |
| Class 9 (Miscellaneous) | ✅ Complete | Class 9 |

**Additional Label Types Implemented:**
- Cargo Aircraft Only
- Magnetized Material
- Cryogenic Liquid
- Keep Away From Heat
- Lithium Battery Handling Label (partial)

**Identified Gaps:**
1. **Class 7 Radioactive labels completely missing** (Radioactive I, II, III, Fissile)
2. Limited Excepted Quantity handling
3. No Overpack label logic
4. Limited Quantity diamond marking rules incomplete

### 2.3 markingRequirementsInspector.tsx (Attachment 14)

**Location:** `src/utils/markingRequirementsInspector.tsx`

**Implementation Status: ~10% Complete**

**Implemented Requirements (9 of ~87):**
1. ✅ UN/NA Number marking
2. ✅ Proper Shipping Name marking
3. ✅ Technical Name (when required)
4. ✅ Consignee name/address
5. ✅ Shipper name/address
6. ✅ Net quantity (basic)
7. ✅ "Cargo Aircraft Only" marking
8. ✅ Orientation arrows (limited)
9. ✅ Overpack marking (basic)

**NOT Implemented (78+ requirements):**

Per AFMAN 24-604 Attachment 14, the following are NOT implemented:

| Category | Missing Requirements |
|----------|---------------------|
| **A14.2 Basic Markings** | Package orientation indicators, "This Way Up" variants |
| **A14.3 UN Specifications** | UN specification marking validation, "UN" symbol requirements |
| **A14.4 DOT Specifications** | DOT-SP numbers, retest dates, manufacturer codes |
| **A14.5 Class-Specific** | Class 1 NEQ markings, Class 2 cylinder markings, Class 7 activity/transport index |
| **A14.6 Limited Quantity** | "LTD QTY" marking, Y-limited quantity rules |
| **A14.7 Excepted Quantity** | EQ marks, primary/secondary containment markings |
| **A14.8 Consumer Commodity** | ORM-D/ID8000 transition markings |
| **A14.9 Marine Pollutant** | Marine pollutant marks, environmentally hazardous substance |
| **A14.10 Elevated Temp** | HOT marking, elevated temperature material |
| **A14.11 Fumigation** | Fumigation warning markings, date/time requirements |
| **A14.12 Empty Packaging** | Residue markings, "EMPTY" requirements |
| **A14.13 Salvage** | Salvage packaging markings |
| **A14.14 Lithium Batteries** | Lithium battery marks (Section I vs II), phone number requirements |
| **A14.15 Dry Ice** | Net weight marking, "CARBON DIOXIDE, SOLID" or "DRY ICE" |

**Commented TODOs Found (15):**
```typescript
// TODO: A14.4.2 - DOT specification cylinder markings
// TODO: A14.5.1 - Class 1 explosive NEQ marking
// TODO: A14.5.3 - Class 7 radioactive transport index
// TODO: A14.6.1 - Limited quantity marking validation
// TODO: A14.7 - Excepted quantity marking requirements
// TODO: A14.9 - Marine pollutant marking
// TODO: A14.10 - Elevated temperature marking
// TODO: A14.11 - Fumigation marking
// TODO: A14.12 - Empty packaging marking
// TODO: A14.13 - Salvage packaging marking
// TODO: A14.14.1 - Lithium battery Section I marking
// TODO: A14.14.2 - Lithium battery Section II marking
// TODO: A14.15 - Dry ice marking requirements
// TODO: A14.16 - Magnetized material marking
// TODO: A14.17 - Cryogenic liquid marking
```

---

## 3. Gap Analysis Summary

### Critical Gaps (High Priority)

| Gap ID | Component | Description | AFMAN Reference | Impact |
|--------|-----------|-------------|-----------------|--------|
| GAP-001 | packagingDatabaseV2 | No Class 7 (Radioactive) entries | Attachment 11 | Cannot validate radioactive packaging |
| GAP-002 | labelingRequirementsInspector | No Class 7 labels | A15.7 | Cannot determine radioactive labeling |
| GAP-003 | markingRequirementsInspector | Only 10% implemented | Attachment 14 | Most marking validations missing |

### Moderate Gaps (Medium Priority)

| Gap ID | Component | Description | AFMAN Reference |
|--------|-----------|-------------|-----------------|
| GAP-004 | markingRequirementsInspector | Lithium battery markings | A14.14 |
| GAP-005 | markingRequirementsInspector | Dry ice markings | A14.15 |
| GAP-006 | labelingRequirementsInspector | Excepted quantity labels | A15.x |
| GAP-007 | markingRequirementsInspector | Limited quantity markings | A14.6 |
| GAP-008 | markingRequirementsInspector | Marine pollutant markings | A14.9 |

### Minor Gaps (Lower Priority)

| Gap ID | Component | Description | AFMAN Reference |
|--------|-----------|-------------|-----------------|
| GAP-009 | markingRequirementsInspector | Fumigation markings | A14.11 |
| GAP-010 | markingRequirementsInspector | Empty packaging markings | A14.12 |
| GAP-011 | markingRequirementsInspector | Salvage packaging | A14.13 |
| GAP-012 | markingRequirementsInspector | Elevated temperature | A14.10 |

---

## 4. Ralph Wiggum Loops Implementation Plan

### Proposed Verification Process

To systematically identify ALL gaps using Ralph Wiggum loops:

#### Loop 1: Attachment-by-Attachment Verification
```
For each AFMAN Attachment (1-22):
  1. Start fresh context
  2. Read attachment requirements from AFMAN PDF
  3. Search codebase for implementation
  4. Document: Implemented / Partial / Missing
  5. Output findings to structured format
```

#### Loop 2: Function-Level Compliance Check
```
For each exported function in inspector utils:
  1. Start fresh context
  2. Identify AFMAN paragraph the function implements
  3. Verify function logic matches AFMAN exactly
  4. Document discrepancies
  5. Flag for correction
```

#### Loop 3: Edge Case Verification
```
For each hazard class (1-9):
  1. Start fresh context
  2. Generate edge case scenarios from AFMAN
  3. Trace through app logic
  4. Verify correct handling
  5. Document missing edge cases
```

#### Loop 4: Cross-Reference Validation
```
For each packaging database entry:
  1. Start fresh context
  2. Verify AFMAN paragraph reference exists
  3. Verify requirements match current AFMAN version
  4. Flag outdated or incorrect references
```

### Automation Opportunities

The following could be automated with AI assistance:

1. **PDF Extraction**: Parse AFMAN PDF to extract requirement lists
2. **Code Search**: Grep for AFMAN paragraph references (A14.x, A15.x, etc.)
3. **Coverage Mapping**: Build matrix of requirements vs implementations
4. **Test Generation**: Create test cases from AFMAN requirements

---

## 5. Recommended Next Steps

### Immediate Actions

1. **Add Class 7 to packagingDatabaseV2**
   - Extract Attachment 11 requirements
   - Create database entries for radioactive materials
   - Estimated effort: Medium

2. **Implement Class 7 labeling**
   - Add Radioactive I, II, III label determination
   - Add Fissile label logic
   - Add Transport Index validation
   - Estimated effort: Medium

3. **Complete markingRequirementsInspector.tsx**
   - Prioritize lithium battery markings (A14.14)
   - Add dry ice markings (A14.15)
   - Implement limited quantity markings (A14.6)
   - Estimated effort: High (78+ requirements)

### Long-Term Strategy

1. **Create AFMAN compliance matrix** tracking all 22 attachments
2. **Implement Ralph Wiggum loop automation** for ongoing verification
3. **Version tracking** to detect when AFMAN updates require code changes
4. **Unit test coverage** for each implemented AFMAN requirement

---

## 6. Conclusion

The current implementation covers approximately:
- **packagingDatabaseV2**: 89% (8 of 9 classes)
- **labelingRequirementsInspector**: 85% (missing Class 7)
- **markingRequirementsInspector**: 10% (9 of 87 requirements)

**Overall AFMAN Compliance Estimate: ~60%**

Ralph Wiggum loops provide a structured methodology to systematically identify and address these gaps. The fresh-context-per-iteration approach prevents accumulated bias and ensures thorough coverage verification.

The most critical gap is **Class 7 (Radioactive)** support, which is completely absent from all three components. The second priority is completing **markingRequirementsInspector.tsx**, which has the lowest implementation percentage.
