import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { getAvailableCylinderTypesByPackagingParagraphReference } from "../../server/lookupFunctions/dotCylinderSpecifications";
import { useHazProStore } from "@/stores/useHazProStore";
import colors from "@/theming/colors";
import { CalculateGasQuantityOutput } from "@/utils/gasQuantityCalculator";
import { useInputRefs } from "@/utils/hooks/useInputRefs";
import { Picker } from "@react-native-picker/picker";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import GasCalculationModal from "./GasQuantityCalculatorModal";

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

type Cylinder = {
  id: number;
  type: string;
  quantity: string;
  unit: "kg" | "g" | "";
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

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <View style={styles.stepIndicatorContainer}>
      <Text
        style={styles.stepText}
        accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}`}
      >
        Step {currentStep + 1} of {totalSteps}
      </Text>
      <View style={styles.stepDots}>
        {Array(totalSteps)
          .fill(0)
          .map((_, index: number) => (
            <View
              key={index}
              style={[
                styles.stepIndicator,
                index === currentStep ? styles.activeStepIndicator : null,
              ]}
            />
          ))}
      </View>
    </View>
  );
};

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
        <MaterialCommunityIcons
          name="content-save"
          size={18}
          color={theme.colors.white}
          style={{ marginRight: 6 }}
        />
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

const CylinderEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [step, setStep] = useState<number>(0);
  const [isMEGC, setIsMEGC] = useState<boolean>(false);
  const [numberOfCylinders, setNumberOfCylinders] = useState<string>("");
  const [sameType, setSameType] = useState<boolean | null>(null);
  const [sameQuantity, setSameQuantity] = useState<boolean | null>(null);
  const [commonType, setCommonType] = useState<string>("");
  const [commonQuantity, setCommonQuantity] = useState<string>("");
  const [commonQuantityUnit, setCommonQuantityUnit] = useState<"kg" | "g" | "">(
    "kg"
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const isMounted = useRef(false);
  const dropdownOpenTimeout = useRef<NodeJS.Timeout | null>(null);
  const [cylinderWarnings, setCylinderWarnings] = useState<string[]>([]);

  // Calculate the maximum number of input fields needed
  const maxInputFields = useMemo(() => {
    if (isMEGC) {
      // For MEGC: number of cylinders input, cylinder type, quantity input
      return 3;
    } else {
      // For individual cylinders: number of cylinders input + (2 fields per cylinder: type and quantity)
      const numCylinders = parseInt(numberOfCylinders, 10) || 0;
      return 1 + numCylinders * 2;
    }
  }, [isMEGC, numberOfCylinders]);

  const { getRef, focusNext } = useInputRefs(maxInputFields);

  useEffect(() => {
    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  const [megcNumberOfCylinders, setMegcNumberOfCylinders] =
    useState<string>("");
  const [megcCylinderType, setMegcCylinderType] = useState<string>("");
  const [megcQuantity, setMegcQuantity] = useState<string>("");
  const [megcUnit, setMegcUnit] = useState<"kg" | "g">("kg");
  const [cylinderUpdates, setCylinderUpdates] = useState<{
    [id: number]: Partial<Cylinder>;
  }>({});
  const [validationErrors, setValidationErrors] = useState<{
    [key: number]: { hasError: boolean; message: string };
  }>({});
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [currentCylinderId, setCurrentCylinderId] = useState<number | null>(
    null
  );
  const [psi, setPsi] = useState<string>("");
  const [radius, setRadius] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [specificGravity, setSpecificGravity] = useState<string>("");
  const [molecularWeight, setMolecularWeight] = useState<string>("");
  const [gasQuantity, setGasQuantity] =
    useState<CalculateGasQuantityOutput | null>(null);

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  const availableCylinderTypes =
    typeof state.hazProPreparerContext.cylinderRestrictions?.cylinderTypes ===
    "undefined"
      ? getAvailableCylinderTypesByPackagingParagraphReference(
          state.hazProPreparerContext.hazardousMaterial?.packagingParagraph
        )
      : state.hazProPreparerContext.cylinderRestrictions?.cylinderTypes;

  const cylinderTypeOptions = availableCylinderTypes.map((type, index) => ({
    id: index.toString(),
    title: type,
  }));

  const cylinders = useMemo(() => {
    const count = parseInt(numberOfCylinders, 10);
    if (isNaN(count) || count <= 0) return [];

    return Array.from({ length: count }, (_, i) => {
      const updates = cylinderUpdates[i] || {};

      return {
        id: i,
        type: sameType ? commonType : updates.type || "",
        quantity: sameQuantity ? commonQuantity : updates.quantity || "",
        unit: sameQuantity ? commonQuantityUnit : updates.unit || "",
      };
    });
  }, [
    numberOfCylinders,
    sameType,
    commonType,
    sameQuantity,
    commonQuantity,
    commonQuantityUnit,
    cylinderUpdates,
  ]);

  const handleCylinderUpdate = (
    id: number,
    field: keyof Cylinder,
    value: string
  ) => {
    setCylinderUpdates(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: value,
      },
    }));
  };

  const validateCylinders = (skipStateUpdate = false) => {
    const errors: { [key: number]: { hasError: boolean; message: string } } =
      {};

    cylinders.forEach(cylinder => {
      if (!cylinder.quantity) {
        return;
      }

      const quantityKg =
        cylinder.unit === "kg"
          ? parseFloat(cylinder.quantity)
          : parseFloat(cylinder.quantity) / 1000;

      if (isNaN(quantityKg)) {
        errors[cylinder.id] = {
          hasError: true,
          message: "Invalid numeric values entered",
        };
        return;
      }
    });

    if (!skipStateUpdate) {
      setValidationErrors(errors);
    }
    return Object.keys(errors).length === 0;
  };

  const validateMEGC = () => {
    if (!isMEGC) return true;

    const quantityKg =
      megcUnit === "kg"
        ? parseFloat(megcQuantity)
        : parseFloat(megcQuantity) / 1000;

    if (isNaN(quantityKg)) {
      return false;
    }

    return true;
  };

  const mapMEGCToProperties = () => {
    if (!isMEGC) return null;

    const numCylinders = parseInt(megcNumberOfCylinders, 10);
    const quantityKg =
      megcUnit === "kg"
        ? parseFloat(megcQuantity)
        : parseFloat(megcQuantity) / 1000;
    const quantityG =
      megcUnit === "g"
        ? parseFloat(megcQuantity)
        : parseFloat(megcQuantity) * 1000;

    return {
      isUsingMegc: true,
      cylinderType: megcCylinderType,
      numberOfCylinders: numCylinders,
      quantityPerCylinder: {
        kg: quantityKg,
        g: quantityG,
      },
      totalQuantity: {
        kg: quantityKg * numCylinders,
        g: quantityG * numCylinders,
      },
    };
  };

  const mapCylindersToProperties = () => {
    if (isMEGC) return [];

    return cylinders.map(c => ({
      cylinderType: c.type,
      quantity: {
        kg:
          c.unit === "kg"
            ? parseFloat(c.quantity) || 0
            : (parseFloat(c.quantity) || 0) / 1000,
        g:
          c.unit === "g"
            ? parseFloat(c.quantity) || 0
            : (parseFloat(c.quantity) || 0) * 1000,
      },
    }));
  };

  const handleCalculateGasQuantity = (
    calculatedQuantity: CalculateGasQuantityOutput
  ) => {
    setGasQuantity(calculatedQuantity);

    const formattedValue = calculatedQuantity.kgs.toFixed(2);

    if (currentCylinderId === null) {
      if (isMEGC) {
        setMegcQuantity(formattedValue);
      } else {
        setCommonQuantity(formattedValue);
        setCommonQuantityUnit("kg");
      }
    } else {
      handleCylinderUpdate(currentCylinderId, "quantity", formattedValue);
      handleCylinderUpdate(currentCylinderId, "unit", "kg");
    }
  };
  useEffect(() => {
    if (cylinders.length > 0) {
      validateCylinders(false);
    }
  }, [cylinders]);

  const canContinue = (): boolean => {
    switch (step) {
      case 0:
        return true;
      case 1:
        if (isMEGC) {
          return (
            !!megcNumberOfCylinders && !!megcCylinderType && !!megcQuantity
          );
        } else {
          const numCylinders = parseInt(numberOfCylinders, 10);
          if (isNaN(numCylinders) || numCylinders <= 0) {
            return false;
          }

          if (numCylinders > 1) {
            if (sameType === null || sameQuantity === null) {
              return false;
            }

            if (sameType && !commonType) return false;
            if (sameQuantity && (!commonQuantity || !commonQuantityUnit))
              return false;
          }

          return true;
        }
      case 2:
        if (isMEGC) {
          return validateMEGC();
        } else {
          const isAllCylindersComplete = cylinders.every(
            c => c.type && c.quantity
          );
          return isAllCylindersComplete && validateCylinders(true);
        }
      default:
        return false;
    }
  };

  const hasValidationErrors = useMemo(
    () => !validateCylinders(true),
    [cylinders]
  );

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      if (isMEGC) {
        if (!validateMEGC()) {
          Alert.alert(
            "Validation Error",
            "The MEGC cylinder has invalid values. Please correct the values before proceeding."
          );
          return;
        }

        store.hazProPreparerContext.megcProperties = mapMEGCToProperties();
      } else {
        if (!validateCylinders(false)) {
          Alert.alert(
            "Validation Error",
            "One or more cylinders have validation errors. Please correct the errors before proceeding."
          );
          return;
        }

        store.hazProPreparerContext.cylinderProperties =
          mapCylindersToProperties();
      }

      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        "LabelingAndMarking",
      ];
      navigation.navigate("LabelingAndMarking");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      store.hazProPreparerContext.activeStep = 2;
      store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(
        0,
        -1
      );
      navigation.goBack();
    }
  };

  const handleSaveExit = async () => {
    if (isMEGC) {
      store.hazProPreparerContext.megcProperties = mapMEGCToProperties();
    } else {
      store.hazProPreparerContext.cylinderProperties =
        mapCylindersToProperties();
    }

    try {
      await saveCurrentShipment("in-progress");
      navigate("PreparerHomeStack", { screen: "PreparerHome" });
    } catch (err) {
      console.log("Save failed, but error is handled by context:", err);
    }
  };

  const getStepTitle = (): string => {
    switch (step) {
      case 0:
        return "Select Container Type";
      case 1:
        return isMEGC ? "MEGC Container Details" : "Cylinder Container Details";
      case 2:
        return isMEGC ? "Confirm MEGC Details" : "Individual Cylinder Details";
      default:
        return "Prepare Cylinders";
    }
  };

  const renderContainerTypeStep = () => {
    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>{getStepTitle()}</Text>

        <View style={styles.optionSection}>
          <Text style={styles.optionQuestion}>
            Using Multiple-Element Gas Container (MEGC)?
          </Text>

          <View style={styles.optionButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.optionButton,
                isMEGC === true && styles.selectedOptionButton,
              ]}
              onPress={() => setIsMEGC(true)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  isMEGC === true && styles.selectedOptionButtonText,
                ]}
              >
                Yes
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.optionButton,
                isMEGC === false && styles.selectedOptionButton,
              ]}
              onPress={() => setIsMEGC(false)}
            >
              <Text
                style={[
                  styles.optionButtonText,
                  isMEGC === false && styles.selectedOptionButtonText,
                ]}
              >
                No
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Container Type Information</Text>
          <Text style={styles.infoText}>
            {isMEGC
              ? "A Multiple-Element Gas Container (MEGC) is a multimodal assembly of cylinders, tubes, or bundles of cylinders which are interconnected by a manifold and assembled within a framework."
              : "Individual cylinders are single pressure receptacles designed for the transport of gases."}
          </Text>
        </View>
      </View>
    );
  };

  const renderContainerDetailsStep = () => {
    if (isMEGC) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Number of Cylinders in MEGC</Text>
              <TextInput
                style={styles.input}
                value={megcNumberOfCylinders}
                onChangeText={setMegcNumberOfCylinders}
                keyboardType="numeric"
                placeholder="Enter number"
                ref={getRef(0)}
                returnKeyType="next"
                onSubmitEditing={() => focusNext(0)}
              />
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Cylinder Type</Text>
              <View style={styles.autoCompleteContainer}>
                <AutocompleteDropdown
                  clearOnFocus={false}
                  closeOnBlur={false}
                  closeOnSubmit={false}
                  initialValue={{ id: "", title: "" }}
                  onSelectItem={item => {
                    if (item && typeof item.title === "string") {
                      setMegcCylinderType(item.title);
                      focusNext(1);
                    }
                  }}
                  inputContainerStyle={{
                    ...styles.input,
                    flexDirection: "row",
                    alignItems: "center",
                    paddingVertical: 0,
                  }}
                  dataSet={cylinderTypeOptions}
                  textInputProps={{
                    placeholder: "Select Type",
                    autoCorrect: false,
                    autoCapitalize: "none",
                    style: styles.autoCompleteInput,
                    // ref: getRef(1),
                    returnKeyType: "next",
                    onSubmitEditing: () => focusNext(1),
                  }}
                />
              </View>
            </View>

            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Quantity per Cylinder</Text>
              <View style={styles.quantityContainer}>
                <TextInput
                  style={styles.quantityInput}
                  value={megcQuantity}
                  onChangeText={setMegcQuantity}
                  keyboardType="numeric"
                  placeholder="Enter quantity"
                  ref={getRef(2)}
                  returnKeyType="done"
                  onSubmitEditing={() => Keyboard.dismiss()}
                />
                <View style={styles.unitPickerContainer}>
                  <Picker
                    selectedValue={megcUnit}
                    onValueChange={value => setMegcUnit(value)}
                    style={styles.unitPicker}
                    itemStyle={styles.pickerItem}
                  >
                    <Picker.Item label="kg" value="kg" />
                    <Picker.Item label="g" value="g" />
                  </Picker>
                </View>
                <TouchableOpacity
                  style={styles.calcButton}
                  onPress={() => {
                    setPsi("");
                    setRadius("");
                    setHeight("");
                    setSpecificGravity("");
                    setMolecularWeight("");
                    setGasQuantity(null);
                    setCurrentCylinderId(null);
                    setModalVisible(true);
                  }}
                >
                  <MaterialCommunityIcons
                    name="calculator"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.calcButtonText}>Gas Calculation</Text>
                </TouchableOpacity>
              </View>
            </View>

            {parseFloat(megcQuantity) > 0 &&
              parseInt(megcNumberOfCylinders, 10) > 0 && (
                <View style={styles.totalSection}>
                  <Text style={styles.totalLabel}>Total Quantity:</Text>
                  <Text style={styles.totalValue}>
                    {megcUnit === "kg"
                      ? `${(
                          parseFloat(megcQuantity) *
                          parseInt(megcNumberOfCylinders, 10)
                        ).toFixed(2)} kg`
                      : `${(
                          parseFloat(megcQuantity) *
                          parseInt(megcNumberOfCylinders, 10)
                        ).toFixed(2)} g`}
                  </Text>
                </View>
              )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>

          <View style={styles.inputCard}>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Number of Cylinders</Text>
              <TextInput
                style={styles.input}
                value={numberOfCylinders}
                onChangeText={setNumberOfCylinders}
                keyboardType="numeric"
                placeholder="Enter number"
                ref={getRef(0)}
                returnKeyType="next"
                onSubmitEditing={() => focusNext(0)}
              />
            </View>
          </View>

          {parseInt(numberOfCylinders, 10) > 1 && (
            <View style={styles.commonPropertiesContainer}>
              <Text style={styles.subSectionTitle}>Common Properties</Text>
              <Text style={styles.subSectionInfo}>
                If your cylinders share common characteristics, you can set them
                here
              </Text>

              <View style={styles.inputCard}>
                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>Same Cylinder Type?</Text>
                  <View style={styles.optionButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        sameType === true && styles.selectedOptionButton,
                      ]}
                      onPress={() => setSameType(true)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          sameType === true && styles.selectedOptionButtonText,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        sameType === false && styles.selectedOptionButton,
                      ]}
                      onPress={() => setSameType(false)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          sameType === false && styles.selectedOptionButtonText,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {sameType && (
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Select Type</Text>
                    <View style={styles.autoCompleteContainer}>
                      <AutocompleteDropdown
                        clearOnFocus={false}
                        closeOnBlur={false}
                        closeOnSubmit={false}
                        initialValue={{ id: "", title: "" }}
                        onSelectItem={item => {
                          if (item && typeof item.title === "string") {
                            setCommonType(item.title);
                            focusNext(1);
                          }
                        }}
                        inputContainerStyle={{
                          ...styles.input,
                          flexDirection: "row",
                          alignItems: "center",
                          paddingVertical: 0,
                        }}
                        dataSet={cylinderTypeOptions}
                        textInputProps={{
                          placeholder: "Select Type",
                          autoCorrect: false,
                          autoCapitalize: "none",
                          style: styles.autoCompleteInput,
                          // ref: getRef(1),
                          returnKeyType: "next",
                          onSubmitEditing: () => focusNext(1),
                        }}
                      />
                    </View>
                  </View>
                )}

                <View style={styles.optionRow}>
                  <Text style={styles.optionLabel}>
                    Same Quantity per Cylinder?
                  </Text>
                  <View style={styles.optionButtonsContainer}>
                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        sameQuantity === true && styles.selectedOptionButton,
                      ]}
                      onPress={() => setSameQuantity(true)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          sameQuantity === true &&
                            styles.selectedOptionButtonText,
                        ]}
                      >
                        Yes
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.optionButton,
                        sameQuantity === false && styles.selectedOptionButton,
                      ]}
                      onPress={() => setSameQuantity(false)}
                    >
                      <Text
                        style={[
                          styles.optionButtonText,
                          sameQuantity === false &&
                            styles.selectedOptionButtonText,
                        ]}
                      >
                        No
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {sameQuantity && (
                  <View style={styles.inputRow}>
                    <Text style={styles.inputLabel}>Quantity per Cylinder</Text>
                    <View style={styles.quantityContainer}>
                      <TextInput
                        style={styles.quantityInput}
                        value={commonQuantity}
                        onChangeText={setCommonQuantity}
                        keyboardType="numeric"
                        placeholder="Enter quantity"
                        ref={getRef(2)}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                      <View style={styles.unitPickerContainer}>
                        <Picker
                          selectedValue={commonQuantityUnit}
                          onValueChange={value => setCommonQuantityUnit(value)}
                          style={styles.unitPicker}
                          itemStyle={styles.pickerItem}
                        >
                          <Picker.Item label="kg" value="kg" color="#000000" />
                          <Picker.Item label="g" value="g" color="#000000" />
                        </Picker>
                      </View>
                      <TouchableOpacity
                        style={styles.calcButton}
                        onPress={() => {
                          setPsi("");
                          setRadius("");
                          setHeight("");
                          setSpecificGravity("");
                          setMolecularWeight("");
                          setGasQuantity(null);
                          setCurrentCylinderId(null);
                          setModalVisible(true);
                        }}
                      >
                        <MaterialCommunityIcons
                          name="calculator"
                          size={20}
                          color="white"
                        />
                        <Text style={styles.calcButtonText}>
                          Gas Calculation
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  const renderIndividualCylindersStep = () => {
    if (isMEGC) {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>MEGC Summary</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Number of Cylinders:</Text>
              <Text style={styles.summaryValue}>{megcNumberOfCylinders}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Cylinder Type:</Text>
              <Text style={styles.summaryValue}>{megcCylinderType}</Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Quantity per Cylinder:</Text>
              <Text style={styles.summaryValue}>
                {megcQuantity} {megcUnit}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Quantity:</Text>
              <Text style={styles.summaryValue}>
                {megcUnit === "kg"
                  ? `${(
                      parseFloat(megcQuantity) *
                      parseInt(megcNumberOfCylinders, 10)
                    ).toFixed(2)} kg`
                  : `${(
                      parseFloat(megcQuantity) *
                      parseInt(megcNumberOfCylinders, 10)
                    ).toFixed(2)} g`}
              </Text>
            </View>

            {!validateMEGC() && (
              <View style={styles.errorCard}>
                <MaterialCommunityIcons
                  name="alert-circle"
                  size={24}
                  color={theme.colors.danger}
                />
                <Text style={styles.errorText}>
                  The MEGC cylinder has invalid values. Please go back and
                  correct the values.
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    } else {
      return (
        <View style={styles.stepContainer}>
          <Text style={styles.stepTitle}>{getStepTitle()}</Text>

          {cylinderWarnings.length > 0 && (
            <View style={styles.warningsContainer}>
              {cylinderWarnings.map((warning, index) => (
                <WarningMessage key={index} message={warning} />
              ))}
            </View>
          )}

          {cylinders.map((cylinder, index) => {
            const baseIndex = 1 + index * 2;
            return (
              <View key={cylinder.id} style={styles.cylinderCard}>
                <Text style={styles.cylinderTitle}>Cylinder {index + 1}</Text>

                <View style={styles.cylinderField}>
                  <Text style={styles.fieldLabel}>Cylinder Type</Text>
                  <View style={styles.autoCompleteContainer}>
                    <AutocompleteDropdown
                      clearOnFocus={false}
                      closeOnBlur={false}
                      closeOnSubmit={false}
                      initialValue={
                        cylinder.type
                          ? { id: cylinder.type, title: cylinder.type }
                          : { id: "", title: "" }
                      }
                      onSelectItem={item => {
                        if (
                          !sameType &&
                          item &&
                          typeof item.title === "string"
                        ) {
                          handleCylinderUpdate(cylinder.id, "type", item.title);
                          focusNext(baseIndex);
                          handleDropdownBlur(index);
                        }
                      }}
                      onFocus={() => handleDropdownFocus(index)}
                      onBlur={() => handleDropdownBlur(index)}
                      inputContainerStyle={{
                        ...styles.input,
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 0,
                      }}
                      dataSet={cylinderTypeOptions}
                      textInputProps={{
                        editable: !sameType,
                        placeholder: "Select Type",
                        autoCorrect: false,
                        autoCapitalize: "none",
                        style: {
                          ...styles.autoCompleteInput,
                          color: sameType
                            ? theme.colors.text.muted
                            : theme.colors.text.primary,
                        },
                      }}
                    />
                  </View>
                </View>

                <View style={styles.quantityRowAligned}>
                  <View style={styles.quantityInputContainer}>
                    <Text style={styles.fieldLabel}>Quantity</Text>
                    <TextInput
                      style={[
                        styles.quantityInput,
                        sameQuantity && styles.disabledInput,
                        validationErrors[cylinder.id]?.hasError &&
                          styles.errorInput,
                      ]}
                      value={cylinder.quantity}
                      onChangeText={value =>
                        handleCylinderUpdate(cylinder.id, "quantity", value)
                      }
                      keyboardType="numeric"
                      placeholder="Enter quantity"
                      editable={!sameQuantity}
                      ref={getRef(baseIndex + 1)}
                      returnKeyType={
                        index === cylinders.length - 1 ? "done" : "next"
                      }
                      onSubmitEditing={() => {
                        if (index === cylinders.length - 1) {
                          Keyboard.dismiss();
                        } else {
                          focusNext(baseIndex + 1);
                        }
                      }}
                    />
                  </View>

                  <View style={styles.unitContainer}>
                    <Text style={styles.fieldLabel}>Unit</Text>
                    <View style={styles.pickerWrapper}>
                      <Picker
                        selectedValue={cylinder.unit}
                        onValueChange={value => {
                          if (!sameQuantity) {
                            handleCylinderUpdate(cylinder.id, "unit", value);
                          }
                        }}
                        enabled={!sameQuantity}
                        style={styles.unitPicker}
                        itemStyle={styles.pickerItem}
                      >
                        <Picker.Item label="kg" value="kg" color="#000000" />
                        <Picker.Item label="g" value="g" color="#000000" />
                      </Picker>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.calcButton}
                    onPress={() => {
                      setPsi("");
                      setRadius("");
                      setHeight("");
                      setSpecificGravity("");
                      setMolecularWeight("");
                      setGasQuantity(null);
                      setCurrentCylinderId(cylinder.id);
                      setModalVisible(true);
                    }}
                  >
                    <MaterialCommunityIcons
                      name="calculator"
                      size={20}
                      color="white"
                    />
                    <Text style={styles.calcButtonText}>Gas Calculation</Text>
                  </TouchableOpacity>
                </View>

                {validationErrors[cylinder.id]?.hasError && (
                  <View style={styles.validationError}>
                    <MaterialCommunityIcons
                      name="alert-circle"
                      size={16}
                      color={theme.colors.danger}
                    />
                    <Text style={styles.validationErrorText}>
                      {validationErrors[cylinder.id]?.message ||
                        "Error in cylinder values"}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
          {hasValidationErrors && (
            <View style={styles.errorCard}>
              <MaterialCommunityIcons
                name="alert-circle"
                size={24}
                color={theme.colors.danger}
              />
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorText}>
                  One or more cylinders have validation errors.
                </Text>
                <Text style={styles.errorSubtext}>
                  Please correct the marked errors before proceeding.
                </Text>
              </View>
            </View>
          )}
        </View>
      );
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return renderContainerTypeStep();
      case 1:
        return renderContainerDetailsStep();
      case 2:
        return renderIndividualCylindersStep();
      default:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.errorText}>Unknown step</Text>
          </View>
        );
    }
  };

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      if (dropdownOpenTimeout.current) {
        clearTimeout(dropdownOpenTimeout.current);
      }
    };
  }, []);

  const handleDropdownFocus = (index: number) => {
    if (isMounted.current) {
      if (dropdownOpenTimeout.current) {
        clearTimeout(dropdownOpenTimeout.current);
      }
    }
  };

  // const handleDropdownBlur = (index: number) => {
  //   if (isMounted.current) {
  //     setOpenDropdownIndices(prev => {
  //       const newSet = new Set(prev);
  //       newSet.delete(index);
  //       return newSet;
  //     });
  //   }
  // };

  const checkCylinderWarnings = useCallback(() => {
    const warnings: string[] = [];
    const packagingParagraph =
      state.hazProPreparerContext.hazardousMaterial?.packagingParagraph;

    const hasCylinderType = (types: string[]) => {
      return Object.values(cylinderUpdates).some(update =>
        types.includes(update.type || "")
      );
    };
    console.log("cylinders", cylinders);

    // A6.15. warnings
    if (packagingParagraph === "A6.15.") {
      const restrictedTypes = ["DOT3A", "DOT3AA", "DOT3AL", "DOT3D"];
      const matchingTypes = Object.values(cylinders)
        .filter(update => restrictedTypes.includes(update.type || ""))
        .map(update => update.type);

      if (matchingTypes.length > 0) {
        warnings.push(
          `Water capacity (nominal) for cylinder ${matchingTypes.join(
            ", "
          )} cannot exceed 57 kg (125 pounds), per A6.15.2.`
        );
      }
    }

    // A6.18. warnings
    if (packagingParagraph === "A6.18.") {
      // Check for DOT3A240
      if (hasCylinderType(["DOT3A240"])) {
        warnings.push(
          `Water capacity (nominal) for cylinder DOT3A240 cannot exceed 113 kg (250 pounds), per A6.16.2.2.`
        );
      }

      // Check for filling density warning
      const densityRestrictedTypes = [
        "DOT3A240",
        "DOT3AA240",
        "DOT3B240",
        "DOT4A240",
        "DOT4B240",
        "DOT4BA240",
        "DOT4BW240",
      ];
      const matchingTypes = Object.values(cylinderUpdates)
        .filter(update => densityRestrictedTypes.includes(update.type || ""))
        .map(update => update.type);

      if (matchingTypes.length > 0) {
        warnings.push(
          `The maximum filling density of cylinder ${matchingTypes.join(
            ", "
          )} may not exceed 80 percent of its water capacity, per A6.18.2.1.`
        );
      }
    }

    // A6.22. warning
    if (packagingParagraph === "A6.22.") {
      warnings.push(
        `Fill cylinders so that at 50 °C (122 °F) the non-gaseous phase does not exceed 95% of their water capacity and they are not completely filled at 60 °C (140 °F), per A6.22.1.`
      );
    }

    setCylinderWarnings(warnings);
  }, [
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph,
    cylinderUpdates,
  ]);

  useEffect(() => {
    checkCylinderWarnings();
  }, [checkCylinderWarnings]);

  const WarningMessage = ({ message }: { message: string }) => (
    <View style={styles.warningContainer}>
      <MaterialCommunityIcons
        name="alert-circle"
        size={24}
        color={theme.colors.warning}
        style={styles.warningIcon}
      />
      <Text style={styles.warningText}>{message}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        backgroundColor={theme.colors.background.main}
        barStyle="dark-content"
      />
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.container}>
          <StepIndicator currentStep={step} totalSteps={3} />

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}
          >
            <View style={styles.stepContent}>{renderStepContent()}</View>
          </ScrollView>
          {!isKeyboardVisible && (
            <NavigationFooter
              canGoBack={step > 0}
              canContinue={canContinue()}
              isLastStep={step === 2}
              onBack={handleBack}
              onNext={handleNext}
              onSaveExit={handleSaveExit}
            />
          )}
        </View>
      </KeyboardAvoidingView>

      {modalVisible && (
        <GasCalculationModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          handleCalculateGasQuantity={handleCalculateGasQuantity}
          gasQuantity={gasQuantity}
        />
      )}
    </SafeAreaView>
  );
};

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
    padding: theme.spacing.md,
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
    flex: 1,
  },
  stepTitle: {
    ...theme.typography.h3,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.lg,
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
  optionSection: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  optionQuestion: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  optionButtonsContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  optionButton: {
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    backgroundColor: theme.colors.background.main,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.md,
    minWidth: 100,
    alignItems: "center",
  },
  selectedOptionButton: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  optionButtonText: {
    ...theme.typography.body,
    fontWeight: "600",
    color: colors.blue,
  },
  selectedOptionButtonText: {
    color: theme.colors.white,
  },
  infoCard: {
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  infoTitle: {
    ...theme.typography.h4,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  infoText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    lineHeight: 20,
  },
  inputCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  inputRow: {
    marginBottom: theme.spacing.lg,
  },
  inputLabel: {
    ...theme.typography.body,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  input: {
    height: 50,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: "#000",
  },
  autoCompleteContainer: {
    zIndex: 1,
  },
  autoCompleteInput: {
    fontSize: 16,
    color: theme.colors.text.primary,
    height: 50,
    paddingHorizontal: theme.spacing.md,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  quantityRowAligned: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
  },
  quantityInputContainer: {
    // flex: 2,
    marginRight: 8,
    width: 500,
  },
  quantityInput: {
    height: 55,
    width: 500,
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    fontSize: 16,
    color: "#000",
  },
  unitContainer: {
    flex: 1,
    marginRight: 8,
  },
  unitPickerContainer: {
    height: 55,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: theme.spacing.sm,
    overflow: "hidden",
    backgroundColor: theme.colors.white,
    width: 100,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    backgroundColor: theme.colors.white,
    height: 55,
  },
  unitPicker: {
    height: 55,
    color: "#000000",
  },
  pickerItem: {
    color: "#000000",
    fontSize: 16,
  },
  calcButton: {
    backgroundColor: colors.blue,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },
  calcButtonText: {
    ...theme.typography.small,
    color: "#fff",
    fontSize: 18,
    marginLeft: theme.spacing.xs,
    fontWeight: "600",
  },
  totalSection: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.primaryLight,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginTop: theme.spacing.md,
  },
  totalLabel: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginRight: theme.spacing.md,
  },
  totalValue: {
    ...theme.typography.h4,
    color: theme.colors.primary,
  },
  commonPropertiesContainer: {
    marginBottom: theme.spacing.lg,
  },
  subSectionTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subSectionInfo: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.md,
  },
  optionRow: {
    marginBottom: theme.spacing.md,
  },
  optionLabel: {
    ...theme.typography.body,
    fontWeight: "500",
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: theme.colors.text.muted,
  },
  errorInput: {
    borderColor: theme.colors.danger,
    borderWidth: 2,
  },
  cylinderCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cylinderTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  cylinderField: {
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    ...theme.typography.small,
    fontWeight: "500",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  validationError: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee",
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.danger,
  },
  validationErrorText: {
    ...theme.typography.small,
    color: theme.colors.danger,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  summaryCard: {
    backgroundColor: theme.colors.background.card,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  summaryTitle: {
    ...theme.typography.h4,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  summaryLabel: {
    ...theme.typography.body,
    color: theme.colors.text.secondary,
    flex: 1,
  },
  summaryValue: {
    ...theme.typography.body,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
    textAlign: "right",
  },
  errorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.danger,
    marginTop: theme.spacing.md,
  },
  errorText: {
    ...theme.typography.body,
    color: theme.colors.danger,
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
  errorTextContainer: {
    flexDirection: "column",
    alignItems: "center",
  },
  errorSubtext: {
    ...theme.typography.small,
    color: theme.colors.text.secondary,
  },
  warningsContainer: {
    marginBottom: theme.spacing.lg,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.warning + "20",
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  warningIcon: {
    marginRight: theme.spacing.sm,
  },
  warningText: {
    ...theme.typography.body,
    color: theme.colors.text.primary,
    flex: 1,
  },
});

export default CylinderEntryScreen;
