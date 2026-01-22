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
import { getMockDetectionsForUN } from "../../ml/config/mockDetections";
import { DetectionOverlay } from "../../ml/components/DetectionOverlay";
import { ImageCropScreen } from "../../ml/components/ImageCropScreen";
import { LabelPickerModal } from "../../ml/components";
import { useInspectionFormActions, useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProActions } from "../../stores/useHazProStore";
import { getPostMlDetectionRoute } from "@/utils/inspectorWorkflowRouting";
import { DevBenchmarkButton } from "../../components/dev/DevBenchmarkButton";
import { ScreenHeader, ActionFooter, InfoBox, colors, spacing, borderRadius } from "../../components/ui";
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
  const { setMLAnalysisResults } = useInspectionFormActions();
  const { inspection } = useInspectionForm();
  const actions = useHazProActions();
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
      return { text: "Runtime Unavailable", color: colors.error, ready: false };
    if (!modelLoaded)
      return { text: "Loading...", color: colors.warning, ready: false };
    return { text: "Ready", color: colors.success, ready: true };
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
    // In navigation mode, determine next screen based on material type
    if (!navigation) return;

    const nextRoute = getPostMlDetectionRoute(inspection);
    navigation.navigate(nextRoute.screen, nextRoute.params);
  }, [navigation, onClose, correctedResults, analysisResults, setMLAnalysisResults, inspection]);

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
      const resultsCopy = JSON.parse(JSON.stringify(analysisResults));

      // Inject mock detections if configured for this UN number (for demo scenarios)
      const unNumber =
        inspection?.verificationCopy?.unIdNo ||
        inspection?.extractedContent?.unIdNo ||
        "";
      const mockDetections = getMockDetectionsForUN(unNumber);

      if (mockDetections && resultsCopy.length > 0) {
        console.log("[MLDetectionScreen] Injecting mock detections for", unNumber);
        const mocksWithIds = mockDetections.map((mock, idx) => ({
          ...mock,
          id: `mock-${Date.now()}-${idx}`,
          source: "mock" as const,
        }));
        resultsCopy[0].detections = [
          ...resultsCopy[0].detections,
          ...mocksWithIds,
        ];
      }

      setCorrectedResults(resultsCopy);
      setCorrections([]);
    }
  }, [analysisResults, inspection]);

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
        <ScreenHeader
          title="Hazmat Marking & Label Detection"
          onBack={handleGoBack}
        />

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
                color={modelStatus.ready ? colors.primary : colors.border}
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
            <MaterialIcons name="chevron-right" size={28} color={colors.border} />
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
                color={modelStatus.ready ? colors.primary : colors.border}
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
            <MaterialIcons name="chevron-right" size={28} color={colors.border} />
          </TouchableOpacity>

          {!isRuntimeAvailable && (
            <InfoBox
              variant="warning"
              message="ML runtime not available. Run: npx expo run:android"
            />
          )}
        </ScrollView>

        {/* Footer */}
        <ActionFooter
          buttons={[
            {
              label: "Back",
              onPress: handleGoBack,
              variant: "outline",
              icon: "arrow-back",
              iconPosition: "left",
            },
          ]}
        />

        {/* Camera Modal */}
        <Modal visible={cameraModalVisible} animationType="slide">
          <SafeAreaView style={styles.cameraContainer}>
            <View style={styles.cameraHeader}>
              <TouchableOpacity onPress={() => setCameraModalVisible(false)}>
                <MaterialIcons name="close" size={28} color={colors.white} />
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
                  color={colors.white}
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
                <MaterialIcons name="photo-library" size={28} color={colors.white} />
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
        <ScreenHeader
          title="Review Images"
          onBack={() => setScreenState("home")}
        />

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
                <MaterialIcons name="add-a-photo" size={28} color={colors.primary} />
                <Text style={styles.addMoreText}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <ActionFooter
          buttons={[
            {
              label: "Back",
              onPress: () => setScreenState("home"),
              variant: "outline",
              icon: "arrow-back",
              iconPosition: "left",
            },
            {
              label: "Analyze Images",
              onPress: handleAnalyze,
              variant: "primary",
              icon: "search",
              iconPosition: "left",
              disabled: !modelLoaded,
            },
          ]}
        />
      </SafeAreaView>
    );
  }

  // ============ PROCESSING SCREEN ============
  if (screenState === "processing") {
    return (
      <SafeAreaView style={styles.container} edges={[]}>
        <ScreenHeader title="Analyzing..." />

        <View style={styles.processingContent}>
          <ActivityIndicator size="large" color={colors.primary} />
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
        <ScreenHeader
          title="Analysis Results"
          onBack={() => setScreenState("preview")}
        />

        {/* Summary Banner */}
        <View
          style={[
            styles.summaryBanner,
            { backgroundColor: totalDetections > 0 || hasOCRData ? colors.successLight : colors.warningLight },
          ]}
        >
          <MaterialIcons
            name={totalDetections > 0 || hasOCRData ? "check-circle" : "info"}
            size={28}
            color={totalDetections > 0 || hasOCRData ? colors.success : colors.warning}
          />
          <View style={styles.summaryTextContainer}>
            <Text
              style={[
                styles.summaryText,
                { color: totalDetections > 0 || hasOCRData ? colors.success : colors.warning },
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

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
        >
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
                      <View
                        key={d.id}
                        style={styles.detectionItemAlwaysEditable}
                      >
                        <TouchableOpacity
                          style={styles.detectionItemContent}
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
                          {isManual && !wasEdited && (
                            <View style={styles.manualBadge}>
                              <Text style={styles.manualBadgeText}>Added</Text>
                            </View>
                          )}
                          {/* Edit icon */}
                          <MaterialIcons name="edit" size={18} color={colors.textSecondary} style={styles.editIcon} />
                        </TouchableOpacity>
                        {/* Delete icon */}
                        <TouchableOpacity
                          style={styles.deleteIconButton}
                          onPress={() => handleDeleteDetection(index, d)}
                          activeOpacity={0.7}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <MaterialIcons name="close" size={20} color={colors.error} />
                        </TouchableOpacity>
                      </View>
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
                  <MaterialIcons name="add-circle-outline" size={22} color={colors.primary} />
                  <Text style={styles.addMissingLabelText}>Add Missing Label</Text>
                </TouchableOpacity>
              </View>

            </View>
          ))}
        </ScrollView>

        <ActionFooter
          buttons={[
            {
              label: "Retake",
              onPress: () => {
                setCapturedImages([]);
                clearResults();
                setScreenState("home");
              },
              variant: "outline",
              icon: "refresh",
              iconPosition: "left",
            },
            {
              label: "Continue",
              onPress: navigateToNextScreen,
              variant: "primary",
              icon: "arrow-forward",
              iconPosition: "right",
            },
          ]}
        />

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

        {/* Dev Benchmark Button - only visible in __DEV__ */}
        <DevBenchmarkButton position="bottom-right" />
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
  const categoryColors: Record<string, string> = {
    general_marking: colors.primary,
    hazardClass1: colors.error,
    hazardClass2: colors.success,
    hazardClass3: colors.warning,
    hazardClass4: "#FF2D55",
    hazardClass5: "#FFCC00",
    hazardClass6: "#AF52DE",
    hazardClass8: "#5856D6",
    hazardClass9: colors.textSecondary,
  };
  return categoryColors[category] || colors.primary;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
  instructionText: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xl,
    textAlign: "center",
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },
  modelIconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.infoLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  cardTitleContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  cardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: borderRadius.lg,
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
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: colors.border,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionCardDisabled: {
    opacity: 0.5,
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.infoLight,
    justifyContent: "center",
    alignItems: "center",
    marginRight: spacing.md,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  optionTitleDisabled: {
    color: colors.border,
  },
  optionDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
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
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  cameraHeaderTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: colors.white,
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
    borderColor: colors.white,
  },
  cornerTL: { top: 0, left: 0, borderTopWidth: 3, borderLeftWidth: 3 },
  cornerTR: { top: 0, right: 0, borderTopWidth: 3, borderRightWidth: 3 },
  cornerBL: { bottom: 0, left: 0, borderBottomWidth: 3, borderLeftWidth: 3 },
  cornerBR: { bottom: 0, right: 0, borderBottomWidth: 3, borderRightWidth: 3 },
  scanHint: {
    color: colors.white,
    fontSize: 14,
    marginTop: spacing.xl,
  },
  cameraControls: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: spacing.xxl,
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
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.white,
    borderWidth: 3,
    borderColor: "#000",
  },

  // Preview styles
  previewSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
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
    borderRadius: borderRadius.md,
    overflow: "hidden",
  },
  gridImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  removeImageButton: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: colors.error,
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
    backgroundColor: colors.primary,
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
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.infoLight,
  },
  addMoreText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "600",
    marginTop: spacing.xs,
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
    color: colors.textPrimary,
    marginTop: spacing.xl,
  },
  processingSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  processingHint: {
    fontSize: 12,
    color: colors.primary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
    fontSize: 14,
    marginTop: spacing.lg,
  },

  // Results styles
  summaryBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
    gap: 12,
  },
  summaryTextContainer: {
    alignItems: "center",
  },
  summaryText: {
    fontSize: 18,
    fontWeight: "600",
  },
  summarySubtext: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  resultCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 10,
  },
  detectionsList: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  detectionsListHeader: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    marginBottom: spacing.sm,
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
    paddingHorizontal: spacing.md,
    marginHorizontal: -12,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    marginBottom: 6,
  },
  detectionItemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  deleteIconButton: {
    padding: spacing.xs,
    marginLeft: spacing.sm,
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
    color: colors.textPrimary,
  },
  detectionConfidence: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
    marginRight: spacing.sm,
  },
  editIcon: {
    marginLeft: spacing.xs,
  },
  noDetectionsText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: "italic",
    paddingVertical: spacing.sm,
  },
  addMissingLabelButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: spacing.md,
    marginTop: spacing.sm,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
    backgroundColor: colors.infoLight,
    gap: spacing.sm,
  },
  addMissingLabelText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.primary,
  },

  // Manual correction styles
  detectionTextContainer: {
    flex: 1,
  },
  detectionNameManual: {
    color: colors.primary,
  },
  originalClassName: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  manualBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    backgroundColor: colors.successLight,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  manualBadgeText: {
    fontSize: 11,
    color: colors.success,
    fontWeight: "600",
  },
});

export default MLDetectionScreen;
