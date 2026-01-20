// src/components/ui/WizardContainer.tsx

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StepIndicator } from './StepIndicator';
import { ActionFooter, FooterButton } from './ActionFooter';
import { colors, spacing, typography } from './theme';

export interface WizardContainerProps {
  title: string;
  steps: string[];
  currentStep: number;
  onBack?: () => void;
  onNext: () => void;
  onSaveExit?: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  children: React.ReactNode;
}

export const WizardContainer: React.FC<WizardContainerProps> = ({
  title,
  steps,
  currentStep,
  onBack,
  onNext,
  onSaveExit,
  nextLabel,
  nextDisabled = false,
  children,
}) => {
  const isLastStep = currentStep === steps.length - 1;
  const defaultNextLabel = isLastStep ? 'Finish' : 'Next';

  const footerButtons: FooterButton[] = [];

  if (onBack) {
    footerButtons.push({
      label: 'Back',
      onPress: onBack,
      variant: 'outline',
    });
  }

  if (onSaveExit) {
    footerButtons.push({
      label: 'Save & Exit',
      onPress: onSaveExit,
      variant: 'outline',
    });
  }

  footerButtons.push({
    label: nextLabel ?? defaultNextLabel,
    onPress: onNext,
    disabled: nextDisabled,
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <StepIndicator totalSteps={steps.length} currentStep={currentStep} />
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          {children}
        </ScrollView>

        <ActionFooter buttons={footerButtons} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.md,
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.lg,
  },
});
