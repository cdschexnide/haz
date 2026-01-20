// src/screens/preparer/BatteryPoweredVehicleScreen.tsx

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  DetailCard,
  InfoBox,
  RadioGroup,
  FormField,
  FormInput,
  Button,
} from '@/components/ui';

export interface BatteryDetails {
  vehicleType: string;
  customVehicleType?: string;
  batteryType: string;
  batteryInstalled: boolean;
  securedUpright: boolean;
  terminalsProtected: boolean;
  cablesDisconnected: boolean;
  cablesSecured: boolean;
  isWheelchair: boolean;
  wheelchairUpright: boolean;
  isLithiumBattery: boolean;
  lithiumBatteryTested: boolean;
  notes: string;
  key16: {
    description: string;
    netQuantity: {
      value: number;
      unit: 'kg' | 'lbs';
      valueKg: number;
    };
  };
  key19: {
    containsMagnetizedMaterial: boolean;
  };
}

const VEHICLE_TYPES = [
  'Car', 'Motorcycle', 'Scooter', 'Bicycle with Electric Motor', 'Truck',
  'Wheelchair', 'Self-balancing Vehicle', 'Lawn Tractor', 'Construction Equipment',
  'Farming Equipment', 'Boat', 'Aircraft', 'Mobility Aid', 'Other',
];

const EQUIPMENT_TYPES = [
  'Power Tool', 'Medical Device', 'Portable Electronic Device', 'Camera Equipment',
  'Measurement Device', 'Monitoring Equipment', 'Laboratory Equipment',
  'Cleaning Equipment', 'Lighting Equipment', 'Communication Device', 'Other',
];

const BATTERY_TYPES = [
  'Wet Cell Battery', 'Non-spillable Battery', 'Lithium Metal Battery',
  'Lithium Ion Battery', 'Sodium Battery',
];

// SP134 Redirect Prompt Component
interface RedirectPromptProps {
  question: string;
  value: boolean | null;
  onValueChange: (value: boolean) => void;
  redirectTitle: string;
  redirectText: string;
  redirectOptions: Array<{ label: string; unid: string }>;
  onRedirect: (unid: string) => void;
}

const RedirectPrompt: React.FC<RedirectPromptProps> = ({
  question,
  value,
  onValueChange,
  redirectTitle,
  redirectText,
  redirectOptions,
  onRedirect,
}) => (
  <View style={styles.promptBox}>
    <Text style={styles.promptText}>{question}</Text>
    <View style={styles.promptButtonRow}>
      <TouchableOpacity
        style={[styles.promptButton, value === true && styles.promptYesActive]}
        onPress={() => onValueChange(true)}
      >
        <Text style={[styles.promptButtonText, value === true && styles.promptButtonTextActive]}>
          Yes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.promptButton, value === false && styles.promptNoActive]}
        onPress={() => onValueChange(false)}
      >
        <Text style={[styles.promptButtonText, value === false && styles.promptButtonTextActive]}>
          No
        </Text>
      </TouchableOpacity>
    </View>
    {value === true && (
      <View style={styles.redirectWarning}>
        <Text style={styles.redirectWarningTitle}>{redirectTitle}</Text>
        <Text style={styles.redirectWarningText}>{redirectText}</Text>
        <View style={styles.redirectButtonRow}>
          {redirectOptions.map((option, index) => (
            <TouchableOpacity
              key={option.unid + index}
              style={[styles.redirectButton, { flex: 1, marginRight: index < redirectOptions.length - 1 ? spacing.sm : 0 }]}
              onPress={() => onRedirect(option.unid)}
            >
              <Text style={styles.redirectButtonText}>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )}
  </View>
);

// Yes/No Toggle Component
interface YesNoToggleProps {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  infoText?: string;
  errorText?: string;
  helperText?: string;
}

const YesNoToggle: React.FC<YesNoToggleProps> = ({
  label,
  value,
  onValueChange,
  infoText,
  errorText,
  helperText,
}) => (
  <View style={styles.formGroup}>
    <Text style={styles.inputLabel}>{label}</Text>
    {infoText && <Text style={styles.infoText}>{infoText}</Text>}
    <View style={styles.yesNoContainer}>
      <TouchableOpacity
        style={[styles.responseButton, value && styles.yesButtonActive]}
        onPress={() => onValueChange(true)}
      >
        <Text style={[styles.responseButtonText, value && styles.responseButtonTextActive]}>
          Yes
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.responseButton, !value && styles.noButtonActive]}
        onPress={() => onValueChange(false)}
      >
        <Text style={[styles.responseButtonText, !value && styles.responseButtonTextActive]}>
          No
        </Text>
      </TouchableOpacity>
    </View>
    {!value && errorText && <Text style={styles.errorText}>{errorText}</Text>}
    {helperText && <Text style={styles.helperText}>{helperText}</Text>}
  </View>
);

export const BatteryPoweredVehicleScreen = ({ navigation }: { navigation: any }) => {
  const { state, actions } = useHazProStore();
  const { navigate } = useNavigationRef();
  const batteryVehicle = state.hazProPreparerContext.batteryVehicle;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;

  // Determine vehicle vs equipment
  const isVehicle = hazardousMaterial?.properShippingName === 'BATTERY-POWERED VEHICLE';
  const isEquipment = hazardousMaterial?.properShippingName === 'BATTERY-POWERED EQUIPMENT';

  // Form state
  const [isLoading, setIsLoading] = useState(false);
  const [vehicleType, setVehicleType] = useState(batteryVehicle?.vehicleType || '');
  const [customVehicleType, setCustomVehicleType] = useState(batteryVehicle?.customVehicleType || '');
  const [batteryType, setBatteryType] = useState(batteryVehicle?.batteryType || '');
  const [batteryInstalled, setBatteryInstalled] = useState(batteryVehicle?.batteryInstalled ?? true);
  const [securedUpright, setSecuredUpright] = useState(batteryVehicle?.securedUpright ?? true);
  const [terminalsProtected, setTerminalsProtected] = useState(batteryVehicle?.terminalsProtected ?? false);
  const [cablesDisconnected, setCablesDisconnected] = useState(batteryVehicle?.cablesDisconnected ?? false);
  const [isWheelchair, setIsWheelchair] = useState(batteryVehicle?.isWheelchair ?? false);
  const [wheelchairUpright, setWheelchairUpright] = useState(batteryVehicle?.wheelchairUpright ?? true);
  const [isLithiumBattery, setIsLithiumBattery] = useState(batteryVehicle?.isLithiumBattery ?? false);
  const [lithiumBatteryTested, setLithiumBatteryTested] = useState(batteryVehicle?.lithiumBatteryTested ?? false);
  const [notes, setNotes] = useState(batteryVehicle?.notes || '');
  const [key16Description, setKey16Description] = useState(batteryVehicle?.key16?.description || '');
  const [key16NetQuantityValue, setKey16NetQuantityValue] = useState(
    batteryVehicle?.key16?.netQuantity?.value?.toString() || ''
  );
  const [key16NetQuantityUnit, setKey16NetQuantityUnit] = useState<'kg' | 'lbs'>(
    batteryVehicle?.key16?.netQuantity?.unit || 'kg'
  );
  const [key16NetQuantityValueKg, setKey16NetQuantityValueKg] = useState(
    batteryVehicle?.key16?.netQuantity?.valueKg?.toString() || ''
  );
  const [key19ContainsMagnetizedMaterial, setKey19ContainsMagnetizedMaterial] = useState(
    batteryVehicle?.key19?.containsMagnetizedMaterial ?? false
  );

  // SP134 redirect prompts
  const [showVehicleEnginePrompt, setShowVehicleEnginePrompt] = useState<boolean | null>(null);
  const [showVehicleFuelCellPrompt, setShowVehicleFuelCellPrompt] = useState<boolean | null>(null);
  const [showEquipmentEnginePrompt, setShowEquipmentEnginePrompt] = useState<boolean | null>(null);
  const [showEquipmentFuelCellPrompt, setShowEquipmentFuelCellPrompt] = useState<boolean | null>(null);
  const [showEquipmentLithiumPrompt, setShowEquipmentLithiumPrompt] = useState<boolean | null>(null);

  // Handlers
  const handleRedirect = useCallback((unid: string) => {
    actions.updatePreparerField('redirectUnid', unid);
    navigation.navigate('MaterialID');
  }, [actions, navigation]);

  // Detect wheelchair selection
  useEffect(() => {
    setIsWheelchair(vehicleType === 'Wheelchair');
  }, [vehicleType]);

  // Detect lithium battery selection
  useEffect(() => {
    const isLithium = batteryType === 'Lithium Metal Battery' || batteryType === 'Lithium Ion Battery';
    setIsLithiumBattery(isLithium);
    if (!isLithium) setLithiumBatteryTested(false);
  }, [batteryType]);

  // Key 16 quantity handlers
  const handleKey16QuantityChange = (value: string) => {
    const numericValue = value.replace(/[^0-9.]/g, '');
    setKey16NetQuantityValue(numericValue);
    const valueKg = key16NetQuantityUnit === 'kg'
      ? parseFloat(numericValue) || 0
      : (parseFloat(numericValue) || 0) * 0.45359237;
    setKey16NetQuantityValueKg(valueKg ? valueKg.toFixed(2) : '0');
  };

  const handleKey16UnitChange = (unit: 'kg' | 'lbs') => {
    setKey16NetQuantityUnit(unit);
    if (key16NetQuantityValue) {
      const valueKg = unit === 'kg'
        ? parseFloat(key16NetQuantityValue) || 0
        : (parseFloat(key16NetQuantityValue) || 0) * 0.45359237;
      setKey16NetQuantityValueKg(valueKg ? valueKg.toFixed(2) : '0');
    }
  };

  // Form validation
  const isFormValid = useMemo(() => {
    const basicInfoValid = vehicleType !== '' &&
      (vehicleType !== 'Other' || customVehicleType.trim() !== '') &&
      batteryType !== '';
    const batteryProtectionValid = securedUpright && terminalsProtected;
    const wheelchairValid = !isWheelchair || wheelchairUpright;
    const lithiumValid = !isLithiumBattery || lithiumBatteryTested;
    const key16Valid = key16Description.trim().length > 0 && parseFloat(key16NetQuantityValue) > 0;
    return basicInfoValid && batteryProtectionValid && wheelchairValid && lithiumValid && key16Valid;
  }, [vehicleType, customVehicleType, batteryType, securedUpright, terminalsProtected,
      isWheelchair, wheelchairUpright, isLithiumBattery, lithiumBatteryTested,
      key16Description, key16NetQuantityValue]);

  const handleSaveAndContinue = () => {
    setIsLoading(true);
    const batteryVehicleData: BatteryDetails = {
      vehicleType,
      customVehicleType: vehicleType === 'Other' ? customVehicleType : '',
      batteryType,
      batteryInstalled,
      securedUpright,
      terminalsProtected,
      cablesDisconnected,
      cablesSecured: false,
      isWheelchair,
      wheelchairUpright,
      isLithiumBattery,
      lithiumBatteryTested,
      notes,
      key16: {
        description: key16Description,
        netQuantity: {
          value: parseFloat(key16NetQuantityValue) || 0,
          unit: key16NetQuantityUnit,
          valueKg: parseFloat(key16NetQuantityValueKg) || 0,
        },
      },
      key19: { containsMagnetizedMaterial: key19ContainsMagnetizedMaterial },
    };

    actions.updatePreparerField('batteryVehicle', batteryVehicleData);
    actions.updatePreparerField('completedSubsteps', [...completedSubsteps, 'BatteryPoweredVehicle']);

    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('LabelingAndMarking');
    }, 500);
  };

  const handleSaveExit = () => {
    actions.saveShipment({ id: Date.now().toString(), status: 'in-progress' });
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  // Material info for header
  const materialInfo = useMemo(() => ({
    unid: hazardousMaterial?.unid || '',
    properShippingName: hazardousMaterial?.properShippingName || '',
    hazardClass: hazardousMaterial?.hazclassDiv || '',
    packingGroup: hazardousMaterial?.packingGroup,
  }), [hazardousMaterial]);

  const title = isVehicle ? 'Battery Powered Vehicle' : 'Battery Powered Equipment';

  return (
    <SpecialtyMaterialScreen
      title={title}
      onBack={() => navigation.goBack()}
      material={materialInfo}
      onCancel={() => navigation.goBack()}
      onSaveExit={handleSaveExit}
      onContinue={handleSaveAndContinue}
      continueDisabled={!isFormValid || isLoading}
      infoBanner="Use vehicle/equipment service technical manuals to prepare items for shipment. (A13.6.1)"
    >
      {/* AFMAN24-604 Requirements Reference */}
      <DetailCard
        title="AFMAN24-604 Requirements"
        icon="info"
        fields={[
          { label: 'Battery Position', value: 'Secure batteries upright in designed holders' },
          { label: 'Terminal Protection', value: 'Protect terminals to prevent short circuit' },
          { label: 'Cable Security', value: 'If disconnected, secure cables away from terminals' },
          { label: 'Lithium Batteries', value: 'Must be of a type that has passed UN testing' },
        ]}
      />

      {/* SP134 Notice */}
      <InfoBox
        variant="warning"
        title="Special Provision 134"
        message={isVehicle
          ? 'This entry applies to vehicles powered by wet batteries, sodium batteries, lithium metal batteries or lithium ion batteries that are transported with these batteries installed.'
          : 'Equipment powered by lithium metal batteries or lithium ion batteries must be consigned under lithium battery entries (UN3480/3481/3090/3091) as appropriate.'}
      />

      {/* Vehicle SP134 Prompts */}
      {isVehicle && (
        <>
          <RedirectPrompt
            question="Does your vehicle contain an internal combustion engine?"
            value={showVehicleEnginePrompt}
            onValueChange={setShowVehicleEnginePrompt}
            redirectTitle="Classification Change Required"
            redirectText="Self-propelled vehicles with an internal combustion engine must be consigned under the appropriate entry."
            redirectOptions={[
              { label: 'Vehicle, flammable gas powered', unid: 'UN3166' },
              { label: 'Vehicle, flammable liquid powered', unid: 'UN3166' },
            ]}
            onRedirect={handleRedirect}
          />
          <RedirectPrompt
            question="Does your vehicle contain a fuel cell engine (hybrid or fuel cell)?"
            value={showVehicleFuelCellPrompt}
            onValueChange={setShowVehicleFuelCellPrompt}
            redirectTitle="Classification Change Required"
            redirectText="Self-propelled vehicles with a fuel cell engine must be consigned under the appropriate entry."
            redirectOptions={[
              { label: 'Vehicle, fuel cell, flammable gas powered', unid: 'UN3166' },
              { label: 'Vehicle, fuel cell, flammable liquid powered', unid: 'UN3166' },
            ]}
            onRedirect={handleRedirect}
          />
        </>
      )}

      {/* Equipment SP134 Prompts */}
      {isEquipment && (
        <>
          <RedirectPrompt
            question="Does your equipment contain an internal combustion engine?"
            value={showEquipmentEnginePrompt}
            onValueChange={setShowEquipmentEnginePrompt}
            redirectTitle="Classification Change Required"
            redirectText="Equipment with an internal combustion engine must be consigned under the appropriate entry."
            redirectOptions={[
              { label: 'Engine, internal combustion, flammable gas powered', unid: 'UN3529' },
              { label: 'Engine, internal combustion, flammable liquid powered', unid: 'UN3529' },
            ]}
            onRedirect={handleRedirect}
          />
          <RedirectPrompt
            question="Does your equipment contain a fuel cell engine (hybrid or fuel cell)?"
            value={showEquipmentFuelCellPrompt}
            onValueChange={setShowEquipmentFuelCellPrompt}
            redirectTitle="Classification Change Required"
            redirectText="Equipment with a fuel cell engine must be consigned under the appropriate entry."
            redirectOptions={[
              { label: 'Engine, fuel cell, flammable gas powered', unid: 'UN3529' },
              { label: 'Engine, fuel cell, flammable liquid powered', unid: 'UN3528' },
            ]}
            onRedirect={handleRedirect}
          />
          <RedirectPrompt
            question="Is your equipment powered by lithium metal batteries or lithium ion batteries?"
            value={showEquipmentLithiumPrompt}
            onValueChange={setShowEquipmentLithiumPrompt}
            redirectTitle="Classification Change Required"
            redirectText="Equipment powered by lithium batteries must be consigned under lithium battery entries per Special Provision 134(b)."
            redirectOptions={[
              { label: 'Lithium metal batteries contained in equipment', unid: 'UN3091' },
              { label: 'Lithium ion batteries contained in equipment', unid: 'UN3481' },
            ]}
            onRedirect={handleRedirect}
          />
        </>
      )}

      {/* Vehicle/Equipment Type Selection */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>{isVehicle ? 'Vehicle' : 'Equipment'} Information</Text>
        <FormField label={isVehicle ? 'Vehicle Type' : 'Equipment Type'} required>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={vehicleType}
              onValueChange={setVehicleType}
              style={styles.picker}
            >
              <Picker.Item label={`Select ${isVehicle ? 'vehicle' : 'equipment'} type`} value="" enabled={false} />
              {(isVehicle ? VEHICLE_TYPES : EQUIPMENT_TYPES).map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </FormField>

        {vehicleType === 'Other' && (
          <FormField label={`Specify ${isVehicle ? 'Vehicle' : 'Equipment'} Type`} required>
            <FormInput
              value={customVehicleType}
              onChangeText={setCustomVehicleType}
              placeholder={`Enter ${isVehicle ? 'vehicle' : 'equipment'} type`}
            />
          </FormField>
        )}

        <FormField label="Battery Type" required>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={batteryType}
              onValueChange={setBatteryType}
              style={styles.picker}
            >
              <Picker.Item label="Select battery type" value="" enabled={false} />
              {BATTERY_TYPES.map(type => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
        </FormField>

        {isLithiumBattery && (
          <InfoBox
            variant={isEquipment ? 'error' : 'info'}
            message={isEquipment
              ? 'Equipment powered by lithium batteries typically requires classification under lithium battery entries (UN3480/3481/3090/3091) per Special Provision 134(b).'
              : 'Lithium batteries must be securely fastened in the battery holder and protected from damage and short circuits. (A13.6.6)'}
          />
        )}

        <RadioGroup
          label="Battery Installation Status"
          options={[
            { label: `Battery installed in ${isVehicle ? 'vehicle' : 'equipment'}`, value: 'installed' },
            { label: 'Battery removed (shipped separately)', value: 'removed' },
          ]}
          value={batteryInstalled ? 'installed' : 'removed'}
          onChange={(v) => setBatteryInstalled(v === 'installed')}
        />
        {!batteryInstalled && (
          <Text style={styles.helperText}>
            Removed batteries must be prepared and shipped according to A12.4 regulations.
          </Text>
        )}
      </View>

      {/* Battery Safety Requirements */}
      {batteryInstalled && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Battery Safety Requirements</Text>

          <YesNoToggle
            label="Battery Secured Upright"
            value={securedUpright}
            onValueChange={setSecuredUpright}
            infoText="Secure batteries upright in designed holders except non-spillable batteries meeting Table A4.2, Special Provision A67 as nonhazardous. (A13.6.2)"
            errorText="Batteries must be secured upright in designed holders per AFMAN24-604."
          />

          <YesNoToggle
            label="Terminals Protected from Short Circuit"
            value={terminalsProtected}
            onValueChange={setTerminalsProtected}
            infoText="Protect the terminals of installed batteries by use of battery boxes, protective covers, taping, etc. (A13.6.2)"
            errorText="Battery terminals must be protected against short circuits."
          />

          <RadioGroup
            label="Battery Cables Status"
            options={[
              { label: 'Cables connected to battery', value: 'connected' },
              { label: 'Cables disconnected from battery', value: 'disconnected' },
            ]}
            value={cablesDisconnected ? 'disconnected' : 'connected'}
            onChange={(v) => setCablesDisconnected(v === 'disconnected')}
          />
          {cablesDisconnected && (
            <Text style={styles.helperText}>
              Disconnected cables should be secured away from terminals to prevent short circuits.
            </Text>
          )}
        </View>
      )}

      {/* Special Requirements */}
      {(isWheelchair || isLithiumBattery) && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Requirements</Text>

          {isVehicle && isWheelchair && (
            <View style={styles.specialSection}>
              <Text style={styles.subsectionTitle}>Wheelchair Requirements</Text>
              <Text style={styles.infoText}>
                For wheelchairs equipped with spillable batteries: Must be secured upright in cargo,
                battery installed and attached, terminals protected, wheelchair deactivated. (A13.6.5)
              </Text>
              <YesNoToggle
                label="Wheelchair Loaded in Upright Position"
                value={wheelchairUpright}
                onValueChange={setWheelchairUpright}
                errorText="Batteries must be removed if wheelchair cannot be shipped upright. Remove and ship battery per A12.4."
                helperText="Wheelchairs with spillable batteries must be secured in upright position."
              />
            </View>
          )}

          {isLithiumBattery && (
            <View style={styles.specialSection}>
              <Text style={styles.subsectionTitle}>Lithium Battery Requirements</Text>
              <Text style={styles.infoText}>
                Securely fasten lithium batteries, protect against damage and short circuits.
                Each battery must have passed UN Manual of Tests and Criteria, or be DOT approved. (A13.6.6)
              </Text>
              <YesNoToggle
                label="Battery Testing Compliance"
                value={lithiumBatteryTested}
                onValueChange={setLithiumBatteryTested}
                errorText="Lithium batteries must have passed UN Manual of Tests and Criteria or be DOT approved."
              />
            </View>
          )}
        </View>
      )}

      {/* Key 16 - Cargo Description & Quantity */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key 16 - Cargo Description & Quantity</Text>

        <FormField label="Nomenclature / Description" required>
          <FormInput
            value={key16Description}
            onChangeText={setKey16Description}
            placeholder="e.g. Truck, Generator, Wheelchair"
          />
        </FormField>

        <FormField label="Model Number / Specific Description (optional)">
          <FormInput
            value={notes}
            onChangeText={setNotes}
            placeholder="e.g. M-Series, 50 KW, 60 HZ"
          />
          <Text style={styles.helperText}>
            Enter a specific model number or description if available.
          </Text>
        </FormField>

        <FormField label="Net Quantity of Hazardous Material" required>
          <View style={styles.quantityRow}>
            <FormInput
              style={{ flex: 1 }}
              value={key16NetQuantityValue}
              onChangeText={handleKey16QuantityChange}
              keyboardType="numeric"
              placeholder="Enter quantity"
            />
            <TouchableOpacity
              style={[styles.unitButton, key16NetQuantityUnit === 'kg' && styles.unitButtonActive]}
              onPress={() => handleKey16UnitChange('kg')}
            >
              <Text style={[styles.unitButtonText, key16NetQuantityUnit === 'kg' && styles.unitButtonTextActive]}>
                kg
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.unitButton, key16NetQuantityUnit === 'lbs' && styles.unitButtonActive]}
              onPress={() => handleKey16UnitChange('lbs')}
            >
              <Text style={[styles.unitButtonText, key16NetQuantityUnit === 'lbs' && styles.unitButtonTextActive]}>
                lbs
              </Text>
            </TouchableOpacity>
          </View>
          {key16NetQuantityUnit === 'lbs' && (
            <Text style={styles.helperText}>Metric value (kg): {key16NetQuantityValueKg || '0'}</Text>
          )}
        </FormField>
      </View>

      {/* Key 19 - Magnetized Material */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Key 19 - Magnetized Material Statement</Text>
        <YesNoToggle
          label="Contains Magnetized Material?"
          value={key19ContainsMagnetizedMaterial}
          onValueChange={setKey19ContainsMagnetizedMaterial}
          helperText='If Yes, "Contains Magnetized Material" will be included in Key 19 output.'
        />
      </View>

      {/* Additional Notes */}
      <View style={styles.card}>
        <FormField label="Additional Preparation Notes">
          <FormInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Enter any additional details about preparation"
            multiline
            numberOfLines={4}
            style={{ minHeight: 100, textAlignVertical: 'top' }}
          />
        </FormField>
      </View>
    </SpecialtyMaterialScreen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.light,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  subsectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  formGroup: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  infoText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  helperText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    marginTop: spacing.xs,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  picker: {
    height: 55,
    width: '100%',
    color: colors.textPrimary,
  },
  specialSection: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    backgroundColor: colors.background,
  },
  yesNoContainer: {
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
    minWidth: 80,
    alignItems: 'center',
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
  quantityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  unitButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    borderRadius: borderRadius.sm,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  unitButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  unitButtonText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  unitButtonTextActive: {
    color: colors.white,
  },
  // SP134 Redirect Prompt styles
  promptBox: {
    backgroundColor: colors.infoLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  promptText: {
    ...typography.body,
    fontWeight: '500',
    color: colors.primary,
    marginBottom: spacing.sm,
  },
  promptButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  promptButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  promptYesActive: {
    backgroundColor: colors.success,
  },
  promptNoActive: {
    backgroundColor: colors.error,
  },
  promptButtonText: {
    color: colors.white,
    fontWeight: '600',
    ...typography.body,
  },
  promptButtonTextActive: {
    color: colors.white,
    fontWeight: '700',
  },
  redirectWarning: {
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.md,
    borderLeftWidth: 4,
    borderLeftColor: colors.error,
  },
  redirectWarningTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.error,
    marginBottom: spacing.sm,
  },
  redirectWarningText: {
    ...typography.caption,
    color: colors.error,
    marginBottom: spacing.md,
  },
  redirectButtonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  redirectButton: {
    backgroundColor: colors.error,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  redirectButtonText: {
    color: colors.white,
    ...typography.caption,
    fontWeight: '600',
  },
});

export default BatteryPoweredVehicleScreen;
