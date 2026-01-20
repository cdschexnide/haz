/**
 * InspectorPOPScanResultsScreen - Debug/review screen showing OCR extraction results (Inspector Flow)
 *
 * Displays:
 * - Captured image thumbnail
 * - Raw OCR text
 * - Parsed POP marking fields (A-H)
 * - Confidence score and issues
 * - Options to retry, edit, or continue
 */

import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import colors from "@/theming/colors";
import { POPMarkingFields, POPMarkingType } from "@/utils/popMarkingParser";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";

const { width: screenWidth } = Dimensions.get("window");

interface POPScanResultsScreenProps {
  // navigation: {
  //   // navigate: (screen: string, params?: any) => void;
  //   goBack: () => void;
  // };
  route: {
    params: {
      imageUri: string;
      rawOCRText: string;
      parsedFields: POPMarkingFields;
      confidence: number;
      issues: string[];
      detectedType: POPMarkingType;
    };
  };
}

const InspectorPOPScanResultsScreen = ({
  // navigation,
  route,
}: POPScanResultsScreenProps) => {
  const { resetPackagePopMarking } = useInspectionForm();
  const { navigate } = useNavigationRef();
  const {
    imageUri,
    rawOCRText,
    parsedFields,
    confidence,
    issues,
    detectedType,
  } = route.params;

  console.log("=== InspectorPOPScanResultsScreen Mounted ===");
  console.log("Image URI:", imageUri);
  console.log("Raw OCR Text:", rawOCRText);
  console.log("Parsed Fields:", parsedFields);
  console.log("Confidence:", confidence);
  console.log("Issues:", issues);

  const handleContinue = () => {
    console.log(
      "User clicked Continue - navigating to InspectorPOPMarkingDataEntry"
    );
    // Fields are already populated in inspection context by InspectorPOPScannerScreen
    // Navigate to screen inside InspectorWrappedStack using nested navigation
    navigate("InspectorWrappedStack", { screen: "InspectorPOPMarkingDataEntry" });
  };

  const handleRetry = () => {
    console.log("User clicked Retry - going back to camera");
    navigate("InspectorPOPScannerScreen");
  };

  const handleEditManually = () => {
    console.log(
      "User clicked Edit Manually - clearing fields and navigating to InspectorPOPMarkingDataEntry"
    );
    // Clear the scanned fields so user starts with empty form
    resetPackagePopMarking();
    // Navigate to screen inside InspectorWrappedStack using nested navigation
    navigate("InspectorWrappedStack", { screen: "InspectorPOPMarkingDataEntry" });
  };

  const getConfidenceColor = () => {
    if (confidence >= 0.8) return colors.green || "#4CAF50";
    if (confidence >= 0.5) return colors.orange || "#FF9800";
    return colors.red || "#F44336";
  };

  const getConfidenceLabel = () => {
    if (confidence >= 0.8) return "High";
    if (confidence >= 0.5) return "Medium";
    return "Low";
  };

  const getTypeDisplayName = () => {
    switch (detectedType) {
      case POPMarkingType.NON_BULK_SOLID:
        return "Non-Bulk Solid/Combination";
      case POPMarkingType.NON_BULK_LIQUID:
        return "Non-Bulk Liquid";
      case POPMarkingType.LARGE_PACKAGING:
        return "Large Packaging";
      case POPMarkingType.UNKNOWN:
      default:
        return "Unknown Type";
    }
  };

  const getTypeColor = () => {
    switch (detectedType) {
      case POPMarkingType.NON_BULK_SOLID:
        return "#2196F3"; // Blue
      case POPMarkingType.NON_BULK_LIQUID:
        return "#4CAF50"; // Green
      case POPMarkingType.LARGE_PACKAGING:
        return "#9C27B0"; // Purple
      case POPMarkingType.UNKNOWN:
      default:
        return "#757575"; // Gray
    }
  };

  const getFieldLabel = (fieldKey: string): string => {
    // Type-specific field labels
    switch (detectedType) {
      case POPMarkingType.NON_BULK_SOLID:
        switch (fieldKey) {
          case "A":
            return "A (UN Symbol)";
          case "B":
            return "B (Packaging Code)";
          case "C":
            return "C (Packing Group)";
          case "D":
            return "D (Max Gross Mass - kg)";
          case "E":
            return "E (Solid/Inner Pkg Indicator)";
          case "F":
            return "F (Year)";
          case "G":
            return "G (Country)";
          case "H":
            return "H (Manufacturer)";
          default:
            return fieldKey;
        }

      case POPMarkingType.NON_BULK_LIQUID:
        switch (fieldKey) {
          case "A":
            return "A (UN Symbol)";
          case "B":
            return "B (Packaging Code)";
          case "C":
            return "C (Packing Group)";
          case "D":
            return "D (Relative Density)";
          case "E":
            return "E (Test Pressure - kPa)";
          case "F":
            return "F (Year)";
          case "G":
            return "G (Country)";
          case "H":
            return "H (Manufacturer)";
          default:
            return fieldKey;
        }

      case POPMarkingType.LARGE_PACKAGING:
        switch (fieldKey) {
          case "A":
            return "A (UN Symbol)";
          case "B":
            return "B (Packaging Code)";
          case "C":
            return "C (Packing Group)";
          case "D":
            return "D (Manufacture Date - MM/YY)";
          case "E":
            return "E (Country)";
          case "F":
            return "F (Manufacturer)";
          case "G":
            return "G (Stack Load - kg)";
          case "H":
            return "H (Max Gross/Net Mass - kg)";
          default:
            return fieldKey;
        }

      default:
        // Generic labels for unknown type
        switch (fieldKey) {
          case "A":
            return "A (UN Symbol)";
          case "B":
            return "B (Packaging Code)";
          case "C":
            return "C (Packing Group)";
          case "D":
            return "D (Mass/Density/Date)";
          case "E":
            return "E (Varies by Type)";
          case "F":
            return "F (Year/Manufacturer)";
          case "G":
            return "G (Country/Stack Load)";
          case "H":
            return "H (Manufacturer/Mass)";
          default:
            return fieldKey;
        }
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeButton} onPress={handleRetry}>
          <Ionicons name="arrow-back" size={24} color={colors.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Results</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Captured Image */}
        {/* <View style={styles.section}>
          <Text style={styles.sectionTitle}>Captured Image</Text>
          <Image source={{ uri: imageUri }} style={styles.thumbnail} />
        </View> */}

        {/* Detected Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detected Type</Text>
          <View style={styles.typeBadgeContainer}>
            <View
              style={[styles.typeBadge, { backgroundColor: getTypeColor() }]}
            >
              <Text style={styles.typeBadgeText}>{getTypeDisplayName()}</Text>
            </View>
            {detectedType === POPMarkingType.UNKNOWN && (
              <Text style={styles.typeWarning}>
                Unable to determine type. Please verify all fields carefully.
              </Text>
            )}
          </View>
        </View>

        {/* Confidence Score */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Confidence Score</Text>
          <View style={styles.confidenceContainer}>
            <View
              style={[
                styles.confidenceBadge,
                { backgroundColor: getConfidenceColor() },
              ]}
            >
              <Text style={styles.confidenceText}>
                {getConfidenceLabel()} ({Math.round(confidence * 100)}%)
              </Text>
            </View>
          </View>
        </View>

        {/* Raw OCR Text */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Raw OCR Text</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {rawOCRText || "(No text detected)"}
            </Text>
          </View>
        </View>

        {/* Parsed Fields */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Parsed POP Fields</Text>
          <View style={styles.fieldsTable}>
            <FieldRow label={getFieldLabel("A")} value={parsedFields.A} />
            <FieldRow label={getFieldLabel("B")} value={parsedFields.B} />
            <FieldRow label={getFieldLabel("C")} value={parsedFields.C} />
            <FieldRow label={getFieldLabel("D")} value={parsedFields.D} />
            <FieldRow label={getFieldLabel("E")} value={parsedFields.E} />
            <FieldRow label={getFieldLabel("F")} value={parsedFields.F} />
            <FieldRow label={getFieldLabel("G")} value={parsedFields.G} />
            <FieldRow label={getFieldLabel("H")} value={parsedFields.H} />
          </View>
        </View>

        {/* Issues/Warnings */}
        {issues && issues.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Issues Found</Text>
            <View style={styles.issuesContainer}>
              {issues.map((issue, index) => (
                <View key={index} style={styles.issueRow}>
                  <Ionicons
                    name="warning-outline"
                    size={20}
                    color={colors.orange || "#FF9800"}
                  />
                  <Text style={styles.issueText}>{issue}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleRetry}
        >
          <Ionicons
            name="camera-outline"
            size={20}
            color={colors.blue}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.secondaryButtonText}>Retry Scan</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={handleEditManually}
        >
          <Ionicons
            name="create-outline"
            size={20}
            color={colors.blue}
            style={{ marginRight: 8 }}
          />
          <Text style={styles.secondaryButtonText}>Edit Manually</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleContinue}
        >
          <Text style={styles.primaryButtonText}>Continue</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={colors.white}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Helper component for field rows
const FieldRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <View style={styles.fieldRow}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <Text style={styles.fieldValue}>{value || "(empty)"}</Text>
  </View>
);

export default InspectorPOPScanResultsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey || "#e0e0e0",
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
    color: colors.black,
  },
  headerSpacer: {
    width: 44,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGrey || "#e0e0e0",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
    marginBottom: 12,
  },
  thumbnail: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    resizeMode: "contain",
  },
  typeBadgeContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
  typeBadge: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 8,
  },
  typeBadgeText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.white,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  typeWarning: {
    fontSize: 13,
    color: "#FF9800",
    fontStyle: "italic",
    marginTop: 4,
  },
  confidenceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  confidenceBadge: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  confidenceText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.white,
  },
  codeBlock: {
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    color: colors.black,
  },
  fieldsTable: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    overflow: "hidden",
  },
  fieldRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    padding: 12,
  },
  fieldLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: colors.darkGrey,
  },
  fieldValue: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
    fontFamily: "monospace",
  },
  issuesContainer: {
    gap: 8,
  },
  issueRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 12,
    backgroundColor: "#FFF3E0",
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FF9800",
  },
  issueText: {
    flex: 1,
    fontSize: 14,
    color: colors.black,
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    gap: 12,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.lightGrey || "#e0e0e0",
  },
  button: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  primaryButton: {
    backgroundColor: colors.blue,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },
  secondaryButton: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.blue,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.blue,
  },
});
