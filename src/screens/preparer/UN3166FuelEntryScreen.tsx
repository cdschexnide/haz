// src/screens/preparer/UN3166FuelEntryScreen.tsx
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useHazProStore } from '@/stores/useHazProStore';
import { HazardousMaterialItem, UN3166Tank } from '../../../types';
import { hazardousMaterialsList } from '@/hazardousMaterials/hazardousMaterialsList';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  FormField,
  FormInput,
  FormRow,
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/components/ui';

// Fuel type constants
const GAS_FUEL_OPTIONS: HazardousMaterialItem[] = [
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN1971',
    properShippingName: 'NATURAL GAS, COMPRESSED',
    hazclassDiv: '2.1',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P4',
    packagingParagraph: 'A6.3., A6.5.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN1978',
    properShippingName: 'PROPANE',
    details: 'see also PETROLEUM GASES, LIQUEFIED',
    hazclassDiv: '2.1',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P4',
    packagingParagraph: 'A6.3., A6.6.',
  },
];

const LIQUID_FUEL_OPTIONS: HazardousMaterialItem[] = [
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN1203',
    properShippingName: 'GASOLINE',
    details: 'includes gasoline mixed with ethyl alcohol, with not more than 10 percent alcohol',
    hazclassDiv: '3',
    subsidiaryRisk: '',
    packingGroup: 'II',
    specialProvision: 'P5, 177',
    packagingParagraph: 'A7.2.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN1202',
    properShippingName: 'DIESEL FUEL',
    hazclassDiv: '3',
    subsidiaryRisk: '',
    packingGroup: 'III',
    specialProvision: 'P5',
    packagingParagraph: 'A7.2.',
  },
];

const TANK_FULLNESS_OPTIONS = [
  'Drained/Not Purged',
  '1/4 Full',
  '1/2 Full',
  '3/4 Full',
  'Full',
];

type FuelEntryMode = '' | 'SpecificQuantity' | 'TankSize' | 'MultipleTanks';

const UN3166FuelEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();

  const un3166Details = state.hazProPreparerContext.un3166Details;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const shipment = state.hazProPreparerContext.shipment;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  // Form state
  const [nomenclature, setNomenclature] = useState(un3166Details?.vehicleNomenclature ?? '');
  const [quantity, setQuantity] = useState(un3166Details?.quantity ?? '');
  const [fuel, setFuel] = useState<HazardousMaterialItem | 'Other' | null>(un3166Details?.fuel);
  const [mode, setMode] = useState<FuelEntryMode>(un3166Details?.fuelEntryMode ?? '');
  const [unit, setUnit] = useState<'liters' | 'gallons'>(un3166Details?.unit ?? 'gallons');
  const [amount, setAmount] = useState(un3166Details?.amount ?? '');
  const [tankSize, setTankSize] = useState(un3166Details?.tankSize ?? '');
  const [tankFullness, setTankFullness] = useState(un3166Details?.tankFullness ?? '');
  const [tankCount, setTankCount] = useState(un3166Details?.tankCount?.toString() ?? '');
  const [multiTanks, setMultiTanks] = useState<UN3166Tank[]>(
    un3166Details?.multiTanks ? [...un3166Details.multiTanks] : []
  );
  const [customFuelMaterial, setCustomFuelMaterial] = useState<HazardousMaterialItem>();
  const [customFuelSearch, setCustomFuelSearch] = useState('');

  // Derived values
  const fuelOptions = hazardousMaterial?.properShippingName === 'VEHICLE, FLAMMABLE GAS POWERED'
    ? GAS_FUEL_OPTIONS
    : LIQUID_FUEL_OPTIONS;

  const filteredFuelMaterials = useMemo(() => {
    return customFuelSearch.length >= 3
      ? hazardousMaterialsList.filter(
          (item) =>
            item.properShippingName.toLowerCase().includes(customFuelSearch.toLowerCase()) ||
            item.unid.includes(customFuelSearch)
        )
      : [];
  }, [customFuelSearch]);

  const showFullnessError = useMemo(() => {
    if (mode === 'TankSize') return tankFullness === 'Full';
    if (mode === 'MultipleTanks') return multiTanks.some((t) => t.tankFullness === 'Full');
    return false;
  }, [mode, tankFullness, multiTanks]);

  const showThreeQuarterError = useMemo(() => {
    const isNotChapter3 = !shipment?.isChapter3 || shipment?.isChapter3 === 'No';
    if (mode === 'TankSize') return tankFullness === '3/4 Full' && isNotChapter3;
    if (mode === 'MultipleTanks') {
      return multiTanks.some((t) => t.tankFullness === '3/4 Full' && isNotChapter3);
    }
    return false;
  }, [mode, tankFullness, multiTanks, shipment?.isChapter3]);

  const isSaveEnabled = useMemo(() => {
    const hasBasicInfo = nomenclature && quantity && fuel;
    if (!hasBasicInfo) return false;
    if (mode === 'SpecificQuantity') return !!amount;
    if (mode === 'TankSize') return !!(tankSize && tankFullness);
    if (mode === 'MultipleTanks') {
      return multiTanks.every((t) => t.amount || (t.tankSize && t.tankFullness));
    }
    return false;
  }, [nomenclature, quantity, fuel, mode, amount, tankSize, tankFullness, multiTanks]);

  // Initialize multi-tanks when count changes
  useEffect(() => {
    if (mode === 'MultipleTanks' && tankCount) {
      const count = parseInt(tankCount);
      if (!isNaN(count)) {
        setMultiTanks(
          Array.from({ length: count }, (_, i) => multiTanks[i] || {
            mode: '',
            amount: '',
            tankSize: '',
            tankFullness: '',
          })
        );
      }
    }
  }, [tankCount]);

  // Handlers
  const handleCancel = () => {
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  };

  const handleSaveExit = () => {
    saveDetails();
    navigation.navigate('PreparerHomeScreen');
  };

  const handleContinue = () => {
    saveDetails();
    store.hazProPreparerContext.completedSubsteps = [...completedSubsteps, 'UN3166FuelEntryScreen'];
    navigation.navigate('AccessorialHazardsScreen');
  };

  const saveDetails = () => {
    const fuelValue = fuel === 'Other' ? (customFuelMaterial ?? null) : (fuel ?? null);
    const modeValue = mode === '' ? null : mode;
    // Preserve existing accessorialHazards from state or initialize with empty structure
    const existingAccessorialHazards = un3166Details?.accessorialHazards
      ? {
          batteries: un3166Details.accessorialHazards.batteries
            ? { ...un3166Details.accessorialHazards.batteries }
            : null,
          fireExtinguishers: un3166Details.accessorialHazards.fireExtinguishers
            ? { ...un3166Details.accessorialHazards.fireExtinguishers }
            : undefined,
          starterFluid: un3166Details.accessorialHazards.starterFluid
            ? { ...un3166Details.accessorialHazards.starterFluid }
            : null,
          other: un3166Details.accessorialHazards.other
            ? [...un3166Details.accessorialHazards.other]
            : [],
        }
      : {
          batteries: null,
          fireExtinguishers: undefined,
          starterFluid: null,
          other: [],
        };
    store.hazProPreparerContext.un3166Details = {
      vehicleNomenclature: nomenclature,
      quantity,
      fuel: fuelValue,
      fuelEntryMode: modeValue,
      amount: mode === 'SpecificQuantity' ? amount : undefined,
      tankSize: mode === 'TankSize' ? tankSize : undefined,
      tankFullness: mode === 'TankSize' ? tankFullness : undefined,
      unit,
      tankCount: mode === 'MultipleTanks' ? parseInt(tankCount) : undefined,
      multiTanks: mode === 'MultipleTanks' ? multiTanks : undefined,
      accessorialHazards: existingAccessorialHazards,
    };
  };

  const updateMultiTank = (index: number, updates: Partial<UN3166Tank>) => {
    setMultiTanks((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  // Material info for header
  const materialInfo = {
    unid: hazardousMaterial?.unid ?? 'UN3166',
    properShippingName: hazardousMaterial?.properShippingName ?? 'Vehicle',
    hazardClass: hazardousMaterial?.hazclassDiv ?? '9',
    packingGroup: hazardousMaterial?.packingGroup,
  };

  return (
    <SpecialtyMaterialScreen
      title="Fuel Entry"
      material={materialInfo}
      onBack={() => navigation.goBack()}
      onCancel={handleCancel}
      onSaveExit={handleSaveExit}
      onContinue={handleContinue}
      continueDisabled={!isSaveEnabled || showFullnessError || showThreeQuarterError}
    >
      {/* Vehicle Info */}
      <FormRow>
        <FormField label="Vehicle Nomenclature" flex={1}>
          <FormInput
            value={nomenclature}
            onChangeText={setNomenclature}
            placeholder="e.g. M1008 or Humvee"
          />
        </FormField>
        <FormField label="Quantity" flex={1}>
          <FormInput
            value={quantity}
            keyboardType="numeric"
            onChangeText={setQuantity}
            placeholder="e.g. 2"
          />
        </FormField>
      </FormRow>

      {/* Fuel Selection */}
      <FormRow>
        <FormField label="Fuel Type" flex={1}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={fuel}
              onValueChange={setFuel}
              style={styles.picker}
              dropdownIconColor={colors.textPrimary}
            >
              <Picker.Item label="Select Fuel Type" value="" enabled={false} />
              {fuelOptions.map((type, index) => (
                <Picker.Item
                  key={`${type.unid}-${index}`}
                  label={type.properShippingName}
                  value={type}
                />
              ))}
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
        </FormField>
        <FormField label="Fuel Entry Mode" flex={1}>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={mode}
              onValueChange={setMode}
              style={styles.picker}
              dropdownIconColor={colors.textPrimary}
            >
              <Picker.Item label="Select Entry Mode" value="" enabled={false} />
              <Picker.Item label="Specific Quantity" value="SpecificQuantity" />
              <Picker.Item label="Tank Size" value="TankSize" />
              <Picker.Item label="Multiple Tanks" value="MultipleTanks" />
            </Picker>
          </View>
        </FormField>
      </FormRow>

      {/* Custom Fuel Search */}
      {fuel === 'Other' && (
        <View>
          <FormField label="Search Other Fuel Type">
            <FormInput
              value={customFuelSearch}
              onChangeText={setCustomFuelSearch}
              placeholder="Search by UNID or name"
            />
          </FormField>
          {filteredFuelMaterials.length > 0 && (
            <FlatList
              data={filteredFuelMaterials}
              keyExtractor={(item) => item.unid}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    setCustomFuelMaterial(item);
                    setFuel(item);
                    setCustomFuelSearch('');
                  }}
                >
                  <View style={styles.materialOption}>
                    <Text style={styles.materialOptionText}>
                      <Text style={styles.materialUnid}>{item.unid}</Text> - {item.properShippingName}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      )}

      {/* Specific Quantity Mode */}
      {mode === 'SpecificQuantity' && (
        <FormRow>
          <FormField label="Fuel Amount" flex={1}>
            <FormInput
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              placeholder="Amount of fuel"
            />
          </FormField>
          <FormField label="Unit" flex={1}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={unit}
                onValueChange={setUnit}
                style={styles.picker}
                dropdownIconColor={colors.textPrimary}
              >
                <Picker.Item label="Liters" value="liters" />
                <Picker.Item label="Gallons" value="gallons" />
              </Picker>
            </View>
          </FormField>
        </FormRow>
      )}

      {/* Tank Size Mode */}
      {mode === 'TankSize' && (
        <FormRow>
          <FormField label="Tank Size" flex={1}>
            <FormInput
              keyboardType="numeric"
              value={tankSize}
              onChangeText={setTankSize}
              placeholder="Tank Capacity"
            />
          </FormField>
          <FormField label="Unit" flex={1}>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={unit}
                onValueChange={setUnit}
                style={styles.picker}
                dropdownIconColor={colors.textPrimary}
              >
                <Picker.Item label="Liters" value="liters" />
                <Picker.Item label="Gallons" value="gallons" />
              </Picker>
            </View>
          </FormField>
          <FormField
            label="How Full?"
            flex={1}
            error={showFullnessError || showThreeQuarterError ? { message: getFullnessError(tankFullness, shipment?.isChapter3) } : undefined}
          >
            <View style={[styles.pickerContainer, (showFullnessError || showThreeQuarterError) && styles.pickerError]}>
              <Picker
                selectedValue={tankFullness}
                onValueChange={setTankFullness}
                style={styles.picker}
                dropdownIconColor={colors.textPrimary}
              >
                <Picker.Item label="Select fuel level" value="" enabled={false} />
                {TANK_FULLNESS_OPTIONS.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </FormField>
        </FormRow>
      )}

      {/* Multiple Tanks Mode */}
      {mode === 'MultipleTanks' && (
        <View>
          <FormField label="Number of Tanks">
            <FormInput
              keyboardType="numeric"
              value={tankCount}
              onChangeText={setTankCount}
              placeholder="e.g. 2"
            />
          </FormField>

          {multiTanks.map((tank, index) => (
            <View key={index} style={styles.tankGroup}>
              <Text style={styles.tankHeader}>Tank {index + 1}</Text>

              <FormField label="Entry Mode">
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={tank.mode}
                    onValueChange={(val) => updateMultiTank(index, { mode: val })}
                    style={styles.picker}
                    dropdownIconColor={colors.textPrimary}
                  >
                    <Picker.Item label="Select entry mode" value="" enabled={false} />
                    <Picker.Item label="Specific Quantity" value="SpecificQuantity" />
                    <Picker.Item label="Tank Size" value="TankSize" />
                  </Picker>
                </View>
              </FormField>

              {tank.mode === 'SpecificQuantity' && (
                <FormRow>
                  <FormField label="Amount" flex={1}>
                    <FormInput
                      keyboardType="numeric"
                      value={tank.amount}
                      onChangeText={(val) => updateMultiTank(index, { amount: val })}
                      placeholder="Amount of fuel"
                    />
                  </FormField>
                  <FormField label="Unit" flex={1}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={unit}
                        onValueChange={setUnit}
                        style={styles.picker}
                        dropdownIconColor={colors.textPrimary}
                      >
                        <Picker.Item label="Liters" value="liters" />
                        <Picker.Item label="Gallons" value="gallons" />
                      </Picker>
                    </View>
                  </FormField>
                </FormRow>
              )}

              {tank.mode === 'TankSize' && (
                <FormRow>
                  <FormField label="Tank Size" flex={1}>
                    <FormInput
                      keyboardType="numeric"
                      value={tank.tankSize}
                      onChangeText={(val) => updateMultiTank(index, { tankSize: val })}
                      placeholder="Tank Capacity"
                    />
                  </FormField>
                  <FormField label="Unit" flex={1}>
                    <View style={styles.pickerContainer}>
                      <Picker
                        selectedValue={unit}
                        onValueChange={setUnit}
                        style={styles.picker}
                        dropdownIconColor={colors.textPrimary}
                      >
                        <Picker.Item label="Liters" value="liters" />
                        <Picker.Item label="Gallons" value="gallons" />
                      </Picker>
                    </View>
                  </FormField>
                  <FormField
                    label="How Full?"
                    flex={1}
                    error={getTankError(tank, shipment?.isChapter3) ? { message: getTankError(tank, shipment?.isChapter3)! } : undefined}
                  >
                    <View style={[styles.pickerContainer, getTankError(tank, shipment?.isChapter3) && styles.pickerError]}>
                      <Picker
                        selectedValue={tank.tankFullness}
                        onValueChange={(val) => updateMultiTank(index, { tankFullness: val })}
                        style={styles.picker}
                        dropdownIconColor={colors.textPrimary}
                      >
                        <Picker.Item label="Select fuel level" value="" enabled={false} />
                        {TANK_FULLNESS_OPTIONS.map((option) => (
                          <Picker.Item key={option} label={option} value={option} />
                        ))}
                      </Picker>
                    </View>
                  </FormField>
                </FormRow>
              )}
            </View>
          ))}
        </View>
      )}
    </SpecialtyMaterialScreen>
  );
};

// Helper functions
const getFullnessError = (fullness: string, isChapter3?: string): string => {
  if (fullness === 'Full') return 'Tank cannot be FULL.';
  if (fullness === '3/4 Full' && (!isChapter3 || isChapter3 === 'No')) {
    return '3/4 Full is only permitted under Chapter 3 authorization.';
  }
  return '';
};

const getTankError = (tank: UN3166Tank, isChapter3?: string): string | null => {
  if (tank.tankFullness === 'Full') return 'Tank cannot be FULL.';
  if (tank.tankFullness === '3/4 Full' && (!isChapter3 || isChapter3 === 'No')) {
    return '3/4 Full is only permitted under Chapter 3 authorization.';
  }
  return null;
};

export default UN3166FuelEntryScreen;

const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 44,
    color: colors.textPrimary,
  },
  pickerError: {
    borderColor: colors.error,
  },
  materialOption: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginVertical: spacing.xs,
  },
  materialOptionText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  materialUnid: {
    fontWeight: '700',
    color: colors.primary,
  },
  tankGroup: {
    marginTop: spacing.lg,
    borderTopWidth: 1,
    borderColor: colors.border,
    paddingTop: spacing.md,
  },
  tankHeader: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});
