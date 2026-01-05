# MLDetectionScreen - Complete Technical Guide

> **Purpose**: This document provides exhaustive documentation for `MLDetectionScreen.tsx`, enabling any engineer or AI assistant to fully understand, maintain, and extend this component.

## Table of Contents

1. [Overview](#overview)
2. [File Location & Dependencies](#file-location--dependencies)
3. [Component Architecture](#component-architecture)
4. [Screen States & Flow](#screen-states--flow)
5. [Props Interface](#props-interface)
6. [State Management](#state-management)
7. [Core Functionality](#core-functionality)
8. [UI Components Used](#ui-components-used)
9. [OCR & ML Integration](#ocr--ml-integration)
10. [Manual Corrections System](#manual-corrections-system)
11. [Navigation Patterns](#navigation-patterns)
12. [Styling Conventions](#styling-conventions)
13. [Helper Functions](#helper-functions)
14. [Common Modifications](#common-modifications)
15. [Debugging Tips](#debugging-tips)

---

## Overview

`MLDetectionScreen` is the **Inspector Label Detection Workflow** screen. It allows inspectors to:

1. Capture images of hazardous material packages
2. Run YOLOX ML detection to identify hazmat labels
3. Run ML Kit OCR to extract text (UN numbers, POP markings, etc.)
4. Review and manually correct detection results
5. Navigate to the next step in the inspection workflow

**Key Features:**
- Camera capture with crop functionality
- Gallery image selection (up to 6 images)
- YOLOX object detection for hazmat labels
- ML Kit OCR for text extraction
- Manual label correction (add/edit/delete)
- Dual navigation support (navigation stack OR modal)

---

## File Location & Dependencies

### File Path
```
src/components/Inspector/MLDetectionScreen.tsx
```

### Key Imports

```typescript
// React & React Native
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ... } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Icons
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";

// Camera & Image Picker
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";

// ML Detection Hook
import { useDetection } from "../../ml/hooks/useDetection";

// UI Components
import { DetectionOverlay } from "../../ml/components/DetectionOverlay";
import { ImageCropScreen } from "../../ml/components/ImageCropScreen";
import { POPMarkingCard, ExtractedDataCard, LabelPickerModal } from "../../ml/components";

// Context
import { useInspectionForm } from "../../contexts/InspectionFormProvider";

// Types
import { CapturedImage, Detection, CorrectedDetection, ... } from "../../ml/types";
```

### Class Mapping
```typescript
const CLASS_MAPPING: ClassInfo[] = require("../../ml/data/class_mapping.json");
```
This JSON contains 92 hazmat label classes with id, name, path, and category.

---

## Component Architecture

### Screen State Machine

The component uses a **state machine pattern** with `screenState`:

```typescript
type ScreenState = "home" | "camera" | "cropping" | "preview" | "processing" | "results";
```

```
┌──────────────────────────────────────────────────────────────────┐
│                           FLOW DIAGRAM                           │
└──────────────────────────────────────────────────────────────────┘

                    ┌─────────┐
                    │  HOME   │
                    └────┬────┘
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ▼              ▼              ▼
    ┌──────────┐   ┌──────────┐   ┌──────────┐
    │  CAMERA  │   │ GALLERY  │   │   SKIP   │
    │  (Modal) │   │  PICKER  │   │          │
    └────┬─────┘   └────┬─────┘   └────┬─────┘
         │              │              │
         ▼              │              │
    ┌──────────┐        │              │
    │ CROPPING │        │              │
    └────┬─────┘        │              │
         │              │              │
         └──────┬───────┘              │
                │                      │
                ▼                      │
          ┌──────────┐                 │
          │ PREVIEW  │                 │
          └────┬─────┘                 │
               │                       │
               ▼                       │
          ┌──────────┐                 │
          │PROCESSING│                 │
          └────┬─────┘                 │
               │                       │
               ▼                       │
          ┌──────────┐                 │
          │ RESULTS  │                 │
          └────┬─────┘                 │
               │                       │
               └───────────┬───────────┘
                           │
                           ▼
              ┌────────────────────────┐
              │ InspectorPOPMarkingV.. │
              │ (or close modal)       │
              └────────────────────────┘
```

---

## Props Interface

```typescript
interface MLDetectionScreenProps {
  navigation?: any;           // React Navigation object (optional in modal mode)
  route?: {
    params?: {
      unIdNo?: string;        // Pre-filled UN ID number from previous screen
    };
  };
  onClose?: () => void;       // Callback to close modal (modal mode only)
}
```

### Usage Patterns

**Navigation Mode** (from InspectorHomeScreen):
```tsx
<MLDetectionScreen navigation={navigation} route={route} />
```

**Modal Mode** (embedded in another screen):
```tsx
<MLDetectionScreen onClose={() => setModalVisible(false)} />
```

---

## State Management

### Core State Variables

```typescript
// Screen navigation
const [screenState, setScreenState] = useState<ScreenState>("home");

// Image capture
const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
const [cameraModalVisible, setCameraModalVisible] = useState(false);
const [facing, setFacing] = useState<CameraType>("back");
const cameraRef = useRef<CameraView>(null);

// Cropping workflow
const [pendingCropImage, setPendingCropImage] = useState<CapturedImage | null>(null);
const [cropSource, setCropSource] = useState<'camera' | 'preview'>('camera');
const [cropImageIndex, setCropImageIndex] = useState<number | null>(null);

// Detection results & corrections
const [correctedResults, setCorrectedResults] = useState<ImageAnalysisResult[]>([]);
const [corrections, setCorrections] = useState<ManualCorrection[]>([]);

// Label picker modal
const [labelPickerVisible, setLabelPickerVisible] = useState(false);
const [labelPickerMode, setLabelPickerMode] = useState<'add' | 'edit'>('add');
const [editingImageIndex, setEditingImageIndex] = useState<number>(0);
const [editingDetection, setEditingDetection] = useState<Detection | null>(null);
```

### useDetection Hook State

```typescript
const {
  state,                          // Extended detection state
  isRuntimeAvailable,             // Boolean: ONNX runtime loaded
  loadModelAsync,                 // Function: load YOLOX model
  processAllImagesWithAnalysis,   // Function: run detection + OCR
  clearResults,                   // Function: reset results
} = useDetection();

// Destructured from state:
const {
  results,            // ImageDetectionResult[]
  modelLoaded,        // Boolean
  isProcessing,       // Boolean
  error,              // string | null
  analysisResults,    // ImageAnalysisResult[] (with OCR data)
  aggregatedResults,  // AggregatedAnalysis (merged across images)
  processingStatus,   // string (current operation description)
} = state;
```

---

## Core Functionality

### 1. Camera Permission & Opening

```typescript
const handleOpenCamera = useCallback(async () => {
  if (!permission?.granted) {
    const result = await requestPermission();
    if (!result.granted) {
      Alert.alert("Camera Permission", "Camera access is required...");
      return;
    }
  }
  setCameraModalVisible(true);
}, [permission, requestPermission]);
```

### 2. Taking a Photo

```typescript
const handleTakePhoto = useCallback(async () => {
  if (!cameraRef.current) return;
  const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
  if (photo) {
    const newImage: CapturedImage = {
      uri: photo.uri,
      width: photo.width,
      height: photo.height,
      timestamp: Date.now(),
    };
    // Go to crop screen instead of directly to preview
    setPendingCropImage(newImage);
    setCropSource('camera');
    setCameraModalVisible(false);
    setScreenState("cropping");
  }
}, []);
```

### 3. Gallery Selection

```typescript
const handlePickFromGallery = useCallback(async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.8,
    allowsMultipleSelection: true,
    selectionLimit: 6,
  });

  if (!result.canceled && result.assets.length > 0) {
    const newImages: CapturedImage[] = result.assets.map((asset, index) => ({
      uri: asset.uri,
      width: asset.width || 640,
      height: asset.height || 640,
      timestamp: Date.now() + index,  // Unique keys
    }));
    setCapturedImages(newImages);
    setScreenState("preview");
  }
}, []);
```

### 4. Image Cropping Workflow

```typescript
// From camera - add cropped image
const handleCropComplete = useCallback((croppedImage: CapturedImage) => {
  if (cropSource === 'preview' && cropImageIndex !== null) {
    // Replace existing image at index
    setCapturedImages(prev => {
      const updated = [...prev];
      updated[cropImageIndex] = croppedImage;
      return updated;
    });
  } else {
    // Add new image
    setCapturedImages(prev => [...prev, croppedImage]);
  }
  setPendingCropImage(null);
  setScreenState('preview');
}, [cropSource, cropImageIndex]);

// Skip cropping - use original
const handleCropSkip = useCallback(() => {
  if (cropSource === 'camera' && pendingCropImage) {
    setCapturedImages(prev => [...prev, pendingCropImage]);
  }
  setPendingCropImage(null);
  setScreenState('preview');
}, [cropSource, pendingCropImage]);
```

### 5. Running Analysis

```typescript
const handleAnalyze = useCallback(async () => {
  if (capturedImages.length === 0 || !modelLoaded) return;

  setScreenState("processing");
  clearResults();

  try {
    // Runs YOLOX detection + ML Kit OCR on all images
    await processAllImagesWithAnalysis(capturedImages, { enableOCR: true });
    setScreenState("results");
  } catch (err) {
    Alert.alert("Error", "Failed to analyze images");
    setScreenState("preview");
  }
}, [capturedImages, modelLoaded, clearResults, processAllImagesWithAnalysis]);
```

---

## UI Components Used

### 1. DetectionOverlay
Renders the captured image with bounding boxes around detected labels.

```tsx
<DetectionOverlay result={result} maxHeight={250} />
```

### 2. POPMarkingCard
Displays parsed POP (Performance Oriented Packaging) marking data.

```tsx
<POPMarkingCard
  popMarking={{
    found: true,
    fields: aggregatedResults.bestPopMarking.fields,
    confidence: aggregatedResults.bestPopMarking.confidence,
    issues: [],
    detectedType: aggregatedResults.bestPopMarking.detectedType,
    sourceText: "",
  }}
  sourceImageIndex={aggregatedResults.bestPopMarking.sourceImageIndex}
  isBest={true}
/>
```

### 3. ExtractedDataCard
Displays OCR-extracted data (UN numbers, hazard classes, etc.).

```tsx
<ExtractedDataCard
  markings={{
    popMarking: null,
    unNumbers: aggregatedResults.allUnNumbers,
    weights: [],
    hazardClasses: aggregatedResults.allHazardClasses,
    dates: [],
    countryOfOrigin: null,
    otherMarkings: [],
    exNumbers: aggregatedResults.allEXNumbers || [],
    properShippingNames: aggregatedResults.allPSNs || [],
    unWithPSN: aggregatedResults.allUnWithPSN || [],
    rawPopMarkingText: aggregatedResults.rawPopMarkingText || null,
  }}
/>
```

### 4. LabelPickerModal
Modal for selecting hazmat label classes (add/edit detections).

```tsx
<LabelPickerModal
  visible={labelPickerVisible}
  onClose={() => setLabelPickerVisible(false)}
  onSelect={handleLabelSelect}
  currentClassId={editingDetection?.classId}
  title={labelPickerMode === 'add' ? "Add Missing Label" : "Change Label"}
/>
```

### 5. ImageCropScreen
Full-screen cropping interface.

```tsx
<ImageCropScreen
  image={pendingCropImage}
  onCrop={handleCropComplete}
  onSkip={handleCropSkip}
  onCancel={handleCropCancel}
  source={cropSource}
/>
```

---

## OCR & ML Integration

### Detection Pipeline

The `useDetection` hook orchestrates:

1. **YOLOX Object Detection**: Identifies hazmat labels in images
   - Model: YOLOX-Tiny (640x640 input)
   - 92 label classes
   - Confidence threshold: 0.4

2. **ML Kit Text Recognition**: Extracts text from images
   - UN numbers (e.g., "UN0106")
   - EX classification numbers (e.g., "EX-2019037142")
   - POP markings (e.g., "UN 4G / X 25 / S / 22 / USA / DOD")
   - Proper Shipping Names (e.g., "FUZES DETONATING")
   - Hazard classes, dates, countries

### Aggregated Results Structure

```typescript
interface AggregatedAnalysis {
  bestPopMarking: {
    fields: POPMarkingFields;
    confidence: number;
    sourceImageIndex: number;
    detectedType: POPMarkingType;
  } | null;
  allDetectedLabels: AggregatedLabel[];
  allUnNumbers: string[];
  allWeights: ExtractedWeight[];
  allHazardClasses: string[];
  countryOfOrigin: string | null;
  allEXNumbers: string[];
  allPSNs: string[];
  allUnWithPSN: { un: string; psn: string }[];
  rawPopMarkingText: string | null;
  imagesProcessed: number;
  totalProcessingTime: number;
  perImageResults: ImageAnalysisResult[];
}
```

---

## Manual Corrections System

### Correction Types

```typescript
interface ManualCorrection {
  type: 'add' | 'edit' | 'delete';
  imageIndex: number;
  detectionId: string;
  originalClass?: { id: number; name: string };
  newClass?: { id: number; name: string };
  timestamp: number;
}
```

### Adding a Detection

```typescript
const handleLabelSelect = useCallback((classInfo: ClassInfo) => {
  if (labelPickerMode === 'add') {
    const newDetection: CorrectedDetection = {
      id: `manual-${Date.now()}`,
      box: { x: 0, y: 0, width: 0, height: 0 },  // No bounding box for manual
      classId: classInfo.id,
      className: classInfo.name,
      category: classInfo.category,
      confidence: 1.0,
      source: 'manual' as DetectionSource,
    };

    setCorrectedResults(prev => {
      const updated = [...prev];
      updated[editingImageIndex].detections.push(newDetection);
      return updated;
    });

    setCorrections(prev => [...prev, {
      type: 'add',
      imageIndex: editingImageIndex,
      detectionId: newDetection.id,
      newClass: { id: classInfo.id, name: classInfo.name },
      timestamp: Date.now(),
    }]);
  }
  // ... edit mode handling
}, [labelPickerMode, editingImageIndex, editingDetection]);
```

### Editing a Detection

When editing, the original class is preserved for reference:

```typescript
const corrected: CorrectedDetection = {
  ...d,
  originalClassId: d.classId,
  originalClassName: d.className,
  classId: classInfo.id,
  className: classInfo.name,
  category: classInfo.category,
  source: 'manual' as DetectionSource,
};
```

### Visual Indicators

- **Manual additions**: Blue text + "Added" badge
- **Edited detections**: Shows "Was: [original name]"
- **All detections**: Edit icon (pencil) always visible

---

## Navigation Patterns

### Navigation Mode (Standard)

```typescript
const navigateToNextScreen = useCallback(() => {
  if (onClose) {
    onClose();  // Modal mode
    return;
  }
  if (!navigation) return;
  navigation.navigate("InspectorPOPMarkingValidationScreen");
}, [navigation, onClose]);
```

### Modal Mode

When `onClose` prop is provided, the component operates in modal mode:
- "Continue" button calls `onClose()` instead of navigating
- No back navigation within the modal
- Skip confirmation still shows, then closes modal

### Go Back Handler

```typescript
const handleGoBack = useCallback(() => {
  if (onClose) {
    onClose();
  } else if (navigation) {
    navigation.goBack();
  }
}, [onClose, navigation]);
```

---

## Styling Conventions

### Color Palette

| Purpose | Color | Hex |
|---------|-------|-----|
| Primary Action | Blue | `#007AFF` |
| Success | Green | `#34C759` / `#4CAF50` |
| Warning | Orange | `#FF9500` |
| Error/Destructive | Red | `#FF3B30` |
| Text Primary | Dark Gray | `#1D1D1F` |
| Text Secondary | Gray | `#8E8E93` |
| Background | Light Gray | `#F8F9FA` |
| Card Background | White | `#FFFFFF` |
| Border | Light Gray | `#E5E5EA` |

### Category Colors (Hazard Classes)

```typescript
const colors: Record<string, string> = {
  general_marking: "#007AFF",  // Blue
  hazardClass1: "#FF3B30",     // Red (Explosives)
  hazardClass2: "#34C759",     // Green (Gases)
  hazardClass3: "#FF9500",     // Orange (Flammable Liquids)
  hazardClass4: "#FF2D55",     // Pink (Flammable Solids)
  hazardClass5: "#FFCC00",     // Yellow (Oxidizers)
  hazardClass6: "#AF52DE",     // Purple (Toxic)
  hazardClass8: "#5856D6",     // Indigo (Corrosive)
  hazardClass9: "#8E8E93",     // Gray (Misc)
};
```

### Layout Patterns

- **Cards**: `borderRadius: 12`, `padding: 16`, `borderWidth: 1`
- **Buttons**: `borderRadius: 8`, `paddingVertical: 12-14`
- **Icons**: Size 20-24 for actions, 28-36 for features
- **Spacing**: Gap of 8-16 between elements

---

## Helper Functions

### formatClassName

Converts camelCase to Title Case with spaces:

```typescript
function formatClassName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, s => s.toUpperCase())
    .trim();
}
// "Explosives1.1B" → "Explosives 1.1 B"
```

### getCategoryColor

Returns color for hazard category:

```typescript
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = { ... };
  return colors[category] || "#007AFF";
}
```

### getModelStatus

Returns model readiness status:

```typescript
const getModelStatus = () => {
  if (!isRuntimeAvailable)
    return { text: "Runtime Unavailable", color: "#FF3B30", ready: false };
  if (!modelLoaded)
    return { text: "Loading...", color: "#FF9500", ready: false };
  return { text: "Ready", color: "#34C759", ready: true };
};
```

---

## Common Modifications

### Adding a New Extracted Data Type

1. Add field to `ExtractedMarkings` type in `src/ml/types/ocr.ts`
2. Add extraction function in `src/ml/services/ocrService.ts`
3. Add aggregation in `src/ml/hooks/useDetection.ts`
4. Add UI section in `src/ml/components/ExtractedDataCard.tsx`
5. Pass data in MLDetectionScreen's `<ExtractedDataCard>` props

### Adding a New Screen State

1. Add to `ScreenState` type union
2. Add rendering logic with `if (screenState === "newState") { return (...) }`
3. Add navigation/transition handlers

### Modifying Detection Display

Edit the results screen section around line 810-880 which maps over `displayResults`.

### Changing Navigation Target

Modify `navigateToNextScreen` function (line 125-137).

---

## Debugging Tips

### Common Issues

1. **"Runtime Unavailable"**: Run `npx expo run:android` instead of `expo start`

2. **Camera not working**: Check permissions, ensure real device (not emulator)

3. **OCR not extracting**: Check `processingStatus` during processing, verify image quality

4. **Detections not showing**: Check `correctedResults` vs `analysisResults`, ensure model loaded

### Console Logs to Add

```typescript
// In handleAnalyze:
console.log('[MLDetection] Starting analysis with', capturedImages.length, 'images');

// In useEffect for correctedResults:
console.log('[MLDetection] Analysis complete:', analysisResults?.length, 'results');
console.log('[MLDetection] Aggregated:', aggregatedResults);
```

### State Inspection

The component maintains parallel state:
- `analysisResults`: Original ML results (immutable)
- `correctedResults`: Editable copy with user corrections
- `corrections`: Audit log of all changes

Always use `correctedResults` for display when available:
```typescript
const displayResults = correctedResults.length > 0 ? correctedResults : (analysisResults || []);
```

---

## Summary

`MLDetectionScreen` is a complex, multi-state component that orchestrates:
- Camera/gallery image capture
- Image cropping workflow
- ML detection (YOLOX) + OCR (ML Kit)
- Manual detection corrections
- Aggregated results display
- Flexible navigation (stack or modal)

Key architectural decisions:
- State machine pattern for screen flow
- Immutable original results + mutable corrections
- Dual navigation support via props
- Component composition for UI (DetectionOverlay, ExtractedDataCard, etc.)

When modifying, always consider:
- Both navigation and modal modes
- The correction tracking system
- The relationship between `analysisResults` and `correctedResults`
- The aggregation pipeline in `useDetection`
