import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { useHazProActions } from "../../stores/useHazProStore";
import {
  getCylinderTypesForParagraph,
  hasCylinderTypeRequirements,
  extractA6Paragraph,
  PARAGRAPH_TITLES,
  CylinderType,
} from "../../data/cylinderTypesByParagraph";

interface InspectorCylinderTypeSelectionScreenProps {
  navigation: any;
}

export default function InspectorCylinderTypeSelectionScreen({
  navigation,
}: InspectorCylinderTypeSelectionScreenProps) {
  const { inspection } = useInspectionForm();
  const actions = useHazProActions();

  // Local state for COE/CAA view toggle
  const [showCoeCaaOptions, setShowCoeCaaOptions] = useState(false);

  // Get packing instruction from SDDG
  const packingInstruction =
    inspection?.verificationCopy?.packingInstruction ||
    inspection?.extractedContent?.packingInstruction ||
    "";

  // Extract base paragraph and get title
  const baseParagraph = extractA6Paragraph(packingInstruction);
  const paragraphTitle = baseParagraph
    ? PARAGRAPH_TITLES[baseParagraph] || baseParagraph
    : "Unknown";

  // Get valid cylinder types for this paragraph
  const cylinderTypes = useMemo<CylinderType[]>(() => {
    return getCylinderTypesForParagraph(packingInstruction);
  }, [packingInstruction]);

  // Set active chevron when component mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, [actions]);

  // If no cylinder types defined, skip directly to compressed gases screen
  useEffect(() => {
    if (!hasCylinderTypeRequirements(packingInstruction)) {
      console.log(
        "[CylinderTypeSelection] No cylinder types for packing instruction, skipping to compressed gases:",
        packingInstruction
      );
      navigation.replace("InspectorCompressedGasesScreen");
    }
  }, [packingInstruction, navigation]);

  const handleCylinderSelect = (cylinder: CylinderType) => {
    console.log("[CylinderTypeSelection] Cylinder selected:", cylinder.id);

    // TODO: Store selected cylinder type in context if needed for reporting
    // For now, a valid selection means pass - proceed to next screen

    navigation.navigate("InspectorCompressedGasesScreen");
  };

  const handleNotListed = () => {
    setShowCoeCaaOptions(true);
  };

  const handleCoeCaaSelect = (type: "COE" | "CAA") => {
    Alert.alert(
      `${type} Verification`,
      `${type === "COE" ? "Certificate of Equivalency" : "Competent Authority Approval"} verification coming soon.`,
      [{ text: "OK" }]
    );
  };

  const handleBackToCylinderTypes = () => {
    setShowCoeCaaOptions(false);
  };

  // Show loading/skip state while checking
  if (!hasCylinderTypeRequirements(packingInstruction)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cylinder Type Selection</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {!showCoeCaaOptions ? (
          /* Main Cylinder Selection View */
          <>
            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>
                {baseParagraph} - {paragraphTitle}
              </Text>
              <Text style={styles.instruction}>
                Select the cylinder type observed on the package
              </Text>
            </View>

            {/* Cylinder Type Grid */}
            <View style={styles.cylinderGrid}>
              {cylinderTypes.map((cylinder) => (
                <TouchableOpacity
                  key={cylinder.id}
                  style={styles.cylinderButton}
                  onPress={() => handleCylinderSelect(cylinder)}
                >
                  <Text style={styles.cylinderButtonText}>{cylinder.label}</Text>
                  {cylinder.restrictions && (
                    <MaterialIcons
                      name="info-outline"
                      size={14}
                      color="#FF9500"
                      style={styles.restrictionIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            {/* Not Listed Button */}
            <TouchableOpacity
              style={styles.notListedButton}
              onPress={handleNotListed}
            >
              <Text style={styles.notListedButtonText}>Not Listed</Text>
            </TouchableOpacity>
          </>
        ) : (
          /* COE/CAA Options View */
          <>
            {/* Subtitle */}
            <View style={styles.subtitleContainer}>
              <Text style={styles.subtitle}>Non-Standard Cylinder Authorization</Text>
              <Text style={styles.instruction}>
                Select authorization type if applicable
              </Text>
            </View>

            {/* COE Button */}
            <TouchableOpacity
              style={styles.coeCaaButton}
              onPress={() => handleCoeCaaSelect("COE")}
            >
              <View style={styles.coeCaaButtonContent}>
                <MaterialIcons name="description" size={24} color="#8E8E93" />
                <View style={styles.coeCaaTextContainer}>
                  <Text style={styles.coeCaaButtonText}>
                    COE (Certificate of Equivalency)
                  </Text>
                  <Text style={styles.coeCaaSubtext}>Coming soon</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* CAA Button */}
            <TouchableOpacity
              style={styles.coeCaaButton}
              onPress={() => handleCoeCaaSelect("CAA")}
            >
              <View style={styles.coeCaaButtonContent}>
                <MaterialIcons name="verified-user" size={24} color="#8E8E93" />
                <View style={styles.coeCaaTextContainer}>
                  <Text style={styles.coeCaaButtonText}>
                    CAA (Competent Authority Approval)
                  </Text>
                  <Text style={styles.coeCaaSubtext}>Coming soon</Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* Back Button */}
            <TouchableOpacity
              style={styles.backToCylindersButton}
              onPress={handleBackToCylinderTypes}
            >
              <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
              <Text style={styles.backToCylindersText}>
                Back to Cylinder Types
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
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
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#8E8E93",
  },
  subtitleContainer: {
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  instruction: {
    fontSize: 15,
    color: "#8E8E93",
  },
  cylinderGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 24,
  },
  cylinderButton: {
    width: "31%",
    minWidth: 100,
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#007AFF",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cylinderButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#007AFF",
    textAlign: "center",
  },
  restrictionIcon: {
    marginLeft: 4,
  },
  notListedButton: {
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#D1D1D6",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notListedButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#8E8E93",
  },
  coeCaaButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#D1D1D6",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    marginBottom: 16,
  },
  coeCaaButtonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  coeCaaTextContainer: {
    marginLeft: 16,
    flex: 1,
  },
  coeCaaButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#3C3C43",
  },
  coeCaaSubtext: {
    fontSize: 13,
    color: "#8E8E93",
    marginTop: 4,
  },
  backToCylindersButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    marginTop: 8,
  },
  backToCylindersText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#007AFF",
    marginLeft: 8,
  },
});
