import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SectionList,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { evaluateMarkingRequirementsInspector } from "../../utils/markingRequirementsInspector";
import { evaluateLabelingRequirements } from "../../utils/labelingRequirementsInspector";
import { useHazProStore } from "../../stores/useHazProStore";

interface InspectorPackageVerificationScreenProps {
  navigation: any;
}

type ItemCategory = "marking" | "label";
type VerificationStatus = "validated" | "frustrated" | "unchecked";

interface PackageVerificationItem {
  id: string;
  category: ItemCategory;
  label: string;
  description: string;
  expectedValues: string[];
  verificationStatus: VerificationStatus;
  isRequired: boolean;
  afmanReference?: string;
  imagePath?: any;
}

interface VerificationSection {
  title: string;
  icon: string;
  category: ItemCategory;
  data: PackageVerificationItem[];
}

// Helper function to convert markings to unified interface
const convertMarkingsToItems = (
  markingsRequirements: Record<string, string[]>
): PackageVerificationItem[] => {
  return Object.entries(markingsRequirements).map(
    ([label, expectedValues], index) => ({
      id: `marking-${index}`,
      category: "marking" as ItemCategory,
      label,
      description: `Verify the presence of: ${expectedValues.join(", ")}`,
      expectedValues,
      verificationStatus: "unchecked" as VerificationStatus,
      isRequired: true,
      afmanReference: "AFMAN 24-604",
    })
  );
};

// Helper function to convert labels to unified interface
const convertLabelsToItems = (
  labelingRequirements: Record<string, string[]>
): PackageVerificationItem[] => {
  return Object.entries(labelingRequirements).map(
    ([label, expectedValues], index) => ({
      id: `label-${index}`,
      category: "label" as ItemCategory,
      label,
      description: `Verify the presence of: ${expectedValues.join(", ")}`,
      expectedValues,
      verificationStatus: "unchecked" as VerificationStatus,
      isRequired: true,
      afmanReference: "AFMAN 24-604",
      imagePath: getLabelImagePath(label),
    })
  );
};

// Helper function to map label names to their image paths
const getLabelImagePath = (labelName: string): any => {
  const normalizedLabel = labelName.toLowerCase().trim();

  // if (normalizedLabel === "primary hazard") {
  //   return require("../../../assets/hazmatPngs/primaryHazardLabels/hazardClass4/dangerousWhenWetHazmatClass4.3.png");
  // }

  if (normalizedLabel === "cargo aircraft only") {
    return require("../../../assets/hazmatPngs/cargoAircraftOnly.png");
  }

  return null;
};

export default function InspectorPackageVerificationScreen({
  navigation,
}: InspectorPackageVerificationScreenProps) {
  const {
    inspection,
    workflow,
    inspectionId,
    addPackageFrustration,
    removePackageFrustration,
    completeReinspection,
    updateReinspectedInspection,
    startNewInspection,
  } = useInspectionForm();
  const { actions } = useHazProStore();
  const [sections, setSections] = useState<VerificationSection[]>([]);
  const [detailsModalVisible, setDetailsModalVisible] = useState<string | null>(
    null
  );

  // Reinspection mode tracking
  const reinspectionState = workflow.reinspection;
  const isReinspectionMode = reinspectionState.mode === "package";

  // Set the active chevron to "Package" when this screen mounts
  useEffect(() => {
    actions.setCurrentChevron("package");
  }, []);

  useEffect(() => {
    // Only run on initial mount to set up both markings and labels
    try {
      const unIdNo =
        inspection.verificationCopy?.unIdNo ||
        inspection.extractedContent?.unIdNo;
      let markingItems: PackageVerificationItem[] = [];
      let labelItems: PackageVerificationItem[] = [];

      // Check if this is UN1845 (dry ice)
      if (unIdNo === "UN1845") {
        console.log("🧊 Detected UN1845 - using dry ice specific markings");

        // Special handling for UN1845 dry ice markings per AFMAN24-604 A14.4.8.4
        markingItems = [
          {
            id: "dry-ice-name",
            category: "marking",
            label: "Dry Ice Name",
            description:
              'Package must be marked with "DRY ICE" or "CARBON DIOXIDE SOLID"',
            expectedValues: ["DRY ICE", "CARBON DIOXIDE SOLID"],
            verificationStatus: "unchecked",
            isRequired: true,
            afmanReference: "AFMAN 24-604 A14.4.8.4",
          },
          {
            id: "un1845-number",
            category: "marking",
            label: "UN Number",
            description: 'Package must be marked with "UN1845"',
            expectedValues: ["UN1845"],
            verificationStatus: "unchecked",
            isRequired: true,
            afmanReference: "AFMAN 24-604 A14.4.8.4",
          },
          {
            id: "dry-ice-mass",
            category: "marking",
            label: "Net Mass",
            description: "Package must show the net mass of dry ice in kg",
            expectedValues: ["Net mass in kg"],
            verificationStatus: "unchecked",
            isRequired: true,
            afmanReference: "AFMAN 24-604 A14.4.8.4",
          },
        ];

        console.log("🧊 Generated 3 dry ice specific markings");
      } else {
        // Standard marking requirements for non-dry ice shipments
        const requiredMarkingsForInspection =
          evaluateMarkingRequirementsInspector(inspection);
        console.log(
          "?>? requiredMarkingsForInspection: ",
          JSON.stringify(requiredMarkingsForInspection, null, 2)
        );

        markingItems = convertMarkingsToItems(requiredMarkingsForInspection);
      }

      // Get labeling requirements
      const requiredLabelsForInspection =
        evaluateLabelingRequirements(inspection);
      console.log(
        "?>? requiredLabelsForInspection: ",
        JSON.stringify(requiredLabelsForInspection, null, 2)
      );

      labelItems = convertLabelsToItems(requiredLabelsForInspection);

      // Apply reinspection filtering if needed
      if (
        isReinspectionMode &&
        reinspectionState.targetFrustrations.length > 0
      ) {
        markingItems = markingItems.filter(item =>
          reinspectionState.targetFrustrations.includes(item.id)
        );
        labelItems = labelItems.filter(item =>
          reinspectionState.targetFrustrations.includes(item.id)
        );
        console.log(
          `🔄 [VerificationScreen] Reinspection mode: showing ${
            markingItems.length + labelItems.length
          } items`
        );
      }

      // Build sections array (only include sections with items)
      const newSections: VerificationSection[] = [];

      if (markingItems.length > 0) {
        newSections.push({
          title: "MARKINGS",
          icon: "label",
          category: "marking",
          data: markingItems,
        });
      }

      if (labelItems.length > 0) {
        newSections.push({
          title: "LABELS",
          icon: "local-offer",
          category: "label",
          data: labelItems,
        });
      }

      setSections(newSections);
    } catch (error) {
      console.error("Failed to determine package verification items:", error);
      setSections([]);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleVerificationToggle = (
    itemId: string,
    status: VerificationStatus,
    item: PackageVerificationItem
  ) => {
    console.log(
      "🔘 [VerificationScreen] handleVerificationToggle called:",
      itemId,
      status
    );

    // Handle frustration logic
    if (status === "frustrated") {
      const frustrationData = {
        category: item.category,
        itemId: itemId,
        itemLabel: item.label,
        expectedValues: item.expectedValues,
        verificationStatus: "missing" as const,
        defaultMessage: `Required package ${item.category} is missing from the package`,
        additionalComments: undefined,
        afmanReference: item.afmanReference,
      };

      console.log(
        `📦 [VerificationScreen] Creating frustration for ${item.category}:`,
        itemId
      );
      addPackageFrustration(frustrationData);
    } else if (status === "validated") {
      console.log(
        `📦 [VerificationScreen] Removing frustration for ${item.category}:`,
        itemId
      );
      removePackageFrustration(itemId);
    }

    // Update the local state
    setSections(prevSections =>
      prevSections.map(section => ({
        ...section,
        data: section.data.map(dataItem =>
          dataItem.id === itemId
            ? { ...dataItem, verificationStatus: status }
            : dataItem
        ),
      }))
    );
  };

  const showDetailsModal = (itemId: string) => {
    setDetailsModalVisible(itemId);
  };

  const hideDetailsModal = () => {
    setDetailsModalVisible(null);
  };

  const getStatusIcon = (status: VerificationStatus) => {
    switch (status) {
      case "validated":
        return { name: "check-circle", color: "#34C759" };
      case "frustrated":
        return { name: "cancel", color: "#FF3B30" };
      default:
        return { name: "check-circle", color: "#34C759" };
    }
  };

  // Calculate overall progress
  const allItems = sections.flatMap(section => section.data);
  const allRequiredItemsSelected = allItems
    .filter(item => item.isRequired)
    .every(
      item =>
        item.verificationStatus === "validated" ||
        item.verificationStatus === "frustrated"
    );

  const handleContinue = async () => {
    const isReinspectionMode = workflow.reinspection.mode === "package";

    if (isReinspectionMode) {
      console.log(
        "📦 [VerificationScreen] Reinspection mode - updating inspection"
      );

      if (!inspectionId) {
        Alert.alert("Error", "Unable to find inspection ID");
        return;
      }

      const result = await updateReinspectedInspection();

      if (!result.success) {
        Alert.alert("Error", result.error || "Failed to save reinspection");
        return;
      }

      completeReinspection();

      // Check if there are remaining package frustrations
      const remainingPackageFrustrations =
        inspection.packageFrustrations.length;

      if (remainingPackageFrustrations > 0) {
        navigation.navigate("PackageFrustrationSummary");
      } else {
        Alert.alert(
          "Reinspection Complete",
          "All package frustrations have been resolved. This inspection is now verified.",
          [
            {
              text: "OK",
              onPress: () => {
                startNewInspection();
                navigation.navigate("InspectorHomeScreen");
              },
            },
          ]
        );
      }
      return;
    }

    // Normal mode - check for special UN IDs
    const unIdNo =
      inspection.verificationCopy?.unIdNo ||
      inspection.extractedContent?.unIdNo;

    // Special UN IDs that skip POP marking or have unique workflows
    if (
      unIdNo === "UN1845" ||
      unIdNo === "UN2807" ||
      unIdNo === "UN3072" ||
      unIdNo === "UN2990" ||
      unIdNo === "UN3363"
    ) {
      // For these materials, navigate directly to Package Frustration Summary
      // These materials have no POP marking requirements or are exempt from UN specification packaging
      navigation.navigate("PackageFrustrationSummary");
    } else {
      // For standard shipments, proceed to POP marking method selection
      navigation.navigate("InspectorPOPMethodSelectionScreen");
    }
  };

  const renderItemCard = ({ item }: { item: PackageVerificationItem }) => {
    const statusIcon = getStatusIcon(item.verificationStatus);

    // Check if this is the MSL card (should only show title)
    const isMSLCard =
      item.label === "Military Shipping Label (MSL) or DD Form 1387";

    // Determine background color based on status
    let backgroundColor = "#FFFFFF";
    let borderColor = "#E5E5EA";

    if (item.verificationStatus === "validated") {
      backgroundColor = "#F0FFF4";
      borderColor = statusIcon.color;
    } else if (item.verificationStatus === "frustrated") {
      backgroundColor = "#FFF5F5";
      borderColor = statusIcon.color;
    }

    const borderLeftColor = item.category === "marking" ? "#FF3B30" : "#007AFF";

    return (
      <TouchableOpacity
        onLongPress={() => showDetailsModal(item.id)}
        style={[
          styles.quickActionCard,
          { borderLeftColor },
          { borderColor, backgroundColor },
        ]}
        activeOpacity={0.95}
      >
        <View style={styles.cardRowLayout}>
          {/* Left Section: Title + Value */}
          <View style={styles.cardTextSection}>
            <Text style={styles.cardTitle}>{item.label}</Text>
            {/* Only show expected values if NOT the MSL card */}
            {!isMSLCard &&
              item.expectedValues.map((value, index) => (
                <View key={index} style={styles.expectedValueChip}>
                  <Text style={styles.expectedValueText}>{value}</Text>
                </View>
              ))}
          </View>

          {/* Center Section: Label Image (if available) */}
          {item.imagePath && (
            <View style={styles.cardImageSection}>
              <Image
                source={item.imagePath}
                style={styles.labelImageCompact}
                resizeMode="contain"
              />
            </View>
          )}

          {/* Right Section: Buttons Side-by-Side */}
          <View style={styles.cardButtonSection}>
            <TouchableOpacity
              style={[
                styles.quickActionButton,
                styles.validatedButton,
                item.verificationStatus === "validated" &&
                  styles.validatedButtonActive,
              ]}
              onPress={() => {
                console.log("✅ Validated button pressed for:", item.id);
                handleVerificationToggle(item.id, "validated", item);
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="check"
                size={24}
                color={
                  item.verificationStatus === "validated"
                    ? "#FFFFFF"
                    : "#34C759"
                }
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.quickActionButton,
                styles.frustratedButton,
                item.verificationStatus === "frustrated" &&
                  styles.frustratedButtonActive,
              ]}
              onPress={() => {
                console.log("❌ Frustrated button pressed for:", item.id);
                handleVerificationToggle(item.id, "frustrated", item);
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons
                name="close"
                size={24}
                color={
                  item.verificationStatus === "frustrated"
                    ? "#FFFFFF"
                    : "#FF3B30"
                }
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderSectionHeader = ({
    section,
  }: {
    section: VerificationSection;
  }) => {
    const completedCount = section.data.filter(
      item =>
        item.verificationStatus === "validated" ||
        item.verificationStatus === "frustrated"
    ).length;
    const totalCount = section.data.length;

    return (
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderLeft}>
          <MaterialIcons name={section.icon as any} size={20} color="#1D1D1F" />
          <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
        </View>
        <View style={styles.sectionHeaderBadge}>
          <Text style={styles.sectionHeaderBadgeText}>
            {completedCount}/{totalCount}
          </Text>
        </View>
      </View>
    );
  };

  const renderDetailsModal = () => {
    if (!detailsModalVisible) return null;

    const item = allItems.find(i => i.id === detailsModalVisible);
    if (!item) return null;

    return (
      <View style={styles.modalOverlay}>
        <View style={styles.detailsModal}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{item.label}</Text>
            <TouchableOpacity onPress={hideDetailsModal}>
              <MaterialIcons name="close" size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            <Text style={styles.modalDescription}>{item.description}</Text>

            {/* Expected Values in Modal */}
            <View style={styles.modalExpectedValuesContainer}>
              <Text style={styles.modalExpectedValuesTitle}>
                Expected Values:
              </Text>
              {item.expectedValues.map((value, index) => (
                <View key={index} style={styles.modalExpectedValueItem}>
                  <MaterialIcons
                    name={item.category === "label" ? "local-offer" : "label"}
                    size={16}
                    color="#2196F3"
                  />
                  <Text style={styles.modalExpectedValueText}>{value}</Text>
                </View>
              ))}
            </View>

            {item.afmanReference && (
              <View style={styles.modalReferenceContainer}>
                <MaterialIcons name="book" size={16} color="#007AFF" />
                <Text style={styles.modalReferenceText}>
                  {item.afmanReference}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={hideDetailsModal}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Package Verification</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.cameraButton}
            onPress={() => {
              // Navigate to ML Detection Screen for AI-powered label scanning
              navigation.navigate("MLDetectionScreen");
            }}
          >
            <View style={styles.cameraButtonContent}>
              <MaterialIcons name="camera-alt" size={22} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="help-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Content */}
      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={renderItemCard}
        renderSectionHeader={renderSectionHeader}
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={true}
      />

      {/* Details Modal */}
      {renderDetailsModal()}

      {/* Footer Actions */}
      <View style={styles.footer}>
        {/* Left: Cancel Button */}
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <MaterialIcons name="arrow-back" size={20} color="#007AFF" />
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>

        {/* Center: Save & Exit Button */}
        <TouchableOpacity
          style={styles.saveExitButton}
          onPress={() => {
            Alert.alert(
              "Save Progress",
              "Your verification progress has been saved.",
              [{ text: "OK" }]
            );
          }}
        >
          <MaterialIcons name="save" size={20} color="#ffffff" />
          <Text style={styles.saveExitButtonText}>Save & Exit</Text>
        </TouchableOpacity>

        {/* Right: Continue Button */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !allRequiredItemsSelected && styles.primaryButtonDisabled,
          ]}
          onPress={allRequiredItemsSelected ? handleContinue : undefined}
          disabled={!allRequiredItemsSelected}
        >
          <Text
            style={[
              styles.primaryButtonText,
              !allRequiredItemsSelected && styles.primaryButtonTextDisabled,
            ]}
          >
            Continue
          </Text>
          <MaterialIcons
            name="arrow-forward"
            size={20}
            color={allRequiredItemsSelected ? "#FFFFFF" : "#8E8E93"}
          />
        </TouchableOpacity>
      </View>
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
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
    textAlign: "center",
    marginHorizontal: 16,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cameraButton: {
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  cameraButtonContent: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 40,
    minHeight: 40,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sectionHeaderTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D1D1F",
    letterSpacing: 0.5,
  },
  sectionHeaderBadge: {
    backgroundColor: "#E5E5EA",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  sectionHeaderBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#3C3C43",
  },
  quickActionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: "#E5E5EA",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    overflow: "hidden",
  },
  cardRowLayout: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    minHeight: 90,
    gap: 16,
  },
  cardTextSection: {
    flex: 1,
    justifyContent: "center",
    gap: 8,
  },
  cardImageSection: {
    width: 110,
    height: 110,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
  },
  labelImageCompact: {
    width: 100,
    height: 100,
  },
  cardButtonSection: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  expectedValueChip: {
    backgroundColor: "#F2F2F7",
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
    borderWidth: 1,
    borderColor: "#D1D1D6",
  },
  expectedValueText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#3C3C43",
  },
  quickActionButton: {
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    borderWidth: 2,
  },
  validatedButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#34C759",
  },
  validatedButtonActive: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
    shadowColor: "#34C759",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  frustratedButton: {
    backgroundColor: "#FFFFFF",
    borderColor: "#FF3B30",
  },
  frustratedButtonActive: {
    backgroundColor: "#FF3B30",
    borderColor: "#FF3B30",
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 5,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  detailsModal: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    margin: 20,
    maxHeight: "70%",
    width: "90%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1D1D1F",
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    color: "#3C3C43",
    lineHeight: 22,
    marginBottom: 16,
  },
  modalExpectedValuesContainer: {
    marginBottom: 16,
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 8,
  },
  modalExpectedValuesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
  },
  modalExpectedValueItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E5EA",
  },
  modalExpectedValueText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "500",
    color: "#1D1D1F",
  },
  modalReferenceContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  modalReferenceText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "500",
  },
  modalActions: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  modalCloseButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  modalCloseButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  packageVisualContainer: {
    position: "absolute",
    right: 16,
    top: 215,
    width: 180,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  packageVisualTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E8E93",
    marginBottom: 12,
    textAlign: "center",
  },
  packageVisual: {
    alignItems: "center",
  },
  packageBox: {
    width: 120,
    height: 120,
    position: "relative",
    marginBottom: 16,
  },
  packageTop: {
    position: "absolute",
    top: 0,
    left: 20,
    width: 80,
    height: 30,
    backgroundColor: "#F2F2F7",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    transform: [{ skewY: "-15deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  packageFront: {
    position: "absolute",
    top: 25,
    left: 20,
    width: 80,
    height: 80,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    alignItems: "center",
    justifyContent: "center",
  },
  packageSide: {
    position: "absolute",
    top: 20,
    left: 95,
    width: 25,
    height: 80,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    transform: [{ skewY: "15deg" }],
    alignItems: "center",
    justifyContent: "center",
  },
  packageFaceLabel: {
    fontSize: 8,
    fontWeight: "600",
    color: "#8E8E93",
  },
  indicatorMarking: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  indicatorLabel: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  packageLegend: {
    width: "100%",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: "#8E8E93",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
    flexDirection: "row",
    gap: 4,
  },
  cancelButtonText: {
    color: "#007AFF",
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
    flexDirection: "row",
    gap: 6,
  },
  saveExitButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
    flexDirection: "row",
    gap: 6,
  },
  primaryButtonDisabled: {
    backgroundColor: "#F2F2F7",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButtonTextDisabled: {
    color: "#8E8E93",
  },
});
