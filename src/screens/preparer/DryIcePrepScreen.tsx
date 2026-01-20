// src/screens/preparer/DryIcePrepScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { useHazProStore } from '@/stores/useHazProStore';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  FormField,
  RadioGroup,
  InfoBox,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/components/ui';

// Aircraft dry ice quantity limits
export interface DryIceQuantityLimit {
  pounds: number;
  kilograms: number;
}

export const C17DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  'Two Packs - High-Flow @ 35,000 ft': { pounds: 3430, kilograms: 1556 },
  'Two Packs - High-Flow @ ≤ 10,000 ft': { pounds: 2080, kilograms: 943 },
  'Two Packs - Normal-Flow @ 35,000 ft': { pounds: 1880, kilograms: 853 },
  'Two Packs - Normal-Flow @ ≤ 10,000 ft': { pounds: 1040, kilograms: 472 },
  'One Pack - High-Flow @ 35,000 ft': { pounds: 1720, kilograms: 780 },
  'One Pack - High-Flow (Holding) @ 10,000 ft': { pounds: 1040, kilograms: 472 },
  'With passengers in cargo compartment (any flow)': { pounds: 1040, kilograms: 472 },
};

export const C5DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  'Cruise (Mach 0.5 and up) - ≤ 30,000 ft (Note 1)': { pounds: 4700, kilograms: 2132 },
  'Cruise (Mach 0.6 and up) - ≤ 30,000 ft (Note 1)': { pounds: 3120, kilograms: 1415 },
  'Non-pressurized flight - ≤ 10,000 ft (Note 2)': { pounds: 6500, kilograms: 2948 },
  'Ground ops with one APU running (Note 3)': { pounds: 2950, kilograms: 1338 },
};

export const KC10DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  'No curtain - both packs operating': { pounds: 2295, kilograms: 1041 },
  'No curtain - one pack operating': { pounds: 1251, kilograms: 568 },
  'Curtain at STA 615 - both packs operating': { pounds: 1782, kilograms: 808 },
  'Curtain at STA 615 - one pack operating': { pounds: 969, kilograms: 440 },
  'Curtain at STA 879 - both packs operating': { pounds: 1204, kilograms: 546 },
  'Curtain at STA 879 - one pack operating': { pounds: 653, kilograms: 296 },
};

export const KC135DryIceQuantityLimits: Record<string, DryIceQuantityLimit> = {
  maximumAmount: { pounds: 200, kilograms: 91 },
};

// Helper functions for aircraft limit calculations
const findMinQuantityLimit = (aircraftType: string): number => {
  const limitMaps: Record<string, Record<string, DryIceQuantityLimit>> = {
    'C-17': C17DryIceQuantityLimits,
    'C-5': C5DryIceQuantityLimits,
    'KC-10': KC10DryIceQuantityLimits,
    'KC-135': KC135DryIceQuantityLimits,
  };

  if (aircraftType === 'Other' || aircraftType === 'AMC Contract') return 440;
  if (aircraftType === 'C-130') return 600;

  const limits = limitMaps[aircraftType];
  if (!limits) return 0;

  return Math.min(...Object.values(limits).map(l => l.pounds));
};

const getValidConfigurations = (
  aircraftType: string,
  quantityLbs: number
): string[] => {
  const limitMaps: Record<string, Record<string, DryIceQuantityLimit>> = {
    'C-17': C17DryIceQuantityLimits,
    'C-5': C5DryIceQuantityLimits,
    'KC-10': KC10DryIceQuantityLimits,
  };

  const limits = limitMaps[aircraftType];
  if (!limits) return [];

  return Object.entries(limits)
    .filter(([, limit]) => limit.pounds >= quantityLbs)
    .map(([config]) => config);
};

const getLimitForConfig = (
  aircraftType: string,
  config: string
): DryIceQuantityLimit | null => {
  const limitMaps: Record<string, Record<string, DryIceQuantityLimit>> = {
    'C-17': C17DryIceQuantityLimits,
    'C-5': C5DryIceQuantityLimits,
    'KC-10': KC10DryIceQuantityLimits,
  };
  return limitMaps[aircraftType]?.[config] ?? null;
};

const AIRCRAFT_OPTIONS = [
  { label: 'C-17', value: 'C-17' },
  { label: 'C-5', value: 'C-5' },
  { label: 'KC-135', value: 'KC-135' },
  { label: 'KC-10', value: 'KC-10' },
  { label: 'Other', value: 'Other' },
];

const PACKAGING_OPTIONS = [
  { label: 'Fiberboard Box', value: 'Fiberboard Box' },
  { label: 'Polystyrene Foam Container', value: 'Polystyrene Foam Container' },
  { label: 'Other', value: 'Other' },
];

const DryIcePrepScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const { navigate } = useNavigationRef();

  // Form state
  const [packagingType, setPackagingType] = useState('');
  const [customPackaging, setCustomPackaging] = useState('');
  const [quantity, setQuantity] = useState('');
  const [unit, setUnit] = useState<'kg' | 'lbs'>('lbs');
  const [isPressurized, setIsPressurized] = useState(true);
  const [aircraftType, setAircraftType] = useState('');
  const [selectedConfig, setSelectedConfig] = useState('');
  const [aircraftVolume, setAircraftVolume] = useState('');
  const [airChangesPerHour, setAirChangesPerHour] = useState('');
  const [calculatedLimit, setCalculatedLimit] = useState<number | null>(null);
  const [isVentingProvided, setIsVentingProvided] = useState(true);
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Derived state
  const [hasAircraftInfo, setHasAircraftInfo] = useState<boolean | null>(null);
  const [showUnsupportedMessage, setShowUnsupportedMessage] = useState(false);
  const [availableConfigs, setAvailableConfigs] = useState<string[]>([]);

  // Calculate quantity in lbs for comparisons
  const quantityLbs = quantity
    ? unit === 'lbs'
      ? parseFloat(quantity)
      : parseFloat(quantity) / 0.453592
    : 0;

  const minLimit = aircraftType ? findMinQuantityLimit(aircraftType) : 0;
  const exceedsMinLimit = quantityLbs > minLimit;
  const showConfigOptions =
    exceedsMinLimit &&
    ['C-17', 'C-5', 'KC-10'].includes(aircraftType) &&
    availableConfigs.length > 0;
  const showOtherAircraftPrompt = aircraftType === 'Other' && quantityLbs > 440;

  // Calculate max dry ice loading for "Other" aircraft
  const calculateMaxLoading = (vol: string, changes: string) => {
    const V = parseFloat(vol);
    const A = parseFloat(changes);
    if (!isNaN(V) && !isNaN(A) && V > 0 && A > 0) {
      return Math.floor((V * A * 0.47) / 32.3);
    }
    return null;
  };

  // Update available configurations when quantity or aircraft changes
  useEffect(() => {
    if (aircraftType && quantity) {
      const configs = getValidConfigurations(aircraftType, quantityLbs);
      setAvailableConfigs(configs);
      if (!configs.includes(selectedConfig)) {
        setSelectedConfig('');
      }
    }
  }, [aircraftType, quantity, unit]);

  // Update calculated limit for "Other" aircraft
  useEffect(() => {
    if (aircraftType === 'Other') {
      setCalculatedLimit(calculateMaxLoading(aircraftVolume, airChangesPerHour));
    } else {
      setCalculatedLimit(null);
    }
  }, [aircraftType, aircraftVolume, airChangesPerHour]);

  // Form validation
  const isFormValid = (() => {
    if (!packagingType || (packagingType === 'Other' && !customPackaging)) return false;
    if (!quantity) return false;
    if (!isVentingProvided) return false;

    if (isPressurized) {
      if (!aircraftType) return false;
      if (exceedsMinLimit && showConfigOptions && !selectedConfig) return false;
      if (aircraftType === 'Other' && showOtherAircraftPrompt) {
        if (hasAircraftInfo === null) return false;
        if (hasAircraftInfo === false) return false;
        if (hasAircraftInfo && (!aircraftVolume || !airChangesPerHour)) return false;
      }
    }

    if (showUnsupportedMessage) return false;
    return true;
  })();

  // Get max allowed quantity for current configuration
  const getMaxAllowed = () => {
    if (aircraftType === 'KC-135') {
      return KC135DryIceQuantityLimits.maximumAmount;
    }
    if (selectedConfig) {
      const limit = getLimitForConfig(aircraftType, selectedConfig);
      if (limit) return limit;
    }
    if (aircraftType === 'Other' && calculatedLimit) {
      return { pounds: calculatedLimit, kilograms: Math.floor(calculatedLimit * 0.453592) };
    }
    if (aircraftType === 'AMC Contract') {
      return { pounds: 440, kilograms: 200 };
    }
    if (aircraftType === 'C-130') {
      return { pounds: 600, kilograms: 272 };
    }
    return null;
  };

  const maxAllowed = getMaxAllowed();
  const isOverLimit = maxAllowed
    ? unit === 'lbs'
      ? parseFloat(quantity || '0') > maxAllowed.pounds
      : parseFloat(quantity || '0') > maxAllowed.kilograms
    : false;

  // Handlers
  const handlePackagingChange = (value: string) => {
    setPackagingType(value);
    if (value !== 'Other') setCustomPackaging('');
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value.replace(/[^0-9.]/g, ''));
    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);
  };

  const handleAircraftTypeChange = (value: string) => {
    setAircraftType(value);
    setSelectedConfig('');
    setHasAircraftInfo(null);
    setShowUnsupportedMessage(false);
    if (value !== 'Other') {
      setAircraftVolume('');
      setAirChangesPerHour('');
    }
  };

  const handleHasAircraftInfoResponse = (hasInfo: boolean) => {
    setHasAircraftInfo(hasInfo);
    if (!hasInfo) setShowUnsupportedMessage(true);
  };

  // Navigation handlers
  const handleCancel = () => navigation.goBack();

  const handleSaveAndExit = () => {
    saveCurrentShipment('in-progress');
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  const handleSaveAndContinue = () => {
    const finalPackaging = packagingType === 'Other' ? customPackaging : packagingType;

    // Note: Type includes additional fields used by the workflow beyond the base type definition
    store.hazProPreparerContext.dryIceData = {
      packagingType: finalPackaging,
      quantity,
      aircraftType,
      isAircraftPressurized: isPressurized,
      isVentingProvided,
      specialInstructions,
      handlingInstructions:
        'Keep dry ice packages away from crew and passenger compartments. Ensure proper ventilation to prevent CO2 buildup.',
    };

    const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
    if (!completedSubsteps.includes('DryIce')) {
      store.hazProPreparerContext.completedSubsteps = [...completedSubsteps, 'DryIce'];
    }

    navigation.navigate('LabelingAndMarking');
  };

  // Set handling instructions on mount
  useEffect(() => {
    if (!store.hazProPreparerContext.dryIceData) {
      store.hazProPreparerContext.dryIceData = {
        packagingType: '',
        quantity: '',
        aircraftType: '',
        isAircraftPressurized: true,
        isVentingProvided: true,
        specialInstructions: '',
        handlingInstructions:
          'Keep dry ice packages away from crew and passenger compartments. Ensure packaging permits release of carbon dioxide gas to prevent pressure buildup.',
      };
    } else {
      store.hazProPreparerContext.dryIceData.handlingInstructions =
        'Keep dry ice packages away from crew and passenger compartments. Ensure packaging permits release of carbon dioxide gas to prevent pressure buildup.';
    }
  }, []);

  const materialInfo = {
    unid: 'UN1845',
    properShippingName: 'Dry ice (Carbon dioxide, solid)',
    hazardClass: '9',
  };

  return (
    <SpecialtyMaterialScreen
      title="Dry Ice Preparation"
      material={materialInfo}
      onBack={handleCancel}
      onCancel={handleCancel}
      onSaveExit={handleSaveAndExit}
      onContinue={handleSaveAndContinue}
      continueDisabled={!isFormValid}
      infoBanner="A13.10. DRY ICE (CARBON DIOXIDE, SOLID): Wrap in kraft paper, secure with tape, and pack in fiberboard boxes, polystyrene foam containers or other suitable packaging. Packaging must permit the release of carbon dioxide gas and prevent pressure buildup."
    >
      {/* Packaging Section */}
      <SectionHeader title="Packaging Information" />

      <RadioGroup
        label="Packaging Type"
        options={PACKAGING_OPTIONS}
        value={packagingType}
        onChange={handlePackagingChange}
        required
      />

      {packagingType === 'Other' && (
        <FormField label="Specify Packaging Type" required>
          <TextInput
            style={styles.input}
            value={customPackaging}
            onChangeText={setCustomPackaging}
            placeholder="Specify packaging type"
          />
          <Text style={styles.helperText}>
            Must permit release of carbon dioxide gas
          </Text>
        </FormField>
      )}

      {/* Transport Requirements */}
      <SectionHeader title="Transport Requirements" />

      <FormField label="Net Quantity of Dry Ice" required>
        <View style={styles.quantityRow}>
          <TextInput
            style={[styles.input, styles.quantityInput]}
            value={quantity}
            onChangeText={handleQuantityChange}
            keyboardType="numeric"
            placeholder="Enter quantity"
          />
          <View style={styles.unitSelector}>
            <Pressable
              style={[styles.unitButton, unit === 'lbs' && styles.unitButtonActive]}
              onPress={() => setUnit('lbs')}
            >
              <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>
                lbs
              </Text>
            </Pressable>
            <Pressable
              style={[styles.unitButton, unit === 'kg' && styles.unitButtonActive]}
              onPress={() => setUnit('kg')}
            >
              <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>
                kg
              </Text>
            </Pressable>
          </View>
        </View>
        {maxAllowed && (
          <Text style={[styles.helperText, isOverLimit && styles.errorText]}>
            {isOverLimit ? 'EXCEEDED: ' : ''}Maximum allowable: {maxAllowed.pounds} lbs (
            {maxAllowed.kilograms} kg)
          </Text>
        )}
      </FormField>

      <FormField label="Aircraft Pressurized?">
        <View style={styles.switchRow}>
          <Switch
            value={isPressurized}
            onValueChange={setIsPressurized}
            trackColor={{ false: colors.error, true: colors.primary }}
            thumbColor={colors.surface}
          />
          <Text style={styles.switchLabel}>{isPressurized ? 'Yes' : 'No'}</Text>
        </View>
      </FormField>

      {isPressurized && (
        <RadioGroup
          label="Aircraft Type"
          options={AIRCRAFT_OPTIONS}
          value={aircraftType}
          onChange={handleAircraftTypeChange}
          required
        />
      )}

      {/* Aircraft Configuration Options */}
      {isPressurized && showConfigOptions && (
        <FormField label="Available Aircraft Configurations" required>
          <View style={styles.configList}>
            {availableConfigs.map(config => {
              const limit = getLimitForConfig(aircraftType, config);
              return (
                <TouchableOpacity
                  key={config}
                  style={[
                    styles.configOption,
                    selectedConfig === config && styles.configOptionSelected,
                  ]}
                  onPress={() => setSelectedConfig(config)}
                >
                  <Text
                    style={[
                      styles.configText,
                      selectedConfig === config && styles.configTextSelected,
                    ]}
                  >
                    {config}
                  </Text>
                  {limit && (
                    <Text style={styles.configLimit}>
                      Max: {limit.pounds} lbs ({limit.kilograms} kg)
                    </Text>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={styles.helperText}>
            Only showing configurations that can handle your specified quantity
          </Text>
        </FormField>
      )}

      {/* Other Aircraft Prompt */}
      {isPressurized && showOtherAircraftPrompt && hasAircraftInfo === null && (
        <InfoBox
          variant="warning"
          title="Aircraft Information Required"
          message="Exceeding 440 lbs under 'Other' aircraft requires volume and air changes per hour data. Do you have this information?"
        />
      )}

      {isPressurized && showOtherAircraftPrompt && hasAircraftInfo === null && (
        <View style={styles.promptButtons}>
          <TouchableOpacity
            style={styles.promptButton}
            onPress={() => handleHasAircraftInfoResponse(true)}
          >
            <Text style={styles.promptButtonText}>Yes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.promptButton, styles.promptButtonNo]}
            onPress={() => handleHasAircraftInfoResponse(false)}
          >
            <Text style={styles.promptButtonText}>No</Text>
          </TouchableOpacity>
        </View>
      )}

      {showUnsupportedMessage && (
        <InfoBox
          variant="error"
          title="Cannot Support This Shipment"
          message="You must have aircraft volume and air changes information to ship this quantity of dry ice on an unlisted aircraft type."
        />
      )}

      {/* Volume/Air Changes for Other Aircraft */}
      {isPressurized &&
        aircraftType === 'Other' &&
        ((showOtherAircraftPrompt && hasAircraftInfo) || !showOtherAircraftPrompt) && (
          <>
            <FormField label="Aircraft Volume (cubic ft)" required>
              <TextInput
                style={styles.input}
                value={aircraftVolume}
                onChangeText={v => setAircraftVolume(v.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                placeholder="Enter aircraft volume"
              />
            </FormField>

            <FormField label="Air Changes Per Hour" required>
              <TextInput
                style={styles.input}
                value={airChangesPerHour}
                onChangeText={v => setAirChangesPerHour(v.replace(/[^0-9.]/g, ''))}
                keyboardType="numeric"
                placeholder="Enter air changes per hour"
              />
            </FormField>

            {calculatedLimit !== null && (
              <View style={styles.calculatedLimit}>
                <Text style={styles.calculatedTitle}>Maximum Dry Ice Loading:</Text>
                <Text style={styles.calculatedValue}>
                  {calculatedLimit} lbs ({Math.floor(calculatedLimit * 0.453592)} kg)
                </Text>
                <Text style={styles.helperText}>Based on formula: X = (V)(A)(0.47)/32.3</Text>
              </View>
            )}
          </>
        )}

      {/* Venting Toggle */}
      <FormField label="Venting Provided to Release CO2 Gas?">
        <View style={styles.switchRow}>
          <Switch
            value={isVentingProvided}
            onValueChange={setIsVentingProvided}
            trackColor={{ false: colors.error, true: colors.primary }}
            thumbColor={colors.surface}
          />
          <Text style={styles.switchLabel}>{isVentingProvided ? 'Yes' : 'No'}</Text>
        </View>
        {!isVentingProvided && (
          <Text style={styles.errorText}>
            Venting is REQUIRED for dry ice shipments to prevent pressure buildup
          </Text>
        )}
      </FormField>

      {/* Special Instructions */}
      <FormField label="Special Handling Instructions (optional)">
        <TextInput
          style={[styles.input, styles.multilineInput]}
          value={specialInstructions}
          onChangeText={setSpecialInstructions}
          placeholder="Any special handling instructions for this shipment"
          multiline
          numberOfLines={4}
        />
      </FormField>
    </SpecialtyMaterialScreen>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    color: colors.textPrimary,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
    paddingTop: spacing.md,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  quantityInput: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
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
  unitText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  unitTextActive: {
    color: colors.surface,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  switchLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.xs,
    fontStyle: 'italic',
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  configList: {
    gap: spacing.sm,
  },
  configOption: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  configOptionSelected: {
    backgroundColor: colors.infoLight,
    borderColor: colors.primary,
  },
  configText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  configTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
  configLimit: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  promptButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promptButton: {
    flex: 1,
    paddingVertical: spacing.md,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  promptButtonNo: {
    backgroundColor: colors.error,
  },
  promptButtonText: {
    ...typography.body,
    color: colors.surface,
    fontWeight: '600',
  },
  calculatedLimit: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  calculatedTitle: {
    ...typography.body,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  calculatedValue: {
    ...typography.body,
    fontWeight: '700',
    color: colors.primary,
  },
});

export default DryIcePrepScreen;
