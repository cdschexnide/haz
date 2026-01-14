// src/components/ui/StepIndicator.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, typography } from './theme';

export type StepStatus = 'pending' | 'active' | 'pass' | 'fail';

export interface StepIndicatorProps {
  totalSteps: number;
  currentStep: number;
  stepStatuses?: StepStatus[];
  showLabel?: boolean;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  totalSteps,
  currentStep,
  stepStatuses = [],
  showLabel = true,
}) => {
  const getStepColor = (index: number): string => {
    const status = stepStatuses[index];
    if (status === 'pass') return colors.success;
    if (status === 'fail') return colors.error;
    if (index === currentStep) return colors.primary;
    if (index < currentStep) return colors.success;
    return colors.border;
  };

  return (
    <View style={styles.container}>
      <View style={styles.dots}>
        {Array.from({ length: totalSteps }, (_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: getStepColor(index) },
              index === currentStep && styles.dotActive,
            ]}
          />
        ))}
      </View>
      {showLabel && (
        <Text style={styles.label}>
          Step {currentStep + 1} of {totalSteps}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  label: {
    ...typography.caption,
  },
});
