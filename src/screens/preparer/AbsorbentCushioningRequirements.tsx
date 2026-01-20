import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Card } from '@rneui/themed';
import { Button } from 'react-native-elements';
import { colors, spacing, borderRadius, typography } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { AbsorbentMaterialRequirement } from '../../../server/lookupFunctions/absorbentMaterialRequirementLookup';

type MaterialKey = keyof Pick<
  AbsorbentMaterialRequirement['absorbentMaterial'],
  'vermiculite' | 'diatomaceousEarth'
>;

const materialTypes: MaterialKey[] = ['vermiculite', 'diatomaceousEarth'];

const getDisplayName = (key: MaterialKey): string => {
  const map: Record<MaterialKey, string> = {
    vermiculite: 'Vermiculite',
    diatomaceousEarth: 'Diatomaceous Earth',
  };
  return map[key];
};

const AbsorbentCushioningRequirements = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const absorbentMaterial =
    state.hazProPreparerContext.lookupFunctionsOutput?.absorbentCushioningCriteria?.absorbentMaterial;
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialKey>('vermiculite');

  if (!absorbentMaterial) return null;

  const material = absorbentMaterial[selectedMaterial];

  const handleCancel = () => {
    if (store.hazProPreparerContext) {
      store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    }
    navigation.goBack();
  };

  const handleSave = () => {
    if (store.hazProPreparerContext) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        'AbsorbentCushioningRequirements',
      ];
    }
    navigation.navigate('LabelingAndMarking');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.flex}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Absorbent Cushioning</Text>

        <Text style={styles.label}>Select material type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedMaterial}
            onValueChange={setSelectedMaterial}
            style={styles.picker}
            dropdownIconColor={colors.textPrimary}
          >
            {materialTypes.map(type => (
              <Picker.Item key={type} label={getDisplayName(type)} value={type} />
            ))}
          </Picker>
        </View>

        <Card containerStyle={styles.card}>
          <Card.Title style={styles.cardTitle}>{getDisplayName(selectedMaterial)}</Card.Title>
          <Card.Divider />
          <View style={styles.rowSection}>
            {[
              { header: 'Sides', value: `cm: ${material.sides.cm}\nin: ${material.sides.in}` },
              { header: 'Top/Bottom', value: `cm: ${material.topBottom.cm}\nin: ${material.topBottom.in}` },
              { header: 'Absorbent Sheet Materials', value: absorbentMaterial.absorbentSheetMaterials },
              { header: 'Cellulosic Particulate', value: absorbentMaterial.cellulosicParticulate },
            ].map(({ header, value }) => (
              <View key={header} style={styles.column}>
                <Text style={styles.sectionHeader}>{header}</Text>
                <Text style={styles.materialText}>{value}</Text>
              </View>
            ))}
          </View>
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            type="outline"
            buttonStyle={styles.cancelButton}
            titleStyle={styles.cancelButtonText}
            onPress={handleCancel}
          />
          <Button
            title="Save & Continue"
            buttonStyle={styles.saveButton}
            titleStyle={styles.saveButtonText}
            onPress={handleSave}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: spacing.xl,
    backgroundColor: colors.surface,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    textAlign: 'center',
    color: colors.textPrimary,
  },
  label: {
    ...typography.cardTitle,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    width: '30%',
  },
  picker: {
    height: 50,
    width: '100%',
    color: colors.textPrimary,
  },
  card: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.lg,
    borderColor: colors.border,
  },
  cardTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  sectionHeader: {
    ...typography.cardTitle,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    color: colors.textPrimary,
  },
  materialText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  rowSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.xl,
  },
  column: { flex: 1 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
  },
  saveButtonText: {
    ...typography.cardTitle,
    color: colors.white,
  },
  cancelButton: {
    borderColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.sm,
  },
  cancelButtonText: {
    ...typography.cardTitle,
    color: colors.primary,
  },
});

export default AbsorbentCushioningRequirements;
