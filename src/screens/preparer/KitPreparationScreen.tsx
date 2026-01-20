// src/screens/preparer/KitPreparationScreen.tsx
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { SpecialtyMaterialScreen, MaterialInfo } from '@/components/preparer';
import { ChecklistItem, SectionHeader, InfoBox, colors, spacing, borderRadius, typography, shadows } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { hazardousMaterialsList } from '@/hazardousMaterials/hazardousMaterialsList';

// Types
type OuterPackagingType = '4A' | '4B' | '4C1' | '4C2' | '4D' | '4F' | '4H1' | '4H2' | '4G';
type PackingGroup = 'I' | 'II' | 'III';
type FormType = 'Liquid' | 'Solid';

interface Substance {
  description: string;
  classDiv: string;
  packingGroup: PackingGroup;
  form: FormType;
  quantityPerContainer: string;
  unit: 'mL' | 'g';
}

interface KitPreparationFormValues {
  contents: Substance[];
  outerPackagingType: OuterPackagingType;
  checkboxes: {
    strictestPG: boolean;
    noReaction: boolean;
    limitedExcepted: boolean;
    receptacleCompliance: boolean;
    aggregateCompliance: boolean;
  };
  pieceNumber?: string;
}

export interface KitPreparationData {
  unid: 'UN3316';
  kitType: string;
  outerPackagingType: string;
  pieceNumber?: string;
  contents: Array<{
    description: string;
    classDiv: string;
    packingGroup: string;
    form: FormType;
    quantityPerContainer: number;
    unit: 'mL' | 'g';
  }>;
}

// Constants
const PACKAGING_OPTIONS: { label: string; value: OuterPackagingType }[] = [
  { label: 'Steel box (4A)', value: '4A' },
  { label: 'Aluminum box (4B)', value: '4B' },
  { label: 'Natural wood box (4C1)', value: '4C1' },
  { label: 'Sift-proof wood box (4C2)', value: '4C2' },
  { label: 'Plywood box (4D)', value: '4D' },
  { label: 'Reconstituted wood box (4F)', value: '4F' },
  { label: 'Fiberboard box (4G)', value: '4G' },
  { label: 'Expanded plastic box (4H1)', value: '4H1' },
  { label: 'Solid plastic box (4H2)', value: '4H2' },
];

const CHECKLIST_ITEMS = [
  { name: 'strictestPG' as const, label: 'I confirm the most stringent Packing Group is used across all kit contents.' },
  { name: 'noReaction' as const, label: 'I confirm contents will not react to generate heat or gas if mixed.' },
  { name: 'limitedExcepted' as const, label: 'I confirm all substances are authorized as Limited or Excepted Quantities.' },
  { name: 'receptacleCompliance' as const, label: 'I confirm each receptacle complies with maximum volume/mass limits.' },
  { name: 'aggregateCompliance' as const, label: 'I confirm the kit complies with maximum aggregate mass/volume requirements.' },
];

const MAX_SUBSTANCES = 5;

// Validation Schema
const validationSchema = yup.object().shape({
  contents: yup.array().of(
    yup.object().shape({
      description: yup.string().required('Description is required'),
      classDiv: yup.string().required('Class/Division is required'),
      packingGroup: yup.string().required('Packing Group is required'),
      form: yup.string().required('Form is required').oneOf(['Liquid', 'Solid']),
      quantityPerContainer: yup.string().required('Quantity is required')
        .test('is-positive', 'Must be positive', v => v ? parseFloat(v) > 0 : false),
      unit: yup.string().required('Unit is required').oneOf(['mL', 'g']),
    })
  ).min(1, 'At least one substance is required'),
  outerPackagingType: yup.string().required('Packaging type is required'),
  checkboxes: yup.object().shape({
    strictestPG: yup.boolean().oneOf([true], 'Required'),
    noReaction: yup.boolean().oneOf([true], 'Required'),
    limitedExcepted: yup.boolean().oneOf([true], 'Required'),
    receptacleCompliance: yup.boolean().oneOf([true], 'Required'),
    aggregateCompliance: yup.boolean().oneOf([true], 'Required'),
  }),
  pieceNumber: yup.string().optional(),
});

// Utility functions
const validateSubstanceLimits = (contents: Substance[]): string[] => {
  const warnings: string[] = [];
  let totalLiquidVolume = 0;
  let totalSolidMass = 0;
  let totalDangerousGoods = 0;

  contents.forEach(substance => {
    const quantity = parseFloat(substance.quantityPerContainer || '0');

    if (substance.form === 'Liquid') {
      totalLiquidVolume += quantity;
      totalDangerousGoods += quantity / 1000;
      if (substance.classDiv === '5.2' && quantity > 125) {
        warnings.push('Class 5.2 liquids cannot exceed 125 mL per inner receptacle.');
      } else if (quantity > 250) {
        warnings.push('Liquid receptacles cannot exceed 250 mL.');
      }
    } else {
      totalSolidMass += quantity;
      totalDangerousGoods += quantity / 1000;
      if (quantity > 250) {
        warnings.push('Solid receptacles cannot exceed 250 g.');
      }
    }

    if (substance.packingGroup === 'I' && substance.classDiv !== '5.2') {
      warnings.push('Packing Group I is only allowed for Class 5.2 substances.');
    }
  });

  if (totalLiquidVolume > 1000) {
    warnings.push(`Total liquid quantity (${totalLiquidVolume} mL) exceeds 1 L maximum.`);
  }
  if (totalSolidMass > 1000) {
    warnings.push(`Total solid mass (${totalSolidMass} g) exceeds 1 kg maximum.`);
  }
  if (totalDangerousGoods > 10) {
    warnings.push(`Total dangerous goods (${totalDangerousGoods.toFixed(2)} kg) exceeds 10 kg maximum.`);
  }

  return warnings;
};

const KitPreparationScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const [useMultipleContainers, setUseMultipleContainers] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const existingData = state.hazProPreparerContext.kitPreparationData;
  const hazardousMaterial = state.hazProPreparerContext.hazardousMaterial;
  const kitType = hazardousMaterial?.properShippingName || 'KIT';

  const { control, handleSubmit, watch, setValue, getValues, formState: { errors, isValid } } = useForm<KitPreparationFormValues>({
    resolver: yupResolver(validationSchema) as any,
    mode: 'onChange',
    defaultValues: {
      contents: existingData?.contents?.map(sub => ({
        ...sub,
        packingGroup: sub.packingGroup as PackingGroup,
        quantityPerContainer: sub.quantityPerContainer.toString(),
      })) || [],
      outerPackagingType: (existingData?.outerPackagingType as OuterPackagingType) || '4G',
      checkboxes: { strictestPG: false, noReaction: false, limitedExcepted: false, receptacleCompliance: false, aggregateCompliance: false },
      pieceNumber: existingData?.pieceNumber || '',
    },
  });

  const watchedContents = watch('contents');
  const warnings = useMemo(() => validateSubstanceLimits(watchedContents || []), [watchedContents]);

  const filteredMaterials = useMemo(() => {
    if (searchQuery.length < 3) return [];
    return hazardousMaterialsList.filter((m: any) =>
      m.unid.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.properShippingName.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 20);
  }, [searchQuery]);

  useEffect(() => { store.hazProPreparerContext.activeStep = 2; }, []);

  const materialInfo: MaterialInfo = {
    unid: 'UN3316',
    properShippingName: kitType,
    hazardClass: '9',
    packingGroup: hazardousMaterial?.packingGroup,
  };

  const buildKitData = useCallback((formValues: KitPreparationFormValues): KitPreparationData => ({
    unid: 'UN3316',
    kitType,
    outerPackagingType: formValues.outerPackagingType,
    pieceNumber: useMultipleContainers ? formValues.pieceNumber : undefined,
    contents: formValues.contents.map(s => ({ ...s, quantityPerContainer: parseFloat(s.quantityPerContainer) || 0 })),
  }), [kitType, useMultipleContainers]);

  const handleContinue = handleSubmit((data) => {
    const kitData = buildKitData(data);
    store.hazProPreparerContext.kitPreparationData = kitData;
    if (!completedSubsteps.includes('KitPreparation')) {
      store.hazProPreparerContext.completedSubsteps = [...completedSubsteps, 'KitPreparation'];
    }
    navigation.navigate('LabelingAndMarking');
  });

  const handleSaveExit = () => {
    store.hazProPreparerContext.kitPreparationData = buildKitData(getValues());
    saveCurrentShipment('in-progress');
    navigation.navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  const handleCancel = () => navigation.goBack();

  const addSubstanceFromSearch = (item: any) => {
    setValue('contents', [...(watchedContents || []), {
      description: item.properShippingName,
      classDiv: item.hazclassDiv,
      packingGroup: item.packingGroup || 'III',
      form: item.form || 'Solid',
      quantityPerContainer: '1',
      unit: item.unit || 'g',
    }]);
    setShowSearch(false);
    setSearchQuery('');
  };

  const removeSubstance = (index: number) => {
    if ((watchedContents || []).length <= 1) {
      Alert.alert('Cannot Remove', 'At least one substance is required.');
      return;
    }
    setValue('contents', (watchedContents || []).filter((_, i) => i !== index));
  };

  const canContinue = isValid && warnings.length === 0;

  return (
    <SpecialtyMaterialScreen
      title={`${kitType} Preparation`}
      onBack={handleCancel}
      material={materialInfo}
      onCancel={handleCancel}
      onSaveExit={handleSaveExit}
      onContinue={handleContinue}
      continueDisabled={!canContinue}
      infoBanner="UN3316 - AFMAN 24-604 A19.2"
      warningBanner={warnings.length > 0 ? warnings.join('\n') : undefined}
    >
      {/* Kit Contents Section */}
      <View style={styles.card}>
        <SectionHeader title="Kit Contents" icon="inventory" />
        <Text style={styles.description}>List all hazardous substances contained in this kit.</Text>

        {(watchedContents || []).length > 0 ? (
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.headerCell, { flex: 2 }]}>Description</Text>
              <Text style={styles.headerCell}>Class</Text>
              <Text style={styles.headerCell}>PG</Text>
              <Text style={styles.headerCell}>Form</Text>
              <Text style={styles.headerCell}>Qty</Text>
              <View style={{ width: 40 }} />
            </View>
            {watchedContents.map((sub, idx) => (
              <View key={idx} style={styles.tableRow}>
                <Text style={[styles.cell, { flex: 2 }]} numberOfLines={1}>{sub.description}</Text>
                <Text style={styles.cell}>{sub.classDiv}</Text>
                <Text style={styles.cell}>{sub.packingGroup}</Text>
                <Text style={styles.cell}>{sub.form}</Text>
                <Text style={styles.cell}>{sub.quantityPerContainer} {sub.unit}</Text>
                <TouchableOpacity onPress={() => removeSubstance(idx)} style={styles.deleteBtn}>
                  <MaterialIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <InfoBox variant="info" message="No substances added yet. Add at least one substance." />
        )}

        {(watchedContents || []).length < MAX_SUBSTANCES && (
          <TouchableOpacity style={styles.addButton} onPress={() => setShowSearch(true)}>
            <MaterialIcons name="add" size={20} color={colors.white} />
            <Text style={styles.addButtonText}>Add Substance</Text>
          </TouchableOpacity>
        )}

        {showSearch && (
          <View style={styles.searchSection}>
            <View style={styles.searchRow}>
              <MaterialIcons name="search" size={20} color={colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search by UNID or Name"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity onPress={() => { setShowSearch(false); setSearchQuery(''); }}>
                <MaterialIcons name="close" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
            {filteredMaterials.length > 0 && (
              <ScrollView style={styles.searchResults} nestedScrollEnabled>
                {filteredMaterials.map((item: any, idx: number) => (
                  <TouchableOpacity key={idx} style={styles.searchResultRow} onPress={() => addSubstanceFromSearch(item)}>
                    <Text style={styles.searchResultText}>{item.unid} - {item.properShippingName}</Text>
                    <Text style={styles.searchResultSub}>Class {item.hazclassDiv}, PG {item.packingGroup || 'N/A'}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>

      {/* Outer Packaging Section */}
      <View style={styles.card}>
        <SectionHeader title="Outer Packaging" icon="inventory-2" />
        <Text style={styles.label}>Packaging Type</Text>
        <View style={styles.pickerContainer}>
          <Controller
            control={control}
            name="outerPackagingType"
            render={({ field: { onChange, value } }) => (
              <Picker selectedValue={value} onValueChange={onChange} style={styles.picker}>
                {PACKAGING_OPTIONS.map(opt => <Picker.Item key={opt.value} label={opt.label} value={opt.value} />)}
              </Picker>
            )}
          />
        </View>

        <TouchableOpacity style={styles.switchRow} onPress={() => setUseMultipleContainers(!useMultipleContainers)}>
          <View style={[styles.switchTrack, useMultipleContainers && styles.switchTrackActive]}>
            <View style={[styles.switchThumb, useMultipleContainers && styles.switchThumbActive]} />
          </View>
          <Text style={styles.switchLabel}>Kit uses multiple containers</Text>
        </TouchableOpacity>

        {useMultipleContainers && (
          <Controller
            control={control}
            name="pieceNumber"
            render={({ field: { onChange, value } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter piece number (e.g., 1 of 3)"
              />
            )}
          />
        )}
      </View>

      {/* Safety Checklist Section */}
      <View style={styles.card}>
        <SectionHeader title="Safety Checklist" icon="checklist" />
        <Text style={styles.description}>All items must be acknowledged before proceeding.</Text>
        {CHECKLIST_ITEMS.map(item => (
          <Controller
            key={item.name}
            control={control}
            name={`checkboxes.${item.name}`}
            render={({ field: { onChange, value } }) => (
              <ChecklistItem label={item.label} checked={value} onChange={onChange} />
            )}
          />
        ))}
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
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  table: { marginBottom: spacing.md },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
  },
  headerCell: {
    flex: 1,
    ...typography.caption,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  cell: {
    flex: 1,
    ...typography.body,
    color: colors.textPrimary,
  },
  deleteBtn: { width: 40, alignItems: 'center' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.success,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  addButtonText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.white,
  },
  searchSection: {
    marginTop: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.body,
    paddingVertical: spacing.sm,
  },
  searchResults: { maxHeight: 200, marginTop: spacing.sm },
  searchResultRow: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  searchResultText: { ...typography.body, color: colors.textPrimary },
  searchResultSub: { ...typography.caption },
  pickerContainer: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    marginBottom: spacing.md,
  },
  picker: { height: 50 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    ...typography.body,
    marginTop: spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.sm,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.border,
    padding: 2,
  },
  switchTrackActive: { backgroundColor: colors.primary },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
  },
  switchThumbActive: { transform: [{ translateX: 20 }] },
  switchLabel: { ...typography.body, color: colors.textPrimary },
});

export default KitPreparationScreen;
