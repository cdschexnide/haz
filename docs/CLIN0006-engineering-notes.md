# CLIN 006 Notes

## Inspector Workflow (High Level)

Three main phases:
1. SDDG Inspection - Allows user to correct OCR extraction and create frustrations, using interactive digital representation of the SDDG. The app recommends frustrations for fields known to be incorrect
2. Package Inspection - The app uses machine learning and OCR to scan the package and compare the markings & labels against AFMAN24-604 requirements, creating frustrations for areas of non compliance. 
3. AMC Form 1015 - Generates the AMC Form 1015, with areas of frustration mapped to their respective fields on the form

### Interactive SDDG Form

Digital representation of the physical SDDG (Shipper's Declaration for Dangerous Goods) form that inspectors use to verify preparer accuracy.

**What it replaced:**
- Originally we had a 22-step wizard where inspectors went through each field one at a time
- That was tedious and slow - inspectors wanted to see everything at once like the paper form

**How it works now:**
- All SDDG fields displayed on one scrollable screen, laid out like the actual paper form
- Each field is "tappable" - tap to edit the value or add a frustration
- Fields not tapped are considered validated (pass-through)
- Visual indicators show which fields have frustrations (red highlight)

**Recommended Frustrations:**
- The app automatically detects known issues and recommends frustrations
- Examples:
  - UN3508 (capacitors): Missing Wh rating in quantity field
  - UN2807 (magnetized material): Missing required handling instructions about 4.6m separation
  - UN1845 (dry ice): Packaging type not approved for dry ice
- Inspector can accept the recommendation or dismiss it

**Field parsing:**
- Some SDDG fields contain multiple pieces of data that map to different Form 1015 fields
- Example: "Quantity and Packing" (Key 16) contains both:
  - Number and Type of Packages → Form 1015 Field 18
  - Net Quantity Per Package → Form 1015 Field 19
- We parse these compound fields and let inspectors frustrate sub-fields independently

**Reinspection support:**
- When reinspecting a previously frustrated SDDG, the form pre-loads existing frustrations
- Inspector can resolve frustrations (if corrected) or keep them frustrated

### ML Detection System

Uses images of a package to automatically detect and identify the markings and labels using machine learning and OCR.

Technical Specifics
- YOLOX-Tiny model trained on 97 hazmat label classes
- Runs on-device using ExecuTorch (no network needed in the field)
- Also runs OCR (Google ML Kit) to extract text from package markings (ex: UN number, proper shipping name)

The 97 classes include:
- All the standard hazard class labels (Class 1.1 through Class 9)
- Handling labels (Cargo Aircraft Only, This Way Up, Keep Away From Heat)

Multi-image aggregation
- Inspectors can take up to 6 photos of a package (different angles, different sides). We aggregate all the detections across images, deduplicate, and pick the highest-confidence detection for each label type. This handles cases where a label is partially obscured in one photo but clear in another.

Manual corrections
- We built a corrections interface where inspectors can add labels the ML model missed, or remove false positives.

### POP Marking Parser

Parses the UN specification POP marking on a package and validates the package code and packing group code against AFMAN24-604 regulations.

POP Marking Validation logic
- Field B (packaging code) must be authorized for the material per the packaging paragraph reference
- Field C (packing group rating) must be compatible with the material's PG code

### Frustration System

Types of frustrations
1. SDDG frustrations
2. Package frustrations

Each frustration tracks:
- What field/item failed
- What the incorrect value was
- What it should have been
- When it was frustrated
- Who frustrated it

Reinspection workflow:
- Inspector can go back and reinspect specific frustrated items
- If fixed, the frustration gets "resolved"
- Full audit trail of every inspection attempt

Mapping to Form 1015:
- Every frustration maps to a specific field on AMC Form 1015

---

## Workflow Details

### SDDG Phase

1. Capture - Take a photo of the SDDG form or enter manually
2. Region Adjustment - User can adjust OCR regions if form isn't aligned perfectly
3. Processing - Google ML Kit OCR extracts all the fields
4. Interactive Compliance - Inspector reviews each field, can edit values, can frustrate incorrect fields
5. Frustration Summary (if any) - Review all SDDG frustrations, decide to reinspect or continue
6. SDDG Inspection Complete - Save and continue to package inspection

### Package Phase

**Standard flow:**
1. Packaging Type Selection - Confirm the packaging type matches SDDG
2. Attachment 28 Wizard - Go through packaging criteria checklist
3. Special Provisions - Review applicable special provisions
4. ML Detection - Capture package images, run detection
5. Markings & Labels Validation - Verify all required items are present
6. POP Marking Validation - Verify the UN specification POP marking
7. Frustration Summary (if any) - Review all Package frustrations
8. Package Inspection Complete - Continue to AMC 1015 Form

Class 9 presented unique challenges due to the wide variation in item types, including lithium batteries, magnetized materials, and environmentally hazardous substances. Workflows were tailored accordingly to address these specialized requirements. 

### Completion Phase

1. AMC Form 1015 - Display the full checklist with pass/fail status
2. PDF Generation - Create printable/shareable document

---

## The Hard Parts

### Form 1015 Field Mapping

Building the mapping between our frustration categories and Form 1015 fields required going through the form line by line and figuring out which fields correspond to which inspection items.

Some items map cleanly (SDDG shipper field → Form 1015 Field 2).

Some items map to "Other" (Field 75) because there's no specific field for them on the form.

The mapping lives in `sddgToForm1015Mapping.ts`.

### Dynamic Marking/Labeling Requirements

Different materials require different markings and labels. We had to build evaluation functions that:
1. Look at the UN number, hazard class, packing group, special provisions
2. Determine which markings are required, per Attachment 14 of AFMAN24-604
3. Determine which labels are required, per Attachment 15 of AFMAN24-604
4. Compare against what the ML model detected
5. Frustrate anything missing

---

## Technologies Used

- **React Native / Expo** - Mobile framework
- **ExecuTorch** - On-device ML inference for YOLOX
- **Google ML Kit** - Text recognition (OCR)
- **YOLOX-Tiny** - Object detection model (97 classes)
- **React Context + useReducer** - Main inspection state

---

## What We Didn't Build (Out of Scope)

- Class 7 (Radioactive)
- Organic Peroxides

