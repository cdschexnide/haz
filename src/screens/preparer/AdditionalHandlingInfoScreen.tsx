// src/screens/preparer/AdditionalHandlingInfoScreen.tsx

import React, { useState, useCallback } from 'react';
import { View, ScrollView, Text, TextInput, StyleSheet } from 'react-native';
import {
  ActionFooter,
  colors,
  spacing,
  borderRadius,
} from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';

const AdditionalHandlingInfoScreen = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];

  const existingNote = state.hazProPreparerContext.additionalHandlingInfo?.notes?.[0] || '';
  const [note, setNote] = useState(existingNote);

  const handleCancel = useCallback(() => {
    store.hazProPreparerContext.completedSubsteps = completedSubsteps.slice(0, -1);
    navigation.goBack();
  }, [completedSubsteps, navigation, store.hazProPreparerContext]);

  const handleSaveAndExit = useCallback(() => {
    // Save the note before exiting
    if (!store.hazProPreparerContext.additionalHandlingInfo) {
      store.hazProPreparerContext.additionalHandlingInfo = { accessorialHazmat: [], notes: [] };
    }
    store.hazProPreparerContext.additionalHandlingInfo.notes = note.trim() ? [note.trim()] : [];
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  }, [note, navigate, store.hazProPreparerContext]);

  const handleSaveAndContinue = useCallback(() => {
    // Save the note
    if (!store.hazProPreparerContext.additionalHandlingInfo) {
      store.hazProPreparerContext.additionalHandlingInfo = { accessorialHazmat: [], notes: [] };
    }
    store.hazProPreparerContext.additionalHandlingInfo.notes = note.trim() ? [note.trim()] : [];

    store.hazProPreparerContext.completedSubsteps = [
      ...completedSubsteps,
      'AdditionalHandlingInfo',
    ];
    navigation.navigate('ShippersDeclarationScreen');
  }, [completedSubsteps, navigation, store.hazProPreparerContext, note]);

  const footerButtons = [
    {
      label: 'Cancel',
      onPress: handleCancel,
      variant: 'outline' as const,
    },
    {
      label: 'Save & Exit',
      onPress: handleSaveAndExit,
      variant: 'secondary' as const,
    },
    {
      label: 'Save & Continue',
      onPress: handleSaveAndContinue,
      variant: 'primary' as const,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Additional Handling Information</Text>
          <Text style={styles.headerSubtitle}>
            Enter any additional comments or notes for the SDDG form. This field is optional.
          </Text>
        </View>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Enter additional handling information..."
          placeholderTextColor={colors.textSecondary}
          value={note}
          onChangeText={setNote}
          textAlignVertical="top"
        />
      </ScrollView>
      <ActionFooter buttons={footerButtons} />
    </View>
  );
};

export default AdditionalHandlingInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  textInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    fontSize: 16,
    color: colors.textPrimary,
    backgroundColor: colors.background,
    minHeight: 200,
  },
});
