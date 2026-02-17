// src/screens/preparer/GrandfatheredPackagingReferenceScreen.tsx

import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { ScreenHeader, ActionFooter, colors, spacing } from '@/components/ui';
import GrandfatheredPackagingReferenceViewer from '@/components/GrandfatheredExplosivePackagingReferenceViewer';

export interface GrandfatheredPackagingReferenceScreenProps {
  navigation: any;
}

export const GrandfatheredPackagingReferenceScreen: React.FC<GrandfatheredPackagingReferenceScreenProps> = ({ navigation }) => {
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveAndExit = () => {
    navigation.goBack();
  };

  const handleSaveNext = () => {
    navigation.navigate('SpecialProvisionsAcknowledgement');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Packaging Reference" />
      {showPrintOptions && (
        <View style={styles.printOptionsContainer}>
          <View style={styles.printOption}>
            <MaterialIcons name="description" size={20} color={colors.textPrimary} />
            <View style={styles.printOptionText}>
              <View>Print full document</View>
            </View>
          </View>
          <View style={styles.printOption}>
            <MaterialIcons name="summarize" size={20} color={colors.textPrimary} />
            <View style={styles.printOptionText}>
              <View>Print summary</View>
            </View>
          </View>
        </View>
      )}
      <View style={styles.contentContainer}>
        <GrandfatheredPackagingReferenceViewer />
      </View>
      <ActionFooter
        buttons={[
          {
            label: 'Cancel',
            onPress: handleCancel,
            variant: 'outline',
          },
          {
            label: 'Save & Exit',
            onPress: handleSaveAndExit,
            variant: 'outline',
          },
          {
            label: 'Save & Continue',
            onPress: handleSaveNext,
            variant: 'primary',
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    flex: 1,
  },
  printOptionsContainer: {
    position: 'absolute',
    top: 56,
    right: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    width: 200,
    paddingVertical: spacing.sm,
  },
  printOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  printOptionText: {
    marginLeft: spacing.md,
    fontSize: 15,
    color: colors.textPrimary,
  },
});

export default GrandfatheredPackagingReferenceScreen;
