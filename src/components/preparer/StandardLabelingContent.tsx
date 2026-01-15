// src/components/preparer/StandardLabelingContent.tsx
import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  SectionHeader,
  KeyValueRow,
  InfoBox,
  spacing,
  colors,
} from '@/components/ui';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';

export interface StandardLabelingContentProps {
  requiredLabels: readonly RequiredLabel[];
  requiredMarkings: readonly RequiredMarking[];
  limitedQuantity: boolean;
  onInfoPress: (attachmentNumber: string) => void;
}

export const StandardLabelingContent: React.FC<StandardLabelingContentProps> = ({
  requiredLabels,
  requiredMarkings,
  limitedQuantity,
  onInfoPress,
}) => {
  const renderLabelItem = (label: RequiredLabel) => (
    <View key={label.id} style={styles.itemRow}>
      <View style={styles.itemContent}>
        <KeyValueRow label={label.label} value={label.value || ' '} />
      </View>
      <TouchableOpacity
        testID="info-button"
        style={styles.infoButton}
        onPress={() => onInfoPress(label.id)}
        accessibilityLabel={`More info about ${label.label}`}
        accessibilityRole="button"
      >
        <MaterialIcons name="info" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  const renderMarkingItem = (marking: RequiredMarking) => (
    <View key={marking.id} style={styles.itemRow}>
      <View style={styles.itemContent}>
        <KeyValueRow
          label={marking.label}
          value={marking.displayValue || marking.value || ' '}
        />
      </View>
      <TouchableOpacity
        testID="info-button"
        style={styles.infoButton}
        onPress={() => onInfoPress(marking.id)}
        accessibilityLabel={`More info about ${marking.label}`}
        accessibilityRole="button"
      >
        <MaterialIcons name="info" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {limitedQuantity && (
        <View style={styles.bannerContainer}>
          <InfoBox
            variant="warning"
            title="Limited Quantity Notice"
            message="This shipment qualifies as a Limited Quantity. While you DO NOT need UN specification packaging (no POP marking), you still MUST apply the hazard labels shown below."
          />
        </View>
      )}

      <View style={styles.section}>
        <SectionHeader title="Required Labels" icon="label" />
        <View style={styles.sectionContent}>
          {requiredLabels.map(renderLabelItem)}
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader title="Required Markings" icon="edit" />
        <View style={styles.sectionContent}>
          {requiredMarkings.map(renderMarkingItem)}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    padding: spacing.md,
  },
  section: {
    marginBottom: spacing.md,
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemContent: {
    flex: 1,
  },
  infoButton: {
    padding: spacing.sm,
    marginLeft: spacing.xs,
  },
});
