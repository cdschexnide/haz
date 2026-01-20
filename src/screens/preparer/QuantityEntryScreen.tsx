// src/screens/preparer/QuantityEntryScreen.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useHazProStore } from '@/stores/useHazProStore';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  DetailCard,
  Button,
} from '@/components/ui';
// Note: calculateEligibility utility available at '@/utils/eligibility/eqLqEligibility'
// Currently using server functions directly for comprehensive validation
import {
  isHazardousMaterialExceptedQuantity,
  IsHazardousMaterialExceptedQuantityInput,
} from '../../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity';
import {
  isHazardousMaterialLimitedQuantity,
  IsHazardousMaterialLimitedQuantityInput,
} from '../../../server/attachment19/limitedQuantities/isHazardousMaterialLimitedQuantity';
import { ExceptedQuantityData, LimitedQuantityData } from '../../../types';

type EligibilityStatus = 'excepted' | 'limited' | 'standard' | 'checking';

type QuantityUnit = 'mL' | 'g' | 'L' | 'kg';
type WeightUnit = 'kg' | 'lbs';

interface QuantityFormData {
  numberOfInnerPackages: string;
  quantityPerInnerPackage: string;
  quantityPerInnerPackageUnit: QuantityUnit;
  totalQuantity: string;
  totalQuantityUnit: QuantityUnit;
  grossWeight: string;
  grossWeightUnit: WeightUnit;
  isInKit: boolean;
}

// Status badge configuration
const STATUS_CONFIG: Record<EligibilityStatus, { bg: string; text: string }> = {
  excepted: { bg: '#10b981', text: 'EXCEPTED QUANTITY' },
  limited: { bg: '#f59e0b', text: 'LIMITED QUANTITY' },
  standard: { bg: colors.primary, text: 'STANDARD QUANTITY' },
  checking: { bg: colors.textSecondary, text: 'CHECKING ELIGIBILITY...' },
};

// Explanation content for each status type
const EXPLANATIONS = [
  {
    code: 'EQ',
    title: 'Excepted Quantity',
    bg: '#10b981',
    points: [
      'No UN specification packaging required',
      'No hazard labels required',
      'No SDDG or certification signature required',
      'Special "E" marking only',
    ],
  },
  {
    code: 'LQ',
    title: 'Limited Quantity',
    bg: '#f59e0b',
    points: [
      'No UN specification packaging (no POP marking)',
      'Hazard labels still required',
      'SDDG and certification still required',
      'Max gross weight: 30 kg (66 lbs)',
    ],
  },
  {
    code: 'STD',
    title: 'Standard Quantity',
    bg: colors.primary,
    points: [
      'Full UN specification packaging required',
      'All labeling and marking requirements apply',
      'SDDG and certification required',
      'Follow standard preparation workflow',
    ],
  },
];

const INITIAL_FORM_DATA: QuantityFormData = {
  numberOfInnerPackages: '',
  quantityPerInnerPackage: '',
  quantityPerInnerPackageUnit: 'mL',
  totalQuantity: '',
  totalQuantityUnit: 'mL',
  grossWeight: '',
  grossWeightUnit: 'kg',
  isInKit: false,
};

export const QuantityEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, actions } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;

  const [formData, setFormData] = useState<QuantityFormData>(INITIAL_FORM_DATA);
  const [eligibilityStatus, setEligibilityStatus] = useState<EligibilityStatus>('checking');
  const [validationMessage, setValidationMessage] = useState('Enter quantities to check eligibility');
  const [isValidating, setIsValidating] = useState(false);

  const isFormValid =
    formData.numberOfInnerPackages !== '' &&
    formData.quantityPerInnerPackage !== '' &&
    formData.totalQuantity !== '';

  // Validate EQ/LQ eligibility using utility
  const validateEligibility = useCallback(async () => {
    if (!material) return;

    if (!isFormValid) {
      setEligibilityStatus('checking');
      setValidationMessage('Enter quantities to check eligibility');
      return;
    }

    setIsValidating(true);

    try {
      const numberOfInnerPackages = parseInt(formData.numberOfInnerPackages, 10);
      const quantityPerInner = parseFloat(formData.quantityPerInnerPackage);
      const totalQty = parseFloat(formData.totalQuantity);
      const grossWeightValue = parseFloat(formData.grossWeight || '0');
      const isLiquid = material.physicalState?.toLowerCase() === 'liquid';

      // Check Excepted Quantity eligibility
      const eqInput: IsHazardousMaterialExceptedQuantityInput = {
        material,
        containedInChemicalKitOrFirstAidKit: formData.isInKit,
        innerPackagingQuantityIn_mLs: isLiquid ? quantityPerInner : undefined,
        outerPackagingQuantityIn_mLs: isLiquid ? totalQty : undefined,
        innerPackagingQuantityIn_grams: !isLiquid ? quantityPerInner : undefined,
        outerPackagingQuantityIn_grams: !isLiquid ? totalQty : undefined,
      };

      const eqResult = isHazardousMaterialExceptedQuantity(eqInput);

      if (typeof eqResult === 'undefined') {
        // EQ eligible
        setEligibilityStatus('excepted');
        setValidationMessage('Eligible for Excepted Quantity - Major exemptions apply!');

        const eqData: ExceptedQuantityData = {
          eligible: true,
          isInKit: formData.isInKit,
          numberOfInnerPackages,
          quantityPerInnerPackage: {
            value: quantityPerInner,
            unit: formData.quantityPerInnerPackageUnit as 'mL' | 'g',
          },
          totalOuterQuantity: { value: totalQty, unit: formData.totalQuantityUnit },
          exceedsLimits: false,
          limits: {
            maxInner: { value: 0, unit: formData.quantityPerInnerPackageUnit },
            maxOuter: { value: 0, unit: formData.totalQuantityUnit },
          },
        };
        actions.updateExceptedQuantityData(eqData);
        actions.setIsExceptedQuantity(true);
        actions.setIsLimitedQuantity(false);
        return;
      }

      // Check Limited Quantity eligibility
      const grossWeightKg = formData.grossWeightUnit === 'kg'
        ? grossWeightValue
        : grossWeightValue * 0.453592;

      const lqInput: IsHazardousMaterialLimitedQuantityInput = {
        materials: [{
          material,
          packagingQuantities: {
            physicalState: material.physicalState,
            innerPackagingVolumeIn_mL: isLiquid ? quantityPerInner : undefined,
            innerPackagingQuantityIn_g: !isLiquid ? quantityPerInner : undefined,
            quantityPerPackageIn_mL: isLiquid ? totalQty : undefined,
            quantityPerPackageIn_g: !isLiquid ? totalQty : undefined,
            grossQuantityPerPackageIn_kg: grossWeightKg,
          },
        }],
      };

      const lqResult = isHazardousMaterialLimitedQuantity(lqInput);

      if (lqResult?.isLimited) {
        setEligibilityStatus('limited');
        setValidationMessage('Eligible for Limited Quantity - Some exemptions apply');

        const lqData: LimitedQuantityData = {
          eligible: true,
          permissionReason: lqResult.reason,
          quantityPerInnerPackage: {
            value: quantityPerInner,
            unit: formData.quantityPerInnerPackageUnit,
          },
          totalPerPackage: { value: totalQty, unit: formData.totalQuantityUnit },
          grossWeight: { value: grossWeightValue, unit: formData.grossWeightUnit },
          exceedsLimits: false,
          limits: {
            maxInner: { value: 0, unit: formData.quantityPerInnerPackageUnit },
            maxPerPackage: { value: 0, unit: formData.totalQuantityUnit },
            maxGrossWeight: { value: 30, unit: 'kg' },
          },
        };
        actions.updateLimitedQuantityData(lqData);
        actions.setIsLimitedQuantity(true);
        actions.setIsExceptedQuantity(false);
      } else {
        setEligibilityStatus('standard');
        const reason = eqResult?.reason || lqResult?.reason || 'Does not meet EQ or LQ criteria';
        setValidationMessage(`Standard Quantity: ${reason}`);
        actions.setIsExceptedQuantity(false);
        actions.setIsLimitedQuantity(false);
      }
    } catch (error) {
      console.error('Error validating EQ/LQ eligibility:', error);
      setEligibilityStatus('standard');
      setValidationMessage('Validation error - defaulting to Standard Quantity');
    } finally {
      setIsValidating(false);
    }
  }, [formData, material, actions, isFormValid]);

  useEffect(() => {
    const timer = setTimeout(validateEligibility, 300);
    return () => clearTimeout(timer);
  }, [validateEligibility]);

  const handleContinue = () => {
    if (!material) return;

    const routes: Record<EligibilityStatus, string | null> = {
      excepted: 'ExceptedQuantityPackagingGuidance',
      limited: 'LimitedQuantityPackagingGuidance',
      standard: 'GeneralPackagingAcknowledgement',
      checking: null,
    };

    const route = routes[eligibilityStatus];
    if (route) {
      navigation.navigate(route);
    } else {
      alert('Please enter valid quantities before continuing');
    }
  };

  const updateFormField = <K extends keyof QuantityFormData>(
    field: K,
    value: QuantityFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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

  const statusConfig = STATUS_CONFIG[eligibilityStatus];

  const continueLabel = eligibilityStatus === 'excepted'
    ? 'Continue to Excepted Quantity Guidance'
    : eligibilityStatus === 'limited'
    ? 'Continue to Limited Quantity Guidance'
    : 'Continue to Standard Workflow';

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quantity Entry</Text>
        <Text style={styles.headerSubtitle}>
          Enter package quantities to determine eligibility for special provisions
        </Text>
      </View>

      {/* Material Summary */}
      <View style={styles.section}>
        <DetailCard
          title="Selected Hazardous Material"
          icon="local-shipping"
          fields={[
            { label: 'UN Number', value: material.unid },
            { label: 'Proper Shipping Name', value: material.properShippingName },
            { label: 'Hazard Class', value: material.hazclassDiv },
            { label: 'Packing Group', value: material.packingGroup || 'N/A' },
          ]}
        />
      </View>

      {/* Kit Switch */}
      <View style={[styles.section, styles.card]}>
        <View style={styles.switchRow}>
          <View style={styles.switchContent}>
            <Text style={styles.switchLabel}>Chemical or First-Aid Kit?</Text>
            <Text style={styles.switchHint}>
              Check if this material is part of a chemical or first-aid kit
            </Text>
          </View>
          <Switch
            value={formData.isInKit}
            onValueChange={value => updateFormField('isInKit', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.surface}
          />
        </View>
      </View>

      {/* Quantity Inputs */}
      <View style={[styles.section, styles.card]}>
        <Text style={styles.cardTitle}>Package Quantities</Text>

        <Text style={styles.inputLabel}>Number of Inner Packages *</Text>
        <TextInput
          style={styles.input}
          value={formData.numberOfInnerPackages}
          onChangeText={value => updateFormField('numberOfInnerPackages', value)}
          keyboardType="numeric"
          placeholder="e.g., 10"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={styles.inputLabel}>Quantity per Inner Package *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={formData.quantityPerInnerPackage}
            onChangeText={value => updateFormField('quantityPerInnerPackage', value)}
            keyboardType="decimal-pad"
            placeholder="e.g., 100"
            placeholderTextColor={colors.textSecondary}
          />
          <Picker
            style={styles.picker}
            selectedValue={formData.quantityPerInnerPackageUnit}
            onValueChange={value => updateFormField('quantityPerInnerPackageUnit', value as QuantityUnit)}
          >
            <Picker.Item label="mL" value="mL" />
            <Picker.Item label="L" value="L" />
            <Picker.Item label="g" value="g" />
            <Picker.Item label="kg" value="kg" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Total Quantity (all packages) *</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={formData.totalQuantity}
            onChangeText={value => updateFormField('totalQuantity', value)}
            keyboardType="decimal-pad"
            placeholder="e.g., 1000"
            placeholderTextColor={colors.textSecondary}
          />
          <Picker
            style={styles.picker}
            selectedValue={formData.totalQuantityUnit}
            onValueChange={value => updateFormField('totalQuantityUnit', value as QuantityUnit)}
          >
            <Picker.Item label="mL" value="mL" />
            <Picker.Item label="L" value="L" />
            <Picker.Item label="g" value="g" />
            <Picker.Item label="kg" value="kg" />
          </Picker>
        </View>

        <Text style={styles.inputLabel}>Estimated Gross Weight (optional)</Text>
        <Text style={styles.inputHint}>
          Required for Limited Quantity eligibility (max 30 kg / 66 lbs)
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={formData.grossWeight}
            onChangeText={value => updateFormField('grossWeight', value)}
            keyboardType="decimal-pad"
            placeholder="e.g., 25"
            placeholderTextColor={colors.textSecondary}
          />
          <Picker
            style={styles.picker}
            selectedValue={formData.grossWeightUnit}
            onValueChange={value => updateFormField('grossWeightUnit', value as WeightUnit)}
          >
            <Picker.Item label="kg" value="kg" />
            <Picker.Item label="lbs" value="lbs" />
          </Picker>
        </View>
      </View>

      {/* Status Badge */}
      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
        <View style={styles.statusContent}>
          {isValidating ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <MaterialCommunityIcons name="information" size={24} color={colors.white} />
          )}
          <View style={styles.statusText}>
            <Text style={styles.statusTitle}>{statusConfig.text}</Text>
            <Text style={styles.statusMessage}>{validationMessage}</Text>
          </View>
        </View>
      </View>

      {/* Explanations */}
      <View style={[styles.section, styles.card]}>
        <Text style={styles.cardTitle}>What does this mean?</Text>
        {EXPLANATIONS.map(item => (
          <View key={item.code} style={styles.explanationItem}>
            <View style={[styles.explanationBadge, { backgroundColor: item.bg }]}>
              <Text style={styles.explanationBadgeText}>{item.code}</Text>
            </View>
            <View style={styles.explanationContent}>
              <Text style={styles.explanationTitle}>{item.title}</Text>
              <Text style={styles.explanationPoints}>
                {item.points.map((p, i) => `${String.fromCharCode(8226)} ${p}`).join('\n')}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* Continue Button */}
      <View style={styles.section}>
        <Button
          label={continueLabel}
          onPress={handleContinue}
          disabled={!isFormValid}
          icon="arrow-forward"
          iconPosition="right"
          fullWidth
        />
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 60,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  section: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  card: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.light,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    padding: spacing.xl,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchContent: {
    flex: 1,
    marginRight: spacing.md,
  },
  switchLabel: {
    ...typography.cardTitle,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  switchHint: {
    ...typography.caption,
  },
  inputLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  inputHint: {
    ...typography.caption,
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
    gap: spacing.sm,
    alignItems: 'center',
  },
  inputFlex: {
    flex: 2,
  },
  picker: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
  },
  statusBadge: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    flex: 1,
    marginLeft: spacing.md,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: spacing.xs,
  },
  statusMessage: {
    ...typography.body,
    color: colors.white,
    opacity: 0.95,
  },
  explanationItem: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  explanationBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  explanationBadgeText: {
    ...typography.body,
    fontWeight: 'bold',
    color: colors.white,
  },
  explanationContent: {
    flex: 1,
  },
  explanationTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  explanationPoints: {
    ...typography.caption,
    lineHeight: 18,
  },
  bottomSpacer: {
    height: 40,
  },
});

export default QuantityEntryScreen;
