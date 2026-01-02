import React, { useContext, useEffect, useState, ReactNode } from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  ViewStyle,
  TextInputProps,
  TextStyle,
  Keyboard,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import { HazProInspectorContext } from "@/contexts/HazProInspectorProvider/HazProInspectorContext";
import { useInputRefs } from "@/utils/hooks/useInputRefs";
import { PhoneNumberInput } from "@/components/PhoneNumberInput";
import { countries } from "../mock/countries";
import colors from "@/theming/colors";

// Reusable components with TypeScript types
interface SectionProps {
  children: ReactNode;
  title?: string;
  style?: ViewStyle;
  last?: boolean;
}

const Section: React.FC<SectionProps> = ({
  children,
  title,
  style = {},
  last = false,
}) => (
  <View style={[styles.section, !last && styles.sectionWithBorder, style]}>
    {title && <Text style={styles.sectionTitle}>{title}</Text>}
    {children}
  </View>
);

interface FormRowProps {
  children: ReactNode;
  lastRow?: boolean;
}

const FormRow: React.FC<FormRowProps> = ({ children, lastRow = false }) => (
  <View style={[styles.formRow, lastRow ? null : styles.formRowWithGap]}>
    {children}
  </View>
);

interface FormFieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string | null;
  style?: ViewStyle;
  flex?: number;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  children,
  required = false,
  error = null,
  style = {},
  flex = 1,
}) => (
  <View style={[styles.fieldContainer, { flex }, style]}>
    <Text style={styles.fieldLabel}>
      {label} {required && <Text style={styles.requiredStar}>*</Text>}
    </Text>
    {children}
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

const RadioOption: React.FC<RadioOptionProps> = ({
  label,
  selected,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.radioButton}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <View style={styles.radioCircle}>
      {selected && <View style={styles.selectedRadioCircle} />}
    </View>
    <Text style={styles.radioLabel}>{label}</Text>
  </TouchableOpacity>
);

interface FormInputProps extends TextInputProps {
  error?: any;
  inputRef?: any;
  onSubmit?: () => void;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  error,
  inputRef,
  onSubmit,
  disabled = false,
  ...props
}) => (
  <TextInput
    ref={inputRef}
    returnKeyType="next"
    submitBehavior="submit"
    onSubmitEditing={onSubmit}
    style={[
      styles.textInput,
      error ? styles.inputError : null,
      disabled ? styles.disabledInput : null,
    ]}
    placeholderTextColor="#999"
    {...props}
  />
);

const phoneTypes = ["DSN", "Commercial", "Both"];
const commercialFormats = ["Domestic", "International"];

const schema = yup.object().shape({
  tcn: yup
    .string()
    .length(17, "TCN must be exactly 17 characters")
    .required("TCN is required"),
  poeOption: yup.string().required("POE option must be selected"),
  podOption: yup.string().required("POD option must be selected"),
  isChapter3: yup.string().required("Chapter 3 option must be selected"),
  poe: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("POE is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  pod: yup.string().when("podOption", {
    is: "Channel",
    then: () => yup.string().required("POD is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperLocation: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("Shipper Location Name is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperStreet: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("Shipper Street is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCity: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("Shipper City is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperZipcode: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("Shipper Zip Code is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCountry: yup.string().when("poeOption", {
    is: "Channel",
    then: () => yup.string().required("Shipper Country is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeDodaac: yup.string().when("podOption", {
    is: "Channel",
    then: () =>
      yup
        .string()
        .length(6, "DODAAC must be 6 digits")
        .required("Consignee DODAAC is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeCountry: yup.string().when("podOption", {
    is: "Channel",
    then: () => yup.string().required("Consignee Country is required"),
    otherwise: () => yup.string().notRequired(),
  }),
  preparerName: yup.string().required("Preparer Name is required"),
  preparerRank: yup.string().notRequired(),
  preparerTitle: yup.string().required("Preparer Title is required"),
  certificationPlace: yup.string().required("Certification Place is required"),
  certificationDate: yup.string().required("Certification Date is required"),
});

const ShipmentCreationScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const { state: inspectorState, dispatch: inspectorDispatch } = useContext(
    HazProInspectorContext
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showShipperCountrySuggestions, setShowShipperCountrySuggestions] =
    useState(false);
  const [showConsigneeCountrySuggestions, setShowConsigneeCountrySuggestions] =
    useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    state.hazProPreparerContext.preparer?.certificationDate
      ? new Date(state.hazProPreparerContext.preparer?.certificationDate)
      : undefined
  );
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const { navigate } = useNavigationRef();

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
    defaultValues: {
      tcn: state.hazProPreparerContext.shipment?.tcn || "",
      poeOption: state.hazProPreparerContext.shipment?.poeOption || "",
      podOption: state.hazProPreparerContext.shipment?.podOption || "",
      isChapter3: state.hazProPreparerContext.shipment?.isChapter3 || "",
      poe: state.hazProPreparerContext.shipment?.poe || "",
      pod: state.hazProPreparerContext.shipment?.pod || "",
      shipperLocation:
        state.hazProPreparerContext.shipper?.address.shipperLocation || "",
      shipperStreet:
        state.hazProPreparerContext.shipper?.address.shipperStreet || "",
      shipperCity:
        state.hazProPreparerContext.shipper?.address.shipperCity || "",
      shipperZipcode:
        state.hazProPreparerContext.shipper?.address.shipperZipcode || "",
      shipperCountry:
        state.hazProPreparerContext.shipper?.address.selectedShipperCountry ||
        "",
      consigneeDodaac:
        state.hazProPreparerContext.consignee?.address.consigneeDodaac || "",
      consigneeCountry:
        state.hazProPreparerContext.consignee?.address
          .selectedConsigneeCountry || "",
      preparerName: state.hazProPreparerContext.preparer?.preparerName || "",
      preparerRank: state.hazProPreparerContext.preparer?.preparerRank || "",
      preparerTitle: state.hazProPreparerContext.preparer?.preparerTitle || "",
      certificationPlace:
        state.hazProPreparerContext.preparer?.certificationPlace || "",
      certificationDate:
        state.hazProPreparerContext.preparer?.certificationDate || "",
    },
  });

  const { getRef, focusNext } = useInputRefs(20);

  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", (e: any) => {
      e.preventDefault();
      navigation.navigate("PreparerHome");
    });

    let keyboardShowListener: any;
    let keyboardHideListener: any;
    let keyboardTimeout: any;

    if (Platform.OS === "ios") {
      keyboardShowListener = Keyboard.addListener("keyboardWillShow", () => {
        if (keyboardTimeout) clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => setKeyboardVisible(true), 10);
      });
      keyboardHideListener = Keyboard.addListener("keyboardWillHide", () => {
        if (keyboardTimeout) clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => setKeyboardVisible(false), 10);
      });
    } else {
      keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => {
        if (keyboardTimeout) clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => setKeyboardVisible(true), 10);
      });
      keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => {
        if (keyboardTimeout) clearTimeout(keyboardTimeout);
        keyboardTimeout = setTimeout(() => setKeyboardVisible(false), 10);
      });
    }

    return () => {
      unsubscribe();
      if (keyboardShowListener) keyboardShowListener.remove();
      if (keyboardHideListener) keyboardHideListener.remove();
      if (keyboardTimeout) clearTimeout(keyboardTimeout);
    };
  }, [navigation]);

  // ✅ NEW: Direct mutations replace dispatch pattern
  // No longer needed - using direct mutations

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    inspectorDispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      if (store.hazProPreparerContext.preparer) {
        store.hazProPreparerContext.preparer.certificationDate = date
          .toISOString()
          .split("T")[0];
      }
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerContainer}>
          <Text style={styles.screenTitle}>Create New Shipment</Text>
        </View>

        {/* Shipment Basic Information */}
        <Section title="Shipment Information">
          <FormRow>
            <FormField
              label="TCN"
              required
              error={errors.tcn?.message}
              flex={1}
            >
              <Controller
                control={control}
                name="tcn"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    inputRef={getRef(0)}
                    onSubmit={() => focusNext(0)}
                    placeholder="17 digits"
                    value={value}
                    onChangeText={text => {
                      onChange(text);
                      if (store.hazProPreparerContext.shipment) {
                        store.hazProPreparerContext.shipment.tcn = text;
                      }
                    }}
                    onBlur={onBlur}
                    keyboardType="default"
                    maxLength={17}
                    error={errors.tcn}
                  />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow>
            <FormField
              label="Port of Embarkation (POE)"
              required
              error={errors.poeOption?.message}
              flex={1}
            >
              <View style={styles.radioGroup}>
                <RadioOption
                  label="Channel"
                  selected={
                    state.hazProPreparerContext.shipment?.poeOption ===
                    "Channel"
                  }
                  onPress={() => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.poeOption =
                        "Channel";
                      store.hazProPreparerContext.shipment.poe = "";
                    }
                    if (store.hazProPreparerContext.shipper) {
                      store.hazProPreparerContext.shipper.worldwideMobility =
                        false;
                      if (store.hazProPreparerContext.shipper.address) {
                        store.hazProPreparerContext.shipper.address.shipperLocation =
                          "";
                        store.hazProPreparerContext.shipper.address.shipperStreet =
                          "";
                        store.hazProPreparerContext.shipper.address.shipperCity =
                          "";
                        store.hazProPreparerContext.shipper.address.shipperState =
                          "";
                        store.hazProPreparerContext.shipper.address.shipperZipcode =
                          "";
                        store.hazProPreparerContext.shipper.address.selectedShipperCountry =
                          "";
                      }
                      store.hazProPreparerContext.shipper.phoneNumber = null;
                    }
                  }}
                />
                <RadioOption
                  label="Worldwide Mobility"
                  selected={
                    state.hazProPreparerContext.shipment?.poeOption ===
                    "Worldwide Mobility"
                  }
                  onPress={() => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.poeOption =
                        "Worldwide Mobility";
                      store.hazProPreparerContext.shipment.poe =
                        "WORLDWIDE MOBILITY";
                    }
                    if (store.hazProPreparerContext.shipper) {
                      store.hazProPreparerContext.shipper.worldwideMobility =
                        true;
                      if (store.hazProPreparerContext.shipper.address) {
                        store.hazProPreparerContext.shipper.address.shipperLocation =
                          null;
                        store.hazProPreparerContext.shipper.address.shipperStreet =
                          null;
                        store.hazProPreparerContext.shipper.address.shipperCity =
                          null;
                        store.hazProPreparerContext.shipper.address.shipperState =
                          null;
                        store.hazProPreparerContext.shipper.address.shipperZipcode =
                          null;
                        store.hazProPreparerContext.shipper.address.selectedShipperCountry =
                          null;
                      }
                      store.hazProPreparerContext.shipper.phoneNumber = null;
                    }
                  }}
                />
              </View>
            </FormField>

            <FormField
              label="Port of Debarkation (POD)"
              required
              error={errors.podOption?.message}
              flex={1}
            >
              <View style={styles.radioGroup}>
                <RadioOption
                  label="Channel"
                  selected={
                    state.hazProPreparerContext.shipment?.podOption ===
                    "Channel"
                  }
                  onPress={() => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.podOption =
                        "Channel";
                      store.hazProPreparerContext.shipment.pod = "";
                    }
                    if (store.hazProPreparerContext.consignee) {
                      store.hazProPreparerContext.consignee.worldwideMobility =
                        false;
                      if (store.hazProPreparerContext.consignee.address) {
                        store.hazProPreparerContext.consignee.address.consigneeDodaac =
                          "";
                        store.hazProPreparerContext.consignee.address.consigneeStreet =
                          "";
                        store.hazProPreparerContext.consignee.address.consigneeCity =
                          "";
                        store.hazProPreparerContext.consignee.address.consigneeState =
                          "";
                        store.hazProPreparerContext.consignee.address.consigneeZipcode =
                          "";
                        store.hazProPreparerContext.consignee.address.selectedConsigneeCountry =
                          "";
                      }
                      store.hazProPreparerContext.consignee.phoneNumber = null;
                    }
                  }}
                />
                <RadioOption
                  label="Worldwide Mobility"
                  selected={
                    state.hazProPreparerContext.shipment?.podOption ===
                    "Worldwide Mobility"
                  }
                  onPress={() => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.podOption =
                        "Worldwide Mobility";
                      store.hazProPreparerContext.shipment.pod =
                        "WORLDWIDE MOBILITY";
                    }
                    if (store.hazProPreparerContext.consignee) {
                      store.hazProPreparerContext.consignee.worldwideMobility =
                        true;
                      if (store.hazProPreparerContext.consignee.address) {
                        store.hazProPreparerContext.consignee.address.consigneeDodaac =
                          null;
                        store.hazProPreparerContext.consignee.address.consigneeStreet =
                          null;
                        store.hazProPreparerContext.consignee.address.consigneeCity =
                          null;
                        store.hazProPreparerContext.consignee.address.consigneeState =
                          null;
                        store.hazProPreparerContext.consignee.address.consigneeZipcode =
                          null;
                        store.hazProPreparerContext.consignee.address.selectedConsigneeCountry =
                          null;
                      }
                      store.hazProPreparerContext.consignee.phoneNumber = null;
                    }
                  }}
                />
              </View>
            </FormField>
          </FormRow>

          <FormRow>
            <FormField
              label="Is this shipment moving under the authority of Chapter 3?"
              required
              error={errors.isChapter3?.message}
            >
              <View style={styles.radioGroup}>
                <RadioOption
                  label="Yes"
                  selected={
                    state.hazProPreparerContext.shipment?.isChapter3 === "Yes"
                  }
                  onPress={() => {
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.isChapter3 = "Yes";
                    }
                  }}
                />
                <RadioOption
                  label="No"
                  selected={
                    state.hazProPreparerContext.shipment?.isChapter3 === "No"
                  }
                  onPress={() => {
                    if (store.hazProPreparerContext.shipment) {
                      store.hazProPreparerContext.shipment.isChapter3 = "No";
                    }
                  }}
                />
              </View>
            </FormField>
          </FormRow>

          {state.hazProPreparerContext.shipment?.poeOption === "Channel" && (
            <FormRow>
              <FormField
                label="POE Details"
                required
                error={errors.poe?.message}
              >
                <Controller
                  control={control}
                  name="poe"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(1)}
                      onSubmit={() => focusNext(1)}
                      placeholder="Enter POE"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipment) {
                          store.hazProPreparerContext.shipment.poe = text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.poe}
                    />
                  )}
                />
              </FormField>
            </FormRow>
          )}

          {state.hazProPreparerContext.shipment?.podOption === "Channel" && (
            <FormRow>
              <FormField
                label="POD Details"
                required
                error={errors.pod?.message}
              >
                <Controller
                  control={control}
                  name="pod"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(2)}
                      onSubmit={() => focusNext(2)}
                      placeholder="Enter POD"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipment) {
                          store.hazProPreparerContext.shipment.pod = text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.pod}
                    />
                  )}
                />
              </FormField>
            </FormRow>
          )}
        </Section>

        {/* Shipper Information */}
        {state.hazProPreparerContext.shipment?.poeOption === "Channel" ? (
          <Section title="Shipper Information">
            <FormRow>
              <FormField
                label="Country"
                required
                error={errors.shipperCountry?.message}
              >
                <TextInput
                  ref={getRef(3)}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => focusNext(3)}
                  placeholder="Search country"
                  value={
                    state.hazProPreparerContext.shipper?.address
                      .selectedShipperCountry || ""
                  }
                  onChangeText={text => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipper?.address) {
                      store.hazProPreparerContext.shipper.address.selectedShipperCountry =
                        text;
                    }
                    setShowShipperCountrySuggestions(true);
                  }}
                  style={[
                    styles.textInput,
                    errors.shipperCountry ? styles.inputError : null,
                  ]}
                  onFocus={() => setShowShipperCountrySuggestions(true)}
                />
                {showShipperCountrySuggestions && (
                  <View style={styles.suggestionContainer}>
                    {countries
                      .filter(c =>
                        c.name
                          .toLowerCase()
                          .includes(
                            state.hazProPreparerContext.shipper?.address?.selectedShipperCountry?.toLowerCase() ||
                              ""
                          )
                      )
                      .slice(0, 5)
                      .map(item => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.suggestionItem}
                          onPress={() => {
                            // ✅ NEW: Direct mutations replace dispatch pattern
                            if (store.hazProPreparerContext.shipper?.address) {
                              store.hazProPreparerContext.shipper.address.selectedShipperCountry =
                                item.name;
                            }
                            setShowShipperCountrySuggestions(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>
                            {item.name} ({item.code})
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </FormField>
            </FormRow>

            <FormRow>
              <FormField
                label="Location Name"
                required
                error={errors.shipperLocation?.message}
              >
                <Controller
                  control={control}
                  name="shipperLocation"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(4)}
                      onSubmit={() => focusNext(4)}
                      placeholder="Enter location name"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipper?.address) {
                          store.hazProPreparerContext.shipper.address.shipperLocation =
                            text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.shipperLocation}
                    />
                  )}
                />
              </FormField>
            </FormRow>

            <PhoneNumberInput
              getRef={getRef}
              focusNext={focusNext}
              target="shipper"
            />

            <FormRow>
              <FormField
                label="Street"
                required
                error={errors.shipperStreet?.message}
                flex={3}
              >
                <Controller
                  control={control}
                  name="shipperStreet"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(8)}
                      onSubmit={() => focusNext(8)}
                      placeholder="Enter street address"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipper?.address) {
                          store.hazProPreparerContext.shipper.address.shipperStreet =
                            text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.shipperStreet}
                    />
                  )}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField
                label="City"
                required
                error={errors.shipperCity?.message}
                flex={2}
              >
                <Controller
                  control={control}
                  name="shipperCity"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(9)}
                      onSubmit={() => focusNext(9)}
                      placeholder="Enter city"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipper?.address) {
                          store.hazProPreparerContext.shipper.address.shipperCity =
                            text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.shipperCity}
                    />
                  )}
                />
              </FormField>

              <FormField label="State" flex={1}>
                <FormInput
                  inputRef={getRef(10)}
                  onSubmit={() => focusNext(10)}
                  placeholder="Enter state"
                  value={
                    state.hazProPreparerContext.shipper?.address.shipperState ||
                    ""
                  }
                  onChangeText={value => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.shipper?.address) {
                      store.hazProPreparerContext.shipper.address.shipperState =
                        value;
                    }
                  }}
                  disabled={
                    state.hazProPreparerContext.shipper?.address
                      .selectedShipperCountry !== "United States of America"
                  }
                  editable={
                    state.hazProPreparerContext.shipper?.address
                      .selectedShipperCountry === "United States of America"
                  }
                />
              </FormField>

              <FormField
                label="Zip Code"
                required
                error={errors.shipperZipcode?.message}
                flex={1}
              >
                <Controller
                  control={control}
                  name="shipperZipcode"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(11)}
                      onSubmit={() => focusNext(11)}
                      placeholder="Enter zip code"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.shipper?.address) {
                          store.hazProPreparerContext.shipper.address.shipperZipcode =
                            text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.shipperZipcode}
                    />
                  )}
                />
              </FormField>
            </FormRow>
          </Section>
        ) : state.hazProPreparerContext.shipment?.poeOption ===
          "Worldwide Mobility" ? (
          <Section title="Shipper Information">
            <FormRow>
              <FormField label="Location Name">
                <FormInput
                  value="WORLDWIDE MOBILITY"
                  disabled={true}
                  editable={false}
                />
              </FormField>
            </FormRow>
          </Section>
        ) : null}

        {/* Consignee Information */}
        {state.hazProPreparerContext.shipment?.podOption === "Channel" ? (
          <Section title="Consignee Information">
            <FormRow>
              <FormField
                label="Country"
                required
                error={errors.consigneeCountry?.message}
              >
                <TextInput
                  ref={getRef(12)}
                  returnKeyType="next"
                  submitBehavior="submit"
                  onSubmitEditing={() => focusNext(12)}
                  placeholder="Search country"
                  value={
                    state.hazProPreparerContext.consignee?.address
                      .selectedConsigneeCountry || ""
                  }
                  onChangeText={text => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.consignee?.address) {
                      store.hazProPreparerContext.consignee.address.selectedConsigneeCountry =
                        text;
                    }
                    setShowConsigneeCountrySuggestions(true);
                  }}
                  style={[
                    styles.textInput,
                    errors.consigneeCountry ? styles.inputError : null,
                  ]}
                  onFocus={() => setShowConsigneeCountrySuggestions(true)}
                />
                {showConsigneeCountrySuggestions && (
                  <View style={styles.suggestionContainer}>
                    {countries
                      .filter(c =>
                        c.name
                          .toLowerCase()
                          .includes(
                            state.hazProPreparerContext.consignee?.address.selectedConsigneeCountry?.toLowerCase() ||
                              ""
                          )
                      )
                      .slice(0, 5)
                      .map(item => (
                        <TouchableOpacity
                          key={item.code}
                          style={styles.suggestionItem}
                          onPress={() => {
                            // ✅ NEW: Direct mutations replace dispatch pattern
                            if (
                              store.hazProPreparerContext.consignee?.address
                            ) {
                              store.hazProPreparerContext.consignee.address.selectedConsigneeCountry =
                                item.name;
                            }
                            setShowConsigneeCountrySuggestions(false);
                          }}
                        >
                          <Text style={styles.suggestionText}>
                            {item.name} ({item.code})
                          </Text>
                        </TouchableOpacity>
                      ))}
                  </View>
                )}
              </FormField>
            </FormRow>

            <FormRow>
              <FormField
                label="DODAAC"
                required
                error={errors.consigneeDodaac?.message}
              >
                <Controller
                  control={control}
                  name="consigneeDodaac"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      inputRef={getRef(13)}
                      onSubmit={() => focusNext(13)}
                      placeholder="Enter DODAAC"
                      value={value}
                      onChangeText={text => {
                        onChange(text);
                        // ✅ NEW: Direct mutations replace dispatch pattern
                        if (store.hazProPreparerContext.consignee?.address) {
                          store.hazProPreparerContext.consignee.address.consigneeDodaac =
                            text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.consigneeDodaac}
                    />
                  )}
                />
              </FormField>
            </FormRow>

            <PhoneNumberInput
              getRef={getRef}
              focusNext={focusNext}
              target="consignee"
            />

            <FormRow>
              <FormField label="Street" flex={3}>
                <FormInput
                  inputRef={getRef(17)}
                  onSubmit={() => focusNext(17)}
                  placeholder="Enter street address"
                  value={
                    state.hazProPreparerContext.consignee?.address
                      .consigneeStreet || ""
                  }
                  onChangeText={value => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.consignee?.address) {
                      store.hazProPreparerContext.consignee.address.consigneeStreet =
                        value;
                    }
                  }}
                />
              </FormField>
            </FormRow>

            <FormRow>
              <FormField label="City" flex={2}>
                <FormInput
                  inputRef={getRef(18)}
                  onSubmit={() => focusNext(18)}
                  placeholder="Enter city"
                  value={
                    state.hazProPreparerContext.consignee?.address
                      .consigneeCity || ""
                  }
                  onChangeText={value => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.consignee?.address) {
                      store.hazProPreparerContext.consignee.address.consigneeCity =
                        value;
                    }
                  }}
                />
              </FormField>

              <FormField label="State" flex={1}>
                <FormInput
                  inputRef={getRef(19)}
                  onSubmit={() => focusNext(19)}
                  placeholder="Enter state"
                  value={
                    state.hazProPreparerContext.consignee?.address
                      .consigneeState || ""
                  }
                  onChangeText={value => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.consignee?.address) {
                      store.hazProPreparerContext.consignee.address.consigneeState =
                        value;
                    }
                  }}
                />
              </FormField>

              <FormField label="Zip Code" flex={1}>
                <FormInput
                  inputRef={getRef(20)}
                  onSubmit={() => focusNext(20)}
                  placeholder="Enter zip code"
                  value={
                    state.hazProPreparerContext.consignee?.address
                      .consigneeZipcode || ""
                  }
                  onChangeText={value => {
                    // ✅ NEW: Direct mutations replace dispatch pattern
                    if (store.hazProPreparerContext.consignee?.address) {
                      store.hazProPreparerContext.consignee.address.consigneeZipcode =
                        value;
                    }
                  }}
                />
              </FormField>
            </FormRow>
          </Section>
        ) : state.hazProPreparerContext.shipment?.podOption ===
          "Worldwide Mobility" ? (
          <Section title="Consignee Information">
            <FormRow>
              <FormField label="DODAAC">
                <FormInput
                  value="WORLDWIDE MOBILITY"
                  disabled={true}
                  editable={false}
                />
              </FormField>
            </FormRow>
          </Section>
        ) : null}

        {/* Preparer Information */}
        <Section title="Preparer Information" last={true}>
          <FormRow>
            <FormField
              label="Preparer Name"
              required
              error={errors.preparerName?.message}
              flex={1}
            >
              <Controller
                control={control}
                name="preparerName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    inputRef={getRef(21)}
                    onSubmit={() => focusNext(21)}
                    placeholder="Enter preparer name"
                    value={value}
                    onChangeText={text => {
                      onChange(text);
                      // ✅ NEW: Direct mutations replace dispatch pattern
                      if (store.hazProPreparerContext.preparer) {
                        store.hazProPreparerContext.preparer.preparerName =
                          text;
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.preparerName}
                    editable={false}
                    style={styles.disabledInput}
                  />
                )}
              />
            </FormField>

            <FormField label="Preparer Rank (optional)" flex={1}>
              <Controller
                control={control}
                name="preparerRank"
                render={({ field: { value } }) => (
                  <FormInput
                    inputRef={getRef(22)}
                    onSubmit={() => focusNext(22)}
                    placeholder="Enter rank (if applicable)"
                    value={value}
                    onChangeText={() => {}}
                    editable={false}
                    style={styles.disabledInput}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Preparer Title"
              required
              error={errors.preparerTitle?.message}
              flex={1}
            >
              <Controller
                control={control}
                name="preparerTitle"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    inputRef={getRef(23)}
                    onSubmit={() => focusNext(23)}
                    placeholder="Enter title"
                    value={value}
                    onChangeText={text => {
                      onChange(text);
                      // ✅ NEW: Direct mutations replace dispatch pattern
                      if (store.hazProPreparerContext.preparer) {
                        store.hazProPreparerContext.preparer.preparerTitle =
                          text;
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.preparerTitle}
                    editable={false}
                    style={styles.disabledInput}
                  />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow lastRow>
            <FormField
              label="Certification Place"
              required
              error={errors.certificationPlace?.message}
              flex={2}
            >
              <Controller
                control={control}
                name="certificationPlace"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    inputRef={getRef(24)}
                    onSubmit={() => focusNext(24)}
                    placeholder="Enter certification place"
                    value={value}
                    onChangeText={text => {
                      onChange(text);
                      // ✅ NEW: Direct mutations replace dispatch pattern
                      if (store.hazProPreparerContext.preparer) {
                        store.hazProPreparerContext.preparer.certificationPlace =
                          text;
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.certificationPlace}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Certification Date"
              required
              error={errors.certificationDate?.message}
              flex={1}
            >
              <Controller
                control={control}
                name="certificationDate"
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    style={[
                      styles.datePickerButton,
                      error ? styles.inputError : null,
                    ]}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.datePickerText}>
                      {value || "Select Date"}
                    </Text>
                  </TouchableOpacity>
                )}
              />

              {showDatePicker && (
                <DateTimePicker
                  value={selectedDate || new Date()}
                  mode="date"
                  display={Platform.OS === "ios" ? "spinner" : "default"}
                  onChange={(event, selected) => {
                    setShowDatePicker(false);
                    if (selected) {
                      setSelectedDate(selected);
                      const formattedDate = selected
                        .toISOString()
                        .split("T")[0];
                      setValue("certificationDate", formattedDate);
                      // ✅ NEW: Direct mutations replace dispatch pattern
                      if (store.hazProPreparerContext.preparer) {
                        store.hazProPreparerContext.preparer.certificationDate =
                          formattedDate;
                      }
                    }
                  }}
                />
              )}
            </FormField>
          </FormRow>
        </Section>
      </ScrollView>
      {!isKeyboardVisible && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => {
              // resetContext();
              navigate("PreparerHomeStack", { screen: "PreparerHome" });
            }}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate("MaterialID")}
          >
            <Text style={styles.buttonText}>Save & Continue</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

export default ShipmentCreationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 30,
  },
  headerContainer: {
    marginBottom: 16,
    alignItems: "center",
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0b2e59",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonContainer: {
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
    borderColor: colors.blue,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
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
  disabledButton: {
    backgroundColor: "#a0a0a0",
    opacity: 0.7,
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
  progressIndicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  progressStep: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  activeStep: {
    backgroundColor: "#0066cc",
  },
  progressStepText: {
    fontWeight: "bold",
    color: "#555",
    fontSize: 14,
  },
  activeStepText: {
    color: "#fff",
  },
  progressLine: {
    width: 50,
    height: 2,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 6,
  },
  section: {
    marginBottom: 0,
    paddingVertical: 12,
    paddingHorizontal: 0,
    backgroundColor: "#f8f9fa",
  },
  sectionWithBorder: {
    borderBottomWidth: 1,
    borderBottomColor: "#ced4da",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b2e59",
    marginBottom: 12,
  },
  formRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 14,
  },
  formRowWithGap: {
    marginBottom: 14,
  },
  fieldContainer: {
    marginHorizontal: 4,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 6,
    color: "#333",
  },
  requiredStar: {
    color: "#cc0000",
  },
  textInput: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 10,
    fontSize: 15,
    backgroundColor: "#fff",
    color: "#333",
    minWidth: 100,
  },
  inputError: {
    borderColor: "#dc3545",
    borderWidth: 1.5,
  },
  disabledInput: {
    backgroundColor: "#e9ecef",
    color: "#6c757d",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 12,
    marginTop: 2,
    marginLeft: 2,
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  radioButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
    marginBottom: 6,
    minWidth: 120,
    height: 40,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#0066cc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  selectedRadioCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#0066cc",
  },
  radioLabel: {
    fontSize: 15,
    color: "#333",
  },
  suggestionContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    marginTop: 2,
    maxHeight: 180,
    zIndex: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  suggestionText: {
    fontSize: 14,
    color: "#333",
  },
  datePickerButton: {
    height: 42,
    borderWidth: 1,
    borderColor: "#ced4da",
    borderRadius: 4,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  datePickerText: {
    fontSize: 15,
    color: "#333",
  },
});
