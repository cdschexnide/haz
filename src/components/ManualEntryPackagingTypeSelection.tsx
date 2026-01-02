import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import {
  PackagingParagraphEntry,
  PackagingOption,
} from "@/types/packagingStructure";
import {
  getPackagingTypeLabel,
  isInnerPackagingRequired,
  getAllNotesForOption,
} from "@/utils/packagingWizardV2Helpers";
import { isSinglePackagingProhibited } from "@/utils/specialProvisionsHelpers";
import React, { useState, useMemo } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Icon } from "react-native-elements";
import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import PackagingTypeCard from "./PackagingWizardV2/PackagingTypeCard";

const ManualEntryPackagingTypeSelectionScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedPackagingOptionId, setSelectedPackagingOptionId] = useState<
    string | null
  >(null);

  // Get packaging data from packagingDatabaseV2 (same as PackagingWizardV2)
  const packagingParagraphId =
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;

  const packagingData: PackagingParagraphEntry | null = useMemo(() => {
    if (!packagingParagraphId) return null;
    return packagingDatabaseV2[packagingParagraphId] || null;
  }, [packagingParagraphId]);

  // Get available packaging options
  const availablePackagingOptions = useMemo<PackagingOption[]>(() => {
    if (!packagingData) return [];
    return packagingData.packagingOptions || [];
  }, [packagingData]);

  const handleSelectPackagingType = (optionId: string): void => {
    setSelectedPackagingOptionId(optionId);

    // Update store - Initialize packaging object if it doesn't exist
    const option = availablePackagingOptions.find(opt => opt.id === optionId);
    if (store.hazProPreparerContext && option) {
      if (!store.hazProPreparerContext.packaging) {
        store.hazProPreparerContext.packaging = {};
      }
      store.hazProPreparerContext.packaging.packagingType = option.type as any;
      store.hazProPreparerContext.packaging.selectedPackagingOptionId =
        optionId;
    }
  };

  // Helper function to compute allowable packing groups (same logic as PackagingWizardV2)
  const allowablePackingGroups = (): string[] => {
    const hazardClass4ParagraphsWithNoPackingGroup = [
      "A8.6.",
      "A8.7.",
      "A8.8.",
    ];
    const packagingParagraphValuesThatRequirePGIPackaging = [
      "A12.9.",
      "A12.11.",
    ];
    const userPackingGroup =
      state.hazProPreparerContext.allowablePackingGroups || "";

    if (
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph &&
      hazardClass4ParagraphsWithNoPackingGroup.includes(
        state.hazProPreparerContext.hazardousMaterial?.packagingParagraph
      )
    ) {
      return ["X", "Y"];
    }
    if (
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph &&
      packagingParagraphValuesThatRequirePGIPackaging.includes(
        state.hazProPreparerContext.hazardousMaterial?.packagingParagraph
      )
    ) {
      return ["X"];
    }
    const map: Record<string, string[]> = {
      I: ["X"],
      II: ["X", "Y"],
      III: ["X", "Y", "Z"],
      "I II": ["X", "Y"],
      "II III": ["Y", "Z"],
      "I II III": ["X", "Y", "Z"],
    };
    return map[userPackingGroup] || [];
  };

  // Initialize POP fields before navigating (same logic as PackagingWizardV2.confirmPopFields)
  const confirmPopFields = (): void => {
    const packingGroupChoices = allowablePackingGroups();

    if (store.hazProPreparerContext.packaging) {
      if (!store.hazProPreparerContext.packaging.inputPOPMarking) {
        store.hazProPreparerContext.packaging.inputPOPMarking = {
          A: null,
          B: null,
          C: null,
          D: null,
          E: null,
          F: null,
          G: null,
          H: null,
        };
      }
      store.hazProPreparerContext.packaging.inputPOPMarking.A = "UN";
    }
  };

  const handleSaveAndExit = () => {
    try {
      saveCurrentShipment("in-progress");
      navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (error) {
      console.error("Failed to save shipment:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066cc" />
                <Text style={styles.loadingText}>Loading…</Text>
              </View>
            ) : !packagingData ? (
              <View style={styles.errorContainer}>
                <Icon name="error" size={48} color="#dc3545" />
                <Text style={styles.errorText}>
                  No packaging data found for this material.
                </Text>
                <Text style={styles.errorSubtext}>
                  Paragraph ID: {packagingParagraphId || "Not specified"}
                </Text>
              </View>
            ) : (
              <View style={styles.stepContainer}>
                <Text style={styles.stepTitle}>Select Packaging Type</Text>
                <Text style={styles.stepDescription}>
                  {packagingData.description}
                </Text>

                {availablePackagingOptions.map((option: PackagingOption) => {
                  const isSinglePackaging = option.type === "single";
                  const singlePackagingProhibited = isSinglePackagingProhibited(
                    state.hazProPreparerContext.specialProvisionsMap
                  );
                  const isDisabled =
                    isSinglePackaging && singlePackagingProhibited;
                  const disabledReason = isDisabled
                    ? state.hazProPreparerContext.specialProvisionsMap?.["A2"]
                    : undefined;

                  return (
                    <PackagingTypeCard
                      key={option.id}
                      type={option.type}
                      label={getPackagingTypeLabel(option.type)}
                      description={option.description}
                      innerRequired={isInnerPackagingRequired(option)}
                      noteCount={getAllNotesForOption(option).length}
                      selected={selectedPackagingOptionId === option.id}
                      disabled={isDisabled}
                      disabledReason={disabledReason}
                      onPress={() => handleSelectPackagingType(option.id)}
                    />
                  );
                })}
              </View>
            )}
          </ScrollView>

          <View style={styles.footerContainer}>
            <View style={styles.footerButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  if (store.hazProPreparerContext?.packaging) {
                    store.hazProPreparerContext.packaging.packagingType = null;
                  }
                  navigation.goBack();
                }}
                accessibilityLabel="Cancel and go back"
                accessibilityRole="button"
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveExitButton}
                onPress={handleSaveAndExit}
                accessibilityLabel="Save progress and exit to home screen"
                accessibilityRole="button"
              >
                <Text style={styles.buttonText}>Save & Exit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.continueButton,
                  selectedPackagingOptionId === null && styles.disabledButton,
                ]}
                onPress={() => {
                  confirmPopFields();
                  navigation.navigate("POPMarkingDataEntry");
                }}
                disabled={selectedPackagingOptionId === null}
                accessibilityLabel="Continue to POP marking data entry"
                accessibilityRole="button"
                accessibilityState={{
                  disabled: selectedPackagingOptionId === null,
                }}
              >
                <Text style={styles.buttonText}>Save & Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ManualEntryPackagingTypeSelectionScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    paddingBottom: 16,
  },
  stepContainer: {
    padding: 12,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 12,
  },
  stepDescription: {
    fontSize: 14,
    color: "#6c757d",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  loadingText: {
    fontSize: 14,
    color: "#6c757d",
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200,
  },
  errorText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#dc3545",
    marginTop: 12,
    textAlign: "center",
  },
  errorSubtext: {
    fontSize: 13,
    color: "#6c757d",
    marginTop: 8,
    textAlign: "center",
  },
  optionCard: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#ffffff",
    padding: 12,
  },
  selectedCard: {
    borderColor: "#0066cc",
    borderWidth: 1,
    backgroundColor: "#e6f0ff",
  },
  disabledCard: {
    borderColor: "#dee2e6",
    backgroundColor: "#f2f2f2",
  },
  optionCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextContainer: {
    flex: 1,
  },
  optionCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  optionCardDescription: {
    fontSize: 13,
    color: "#6c757d",
  },
  selectedCardText: {
    color: "#0066cc",
  },
  selectedCardDesc: {
    color: "#212529",
  },
  disabledCardText: {
    color: "#999999",
  },
  cardCheckMark: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0066cc",
    marginLeft: 8,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#e9ecef",
    backgroundColor: "#ffffff",
    padding: 16,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  continueButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
  },
});
