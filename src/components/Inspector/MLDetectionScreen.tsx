/**
 * MLDetectionScreen - Inspector Label Detection Workflow
 *
 * This screen allows inspectors to capture images of packages and use ML
 * to detect and classify hazmat labels. Matches the app's UI/UX patterns.
 */

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useDetection, aggregateResults } from "../../ml/hooks/useDetection";
import { DetectionOverlay } from "../../ml/components/DetectionOverlay";
import { ImageCropScreen } from "../../ml/components/ImageCropScreen";
import {
  POPMarkingCard,
  ExtractedDataCard,
  LabelPickerModal,
} from "../../ml/components";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProStore } from "../../stores/useHazProStore";
import {
  CapturedImage,
  ImageDetectionResult,
  AggregatedAnalysis,
  ImageAnalysisResult,
  ClassInfo,
  Detection,
  CorrectedDetection,
  ManualCorrection,
  DetectionSource,
} from "../../ml/types";

// Import class mapping for corrections
const CLASS_MAPPING: ClassInfo[] = require("../../ml/data/class_mapping.json");

interface MLDetectionScreenProps {
  navigation?: any;  // Optional - not available in modal mode
  route?: {
    params?: {
      unIdNo?: string;
    };
  };
  onClose?: () => void;  // For modal mode - close the modal
}

type ScreenState = "home" | "camera" | "cropping" | "preview" | "processing" | "results";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function MLDetectionScreen({
  navigation,
  route,
  onClose,
}: MLDetectionScreenProps) {
  // Helper to handle "go back" - works in both navigation and modal modes
  const handleGoBack = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (navigation) {
      navigation.goBack();
    }
  }, [onClose, navigation]);
  const { inspection, setMLAnalysisResults } = useInspectionForm();
  const { actions } = useHazProStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [screenState, setScreenState] = useState<ScreenState>("home");
  const [capturedImages, setCapturedImages] = useState<CapturedImage[]>([]);
  const [facing, setFacing] = useState<CameraType>("back");
  const [cameraModalVisible, setCameraModalVisible] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Cropping state
  const [pendingCropImage, setPendingCropImage] = useState<CapturedImage | null>(null);
  const [cropSource, setCropSource] = useState<'camera' | 'preview'>('camera');
  const [cropImageIndex, setCropImageIndex] = useState<number | null>(null);

  // Manual corrections state (always available, no edit mode needed)
  const [correctedResults, setCorrectedResults] = useState<ImageAnalysisResult[]>([]);
  const [corrections, setCorrections] = useState<ManualCorrection[]>([]);
  const [labelPickerVisible, setLabelPickerVisible] = useState(false);
  const [labelPickerMode, setLabelPickerMode] = useState<'add' | 'edit'>('add');
  const [editingImageIndex, setEditingImageIndex] = useState<number>(0);
  const [editingDetection, setEditingDetection] = useState<Detection | null>(null);

  const {
    state,
    isRuntimeAvailable,
    loadModelAsync,
    processAllImagesWithAnalysis,
    clearResults,
  } = useDetection();

  const { results, modelLoaded, isProcessing, error, analysisResults, aggregatedResults, processingStatus } = state;

  // Set chevron on mount
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, [actions]);

  // Load model on mount
  useEffect(() => {
    if (isRuntimeAvailable && !modelLoaded) {
      loadModelAsync();
    }
  }, [isRuntimeAvailable, modelLoaded, loadModelAsync]);

  // Get model status
  const getModelStatus = () => {
    if (!isRuntimeAvailable)
      return { text: "Runtime Unavailable", color: "#FF3B30", ready: false };
    if (!modelLoaded)
      return { text: "Loading...", color: "#FF9500", ready: false };
    return { text: "Ready", color: "#34C759", ready: true };
  };

  const modelStatus = getModelStatus();

  const navigateToNextScreen = useCallback(() => {
    // Save ML analysis results to context before navigating
    // Use correctedResults if available (contains user corrections), otherwise use original
    const resultsToSave = correctedResults.length > 0 ? correctedResults : (analysisResults || []);

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

    // In modal mode, just close the modal
    if (onClose) {
      onClose();
      return;
    }
    // In navigation mode, navigate to the POP marking data entry screen
    if (!navigation) return;

    // Navigate to POP marking data entry instead of validation screen
    navigation.navigate("InspectorPOPMarkingDataEntry");
  }, [navigation, onClose, correctedResults, analysisResults, setMLAnalysisResults]);

  // Handle skip
  const handleSkip = useCallback(() => {
    Alert.alert(
      "Skip Label Detection",
      "Are you sure you want to skip ML label detection? You can still manually verify labels on the next screen.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Skip", style: "destructive", onPress: navigateToNextScreen },
      ]
    );
  }, [navigateToNextScreen]);

  // Handle camera permission and open
  const handleOpenCamera = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission",
          "Camera access is required to scan labels."
        );
        return;
      }
    }
    setCameraModalVisible(true);
  }, [permission, requestPermission]);

  // Handle gallery picker
  const handlePickFromGallery = useCallback(async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsMultipleSelection: true,
        selectionLimit: 6,
      });

      if (!result.canceled && result.assets.length > 0) {
        const baseTimestamp = Date.now();
        const newImages: CapturedImage[] = result.assets.map((asset, index) => ({
          uri: asset.uri,
          width: asset.width || 640,
          height: asset.height || 640,
          timestamp: baseTimestamp + index,  // Ensure unique keys
        }));
        setCapturedImages(newImages);
        setScreenState("preview");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to pick images from gallery");
    }
  }, []);

  // Handle taking photo - now goes to crop screen first
  const handleTakePhoto = useCallback(async () => {
    if (!cameraRef.current) return;
    try {
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
        setCropImageIndex(null);
        setCameraModalVisible(false);
        setScreenState("cropping");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to capture image");
    }
  }, []);

  // Handle removing image
  const handleRemoveImage = useCallback((index: number) => {
    setCapturedImages(prev => {
      const updated = prev.filter((_, i) => i !== index);
      if (updated.length === 0) setScreenState("home");
      return updated;
    });
  }, []);

  // Handle crop complete - add or replace cropped image
  const handleCropComplete = useCallback((croppedImage: CapturedImage) => {
    if (cropSource === 'preview' && cropImageIndex !== null) {
      // Replace the image at the index (editing from preview)
      setCapturedImages(prev => {
        const updated = [...prev];
        updated[cropImageIndex] = croppedImage;
        return updated;
      });
    } else {
      // Add new image (from camera)
      setCapturedImages(prev => [...prev, croppedImage]);
    }
    setPendingCropImage(null);
    setCropImageIndex(null);
    setScreenState('preview');
  }, [cropSource, cropImageIndex]);

  // Handle skip crop - use original image as-is
  const handleCropSkip = useCallback(() => {
    if (cropSource === 'camera' && pendingCropImage) {
      // Add original uncropped image
      setCapturedImages(prev => [...prev, pendingCropImage]);
    }
    // For preview source, image already exists unchanged
    setPendingCropImage(null);
    setCropImageIndex(null);
    setScreenState('preview');
  }, [cropSource, pendingCropImage]);

  // Handle cancel crop - discard and go back
  const handleCropCancel = useCallback(() => {
    setPendingCropImage(null);
    setCropImageIndex(null);
    if (cropSource === 'camera') {
      // Discard photo and return to home
      setScreenState('home');
    } else {
      // Return to preview unchanged
      setScreenState('preview');
    }
  }, [cropSource]);

  // Handle crop from preview - edit existing image
  const handleCropFromPreview = useCallback((index: number) => {
    setPendingCropImage(capturedImages[index]);
    setCropSource('preview');
    setCropImageIndex(index);
    setScreenState('cropping');
  }, [capturedImages]);

  // Handle analyze - runs detection + OCR on all images
  const handleAnalyze = useCallback(async () => {
    if (capturedImages.length === 0 || !modelLoaded) return;

    setScreenState("processing");
    clearResults();

    try {
      // Use full analysis with OCR enabled
      await processAllImagesWithAnalysis(capturedImages, { enableOCR: true });
      setScreenState("results");
    } catch (err) {
      Alert.alert("Error", "Failed to analyze images");
      setScreenState("preview");
    }
  }, [capturedImages, modelLoaded, clearResults, processAllImagesWithAnalysis]);

  // Initialize correctedResults when analysis completes
  useEffect(() => {
    if (analysisResults && analysisResults.length > 0) {
      // Deep copy results to allow editing without affecting original
      setCorrectedResults(JSON.parse(JSON.stringify(analysisResults)));
      setCorrections([]);
    }
  }, [analysisResults]);

  // Open label picker to add a new label
  const handleAddLabelPress = useCallback((imageIndex: number) => {
    setEditingImageIndex(imageIndex);
    setEditingDetection(null);
    setLabelPickerMode('add');
    setLabelPickerVisible(true);
  }, []);

  // Open label picker to edit an existing detection
  const handleEditDetectionPress = useCallback((imageIndex: number, detection: Detection) => {
    setEditingImageIndex(imageIndex);
    setEditingDetection(detection);
    setLabelPickerMode('edit');
    setLabelPickerVisible(true);
  }, []);

  // Handle label selection from picker
  const handleLabelSelect = useCallback((classInfo: ClassInfo) => {
    if (labelPickerMode === 'add') {
      // Add new detection
      const newDetection: CorrectedDetection = {
        id: `manual-${Date.now()}`,
        box: { x: 0, y: 0, width: 0, height: 0 },
        classId: classInfo.id,
        className: classInfo.name,
        category: classInfo.category,
        confidence: 1.0,
        source: 'manual' as DetectionSource,
      };

      setCorrectedResults(prev => {
        const updated = [...prev];
        updated[editingImageIndex] = {
          ...updated[editingImageIndex],
          detections: [...updated[editingImageIndex].detections, newDetection],
        };
        return updated;
      });

      setCorrections(prev => [...prev, {
        type: 'add',
        imageIndex: editingImageIndex,
        detectionId: newDetection.id,
        newClass: { id: classInfo.id, name: classInfo.name },
        timestamp: Date.now(),
      }]);
    } else if (labelPickerMode === 'edit' && editingDetection) {
      // Edit existing detection
      setCorrectedResults(prev => {
        const updated = [...prev];
        updated[editingImageIndex] = {
          ...updated[editingImageIndex],
          detections: updated[editingImageIndex].detections.map(d => {
            if (d.id === editingDetection.id) {
              const corrected: CorrectedDetection = {
                ...d,
                originalClassId: (d as CorrectedDetection).originalClassId ?? d.classId,
                originalClassName: (d as CorrectedDetection).originalClassName ?? d.className,
                classId: classInfo.id,
                className: classInfo.name,
                category: classInfo.category,
                source: 'manual' as DetectionSource,
              };
              return corrected;
            }
            return d;
          }),
        };
        return updated;
      });

      setCorrections(prev => [...prev, {
        type: 'edit',
        imageIndex: editingImageIndex,
        detectionId: editingDetection.id,
        originalClass: { id: editingDetection.classId, name: editingDetection.className },
        newClass: { id: classInfo.id, name: classInfo.name },
        timestamp: Date.now(),
      }]);
    }

    setLabelPickerVisible(false);
    setEditingDetection(null);
  }, [labelPickerMode, editingImageIndex, editingDetection]);

  // Delete a detection
  const handleDeleteDetection = useCallback((imageIndex: number, detection: Detection) => {
    Alert.alert(
      "Delete Detection",
      `Remove "${formatClassName(detection.className)}" from results?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setCorrectedResults(prev => {
              const updated = [...prev];
              updated[imageIndex] = {
                ...updated[imageIndex],
                detections: updated[imageIndex].detections.filter(d => d.id !== detection.id),
              };
              return updated;
            });

            setCorrections(prev => [...prev, {
              type: 'delete',
              imageIndex,
              detectionId: detection.id,
              originalClass: { id: detection.classId, name: detection.className },
              timestamp: Date.now(),
            }]);
          },
        },
      ]
    );
  }, []);

  // ============ HOME SCREEN ============
  if (screenState === "home") {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hazmat Marking & Label Detection</Text>
          <TouchableOpacity onPress={handleSkip}>
            <Text style={styles.skipText}></Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* Instruction */}
    
          {/* Scan Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              !modelStatus.ready && styles.optionCardDisabled,
            ]}
            onPress={handleOpenCamera}
            disabled={!modelStatus.ready}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name="camera-alt"
                size={36}
                color={modelStatus.ready ? "#007AFF" : "#C7C7CC"}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  !modelStatus.ready && styles.optionTitleDisabled,
                ]}
              >
                Open Camera
              </Text>
              <Text style={styles.optionDescription}>
                Take photos of the package to detect hazmat labels
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#C7C7CC" />
          </TouchableOpacity>

          {/* Gallery Option */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              !modelStatus.ready && styles.optionCardDisabled,
            ]}
            onPress={handlePickFromGallery}
            disabled={!modelStatus.ready}
            activeOpacity={0.7}
          >
            <View style={styles.optionIconContainer}>
              <MaterialIcons
                name="photo-library"
                size={36}
                color={modelStatus.ready ? "#007AFF" : "#C7C7CC"}
              />
            </View>
            <View style={styles.optionTextContainer}>
              <Text
                style={[
                  styles.optionTitle,
                  !modelStatus.ready && styles.optionTitleDisabled,
                ]}
              >
                Choose from Gallery
              </Text>
              <Text style={styles.optionDescription}>
                Select existing photos to analyze (up to 6 images)
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={28} color="#C7C7CC" />
          </TouchableOpacity>

          {!isRuntimeAvailable && (
            <View style={styles.warningBox}>
              <MaterialIcons name="warning" size={20} color="#FF9500" />
              <Text style={styles.warningText}>
                ML runtime not available. Run: npx expo run:android
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
          >
            <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip Detection</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#8E8E93" />
          </TouchableOpacity> */}
        </View>

        {/* Camera Modal */}
        <Modal visible={cameraModalVisible} animationType="slide">
          <SafeAreaView style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setCameraModalVisible(false)}>
                <MaterialIcons name="close" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.cameraHeaderTitle}>Capture Label</Text>
              <TouchableOpacity
                onPress={() =>
                  setFacing(f => (f === "back" ? "front" : "back"))
                }
              >
                <MaterialIcons
                  name="flip-camera-ios"
                  size={28}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>

            <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
              <View style={styles.cameraOverlay}>
                <View style={styles.scanFrame}>
                  <View style={[styles.corner, styles.cornerTL]} />
                  <View style={[styles.corner, styles.cornerTR]} />
                  <View style={[styles.corner, styles.cornerBL]} />
                  <View style={[styles.corner, styles.cornerBR]} />
                </View>
                <Text style={styles.scanHint}>
                  Position the label within the frame
                </Text>
              </View>
            </CameraView>

            <View style={styles.cameraControls}>
              <TouchableOpacity
                style={styles.cameraGalleryButton}
                onPress={() => {
                  setCameraModalVisible(false);
                  handlePickFromGallery();
                }}
              >
                <MaterialIcons name="photo-library" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleTakePhoto}
              >
                <View style={styles.captureButtonInner} />
              </TouchableOpacity>
              <View style={{ width: 56 }} />
            </View>
          </SafeAreaView>
        </Modal>
      </SafeAreaView>
    );
  }

  // ============ CROPPING SCREEN ============
  if (screenState === "cropping" && pendingCropImage) {
    return (
      <ImageCropScreen
        image={pendingCropImage}
        onCrop={handleCropComplete}
        onSkip={handleCropSkip}
        onCancel={handleCropCancel}
        source={cropSource}
      />
    );
  }

  // ============ PREVIEW SCREEN ============
  if (screenState === "preview") {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreenState("home")}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Review Images</Text>
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          <Text style={styles.previewSubtitle}>
            {capturedImages.length} image
            {capturedImages.length !== 1 ? "s" : ""} selected (max 6)
          </Text>

          <View style={styles.imageGrid}>
            {capturedImages.map((img, index) => (
              <View key={img.timestamp} style={styles.imageGridItem}>
                <Image source={{ uri: img.uri }} style={styles.gridImage} />
                {/* Crop button */}
                <TouchableOpacity
                  style={styles.cropImageButton}
                  onPress={() => handleCropFromPreview(index)}
                >
                  <MaterialIcons name="crop" size={16} color="#FFFFFF" />
                </TouchableOpacity>
                {/* Remove button */}
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => handleRemoveImage(index)}
                >
                  <MaterialIcons name="close" size={16} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            ))}
            {capturedImages.length < 6 && (
              <TouchableOpacity
                style={styles.addMoreButton}
                onPress={handleOpenCamera}
              >
                <MaterialIcons name="add-a-photo" size={28} color="#007AFF" />
                <Text style={styles.addMoreText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => setScreenState("home")}
          >
            <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              !modelLoaded && styles.analyzeButtonDisabled,
            ]}
            onPress={handleAnalyze}
            disabled={!modelLoaded}
          >
            <MaterialIcons name="search" size={20} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>Analyze Images</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ============ PROCESSING SCREEN ============
  if (screenState === "processing") {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.header}>
          <View style={{ width: 24 }} />
          <Text style={styles.headerTitle}>Analyzing...</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.processingContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.processingTitle}>Analyzing Images</Text>
          <Text style={styles.processingSubtitle}>
            {processingStatus || `Processing ${capturedImages.length} image${capturedImages.length !== 1 ? "s" : ""}`}
          </Text>
          <Text style={styles.processingHint}>Detection + OCR</Text>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </SafeAreaView>
    );
  }

  // ============ RESULTS SCREEN ============
  if (screenState === "results") {
    // Always use correctedResults (initialized from analysisResults)
    const displayResults = correctedResults.length > 0 ? correctedResults : (analysisResults || []);
    const totalDetections = displayResults.reduce(
      (sum, r) => sum + r.detections.length,
      0
    );
    const hasOCRData = aggregatedResults && (
      aggregatedResults.bestPopMarking ||
      aggregatedResults.allUnNumbers.length > 0 ||
      aggregatedResults.allWeights.length > 0 ||
      aggregatedResults.allHazardClasses.length > 0
    );
    const hasCorrections = corrections.length > 0;

    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setScreenState("preview")}>
            <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Analysis Results</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Summary Banner with Add Label Action */}
        <View
          style={[
            styles.summaryBanner,
            { backgroundColor: totalDetections > 0 || hasOCRData ? "#E8F5E9" : "#FFF3E0" },
          ]}
        >
          <View style={styles.summaryLeft}>
            <MaterialIcons
              name={totalDetections > 0 || hasOCRData ? "check-circle" : "info"}
              size={24}
              color={totalDetections > 0 || hasOCRData ? "#4CAF50" : "#FF9800"}
            />
            <View style={styles.summaryTextContainer}>
              <Text
                style={[
                  styles.summaryText,
                  { color: totalDetections > 0 || hasOCRData ? "#2E7D32" : "#E65100" },
                ]}
              >
                {totalDetections > 0
                  ? `Found ${totalDetections} label${totalDetections !== 1 ? "s" : ""}${hasCorrections ? ` (${corrections.length} edited)` : ""}`
                  : "No labels detected"}
              </Text>
              <Text style={styles.summarySubtext}>
                Something missing? Tap below to add
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
          {/* POP Marking Card - if found */}
          {aggregatedResults?.bestPopMarking && (
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
          )}

          {/* Extracted OCR Data Card */}
          {aggregatedResults && (
            aggregatedResults.allUnNumbers.length > 0 ||
            aggregatedResults.allEXNumbers?.length > 0 ||
            aggregatedResults.allUnWithPSN?.length > 0 ||
            aggregatedResults.rawPopMarkingText ||
            aggregatedResults.allHazardClasses.length > 0
          ) && (
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
          )}

          {/* Per-image detection results */}
          {displayResults.map((result, index) => (
            <View key={`result-${index}`} style={styles.resultCard}>
              {/* <Text style={styles.resultCardTitle}>
                Image {index + 1} • {result.inferenceTime}ms
                {result.ocrResult ? ` • OCR: ${result.ocrResult.processingTime}ms` : ""}
              </Text> */}
              <DetectionOverlay result={result} maxHeight={250} />

              {/* Detection list with always-visible edit actions */}
              <View style={styles.detectionsList}>
                <Text style={styles.detectionsListHeader}>Detected Labels</Text>

                {result.detections.length > 0 ? (
                  result.detections.map(d => {
                    const corrected = d as CorrectedDetection;
                    const isManual = corrected.source === 'manual';
                    const wasEdited = corrected.originalClassName && corrected.originalClassName !== d.className;

                    return (
                      <TouchableOpacity
                        key={d.id}
                        style={styles.detectionItemAlwaysEditable}
                        onPress={() => handleEditDetectionPress(index, d)}
                        activeOpacity={0.7}
                      >
                        <View
                          style={[
                            styles.detectionDot,
                            { backgroundColor: getCategoryColor(d.category) },
                          ]}
                        />
                        <View style={styles.detectionTextContainer}>
                          <Text style={[styles.detectionName, isManual && styles.detectionNameManual]}>
                            {formatClassName(d.className)}
                          </Text>
                          {wasEdited && (
                            <Text style={styles.originalClassName}>
                              Was: {formatClassName(corrected.originalClassName!)}
                            </Text>
                          )}
                        </View>
                        {isManual && !wasEdited ? (
                          <View style={styles.manualBadge}>
                            <Text style={styles.manualBadgeText}>Added</Text>
                          </View>
                        ) : (
                          <Text style={styles.detectionConfidence}>
                            {Math.round(d.confidence * 100)}%
                          </Text>
                        )}
                        {/* Always show edit icon */}
                        <MaterialIcons name="edit" size={18} color="#8E8E93" style={styles.editIcon} />
                      </TouchableOpacity>
                    );
                  })
                ) : (
                  <Text style={styles.noDetectionsText}>No labels detected in this image</Text>
                )}

                {/* ALWAYS VISIBLE: Add Missing Label Button */}
                <TouchableOpacity
                  style={styles.addMissingLabelButton}
                  onPress={() => handleAddLabelPress(index)}
                  activeOpacity={0.7}
                >
                  <MaterialIcons name="add-circle-outline" size={22} color="#007AFF" />
                  <Text style={styles.addMissingLabelText}>Add Missing Label</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => {
              setCapturedImages([]);
              clearResults();
              setScreenState("home");
            }}
          >
            <MaterialIcons name="refresh" size={20} color="#007AFF" />
            <Text style={styles.retakeButtonText}>Retake</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={navigateToNextScreen}
          >
            <Text style={styles.continueButtonText}>Continue</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Label Picker Modal */}
        <LabelPickerModal
          visible={labelPickerVisible}
          onClose={() => {
            setLabelPickerVisible(false);
            setEditingDetection(null);
          }}
          onSelect={handleLabelSelect}
          currentClassId={editingDetection?.classId}
          title={labelPickerMode === 'add' ? "Add Missing Label" : "Change Label"}
        />
      </SafeAreaView>
    );
  }

  return null;
}

// Helpers
function formatClassName(name: string): string {
  return name
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, s => s.toUpperCase())
    .trim();
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    general_marking: "#007AFF",
    hazardClass1: "#FF3B30",
    hazardClass2: "#34C759",
    hazardClass3: "#FF9500",
    hazardClass4: "#FF2D55",
    hazardClass5: "#FFCC00",
    hazardClass6: "#AF52DE",
    hazardClass8: "#5856D6",
    hazardClass9: "#8E8E93",
  };
  return colors[category] || "#007AFF";
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  skipText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  modelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  statsRow: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    paddingTop: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#007AFF",
  },
  statLabel: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: "#E5E5EA",
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F0F8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 4,
  },
  optionTitleDisabled: {
    color: "#C7C7CC",
  },
  optionDescription: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F0F8FF",
    borderRadius: 8,
    padding: 14,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#007AFF20",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#3C3C43",
    lineHeight: 18,
    marginLeft: 10,
  },
  warningBox: {
    flexDirection: "row",
    backgroundColor: "#FFF8E1",
    borderRadius: 8,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#FF950020",
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#E65100",
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
    gap: 12,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  skipButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: "#E5E5EA",
  },
  skipButtonText: {
    color: "#8E8E93",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },

  // Camera styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  cameraHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  cameraHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: SCREEN_WIDTH * 0.8,
    height: SCREEN_WIDTH * 0.8,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 32,
    height: 32,
    borderColor: "#FFFFFF",
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanHint: {
    color: "#FFFFFF",
    fontSize: 14,
    marginTop: 20,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 24,
  },
  cameraGalleryButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#000",
  },

  // Preview styles
  previewSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 16,
  },
  imageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -6,
  },
  imageGridItem: {
    width: (SCREEN_WIDTH - 56) / 3,
    height: (SCREEN_WIDTH - 56) / 3,
    margin: 6,
    borderRadius: 8,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cropImageButton: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "#007AFF",
    borderRadius: 10,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  addMoreButton: {
    width: (SCREEN_WIDTH - 56) / 3,
    height: (SCREEN_WIDTH - 56) / 3,
    margin: 6,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F8FF",
  },
  addMoreText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "600",
    marginTop: 4,
  },
  analyzeButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
  },
  analyzeButtonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  analyzeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },

  // Processing styles
  processingContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  processingTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginTop: 20,
  },
  processingSubtitle: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 8,
  },
  processingHint: {
    fontSize: 12,
    color: "#007AFF",
    marginTop: 4,
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 14,
    marginTop: 16,
  },

  // Results styles
  summaryBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  summaryLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 10,
  },
  summaryTextContainer: {
    flex: 1,
  },
  summaryText: {
    fontSize: 15,
    fontWeight: "600",
  },
  summarySubtext: {
    fontSize: 12,
    color: "#8E8E93",
    marginTop: 2,
  },
  resultCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  resultCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 10,
  },
  detectionsList: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E5EA",
  },
  detectionsListHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  detectionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
  },
  detectionItemAlwaysEditable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginHorizontal: -12,
    borderRadius: 8,
    backgroundColor: "#FAFAFA",
    marginBottom: 6,
  },
  detectionDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  detectionName: {
    flex: 1,
    fontSize: 15,
    color: "#1D1D1F",
  },
  detectionConfidence: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
    marginRight: 8,
  },
  editIcon: {
    marginLeft: 4,
  },
  noDetectionsText: {
    fontSize: 14,
    color: "#8E8E93",
    fontStyle: "italic",
    paddingVertical: 8,
  },
  addMissingLabelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginTop: 8,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    backgroundColor: "#F0F8FF",
    gap: 8,
  },
  addMissingLabelText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  retakeButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 6,
  },
  continueButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
  },
  continueButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    marginRight: 6,
  },

  // Manual correction styles
  detectionTextContainer: {
    flex: 1,
  },
  detectionNameManual: {
    color: "#007AFF",
  },
  originalClassName: {
    fontSize: 11,
    color: "#8E8E93",
    marginTop: 2,
  },
  manualBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#E8F5E9",
    borderRadius: 4,
    marginRight: 8,
  },
  manualBadgeText: {
    fontSize: 11,
    color: "#4CAF50",
    fontWeight: "600",
  },
});

export default MLDetectionScreen;
