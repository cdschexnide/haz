# Inspector Workflow and ML Detection System Architecture

**Last Updated:** 2026-01-06
**Audience:** Future Claude Code instances, engineers, maintainers
**Regulatory Basis:** AFMAN24-604 (Air Force Manual for Preparing Hazardous Materials for Military Air Shipments)

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Complete Workflow Overview](#complete-workflow-overview)
3. [SDDG Save & Exit and Reinspection System](#sddg-save--exit-and-reinspection-system)
4. [SDDG Form Processing Pipeline](#sddg-form-processing-pipeline)
5. [ML Detection Screen Architecture](#ml-detection-screen-architecture)
6. [OCR Extraction Pipeline](#ocr-extraction-pipeline)
7. [UN Specification Package Marking System](#un-specification-package-marking-system)
8. [POP Marking Validation Screen](#pop-marking-validation-screen)
9. [Markings & Labels Validation Screen](#markings--labels-validation-screen)
10. [Material-Specific Verification Screens](#material-specific-verification-screens)
11. [Package Frustration Summary Screen](#package-frustration-summary-screen)
12. [Package Inspection Complete Screen](#package-inspection-complete-screen)
13. [AMC Form 1015 Screen](#amc-form-1015-screen)
14. [Packaging Database Integration](#packaging-database-integration)
15. [State Management Architecture](#state-management-architecture)
16. [Frustration System](#frustration-system)
17. [Label Matching System](#label-matching-system)
18. [Error Handling Patterns](#error-handling-patterns)
19. [Key Technologies](#key-technologies)

---

## Executive Summary

This application is a hazardous materials (hazmat) inspection tool for the US Air Force, built around AFMAN24-604 regulations. Inspectors use it to:

1. **Capture and validate SDDG forms** (Shipper's Declaration for Dangerous Goods)
2. **Photograph and analyze packages** using ML object detection and OCR
3. **Verify compliance** with packaging requirements based on material type
4. **Document frustrations** (non-compliance issues) for remediation
5. **Generate AMC Form 1015** inspection reports

The core technical innovation is the dual-pipeline ML detection system that combines:
- **YOLOX-Tiny object detection** for identifying 92 classes of hazmat labels
- **Google ML Kit OCR** for extracting text markings (UN numbers, POP markings, EX numbers)

---

## Complete Workflow Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          INSPECTOR WORKFLOW (2026-01-06)                         │
└─────────────────────────────────────────────────────────────────────────────────┘

  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 1: SDDG PROCESSING                             ║
  ╚════════════════════════════════════════════════════════════════════════════╝

┌──────────────────┐     ┌──────────────────┐     ┌─────────────────────────┐
│  Inspector       │     │ SDDGUploadAnd    │     │ SDDGRegionAdjustment   │
│  HomeScreen      │────▶│ Parse            │────▶│ Screen                  │
│                  │     │                  │     │                         │
│  "Start New      │     │  • Camera        │     │  • Adjust OCR regions  │
│   Inspection"    │     │  • Gallery       │     │  • Orientation correct │
│                  │     │  • Manual Entry  │     │  • Save & Continue     │
└────────┬─────────┘     └──────────────────┘     └─────────────────────────┘
         │                                                    │
         │ Click SDDG                                         ▼
         │ "Verified" ─────▶┌──────────────────────────────────────────────┐
         │                  │ SDDGInspectionComplete (reinspection)       │
         │                  │  • Review summary                            │
         │                  │  • Continue to Package (→ MLDetectionScreen) │
         │                  └──────────────────────────────────────────────┘
         │
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
         │                │ • Save & Exit    │──────▶ InspectorHomeScreen
         ▼                │ • Complete &     │        (inspection saved)
    ┌──────────────────┐  │   Continue       │
    │ SDDGInspection   │  └────────┬─────────┘
    │ CompleteScreen   │           │
    │                  │           │
    │ • Review summary │           │
    │ • Save & Exit    │──────────▶ InspectorHomeScreen
    │ • Continue to    │            (inspection saved)
    │   Package        │
    └────────┬─────────┘
             │
             ▼

  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 2: PACKAGE INSPECTION                          ║
  ╚════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────┐
    │         MLDetectionScreen            │
    │                                      │
    │  • Capture up to 6 package images   │
    │  • Optional cropping                │
    │  • YOLOX label detection            │
    │  • ML Kit OCR extraction            │
    │  • Manual corrections (add/edit)    │
    │  • Display aggregated results       │
    │  • Save CORRECTED results to context│
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │   InspectorPOPMarkingValidationScreen│
    │                                      │
    │  • Display detected POP marking     │
    │  • Validate each field (A-H)        │
    │  • Check packaging code vs allowed  │
    │  • Validate packing group rating    │
    │  • Can frustrate if non-compliant   │
    │  • Manual entry if not detected     │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │ InspectorMarkingsLabelsValidationScr │
    │                                      │
    │  • MARKINGS section:                │
    │    - PSN and UN Number              │
    │    - Military Shipping Label        │
    │  • LABELS section:                  │
    │    - Primary Hazard (e.g., 1.1B)    │
    │    - Cargo Aircraft Only            │
    │    - Subsidiary Hazard labels       │
    │  • Match ML detections to reqs      │
    │  • Validate/Frustrate buttons       │
    └──────────────────────────────────────┘
                    │
                    ▼
    ┌──────────────────────────────────────┐
    │ Material-Specific Screens (Optional) │
    │                                      │
    │  Routes based on UN number:          │
    │  • UN1845 → DryIceScreen            │
    │  • UN2807 → MagnetizedMaterials     │
    │  • UN3480/3090 → LithiumBatteries   │
    │  • UN3508 → CapacitorsScreen        │
    │  • UN3072/2990 → LifeSavingApplianc │
    │  • UN3245 → GeneticallyModified     │
    │  • UN3268 → SafetyDevices           │
    │  • UN3528/3529 → EnginesInternal    │
    │  • UN3316 → FirstAidChemicalKit     │
    │  • UN3363 → DangerousGoodsApparatus │
    │  • UN3171 → BatteryPoweredVehicle   │
    │  • Default → (skip to next step)    │
    └──────────────────────────────────────┘
                    │
                    ▼
         ┌─────────────────────┐
         │ Has Package         │
         │ Frustrations?       │
         └─────────────────────┘
              │            │
           Yes             No
              │            │
              ▼            ▼
    ┌────────────────┐  ┌────────────────────────┐
    │ Package        │  │ PackageInspection      │
    │ Frustration    │  │ CompleteScreen         │
    │ Summary        │  │                        │
    │                │  │  • Show inspection     │
    │  • Review all  │  │    summary             │
    │    package     │  │  • Save to database    │
    │    issues      │  │  • Navigate to AMC     │
    │  • Reinspect   │  │    Form 1015           │
    │    option      │  │                        │
    └───────┬────────┘  └───────────┬────────────┘
            │                       │
            ▼                       ▼

  ╔════════════════════════════════════════════════════════════════════════════╗
  ║                        PHASE 3: COMPLETION                                  ║
  ╚════════════════════════════════════════════════════════════════════════════╝

    ┌──────────────────────────────────────┐
    │      InspectorAMC1015Form            │
    │                                      │
    │  • Display AMC Form 1015 checklist  │
    │  • Show frustrated items as failed  │
    │  • Show resolved items with history │
    │  • Generate PDF report              │
    │  • Share/export functionality       │
    │  • Return to Inspector Home         │
    └──────────────────────────────────────┘
```

### File Locations Summary

| Screen | File Path |
|--------|-----------|
| Inspector Home | `src/components/Inspector/InspectorHomeScreen.tsx` |
| SDDG Upload | `src/components/SDDGUploadAndParse.tsx` |
| Region Adjustment | `src/screens/SDDG/SDDGRegionAdjustmentScreen.tsx` |
| SDDG Processing | `src/screens/SDDG/SDDGProcessingScreen.tsx` |
| Interactive Compliance | `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx` |
| SDDG Frustration Summary | `src/components/SDDGFrustrationSummary.tsx` |
| **ML Detection** | `src/components/Inspector/MLDetectionScreen.tsx` |
| **POP Marking Validation** | `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx` |
| **Markings & Labels Validation** | `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx` |
| **Package Frustration Summary** | `src/components/Inspector/PackageFrustrationSummary.tsx` |
| **Package Inspection Complete** | `src/components/Inspector/PackageInspectionCompleteScreen.tsx` |
| **AMC Form 1015** | `src/components/Inspector/InspectorAMC1015Form.tsx` |
| **SDDG Inspection Complete** | `src/components/SDDGInspectionCompleteScreen.tsx` |

---

## SDDG Save & Exit and Reinspection System

### Overview

The Save & Exit system allows inspectors to save partial inspections at the SDDG phase and resume later from the InspectorHomeScreen. This enables:

1. **Interrupted Workflows** - Inspectors can pause mid-inspection and return later
2. **Team Handoffs** - One inspector can complete SDDG, another can complete package inspection
3. **Break Points** - Natural pause points after SDDG validation before package inspection

### Exit Points

#### 1. SDDGInspectionCompleteScreen (Zero Frustrations Flow)

When the SDDG validation passes with no frustrations, the inspector reaches this screen with three options:

```typescript
// src/components/SDDGInspectionCompleteScreen.tsx

// Option 1: Go Back (review validation)
<TouchableOpacity onPress={() => navigation.goBack()}>
  <MaterialIcons name="arrow-back" size={20} color="#8E8E93" />
  <Text>Back</Text>
</TouchableOpacity>

// Option 2: Save & Exit (save partial inspection, return to home)
<TouchableOpacity onPress={handleSaveAndExit}>
  <MaterialIcons name="save" size={20} color="#007AFF" />
  <Text>Save & Exit</Text>
</TouchableOpacity>

// Option 3: Continue to Package (proceed with inspection)
<TouchableOpacity onPress={handleContinueToPackage}>
  <Text>Continue to Package</Text>
  <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
</TouchableOpacity>
```

#### 2. SDDGFrustrationSummary (Frustrations Flow)

When the SDDG validation has frustrations, the inspector can save and exit from this screen:

```typescript
// src/components/SDDGFrustrationSummary.tsx

// Save & Exit button added alongside existing Complete button
<TouchableOpacity onPress={handleSaveAndExit}>
  <MaterialIcons name="save" size={20} color="#007AFF" />
  <Text>Save & Exit</Text>
</TouchableOpacity>
```

### Save Logic

Both screens use the same save pattern:

```typescript
const handleSaveAndExit = async () => {
  try {
    setIsSaving(true);

    const sddgData = inspection.verificationCopy;
    if (!sddgData) {
      Alert.alert("Error", "No SDDG data available to save");
      return;
    }

    // Create InspectorShipment record with partial completion status
    const inspectionRecord: InspectorShipment = {
      id: Date.now().toString(),
      status: "in-progress",              // Overall status - not fully complete
      inspectedAt: new Date(),
      inspectionContext: { ...inspection },
      tcn: sddgData.shippersReferenceNumber || "N/A",
      unId: sddgData.unIdNo || "N/A",
      properShippingName: sddgData.properShippingName || "N/A",
      inspector: inspection.inspector,
      sddgStatus: "verified",             // or "frustrated" from SDDGFrustrationSummary
      packageStatus: null,                // Package phase not started yet
      totalFrustrations: frustrationCount,
      sddgFrustrations: frustrationCount,
      packageFrustrations: 0,
    };

    // Save to database FIRST, before any state mutations
    const savedId = await database.saveInspection(inspectionRecord);
    console.log("📝 Inspection saved successfully:", savedId);

    // CRITICAL: State updates happen AFTER successful database save
    completeSDDGSubstep("SDDGFrustrationSummary");  // or "SDDGComplianceValidation"
    setSDDGComplete(true);

    Alert.alert(
      "Inspection Saved",
      "SDDG inspection has been saved. You can continue the package inspection later from the home screen.",
      [{
        text: "OK",
        onPress: () => {
          startNewInspection();  // Clear provider state
          navigation.navigate("InspectorHomeStack", { screen: "InspectorHome" });
        },
      }]
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    Alert.alert("Save Failed", `Failed to save inspection: ${errorMessage}. Please try again.`);
  } finally {
    setIsSaving(false);
  }
};
```

### InspectorShipment Status Values

| Field | Value | Meaning |
|-------|-------|---------|
| `status` | `"in-progress"` | Overall inspection not complete (SDDG done, package not started) |
| `status` | `"completed"` | Both SDDG and package phases complete |
| `sddgStatus` | `"verified"` | SDDG passed with zero frustrations |
| `sddgStatus` | `"frustrated"` | SDDG has frustrations |
| `packageStatus` | `null` | Package inspection not started |
| `packageStatus` | `"verified"` | Package passed with zero frustrations |
| `packageStatus` | `"frustrated"` | Package has frustrations |

### InspectorHomeScreen Table Display

The inspection table shows saved inspections with appropriate status indicators:

```
┌───────────────────────────────────────────────────────────────────────┐
│                    RECENT INSPECTIONS TABLE                           │
├───────────┬─────────────────────────┬───────────┬─────────────────────┤
│ TCN       │ PSN                     │ SDDG      │ Package             │
├───────────┼─────────────────────────┼───────────┼─────────────────────┤
│ TCN-001   │ FUZES DETONATING        │ Verified  │ N/A                 │
│           │                         │ (green)   │ (gray, clickable)   │
├───────────┼─────────────────────────┼───────────┼─────────────────────┤
│ TCN-002   │ DETONATORS              │ Frustrated│ N/A                 │
│           │                         │ (red)     │ (gray, clickable)   │
├───────────┼─────────────────────────┼───────────┼─────────────────────┤
│ TCN-003   │ AMMO, BLANK             │ Verified  │ Verified            │
│           │                         │ (green)   │ (green)             │
└───────────┴─────────────────────────┴───────────┴─────────────────────┘
```

#### Package Column "N/A" Display

When `packageStatus === null`, the Package column displays "N/A" (not applicable yet) instead of "Not Started":

```typescript
// src/components/Inspector/InspectorHomeScreen.tsx

<Text style={[
  styles.columnText,
  styles.statusText,
  item.packageStatus === null
    ? styles.naStatus           // Gray text for N/A
    : item.packageStatus === "verified"
    ? styles.verifiedStatus     // Green for verified
    : styles.frustratedStatus,  // Red for frustrated
]}>
  {item.packageStatus === null
    ? "N/A"
    : item.packageStatus === "verified"
    ? "Verified"
    : "Frustrated"}
</Text>
```

### Reinspection Flow

#### SDDG Status Click Handler

When an inspector clicks on the SDDG status column:

```typescript
// src/components/Inspector/InspectorHomeScreen.tsx

const handleSDDGStatusClick = async (inspection: InspectorShipment) => {
  // Verified SDDG → Navigate to SDDGInspectionCompleteScreen for review/continue
  if (inspection.sddgStatus === "verified") {
    try {
      await loadInspectionForEdit(inspection.id);
      navigate("InspectorWrappedStack", {
        screen: "SDDGInspectionCompleteScreen",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load inspection data. Please try again.");
    }
    return;
  }

  // Frustrated SDDG → Navigate to SDDGFrustrationSummary for review
  if (inspection.sddgStatus === "frustrated") {
    try {
      await loadInspectionForEdit(inspection.id);
      navigate("InspectorWrappedStack", {
        screen: "SDDGFrustrationSummary",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load inspection data. Please try again.");
    }
  }
};
```

#### Package N/A Click Handler

When an inspector clicks on the Package "N/A" status:

```typescript
// src/components/Inspector/InspectorHomeScreen.tsx

const handlePackageStatusClick = async (inspection: InspectorShipment) => {
  // Package not started yet (N/A) → Prompt to continue
  if (inspection.packageStatus === null) {
    Alert.alert(
      "Package Inspection Not Started",
      "The SDDG phase is complete. Would you like to continue with the package inspection?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Continue",
          onPress: async () => {
            try {
              await loadInspectionForEdit(inspection.id);

              // Route based on UN number for material-specific flows
              const unIdNo = inspection.unId || "";
              navigate("InspectorWrappedStack", {
                screen: "MLDetectionScreen",
                params: { unIdNo },
              });
            } catch (error) {
              Alert.alert("Error", "Failed to load inspection data. Please try again.");
            }
          },
        },
      ]
    );
    return;
  }

  // Package verified or frustrated → Show detail view
  // ... existing logic for completed package inspections
};
```

### Navigation Flow Diagram

```
                         ┌─────────────────────────┐
                         │  InspectorHomeScreen    │
                         │                         │
                         │  Table Row Click:       │
                         │  • SDDG column          │
                         │  • Package column       │
                         └───────────┬─────────────┘
                                     │
              ┌──────────────────────┴──────────────────────┐
              │                                             │
              ▼                                             ▼
     SDDG Column Click                            Package Column Click
              │                                             │
     ┌────────┴────────┐                          ┌────────┴────────┐
     │                 │                          │                 │
     ▼                 ▼                          ▼                 ▼
 "Verified"      "Frustrated"               "N/A" (null)      "Verified"/
     │                 │                          │           "Frustrated"
     │                 │                          │                │
     ▼                 ▼                          ▼                ▼
┌──────────────┐ ┌──────────────┐      ┌─────────────────┐  ┌──────────┐
│ SDDGInspec-  │ │ SDDGFrustra- │      │ Alert: Continue │  │ Detail   │
│ tionComplete │ │ tionSummary  │      │ to Package?     │  │ View     │
│ Screen       │ │              │      └────────┬────────┘  └──────────┘
│              │ │              │               │
│ "Continue    │ │ "Complete    │               ▼
│  to Package" │ │  with        │      ┌─────────────────┐
│      │       │ │  Frustrat-   │      │ MLDetection     │
│      │       │ │  ions"       │      │ Screen          │
│      │       │ │      │       │      │                 │
│      ▼       │ │      ▼       │      │ (Package phase  │
│ MLDetection  │ │ [Next screen │      │  begins)        │
│ Screen       │ │  based on UN]│      └─────────────────┘
└──────────────┘ └──────────────┘
```

### InteractiveSDDGComplianceScreen Button Text

The "Continue" button text changes based on frustration state:

```typescript
// src/components/Inspector/InteractiveSDDGComplianceScreen.tsx

<Text style={styles.buttonPrimaryText}>
  {frustratedFields.size > 0
    ? "Review Frustrations"      // Has frustrations → goes to SDDGFrustrationSummary
    : "Continue Inspection"}     // No frustrations → goes to SDDGInspectionCompleteScreen
</Text>
```

### Zero Frustration Navigation Path

When InteractiveSDDGComplianceScreen has no frustrations, it routes directly to SDDGInspectionCompleteScreen:

```typescript
// src/components/Inspector/InteractiveSDDGComplianceScreen.tsx

const handleContinue = useCallback(() => {
  const frustratedCount = frustratedFields.size;

  if (frustratedCount === 0) {
    // No frustrations - go to SDDG Inspection Complete screen
    completeSDDGSubstep("InteractiveSDDGComplianceScreen");
    navigation.navigate("SDDGInspectionCompleteScreen");
  } else {
    // Has frustrations - review them first
    navigation.navigate("SDDGFrustrationSummary");
  }
}, [frustratedFields.size, navigation, completeSDDGSubstep]);
```

### Files Modified for Save & Exit Feature

| File | Changes |
|------|---------|
| `src/components/SDDGInspectionCompleteScreen.tsx` | Added Back button, fixed Save & Exit navigation |
| `src/components/SDDGFrustrationSummary.tsx` | Added Save & Exit button with database persistence |
| `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx` | Changed button text, updated zero-frustration navigation |
| `src/components/Inspector/InspectorHomeScreen.tsx` | SDDG verified click handler, Package N/A display and click handler |

### Critical Implementation Notes

1. **State Mutation Timing**: Always save to database BEFORE updating context state. This prevents data loss if the save fails.

2. **Navigation Path**: Use `navigation.navigate("InspectorHomeStack", { screen: "InspectorHome" })` to properly navigate back to the home screen within the nested navigator structure.

3. **Error Handling**: Wrap database operations in try/catch and provide user feedback on failure.

4. **N/A vs Not Started**: Use "N/A" for package status when `packageStatus === null` to indicate the phase hasn't begun (vs. "Not Started" which could imply an error).

5. **Reinspection Context**: When loading a saved inspection, use `loadInspectionForEdit(id)` to properly restore the InspectionFormProvider context.

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
  allDetectedLabels: AggregatedLabel[];

  // Extracted markings
  allUnNumbers: string[];           // ["UN0106", "UN3082"]
  allEXNumbers: string[];           // ["EX-2019037142"]
  allUnWithPSN: { un: string; psn: string }[];
  allWeights: ExtractedWeight[];
  allHazardClasses: string[];
  allPSNs: string[];
  countryOfOrigin: string | null;

  // Processing metadata
  imagesProcessed: number;
  totalProcessingTime: number;
  perImageResults: ImageAnalysisResult[];
}
```

### Manual Corrections System

**CRITICAL**: User corrections must be saved to context when navigating.

```typescript
// Corrections state (mutable copy of original results)
const [correctedResults, setCorrectedResults] = useState<ImageAnalysisResult[]>([]);
const [corrections, setCorrections] = useState<ManualCorrection[]>([]);

interface ManualCorrection {
  type: 'add' | 'edit' | 'delete';
  originalClassId?: number;    // For edit: what was the original class
  originalClassName?: string;  // For edit: original name for audit trail
  newLabel?: string;           // For add/edit
  timestamp: number;
  source: 'manual';
}
```

### Saving Corrected Results to Context

**IMPORTANT**: When navigating to the next screen, the `navigateToNextScreen` function MUST re-aggregate from `correctedResults`, not the original `aggregatedResults`.

```typescript
// src/components/Inspector/MLDetectionScreen.tsx - navigateToNextScreen()

import { aggregateResults } from "../../ml/hooks/useDetection";

const navigateToNextScreen = useCallback(() => {
  // Use correctedResults if available (contains user corrections), otherwise use original
  const resultsToSave = correctedResults.length > 0
    ? correctedResults
    : (analysisResults || []);

  if (resultsToSave.length > 0) {
    // Re-aggregate from corrected results to include user corrections
    const finalAggregated = aggregateResults(resultsToSave);
    console.log('[MLDetectionScreen] Saving ML results to context (with corrections):', {
      hasPOP: !!finalAggregated.bestPopMarking,
      labels: finalAggregated.allDetectedLabels.length,
      labelClassNames: finalAggregated.allDetectedLabels.map(l => l.className),
      unNumbers: finalAggregated.allUnNumbers.length,
    });
    setMLAnalysisResults(finalAggregated);
  }

  navigation.navigate("InspectorPOPMarkingValidationScreen");
}, [navigation, correctedResults, analysisResults, setMLAnalysisResults]);
```

### Key Functions

| Function | Purpose |
|----------|---------|
| `processAllImagesWithAnalysis()` | Main entry point for batch processing |
| `handleCameraCapture()` | Camera image capture with orientation |
| `handleGallerySelect()` | Image picker integration |
| `handleCropComplete()` | Cropping result handler |
| `aggregateResults()` | Combine results from all images (exported from useDetection) |
| `navigateToNextScreen()` | Save corrected results and route to POP validation |

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

### POP Marking Parser

Location: `src/utils/popMarkingParser.ts`

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

## POP Marking Validation Screen

### Component Location

`src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

### Purpose

Validates the UN specification package marking detected by ML/OCR against AFMAN 24-604 requirements.

### Screen States

```typescript
// Two possible render states based on ML detection
if (!hasDetectedPOP) {
  return <NotDetectedState navigation={navigation} />;
}
return <DetectedState navigation={navigation} />;
```

### Not Detected State

When no POP marking is detected:
- User can **Enter Manually** → navigates to `InspectorPOPMarkingDataEntry`
- User can **Mark as Missing** → adds frustration and continues

```typescript
const handleMarkAsMissing = () => {
  addPackageFrustration({
    category: "marking",
    itemId: "pop-marking-missing",
    itemLabel: "UN Specification Marking",
    expectedValues: ["UN specification marking present"],
    verificationStatus: "missing",
    defaultMessage: "Required UN specification packaging marking not found on package",
    afmanReference: "AFMAN 24-604 A14.2",
  });
  navigation.navigate("InspectorMarkingsLabelsValidationScreen");
};
```

### Detected State

When POP marking is detected:
- Displays parsed fields (A through H) in a visual table
- Shows detection confidence percentage
- Validates each field against requirements:
  - **Field B (Packaging Code)**: Must be in allowed list for the packaging paragraph
  - **Field C (Packing Group)**: Must be compatible with material's packing group
  - **Field E (Manufacture Date)**: Checks for expiration (5-year rule for some materials)
- User can **Validate** (green checkmark) or **Frustrate** (red X) each field

### Navigation

After validation completes:
```typescript
navigation.navigate("InspectorMarkingsLabelsValidationScreen");
```

---

## Markings & Labels Validation Screen

### Component Location

`src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx`

### Purpose

Validates required markings and labels against ML detections. This screen replaced the previous `InspectorPackageVerificationScreen` for the default (non-material-specific) flow.

### Data Structure

```typescript
type MatchStatus = "matched" | "unmatched";
type ValidationStatus = "pending" | "validated" | "frustrated";

interface ValidationItem {
  id: string;
  category: "marking" | "label";
  label: string;                    // e.g., "PSN and UN Number", "Primary Hazard"
  expectedValues: string[];         // e.g., ["FUZES DETONATING UN0106"], ["Class 1.1B"]
  matchStatus: MatchStatus;         // "matched" if ML detected, "unmatched" if not
  matchedDetection: AggregatedLabel | null;
  matchConfidence: number | null;   // 0.0-1.0
  validationStatus: ValidationStatus;
  afmanReference?: string;
}
```

### Sections

The screen displays two sections in a SectionList:

1. **MARKINGS** - Text-based package markings
   - PSN and UN Number (e.g., "FUZES DETONATING UN0106")
   - Military Shipping Label (MSL) or DD Form 1387

2. **LABELS** - Physical hazmat labels
   - Primary Hazard (e.g., "Class 1.1B")
   - Subsidiary Hazard (if applicable)
   - Cargo Aircraft Only (if required)
   - Other material-specific labels

### Requirements Evaluation

```typescript
// Get required markings based on SDDG data
const requiredMarkings = evaluateMarkingRequirementsInspector(inspection);
// Returns: { "PSN and UN Number": ["FUZES DETONATING UN0106"], ... }

// Get required labels based on UN number and hazard class
const requiredLabels = evaluateLabelingRequirements(inspection);
// Returns: { "Primary Hazard": ["Class 1.1B"], "Cargo Aircraft Only": ["Cargo Aircraft Only"], ... }
```

### Special Handling: PSN and UN Number

The "PSN and UN Number" marking uses **structured data** from ML results, not regex pattern matching:

```typescript
if (label === "PSN and UN Number") {
  // Check structured data - allUnWithPSN contains parsed UN+PSN pairs
  const hasUnWithPSN = (mlResults?.allUnWithPSN?.length ?? 0) > 0;
  foundInOCR = hasUnWithPSN;
  matchConfidence = hasUnWithPSN ? 0.95 : null;
} else {
  // Fall back to regex pattern matching for other markings
  foundInOCR = findMatchingMarkingInOCR(label, allOCRText);
}
```

### Card Styling States

| State | Border | Background | Badge |
|-------|--------|------------|-------|
| Not Detected | Orange | Yellow (#FFF9E6) | Orange "Not Detected" |
| Detected | Green | White | Green "Detected" |
| Validated | Green | Light Green (#F0FFF4) | Green "Verified" |
| Frustrated | Red | Light Red (#FFF0F0) | Red "Frustration" |

### Navigation

```typescript
const navigateToNextScreen = useCallback(() => {
  const unIdNo = inspection.verificationCopy?.unIdNo || "";

  // Route to material-specific screens if applicable
  if (unIdNo === "UN1845") {
    navigation.navigate("InspectorDryIceScreen");
  } else if (unIdNo === "UN2807") {
    navigation.navigate("InspectorMagnetizedMaterialsScreen");
  }
  // ... other material-specific routes ...
  else {
    // No material-specific screen needed
    const hasPackageFrustrations = inspection.packageFrustrations.length > 0;

    if (hasPackageFrustrations) {
      navigation.navigate("PackageFrustrationSummary");
    } else {
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  }
}, [navigation, inspection]);
```

---

## Material-Specific Verification Screens

### Overview

After Markings & Labels validation, certain UN numbers require additional material-specific verification.

### Routing Table

| UN Number | Material | Screen | Key Validations |
|-----------|----------|--------|-----------------|
| UN1845 | Dry Ice (CO₂ solid) | `InspectorDryIceScreen.tsx` | Weight limits, venting |
| UN2807 | Magnetized Material | `InspectorMagnetizedMaterialsScreen.tsx` | Field strength, handling |
| UN3072, UN2990 | Life-saving appliances | `InspectorLifeSavingAppliancesScreen.tsx` | Gas cartridges |
| UN3245 | GMO | `InspectorGeneticallyModifiedOrganismsScreen.tsx` | Containment |
| UN3268 | Safety devices | `InspectorSafetyDevicesScreen.tsx` | Airbag modules |
| UN3508 | Capacitors | `InspectorCapacitorsScreen.tsx` | Wh rating |
| UN3528, UN3529 | Engines (internal combustion) | `InspectorEnginesInternalCombustionScreen.tsx` | Fuel type |
| UN3316 | First aid kit | `InspectorFirstAidChemicalKitScreen.tsx` | Contents |
| UN3363 | Dangerous goods in apparatus | `InspectorDangerousGoodsInApparatusScreen.tsx` | - |
| UN3171 | Battery-powered vehicle | `InspectorBatteryPoweredVehicleScreen.tsx` | Battery type |
| UN3480, UN3090 | Lithium batteries | `InspectorLithiumBatteriesScreen.tsx` | Wh rating, cell limits |

### Common Pattern

Each material-specific screen:
1. Reads ML analysis results from context
2. Displays material-specific requirements
3. Allows validation or frustration of each requirement
4. Navigates to `PackageFrustrationSummary` or `PackageInspectionCompleteScreen`

---

## Package Frustration Summary Screen

### Component Location

`src/components/Inspector/PackageFrustrationSummary.tsx`

### Purpose

Displays all package frustrations collected during the inspection for review before completion.

### Data Sources

```typescript
const packageFrustrations = inspection.packageFrustrations || [];

// Separate frustrations by category
const markingFrustrations = packageFrustrations.filter(f => f.category === "marking");
const labelFrustrations = packageFrustrations.filter(f => f.category === "label");
const dryIceFrustrations = packageFrustrations.filter(f => f.category === "dryice");
const magnetizedFrustrations = packageFrustrations.filter(f => f.category === "magnetized");
```

### User Actions

1. **Review Frustrations** - See all documented package issues
2. **Start Reinspection** - Go back to re-verify specific items
3. **Complete with Frustrations** - Accept issues and proceed to Form 1015

### Navigation

```typescript
// After completing frustration review
const handleCompleteWithFrustrations = () => {
  navigation.navigate("InspectorAMC1015Form");
};

// For reinspection
const handleStartReinspection = () => {
  startPackageReinspection(frustrationIds);
  navigation.navigate("MLDetectionScreen");  // Or specific screen
};
```

---

## Package Inspection Complete Screen

### Component Location

`src/components/Inspector/PackageInspectionCompleteScreen.tsx`

### Purpose

Displayed when the package inspection completes with **no frustrations**. Allows saving and proceeding to Form 1015.

### Data Display

```typescript
// Get SDDG data from verification copy (source of truth)
const sddgData = inspection.verificationCopy;

// Calculate frustration counts
const sddgFrustrations = inspection.frustrations || [];
const packageFrustrations = inspection.packageFrustrations || [];  // Should be 0
const totalFrustrations = sddgFrustrations.length + packageFrustrations.length;
```

### Save Logic

```typescript
const handleSaveAndExit = async () => {
  const inspectionRecord: InspectorShipment = {
    id: Date.now().toString(),
    status: "completed",
    inspectedAt: new Date(),
    inspectionContext: { ...inspection },
    tcn: sddgData.shippersReferenceNumber || "N/A",
    unId: sddgData.unIdNo || "N/A",
    properShippingName: sddgData.properShippingName || "N/A",
    inspector: inspection.inspector,
    sddgStatus: sddgFrustrations.length > 0 ? "frustrated" : "verified",
    packageStatus: "verified",  // No package frustrations
    totalFrustrations: totalFrustrations,
    sddgFrustrations: sddgFrustrations.length,
    packageFrustrations: 0,
  };

  await database.saveInspection(inspectionRecord);
  navigation.navigate("InspectorAMC1015Form");
};
```

---

## AMC Form 1015 Screen

### Component Location

`src/components/Inspector/InspectorAMC1015Form.tsx`

### Purpose

Generates the official AMC Form 1015 (Hazardous Material Inspection Checklist) based on the inspection results.

### Key Features

1. **Checklist Display** - Shows all Form 1015 line items with pass/fail status
2. **Frustration Mapping** - Maps frustrations to specific Form 1015 line numbers
3. **Resolution History** - Shows reinspection timeline for resolved issues
4. **PDF Generation** - Creates printable/shareable Form 1015 document

### Frustration to Form 1015 Mapping

```typescript
import {
  mapFrustrationsToForm1015WithResolved,
  getForm1015FrustrationDescription
} from "../../utils/sddgToForm1015Mapping";

const {
  currentlyFrustrated: frustratedForm1015Ids,
  resolved: resolvedForm1015Ids,
} = mapFrustrationsToForm1015WithResolved(
  sddgFrustrations,
  packageFrustrations,
  resolvedSddgFrustrations,
  resolvedPackageFrustrations,
  verificationCopy
);
```

### Chevron State

Sets the chevron to "complete" when mounted:
```typescript
useEffect(() => {
  actions.setCurrentChevron("complete");
}, []);
```

### PDF Generation

```typescript
const handleGeneratePdf = async () => {
  setIsGeneratingPdf(true);

  const htmlContent = generateForm1015Html({
    inspector,
    tcn,
    inspectedByDate,
    frustratedLineItems: frustratedForm1015Ids,
    resolvedLineItems: resolvedForm1015Ids,
    comments: formatFrustrationsForComments(),
  });

  const { uri } = await Print.printToFileAsync({ html: htmlContent });
  await Sharing.shareAsync(uri);

  setIsGeneratingPdf(false);
};
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
    materials: string[];
    description: string;
  };

  outerPackaging: {
    required: boolean;
    categories: OuterPackagingCategory[];
  };

  restrictions: string[];
  isComplete: boolean;
}
```

### Validation Flow

```typescript
async function validatePackaging(
  extractedPOP: ParsedPOPMarking,
  sddgData: ExtractedSDDGContent
): Promise<PackagingValidationResult> {
  // 1. Get packaging paragraph from SDDG
  const packagingParagraph = sddgData.packagingParagraph;

  // 2. Look up allowed packaging options
  const entry = packagingDatabaseV2[packagingParagraph];

  // 3. Extract packaging code from POP marking
  const detectedCode = extractedPOP.fields.fieldA_UNCode;

  // 4. Check if code is in allowed options
  const allowedCodes = entry.packagingOptions.flatMap(opt =>
    opt.outerPackaging.categories.flatMap(cat =>
      cat.containers.map(c => c.code)
    )
  );

  return {
    valid: allowedCodes.includes(detectedCode),
    detectedCode,
    allowedCodes,
  };
}
```

---

## State Management Architecture

### Overview

The application uses two primary state management solutions:

1. **React Context + useReducer** (`InspectionFormProvider`) - Main inspection state
2. **Valtio** (`useHazProStore`) - Preparer context and workflow chevron state

### InspectionFormProvider

Location: `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx`

```typescript
interface InspectionFormState {
  currentInspection: {
    // SDDG Data
    extractedContent: ExtractedSDDGContent;
    verificationCopy: ExtractedSDDGContent;
    sddgImageUri: string | null;

    // Frustrations
    frustrations: FrustrationRecord[];           // SDDG frustrations
    packageFrustrations: PackageFrustrationRecord[];  // Package frustrations
    resolvedFrustrations: FrustrationRecord[];
    resolvedPackageFrustrations: PackageFrustrationRecord[];

    // ML Analysis Results
    mlAnalysisResults: AggregatedAnalysis | null;

    // Package Data
    packagePopMarking: PackagePopMarking;
    magnetizedMaterialData: InspectorMagnetizedMaterialData;
    innerPackagingData: InnerPackagingInspectionData;

    // Metadata
    inspector: string | InspectorInfo;
    inspectionId: string | null;
  };

  workflowState: {
    currentChevron: 'sddg' | 'package' | 'complete';
    reinspection: {
      mode: 'none' | 'sddg' | 'package';
      targetFrustrations: string[];
    };
  };
}
```

### Key Actions

```typescript
// ML Analysis
setMLAnalysisResults(results: AggregatedAnalysis)

// Package Frustrations
addPackageFrustration(frustration: PackageFrustrationRecord)
removePackageFrustration(itemId: string)

// Inspection Lifecycle
completeInspection()
startPackageReinspection(frustrationKeys: string[])
updateReinspectedInspection()
```

---

## Frustration System

### Overview

The frustration system tracks non-compliance issues discovered during inspection. There are four categories of frustrations, each created at different points in the workflow and mapped to specific fields on the AMC Form 1015.

### Frustration Types

| Type | Storage | Created By | Form 1015 Fields |
|------|---------|------------|------------------|
| **SDDG Frustrations** | `inspection.frustrations` | InteractiveSDDGComplianceScreen | Fields 2-23 (SDDG validation) |
| **POP Marking Frustrations** | `inspection.packageFrustrations` | InspectorPOPMarkingValidationScreen | Field 54 |
| **Marking Frustrations** | `inspection.packageFrustrations` | InspectorMarkingsLabelsValidationScreen | Fields 53, 75, etc. |
| **Label Frustrations** | `inspection.packageFrustrations` | InspectorMarkingsLabelsValidationScreen | Fields 69, 71, 72, 75 |

---

### SDDG Frustrations

**Source:** `src/components/Inspector/InteractiveSDDGComplianceScreen.tsx`

Created when an inspector identifies an issue with a field on the SDDG form (Shipper's Declaration for Dangerous Goods).

#### SDDG Field → Form 1015 Mapping

| SDDG Field (Key) | Form 1015 Field | Description |
|------------------|-----------------|-------------|
| `shipper` (Key 1) | **2** | Shipper's Address and Phone Number |
| `consignee` (Key 2) | **3** | Consignee DODAAC or Address |
| `shippersReferenceNumber` (Key 5) | **4** | Transportation Control Number (TCN) |
| `airportOfDeparture` (Key 8) | **5** | Airport of Departure and Destination |
| `airportOfDestination` (Key 9) | **5** | Airport of Departure and Destination |
| `nameOfSignatory` (Key 20) | **6** | Name and Title of Preparer with Signature |
| `placeAndDate` (Key 21) | **7** | Place and Date Material Certified |
| `additionalHandlingInfo` (Key 19) | **9** | Emergency Response Number |
| `aircraftType` (Key 7) | **11** | Passenger or Cargo Aircraft Only |
| `shipmentType` (Key 10) | **12** | Radioactive or Nonradioactive Shipment |
| `unIdNo` (Key 11) | **13** | Identification Number (UN, ID, NA) |
| `properShippingName` (Key 12) | **14** | PSN (with Technical Name if Required) |
| `hazardClass` (Key 13) | **15** | Primary Hazard Class or Division |
| `subsidiaryRisk` (Key 14) | **16** | Subsidiary Risk Class or Division |
| `packingGroup` (Key 15) | **17** | Packaging Group |
| `quantityAndPackingType` (Key 16) | **18** | Number and Type of Packages |
| `quantityAndPackingQuantity` (Key 16) | **19** | Net Quantity Per Package |
| `packingInstruction` (Key 17) | **23** | Packaging Paragraph (Attachments 5-13) |

#### SDDG Frustration Record Structure

```typescript
interface FrustrationRecord {
  key: string;                       // e.g., "shipper"
  fieldLabel: string;                // e.g., "SHIPPER (Key 1)"
  fieldValue: string;                // The incorrect value
  correctValue?: string;             // The expected correct value
  frustrationDate: Date;
  defaultMessage: string;
  additionalComments?: string;
  inspector: Inspector;
  reinspectionHistory?: ReinspectionAttempt[];
}
```

#### Creating an SDDG Frustration

```typescript
// In InteractiveSDDGComplianceScreen.tsx
addFrustration({
  key: "shipper",
  fieldLabel: "SHIPPER (Key 1)",
  fieldValue: "FY4484 BLDG 1757...",
  correctValue: "Correct shipper info...",
  defaultMessage: "This key of the SDDG is incorrect. Requires re-inspection",
  additionalComments: "Missing phone number",
});
```

---

### POP Marking Frustrations (UN Specification Package Marking)

**Source:** `src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx`

Created when the UN specification package marking is missing or has invalid fields.

#### POP Marking → Form 1015 Mapping

| POP Frustration | Form 1015 Field | Description |
|-----------------|-----------------|-------------|
| `UN Specification Marking` | **54** | UN or POP Specification Marking (missing) |
| `Packaging Code (Field B)` | **54** | UN or POP Specification Marking (invalid code) |
| `Packing Group (Field C)` | **54** | UN or POP Specification Marking (invalid PG rating) |

#### Creating POP Marking Frustrations

```typescript
// When POP marking is completely missing
addPackageFrustration({
  category: "marking",
  itemId: "pop-marking-missing",
  itemLabel: "UN Specification Marking",
  expectedValues: ["UN specification marking present"],
  verificationStatus: "missing",
  defaultMessage: "Required UN specification packaging marking not found on package",
  afmanReference: "AFMAN 24-604 A14.2",
});

// When Field B (Packaging Code) is invalid
addPackageFrustration({
  category: "marking",
  itemId: "pop-field-b-validation",
  itemLabel: "Packaging Code (Field B)",
  expectedValues: ["Valid packaging code for A5.24."],
  verificationStatus: "incorrect",
  defaultMessage: "Packaging code '4H2' is not authorized for A5.24.",
  afmanReference: "AFMAN 24-604 A14.3",
});

// When Field C (Packing Group) is invalid
addPackageFrustration({
  category: "marking",
  itemId: "pop-field-c-validation",
  itemLabel: "Packing Group (Field C)",
  expectedValues: ["X", "Y"],
  verificationStatus: "incorrect",
  defaultMessage: "Packing group rating 'Z' is insufficient for PG II material",
  afmanReference: "AFMAN 24-604 A14.4",
});
```

---

### Marking Frustrations

**Source:** `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx` (MARKINGS section)

Created when required text markings on the package are missing or incorrect.

#### Marking → Form 1015 Mapping

| Marking | Form 1015 Field | Description |
|---------|-----------------|-------------|
| `PSN and UN Number` | **53** | PSN and Identification Number |
| `Military Shipping Label (MSL) or DD Form 1387` | **75** | Other (Labeling section) |
| `Inhalation Hazard` | **30** | "Inhalation Hazard (Zone)" |
| `This End Up` | **59** | "Orientation Arrows" |
| `DOT Requirements` | **63** | DOT Special Permit |
| `Inside Containers Comply` | **62** | "Inside Containers Comply with Prescribed Specifications" |
| `Oxygen Generator` | **53** | PSN and Identification Number |
| `Biological Substance` | **53** | PSN and Identification Number |
| `Chemical Kit` | **53** | PSN and Identification Number |
| `First Aid Kit` | **53** | PSN and Identification Number |
| `Machinery PSN UN` | **53** | PSN and Identification Number |

#### Creating Marking Frustrations

```typescript
// In InspectorMarkingsLabelsValidationScreen.tsx
addPackageFrustration({
  category: "marking",
  itemId: "marking-0-psn-and-un-number",
  itemLabel: "PSN and UN Number",
  expectedValues: ["FUZES DETONATING UN0106"],
  verificationStatus: "missing",
  defaultMessage: "Required marking \"PSN and UN Number\" not found on package",
  afmanReference: "AFMAN 24-604",
});

// MSL (Military Shipping Label) - maps to Field 75 (Other)
addPackageFrustration({
  category: "marking",
  itemId: "marking-1-military-shipping-label",
  itemLabel: "Military Shipping Label (MSL) or DD Form 1387",
  expectedValues: ["Full shipper and consignee name/address"],
  verificationStatus: "missing",
  defaultMessage: "Required marking \"Military Shipping Label (MSL) or DD Form 1387\" not found on package",
  afmanReference: "AFMAN 24-604",
});
```

---

### Label Frustrations

**Source:** `src/components/Inspector/InspectorMarkingsLabelsValidationScreen.tsx` (LABELS section)

Created when required hazmat labels are missing or incorrect.

#### Label → Form 1015 Mapping

| Label | Form 1015 Field | Description |
|-------|-----------------|-------------|
| `Primary Hazard` | **69** | Primary Risk Label |
| `Subsidiary Hazard` | **71** | Subsidiary Risk Labels |
| `Cargo Aircraft Only` | **72** | "Cargo Aircraft Only" Label |
| `This Way Up` | **59** | "Orientation Arrows" |
| `Keep Away From Heat` | **75** | Other |
| `OXYGEN` | **75** | Other |
| `TOXIC INHALATION HAZARD` | **75** | Other |
| `TOXIC` | **75** | Other |
| `Class 6 PG III` | **75** | Other |
| `INFECTIOUS SUBSTANCE` | **75** | Other |
| `Package Orientation` | **59** | "Orientation Arrows" |
| `Chemical Kit Primary Hazard` | **69** | Primary Risk Label |

#### Creating Label Frustrations

```typescript
// Primary hazard label missing
addPackageFrustration({
  category: "label",
  itemId: "label-0-primary-hazard",
  itemLabel: "Primary Hazard",
  expectedValues: ["Class 1.1B"],
  verificationStatus: "missing",
  defaultMessage: "Required label \"Primary Hazard\" not found on package",
  afmanReference: "AFMAN 24-604",
});

// Cargo Aircraft Only label missing
addPackageFrustration({
  category: "label",
  itemId: "label-1-cargo-aircraft-only",
  itemLabel: "Cargo Aircraft Only",
  expectedValues: ["Cargo Aircraft Only"],
  verificationStatus: "missing",
  defaultMessage: "Required label \"Cargo Aircraft Only\" not found on package",
  afmanReference: "AFMAN 24-604",
});
```

---

### Package Frustration Record Structure

```typescript
interface PackageFrustrationRecord {
  id: string;                                    // Auto-generated
  category: "marking" | "label" | "dryice" | "magnetized" | "lithium" | ...;
  itemId: string;                                // Unique identifier within category
  itemLabel: string;                             // Display name (used in Form 1015)
  expectedValues: string[];                      // What should be present
  verificationStatus: "missing" | "incorrect" | "non_compliant" | "damaged";
  defaultMessage: string;                        // Reason for frustration
  afmanReference?: string;                       // AFMAN 24-604 reference
  frustrationDate: Date;
  inspector: string;
  reinspectionHistory?: ReinspectionAttempt[];
}
```

---

### Frustration to Form 1015 Mapping Implementation

**Location:** `src/utils/sddgToForm1015Mapping.ts`

```typescript
// SDDG field keys → Form 1015 fields
export const SDDG_TO_FORM1015_MAPPING: Record<string, string> = {
  shipper: "2",
  consignee: "3",
  shippersReferenceNumber: "4",
  // ... etc.
};

// Package marking/label names → Form 1015 fields
export const PACKAGE_TO_FORM1015_MAPPING: Record<string, string> = {
  // POP Marking frustrations → Field 54
  "UN Specification Marking": "54",
  "Packaging Code (Field B)": "54",
  "Packing Group (Field C)": "54",

  // Markings
  "PSN and UN Number": "53",
  "Military Shipping Label (MSL) or DD Form 1387": "75",

  // Labels
  "Primary Hazard": "69",
  "Subsidiary Hazard": "71",
  "Cargo Aircraft Only": "72",
  // ... etc.
};
```

---

### Field 87 Annotation Format

**Location:** `src/components/Inspector/InspectorAMC1015Form.tsx` - `formatFrustrationsForComments()`

All frustrations are documented in Field 87 (COMMENTS/REASON(S) FOR FRUSTRATION) of the AMC Form 1015.

#### Standard Format

```
<field_number>. – <date> @ <time> – <LABEL> – Inspector: <inspector>
```

**Examples:**

| Frustration Type | Field 87 Annotation |
|------------------|---------------------|
| SDDG Shipper | `2. – Jan 5, 2026 @ 08:56 PM UTC – SHIPPER (KEY 1) – Inspector: H` |
| POP Marking Missing | `54. – Jan 5, 2026 @ 08:56 PM UTC – UN SPECIFICATION MARKING – Inspector: H` |
| PSN and UN Number | `53. – Jan 5, 2026 @ 08:56 PM UTC – PSN AND UN NUMBER – Inspector: H` |
| Primary Hazard | `69. – Jan 5, 2026 @ 08:56 PM UTC – PRIMARY HAZARD – Inspector: H` |
| Cargo Aircraft Only | `72. – Jan 5, 2026 @ 08:56 PM UTC – CARGO AIRCRAFT ONLY – Inspector: H` |

#### Special Case: MSL (Military Shipping Label)

When the Military Shipping Label is frustrated, it maps to Field 75 (Other in the Labeling section). The annotation includes "MSL" clarification:

```
75. – Jan 5, 2026 @ 08:56 PM UTC – MSL (MILITARY SHIPPING LABEL) – Inspector: H
```

#### Reinspection History

If a frustration has reinspection attempts, those are also documented:

```
2. – Jan 5, 2026 @ 08:56 PM UTC – SHIPPER (KEY 1) – Inspector: H
2. – Jan 5, 2026 @ 09:15 PM UTC – REINSPECTED: VERIFIED – Inspector: H
```

#### Implementation Code

```typescript
// In InspectorAMC1015Form.tsx
const formatFrustrationsForComments = () => {
  const allEntries: TimelineEntry[] = [];

  // Process SDDG frustrations
  sddgFrustrations.forEach(frustration => {
    const lineNumber = SDDG_TO_FORM1015_MAPPING[frustration.key] || "N/A";
    const { formattedDate, formattedTime } = formatDateTime(frustration.frustrationDate);

    allEntries.push({
      date: new Date(frustration.frustrationDate),
      lineNumber,
      formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${frustration.fieldLabel.toUpperCase()} – Inspector: ${formatInspector(frustration.inspector)}`,
    });
  });

  // Process package frustrations
  packageFrustrations.forEach(frustration => {
    const lineNumber = PACKAGE_TO_FORM1015_MAPPING[frustration.itemLabel] || "N/A";

    // Special handling for MSL → Field 75
    let labelDisplay = frustration.itemLabel.toUpperCase();
    if (frustration.itemLabel === "Military Shipping Label (MSL) or DD Form 1387" && lineNumber === "75") {
      labelDisplay = "MSL (MILITARY SHIPPING LABEL)";
    }

    const { formattedDate, formattedTime } = formatDateTime(frustration.frustrationDate);

    allEntries.push({
      date: new Date(frustration.frustrationDate),
      lineNumber,
      formatted: `${lineNumber}. – ${formattedDate} @ ${formattedTime} – ${labelDisplay} – Inspector: ${formatInspector(frustration.inspector)}`,
    });
  });

  // Sort chronologically
  allEntries.sort((a, b) => a.date.getTime() - b.date.getTime());

  return allEntries.map(entry => ({ formatted: entry.formatted }));
};
```

---

### Complete Field Mapping Reference

#### Form 1015 Fields Used for Frustrations

| Field | Description | Frustration Source |
|-------|-------------|-------------------|
| 2 | Shipper's Address and Phone Number | SDDG: `shipper` |
| 3 | Consignee DODAAC or Address | SDDG: `consignee` |
| 4 | Transportation Control Number (TCN) | SDDG: `shippersReferenceNumber` |
| 5 | Airport of Departure and Destination | SDDG: `airportOfDeparture`, `airportOfDestination` |
| 6 | Name and Title of Preparer | SDDG: `nameOfSignatory` |
| 7 | Place and Date Material Certified | SDDG: `placeAndDate` |
| 9 | Emergency Response Number | SDDG: `additionalHandlingInfo` |
| 11 | Passenger or Cargo Aircraft Only | SDDG: `aircraftType` |
| 12 | Radioactive or Nonradioactive Shipment | SDDG: `shipmentType` |
| 13 | Identification Number (UN, ID, NA) | SDDG: `unIdNo` |
| 14 | PSN (with Technical Name if Required) | SDDG: `properShippingName` |
| 15 | Primary Hazard Class or Division | SDDG: `hazardClass` |
| 16 | Subsidiary Risk Class or Division | SDDG: `subsidiaryRisk` |
| 17 | Packaging Group | SDDG: `packingGroup` |
| 18 | Number and Type of Packages | SDDG: `quantityAndPackingType` |
| 19 | Net Quantity Per Package | SDDG: `quantityAndPackingQuantity` |
| 23 | Packaging Paragraph | SDDG: `packingInstruction` |
| 30 | "Inhalation Hazard (Zone)" | Marking: `Inhalation Hazard` |
| 53 | PSN and Identification Number | Marking: `PSN and UN Number`, etc. |
| 54 | UN or POP Specification Marking | POP: All POP marking frustrations |
| 59 | "Orientation Arrows" | Marking/Label: `This End Up`, `This Way Up` |
| 62 | "Inside Containers Comply..." | Marking: `Inside Containers Comply` |
| 63 | DOT Special Permit | Marking: `DOT Requirements` |
| 69 | Primary Risk Label | Label: `Primary Hazard` |
| 71 | Subsidiary Risk Labels | Label: `Subsidiary Hazard` |
| 72 | "Cargo Aircraft Only" | Label: `Cargo Aircraft Only` |
| 75 | Other (Labeling section) | Label/Marking: `MSL`, `Keep Away From Heat`, `OXYGEN`, etc. |
| 87 | Comments/Reason(s) for Frustration | All frustrations annotated here |

---

## Label Matching System

### Location

`src/utils/labelMatchingTable.ts`

### Purpose

Matches ML-detected labels to regulatory requirements.

### Label Matching Table

```typescript
const labelMatchingTable: Record<string, string[]> = {
  // Explosives
  "explosives1.1B": ["Class 1.1B", "1.1B"],
  "explosives1.1D": ["Class 1.1D", "1.1D"],
  // ... 90+ mappings

  // Handling labels
  "cargoAircraftOnly": ["Cargo Aircraft Only", "CAO"],
  "thisWayUp": ["This Way Up", "Orientation"],
};
```

### Normalized Lookup

Class names are normalized for case-insensitive matching:

```typescript
function normalizeClassName(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "");
}

// "Explosives1.1 B" → "explosives1.1b"
```

### findMatchingDetection Function

```typescript
export function findMatchingDetection(
  requirementLabel: string,
  expectedValues: string[],
  detectedLabels: AggregatedLabel[]
): AggregatedLabel | null {
  // 1. Try normalized table lookup
  // 2. Fallback: direct class name matching
  // 3. Return best match by confidence
}
```

---

## Error Handling Patterns

### ML Detection Screen

```typescript
// Model load failures
if (!modelLoaded) {
  Alert.alert('Model Not Ready', 'The detection model is still loading.');
  return;
}

// OCR processing errors (non-blocking)
try {
  const ocrResult = await performOCR(imageUri);
} catch (error) {
  console.error('[OCR] Processing error:', error);
  ocrResult = null;  // Continue without OCR
}
```

### Context/Database Errors

```typescript
try {
  await completeInspection();
} catch (error) {
  Alert.alert('Save Failed', 'Could not save inspection. Please try again.');
}
```

---

## Key Technologies

### ML Frameworks

| Technology | Purpose |
|------------|---------|
| YOLOX-Tiny | Object detection (92 hazmat label classes) |
| Google ML Kit | Text recognition (OCR) |
| TensorFlow Lite | Model inference |

### State Management

| Technology | Purpose |
|------------|---------|
| React Context | InspectionFormProvider (main state) |
| Valtio | HazProStore (chevron, workflow) |

### Database

| Technology | Purpose |
|------------|---------|
| expo-sqlite | Inspection persistence |
| AsyncStorage | Settings, preferences |

---

## Quick Reference: File Paths

```
src/
├── components/
│   ├── Inspector/
│   │   ├── InspectorHomeScreen.tsx
│   │   ├── MLDetectionScreen.tsx              # ML detection + manual corrections
│   │   ├── InspectorPOPMarkingValidationScreen.tsx  # POP marking validation
│   │   ├── InspectorMarkingsLabelsValidationScreen.tsx  # Markings & labels
│   │   ├── PackageFrustrationSummary.tsx      # Review package frustrations
│   │   ├── PackageInspectionCompleteScreen.tsx  # No frustrations completion
│   │   ├── InspectorAMC1015Form.tsx           # Form 1015 generation
│   │   └── [Material-specific screens]
│   ├── SDDGUploadAndParse.tsx
│   └── SDDGFrustrationSummary.tsx
├── screens/
│   └── SDDG/
│       ├── SDDGRegionAdjustmentScreen.tsx
│       └── SDDGProcessingScreen.tsx
├── ml/
│   ├── services/
│   │   └── ocrService.ts                      # OCR extraction pipeline
│   ├── hooks/
│   │   └── useDetection.ts                    # Detection hook + aggregateResults
│   ├── components/
│   │   ├── ExtractedDataCard.tsx
│   │   ├── POPMarkingCard.tsx
│   │   └── LabelPickerModal.tsx               # Manual label correction picker
│   ├── data/
│   │   └── class_mapping.json                 # 92 label classes
│   └── types/
│       └── ocr.ts                             # Type definitions
├── utils/
│   ├── popMarkingParser.ts                    # POP marking parser
│   ├── labelMatchingTable.ts                  # Label → requirement mapping
│   ├── markingRequirementsInspector.ts        # Marking requirements evaluation
│   ├── labelingRequirementsInspector.tsx      # Label requirements evaluation
│   └── sddgToForm1015Mapping.ts               # Frustration → Form 1015 mapping
├── contexts/
│   └── InspectionFormProvider/
│       └── InspectionFormProvider.tsx         # Main state provider
└── stores/
    └── useHazProStore.ts                      # Valtio store

server/
└── lookupFunctions/
    └── packagingLookupV2.ts                   # Packaging database (1.1MB+)
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| 2026-01-05 | Claude | Initial comprehensive documentation |
| 2026-01-05 | Claude | Added complete package inspection flow: MLDetection corrections saving, POP validation, Markings & Labels validation, PackageFrustrationSummary, PackageInspectionCompleteScreen, AMC Form 1015. Updated workflow diagram. Added label matching system documentation. |
| 2026-01-06 | Claude | Added SDDG Save & Exit and Reinspection System documentation. Covers: Save & Exit from SDDGInspectionCompleteScreen and SDDGFrustrationSummary, InspectorHomeScreen table display with "N/A" for package status, reinspection navigation handlers for SDDG "Verified" and Package "N/A" clicks, InteractiveSDDGComplianceScreen button text changes, navigation flow diagrams, and critical implementation notes. Updated workflow diagram to show Save & Exit paths. |
