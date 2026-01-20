// src/screens/preparer/EnginesInternalCombustion.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { useHazProStore } from '@/stores/useHazProStore';
import { HazardousMaterialItem } from '../../../types';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  ChecklistItem,
  FormInput,
  InfoBox,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  typography,
} from '@/components/ui';

export interface EngineOrMachineryPreparationData {
  unid: string;
  fuelType: HazardousMaterialItem | null;
  transportMode: 'vehicle' | 'freight_container' | 'standalone_equipment' | 'trailer';
  isDrained: boolean;
  residualFuelMl?: number;
  purged?: boolean;
  largeFuelSystem?: boolean;
  tankFractionAllowed?: 'none' | 'quarter' | 'half';
  isInoperableOrDamaged?: boolean;
  cappedAndPlugged?: boolean;
  '24hDrainConfirmation'?: boolean;
  flashPointBelow38C?: boolean;
  batteryInstalled?: boolean;
  batteryType?: 'spillable' | 'nonspillable' | 'lithium';
  batterySecured?: boolean;
  terminalsProtected?: boolean;
  batteryDisconnected?: boolean;
  accessorialHazards: {
    batteries?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    } | null;
    fireExtinguishers?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      quantity: string;
    };
    starterFluid?: {
      accessorialHazardousMaterialIdentification: HazardousMaterialItem | null;
      volume: { liters: number | null; gallons: number | null };
    } | null;
    other?: any[];
  };
  requiresUprightOrientation: boolean;
  securedInPackaging: boolean;
  techManualCompliance: boolean;
}

// Fuel type options by UNID
const FUEL_OPTIONS: Record<string, HazardousMaterialItem[]> = {
  UN3528: [
    { isFixed: '', isDomesticShipment: false, isTechnicalNameRequired: false, unid: 'UN1203', properShippingName: 'GASOLINE', hazclassDiv: '3', subsidiaryRisk: '', packingGroup: 'II', specialProvision: 'P5, 177', packagingParagraph: 'A7.2.' },
    { isFixed: '', isDomesticShipment: false, isTechnicalNameRequired: false, unid: 'UN1202', properShippingName: 'DIESEL FUEL', hazclassDiv: '3', subsidiaryRisk: '', packingGroup: 'III', specialProvision: 'P5', packagingParagraph: 'A7.2.' },
  ],
  UN3529: [
    { isFixed: '', isDomesticShipment: false, isTechnicalNameRequired: false, unid: 'UN1971', properShippingName: 'NATURAL GAS, COMPRESSED', hazclassDiv: '2.1', subsidiaryRisk: '', packingGroup: '', specialProvision: 'P4', packagingParagraph: 'A6.3., A6.5.' },
    { isFixed: '', isDomesticShipment: false, isTechnicalNameRequired: false, unid: 'UN1978', properShippingName: 'PROPANE', hazclassDiv: '2.1', subsidiaryRisk: '', packingGroup: '', specialProvision: 'P4', packagingParagraph: 'A6.3., A6.6.' },
  ],
  UN3530: [
    { isFixed: '', isDomesticShipment: false, isTechnicalNameRequired: false, unid: 'UN1202', properShippingName: 'DIESEL FUEL', hazclassDiv: '3', subsidiaryRisk: '', packingGroup: 'III', specialProvision: 'P5', packagingParagraph: 'A7.2.' },
  ],
};

const EnginesInternalCombustion = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const { navigate } = useNavigationRef();

  const [preparationData, setPreparationData] = useState<EngineOrMachineryPreparationData>({
    unid: hazardousMaterial?.unid || '',
    fuelType: null,
    transportMode: 'standalone_equipment',
    isDrained: false,
    accessorialHazards: {
      batteries: null,
      fireExtinguishers: { accessorialHazardousMaterialIdentification: null, quantity: '' },
      starterFluid: null,
      other: [],
    },
    requiresUprightOrientation: true,
    securedInPackaging: false,
    techManualCompliance: false,
  });

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  useEffect(() => {
    const existingData = (state.hazProPreparerContext as any).engineOrMachineryPreparationData;
    if (existingData) {
      setPreparationData(existingData);
    }
  }, []);

  const handleInputChange = (field: keyof EngineOrMachineryPreparationData, value: any) => {
    setPreparationData(prev => ({ ...prev, [field]: value }));
  };

  const isSaveEnabled = useMemo(() => {
    const { fuelType, transportMode, isDrained, residualFuelMl, purged, batteryInstalled, batteryType } = preparationData;
    if (!fuelType || !transportMode) return false;
    if (!isDrained) return false;
    if (residualFuelMl === undefined || residualFuelMl > 500) return false;
    if (!purged) return false;
    if (batteryInstalled && !batteryType) return false;
    return true;
  }, [preparationData]);

  const handleSaveAndContinue = () => {
    store.hazProPreparerContext.engineOrMachineryPreparationData = preparationData;
    store.hazProPreparerContext.completedSubsteps = [...completedSubsteps, 'EnginesInternalCombustion'];
    navigation.navigate('AccessorialHazardsScreen');
  };

  const handleSaveAndExit = () => {
    store.hazProPreparerContext.engineOrMachineryPreparationData = preparationData;
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  const handleCancel = () => {
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  };

  const fuelOptions = FUEL_OPTIONS[hazardousMaterial?.unid || ''] || [];
  const isUN3528 = hazardousMaterial?.unid === 'UN3528';
  const isUN3529 = hazardousMaterial?.unid === 'UN3529';
  const isUN3530 = hazardousMaterial?.unid === 'UN3530';

  const getFuelRequirementsMessage = () => {
    if (isUN3528 || isUN3530) {
      return 'All fuel lines and tanks must be securely closed. Maximum 500ml residual fuel allowed. For large fuel systems, drain until no free-standing liquid remains.';
    }
    if (isUN3529) {
      return 'Completely empty gaseous fuel from non-DOT specification pressurized vessels. Ensure all tanks are securely closed.';
    }
    return '';
  };

  return (
    <SpecialtyMaterialScreen
      title="Engine/Machinery Preparation"
      onBack={() => navigation.goBack()}
      material={{
        unid: hazardousMaterial?.unid || '',
        properShippingName: hazardousMaterial?.properShippingName || '',
        hazardClass: hazardousMaterial?.hazclassDiv || '',
        packingGroup: hazardousMaterial?.packingGroup,
      }}
      onCancel={handleCancel}
      onSaveExit={handleSaveAndExit}
      onContinue={handleSaveAndContinue}
      continueDisabled={!isSaveEnabled}
    >
      {/* Fuel Type & Transport Mode */}
      <View style={styles.row}>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Fuel Type</Text>
          {isUN3530 ? (
            <InfoBox variant="info" message="This engine/machine is powered by fuels that are marine pollutants but do not meet the criteria of any other Class or Division." />
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={preparationData.fuelType?.unid || ''}
                onValueChange={value => {
                  const selectedFuel = fuelOptions.find(fuel => fuel.unid === value);
                  handleInputChange('fuelType', selectedFuel || null);
                }}
              >
                <Picker.Item label="Select Fuel Type" value="" enabled={false} />
                {fuelOptions.map((fuel, index) => (
                  <Picker.Item key={`${fuel.unid}-${index}`} label={fuel.properShippingName} value={fuel.unid} />
                ))}
              </Picker>
            </View>
          )}
        </View>
        <View style={styles.halfInput}>
          <Text style={styles.label}>Transport Mode</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={preparationData.transportMode}
              onValueChange={value => handleInputChange('transportMode', value)}
            >
              <Picker.Item label="Vehicle" value="vehicle" />
              <Picker.Item label="Freight Container" value="freight_container" />
              <Picker.Item label="Standalone Equipment" value="standalone_equipment" />
              <Picker.Item label="Trailer" value="trailer" />
            </Picker>
          </View>
        </View>
      </View>

      {/* Fuel Draining Section */}
      <View style={styles.section}>
        <SectionHeader title="Fuel Draining & Residual Limits" />
        <ChecklistItem
          label="Engine has been drained"
          checked={preparationData.isDrained}
          onChange={checked => handleInputChange('isDrained', checked)}
        />
        {preparationData.isDrained && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Residual Fuel (ml)</Text>
              <FormInput
                value={preparationData.residualFuelMl?.toString() || ''}
                onChangeText={value => {
                  const parsed = parseInt(value);
                  handleInputChange('residualFuelMl', isNaN(parsed) ? undefined : parsed);
                }}
                keyboardType="numeric"
                placeholder="Enter residual fuel amount"
                error={preparationData.residualFuelMl && preparationData.residualFuelMl > 500 ? { message: 'Residual fuel must not exceed 500ml' } : undefined}
              />
              {preparationData.residualFuelMl && preparationData.residualFuelMl > 500 && (
                <Text style={styles.errorText}>Residual fuel must not exceed 500ml</Text>
              )}
            </View>
            {(isUN3528 || isUN3530) && (
              <>
                <ChecklistItem
                  label="Engine has been purged"
                  checked={preparationData.purged || false}
                  onChange={checked => handleInputChange('purged', checked)}
                />
                <ChecklistItem
                  label="Large fuel system (requires complete drainage)"
                  checked={preparationData.largeFuelSystem || false}
                  onChange={checked => handleInputChange('largeFuelSystem', checked)}
                />
              </>
            )}
            <InfoBox variant="info" title="Important Fuel Requirements" message={getFuelRequirementsMessage()} />
          </>
        )}
      </View>

      {/* Battery Section */}
      <View style={styles.section}>
        <SectionHeader title="Battery Information" />
        <ChecklistItem
          label="Battery is installed"
          checked={preparationData.batteryInstalled || false}
          onChange={checked => handleInputChange('batteryInstalled', checked)}
        />
        {preparationData.batteryInstalled && (
          <>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Battery Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={preparationData.batteryType}
                  onValueChange={value => handleInputChange('batteryType', value)}
                >
                  <Picker.Item label="Select Battery Type" value="" enabled={false} />
                  <Picker.Item label="Spillable" value="spillable" />
                  <Picker.Item label="Non-spillable" value="nonspillable" />
                  <Picker.Item label="Lithium" value="lithium" />
                </Picker>
              </View>
            </View>
            <InfoBox
              variant="info"
              title="Important Battery Requirements"
              message={`Batteries must be secured upright in designed holders. Terminals must be protected to prevent short circuit.${preparationData.batteryType === 'lithium' ? ' Lithium batteries must pass UN Manual of Tests and Criteria.' : ''}`}
            />
          </>
        )}
      </View>

      {/* Packaging Section */}
      <View style={styles.section}>
        <SectionHeader title="Packaging & Orientation" />
        <InfoBox
          variant="info"
          title="Important Packaging Requirements"
          message="Item must be maintained in upright orientation during transport. Item must be secured in packaging to prevent movement. Use strong, rigid outer packaging to prevent accidental leakage."
        />
      </View>
    </SpecialtyMaterialScreen>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfInput: {
    flex: 1,
  },
  section: {
    gap: spacing.sm,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
});

export default EnginesInternalCombustion;
