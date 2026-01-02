import DatabaseErrorDisplay from "@/components/DatabaseErrorDisplay";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import React, { useState } from "react";
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

function StepIndicator({
  currentStep,
  totalSteps,
}: {
  currentStep: number;
  totalSteps: number;
}) {
  return (
    <View style={styles.stepIndicatorContainer}>
      <Text style={styles.stepText}>
        Step {currentStep + 1} of {totalSteps}
      </Text>
      <View style={styles.stepDots}>
        {Array(totalSteps)
          .fill(0)
          .map((_, index) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                index === currentStep && styles.activeStepIndicator,
              ]}
            />
          ))}
      </View>
    </View>
  );
}

function OptionCard({
  title,
  description,
  selected,
  onPress,
  disabled = false,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.optionCard,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${title}${description ? `: ${description}` : ""}${
        disabled ? " (unavailable)" : ""
      }`}
    >
      <View style={styles.optionCardContent}>
        <View style={styles.cardTextContainer}>
          <Text
            style={[
              styles.optionCardTitle,
              selected && styles.selectedCardText,
              disabled && styles.disabledCardText,
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.optionCardDescription,
                selected && styles.selectedCardDesc,
                disabled && styles.disabledCardText,
              ]}
            >
              {description}
            </Text>
          )}
        </View>
        {selected && (
          <Icon
            name="check"
            color={colors.blue}
            size={20}
            style={styles.cardCheckIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
}

function NavigationFooter({
  canGoBack,
  canContinue,
  isLastStep,
  onBack,
  onNext,
  onSaveExit,
  isLoading,
}: {
  canGoBack: boolean;
  canContinue: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
  onSaveExit: () => void;
  isLoading?: boolean;
}) {
  return (
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
          style={[styles.saveExitButton, isLoading && styles.disabledButton]}
          activeOpacity={0.8}
          onPress={onSaveExit}
          disabled={isLoading}
          accessibilityLabel="Save progress and exit to home screen"
          accessibilityRole="button"
        >
          <Icon name="save" color="#fff" size={18} style={{ marginRight: 6 }} />
          <Text style={styles.buttonText}>
            {isLoading ? "Saving..." : "Save & Exit"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.nextButton,
            (!canContinue || isLoading) && styles.disabledButton,
          ]}
          onPress={onNext}
          disabled={!canContinue || isLoading}
          activeOpacity={0.8}
          accessibilityLabel={
            isLastStep ? "Finish and continue" : "Continue to next step"
          }
          accessibilityRole="button"
          accessibilityState={{ disabled: !canContinue || isLoading }}
        >
          <Text
            style={[
              styles.buttonText,
              (!canContinue || isLoading) && styles.disabledButtonText,
            ]}
          >
            {isLastStep ? "Finish" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

type A85PackagingTypeKey =
  | "cylinderPackaging"
  | "combinationPackaging"
  | "singlePackaging"
  | "compositePackagingWithMetalInnerReceptacles";

const A85PackagingWizard = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment, isLoading, error } =
    useHazProStore();

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  // A8.5. packaging instructions
  const a85Instructions: Record<
    A85PackagingTypeKey,
    { label: string; description: string; details: string[] }
  > = {
    cylinderPackaging: {
      label: "Cylinder Packaging",
      description: "Steel or Nickel Cylinders",
      details: [
        "Use steel valve protection caps or collars, or pack in authorized boxes (4C1, 4C2, 4D, 4F, 4G, 4H1, 4H2)",
        "Cylinders must be secured and loaded with pressure relief devices in the vapor space",
      ],
    },
    combinationPackaging: {
      label: "Combination Packaging",
      description: "Glass or Metal inner, various outer",
      details: [
        "No more than four strong, tight metal cans",
        "Inner receptacles must not exceed 1 L (0.3 gal)",
        "Positive screw cap closure with gasket required",
        "Cushion with dry, incombustible absorbent material",
        "Close cans by positive means, not friction",
      ],
    },
    singlePackaging: {
      label: "Single Packaging",
      description: "Metal cans in drums, jerricans, or boxes",
      details: [
        "Inner cans must not exceed 4 L (1 gal)",
        "Closed by positive means, not friction",
        "Each outer package must not exceed 220 L (58 gal)",
      ],
    },
    compositePackagingWithMetalInnerReceptacles: {
      label: "Composite Packaging (Metal Inner)",
      description: "UN1A1 drum (stainless steel) in steel drum",
      details: [
        "10 or 20 L capacity, certified to PG I",
        "Min wall thickness 1.9 mm",
        "4 NPT or VCR openings (6.3 mm)",
        "Sealed with 316 stainless steel closure",
        "Outer: Steel (UN1A2, PG I), max 208 L (55 gal)",
        "No more than two inner drums per outer drum",
      ],
    },
  };

  const packagingTypes: A85PackagingTypeKey[] = [
    "cylinderPackaging",
    "combinationPackaging",
    "singlePackaging",
    "compositePackagingWithMetalInnerReceptacles",
  ];

  const [step, setStep] = useState(0);
  const [selectedType, setSelectedType] = useState<A85PackagingTypeKey | null>(
    null
  );
  const [confirmed, setConfirmed] = useState<boolean | null>(null);

  // Step logic
  const canContinue = () => {
    if (step === 0) return !!selectedType;
    if (step === 1) return confirmed === true;
    return false;
  };

  const handleNext = () => {
    if (step === 0) setStep(1);
    else if (step === 1) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "A85PackagingWizard",
      ];
      setStep(0);
      navigation.navigate("POPMarkingDataEntry");
    }
  };

  const handleBack = () => {
    if (step === 1) setStep(0);
    else navigation.goBack();
  };

  const handleSaveExit = async () => {
    try {
      await saveCurrentShipment("in-progress");
      navigation.navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (err) {
      // Error is automatically handled by the context and displayed via error state
      console.log("Save failed, but error is handled by context:", err);
    }
  };

  const retryLastSaveOperation = async () => {
    try {
      await saveCurrentShipment("in-progress");
    } catch (error) {
      console.log("Retry failed:", error);
    }
  };

  function renderStepContent() {
    if (step === 0) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Select Packaging Type (A8.5)</Text>
          {packagingTypes.map(key => (
            <OptionCard
              key={key}
              title={a85Instructions[key].label}
              description={a85Instructions[key].description}
              selected={selectedType === key}
              onPress={() => setSelectedType(key)}
            />
          ))}
          {selectedType && (
            <View style={styles.detailsBox}>
              <Text style={styles.detailsTitle}>Details</Text>
              {a85Instructions[selectedType].details.map((d, i) => (
                <Text key={i} style={styles.detailsText}>
                  • {d}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    }
    if (step === 1) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>Confirm Container</Text>
          <Text style={styles.confirmationQuestion}>
            Do you have a container that meets the requirements for:
            {"\n"}
            <Text style={styles.highlightedValue}>
              {a85Instructions[selectedType!].label}
            </Text>
            ?
          </Text>
          <View style={styles.confirmationButtons}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                confirmed === true && styles.confirmYesSelected,
              ]}
              onPress={() => setConfirmed(true)}
              activeOpacity={0.8}
              accessibilityState={{ selected: confirmed === true }}
              accessibilityLabel="Yes, I have the required container"
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  confirmed === true && styles.confirmYesSelectedText,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                confirmed === false && styles.confirmNoSelected,
              ]}
              onPress={() => setConfirmed(false)}
              activeOpacity={0.8}
              accessibilityState={{ selected: confirmed === false }}
              accessibilityLabel="No, I don't have the required container"
            >
              <Text
                style={[
                  styles.confirmButtonText,
                  confirmed === false && styles.confirmNoSelectedText,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
          {confirmed === false && (
            <View style={styles.warningContainer}>
              <Icon name="warning" color={"#ffc107"} size={20} />
              <Text style={styles.warningText}>
                A compliant container is required to proceed. Return to HazPro
                once you have found a package that meets these specifications.
              </Text>
            </View>
          )}
        </View>
      );
    }
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <StepIndicator currentStep={step} totalSteps={2} />

          {error && (
            <DatabaseErrorDisplay
              error={error}
              service="HazProPreparerProvider"
              operation="saveShipment"
              onRetry={retryLastSaveOperation}
              showTechnicalDetails={false}
            />
          )}

          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={colors.blue} />
              <Text style={styles.loadingText}>Processing...</Text>
            </View>
          )}

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator
          >
            {renderStepContent()}
          </ScrollView>
          <NavigationFooter
            canGoBack={step > 0}
            canContinue={canContinue()}
            isLastStep={step === 1}
            onBack={handleBack}
            onNext={handleNext}
            onSaveExit={handleSaveExit}
            isLoading={isLoading}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default A85PackagingWizard;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f8f9fa" },
  keyboardAvoidingContainer: { flex: 1 },
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  scrollContent: { paddingBottom: 16 },
  stepIndicatorContainer: {
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#dee2e6",
  },
  stepText: {
    fontSize: 13,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 4,
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
    backgroundColor: "#dee2e6",
    marginHorizontal: 3,
  },
  activeStepIndicator: { backgroundColor: colors.blue },
  stepContainer: { padding: 16 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#212529",
    marginBottom: 16,
  },
  optionCard: {
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#dee2e6",
    backgroundColor: "#fff",
    padding: 16,
  },
  selectedCard: {
    borderColor: colors.blue,
    borderWidth: 1,
    backgroundColor: "#e6f0ff",
  },
  disabledCard: { borderColor: "#dee2e6", backgroundColor: "#f2f2f2" },
  optionCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTextContainer: { flex: 1 },
  optionCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212529",
    marginBottom: 4,
  },
  optionCardDescription: { fontSize: 13, color: "#6c757d" },
  selectedCardText: { color: colors.blue },
  selectedCardDesc: { color: "#212529" },
  disabledCardText: { color: "#999" },
  cardCheckIcon: { marginLeft: 8 },
  detailsBox: {
    marginTop: 12,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 6,
    padding: 12,
  },
  detailsTitle: { fontWeight: "700", color: colors.blue, marginBottom: 6 },
  detailsText: { fontSize: 14, color: "#212529", marginBottom: 2 },
  confirmationQuestion: {
    fontSize: 15,
    color: "#212529",
    marginBottom: 16,
    textAlign: "center",
  },
  highlightedValue: { fontWeight: "700", color: colors.blue },
  confirmationButtons: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 16,
  },
  confirmButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: "#dee2e6",
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  confirmButtonText: { fontSize: 15, color: "#212529", fontWeight: "600" },
  confirmYesSelected: { backgroundColor: "#28a745", borderColor: "#28a745" },
  confirmYesSelectedText: { color: "#fff" },
  confirmNoSelected: { backgroundColor: "#dc3545", borderColor: "#dc3545" },
  confirmNoSelectedText: { color: "#fff" },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff3cd",
    borderWidth: 1,
    borderColor: "#ffecb5",
  },
  warningText: { fontSize: 13, color: "#664d03", marginLeft: 8, flex: 1 },
  footerContainer: {
    borderTopWidth: 1,
    borderTopColor: "#dee2e6",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  footerButtons: { flexDirection: "row", justifyContent: "space-between" },
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
  backButtonText: { color: colors.blue, fontSize: 16, fontWeight: "600" },
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
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  disabledButton: { backgroundColor: "#a0a0a0", opacity: 0.7 },
  disabledButtonText: { color: "#ffffff" },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f8ff",
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#bee3f8",
  },
  loadingText: {
    marginLeft: 8,
    color: colors.blue,
    fontSize: 14,
    fontWeight: "500",
  },
});
