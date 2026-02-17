// src/screens/preparer/QuantityEntryScreen.tsx

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
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
  Button,
  ActionFooter,
  StepIndicator,
} from '@/components/ui';
import PackagingTypeCard from '@/components/PackagingWizardV2/PackagingTypeCard';
import {
  getAllowedPackagingTypes,
  PackagingTypeSelection,
} from '@/utils/getAllowedPackagingTypes';
import { evaluateAttachment19Eligibility } from '@/utils/eligibility/attachment19Eligibility';
import { hasSpecialProvisionAlphaCode } from '@/utils/specialProvisions';
// TODO: Re-enable EQ/LQ imports after demo
// import {
//   isHazardousMaterialExceptedQuantity,
//   IsHazardousMaterialExceptedQuantityInput,
// } from '../../../server/attachment19/exceptedQuantities/isHazardousMaterialExceptedQuantity';
// import {
//   isHazardousMaterialLimitedQuantity,
//   IsHazardousMaterialLimitedQuantityInput,
// } from '../../../server/attachment19/limitedQuantities/isHazardousMaterialLimitedQuantity';
// import { ExceptedQuantityData, LimitedQuantityData } from '../../../types';

const PACKAGING_TYPE_LABELS: Record<PackagingTypeSelection, string> = {
  single: 'Single',
  combination: 'Combination',
  composite: 'Composite',
};

const PACKAGING_TYPE_DESCRIPTIONS: Record<PackagingTypeSelection, string> = {
  single: 'Nonbulk packaging other than combination or composite',
  combination: 'Inner packagings in an outer packaging',
  composite: 'Outer packaging with integrated inner receptacle',
};

// TODO: Re-enable EQ/LQ types after demo
// type EligibilityStatus = 'excepted' | 'limited' | 'standard' | 'checking';

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
}

// TODO: Re-enable EQ/LQ types after demo
// interface EligibilityResult {
//   status: Exclude<EligibilityStatus, 'checking'>;
//   message: string;
//   eqData?: ExceptedQuantityData;
//   lqData?: LimitedQuantityData;
// }

const VOLUME_UNITS: QuantityUnit[] = ['mL', 'L'];
const MASS_UNITS: QuantityUnit[] = ['g', 'kg'];

const ML_PER_L = 1000;
const G_PER_KG = 1000;
const KG_TO_LBS = 2.20462;
const L_TO_GAL = 0.264172;

const toMl = (value: number, unit: QuantityUnit): number =>
  unit === 'L' ? value * ML_PER_L : value;

const toGrams = (value: number, unit: QuantityUnit): number =>
  unit === 'kg' ? value * G_PER_KG : value;

const toKg = (value: number, unit: QuantityUnit): number =>
  unit === 'g' ? value / G_PER_KG : value;

const toLiters = (value: number, unit: QuantityUnit): number =>
  unit === 'mL' ? value / ML_PER_L : value;

const parseNumber = (value: string): number | null => {
  if (!value.trim()) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const mapSelectionToContext = (selection: PackagingTypeSelection | '') => {
  if (selection === 'single') return 'Single';
  if (selection === 'combination') return 'Combination';
  if (selection === 'composite') return 'Composite';
  return '';
};

export const QuantityEntryScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, actions, saveCurrentShipment } = useHazProStore();
  const material = state.hazProPreparerContext.hazardousMaterial;

  const isLiquid =
    material?.physicalState?.toLowerCase() === 'liquid' ||
    material?.physicalState === 'LIQUID';

  const isInKit = material?.unid?.toUpperCase() === 'UN3316';

  const existingPackagingType = state.hazProPreparerContext.packaging?.packagingType;
  const initialPackagingType = useMemo<PackagingTypeSelection | ''>(() => {
    if (existingPackagingType === 'Single') return 'single';
    if (existingPackagingType === 'Combination') return 'combination';
    if (existingPackagingType === 'Composite') return 'composite';
    return '';
  }, [existingPackagingType]);

  const initialFormData = useMemo<QuantityFormData>(() => {
    const packaging = state.hazProPreparerContext.packaging;
    const totalVolumeLiters = packaging?.totalNetVolume?.liters ?? 0;
    const totalMassKg = packaging?.totalNetMass?.kg ?? 0;
    const innerCount = packaging?.combinationPackaging?.numberOfInnerContainers;
    const innerVolumeLiters =
      packaging?.combinationPackaging?.volumePerInnerContainer?.liters ?? 0;
    const innerMassKg =
      packaging?.combinationPackaging?.massPerInnerContainer?.kg ?? 0;

    const totalQuantityValue = isLiquid ? totalVolumeLiters : totalMassKg;
    const quantityPerInnerValue = isLiquid ? innerVolumeLiters : innerMassKg;

    return {
      numberOfInnerPackages:
        innerCount && innerCount > 0 ? String(innerCount) : '',
      quantityPerInnerPackage:
        quantityPerInnerValue && quantityPerInnerValue > 0
          ? String(quantityPerInnerValue)
          : '',
      quantityPerInnerPackageUnit: isLiquid ? 'L' : 'kg',
      totalQuantity:
        totalQuantityValue && totalQuantityValue > 0
          ? String(totalQuantityValue)
          : '',
      totalQuantityUnit: isLiquid ? 'L' : 'kg',
      grossWeight: '',
      grossWeightUnit: 'kg',
    };
  }, [isLiquid, state.hazProPreparerContext.packaging]);

  const [step, setStep] = useState(0);
  const [packagingType, setPackagingType] = useState<PackagingTypeSelection | ''>(
    initialPackagingType
  );
  const [formData, setFormData] = useState<QuantityFormData>(initialFormData);
  // TODO: Re-enable EQ/LQ state after demo
  // const [eligibilityResult, setEligibilityResult] = useState<EligibilityResult | null>(
  //   null
  // );
  // const [isValidating, setIsValidating] = useState(false);
  const [hasManualTotal, setHasManualTotal] = useState(false);

  const hasA2Restriction = useMemo(
    () => hasSpecialProvisionAlphaCode(material?.specialProvision, 'A2'),
    [material?.specialProvision]
  );

  const allowedPackagingTypes = useMemo(() => {
    return getAllowedPackagingTypes({
      packagingParagraph: material?.packagingParagraph || '',
      hasA2Restriction,
      unIdNo: material?.unid,
      properShippingName: material?.properShippingName,
    });
  }, [hasA2Restriction, material?.packagingParagraph, material?.properShippingName, material?.unid]);

  useEffect(() => {
    if (packagingType && !allowedPackagingTypes.includes(packagingType)) {
      setPackagingType('');
    }
  }, [allowedPackagingTypes, packagingType]);

  useEffect(() => {
    if (!packagingType && allowedPackagingTypes.length === 1) {
      setPackagingType(allowedPackagingTypes[0]);
    }
  }, [allowedPackagingTypes, packagingType]);

  useEffect(() => {
    setHasManualTotal(false);
  }, [packagingType]);

  useEffect(() => {
    const defaultUnit: QuantityUnit = isLiquid ? 'mL' : 'g';
    setFormData(prev => {
      const next = { ...prev };
      if (!VOLUME_UNITS.includes(prev.quantityPerInnerPackageUnit) && isLiquid) {
        next.quantityPerInnerPackageUnit = defaultUnit;
      }
      if (!MASS_UNITS.includes(prev.quantityPerInnerPackageUnit) && !isLiquid) {
        next.quantityPerInnerPackageUnit = defaultUnit;
      }
      if (!VOLUME_UNITS.includes(prev.totalQuantityUnit) && isLiquid) {
        next.totalQuantityUnit = defaultUnit;
      }
      if (!MASS_UNITS.includes(prev.totalQuantityUnit) && !isLiquid) {
        next.totalQuantityUnit = defaultUnit;
      }
      return next;
    });
  }, [isLiquid]);

  useEffect(() => {
    if (!store.hazProPreparerContext.packaging) return;

    store.hazProPreparerContext.packaging.packagingType =
      mapSelectionToContext(packagingType) as any;
  }, [packagingType, store.hazProPreparerContext.packaging]);

  useEffect(() => {
    if (!store.hazProPreparerContext.packaging) return;

    const totalValue = parseNumber(formData.totalQuantity);
    const isCombination = packagingType === 'combination' || packagingType === 'composite';

    if (isLiquid) {
      if (totalValue !== null) {
        const liters = toLiters(totalValue, formData.totalQuantityUnit);
        store.hazProPreparerContext.packaging.totalNetVolume = {
          liters,
          gallons: liters * L_TO_GAL,
        };
        if (store.hazProPreparerContext.packaging.totalNetMass) {
          store.hazProPreparerContext.packaging.totalNetMass.kg = 0;
          store.hazProPreparerContext.packaging.totalNetMass.lbs = 0;
        }
      }
    } else if (totalValue !== null) {
      const kg = toKg(totalValue, formData.totalQuantityUnit);
      store.hazProPreparerContext.packaging.totalNetMass = {
        kg,
        lbs: kg * KG_TO_LBS,
      };
      if (store.hazProPreparerContext.packaging.totalNetVolume) {
        store.hazProPreparerContext.packaging.totalNetVolume.liters = 0;
        store.hazProPreparerContext.packaging.totalNetVolume.gallons = 0;
      }
    }

    if (isCombination && store.hazProPreparerContext.packaging.combinationPackaging) {
      const innerCount = parseNumber(formData.numberOfInnerPackages);
      const perInner = parseNumber(formData.quantityPerInnerPackage);

      store.hazProPreparerContext.packaging.combinationPackaging.numberOfInnerContainers =
        innerCount !== null ? Math.max(0, Math.floor(innerCount)) : undefined;
      store.hazProPreparerContext.packaging.combinationPackaging.quantityPerContainer =
        formData.quantityPerInnerPackage || undefined;

      if (perInner !== null) {
        if (isLiquid) {
          const liters = toLiters(perInner, formData.quantityPerInnerPackageUnit);
          store.hazProPreparerContext.packaging.combinationPackaging.volumePerInnerContainer = {
            liters,
            gallons: liters * L_TO_GAL,
          };
        } else {
          const kg = toKg(perInner, formData.quantityPerInnerPackageUnit);
          store.hazProPreparerContext.packaging.combinationPackaging.massPerInnerContainer = {
            kg,
            lbs: kg * KG_TO_LBS,
          };
        }
      }
    }
  }, [
    formData.numberOfInnerPackages,
    formData.quantityPerInnerPackage,
    formData.quantityPerInnerPackageUnit,
    formData.totalQuantity,
    formData.totalQuantityUnit,
    isLiquid,
    packagingType,
    store.hazProPreparerContext.packaging,
  ]);

  const updateFormField = <K extends keyof QuantityFormData>(
    field: K,
    value: QuantityFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // TODO: Re-enable EQ/LQ eligibility reset useEffect after demo
  // useEffect(() => {
  //   setEligibilityResult(null);
  // }, [
  //   formData.numberOfInnerPackages,
  //   formData.quantityPerInnerPackage,
  //   formData.quantityPerInnerPackageUnit,
  //   formData.totalQuantity,
  //   formData.totalQuantityUnit,
  //   formData.grossWeight,
  //   formData.grossWeightUnit,
  //   packagingType,
  // ]);

  useEffect(() => {
    const isCombination = packagingType === 'combination' || packagingType === 'composite';
    if (!isCombination) return;

    const count = parseNumber(formData.numberOfInnerPackages);
    const per = parseNumber(formData.quantityPerInnerPackage);

    if (count === null || per === null) return;

    if (!hasManualTotal || formData.totalQuantity.trim() === '') {
      const total = count * per;
      setFormData(prev => ({
        ...prev,
        totalQuantity: total ? String(total) : '',
        totalQuantityUnit: prev.quantityPerInnerPackageUnit,
      }));
    }
  }, [
    formData.numberOfInnerPackages,
    formData.quantityPerInnerPackage,
    formData.quantityPerInnerPackageUnit,
    formData.totalQuantity,
    hasManualTotal,
    packagingType,
  ]);

  const isQuantityStepValid = useMemo(() => {
    if (!packagingType) return false;

    const total = parseNumber(formData.totalQuantity);
    const grossWeight = parseNumber(formData.grossWeight);
    const grossWeightValid = grossWeight === null || grossWeight >= 0;

    if (packagingType === 'single') {
      return total !== null && total > 0 && grossWeightValid;
    }

    const innerCount = parseNumber(formData.numberOfInnerPackages);
    const perInner = parseNumber(formData.quantityPerInnerPackage);

    return (
      innerCount !== null &&
      innerCount > 0 &&
      perInner !== null &&
      perInner > 0 &&
      total !== null &&
      total > 0 &&
      grossWeightValid
    );
  }, [formData, packagingType]);

  // TODO: Re-enable buildEligibilityInputs after demo
  // const buildEligibilityInputs = useCallback(() => {
  //   if (!material) return null;
  //
  //   const totalValue = parseNumber(formData.totalQuantity) ?? 0;
  //   const grossWeightValue = parseNumber(formData.grossWeight) ?? 0;
  //
  //   const isCombination = packagingType === 'combination' || packagingType === 'composite';
  //   const innerCount = isCombination
  //     ? parseNumber(formData.numberOfInnerPackages) ?? 0
  //     : 1;
  //   const perInnerValue = isCombination
  //     ? parseNumber(formData.quantityPerInnerPackage) ?? 0
  //     : totalValue;
  //   const perInnerUnit = isCombination
  //     ? formData.quantityPerInnerPackageUnit
  //     : formData.totalQuantityUnit;
  //
  //   const totalUnit = formData.totalQuantityUnit;
  //
  //   const innerQuantityForEq = isLiquid
  //     ? toMl(perInnerValue, perInnerUnit)
  //     : toGrams(perInnerValue, perInnerUnit);
  //   const outerQuantityForEq = isLiquid
  //     ? toMl(totalValue, totalUnit)
  //     : toGrams(totalValue, totalUnit);
  //
  //   const eqInput: IsHazardousMaterialExceptedQuantityInput = {
  //     material,
  //     containedInChemicalKitOrFirstAidKit: isInKit,
  //     innerPackagingQuantityIn_mLs: isLiquid ? innerQuantityForEq : undefined,
  //     outerPackagingQuantityIn_mLs: isLiquid ? outerQuantityForEq : undefined,
  //     innerPackagingQuantityIn_grams: !isLiquid ? innerQuantityForEq : undefined,
  //     outerPackagingQuantityIn_grams: !isLiquid ? outerQuantityForEq : undefined,
  //   };
  //
  //   const grossWeightKg =
  //     formData.grossWeightUnit === 'kg'
  //       ? grossWeightValue
  //       : grossWeightValue * 0.453592;
  //
  //   const lqInput: IsHazardousMaterialLimitedQuantityInput = {
  //     materials: [
  //       {
  //         material,
  //         packagingQuantities: {
  //           physicalState: material.physicalState,
  //           innerPackagingVolumeIn_mL: isLiquid ? innerQuantityForEq : undefined,
  //           innerPackagingQuantityIn_g: !isLiquid ? innerQuantityForEq : undefined,
  //           quantityPerPackageIn_mL: isLiquid ? outerQuantityForEq : undefined,
  //           quantityPerPackageIn_g: !isLiquid ? outerQuantityForEq : undefined,
  //           grossQuantityPerPackageIn_kg: grossWeightKg,
  //         },
  //       },
  //     ],
  //   };
  //
  //   return {
  //     innerCount,
  //     perInnerValue,
  //     perInnerUnit,
  //     totalValue,
  //     totalUnit,
  //     grossWeightValue,
  //     eqInput,
  //     lqInput,
  //   };
  // }, [
  //   formData,
  //   isInKit,
  //   isLiquid,
  //   material,
  //   packagingType,
  // ]);

  // TODO: Re-enable evaluateEligibility after demo
  // const evaluateEligibility = useCallback(async (): Promise<EligibilityResult> => {
  //   const inputs = buildEligibilityInputs();
  //   if (!inputs || !material) {
  //     return {
  //       status: 'standard',
  //       message: 'Unable to validate eligibility. Proceeding with standard workflow.',
  //     };
  //   }
  //
  //   const {
  //     innerCount,
  //     perInnerValue,
  //     perInnerUnit,
  //     totalValue,
  //     totalUnit,
  //     grossWeightValue,
  //     eqInput,
  //     lqInput,
  //   } = inputs;
  //
  //   const eqResult = isHazardousMaterialExceptedQuantity(eqInput);
  //
  //   if (typeof eqResult === 'undefined') {
  //     const eqData: ExceptedQuantityData = {
  //       eligible: true,
  //       isInKit,
  //       numberOfInnerPackages: innerCount,
  //       quantityPerInnerPackage: {
  //         value: isLiquid ? toMl(perInnerValue, perInnerUnit) : toGrams(perInnerValue, perInnerUnit),
  //         unit: isLiquid ? 'mL' : 'g',
  //       },
  //       totalOuterQuantity: { value: totalValue, unit: totalUnit },
  //       exceedsLimits: false,
  //       limits: {
  //         maxInner: { value: 0, unit: isLiquid ? 'mL' : 'g' },
  //         maxOuter: { value: 0, unit: totalUnit },
  //       },
  //     };
  //
  //     return {
  //       status: 'excepted',
  //       message: 'Eligible for Excepted Quantity. Major exemptions apply.',
  //       eqData,
  //     };
  //   }
  //
  //   const lqResult = isHazardousMaterialLimitedQuantity(lqInput);
  //
  //   if (lqResult?.isLimited) {
  //     const lqData: LimitedQuantityData = {
  //       eligible: true,
  //       permissionReason: lqResult.reason,
  //       quantityPerInnerPackage: {
  //         value: perInnerValue,
  //         unit: perInnerUnit,
  //       },
  //       totalPerPackage: { value: totalValue, unit: totalUnit },
  //       grossWeight: { value: grossWeightValue, unit: formData.grossWeightUnit },
  //       exceedsLimits: false,
  //       limits: {
  //         maxInner: { value: 0, unit: perInnerUnit },
  //         maxPerPackage: { value: 0, unit: totalUnit },
  //         maxGrossWeight: { value: 30, unit: 'kg' },
  //       },
  //     };
  //
  //     return {
  //       status: 'limited',
  //       message: 'Eligible for Limited Quantity. Some exemptions apply.',
  //       lqData,
  //     };
  //   }
  //
  //   const reason = eqResult?.reason || lqResult?.reason || 'Does not meet EQ or LQ criteria';
  //   return {
  //     status: 'standard',
  //     message: `Standard Quantity: ${reason}`,
  //   };
  // }, [buildEligibilityInputs, formData.grossWeightUnit, isInKit, isLiquid, material]);

  const handleBack = () => {
    if (step === 0) {
      navigation.goBack();
      return;
    }
    setStep(0);
  };

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

  const handleNext = async () => {
    if (step === 0) {
      if (!packagingType) return;
      setStep(1);
      return;
    }

    if (step === 1) {
      if (!isQuantityStepValid) return;
      if (!material) return;

      const totalValue = parseNumber(formData.totalQuantity);
      if (totalValue === null || totalValue <= 0) return;

      const isCombination =
        packagingType === 'combination' || packagingType === 'composite';
      const innerCount = isCombination
        ? Math.max(1, Math.floor(parseNumber(formData.numberOfInnerPackages) ?? 1))
        : 1;

      const rawPerInnerValue = isCombination
        ? parseNumber(formData.quantityPerInnerPackage) ?? 0
        : totalValue;
      const rawPerInnerUnit = isCombination
        ? formData.quantityPerInnerPackageUnit
        : formData.totalQuantityUnit;
      const normalizedPerInnerValue = isLiquid
        ? toMl(rawPerInnerValue, rawPerInnerUnit)
        : toGrams(rawPerInnerValue, rawPerInnerUnit);

      const grossWeightValue = parseNumber(formData.grossWeight);
      const eligibility = evaluateAttachment19Eligibility({
        material,
        quantities: {
          isInKit,
          numberOfInnerPackages: innerCount,
          quantityPerInnerPackage: {
            value: normalizedPerInnerValue,
            unit: isLiquid ? 'mL' : 'g',
          },
          totalPerPackage: {
            value: totalValue,
            unit: formData.totalQuantityUnit,
          },
          grossWeight:
            grossWeightValue !== null
              ? { value: grossWeightValue, unit: formData.grossWeightUnit }
              : undefined,
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
    }
  };

  // TODO: Re-enable EQ/LQ handler functions after demo
  // const handlePrepareAsEligible = () => {
  //   if (!eligibilityResult) return;
  //
  //   if (eligibilityResult.status === 'excepted' && eligibilityResult.eqData) {
  //     actions.updateExceptedQuantityData(eligibilityResult.eqData);
  //     actions.setIsExceptedQuantity(true);
  //     actions.setIsLimitedQuantity(false);
  //     navigation.navigate('ExceptedQuantityPackagingGuidance');
  //     return;
  //   }
  //
  //   if (eligibilityResult.status === 'limited' && eligibilityResult.lqData) {
  //     actions.updateLimitedQuantityData(eligibilityResult.lqData);
  //     actions.setIsLimitedQuantity(true);
  //     actions.setIsExceptedQuantity(false);
  //     navigation.navigate('LimitedQuantityPackagingGuidance');
  //   }
  // };
  //
  // const handlePrepareAsStandard = () => {
  //   actions.clearExceptedLimitedQuantityData();
  //   navigation.navigate('SpecialProvisionsAcknowledgement');
  // };
  //
  // const handleSaveAndExit = () => {
  //   saveCurrentShipment('in-progress');
  //   navigation.navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  // };

  if (!material) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          No hazardous material selected. Please go back and select a material.
        </Text>
      </View>
    );
  }

  const renderPackagingTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Select Packaging Type</Text>
      <Text style={styles.stepDescription}>
        Choose the packaging construction that matches your shipment.
      </Text>

      {allowedPackagingTypes.map(type => (
        <PackagingTypeCard
          key={type}
          type={type}
          label={PACKAGING_TYPE_LABELS[type]}
          description={PACKAGING_TYPE_DESCRIPTIONS[type]}
          innerRequired={type !== 'single'}
          selected={packagingType === type}
          onPress={() => setPackagingType(type)}
        />
      ))}
    </View>
  );

  const renderQuantityStep = () => {
    const unitOptions = isLiquid ? VOLUME_UNITS : MASS_UNITS;
    const isCombination = packagingType === 'combination' || packagingType === 'composite';

    return (
      <View style={styles.stepContainer}>
        <Text style={styles.stepTitle}>Package Quantities</Text>
        <Text style={styles.stepDescription}>
          Enter the quantities for your shipment packaging.
        </Text>

        {isCombination && (
          <>
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
                onValueChange={value =>
                  updateFormField('quantityPerInnerPackageUnit', value as QuantityUnit)
                }
              >
                {unitOptions.map(unit => (
                  <Picker.Item key={unit} label={unit} value={unit} />
                ))}
              </Picker>
            </View>
          </>
        )}

        <Text style={styles.inputLabel}>
          {isCombination ? 'Total Quantity (all packages) *' : 'Total Quantity *'}
        </Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, styles.inputFlex]}
            value={formData.totalQuantity}
            onChangeText={value => {
              updateFormField('totalQuantity', value);
              setHasManualTotal(value.trim().length > 0);
            }}
            keyboardType="decimal-pad"
            placeholder={isCombination ? 'e.g., 1000' : 'e.g., 5'}
            placeholderTextColor={colors.textSecondary}
          />
          <Picker
            style={styles.picker}
            selectedValue={formData.totalQuantityUnit}
            onValueChange={value =>
              updateFormField('totalQuantityUnit', value as QuantityUnit)
            }
          >
            {unitOptions.map(unit => (
              <Picker.Item key={unit} label={unit} value={unit} />
            ))}
          </Picker>
        </View>

        {/* TODO: Re-enable gross weight field after demo (used for LQ eligibility) */}
        {/* <Text style={styles.inputLabel}>Estimated Gross Weight (optional)</Text>
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
        </View> */}
      </View>
    );
  };

  // TODO: Re-enable renderEligibilityStep after demo
  // const renderEligibilityStep = () => {
  //   if (!eligibilityResult) return null;
  //
  //   const statusConfig = {
  //     excepted: { bg: '#10b981', text: 'EXCEPTED QUANTITY' },
  //     limited: { bg: '#f59e0b', text: 'LIMITED QUANTITY' },
  //     standard: { bg: colors.primary, text: 'STANDARD QUANTITY' },
  //   };
  //
  //   const config = statusConfig[eligibilityResult.status];
  //
  //   return (
  //     <View style={styles.stepContainer}>
  //       <Text style={styles.stepTitle}>Eligibility Result</Text>
  //       <Text style={styles.stepDescription}>
  //         Review your eligibility and choose how to proceed.
  //       </Text>
  //
  //       <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
  //         <View style={styles.statusContent}>
  //           {isValidating ? (
  //             <ActivityIndicator size="small" color={colors.white} />
  //           ) : (
  //             <MaterialCommunityIcons name="information" size={24} color={colors.white} />
  //           )}
  //           <View style={styles.statusText}>
  //             <Text style={styles.statusTitle}>{config.text}</Text>
  //             <Text style={styles.statusMessage}>{eligibilityResult.message}</Text>
  //           </View>
  //         </View>
  //       </View>
  //
  //       <View style={styles.eligibilityActions}>
  //         <Button
  //           label="Back"
  //           variant="outline"
  //           onPress={handleBack}
  //           fullWidth
  //         />
  //         <Button
  //           label="Save & Exit"
  //           variant="secondary"
  //           onPress={handleSaveAndExit}
  //           fullWidth
  //         />
  //         <Button
  //           label={
  //             eligibilityResult.status === 'excepted'
  //               ? 'Prepare as Excepted Quantity'
  //               : 'Prepare as Limited Quantity'
  //           }
  //           onPress={handlePrepareAsEligible}
  //           fullWidth
  //         />
  //         <Button
  //           label="Prepare as Standard Quantity"
  //           variant="outline"
  //           onPress={handlePrepareAsStandard}
  //           fullWidth
  //         />
  //       </View>
  //     </View>
  //   );
  // };

  const footerButtons = [
    {
      label: 'Back',
      onPress: handleBack,
      variant: 'outline' as const,
    },
    {
      label: 'Next',
      onPress: handleNext,
      disabled: step === 0 ? !packagingType : !isQuantityStepValid,
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            {/* <Text style={styles.headerTitle}>Quantity Entry</Text> */}
            {/* <Text style={styles.headerSubtitle}>
              Provide packaging details and determine quantity eligibility.
            </Text> */}
            {/* <StepIndicator totalSteps={3} currentStep={step} /> */}
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {step === 0 && renderPackagingTypeStep()}
            {step === 1 && renderQuantityStep()}
            {/* TODO: Re-enable eligibility step after demo */}
            {/* {step === 2 && renderEligibilityStep()} */}
          </ScrollView>

          {footerButtons.length > 0 && <ActionFooter buttons={footerButtons} />}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.xl,
    paddingTop: 10,
    gap: spacing.sm,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
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
  eligibilityActions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
    padding: spacing.xl,
  },
});

export default QuantityEntryScreen;
