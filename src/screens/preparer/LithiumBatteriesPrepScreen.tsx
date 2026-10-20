// src/screens/preparer/LithiumBatteriesPrepScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useHazProStore } from '@/stores/useHazProStore';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  StepIndicator,
  FormInput,
  RadioGroup,
  InfoBox,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/components/ui';

enum SafetyRequirementStatus {
  NOT_SELECTED = 'not_selected',
  YES = 'yes',
  NO = 'no',
}

const PACKAGING_OPTIONS = [
  { label: 'Combination Packaging', value: 'combination' },
  { label: 'Large Packaging (Single Battery)', value: 'large' },
  { label: 'Batteries Exceeding 12kg', value: 'heavy' },
];

const OUTER_PACKAGING_MAP: Record<string, Array<{ label: string; value: string }>> = {
  combination: [
    { label: 'Metal Box (4A)', value: 'Metal Box (4A)' },
    { label: 'Metal Box (4B)', value: 'Metal Box (4B)' },
    { label: 'Metal Box (4C)', value: 'Metal Box (4C)' },
    { label: 'Wooden Box (4C1)', value: 'Wooden Box (4C1)' },
    { label: 'Wooden Box (4C2)', value: 'Wooden Box (4C2)' },
    { label: 'Wooden Box (4D)', value: 'Wooden Box (4D)' },
    { label: 'Wooden Box (4F)', value: 'Wooden Box (4F)' },
    { label: 'Fiberboard Box (4G)', value: 'Fiberboard Box (4G)' },
    { label: 'Solid Plastic Box (4H1)', value: 'Solid Plastic Box (4H1)' },
    { label: 'Solid Plastic Box (4H2)', value: 'Solid Plastic Box (4H2)' },
    { label: 'Metal Drum (1A2)', value: 'Metal Drum (1A2)' },
    { label: 'Metal Drum (1B2)', value: 'Metal Drum (1B2)' },
    { label: 'Metal Drum (1N2)', value: 'Metal Drum (1N2)' },
    { label: 'Fiber Drum (1G)', value: 'Fiber Drum (1G)' },
    { label: 'Plastic Drum (1H2)', value: 'Plastic Drum (1H2)' },
    { label: 'Plywood Drum (1D)', value: 'Plywood Drum (1D)' },
    { label: 'Plastic Jerrican (3H2)', value: 'Plastic Jerrican (3H2)' },
    { label: 'Metal Jerrican (3A2)', value: 'Metal Jerrican (3A2)' },
    { label: 'Metal Jerrican (3B2)', value: 'Metal Jerrican (3B2)' },
  ],
  large: [
    { label: 'Metal with Non-Conductive Lining (50A)', value: 'Metal with Non-Conductive Lining (50A)' },
    { label: 'Metal with Non-Conductive Lining (50B)', value: 'Metal with Non-Conductive Lining (50B)' },
    { label: 'Metal with Non-Conductive Lining (50C)', value: 'Metal with Non-Conductive Lining (50C)' },
    { label: 'Rigid Plastic (50H)', value: 'Rigid Plastic (50H)' },
    { label: 'Wooden (50C)', value: 'Wooden (50C)' },
    { label: 'Wooden (50D)', value: 'Wooden (50D)' },
    { label: 'Wooden (50F)', value: 'Wooden (50F)' },
    { label: 'Rigid Fiberboard (50G)', value: 'Rigid Fiberboard (50G)' },
  ],
  heavy: [
    { label: 'Strong Outer Packaging', value: 'Strong Outer Packaging' },
    { label: 'Protective Enclosure', value: 'Protective Enclosure' },
    { label: 'Pallet', value: 'Pallet' },
  ],
};

const LithiumBatteriesPrepScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [step, setStep] = useState(0);

  const unid = state.hazProPreparerContext.hazardousMaterial?.unid || '';
  const isMetal = unid === 'UN3090';

  // Form state
  const [selectedPackagingMethod, setSelectedPackagingMethod] = useState('');
  const [selectedOuterPackaging, setSelectedOuterPackaging] = useState('');
  const [innerPackagingDescription, setInnerPackagingDescription] = useState('');
  const [quantityOfBatteries, setQuantityOfBatteries] = useState('');
  const [totalWeight, setTotalWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [wattHourRating, setWattHourRating] = useState('');
  const [lithiumContentInGrams, setLithiumContentInGrams] = useState('');
  const [meetsUN38Requirements, setMeetsUN38Requirements] = useState(SafetyRequirementStatus.NOT_SELECTED);
  const [hasShortCircuitProtection, setHasShortCircuitProtection] = useState(SafetyRequirementStatus.NOT_SELECTED);
  const [hasSafetyVent, setHasSafetyVent] = useState(SafetyRequirementStatus.NOT_SELECTED);
  const [hasReverseCurrentProtection, setHasReverseCurrentProtection] = useState(SafetyRequirementStatus.NOT_SELECTED);
  const [isDefectiveOrDamaged, setIsDefectiveOrDamaged] = useState(SafetyRequirementStatus.NOT_SELECTED);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [meetsExceptedQuantity, setMeetsExceptedQuantity] = useState(false);
  const existingBatteryData = state.hazProPreparerContext.lithiumBatteryData as any;

  useEffect(() => {
    if (!existingBatteryData?.packagingMethod) return;

    setSelectedPackagingMethod(existingBatteryData.packagingMethod);

    if (existingBatteryData.outerPackagingType) {
      setSelectedOuterPackaging(existingBatteryData.outerPackagingType);
    }
    if (existingBatteryData.innerPackagingDescription) {
      setInnerPackagingDescription(existingBatteryData.innerPackagingDescription);
    }
    if (existingBatteryData.quantityOfBatteries) {
      setQuantityOfBatteries(String(existingBatteryData.quantityOfBatteries));
    }
    if (existingBatteryData.totalWeight?.value) {
      setTotalWeight(String(existingBatteryData.totalWeight.value));
      setWeightUnit(existingBatteryData.totalWeight.unit === 'lb' ? 'lbs' : 'kg');
    }
    if (existingBatteryData.wattHourRating) {
      setWattHourRating(String(existingBatteryData.wattHourRating));
    }
    if (existingBatteryData.lithiumContentInGrams) {
      setLithiumContentInGrams(String(existingBatteryData.lithiumContentInGrams));
    }
    if (typeof existingBatteryData.meetsUN38Requirements === 'boolean') {
      setMeetsUN38Requirements(
        existingBatteryData.meetsUN38Requirements
          ? SafetyRequirementStatus.YES
          : SafetyRequirementStatus.NO
      );
    }
    if (typeof existingBatteryData.isDefectiveOrDamaged === 'boolean') {
      setIsDefectiveOrDamaged(
        existingBatteryData.isDefectiveOrDamaged
          ? SafetyRequirementStatus.YES
          : SafetyRequirementStatus.NO
      );
    }
    if (existingBatteryData.safetyFeatures) {
      setHasShortCircuitProtection(
        existingBatteryData.safetyFeatures.shortCircuitProtection
          ? SafetyRequirementStatus.YES
          : SafetyRequirementStatus.NO
      );
      setHasSafetyVent(
        existingBatteryData.safetyFeatures.safetyVent
          ? SafetyRequirementStatus.YES
          : SafetyRequirementStatus.NO
      );
      setHasReverseCurrentProtection(
        existingBatteryData.safetyFeatures.reverseCurrentProtection
          ? SafetyRequirementStatus.YES
          : SafetyRequirementStatus.NO
      );
    }
    if (existingBatteryData.specialInstructions) {
      setSpecialInstructions(existingBatteryData.specialInstructions);
    }

    setStep(1);
  }, []);

  const material = {
    unid,
    properShippingName: state.hazProPreparerContext.hazardousMaterial?.properShippingName || '',
    hazardClass: state.hazProPreparerContext.hazardousMaterial?.hazclassDiv || '',
    packingGroup: state.hazProPreparerContext.hazardousMaterial?.packingGroup,
  };

  const checkExceptedQuantityConditions = (): boolean => {
    if (isMetal) {
      const lithiumContent = parseFloat(lithiumContentInGrams) || 0;
      const batteryCount = parseInt(quantityOfBatteries) || 0;
      const weightInKg = weightUnit === 'kg'
        ? parseFloat(totalWeight) || 0
        : (parseFloat(totalWeight) || 0) * 0.45359237;

      if (lithiumContent > 2) return false;
      if (lithiumContent > 0.3 && lithiumContent <= 2 && batteryCount > 2) return false;
      if (lithiumContent <= 0.3 && weightInKg > 2.5) return false;
      return true;
    } else {
      const wattHour = parseFloat(wattHourRating) || 0;
      const weightInKg = weightUnit === 'kg'
        ? parseFloat(totalWeight) || 0
        : (parseFloat(totalWeight) || 0) * 0.45359237;

      if (wattHour > 100) return false;
      if (weightInKg > 5) return false;
      return true;
    }
  };

  useEffect(() => {
    if (quantityOfBatteries && totalWeight && (isMetal ? lithiumContentInGrams : wattHourRating)) {
      setMeetsExceptedQuantity(checkExceptedQuantityConditions());
    }
  }, [quantityOfBatteries, totalWeight, weightUnit, lithiumContentInGrams, wattHourRating, isMetal]);

  const saveLithiumBatteryData = () => {
    // Note: batteryType uses runtime values that may not match strict type definitions
    // This is consistent with original implementation behavior
    const lithiumBatteryData = {
      batteryType: isMetal ? 'lithium_metal' : 'lithium_ion',
      packagingMethod: selectedPackagingMethod,
      outerPackagingType: selectedOuterPackaging,
      innerPackagingDescription: selectedPackagingMethod === 'combination' ? innerPackagingDescription : '',
      quantityOfBatteries: parseInt(quantityOfBatteries) || 0,
      totalWeight: { value: parseFloat(totalWeight) || 0, unit: weightUnit === 'lbs' ? 'lb' : weightUnit },
      safetyFeatures: {
        shortCircuitProtection: hasShortCircuitProtection === SafetyRequirementStatus.YES,
        safetyVent: hasSafetyVent === SafetyRequirementStatus.YES,
        reverseCurrentProtection: hasReverseCurrentProtection === SafetyRequirementStatus.YES,
      },
      meetsUN38Requirements: meetsUN38Requirements === SafetyRequirementStatus.YES,
      isDefectiveOrDamaged: isDefectiveOrDamaged === SafetyRequirementStatus.YES,
      specialInstructions,
      handlingInstructions: 'Protect from damage. Prevent short circuits. Keep away from other hazardous materials.',
      wattHourRating: parseFloat(wattHourRating) || 0,
      lithiumContentInGrams: parseFloat(lithiumContentInGrams) || 0,
    } as any;

    const lithiumBatteryExceptionParameters = {
      wattHourRating: parseFloat(wattHourRating) || 0,
      quantityIn_Kgs: weightUnit === 'kg'
        ? parseFloat(totalWeight) || 0
        : (parseFloat(totalWeight) || 0) * 0.45359237,
      lithiumContentInGrams: parseFloat(lithiumContentInGrams) || 0,
      numberOfLithiumBatteries: parseInt(quantityOfBatteries) || 0,
    };

    store.hazProPreparerContext.lithiumBatteryData = lithiumBatteryData;
    store.hazProPreparerContext.lithiumBatteryExceptionParameters = lithiumBatteryExceptionParameters;
    store.hazProPreparerContext.isLithiumBatteryExceptedQuantity = checkExceptedQuantityConditions();
  };

  const isStepValid = (): boolean => {
    switch (step) {
      case 0:
        return selectedPackagingMethod !== '';
      case 1:
        return selectedOuterPackaging !== '' &&
          (selectedPackagingMethod !== 'combination' || innerPackagingDescription.trim() !== '');
      case 2:
        const hasValidQuantity = quantityOfBatteries.trim() !== '' &&
          totalWeight.trim() !== '' &&
          !isNaN(parseInt(quantityOfBatteries)) &&
          !isNaN(parseFloat(totalWeight));
        if (isMetal) {
          return hasValidQuantity && lithiumContentInGrams.trim() !== '' && !isNaN(parseFloat(lithiumContentInGrams));
        }
        return hasValidQuantity && wattHourRating.trim() !== '' && !isNaN(parseFloat(wattHourRating));
      case 3:
        return meetsUN38Requirements === SafetyRequirementStatus.YES &&
          hasShortCircuitProtection === SafetyRequirementStatus.YES &&
          hasSafetyVent === SafetyRequirementStatus.YES &&
          hasReverseCurrentProtection === SafetyRequirementStatus.YES &&
          isDefectiveOrDamaged === SafetyRequirementStatus.NO;
      default:
        return false;
    }
  };

  const handleContinue = () => {
    if (step < 3) {
      const nextStep = step + 1;
      if (nextStep === 2 && existingBatteryData?.packagingMethod) {
        setStep(3);
      } else {
        setStep(nextStep);
      }
    } else {
      saveLithiumBatteryData();
      const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
      if (!completedSubsteps.includes('LithiumBatteries')) {
        store.hazProPreparerContext.completedSubsteps = [...completedSubsteps, 'LithiumBatteries'];
      }
      navigation.navigate('LabelingAndMarking');
    }
  };

  const handleSaveExit = () => {
    saveLithiumBatteryData();
    saveCurrentShipment('in-progress');
    navigation.navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  // Step content renders
  const renderPackagingMethodStep = () => (
    <View style={styles.stepContent}>
      <SectionHeader title={`Packaging for ${isMetal ? 'Lithium Metal' : 'Lithium Ion'} Batteries`} />
      <RadioGroup
        label="Select Packaging Method"
        options={PACKAGING_OPTIONS}
        value={selectedPackagingMethod}
        onChange={setSelectedPackagingMethod}
        required
      />
    </View>
  );

  const renderOuterPackagingStep = () => (
    <View style={styles.stepContent}>
      <SectionHeader title="Outer Packaging" />
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedOuterPackaging}
          onValueChange={setSelectedOuterPackaging}
          style={styles.picker}
        >
          <Picker.Item label="Select Outer Packaging Type" value="" color={colors.textSecondary} />
          {(OUTER_PACKAGING_MAP[selectedPackagingMethod] || []).map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      </View>
      {selectedPackagingMethod === 'combination' && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Inner Packaging Description *</Text>
          <FormInput
            value={innerPackagingDescription}
            onChangeText={setInnerPackagingDescription}
            placeholder="Describe non-metallic inner packaging"
            multiline
            style={styles.multilineInput}
          />
          <Text style={styles.helperText}>
            Must completely enclose the battery and prevent contact with conductive materials
          </Text>
        </View>
      )}
    </View>
  );

  const renderQuantityStep = () => (
    <View style={styles.stepContent}>
      <SectionHeader title="Battery Quantity and Weight" />
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Number of Batteries/Cells *</Text>
        <FormInput
          value={quantityOfBatteries}
          onChangeText={setQuantityOfBatteries}
          keyboardType="numeric"
          placeholder="Enter quantity"
        />
      </View>
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Total Weight *</Text>
        <View style={styles.weightRow}>
          <FormInput
            value={totalWeight}
            onChangeText={setTotalWeight}
            keyboardType="numeric"
            placeholder="Enter weight"
            style={styles.weightInput}
          />
          <View style={styles.unitToggle}>
            <TouchableOpacity
              style={[styles.unitButton, weightUnit === 'kg' && styles.unitButtonActive]}
              onPress={() => setWeightUnit('kg')}
            >
              <Text style={[styles.unitButtonText, weightUnit === 'kg' && styles.unitButtonTextActive]}>kg</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, weightUnit === 'lbs' && styles.unitButtonActive]}
              onPress={() => setWeightUnit('lbs')}
            >
              <Text style={[styles.unitButtonText, weightUnit === 'lbs' && styles.unitButtonTextActive]}>lbs</Text>
            </TouchableOpacity>
          </View>
        </View>
        {parseFloat(totalWeight) > 30 && selectedPackagingMethod !== 'heavy' && (
          <InfoBox variant="warning" message="Packages exceeding 30 kg (66 lbs) require special handling" />
        )}
      </View>
      {!isMetal ? (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Watt-Hour Rating (Wh) *</Text>
          <FormInput
            value={wattHourRating}
            onChangeText={setWattHourRating}
            keyboardType="numeric"
            placeholder="Enter Watt-hour rating"
          />
          <Text style={styles.helperText}>
            For lithium-ion batteries (UN3480, UN3481). Excepted quantities require 100 Wh or less.
          </Text>
        </View>
      ) : (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Lithium Content (grams) *</Text>
          <FormInput
            value={lithiumContentInGrams}
            onChangeText={setLithiumContentInGrams}
            keyboardType="numeric"
            placeholder="Enter lithium content in grams"
          />
          <Text style={styles.helperText}>
            For lithium metal batteries (UN3090, UN3091). Excepted quantities require 2g or less.
          </Text>
        </View>
      )}
      <InfoBox
        variant="info"
        title="Excepted Quantity Determination"
        message={
          isMetal
            ? 'Lithium metal batteries may qualify for excepted quantity shipping when:\n- Lithium content is 2g or less\n- For batteries with 0.3g-2g content: Maximum 2 batteries per package\n- For batteries with 0.3g or less content: Maximum net quantity 2.5kg per package'
            : 'Lithium-ion batteries may qualify for excepted quantity shipping when:\n- Watt-hour rating is 100Wh or less\n- Net quantity limits apply per package based on Table A3.5'
        }
      />
      {quantityOfBatteries && totalWeight && (isMetal ? lithiumContentInGrams : wattHourRating) && (
        <InfoBox
          variant={meetsExceptedQuantity ? 'success' : 'warning'}
          message={
            meetsExceptedQuantity
              ? 'Based on entered values, this shipment qualifies for excepted quantity'
              : 'Based on entered values, this shipment does not qualify for excepted quantity'
          }
        />
      )}
    </View>
  );

  const renderSafetyRequirementsStep = () => (
    <View style={styles.stepContent}>
      <SectionHeader title="Safety Requirements" />
      <SafetyRequirementCard
        label="Meets UN Manual of Tests and Criteria requirements (38.3)"
        value={meetsUN38Requirements}
        onChange={setMeetsUN38Requirements}
        errorMessage="Batteries must meet UN Manual of Tests and Criteria requirements for air transport"
      />
      <SafetyRequirementCard
        label="Has protection against external short circuits"
        value={hasShortCircuitProtection}
        onChange={setHasShortCircuitProtection}
        errorMessage="Short circuit protection is required for all lithium batteries"
      />
      <SafetyRequirementCard
        label="Has safety venting device or protection against violent rupture"
        value={hasSafetyVent}
        onChange={setHasSafetyVent}
        errorMessage="Safety venting or rupture protection is required"
      />
      <SafetyRequirementCard
        label="Has protection against dangerous reverse current flow"
        value={hasReverseCurrentProtection}
        onChange={setHasReverseCurrentProtection}
        errorMessage="Protection against dangerous reverse current flow is required"
      />
      <SafetyRequirementCard
        label="Battery is defective or damaged"
        value={isDefectiveOrDamaged}
        onChange={setIsDefectiveOrDamaged}
        invertColors
        errorMessage="Defective or damaged lithium batteries that could produce a dangerous evolution of heat, fire, or short circuit are PROHIBITED from air transport."
        errorTitle="WARNING: Transport Prohibited"
      />
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Special Handling Instructions (Optional)</Text>
        <FormInput
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Enter any special handling instructions"
          multiline
          style={styles.multilineInput}
        />
      </View>
      <InfoBox
        variant={meetsExceptedQuantity ? 'success' : 'warning'}
        title={meetsExceptedQuantity ? 'Excepted Quantity Status: QUALIFIED' : 'Excepted Quantity Status: NOT QUALIFIED'}
        message={
          meetsExceptedQuantity
            ? 'This lithium battery shipment meets all excepted quantity requirements based on the information provided.'
            : 'This lithium battery shipment does not meet all excepted quantity requirements. Standard dangerous goods regulations apply.'
        }
      />
    </View>
  );

  const renderCurrentStep = () => {
    switch (step) {
      case 0: return renderPackagingMethodStep();
      case 1: return renderOuterPackagingStep();
      case 2: return renderQuantityStep();
      case 3: return renderSafetyRequirementsStep();
      default: return null;
    }
  };

  return (
    <SpecialtyMaterialScreen
      title="Lithium Battery Preparation"
      material={material}
      onBack={() => navigation.goBack()}
      onCancel={() => navigation.goBack()}
      onSaveExit={handleSaveExit}
      onContinue={handleContinue}
      continueDisabled={!isStepValid()}
      continueLabel={step === 3 ? 'Finish' : 'Next'}
      infoBanner="Lithium cells and batteries must meet UN Manual of Tests and Criteria requirements. Batteries must have protection against short circuits and violent rupture."
    >
      <StepIndicator totalSteps={4} currentStep={step} />
      {renderCurrentStep()}
    </SpecialtyMaterialScreen>
  );
};

// Safety requirement card sub-component
interface SafetyRequirementCardProps {
  label: string;
  value: SafetyRequirementStatus;
  onChange: (status: SafetyRequirementStatus) => void;
  errorMessage: string;
  errorTitle?: string;
  invertColors?: boolean;
}

const SafetyRequirementCard: React.FC<SafetyRequirementCardProps> = ({
  label,
  value,
  onChange,
  errorMessage,
  errorTitle,
  invertColors = false,
}) => {
  const showError = invertColors
    ? value === SafetyRequirementStatus.YES
    : value === SafetyRequirementStatus.NO;

  return (
    <View style={styles.safetyCard}>
      <View style={styles.safetyRow}>
        <Text style={styles.safetyLabel}>{label}</Text>
        <View style={styles.yesNoButtons}>
          <TouchableOpacity
            style={[
              styles.responseButton,
              value === SafetyRequirementStatus.YES && (invertColors ? styles.noButtonActive : styles.yesButtonActive),
            ]}
            onPress={() => onChange(SafetyRequirementStatus.YES)}
          >
            <Text style={[
              styles.responseButtonText,
              value === SafetyRequirementStatus.YES && styles.responseButtonTextActive,
            ]}>
              Yes
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.responseButton,
              value === SafetyRequirementStatus.NO && (invertColors ? styles.yesButtonActive : styles.noButtonActive),
            ]}
            onPress={() => onChange(SafetyRequirementStatus.NO)}
          >
            <Text style={[
              styles.responseButtonText,
              value === SafetyRequirementStatus.NO && styles.responseButtonTextActive,
            ]}>
              No
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      {showError && (
        <InfoBox
          variant={invertColors ? 'error' : 'error'}
          title={errorTitle}
          message={errorMessage}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContent: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  weightInput: {
    flex: 1,
  },
  unitToggle: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
  },
  unitButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
  },
  unitButtonText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  unitButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
  safetyCard: {
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    gap: spacing.sm,
  },
  safetyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safetyLabel: {
    ...typography.body,
    color: colors.textPrimary,
    flex: 1,
    marginRight: spacing.md,
  },
  yesNoButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  responseButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    borderColor: colors.border,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  yesButtonActive: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  noButtonActive: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  responseButtonText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  responseButtonTextActive: {
    color: colors.white,
    fontWeight: '600',
  },
});

export default LithiumBatteriesPrepScreen;
