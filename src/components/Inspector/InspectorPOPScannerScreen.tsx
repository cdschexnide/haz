/**
 * InspectorPOPScannerScreen - Camera screen for scanning POP markings using OCR (Inspector Flow)
 *
 * Uses expo-camera for camera access and @react-native-ml-kit/text-recognition for OCR
 */

import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import colors from "@/theming/colors";
import { extractPOPMarkingFromText } from "@/utils/popMarkingParser";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TextRecognition from "@react-native-ml-kit/text-recognition";

const { width: screenWidth } = Dimensions.get("window");

interface POPScannerScreenProps {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const InspectorPOPScannerScreen: React.FC<POPScannerScreenProps> = ({
  navigation,
}) => {
  const { setPackagePopMarking } = useInspectionForm();
  const cameraRef = useRef<CameraView>(null);
  const [permission, requestPermission] = useCameraPermissions();
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState("");

  // Handle permission not granted
  if (!permission) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color={colors.darkGrey} />
        <Text style={styles.permissionTitle}>Camera Permission Required</Text>
        <Text style={styles.permissionText}>
          To scan POP markings, please allow camera access.
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    setProcessingStatus("Capturing image...");

    try {
      console.log("=== POPScannerScreen: Taking Picture ===");

      // Capture photo at maximum quality for small text
      const photo = await cameraRef.current.takePictureAsync({
        quality: 1,
      });

      console.log("Photo captured:", {
        uri: photo?.uri,
        width: photo?.width,
        height: photo?.height,
      });

      if (!photo || !photo.uri) {
        throw new Error("Failed to capture image");
      }

      setProcessingStatus("Recognizing text...");

      // Perform OCR using ML Kit
      console.log("Starting OCR with ML Kit...");
      const result = await TextRecognition.recognize(photo.uri);
      console.log("OCR complete. Full result:", result);

      const ocrText = result.text;
      console.log("Raw OCR text extracted:", ocrText);
      console.log("OCR text length:", ocrText?.length || 0);

      if (!ocrText || ocrText.trim().length === 0) {
        Alert.alert(
          "No Text Detected",
          "Could not detect any text in the image. Please ensure the POP marking is clearly visible and try again.",
          [{ text: "OK" }]
        );
        setIsProcessing(false);
        return;
      }

      setProcessingStatus("Parsing POP marking...");

      // Parse the OCR text to extract POP fields
      console.log("Calling extractPOPMarkingFromText...");
      const { fields, confidence, issues, detectedType } =
        extractPOPMarkingFromText(ocrText);
      console.log("Extraction complete:", {
        fields,
        confidence,
        issues,
        detectedType,
      });

      // Always update inspection context with extracted values (even if partially successful)
      if (fields) {
        console.log("Updating inspection context with parsed fields...");
        setPackagePopMarking({
          B: fields.B || "",
          C: fields.C || "",
          D: fields.D || "",
          E: fields.E || "",
          F: fields.F || "",
          G: fields.G || "",
          H: fields.H || "",
        });
        console.log("Inspection context updated with fields");
      } else {
        console.log("⚠️ No fields extracted - inspection context not updated");
      }

      // Navigate to results screen for review
      console.log("Navigating to InspectorPOPScanResultsScreen...");
      navigation.navigate("InspectorPOPScanResultsScreen", {
        imageUri: photo.uri,
        rawOCRText: ocrText,
        parsedFields: fields || {
          type: "unknown",
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "",
          G: "",
          H: "",
        },
        confidence,
        issues,
        detectedType,
      });
    } catch (error) {
      console.error("POP Scanning error:", error);
      Alert.alert(
        "Scanning Failed",
        "An error occurred while scanning. Please try again.",
        [{ text: "OK" }]
      );
    } finally {
      setIsProcessing(false);
      setProcessingStatus("");
    }
  };

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing="back" ref={cameraRef}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="close" size={28} color={colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Scan POP Marking</Text>
          <View style={styles.headerSpacer} />
        </View>

        {/* Viewfinder Overlay */}
        <View style={styles.overlay}>
          <Text style={styles.instructionText}>
            Center the POP marking within the frame
          </Text>

          <View style={styles.viewfinder}>
            {/* Corner markers */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>

          <Text style={styles.exampleText}>
            Example: UN / 1A1 / X / 25 / S / 23 / USA / DOD
          </Text>
        </View>

        {/* Processing Indicator */}
        {isProcessing && (
          <View style={styles.processingOverlay}>
            <ActivityIndicator size="large" color={colors.white} />
            <Text style={styles.processingText}>{processingStatus}</Text>
          </View>
        )}

        {/* Capture Button */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              isProcessing && styles.captureButtonDisabled,
            ]}
            onPress={takePicture}
            disabled={isProcessing}
            activeOpacity={0.7}
          >
            <View style={styles.captureButtonInner} />
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
};

export default InspectorPOPScannerScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  closeButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.white,
  },
  headerSpacer: {
    width: 44,
  },
  overlay: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  instructionText: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  viewfinder: {
    width: screenWidth - 60,
    height: 120,
    borderWidth: 2,
    borderColor: colors.white,
    borderRadius: 8,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: colors.blue,
    borderWidth: 3,
  },
  topLeft: {
    top: -2,
    left: -2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  exampleText: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
    textAlign: "center",
    marginTop: 20,
    fontStyle: "italic",
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    alignItems: "center",
    justifyContent: "center",
  },
  processingText: {
    fontSize: 16,
    color: colors.white,
    marginTop: 16,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.white,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.black,
    marginTop: 20,
    marginBottom: 10,
  },
  permissionText: {
    fontSize: 16,
    color: colors.darkGrey,
    textAlign: "center",
    marginBottom: 30,
  },
  permissionButton: {
    backgroundColor: colors.blue,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 4,
    marginBottom: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  cancelButtonText: {
    fontSize: 16,
    color: colors.blue,
  },
});
