import React, { useEffect, useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import PackagingTypeCard from '@/components/PackagingWizardV2/PackagingTypeCard';
import {
  ActionFooter,
  InfoBox,
  borderRadius,
  colors,
  shadows,
  spacing,
  typography,
} from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { evaluateAttachment19Eligibility } from '@/utils/eligibility/attachment19Eligibility';

type WeightUnit = 'kg' | 'lbs';
type PackagingMethod = 'combination' | 'large' | 'heavy';

const KG_TO_LBS = 2.20462;
const LBS_TO_KG = 0.453592;
const HEAVY_BATTERY_THRESHOLD_KG = 12;

const LITHIUM_PACKAGING_METHODS: Array<{
  key: PackagingMethod;
  label: string;
  description: string;
  alwaysShown: boolean;
}> = [
  {
    key: 'combination',
    label: 'Combination Packaging',
    description: 'Inner packagings in an outer packaging',
    alwaysShown: true,
  },
  {
    key: 'large',
    label: 'Large Packaging',
    description: 'Single battery in a large outer packaging',
    alwaysShown: true,
  },
  {
    key: 'heavy',
    label: 'Strong Outer Packaging (>12kg)',
    description:
      'Individual battery exceeding 12kg in strong outer packaging or on pallet. Identified as P4 for movement with passengers.',
    alwaysShown: false,
  },
];

const parseNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const LithiumBatteryQuantityScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, store, actions } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;
  const existingBatteryData = state.hazProPreparerContext.lithiumBatteryData as any;
  const unid = material?.unid?.toUpperCase() || '';
  const isMetal = unid === 'UN3090';

  const [step, setStep] = useState(0);
  const [numberOfBatteries, setNumberOfBatteries] = useState(
    existingBatteryData?.quantityOfBatteries
      ? String(existingBatteryData.quantityOfBatteries)
      : ''
  );
  const [weightPerBattery, setWeightPerBattery] = useState(
    existingBatteryData?.weightPerBattery?.value
      ? String(existingBatteryData.weightPerBattery.value)
      : ''
  );
  const [weightPerBatteryUnit, setWeightPerBatteryUnit] = useState<WeightUnit>(
    existingBatteryData?.weightPerBattery?.unit === 'lb' ? 'lbs' : 'kg'
  );
  const [totalWeight, setTotalWeight] = useState(
    existingBatteryData?.totalWeight?.value
      ? String(existingBatteryData.totalWeight.value)
      : ''
  );
  const [totalWeightUnit, setTotalWeightUnit] = useState<WeightUnit>(
    existingBatteryData?.totalWeight?.unit === 'lb' ? 'lbs' : 'kg'
  );
  const [hasManualTotal, setHasManualTotal] = useState(
    Boolean(existingBatteryData?.totalWeight?.value)
  );
  const [wattHourRating, setWattHourRating] = useState(
    existingBatteryData?.wattHourRating ? String(existingBatteryData.wattHourRating) : ''
  );
  const [lithiumContentInGrams, setLithiumContentInGrams] = useState(
    existingBatteryData?.lithiumContentInGrams
      ? String(existingBatteryData.lithiumContentInGrams)
      : ''
  );
  const [packagingMethod, setPackagingMethod] = useState<PackagingMethod | ''>(
    existingBatteryData?.packagingMethod || ''
  );

  useEffect(() => {
    if (hasManualTotal) return;
    const count = parseNumber(numberOfBatteries);
    const perBattery = parseNumber(weightPerBattery);
    if (count === null || perBattery === null) return;

    const total = count * perBattery;
    setTotalWeight(total > 0 ? String(total) : '');
    setTotalWeightUnit(weightPerBatteryUnit);
  }, [hasManualTotal, numberOfBatteries, weightPerBattery, weightPerBatteryUnit]);

  const weightPerBatteryKg = useMemo(() => {
    const value = parseNumber(weightPerBattery);
    if (value === null) return 0;
    return weightPerBatteryUnit === 'lbs' ? value * LBS_TO_KG : value;
  }, [weightPerBattery, weightPerBatteryUnit]);

  const totalWeightKg = useMemo(() => {
    const value = parseNumber(totalWeight);
    if (value === null) return 0;
    return totalWeightUnit === 'lbs' ? value * LBS_TO_KG : value;
  }, [totalWeight, totalWeightUnit]);

  const exceedsTwelveKg = weightPerBatteryKg > HEAVY_BATTERY_THRESHOLD_KG;

  useEffect(() => {
    if (packagingMethod === 'heavy' && !exceedsTwelveKg) {
      setPackagingMethod('');
    }
  }, [exceedsTwelveKg, packagingMethod]);

  const meetsExceptedQuantity = useMemo(() => {
    const batteryCount = parseNumber(numberOfBatteries);
    if (batteryCount === null) return false;

    if (isMetal) {
      const lithiumContent = parseNumber(lithiumContentInGrams) || 0;
      if (lithiumContent > 2) return false;
      if (lithiumContent > 0.3 && lithiumContent <= 2 && batteryCount > 2) return false;
      if (lithiumContent <= 0.3 && totalWeightKg > 2.5) return false;
      return lithiumContent > 0;
    }

    const wattHour = parseNumber(wattHourRating) || 0;
    if (wattHour > 100) return false;
    if (totalWeightKg > 5) return false;
    return wattHour > 0;
  }, [
    isMetal,
    lithiumContentInGrams,
    numberOfBatteries,
    totalWeightKg,
    wattHourRating,
  ]);

  const hasEqInput = isMetal
    ? (parseNumber(lithiumContentInGrams) ?? 0) > 0
    : (parseNumber(wattHourRating) ?? 0) > 0;

  const isStep1Valid = useMemo(() => {
    const count = parseNumber(numberOfBatteries);
    const perBattery = parseNumber(weightPerBattery);
    const total = parseNumber(totalWeight);
    if (count === null || count <= 0) return false;
    if (perBattery === null || perBattery <= 0) return false;
    if (total === null || total <= 0) return false;

    if (isMetal) {
      const lithiumContent = parseNumber(lithiumContentInGrams);
      return lithiumContent !== null && lithiumContent > 0;
    }

    const wattHour = parseNumber(wattHourRating);
    return wattHour !== null && wattHour > 0;
  }, [
    isMetal,
    lithiumContentInGrams,
    numberOfBatteries,
    totalWeight,
    wattHourRating,
    weightPerBattery,
  ]);

  const markGeneralPackagingAcknowledged = () => {
    if (!store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements = {
        generalPackagingRequirementsAcknowledged: false,
        informativeStatementsAcknowledged: false,
        workflowModifiersAcknowledged: false,
        specialProvisionsAcknowledged: false,
        documentNodeInformativeStatements: [],
        documentNodeWorkflowModifiers: [],
        specialProvisionsInformativeStatements: {},
        specialProvisionsWorkflowModifiers: {},
      };
    }

    store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
      true;
  };

  const saveBatteryDataToContext = () => {
    const batteryCount = parseNumber(numberOfBatteries) ?? 0;
    const totalValue = parseNumber(totalWeight) ?? 0;
    const perBatteryValue = parseNumber(weightPerBattery) ?? 0;

    store.hazProPreparerContext.lithiumBatteryData = {
      batteryType: isMetal ? 'lithium_metal' : 'lithium_ion',
      packagingMethod,
      outerPackagingType: existingBatteryData?.outerPackagingType || '',
      innerPackagingDescription: existingBatteryData?.innerPackagingDescription || '',
      quantityOfBatteries: batteryCount,
      weightPerBattery: {
        value: perBatteryValue,
        unit: weightPerBatteryUnit === 'lbs' ? 'lb' : weightPerBatteryUnit,
      },
      totalWeight: {
        value: totalValue,
        unit: totalWeightUnit === 'lbs' ? 'lb' : totalWeightUnit,
      },
      safetyFeatures: existingBatteryData?.safetyFeatures || {
        shortCircuitProtection: false,
        safetyVent: false,
        reverseCurrentProtection: false,
      },
      meetsUN38Requirements: existingBatteryData?.meetsUN38Requirements || false,
      isDefectiveOrDamaged: existingBatteryData?.isDefectiveOrDamaged || false,
      specialInstructions: existingBatteryData?.specialInstructions || '',
      handlingInstructions:
        existingBatteryData?.handlingInstructions ||
        'Protect from damage. Prevent short circuits. Keep away from other hazardous materials.',
      wattHourRating: parseNumber(wattHourRating) ?? 0,
      lithiumContentInGrams: parseNumber(lithiumContentInGrams) ?? 0,
    } as any;

    store.hazProPreparerContext.lithiumBatteryExceptionParameters = {
      wattHourRating: parseNumber(wattHourRating) ?? 0,
      quantityIn_Kgs: totalWeightKg,
      lithiumContentInGrams: parseNumber(lithiumContentInGrams) ?? 0,
      numberOfLithiumBatteries: batteryCount,
    };

    store.hazProPreparerContext.isLithiumBatteryExceptedQuantity = meetsExceptedQuantity;

    if (store.hazProPreparerContext.packaging) {
      store.hazProPreparerContext.packaging.packagingType =
        packagingMethod === 'combination' ? 'Combination' : 'Single';
      store.hazProPreparerContext.packaging.selectedPackagingOptionId = undefined;
    }
  };

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }

    setStep(0);
  };

  const handleNext = () => {
    if (step === 0) {
      if (!isStep1Valid) return;
      setStep(1);
      return;
    }

    if (!material || !packagingMethod) return;

    saveBatteryDataToContext();

    store.hazProPreparerContext.completedSubsteps = [
      ...(state.hazProPreparerContext.completedSubsteps || []).filter(
        substep => substep !== 'LithiumBatteryQuantity'
      ),
      'LithiumBatteryQuantity',
    ];

    const eligibility = evaluateAttachment19Eligibility({
      material,
      quantities: {
        numberOfInnerPackages: parseNumber(numberOfBatteries) ?? 1,
        quantityPerInnerPackage: {
          value:
            (parseNumber(weightPerBattery) ?? 0) *
            (weightPerBatteryUnit === 'lbs' ? LBS_TO_KG : 1) *
            1000,
          unit: 'g',
        },
        totalPerPackage: {
          value: totalWeightKg,
          unit: 'kg',
        },
        grossWeight: {
          value: totalWeightKg,
          unit: 'kg',
        },
      },
    });

    if (eligibility.quantityType === 'excepted') {
      actions.updateExceptedQuantityData(eligibility.exceptedQuantityData);
      actions.setIsExceptedQuantity(true);
      actions.setIsLimitedQuantity(false);
      navigation.navigate('ExceptedQuantityPackagingGuidance');
      return;
    }

    if (eligibility.quantityType === 'limited') {
      actions.updateLimitedQuantityData(eligibility.limitedQuantityData);
      actions.setIsLimitedQuantity(true);
      actions.setIsExceptedQuantity(false);
      navigation.navigate('LimitedQuantityPackagingGuidance');
      return;
    }

    actions.clearExceptedLimitedQuantityData();
    markGeneralPackagingAcknowledged();
    navigation.navigate('SpecialProvisionsAcknowledgement');
  };

  if (!material) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No hazardous material selected. Please go back and select a material.
        </Text>
      </View>
    );
  }

  const renderBatteryDetailsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Battery Details</Text>
      <Text style={styles.stepDescription}>
        Enter quantity and weight information for your{' '}
        {isMetal ? 'lithium metal' : 'lithium ion'} batteries.
      </Text>

      <Text style={styles.inputLabel}>Number of Batteries/Cells *</Text>
      <TextInput
        style={styles.input}
        value={numberOfBatteries}
        onChangeText={setNumberOfBatteries}
        keyboardType="numeric"
        placeholder="e.g., 4"
        placeholderTextColor={colors.textSecondary}
      />

      <Text style={styles.inputLabel}>Weight per Battery *</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          value={weightPerBattery}
          onChangeText={setWeightPerBattery}
          keyboardType="decimal-pad"
          placeholder="e.g., 2.5"
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={weightPerBatteryUnit}
            onValueChange={value => setWeightPerBatteryUnit(value as WeightUnit)}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>
      </View>

      <Text style={styles.inputLabel}>
        Total Weight{!hasManualTotal ? ' (auto-calculated)' : ''}
      </Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          value={totalWeight}
          onChangeText={value => {
            setTotalWeight(value);
            setHasManualTotal(value.trim().length > 0);
          }}
          keyboardType="decimal-pad"
          placeholder="e.g., 10"
          placeholderTextColor={colors.textSecondary}
        />
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={totalWeightUnit}
            onValueChange={value => {
              setTotalWeightUnit(value as WeightUnit);
              setHasManualTotal(totalWeight.trim().length > 0);
            }}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>
      </View>

      {isMetal ? (
        <>
          <Text style={styles.inputLabel}>Lithium Content (g) *</Text>
          <TextInput
            style={styles.input}
            value={lithiumContentInGrams}
            onChangeText={setLithiumContentInGrams}
            keyboardType="decimal-pad"
            placeholder="Enter lithium content in grams"
            placeholderTextColor={colors.textSecondary}
          />
        </>
      ) : (
        <>
          <Text style={styles.inputLabel}>Watt-Hour Rating (Wh) *</Text>
          <TextInput
            style={styles.input}
            value={wattHourRating}
            onChangeText={setWattHourRating}
            keyboardType="decimal-pad"
            placeholder="Enter watt-hour rating"
            placeholderTextColor={colors.textSecondary}
          />
        </>
      )}

      {hasEqInput && (
        <InfoBox
          variant={meetsExceptedQuantity ? 'success' : 'warning'}
          message={
            meetsExceptedQuantity
              ? 'Based on entered values, this shipment qualifies for excepted quantity.'
              : 'Based on entered values, this shipment does not qualify for excepted quantity.'
          }
        />
      )}
    </View>
  );

  const renderPackagingMethodStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Packaging Method</Text>
      <Text style={styles.stepDescription}>
        Choose the packaging method for your{' '}
        {isMetal ? 'lithium metal' : 'lithium ion'} batteries.
      </Text>

      {LITHIUM_PACKAGING_METHODS.filter(
        method => method.alwaysShown || exceedsTwelveKg
      ).map(method => (
        <PackagingTypeCard
          key={method.key}
          type={method.key}
          label={method.label}
          description={method.description}
          innerRequired={method.key === 'combination'}
          selected={packagingMethod === method.key}
          onPress={() => setPackagingMethod(method.key)}
        />
      ))}
    </View>
  );

  const footerButtons = [
    { label: 'Back', onPress: handleBack, variant: 'outline' as const },
    {
      label: 'Next',
      onPress: handleNext,
      disabled: step === 0 ? !isStep1Valid : !packagingMethod,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {step === 0 && renderBatteryDetailsStep()}
            {step === 1 && renderPackagingMethodStep()}
          </ScrollView>
          <ActionFooter buttons={footerButtons} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background },
  scrollView: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },
  stepContainer: {
    marginTop: spacing.lg,
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light,
  },
  stepTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  stepDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
  },
  inputLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  inputFlex: { flex: 2 },
  pickerWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    padding: spacing.xl,
  },
});

export default LithiumBatteryQuantityScreen;
