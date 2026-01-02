import React, { useState, useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "../../../src/contexts/InspectionFormProvider";
import { usePackageCodeValidation } from "../../../src/hooks/usePackageCodeValidation";
import { useInputRefs } from "../../../src/utils/hooks/useInputRefs";

interface InspectorPopMarkingProps {
  navigation: any;
}

type VerificationStatus = "unchecked" | "verified" | "missing" | "incorrect";
type POPFormat = "standard" | "single-liquid" | "large-packaging";

interface POPMarkingComponent {
  id: string;
  position: number;
  label: string;
  description: string;
  value: string;
  verificationStatus: VerificationStatus;
  isRequired: boolean;
  expectedFormat?: string;
  helpText?: string;
}

interface POPMarking {
  fullMarking: string;
  components: POPMarkingComponent[];
  verificationStatus: VerificationStatus;
  packageType: "standard" | "large";
  isReconditioned: boolean;
}

const { width: screenWidth } = Dimensions.get("window");

// Format detection utility function
const detectPOPFormat = (inspection: any): POPFormat => {
  if (!inspection?.sddgData) return "standard";

  const { hazardClass, properShippingName, quantityAndPacking } =
    inspection.sddgData;
  const psn = properShippingName?.toLowerCase() || "";
  const hazClass = hazardClass?.toLowerCase() || "";
  const packaging = quantityAndPacking?.toLowerCase() || "";

  // Check for Large Packaging (Class 1 explosives)
  if (hazClass.startsWith("1.") && packaging.includes("large")) {
    return "large-packaging";
  }

  // Check for definitive solids (always use standard format)
  if (
    psn.includes("solid") ||
    psn.includes("powder") ||
    psn.includes("granules") ||
    psn.includes("flakes") ||
    hazClass === "4.1" ||
    hazClass === "4.2" ||
    hazClass === "4.3"
  ) {
    return "standard";
  }

  // Check for gases (always use standard format)
  if (hazClass.startsWith("2.")) {
    return "standard";
  }

  // Check for single liquid in drum/cylinder (likely single-liquid format)
  const isLiquid =
    hazClass === "3" || psn.includes("liquid") || psn.includes("solution");
  const isBulkContainer =
    packaging.includes("drum") ||
    packaging.includes("cylinder") ||
    packaging.includes("jerrican");

  if (isLiquid && isBulkContainer) {
    return "single-liquid";
  }

  // Liquids in boxes are typically combination packaging (use standard)
  if (isLiquid && packaging.includes("box")) {
    return "standard";
  }

  // Default to standard (most common ~80% of cases)
  return "standard";
};

export default function InspectorPopMarking({
  navigation,
}: InspectorPopMarkingProps) {
  const { inspection } = useInspectionForm();

  const [detectedFormat, setDetectedFormat] = useState<POPFormat>("standard");
  const [selectedFormat, setSelectedFormat] = useState<POPFormat>("standard");
  const [popMarking, setPopMarking] = useState<POPMarking>({
    fullMarking: "",
    components: [],
    verificationStatus: "unchecked",
    packageType: "standard",
    isReconditioned: false,
  });
  const [showHelp, setShowHelp] = useState(false);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  // Package code validation - TEMPORARILY DISABLED
  // const { validateCode, validCodes, isReady } = usePackageCodeValidation(inspection);
  const [packageCodeError, setPackageCodeError] = useState<string | null>(null);
  const [packageCodeIsValid, setPackageCodeIsValid] = useState<boolean>(false);

  // Initialize input refs - using 10 to cover maximum possible fields across all formats
  const { getRef, focusNext } = useInputRefs(10);

  // Initialize POP marking components based on package type
  useEffect(() => {
    const detected = detectPOPFormat(inspection);
    setDetectedFormat(detected);
    setSelectedFormat(detected);
    initializePOPComponents(detected);
  }, []);

  // Track keyboard visibility
  useEffect(() => {
    const showListener = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideListener = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  // Field configuration generators
  const getStandardFields = (): POPMarkingComponent[] => [
    {
      id: "package-code",
      position: 1,
      label: "Package Type",
      description: "Type code (e.g., 4G)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "4G",
      helpText: "1=Drum, 2=Barrel, 3=Jerrican, 4=Box, 5=Bag, 6=Composite",
    },
    {
      id: "packing-group",
      position: 2,
      label: "Packing Group",
      description: "PG: X, Y, or Z",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "Y",
      helpText: "X=PG I, Y=PG II, Z=PG III",
    },
    {
      id: "gross-mass",
      position: 3,
      label: "Max Gross Mass",
      description: "Maximum weight (kg)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "7.4",
      helpText: "Maximum gross mass in kg (e.g., 7.4, 145)",
    },
    {
      id: "solid-indicator",
      position: 4,
      label: 'Letter "S"',
      description: "For solids/inner pkgs",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "S",
      helpText: 'Enter letter "S" for solids or inner packagings',
    },
    {
      id: "manufacture-year",
      position: 5,
      label: "Year",
      description: "Manufacture year",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "24",
      helpText: "Last two digits (e.g., 24 for 2024)",
    },
    {
      id: "country-code",
      position: 6,
      label: "Country",
      description: "Authorization country",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "USA",
      helpText: "Country authorizing the mark",
    },
    {
      id: "manufacturer",
      position: 7,
      label: "Manufacturer",
      description: "Manufacturer symbol",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "DOD",
      helpText: "DOD for Department of Defense",
    },
  ];

  const getSingleLiquidFields = (): POPMarkingComponent[] => [
    {
      id: "package-code",
      position: 1,
      label: "Package Type",
      description: "Type code (e.g., 1A1)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "1A1",
      helpText: "1A1=Steel drum, 3H1=Plastic jerrican, etc.",
    },
    {
      id: "packing-group",
      position: 2,
      label: "Packing Group",
      description: "PG: X, Y, or Z",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "Y",
      helpText: "X=PG I, Y=PG II, Z=PG III",
    },
    {
      id: "relative-density",
      position: 3,
      label: "Relative Density",
      description: "Density (if > 1.2)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: false,
      expectedFormat: "1.3",
      helpText: "Omit if ≤1.2, otherwise enter (e.g., 1.3)",
    },
    {
      id: "test-pressure",
      position: 4,
      label: "Test Pressure",
      description: "Hydraulic test (kPa)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "100",
      helpText: "Test pressure in kPa (e.g., 100, 250)",
    },
    {
      id: "manufacture-year",
      position: 5,
      label: "Year",
      description: "Manufacture year",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "24",
      helpText: "Last two digits (e.g., 24 for 2024)",
    },
    {
      id: "country-code",
      position: 6,
      label: "Country",
      description: "Authorization country",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "USA",
      helpText: "Country authorizing the mark",
    },
    {
      id: "manufacturer",
      position: 7,
      label: "Manufacturer",
      description: "Manufacturer symbol",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "DOD",
      helpText: "DOD for Department of Defense",
    },
  ];

  const getLargePackagingFields = (): POPMarkingComponent[] => [
    {
      id: "package-code",
      position: 1,
      label: "Package Type",
      description: "Type code (50A/51x)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "50A",
      helpText: "50=Rigid large, 51=Flexible large",
    },
    {
      id: "packing-group",
      position: 2,
      label: "Packing Group",
      description: "PG: X, Y, or Z",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "X",
      helpText: "X=PG I, Y=PG II, Z=PG III",
    },
    {
      id: "month-year",
      position: 3,
      label: "Month & Year",
      description: "MM YY format",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "0124",
      helpText: "Month and year (e.g., 0124 = Jan 2024)",
    },
    {
      id: "country-code",
      position: 4,
      label: "Country",
      description: "Authorization country",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "USA",
      helpText: "Country authorizing the mark",
    },
    {
      id: "manufacturer",
      position: 5,
      label: "Manufacturer",
      description: "Manufacturer symbol",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "M9399",
      helpText: "Manufacturer symbol or name",
    },
    {
      id: "stack-load",
      position: 6,
      label: "Stack Load",
      description: "Stack test load (kg)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "2500",
      helpText: "Stacking test load in kg (0 if not for stacking)",
    },
    {
      id: "max-gross-mass",
      position: 7,
      label: "Max Gross Mass",
      description: "Maximum mass (kg)",
      value: "",
      verificationStatus: "unchecked",
      isRequired: true,
      expectedFormat: "1000",
      helpText: "Maximum permissible gross mass in kg",
    },
  ];

  const initializePOPComponents = (format: POPFormat) => {
    let components: POPMarkingComponent[];

    switch (format) {
      case "single-liquid":
        components = getSingleLiquidFields();
        break;
      case "large-packaging":
        components = getLargePackagingFields();
        break;
      case "standard":
      default:
        components = getStandardFields();
        break;
    }

    setPopMarking(prev => ({
      ...prev,
      components,
    }));
  };

  const handleFormatChange = (format: POPFormat) => {
    setSelectedFormat(format);
    initializePOPComponents(format);
  };

  const handleComponentValueChange = (componentId: string, value: string) => {
    const upperValue = value.toUpperCase();

    // VALIDATION TEMPORARILY DISABLED FOR TESTING
    // if (componentId === 'package-code') {
    //   if (upperValue.trim() === '') {
    //     setPackageCodeError(null);
    //     setPackageCodeIsValid(false);
    //   } else {
    //     const validation = validateCode(upperValue);
    //     setPackageCodeError(validation.isValid ? null : validation.errorMessage || null);
    //     setPackageCodeIsValid(validation.isValid);
    //   }
    // }

    setPopMarking(prev => ({
      ...prev,
      components: prev.components.map(comp =>
        comp.id === componentId ? { ...comp, value: upperValue } : comp
      ),
    }));
  };

  const getFormatLabel = (format: POPFormat): string => {
    switch (format) {
      case "single-liquid":
        return "Liquid";
      case "large-packaging":
        return "Large Pkg";
      case "standard":
      default:
        return "Standard (S)";
    }
  };

  const getHelpExample = (): string => {
    switch (selectedFormat) {
      case "single-liquid":
        return "UN 1A1 / Y 1.3 / 100 / 99 / USA / DOD";
      case "large-packaging":
        return "UN 50A / X / 05 05 / USA / M9399 / 2500 / 1000";
      case "standard":
      default:
        return "UN 4G / Y 7.4 / S / 99 / USA / DOD";
    }
  };

  const getHelpDescription = (): string => {
    switch (selectedFormat) {
      case "single-liquid":
        return "• 1A1 = Package type (1=Drum, A=Steel, 1=Category)\n• Y = Packing group (Y=PG II)\n• 1.3 = Relative density (optional if ≤1.2)\n• 100 = Test pressure in kPa\n• 99 = Year of manufacture (1999)\n• USA = Country of authorization\n• DOD = Manufacturer symbol";
      case "large-packaging":
        return "• 50A = Package type (50=Rigid large, A=Steel)\n• X = Packing group (X=PG I)\n• 05 05 = Month and year (May 2005)\n• USA = Country of authorization\n• M9399 = Manufacturer symbol\n• 2500 = Stack test load in kg\n• 1000 = Maximum gross mass in kg";
      case "standard":
      default:
        return "• 4G = Package type (4=Box, G=Fiberboard)\n• Y = Packing group (Y=PG II)\n• 7.4 = Max gross mass in kg\n• S = For solids or inner packagings\n• 99 = Year of manufacture (1999)\n• USA = Country of authorization\n• DOD = Manufacturer symbol";
    }
  };

  const checkOverallCompletion = () => {
    const allRequired = popMarking.components
      .filter(c => c.isRequired)
      .every(c => c.value && c.value.trim() !== "");

    return allRequired;
  };

  const handleContinue = () => {
    const packageFrustrations = inspection.packageFrustrations || [];

    console.log(
      "📦 [InspectorPopMarking] Continuing - Package frustrations count:",
      packageFrustrations.length
    );

    if (packageFrustrations.length > 0) {
      // Has frustrations → navigate to frustration summary
      console.log(
        "📦 [InspectorPopMarking] Navigating to PackageFrustrationSummary"
      );
      navigation.navigate("PackageFrustrationSummary");
    } else {
      // Zero frustrations → navigate to completion screen
      console.log(
        "📦 [InspectorPopMarking] Navigating to PackageInspectionCompleteScreen"
      );
      navigation.navigate("PackageInspectionCompleteScreen");
    }
  };

  const renderUNSymbol = () => {
    return (
      <View style={styles.unSymbolContainer}>
        <View style={styles.unSymbolCircle}>
          <Text style={styles.unSymbolText}>UN</Text>
        </View>
        <Text style={styles.unSymbolLabel}>
          All UN markings begin with this symbol
        </Text>
      </View>
    );
  };

  const renderFormatSelector = () => {
    const formats: POPFormat[] = [
      "standard",
      "single-liquid",
      "large-packaging",
    ];

    return (
      <View style={styles.formatSelectorContainer}>
        <Text style={styles.formatSelectorLabel}>Marking Format:</Text>
        <View style={styles.formatButtonGroup}>
          {formats.map(format => {
            const isSelected = selectedFormat === format;
            const isAutoDetected = detectedFormat === format;

            return (
              <TouchableOpacity
                key={format}
                style={[
                  styles.formatButton,
                  isSelected && styles.formatButtonSelected,
                ]}
                onPress={() => handleFormatChange(format)}
              >
                <Text
                  style={[
                    styles.formatButtonText,
                    isSelected && styles.formatButtonTextSelected,
                  ]}
                >
                  {getFormatLabel(format)}
                </Text>
                {isAutoDetected && (
                  <View style={styles.autoBadge}>
                    <Text style={styles.autoBadgeText}>AUTO</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderComponentCard = (
    component: POPMarkingComponent,
    index: number
  ) => {
    const isFilled = component.value && component.value.trim() !== "";

    return (
      <View
        key={component.id}
        style={[styles.componentCard, isFilled && styles.filledCard]}
      >
        {/* Position Badge */}
        <View style={[styles.positionBadge, { backgroundColor: "#007AFF" }]}>
          <Text style={styles.positionText}>{component.position}</Text>
        </View>

        {/* Component Info */}
        <View style={styles.componentInfo}>
          <Text style={styles.componentLabel}>{component.label}</Text>
          <Text style={styles.componentDescription}>
            {component.description}
          </Text>
        </View>

        {/* Value Input */}
        <TextInput
          ref={getRef(index)}
          style={[styles.valueInput, isFilled && styles.valueInputFilled]}
          value={component.value}
          onChangeText={text => handleComponentValueChange(component.id, text)}
          placeholder={component.expectedFormat}
          placeholderTextColor="#A8A8A8"
          autoCapitalize="characters"
          maxLength={20}
          autoCorrect={false}
          returnKeyType="next"
          onSubmitEditing={() => focusNext(index)}
        />
      </View>
    );
  };

  const totalCount = popMarking.components.length;
  const filledCount = popMarking.components.filter(
    c => c.value && c.value.trim() !== ""
  ).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UN SPECIFICATION MARKING</Text>
        <TouchableOpacity onPress={() => setShowHelp(!showHelp)}>
          <MaterialIcons name="info-outline" size={24} color="#000000" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        {/* UN Symbol Display - Hidden when keyboard is visible to save space */}
        {!isKeyboardVisible && renderUNSymbol()}

        {/* Components List */}
        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
        >
          {popMarking.components.map((component, index) =>
            renderComponentCard(component, index)
          )}

          {/* Help Section */}
          {showHelp && (
            <View style={styles.helpSection}>
              <Text style={styles.helpTitle}>UN SPECIFICATION FORMAT</Text>
              <Text style={styles.helpDescription}>
                Example: {getHelpExample()}
                {"\n\n"}
                {getHelpDescription()}
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Footer - Hidden when keyboard is visible */}
        {!isKeyboardVisible && (
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => {
                Alert.alert("Save Progress", "Inspection progress saved.", [
                  { text: "OK" },
                ]);
              }}
            >
              <Text style={styles.secondaryButtonText}>SAVE & EXIT</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleContinue}
            >
              <Text style={styles.primaryButtonText}>CONTINUE</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    marginHorizontal: 16,
    letterSpacing: 0.5,
  },
  progressContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#E0E0E0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#00C851",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 11,
    color: "#666666",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  formatSelectorContainer: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  formatSelectorLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#666666",
    marginBottom: 8,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  formatButtonGroup: {
    flexDirection: "row",
    gap: 8,
  },
  formatButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    backgroundColor: "#FAFAFA",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  formatButtonSelected: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  formatButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#333333",
    letterSpacing: 0.2,
  },
  formatButtonTextSelected: {
    color: "#FFFFFF",
  },
  autoBadge: {
    position: "absolute",
    top: -6,
    right: -6,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
  },
  autoBadgeText: {
    fontSize: 8,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  unSymbolContainer: {
    backgroundColor: "#F8F9FA",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    flexDirection: "row",
    alignItems: "center",
  },
  unSymbolCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: "#000000",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  unSymbolText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#000000",
    letterSpacing: 1,
  },
  unSymbolLabel: {
    flex: 1,
    fontSize: 12,
    color: "#666666",
    fontWeight: "600",
    lineHeight: 16,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 20,
  },
  componentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  filledCard: {
    backgroundColor: "#F8FFF9",
    borderColor: "#00C851",
  },
  positionBadge: {
    width: 28,
    height: 28,
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  positionText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
  },
  componentInfo: {
    flex: 1,
    marginRight: 10,
  },
  componentLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    letterSpacing: 0.2,
  },
  componentDescription: {
    fontSize: 11,
    color: "#666666",
    marginTop: 2,
  },
  valueInput: {
    flex: 1,
    maxWidth: 150,
    height: 40,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    backgroundColor: "#FAFAFA",
    textAlign: "center",
  },
  valueInputFilled: {
    borderColor: "#00C851",
    backgroundColor: "#F8FFF9",
  },
  valueInputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  errorCard: {
    backgroundColor: "#FFF5F5",
    borderColor: "#FF3B30",
    borderWidth: 1.5,
  },
  validationIcon: {
    marginLeft: 8,
  },
  errorMessageContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFF5F5",
    borderRadius: 4,
    padding: 8,
    marginTop: 4,
    marginBottom: 8,
    marginHorizontal: 4,
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
  },
  errorMessageText: {
    flex: 1,
    fontSize: 11,
    color: "#D32F2F",
    marginLeft: 6,
    lineHeight: 16,
  },
  helpSection: {
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#D0D0D0",
  },
  helpTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 8,
    letterSpacing: 0.3,
  },
  helpDescription: {
    fontSize: 12,
    color: "#333333",
    lineHeight: 18,
  },
  footer: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 2,
    borderTopColor: "#E0E0E0",
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#000000",
    paddingVertical: 12,
    borderRadius: 4,
  },
  secondaryButtonText: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  primaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
    paddingVertical: 12,
    borderRadius: 4,
  },
  primaryButtonDisabled: {
    backgroundColor: "#D0D0D0",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  primaryButtonTextDisabled: {
    color: "#888888",
  },
});
