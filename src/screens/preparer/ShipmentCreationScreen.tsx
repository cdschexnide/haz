// src/screens/preparer/ShipmentCreationScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  FormField,
  FormRow,
  FormInput,
  RadioGroup,
  DatePickerField,
  ActionFooter,
  colors,
  spacing,
  typography,
} from '@/components/ui';
import { AddressFormSection } from '@/components/preparer';
import { PhoneNumberInput } from '@/components/PhoneNumberInput';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { useInputRefs } from '@/utils/hooks/useInputRefs';

// Validation schema - same as original
const schema = yup.object().shape({
  tcn: yup
    .string()
    .length(17, 'TCN must be exactly 17 characters')
    .required('TCN is required'),
  poeOption: yup.string().required('POE option must be selected'),
  podOption: yup.string().required('POD option must be selected'),
  isChapter3: yup.string().required('Chapter 3 option must be selected'),
  poe: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('POE is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  pod: yup.string().when('podOption', {
    is: 'Channel',
    then: () => yup.string().required('POD is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperLocation: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Location Name is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperStreet: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Street is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCity: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper City is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperZipcode: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Zip Code is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  shipperCountry: yup.string().when('poeOption', {
    is: 'Channel',
    then: () => yup.string().required('Shipper Country is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeDodaac: yup.string().when('podOption', {
    is: 'Channel',
    then: () =>
      yup
        .string()
        .length(6, 'DODAAC must be 6 digits')
        .required('Consignee DODAAC is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  consigneeCountry: yup.string().when('podOption', {
    is: 'Channel',
    then: () => yup.string().required('Consignee Country is required'),
    otherwise: () => yup.string().notRequired(),
  }),
  preparerName: yup.string().required('Preparer Name is required'),
  preparerRank: yup.string().notRequired(),
  preparerTitle: yup.string().required('Preparer Title is required'),
  certificationPlace: yup.string().required('Certification Place is required'),
  certificationDate: yup.string().required('Certification Date is required'),
});

// Radio options
const poeOptions = [
  { label: 'Channel', value: 'Channel' },
  { label: 'Worldwide Mobility', value: 'Worldwide Mobility' },
];
const yesNoOptions = [
  { label: 'Yes', value: 'Yes' },
  { label: 'No', value: 'No' },
];

interface ShipmentCreationScreenProps {
  navigation: any;
}

export const ShipmentCreationScreen: React.FC<ShipmentCreationScreenProps> = ({
  navigation,
}) => {
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    state.hazProPreparerContext.preparer?.certificationDate
      ? new Date(state.hazProPreparerContext.preparer?.certificationDate)
      : null
  );

  const {
    control,
    setValue,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    resolver: yupResolver(schema),
    defaultValues: {
      tcn: state.hazProPreparerContext.shipment?.tcn || '',
      poeOption: state.hazProPreparerContext.shipment?.poeOption || '',
      podOption: state.hazProPreparerContext.shipment?.podOption || '',
      isChapter3: state.hazProPreparerContext.shipment?.isChapter3 || '',
      poe: state.hazProPreparerContext.shipment?.poe || '',
      pod: state.hazProPreparerContext.shipment?.pod || '',
      shipperLocation:
        state.hazProPreparerContext.shipper?.address.shipperLocation || '',
      shipperStreet:
        state.hazProPreparerContext.shipper?.address.shipperStreet || '',
      shipperCity:
        state.hazProPreparerContext.shipper?.address.shipperCity || '',
      shipperZipcode:
        state.hazProPreparerContext.shipper?.address.shipperZipcode || '',
      shipperCountry:
        state.hazProPreparerContext.shipper?.address.selectedShipperCountry ||
        '',
      consigneeDodaac:
        state.hazProPreparerContext.consignee?.address.consigneeDodaac || '',
      consigneeCountry:
        state.hazProPreparerContext.consignee?.address
          .selectedConsigneeCountry || '',
      preparerName: state.hazProPreparerContext.preparer?.preparerName || '',
      preparerRank: state.hazProPreparerContext.preparer?.preparerRank || '',
      preparerTitle: state.hazProPreparerContext.preparer?.preparerTitle || '',
      certificationPlace:
        state.hazProPreparerContext.preparer?.certificationPlace || '',
      certificationDate:
        state.hazProPreparerContext.preparer?.certificationDate || '',
    },
  });

  const { getRef, focusNext } = useInputRefs(25);

  // Keyboard visibility and navigation listeners
  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e: any) => {
      e.preventDefault();
      navigation.navigate('PreparerHome');
    });

    const keyboardEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const keyboardHideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showListener = Keyboard.addListener(keyboardEvent, () =>
      setTimeout(() => setKeyboardVisible(true), 10)
    );
    const hideListener = Keyboard.addListener(keyboardHideEvent, () =>
      setTimeout(() => setKeyboardVisible(false), 10)
    );

    return () => {
      unsubscribe();
      showListener.remove();
      hideListener.remove();
    };
  }, [navigation]);

  // Handle POE option change with side effects
  const handlePOEChange = (value: string) => {
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.poeOption = value;
      store.hazProPreparerContext.shipment.poe =
        value === 'Worldwide Mobility' ? 'WORLDWIDE MOBILITY' : '';
    }
    if (store.hazProPreparerContext.shipper) {
      store.hazProPreparerContext.shipper.worldwideMobility =
        value === 'Worldwide Mobility';
      if (store.hazProPreparerContext.shipper.address) {
        const resetValue = value === 'Worldwide Mobility' ? null : '';
        store.hazProPreparerContext.shipper.address.shipperLocation = resetValue;
        store.hazProPreparerContext.shipper.address.shipperStreet = resetValue;
        store.hazProPreparerContext.shipper.address.shipperCity = resetValue;
        store.hazProPreparerContext.shipper.address.shipperState = resetValue;
        store.hazProPreparerContext.shipper.address.shipperZipcode = resetValue;
        store.hazProPreparerContext.shipper.address.selectedShipperCountry = resetValue;
      }
      store.hazProPreparerContext.shipper.phoneNumber = null;
    }
  };

  // Handle POD option change with side effects
  const handlePODChange = (value: string) => {
    if (store.hazProPreparerContext.shipment) {
      store.hazProPreparerContext.shipment.podOption = value;
      store.hazProPreparerContext.shipment.pod =
        value === 'Worldwide Mobility' ? 'WORLDWIDE MOBILITY' : '';
    }
    if (store.hazProPreparerContext.consignee) {
      store.hazProPreparerContext.consignee.worldwideMobility =
        value === 'Worldwide Mobility';
      if (store.hazProPreparerContext.consignee.address) {
        const resetValue = value === 'Worldwide Mobility' ? null : '';
        store.hazProPreparerContext.consignee.address.consigneeDodaac = resetValue;
        store.hazProPreparerContext.consignee.address.consigneeStreet = resetValue;
        store.hazProPreparerContext.consignee.address.consigneeCity = resetValue;
        store.hazProPreparerContext.consignee.address.consigneeState = resetValue;
        store.hazProPreparerContext.consignee.address.consigneeZipcode = resetValue;
        store.hazProPreparerContext.consignee.address.selectedConsigneeCountry = resetValue;
      }
      store.hazProPreparerContext.consignee.phoneNumber = null;
    }
  };

  // Render Shipper section based on POE option
  const renderShipperSection = () => {
    const poeOption = state.hazProPreparerContext.shipment?.poeOption;

    if (poeOption === 'Worldwide Mobility') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipper Information</Text>
          <FormRow>
            <FormField label="Location Name" flex={1}>
              <FormInput value="WORLDWIDE MOBILITY" disabled />
            </FormField>
          </FormRow>
        </View>
      );
    }

    if (poeOption === 'Channel') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipper Information</Text>
          <AddressFormSection
            type="shipper"
            country={
              state.hazProPreparerContext.shipper?.address
                ?.selectedShipperCountry || ''
            }
            onCountryChange={(country) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.selectedShipperCountry =
                  country;
              }
            }}
            countryError={errors.shipperCountry}
            locationOrDodaac={
              state.hazProPreparerContext.shipper?.address?.shipperLocation || ''
            }
            onLocationOrDodaacChange={(value) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.shipperLocation = value;
              }
            }}
            locationOrDodaacError={errors.shipperLocation}
            street={
              state.hazProPreparerContext.shipper?.address?.shipperStreet || ''
            }
            onStreetChange={(value) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.shipperStreet = value;
              }
            }}
            streetError={errors.shipperStreet}
            city={
              state.hazProPreparerContext.shipper?.address?.shipperCity || ''
            }
            onCityChange={(value) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.shipperCity = value;
              }
            }}
            cityError={errors.shipperCity}
            state={
              state.hazProPreparerContext.shipper?.address?.shipperState || ''
            }
            onStateChange={(value) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.shipperState = value;
              }
            }}
            zipCode={
              state.hazProPreparerContext.shipper?.address?.shipperZipcode || ''
            }
            onZipCodeChange={(value) => {
              if (store.hazProPreparerContext.shipper?.address) {
                store.hazProPreparerContext.shipper.address.shipperZipcode = value;
              }
            }}
            zipCodeError={errors.shipperZipcode}
          />
          <PhoneNumberInput getRef={getRef} focusNext={focusNext} target="shipper" />
        </View>
      );
    }

    return null;
  };

  // Render Consignee section based on POD option
  const renderConsigneeSection = () => {
    const podOption = state.hazProPreparerContext.shipment?.podOption;

    if (podOption === 'Worldwide Mobility') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consignee Information</Text>
          <FormRow>
            <FormField label="DODAAC" flex={1}>
              <FormInput value="WORLDWIDE MOBILITY" disabled />
            </FormField>
          </FormRow>
        </View>
      );
    }

    if (podOption === 'Channel') {
      return (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Consignee Information</Text>
          <AddressFormSection
            type="consignee"
            country={
              state.hazProPreparerContext.consignee?.address
                ?.selectedConsigneeCountry || ''
            }
            onCountryChange={(country) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.selectedConsigneeCountry =
                  country;
              }
            }}
            countryError={errors.consigneeCountry}
            locationOrDodaac={
              state.hazProPreparerContext.consignee?.address?.consigneeDodaac ||
              ''
            }
            onLocationOrDodaacChange={(value) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.consigneeDodaac =
                  value;
              }
            }}
            locationOrDodaacError={errors.consigneeDodaac}
            street={
              state.hazProPreparerContext.consignee?.address?.consigneeStreet ||
              ''
            }
            onStreetChange={(value) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.consigneeStreet =
                  value;
              }
            }}
            city={
              state.hazProPreparerContext.consignee?.address?.consigneeCity || ''
            }
            onCityChange={(value) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.consigneeCity =
                  value;
              }
            }}
            state={
              state.hazProPreparerContext.consignee?.address?.consigneeState ||
              ''
            }
            onStateChange={(value) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.consigneeState =
                  value;
              }
            }}
            zipCode={
              state.hazProPreparerContext.consignee?.address?.consigneeZipcode ||
              ''
            }
            onZipCodeChange={(value) => {
              if (store.hazProPreparerContext.consignee?.address) {
                store.hazProPreparerContext.consignee.address.consigneeZipcode =
                  value;
              }
            }}
            streetRequired={false}
            cityRequired={false}
            zipCodeRequired={false}
          />
          <PhoneNumberInput
            getRef={getRef}
            focusNext={focusNext}
            target="consignee"
          />
        </View>
      );
    }

    return null;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.screenTitle}>Create New Shipment</Text>
        </View>

        {/* Shipment Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shipment Information</Text>

          {/* TCN Field */}
          <FormRow>
            <FormField label="TCN" required error={errors.tcn} flex={1}>
              <Controller
                control={control}
                name="tcn"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    ref={getRef(0)}
                    placeholder="17 digits"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      if (store.hazProPreparerContext.shipment) {
                        store.hazProPreparerContext.shipment.tcn = text;
                      }
                    }}
                    onBlur={onBlur}
                    maxLength={17}
                    error={errors.tcn}
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext(0)}
                  />
                )}
              />
            </FormField>
          </FormRow>

          {/* POE and POD Options */}
          <FormRow>
            <View style={{ flex: 1 }}>
              <RadioGroup
                label="Port of Embarkation (POE)"
                options={poeOptions}
                value={state.hazProPreparerContext.shipment?.poeOption || ''}
                onChange={handlePOEChange}
                required
                horizontal
              />
            </View>
            <View style={{ flex: 1 }}>
              <RadioGroup
                label="Port of Debarkation (POD)"
                options={poeOptions}
                value={state.hazProPreparerContext.shipment?.podOption || ''}
                onChange={handlePODChange}
                required
                horizontal
              />
            </View>
          </FormRow>

          {/* Chapter 3 */}
          <RadioGroup
            label="Is this shipment moving under the authority of Chapter 3?"
            options={yesNoOptions}
            value={state.hazProPreparerContext.shipment?.isChapter3 || ''}
            onChange={(value) => {
              if (store.hazProPreparerContext.shipment) {
                store.hazProPreparerContext.shipment.isChapter3 = value;
              }
            }}
            required
            horizontal
          />

          {/* Conditional POE Details */}
          {state.hazProPreparerContext.shipment?.poeOption === 'Channel' && (
            <FormRow>
              <FormField label="POE Details" required error={errors.poe} flex={1}>
                <Controller
                  control={control}
                  name="poe"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      ref={getRef(1)}
                      placeholder="Enter POE"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (store.hazProPreparerContext.shipment) {
                          store.hazProPreparerContext.shipment.poe = text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.poe}
                      returnKeyType="next"
                      onSubmitEditing={() => focusNext(1)}
                    />
                  )}
                />
              </FormField>
            </FormRow>
          )}

          {/* Conditional POD Details */}
          {state.hazProPreparerContext.shipment?.podOption === 'Channel' && (
            <FormRow>
              <FormField label="POD Details" required error={errors.pod} flex={1}>
                <Controller
                  control={control}
                  name="pod"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <FormInput
                      ref={getRef(2)}
                      placeholder="Enter POD"
                      value={value}
                      onChangeText={(text) => {
                        onChange(text);
                        if (store.hazProPreparerContext.shipment) {
                          store.hazProPreparerContext.shipment.pod = text;
                        }
                      }}
                      onBlur={onBlur}
                      error={errors.pod}
                      returnKeyType="next"
                      onSubmitEditing={() => focusNext(2)}
                    />
                  )}
                />
              </FormField>
            </FormRow>
          )}
        </View>

        {/* Shipper Information */}
        {renderShipperSection()}

        {/* Consignee Information */}
        {renderConsigneeSection()}

        {/* Preparer Information Section */}
        <View style={[styles.section, styles.lastSection]}>
          <Text style={styles.sectionTitle}>Preparer Information</Text>

          <FormRow>
            <FormField
              label="Preparer Name"
              required
              error={errors.preparerName}
              flex={1}
            >
              <Controller
                control={control}
                name="preparerName"
                render={({ field: { value } }) => (
                  <FormInput
                    ref={getRef(21)}
                    placeholder="Enter preparer name"
                    value={value}
                    disabled
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext(21)}
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
                    ref={getRef(22)}
                    placeholder="Enter rank (if applicable)"
                    value={value}
                    disabled
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext(22)}
                  />
                )}
              />
            </FormField>

            <FormField
              label="Preparer Title"
              required
              error={errors.preparerTitle}
              flex={1}
            >
              <Controller
                control={control}
                name="preparerTitle"
                render={({ field: { value } }) => (
                  <FormInput
                    ref={getRef(23)}
                    placeholder="Enter title"
                    value={value}
                    disabled
                    returnKeyType="next"
                    onSubmitEditing={() => focusNext(23)}
                  />
                )}
              />
            </FormField>
          </FormRow>

          <FormRow lastRow>
            <FormField
              label="Certification Place"
              required
              error={errors.certificationPlace}
              flex={2}
            >
              <Controller
                control={control}
                name="certificationPlace"
                render={({ field: { onChange, onBlur, value } }) => (
                  <FormInput
                    ref={getRef(24)}
                    placeholder="Enter certification place"
                    value={value}
                    onChangeText={(text) => {
                      onChange(text);
                      if (store.hazProPreparerContext.preparer) {
                        store.hazProPreparerContext.preparer.certificationPlace =
                          text;
                      }
                    }}
                    onBlur={onBlur}
                    error={errors.certificationPlace}
                    returnKeyType="done"
                  />
                )}
              />
            </FormField>

            <View style={{ flex: 1 }}>
              <DatePickerField
                label="Certification Date"
                value={selectedDate}
                onChange={(date) => {
                  setSelectedDate(date);
                  const formattedDate = date.toISOString().split('T')[0];
                  setValue('certificationDate', formattedDate);
                  if (store.hazProPreparerContext.preparer) {
                    store.hazProPreparerContext.preparer.certificationDate =
                      formattedDate;
                  }
                }}
                required
                error={errors.certificationDate}
              />
            </View>
          </FormRow>
        </View>
      </ScrollView>

      {/* Action Footer */}
      {!isKeyboardVisible && (
        <ActionFooter
          buttons={[
            {
              label: 'Cancel',
              onPress: () =>
                navigate('PreparerHomeStack', { screen: 'PreparerHome' }),
              variant: 'outline',
            },
            {
              label: 'Save & Continue',
              onPress: () => navigation.navigate('MaterialID'),
              variant: 'primary',
            },
          ]}
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerContainer: {
    marginBottom: spacing.lg,
    alignItems: 'center',
  },
  screenTitle: {
    ...typography.headerTitle,
    fontSize: 22,
    color: colors.primary,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  section: {
    marginBottom: 0,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  lastSection: {
    borderBottomWidth: 0,
  },
  sectionTitle: {
    ...typography.headerTitle,
    fontSize: 18,
    color: colors.primary,
    marginBottom: spacing.md,
  },
});

export default ShipmentCreationScreen;
