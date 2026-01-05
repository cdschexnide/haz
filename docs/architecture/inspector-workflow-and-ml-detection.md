# Inspector Workflow and ML Detection System Architecture

**Last Updated:** 2026-01-05
**Audience:** Future Claude Code instances, engineers, maintainers
**Regulatory Basis:** AFMAN24-604 (Air Force Manual for Preparing Hazardous Materials for Military Air Shipments)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete Workflow Overview](#complete-workflow-overview)
3. [SDDG Form Processing Pipeline](#sddg-form-processing-pipeline)
4. [ML Detection Screen Architecture](#ml-detection-screen-architecture)
5. [OCR Extraction Pipeline](#ocr-extraction-pipeline)
6. [UN Specification Package Marking System](#un-specification-package-marking-system)
7. [Packaging Database Integration](#packaging-database-integration)
8. [State Management Architecture](#state-management-architecture)
9. [Frustration System](#frustration-system)
10. [Downstream Verification Screens](#downstream-verification-screens)
11. [Error Handling Patterns](#error-handling-patterns)
12. [Key Technologies](#key-technologies)

---

## Executive Summary

This application is a hazardous materials (hazmat) inspection tool for the US Air Force, built around AFMAN24-604 regulations. Inspectors use it to:

1. **Capture and validate SDDG forms** (Shipper's Declaration for Dangerous Goods)
2. **Photograph and analyze packages** using ML object detection and OCR
3. **Verify compliance** with packaging requirements based on material type
4. **Document frustrations** (non-compliance issues) for remediation

The core technical innovation is the dual-pipeline ML detection system that combines:
- **YOLOX-Tiny object detection** for identifying 92 classes of hazmat labels
- **Google ML Kit OCR** for extracting text markings (UN numbers, POP markings, EX numbers)

---

## Complete Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          INSPECTOR WORKFLOW                                  │
└─────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Inspector       │     │ SDDGUploadAnd    │     │ SDDGRegionAdjustment   │
│  HomeScreen      │────▶│ Parse            │────▶│ Screen                  │
│                  │     │                  │     │                         │
│  "Start New      │     │  • Camera        │     │  • Adjust OCR regions  │
│   Inspection"    │     │  • Gallery       │     │  • Orientation correct │
│                  │     │  • Manual Entry  │     │  • Save & Continue     │
└──────────────────┘     └──────────────────┘     └─────────────────────────┘
                                                            │
                                                            ▼
┌──────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Interactive     │     │ SDDGProcessing   │◀────│ PaddleOCR Engine        │
│  SDDGCompliance  │◀────│ Screen           │     │                         │
│  Screen          │     │                  │     │  • Extract form data   │
│                  │     │  • Progress UI   │     │  • Map to HazPro format│
│  • View fields   │     │  • Error handle  │     │  • Store in context    │
│  • Edit values   │     │                  │     │                         │
│  • Add frustrate │     └──────────────────┘     └─────────────────────────┘
└──────────────────┘
         │
         ▼
    ┌────────────┐
    │ Has        │──Yes──▶┌──────────────────┐
    │ Frustrate? │        │ SDDGFrustration  │
    └────────────┘        │ Summary          │
         │                │                  │
         No               │ • Review issues  │
         │                │ • Complete &     │
         │                │   Continue       │
         │                └────────┬─────────┘
         │                         │
         ▼                         ▼
    ┌──────────────────────────────────────┐
    │         MLDetectionScreen            │
    │                                      │
    │  • Capture up to 6 package images   │
    │  • Optional cropping                │
    │  • YOLOX label detection            │
    │  • ML Kit OCR extraction            │
    │  • Manual corrections               │
    │  • Display aggregated results       │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │    Package Verification Screens      │
    │                                      │
    │  Routes based on UN number:          │
    │  • UN1845 → DryIceScreen            │
    │  • UN2807 → MagnetizedMaterials     │
    │  • UN3480/3090 → LithiumBatteries   │
    │  • UN3508 → CapacitorsScreen        │
    │  • Default → PackageVerification    │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │        Inspection Complete           │
    │                                      │
    │  • Save to database                  │
    │  • Generate report                   │
    │  • Return to home                    │
    └──────────────────────────────────────┘
```

### File Locations

| Screen | File Path |
|--------|-----------|
| Inspector Home | `src/components/Inspector/InspectorHomeScreen.tsx` |
| SDDG Upload | `src/components/SDDGUploadAndParse.tsx` |
| Region Adjustment | `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx` |
| SDDG Processing | `src/screens/SDDG/SDDGProcessingScreen.tsx` |
| Interactive Compliance | `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx` |
| Frustration Summary | `src/components/SDDGFrustrationSummary.tsx` |
| ML Detection | `src/components/Inspector/MLDetectionScreen.tsx` |

---

## SDDG Form Processing Pipeline

### Overview

The SDDG (Shipper's Declaration for Dangerous Goods) is a standardized form that accompanies all hazmat shipments. Our application extracts data from this form using PaddleOCR.

### Processing Stages

#### Stage 1: Image Capture (`SDDGUploadAndParse.tsx`)

```typescript
// Three input methods:
type SDDGInputMethod = 'camera' | 'gallery' | 'manual';

// Camera: Uses expo-camera to capture form image
// Gallery: Uses expo-image-picker to select existing image
// Manual: Direct data entry bypassing OCR
```

#### Stage 2: Region Adjustment (`SDDGRegionAdjustmentScreen.tsx`)

The SDDG form has defined regions for each field. Users can adjust these regions if the form isn't aligned properly:

```typescript
interface SDDGRegion {
  fieldName: string;
  x: number;      // Percentage from left
  y: number;      // Percentage from top
  width: number;  // Percentage of image width
  height: number; // Percentage of image height
}

// Key operations:
// - Orientation correction (rotate 90°, 180°, 270°)
// - Region boundary adjustment
// - Template selection for different form versions
```

#### Stage 3: OCR Processing (`SDDGProcessingScreen.tsx`)

```typescript
// Initialization
const paddleOcr = await initializePaddleOCR();

// Extraction with custom template
const extractedData = await extractFormData(imageUri, customTemplate);

// Format mapping: SddgOCR format → HazPro format
const mappedContent = mapSddgOcrToHazPro(extractedData);

// Store in context
setExtractedSDDGContent(mappedContent, imageUri);
```

### SDDG Data Structure

```typescript
interface ExtractedSDDGContent {
  // Header Information
  shipperName: string;
  shipperAddress: string;
  consigneeName: string;
  consigneeAddress: string;

  // Material Information
  unIdNo: string;              // e.g., "UN0106"
  properShippingName: string;  // e.g., "FUZES DETONATING"
  hazardClass: string;         // e.g., "1.1D"
  packingGroup: string;        // e.g., "II"
  packagingParagraph: string;  // e.g., "A5.24."

  // Quantity & Package
  quantity: string;
  typeOfPackaging: string;
  packingInstructions: string;

  // Additional Information
  additionalHandlingInfo: string;
  emergencyContact: string;

  // Certification
  declarationDate: string;
  signatureName: string;
}
```

---

## ML Detection Screen Architecture

### Component Location

`src/components/Inspector/MLDetectionScreen.tsx`

### Screen States

```typescript
type ScreenState =
  | 'home'       // Initial state - capture options
  | 'camera'     // Camera active for capture
  | 'cropping'   // Image cropping interface
  | 'preview'    // Review captured images
  | 'processing' // Running ML analysis
  | 'results';   // Display detection results
```

### State Machine

```
┌────────┐  capture   ┌────────┐  confirm   ┌──────────┐
│  home  │──────────▶│ camera │───────────▶│ cropping │
└────────┘            └────────┘            └──────────┘
    │                                            │
    │ gallery                                    │ done
    ▼                                            ▼
┌────────────┐                             ┌─────────┐
│ ImagePicker│────────────────────────────▶│ preview │
└────────────┘                             └─────────┘
                                                │
                                                │ analyze
                                                ▼
┌─────────┐     complete      ┌────────────┐
│ results │◀──────────────────│ processing │
└─────────┘                   └────────────┘
```

### Image Capture Configuration

```typescript
const MAX_IMAGES = 6;

interface CapturedImage {
  uri: string;
  width: number;
  height: number;
  timestamp: number;
  orientation?: number;  // EXIF orientation correction
}
```

### Detection Pipeline

#### 1. Image Preprocessing

```typescript
// Orientation correction for EXIF data
const correctedUri = await correctImageOrientation(imageUri);

// Resize for ML model (YOLOX expects 640x640)
const resizedUri = await resizeForInference(correctedUri, 640, 640);
```

#### 2. Dual Detection

```typescript
// Parallel processing
const [labelResults, ocrResults] = await Promise.all([
  detectLabels(resizedUri),      // YOLOX object detection
  performOCR(correctedUri),      // ML Kit text recognition
]);
```

#### 3. Results Aggregation

```typescript
interface AggregatedAnalysis {
  // POP marking (best confidence across all images)
  bestPopMarking: ParsedPOPMarking | null;

  // All detected hazmat labels
  allDetectedLabels: Detection[];

  // Extracted markings
  allUnNumbers: string[];           // ["UN0106", "UN3082"]
  allEXNumbers: string[];           // ["EX-2019037142"]
  allUnWithPSN: { un: string; psn: string }[];
  allWeights: ExtractedWeight[];
  allHazardClasses: string[];
  countryOfOrigin: string | null;

  // Processing metadata
  imagesProcessed: number;
  totalProcessingTime: number;
  perImageResults: ImageAnalysisResult[];
}
```

### Manual Corrections

Users can correct ML detection errors:

```typescript
interface ManualCorrection {
  type: 'add' | 'edit' | 'delete';
  originalLabel?: string;    // For edit/delete
  newLabel?: string;         // For add/edit
  timestamp: number;
  source: 'manual';
}

// All corrections tracked for audit trail
const corrections: ManualCorrection[] = [];
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `processAllImagesWithAnalysis()` | Main entry point for batch processing |
| `handleCameraCapture()` | Camera image capture with orientation |
| `handleGallerySelect()` | Image picker integration |
| `handleCropComplete()` | Cropping result handler |
| `navigateToNextScreen()` | Route to appropriate verification screen |

---

## OCR Extraction Pipeline

### Service Location

`src/ml/services/ocrService.ts`

### Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     OCR EXTRACTION PIPELINE                      │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐     ┌─────────────────────────────────────────┐
│   ML Kit     │────▶│ result.blocks[].lines[] (hierarchy)    │
│   Text Rec   │     └─────────────────────────────────────────┘
└──────────────┘                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                    PASS 1: POP MARKING FIRST                     │
│                                                                  │
│  Extract UN specification marking BEFORE other extractions       │
│  Prevents false positives (e.g., "4G" in POP ≠ 4 grams)         │
│                                                                  │
│  Input:  "UN 4G / Y 25 / S / 22 / USA / DOD"                    │
│  Output: ParsedPOPMarking with matchedText for exclusion        │
└─────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                 PASS 2: LINE-LEVEL EXTRACTION                    │
│                                                                  │
│  Extract UN+PSN pairs using line-by-line analysis               │
│  Preserves spatial relationship between UN number and PSN        │
│                                                                  │
│  Line: "UN0106 FUZES DETONATING"                                │
│  Output: { un: "UN0106", psn: "FUZES DETONATING" }              │
│                                                                  │
│  Also extract EX numbers: EX-2019037142                         │
└─────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│            PASS 3: REMAINING EXTRACTIONS (WITHOUT POP)           │
│                                                                  │
│  Using text with POP marking removed:                           │
│  • UN numbers (standalone)                                      │
│  • Weights (mass values)                                        │
│  • Hazard classes                                               │
│  • Dates                                                        │
│  • Country of origin                                            │
│  • Other significant markings                                   │
└─────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MERGE & DEDUPLICATE                         │
│                                                                  │
│  Combine UN numbers from all sources                            │
│  Remove duplicates                                              │
│  Return complete ExtractedMarkings                              │
└─────────────────────────────────────────────────────────────────┘
```

### Key Extraction Functions

#### `performOCR(imageUri: string): Promise<ImageOCRResult>`

```typescript
interface ImageOCRResult {
  fullText: string;           // Complete concatenated text
  textBlocks: OCRTextBlock[]; // Block-level data with positions
  textLines: OCRTextLine[];   // Line-level data (CRITICAL for UN+PSN)
  processingTime: number;
}
```

#### `extractMarkingsFromText(ocrText: string, textLines: OCRTextLine[]): ExtractedMarkings`

Main extraction orchestrator implementing the three-pass strategy.

#### `extractUNNumbers(text: string): string[]`

```typescript
// Pattern: UN followed by 4 digits
const pattern = /UN[\s\-]*(\d{4})/gi;
// Example matches: "UN0106", "UN 3082", "UN-1203"
```

#### `extractEXNumbers(text: string): string[]`

```typescript
// Pattern: EX followed by 7-12 digits
const pattern = /EX[\s\-]*(\d{7,12})/gi;
// Output format: "EX-2019037142"
```

#### `extractUNWithPSN(lines: OCRTextLine[]): { un: string; psn: string }[]`

```typescript
// Pattern: UN + 4 digits + uppercase text
const pattern = /UN[\s\-]*(\d{4})\s+([A-Z][A-Z\s,\-]+)/gi;
// Preserves relationship between UN number and proper shipping name
```

#### `extractWeights(text: string): ExtractedWeight[]`

```typescript
interface ExtractedWeight {
  value: number;
  unit: 'kg' | 'g' | 'lb' | 'oz';
  type: 'gross' | 'net' | 'unknown';
}
// IMPORTANT: Only extracts from text WITHOUT POP marking
// to prevent "4G" (fiberboard box code) from matching as "4 grams"
```

### POP Marking Parser

Location: `src/utils/popMarkingParser.ts`

The POP (Performance-Oriented Packaging) marking is the UN specification marking that certifies the package meets UN requirements.

```typescript
interface ParsedPOPMarking {
  found: boolean;
  fields: POPMarkingFields;
  confidence: number;
  issues: string[];
  detectedType: POPMarkingType;
  sourceText: string;  // Used for exclusion from other extractors
}

interface POPMarkingFields {
  fieldA_UNCode: string;        // e.g., "4G" (fiberboard box)
  fieldB_PackingGroup: string;  // e.g., "X", "Y", "Z"
  fieldC_GrossWeight: string;   // e.g., "25" (kg)
  fieldD_SolidOrPressure: string; // "S" for solids
  fieldE_ManufactureDate: string; // e.g., "22" (year)
  fieldF_CountryCode: string;   // e.g., "USA"
  fieldG_ManufacturerCode: string; // e.g., "DOD"
  fieldH_Authority: string;     // e.g., "DOD" or "DOT"
}
```

---

## UN Specification Package Marking System

### AFMAN24-604 Attachment 14 Reference

UN specification markings are **mandatory** for all packages of hazardous materials (with limited exceptions per A3.1.1).

### Marking Format (Non-bulk Packagings)

```
┌─────────────────────────────────────────────────────────────────┐
│           UN SPECIFICATION MARKING FORMAT                        │
│                                                                  │
│   Example for solids:     UN 4G / Y 7.4 / S / 99 / USA / DOD   │
│   Example for liquids:    UN 1A1 / Y 1.3 / 100 / 99 / USA / DOD │
└─────────────────────────────────────────────────────────────────┘

Position (a): UN Symbol
  - Circle containing "u" over "n"
  - Or capital "UN" for embossed metal

Position (b): Packaging Type Code (2-4 characters)
  First digit = Type:
    1 = Drum
    2 = Wooden barrel
    3 = Jerrican
    4 = Box
    5 = Bag
    6 = Composite packaging
    7 = Pressure receptacle

  Second letter = Material:
    A = Steel
    B = Aluminum
    C = Natural wood
    D = Plywood
    F = Reconstituted wood
    G = Fiberboard
    H = Plastic
    L = Textile
    M = Paper, multi-wall
    N = Metal (other than steel/aluminum)
    P = Glass, porcelain, stoneware

  Third position = Category within type:
    Example: 1A1 = Steel drum, non-removable head
             1A2 = Steel drum, removable head
             4G  = Fiberboard box

Position (c): Packing Group Rating
  X = Tested for PG I, II, and III (highest)
  Y = Tested for PG II and III
  Z = Tested for PG III only (lowest)

Position (d): Gross Weight (solids) or Relative Density (liquids)
  Solids: Maximum gross weight in kg
  Liquids: Relative density if > 1.2

Position (e): "S" for Solids or Test Pressure for Liquids
  Solids: Letter "S"
  Liquids: Hydraulic test pressure in kPa

Position (f): Manufacture Year (last 2 digits)

Position (g): Country Code (e.g., "USA")

Position (h): Manufacturer/Certifier Symbol
  DOD = Department of Defense
  DOT = Department of Transportation
```

### Validation Logic

```typescript
function validatePOPMarking(
  popMarking: ParsedPOPMarking,
  materialInfo: HazmatMaterial
): ValidationResult {
  const issues: string[] = [];

  // 1. Validate packaging code against allowed options
  const allowedCodes = getPackagingCodesForMaterial(
    materialInfo.packagingParagraph
  );
  if (!allowedCodes.includes(popMarking.fields.fieldA_UNCode)) {
    issues.push(`Packaging code ${popMarking.fields.fieldA_UNCode} not authorized for ${materialInfo.unNumber}`);
  }

  // 2. Validate packing group compatibility
  const requiredPG = materialInfo.packingGroup;
  if (!isPGCompatible(popMarking.fields.fieldB_PackingGroup, requiredPG)) {
    issues.push(`Packing group ${popMarking.fields.fieldB_PackingGroup} insufficient for PG ${requiredPG}`);
  }

  // 3. Check manufacture date (5-year rule for some materials)
  const manufactureYear = parseInt(popMarking.fields.fieldE_ManufactureDate);
  if (isDateRestricted(materialInfo) && isExpired(manufactureYear)) {
    issues.push(`Packaging manufactured in ${manufactureYear} may be expired`);
  }

  return { valid: issues.length === 0, issues };
}
```

---

## Packaging Database Integration

### Database Location

`server/lookupFunctions/packagingLookupV2.ts`

### Structure

```typescript
interface PackagingDatabaseEntry {
  paragraphId: string;              // e.g., "A5.24."
  hazardClass: number;              // e.g., 1 for explosives
  description: string;
  lastUpdated: string;
  entryType: 'specialized' | 'general';
  materialTypes: string[];          // e.g., ["fuzes_detonating", "grenades"]

  packagingOptions: PackagingOption[];
  specialRequirements: SpecialRequirement[];
  conditionalRequirements: ConditionalRequirement[];
  referencedParagraphs: string[];
}

interface PackagingOption {
  id: string;                       // e.g., "A5.24.general"
  type: 'combination' | 'single';
  description: string;

  innerPackaging: {
    required: boolean;
    materials: string[];            // e.g., ["Fiberboard receptacles", "Metal receptacles"]
    description: string;
  };

  outerPackaging: {
    required: boolean;
    categories: OuterPackagingCategory[];
  };

  restrictions: string[];
  isComplete: boolean;
}

interface OuterPackagingCategory {
  type: 'boxes' | 'drums' | 'jerricans' | 'bags';
  subtype: string;
  containers: {
    code: string;        // UN packaging code (e.g., "4G")
    material: string;
    description: string;
  }[];
}
```

### Example Entry: UN0106 FUZES DETONATING

```typescript
// Lookup: packagingDatabaseV2["A5.24."]
{
  paragraphId: "A5.24.",
  hazardClass: 1,
  description: "Fuzes, Detonating; Fuzes, Igniting; Grenades; and Grenades, Practice",

  packagingOptions: [{
    id: "A5.24.general",
    type: "combination",
    innerPackaging: {
      required: true,
      materials: [
        "Fiberboard receptacles",
        "Metal receptacles",
        "Plastic receptacles",
        "Wood receptacles",
        "Plastic trays (individual partitions)",
        "Wood trays (individual partitions)",
        "Dividing partitions in outer packaging"
      ]
    },
    outerPackaging: {
      required: true,
      categories: [
        {
          type: "boxes",
          containers: [
            { code: "4A", material: "steel", description: "Steel boxes" },
            { code: "4B", material: "aluminum", description: "Aluminum boxes" },
            { code: "4C1", material: "wood", description: "Ordinary natural wood boxes" },
            { code: "4G", material: "fiberboard", description: "Fiberboard boxes" },
            // ... more
          ]
        },
        {
          type: "drums",
          containers: [
            { code: "1A1", material: "steel", description: "Steel drums, non-removable head" },
            { code: "1A2", material: "steel", description: "Steel drums, removable head" },
            // ... more
          ]
        }
      ]
    }
  }],

  specialRequirements: [
    {
      type: "fuze_grenade_handling",
      description: "Special handling requirements for fuzes and grenades",
      mandatory: true
    }
  ],

  conditionalRequirements: [
    {
      condition: "material_type='fuzes_detonating'",
      requirements: [{
        type: "detonating_fuze_specific_handling",
        description: "Specific safety requirements for detonating fuzes",
        mandatory: true
      }]
    }
  ]
}
```

### Validation Flow

```typescript
async function validatePackaging(
  extractedPOP: ParsedPOPMarking,
  sddgData: ExtractedSDDGContent
): Promise<PackagingValidationResult> {
  // 1. Get packaging paragraph from SDDG
  const packagingParagraph = sddgData.packagingParagraph; // e.g., "A5.24."

  // 2. Look up allowed packaging options
  const entry = packagingDatabaseV2[packagingParagraph];
  if (!entry) {
    return { valid: false, error: `Unknown packaging paragraph: ${packagingParagraph}` };
  }

  // 3. Extract packaging code from POP marking
  const detectedCode = extractedPOP.fields.fieldA_UNCode; // e.g., "4G"

  // 4. Check if code is in allowed options
  const allowedCodes = entry.packagingOptions.flatMap(opt =>
    opt.outerPackaging.categories.flatMap(cat =>
      cat.containers.map(c => c.code)
    )
  );

  const isAllowed = allowedCodes.includes(detectedCode);

  // 5. Return validation result
  return {
    valid: isAllowed,
    detectedCode,
    allowedCodes,
    specialRequirements: entry.specialRequirements,
    conditionalRequirements: evaluateConditionals(entry.conditionalRequirements, sddgData)
  };
}
```

---

## State Management Architecture

### Overview

The application uses two primary state management solutions:

1. **React Context + useReducer** (`InspectionFormProvider`) - Main inspection state
2. **Valtio** (`useHazProStore`) - Preparer context and shipment data

### InspectionFormProvider

Location: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

```typescript
interface InspectionFormState {
  currentInspection: {
    // SDDG Data
    extractedContent: ExtractedSDDGContent;
    verificationCopy: ExtractedSDDGContent;  // User-edited version
    sddgImageUri: string | null;

    // Frustrations (compliance issues)
    frustrations: FrustrationRecord[];
    packageFrustrations: PackageFrustrationRecord[];
    resolvedFrustrations: FrustrationRecord[];

    // ML Analysis Results
    mlAnalysisResults: AggregatedAnalysis | null;

    // Package Data
    packagePopMarking: PackagePopMarking;
    magnetizedMaterialData: InspectorMagnetizedMaterialData;
    innerPackagingData: InnerPackagingInspectionData;

    // Metadata
    inspector: string | InspectorInfo;
    inspectionId: string | null;
    createdAt: string;
    updatedAt: string;
  };

  workflowState: {
    currentChevron: 'sddg' | 'package' | 'complete';
    sddgStep: 'upload' | 'adjustment' | 'processing' | 'validation' | 'frustration';
    sddgComplete: boolean;
    packageComplete: boolean;

    reinspection: {
      mode: 'none' | 'sddg' | 'package';
      targetFrustrations: string[];
      currentIndex: number;
      inspectionId: string | null;
    };
  };

  isProcessing: boolean;
  hasUnsavedChanges: boolean;
}
```

### Key Actions

```typescript
// Inspection Lifecycle
startNewInspection()
loadInspectionForEdit(id: string)
saveCurrentInspection()
completeInspection()

// SDDG Data
setExtractedSDDGContent(content: ExtractedSDDGContent, imageUri?: string)
updateVerificationField(field: keyof ExtractedSDDGContent, value: string)

// Frustrations
addFrustration(frustration: FrustrationRecord)
removeFrustration(key: string)
addPackageFrustration(frustration: PackageFrustrationRecord)

// ML Analysis
setMLAnalysisResults(results: AggregatedAnalysis)

// Reinspection
startSDDGReinspection(frustrationKeys: string[])
updateReinspectedInspection()
```

### useHazProStore (Valtio)

Location: `src/stores/useHazProStore.ts`

Used for preparer workflow (as opposed to inspector workflow):

```typescript
import { proxy, useSnapshot } from 'valtio';

const hazProStore = proxy({
  // Shipment context
  shipment: {
    unNumber: '',
    properShippingName: '',
    hazardClass: '',
    packingGroup: '',
  },

  // Preparer data
  preparer: {
    name: '',
    organization: '',
    date: '',
  },

  // Nested value helpers
  getValue: (path: string) => { /* ... */ },
  setValue: (path: string, value: any) => { /* ... */ },
});

export function useHazProStore() {
  return useSnapshot(hazProStore);
}
```

---

## Frustration System

### Overview

"Frustrations" are documented non-compliance issues that require remediation. There are two types:

1. **SDDG Frustrations** - Issues with the declaration form
2. **Package Frustrations** - Issues with the physical package

### Frustration vs Correction

| Term | Definition | User Action |
|------|------------|-------------|
| **Frustration** | A compliance issue documented for later resolution | User flags an issue but does NOT fix it |
| **Correction** | A field value change made to fix an error | User updates the value in the verification copy |

### SDDG Frustration Flow

```
┌────────────────────────────────────────────────────────────────┐
│              InteractiveSDDGComplianceScreen                    │
└────────────────────────────────────────────────────────────────┘
                              │
                              │ User taps on field
                              ▼
┌────────────────────────────────────────────────────────────────┐
│                    Field Edit Modal                             │
│                                                                │
│  Current Value: UN0106                                         │
│  Verified Value: [______________]                              │
│                                                                │
│  [Confirm Value]  [Mark as Frustration]                        │
└────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              │                               │
         Correction                      Frustration
              │                               │
              ▼                               ▼
┌──────────────────────┐       ┌──────────────────────────┐
│ updateVerification   │       │ addFrustration({         │
│ Field(field, value)  │       │   key: 'unIdNo',         │
│                      │       │   originalValue: 'UN0106'│
│ Updates verification │       │   reason: 'Incorrect UN' │
│ copy only            │       │   timestamp: Date.now()  │
└──────────────────────┘       │ })                       │
                               └──────────────────────────┘
```

### Frustration Data Structure

```typescript
interface FrustrationRecord {
  key: string;              // Field identifier (e.g., 'unIdNo')
  fieldLabel: string;       // Display name (e.g., 'UN ID Number')
  originalValue: string;    // Value from OCR extraction
  reason: string;           // Why it's frustrated
  category: 'sddg_field' | 'sddg_table' | 'package';
  timestamp: number;
  resolved: boolean;
  resolvedAt?: number;
  resolvedBy?: string;
}

interface PackageFrustrationRecord extends FrustrationRecord {
  imageUri?: string;        // Reference image
  detectionSource: 'ml' | 'ocr' | 'manual';
}
```

### Frustration Summary Screen

Location: `src/components/SDDGFrustrationSummary.tsx`

Displays all frustrations before proceeding to package inspection:

```typescript
function SDDGFrustrationSummary() {
  const { frustrations, resolvedFrustrations } = useInspectionForm();

  const unresolvedCount = frustrations.filter(f => !f.resolved).length;

  return (
    <View>
      <Text>Frustration Summary</Text>

      {frustrations.map(frustration => (
        <FrustrationCard
          key={frustration.key}
          frustration={frustration}
          onResolve={() => resolveFrustration(frustration.key)}
        />
      ))}

      <Button
        title="Complete with Frustration & Continue"
        onPress={navigateToMLDetection}
        disabled={unresolvedCount === 0}  // Must have at least one to use this flow
      />
    </View>
  );
}
```

---

## Downstream Verification Screens

After ML detection, users navigate to material-specific verification screens based on the UN number.

### Routing Logic

```typescript
function navigateToNextScreen() {
  const unNumber = extractedContent?.unIdNo || '';

  // Route based on material type
  switch (unNumber) {
    case 'UN1845':
      navigation.navigate('InspectorDryIce');
      break;

    case 'UN2807':
      navigation.navigate('InspectorMagnetizedMaterials');
      break;

    case 'UN3480':
    case 'UN3481':
    case 'UN3090':
    case 'UN3091':
      navigation.navigate('InspectorLithiumBatteries');
      break;

    case 'UN3508':
      navigation.navigate('InspectorCapacitors');
      break;

    default:
      navigation.navigate('InspectorPackageVerification');
  }
}
```

### Screen Files

| UN Number | Material | Screen |
|-----------|----------|--------|
| UN1845 | Carbon dioxide, solid (dry ice) | `InspectorDryIceScreen.tsx` |
| UN2807 | Magnetized material | `InspectorMagnetizedMaterialsScreen.tsx` |
| UN3480/3481/3090/3091 | Lithium batteries | `InspectorLithiumBatteriesScreen.tsx` |
| UN3508 | Capacitors | `InspectorCapacitorsScreen.tsx` |
| Default | Generic hazmat | `InspectorPackageVerification.tsx` |

### Material-Specific Validations

Each screen implements validations specific to that material type:

```typescript
// Example: UN3508 Capacitors require Watt-hour rating
function validateCapacitor(mlResults: AggregatedAnalysis): ValidationResult {
  const whPattern = /\d+\.?\d*\s?wh\b/i;
  const hasWhRating = mlResults.perImageResults.some(result =>
    whPattern.test(result.ocrResult?.fullText || '')
  );

  return {
    valid: hasWhRating,
    issues: hasWhRating ? [] : ['Watt-hour (Wh) rating not found on package']
  };
}

// Example: UN2807 Magnetized materials require handling instructions
function validateMagnetizedMaterial(mlResults: AggregatedAnalysis): ValidationResult {
  const requiredText = "Do not store magnetic materials";
  const hasInstruction = mlResults.perImageResults.some(result =>
    (result.ocrResult?.fullText || '').includes(requiredText)
  );

  return {
    valid: hasInstruction,
    issues: hasInstruction ? [] : ['Required handling instruction not found']
  };
}
```

---

## Error Handling Patterns

### ML Detection Screen

```typescript
// Image capture errors
try {
  const result = await camera.takePictureAsync(options);
} catch (error) {
  Alert.alert('Camera Error', 'Failed to capture image. Please try again.');
  return;
}

// Model load failures
if (!modelLoaded) {
  Alert.alert(
    'Model Not Ready',
    'The detection model is still loading. Please wait.',
    [{ text: 'OK' }]
  );
  return;
}

// OCR processing errors (non-blocking)
try {
  const ocrResult = await performOCR(imageUri);
} catch (error) {
  console.error('[OCR] Processing error:', error);
  // Continue without OCR - detection still works
  ocrResult = null;
}
```

### SDDG Processing Screen

```typescript
// Initialization errors
try {
  await initializePaddleOCR();
} catch (error) {
  Alert.alert('OCR Error', 'Failed to initialize OCR engine.');
  navigation.goBack();
  return;
}

// Extraction errors (log and continue)
try {
  const data = await extractFormData(imageUri, template);
} catch (error) {
  console.error('[SDDG] Extraction error:', error);
  // Navigate to verification with empty/partial data
  // User can manually enter data
}
```

### Context/Database Errors

```typescript
// Save failures preserve state
try {
  await saveCurrentInspection();
} catch (error) {
  dispatch({ type: 'SET_PROCESSING', payload: false });
  Alert.alert('Save Failed', 'Could not save inspection. Please try again.');
  throw error;  // Re-throw for caller to handle
}

// Load failures show error
try {
  await loadInspectionForEdit(inspectionId);
} catch (error) {
  Alert.alert('Load Failed', `Could not load inspection ${inspectionId}`);
  navigation.goBack();
}
```

---

## Key Technologies

### ML Frameworks

| Technology | Purpose | Notes |
|------------|---------|-------|
| YOLOX-Tiny | Object detection | 92 hazmat label classes, 640x640 input |
| Google ML Kit | Text recognition | On-device OCR, block/line hierarchy |
| TensorFlow Lite | Model inference | React Native integration |

### State Management

| Technology | Purpose |
|------------|---------|
| React Context | InspectionFormProvider (main inspection state) |
| Valtio | HazProStore (preparer context) |
| useState | Local component state |

### Database

| Technology | Purpose |
|------------|---------|
| expo-sqlite | Inspection persistence |
| AsyncStorage | Settings, preferences |

### Image Processing

| Technology | Purpose |
|------------|---------|
| expo-camera | Image capture |
| expo-image-picker | Gallery selection |
| react-native-document-scanner | Cropping interface |
| EXIF orientation | Image rotation correction |

---

## Quick Reference

### Important File Paths

```
src/
├── components/
│   ├── Inspector/
│   │   ├── InspectorHomeScreen.tsx
│   │   ├── MLDetectionScreen.tsx          # Main ML detection
│   │   ├── InteractiveSDDGComplianceScreen.tsx
│   │   └── [Material-specific screens]
│   ├── SDDGUploadAndParse.tsx
│   └── SDDGFrustrationSummary.tsx
├── screens/
│   └── SDDG/
│       ├── SDDGRegionAdjustmentScreen.tsx
│       └── SDDGProcessingScreen.tsx
├── ml/
│   ├── services/
│   │   └── ocrService.ts                  # OCR extraction pipeline
│   ├── hooks/
│   │   └── useDetection.ts                # Detection hook + aggregation
│   ├── components/
│   │   ├── ExtractedDataCard.tsx
│   │   └── POPMarkingCard.tsx
│   └── types/
│       └── ocr.ts                         # Type definitions
├── utils/
│   └── popMarkingParser.ts                # POP marking parser
├── contexts/
│   └── InspectionFormProvider/
│       └── InspectionFormProvider.tsx     # Main state provider
└── stores/
    └── useHazProStore.ts                  # Valtio store

server/
└── lookupFunctions/
    └── packagingLookupV2.ts               # Packaging database (1.1MB+)

docs/
└── attachment14/
    └── attachment14.pdf                   # AFMAN24-604 reference
```

### Common Patterns

```typescript
// Reading from inspection context
const { extractedContent, frustrations, mlAnalysisResults } = useInspectionForm();

// Updating verification field
updateVerificationField('unIdNo', 'UN0106');

// Adding a frustration
addFrustration({
  key: 'unIdNo',
  fieldLabel: 'UN ID Number',
  originalValue: 'UN0016',  // OCR misread
  reason: 'Incorrect UN number detected',
  category: 'sddg_field',
  timestamp: Date.now(),
  resolved: false
});

// Setting ML results
setMLAnalysisResults(aggregatedResults);

// Getting packaging options for a material
const entry = packagingDatabaseV2[packagingParagraph];
const allowedCodes = entry.packagingOptions.flatMap(opt =>
  opt.outerPackaging.categories.flatMap(cat =>
    cat.containers.map(c => c.code)
  )
);
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-05 | Claude | Initial comprehensive documentation |
