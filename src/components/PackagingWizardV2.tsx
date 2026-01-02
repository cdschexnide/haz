import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import {
  Container,
  PackagingCategory,
  PackagingOption,
  PackagingParagraphEntry,
} from "@/types/packagingStructure";
import {
  filterAvailableContainers,
  formatCategoryType,
  getAllNotesForOption,
  getApplicableRestrictions,
  getApplicableSpecialRequirements,
  getCategoryMaterialsPreview,
  getCategoryRestrictionMessages,
  getContainerRestrictionDescription,
  getPackagingTypeLabel,
  groupContainersByMaterial,
  hasContainerRestrictions,
  isCategoryFullyProhibited,
  isContainerProhibited,
  isInnerPackagingRequired,
} from "@/utils/packagingWizardV2Helpers";
import { isSinglePackagingProhibited } from "@/utils/specialProvisionsHelpers";
import React, { JSX, useCallback, useEffect, useMemo, useState } from "react";
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
import ExampleSolidPopMarking from "./ExampleSolidPopMarking";
import Breadcrumb from "./PackagingWizardV2/Breadcrumb";
import ContainerCodeCard from "./PackagingWizardV2/ContainerCodeCard";
import NotesModal from "./PackagingWizardV2/NotesModal";
import PackagingTypeCard from "./PackagingWizardV2/PackagingTypeCard";
import ExampleLiquidPopMarking from "./ExampleLiquidPopMarking";
import PackagingCategoryQuadrant from "./PackagingWizardV2/PackagingCategoryQuadrant";
import RestrictionMessagesModal from "./PackagingWizardV2/RestrictionMessagesModal";

const theme = {
  colors: {
    primary: "#0066cc",
    primaryLight: "#e6f0ff",
    primaryDark: "#0056b3",
    secondary: "#6c757d",
    success: "#28a745",
    danger: "#dc3545",
    warning: "#ffc107",
    info: "#17a2b8",
    light: "#f8f9fa",
    dark: "#343a40",
    white: "#ffffff",
    border: "#dee2e6",
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      muted: "#999999",
    },
    background: {
      main: "#f8f9fa",
      card: "#ffffff",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  borderRadius: {
    sm: 2,
    md: 4,
    lg: 8,
    circle: 9999,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: "700" as const },
    h2: { fontSize: 22, fontWeight: "700" as const },
    h3: { fontSize: 18, fontWeight: "700" as const },
    h4: { fontSize: 16, fontWeight: "600" as const },
    body: { fontSize: 14 },
    small: { fontSize: 13 },
    tiny: { fontSize: 12 },
  },
};

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
}

interface NavigationFooterProps {
  canGoBack: boolean;
  canContinue: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveExit: () => void;
}

const NavigationFooter: React.FC<NavigationFooterProps> = ({
  canGoBack,
  canContinue,
  isLastStep,
  onBack,
  onNext,
  onSaveExit,
}) => (
  <View style={styles.footerContainer}>
    <View style={styles.footerButtons}>
      {canGoBack ? (
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityLabel="Go back to previous step"
          accessibilityRole="button"
        >
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ flex: 1, marginRight: 8 }} />
      )}

      <TouchableOpacity
        style={styles.saveExitButton}
        activeOpacity={0.8}
        onPress={onSaveExit}
        accessibilityLabel="Save progress and exit to home screen"
        accessibilityRole="button"
      >
        <Text style={styles.buttonText}>Save & Exit</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.nextButton, !canContinue && styles.disabledButton]}
        onPress={onNext}
        disabled={!canContinue}
        activeOpacity={0.8}
        accessibilityLabel={
          isLastStep ? "Finish and continue" : "Continue to next step"
        }
        accessibilityRole="button"
        accessibilityState={{ disabled: !canContinue }}
      >
        <Text
          style={[styles.buttonText, !canContinue && styles.disabledButtonText]}
        >
          {isLastStep ? "Finish" : "Next"}
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

interface PackagingWizardV2Props {
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const PackagingWizardV2 = ({ navigation }: PackagingWizardV2Props) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  const [step, setStep] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [selectedPackagingOptionId, setSelectedPackagingOptionId] = useState<
    string | null
  >(null);
  const [selectedCategoryType, setSelectedCategoryType] = useState<
    string | null
  >(null);
  const [selectedContainerCode, setSelectedContainerCode] = useState<
    string | null
  >(state.hazProPreparerContext.shipment?.selectedOuterPackaging || null);
  const [selectedContainerIndex, setSelectedContainerIndex] = useState<
    number | null
  >(null);
  const [hasSeenNotes, setHasSeenNotes] = useState<boolean>(false);
  const [showNotesModal, setShowNotesModal] = useState<boolean>(false);
  const [hasSeenSpecialRequirements, setHasSeenSpecialRequirements] =
    useState<boolean>(false);
  const [showSpecialRequirementsModal, setShowSpecialRequirementsModal] =
    useState<boolean>(false);
  const [showRestrictionModal, setShowRestrictionModal] = useState<{
    category: PackagingCategory | null;
    messages: string[];
  }>({ category: null, messages: [] });

  // Get packaging data from packagingDatabaseV2
  const packagingParagraphId =
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;

  const packagingData: PackagingParagraphEntry | null = useMemo(() => {
    if (!packagingParagraphId) return null;
    return packagingDatabaseV2[packagingParagraphId] || null;
  }, [packagingParagraphId]);

  // Get user's packing group
  const userPackingGroup =
    state.hazProPreparerContext.allowablePackingGroups || "";

  // Compute packing group choices
  const allowablePackingGroups = useCallback((): string[] => {
    const hazardClass4ParagraphsWithNoPackingGroup = [
      "A8.6.",
      "A8.7.",
      "A8.8.",
    ];
    const packagingParagraphValuesThatRequirePGIPackaging = [
      "A12.9.",
      "A12.11.",
    ];
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
  }, [userPackingGroup]);

  const packingGroupChoices: string[] = allowablePackingGroups();

  // Get available packaging options
  const availablePackagingOptions = useMemo<PackagingOption[]>(() => {
    if (!packagingData) return [];
    return packagingData.packagingOptions || [];
  }, [packagingData]);

  // Get selected packaging option
  const selectedPackagingOption = useMemo<PackagingOption | null>(() => {
    if (!selectedPackagingOptionId) return null;
    return (
      availablePackagingOptions.find(
        opt => opt.id === selectedPackagingOptionId
      ) || null
    );
  }, [selectedPackagingOptionId, availablePackagingOptions]);

  // Get available categories from selected option
  const availableCategories = useMemo<PackagingCategory[]>(() => {
    if (!selectedPackagingOption) return [];
    return selectedPackagingOption.outerPackaging?.categories || [];
  }, [selectedPackagingOption]);

  // Get selected category
  const selectedCategory = useMemo<PackagingCategory | null>(() => {
    if (!selectedCategoryType) return null;
    return (
      availableCategories.find(cat => cat.type === selectedCategoryType) || null
    );
  }, [selectedCategoryType, availableCategories]);

  // Get applicable restrictions
  const applicableRestrictions = useMemo(() => {
    if (!packagingData || !packagingData.packingGroupRestrictions) return [];
    return getApplicableRestrictions(
      userPackingGroup,
      packagingData.packingGroupRestrictions
    );
  }, [packagingData, userPackingGroup]);

  // Get available containers (filtered by packing group)
  const availableContainers = useMemo<Container[]>(() => {
    if (!selectedCategory) return [];
    return filterAvailableContainers(
      selectedCategory.containers,
      userPackingGroup,
      applicableRestrictions
    );
  }, [selectedCategory, userPackingGroup, applicableRestrictions]);

  // Get applicable special requirements
  const applicableSpecialRequirements = useMemo(() => {
    if (!packagingData || !packagingData.specialRequirements) return [];
    return getApplicableSpecialRequirements(
      selectedPackagingOption,
      packagingData.specialRequirements
    );
  }, [packagingData, selectedPackagingOption]);

  // Handler functions
  const handleSelectPackagingType = (optionId: string): void => {
    setSelectedPackagingOptionId(optionId);
    setSelectedCategoryType(null);
    setSelectedContainerCode(null);
    setSelectedContainerIndex(null);

    // Update store
    const option = availablePackagingOptions.find(opt => opt.id === optionId);
    if (store.hazProPreparerContext.packaging && option) {
      store.hazProPreparerContext.packaging.packagingType = option.type as any;
    }
  };

  const handleSelectCategory = (categoryType: string): void => {
    setSelectedCategoryType(categoryType);
    setSelectedContainerCode(null);
    setSelectedContainerIndex(null);
    setHasSeenNotes(false);
  };

  const handleSelectPackagingCode = (
    code: string,
    containerIndex?: number
  ): void => {
    setSelectedContainerCode(code);
    setSelectedContainerIndex(containerIndex ?? null);

    // Update store
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.selectedOuterPackaging = code;
    }
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
      store.hazProPreparerContext.packaging.inputPOPMarking.B = code;
    }
  };

  const confirmPopFields = (): void => {
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

  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return selectedPackagingOptionId !== null;
      case 1:
        return selectedCategoryType !== null;
      case 2:
        return selectedContainerCode !== null;
      default:
        return false;
    }
  };

  const handleNext = (): void => {
    if (step < 2) {
      const nextStep = step + 1;
      setStep(nextStep);
      store.hazProPreparerContext.packagingWizardStep = nextStep;
      return;
    } else {
      confirmPopFields();
      // Persist selected packaging option ID for InnerPackagingWizard
      if (store.hazProPreparerContext.packaging && selectedPackagingOptionId) {
        store.hazProPreparerContext.packaging.selectedPackagingOptionId =
          selectedPackagingOptionId;
      }
      if (store.hazProPreparerContext) {
        store.hazProPreparerContext.completedSubsteps = [
          ...completedSubsteps,
          "PackagingWizard",
        ];
      }
      store.hazProPreparerContext.packagingWizardStep = 0;
      navigation.navigate("POPMarkingDataEntry");
    }
  };

  const handleBack = (): void => {
    if (step > 0) {
      const prevStep = step - 1;
      setStep(prevStep);
      store.hazProPreparerContext.packagingWizardStep = prevStep;
    } else {
      navigation.goBack();
    }
  };

  const handleSaveExit = async (): Promise<void> => {
    try {
      if (store.hazProPreparerContext) {
        store.hazProPreparerContext.packagingWizardStep = step;
        store.hazProPreparerContext.activeStep = 2;
      }
      await saveCurrentShipment("in-progress");
      navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (error) {
      console.error("Failed to save shipment:", error);
      navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
    }
  };

  useEffect(() => {
    const savedStep = state.hazProPreparerContext.packagingWizardStep;
    if (typeof savedStep === "number" && savedStep >= 0 && savedStep <= 2) {
      setStep(savedStep);
    }
  }, []);

  // Reset hasSeenNotes when packaging option changes
  useEffect(() => {
    setHasSeenNotes(false);
  }, [selectedPackagingOptionId]);

  // Show modal automatically on Step 2 if notes exist and haven't been seen
  useEffect(() => {
    if (step === 2 && selectedPackagingOption) {
      const notes = getAllNotesForOption(selectedPackagingOption);
      if (notes.length > 0 && !hasSeenNotes) {
        setShowNotesModal(true);
      }
    }
  }, [step, selectedPackagingOption, hasSeenNotes]);

  // Reset hasSeenSpecialRequirements when packaging option changes
  useEffect(() => {
    setHasSeenSpecialRequirements(false);
  }, [selectedPackagingOptionId]);

  // Show modal automatically on Step 1 if special requirements exist and haven't been seen
  useEffect(() => {
    if (
      step === 1 &&
      applicableSpecialRequirements.length > 0 &&
      !hasSeenSpecialRequirements
    ) {
      setShowSpecialRequirementsModal(true);
    }
  }, [step, applicableSpecialRequirements, hasSeenSpecialRequirements]);

  const renderStepContent = (): JSX.Element => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>Loading…</Text>
        </View>
      );
    }

    if (!packagingData) {
      return (
        <View style={styles.errorContainer}>
          <Icon name="error" size={48} color={theme.colors.danger} />
          <Text style={styles.errorText}>
            No packaging data found for this material.
          </Text>
          <Text style={styles.errorSubtext}>
            Paragraph ID: {packagingParagraphId || "Not specified"}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.stepContent}>
        {/* STEP 0: Select Packaging Type */}
        {step === 0 && (
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
              const isDisabled = isSinglePackaging && singlePackagingProhibited;
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
                  noteCount={option.notes?.length || 0}
                  selected={selectedPackagingOptionId === option.id}
                  disabled={isDisabled}
                  disabledReason={disabledReason}
                  onPress={() => handleSelectPackagingType(option.id)}
                />
              );
            })}
          </View>
        )}

        {/* STEP 1: Select Container Category */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <Text style={styles.stepTitle}>Select Packaging Container</Text>
              {applicableSpecialRequirements.length > 0 && (
                <TouchableOpacity
                  onPress={() => setShowSpecialRequirementsModal(true)}
                  style={styles.specialRequirementsButton}
                  accessibilityLabel="View special requirements"
                  accessibilityRole="button"
                >
                  <Icon name="info" color="#0066cc" size={20} />
                  <Text style={styles.specialRequirementsButtonText}>
                    Special Requirements
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* Quadrant Grid for Categories */}
            <View style={styles.categoryQuadrantGrid}>
              {availableCategories.map((category: PackagingCategory) => {
                const fullyProhibited = isCategoryFullyProhibited(
                  category,
                  userPackingGroup,
                  applicableRestrictions
                );
                const restrictionMessages = getCategoryRestrictionMessages(
                  category,
                  userPackingGroup,
                  applicableRestrictions
                );

                return (
                  <PackagingCategoryQuadrant
                    key={category.type}
                    category={category}
                    selected={selectedCategoryType === category.type}
                    prohibited={fullyProhibited}
                    restrictionMessages={restrictionMessages}
                    containerCount={category.containers.length}
                    materialsPreview={getCategoryMaterialsPreview(category)}
                    onPress={() => handleSelectCategory(category.type)}
                    onRestrictionPress={() =>
                      setShowRestrictionModal({
                        category,
                        messages: restrictionMessages,
                      })
                    }
                    itemCount={availableCategories.length}
                  />
                );
              })}
            </View>
          </View>
        )}

        {/* STEP 2: Select Packaging Code */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View style={styles.stepTitleRow}>
              <Text style={styles.stepTitle}>Select Packaging Code</Text>
              {selectedPackagingOption &&
                getAllNotesForOption(selectedPackagingOption).length > 0 && (
                  <TouchableOpacity
                    onPress={() => setShowNotesModal(true)}
                    style={styles.infoButton}
                    accessibilityLabel="View important requirements"
                    accessibilityRole="button"
                  >
                    <Icon name="info" color={theme.colors.warning} size={20} />
                    <Text style={styles.infoButtonText}>Important Notes</Text>
                  </TouchableOpacity>
                )}
            </View>

            {/* Show containers grouped by material */}
            <View style={styles.materialGrid}>
              {selectedCategory &&
                Object.entries(
                  groupContainersByMaterial(selectedCategory.containers)
                ).map(([material, containers]) => {
                  const prohibitedCodes = containers
                    .filter(c =>
                      isContainerProhibited(
                        c.code,
                        userPackingGroup,
                        applicableRestrictions
                      )
                    )
                    .map(c => c.code);

                  const restrictedCodes = containers
                    .filter(c =>
                      hasContainerRestrictions(
                        c.code,
                        userPackingGroup,
                        applicableRestrictions
                      )
                    )
                    .map(c => c.code);

                  return (
                    <ContainerCodeCard
                      key={material}
                      material={material}
                      containers={containers}
                      selectedCode={selectedContainerCode}
                      selectedContainerIndex={selectedContainerIndex}
                      onSelectCode={handleSelectPackagingCode}
                      prohibitedCodes={prohibitedCodes}
                      restrictedCodes={restrictedCodes}
                      getRestrictionDescription={(code: string) =>
                        getContainerRestrictionDescription(
                          code,
                          userPackingGroup,
                          applicableRestrictions
                        )
                      }
                    />
                  );
                })}
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          {/* <StepIndicator currentStep={step} totalSteps={4} /> */}

          <Breadcrumb
            step={step}
            selectedPackagingType={
              selectedPackagingOption
                ? getPackagingTypeLabel(selectedPackagingOption.type)
                : undefined
            }
            selectedCategory={selectedCategoryType || undefined}
            selectedCode={selectedContainerCode || undefined}
          />

          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              step === 1 && availableCategories.length <= 4 && { flexGrow: 1 },
            ]}
            showsVerticalScrollIndicator={true}
            scrollEnabled={step !== 1 || availableCategories.length > 4}
          >
            {renderStepContent()}
          </ScrollView>

          <NavigationFooter
            canGoBack={step > 0}
            canContinue={canContinue()}
            isLastStep={step === 2}
            onBack={handleBack}
            onNext={handleNext}
            onSaveExit={handleSaveExit}
          />
        </View>

        {/* Notes Modal */}
        {selectedPackagingOption && (
          <NotesModal
            visible={showNotesModal}
            title="Important Notes"
            notes={getAllNotesForOption(selectedPackagingOption)}
            onDismiss={() => {
              setShowNotesModal(false);
              setHasSeenNotes(true);
            }}
          />
        )}

        {/* Special Requirements Modal */}
        <NotesModal
          visible={showSpecialRequirementsModal}
          title="Special Requirements"
          notes={applicableSpecialRequirements.map(req => req.description)}
          themeType="info"
          onDismiss={() => {
            setShowSpecialRequirementsModal(false);
            setHasSeenSpecialRequirements(true);
          }}
        />

        {/* Restriction Messages Modal */}
        <RestrictionMessagesModal
          visible={showRestrictionModal.category !== null}
          category={showRestrictionModal.category}
          messages={showRestrictionModal.messages}
          onDismiss={() =>
            setShowRestrictionModal({ category: null, messages: [] })
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PackagingWizardV2;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.main,
  },
  scrollContent: {
    paddingBottom: theme.spacing.lg,
  },
  stepIndicatorContainer: {
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  stepText: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  stepDots: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  stepIndicator: {
    width: 8,
    height: 8,
    borderRadius: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: 3,
  },
  activeStepIndicator: {
    backgroundColor: theme.colors.primary,
  },
  stepContent: {
    flex: 1,
  },
  stepContainer: {
    padding: theme.spacing.md,
  },
  stepTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: theme.spacing.sm,
  },
  stepTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    // marginBottom: 5,
    // marginTop: 5,
    flex: 1,
  },
  infoButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: theme.colors.warning,
    borderRadius: 4,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  infoButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  specialRequirementsButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f4fd",
    borderWidth: 1,
    borderColor: "#0066cc",
    borderRadius: 4,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    marginLeft: theme.spacing.sm,
  },
  specialRequirementsButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.xs,
  },
  stepDescription: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  loadingText: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
  },
  errorText: {
    ...theme.typography.h4,
    color: theme.colors.danger,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  errorSubtext: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    marginTop: theme.spacing.sm,
    textAlign: "center",
  },
  categoryQuadrantGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "flex-start",
    padding: 6,
  },
  optionCard: {
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 1,
    backgroundColor: theme.colors.primaryLight,
  },
  prohibitedCard: {
    backgroundColor: "#ffe6e6",
    borderColor: theme.colors.danger,
    borderWidth: 2,
    opacity: 0.75,
  },
  restrictedCard: {
    borderColor: theme.colors.warning,
    borderWidth: 2,
  },
  optionCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: theme.spacing.md,
  },
  cardTextContainer: {
    flex: 1,
  },
  categoryTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  categoryStatusIcon: {
    marginLeft: theme.spacing.xs,
  },
  optionCardTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
  },
  optionCardDescription: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
  },
  prohibitedText: {
    color: theme.colors.danger,
    textDecorationLine: "line-through",
  },
  prohibitedDescText: {
    color: theme.colors.text.muted,
  },
  availabilityText: {
    fontSize: 12,
    color: theme.colors.warning,
    fontWeight: "600",
    marginTop: theme.spacing.xs,
  },
  selectedCardText: {
    color: theme.colors.primary,
  },
  selectedCardDesc: {
    color: theme.colors.text.primary,
  },
  cardCheckIcon: {
    marginLeft: theme.spacing.sm,
  },
  categoryRestrictionContainer: {
    backgroundColor: "#fff3cd",
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
    padding: theme.spacing.md,
    marginTop: -theme.spacing.sm,
    marginBottom: theme.spacing.sm,
    marginLeft: theme.spacing.xs,
    marginRight: theme.spacing.xs,
  },
  categoryRestrictionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.xs,
  },
  categoryRestrictionIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  categoryRestrictionText: {
    flex: 1,
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
  materialGrid: {
    marginBottom: theme.spacing.md,
  },
  exampleCard: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginTop: theme.spacing.md,
  },
  exampleTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  exampleSubtitle: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  selectionSummary: {
    padding: theme.spacing.lg,
    backgroundColor: "#e6f7ed",
    borderWidth: 1,
    borderColor: theme.colors.success,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.sm,
  },
  summaryValue: {
    fontSize: 15,
    color: theme.colors.text.primary,
    fontWeight: "600",
    lineHeight: 22,
  },
  confirmationCard: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    marginBottom: theme.spacing.md,
  },
  confirmationQuestion: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
    lineHeight: 24,
  },
  highlightedValue: {
    fontWeight: "700",
    color: theme.colors.primary,
    fontSize: 17,
  },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
    gap: 16,
  },
  confirmButton: {
    minHeight: 56,
    minWidth: 120,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl * 1.5,
    borderWidth: 2,
    borderColor: theme.colors.border,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.colors.background.card,
  },
  confirmButtonText: {
    fontSize: 16,
    color: theme.colors.text.primary,
    fontWeight: "700",
  },
  confirmYesSelected: {
    backgroundColor: theme.colors.success,
    borderColor: theme.colors.success,
  },
  confirmYesSelectedText: {
    color: theme.colors.white,
  },
  confirmNoSelected: {
    backgroundColor: theme.colors.danger,
    borderColor: theme.colors.danger,
  },
  confirmNoSelectedText: {
    color: theme.colors.white,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffecb5",
  },
  warningText: {
    ...theme.typography.small,
    color: "#664d03",
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background.card,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.md,
  },
  footerButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "600",
  },
  saveExitButton: {
    flex: 1,
    height: 48,
    backgroundColor: "#6C757D",
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  nextButton: {
    flex: 1,
    height: 48,
    backgroundColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
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
  disabledButtonText: {
    color: "#ffffff",
  },
});
