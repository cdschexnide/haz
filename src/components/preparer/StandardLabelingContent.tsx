import React from 'react';
import { View, Text, Image, ImageSourcePropType, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import {
  SectionHeader,
  InfoBox,
  spacing,
  colors,
  borderRadius,
  shadows,
  typography,
} from '@/components/ui';
import { RequiredLabel } from '@/utils/labelingRequirements';
import { RequiredMarking } from '@/utils/markingRequirements';
import {
  getHazardDiamondImage,
  getHazardClassName,
  parseSubsidiaryRisks,
} from '@/utils/hazardDiamondImages';

const cargoAircraftOnlyImage: ImageSourcePropType = require('../../../assets/hazmatPngs/cargoAircraftOnly.png');

export interface StandardLabelingContentProps {
  requiredLabels: readonly RequiredLabel[];
  requiredMarkings: readonly RequiredMarking[];
  limitedQuantity: boolean;
}

function assemblePOPString(metadata?: Record<string, unknown>): string | null {
  if (!metadata) return null;

  const fields = ['B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const values = fields
    .map(field => metadata[field])
    .filter(value => typeof value === 'string' && value.trim().length > 0) as string[];

  if (values.length === 0) return null;
  return `UN / ${values.join(' / ')}`;
}

const labelIconMap: Record<string, keyof typeof MaterialIcons.glyphMap> = {
  'military-shipping-label': 'local-shipping',
  'cargo-aircraft-only': 'flight',
  'compatibility-group': 'warning',
  'magnetized-material': 'settings-input-antenna',
};

const pictogramLabelIds = new Set(['primary-hazard', 'subsidiary-risk']);

// Markings that are label-only (no stencil value expected)
const labelOnlyMarkingIds = new Set([
  'limited-quantity',
  'overpack',
  'kit-marking',
  'lithium-battery-marking',
  'lithium-battery-excepted-quantity',
]);

const HazardLabelCard: React.FC<{ labelType: string; hazclassDiv: string }> = ({
  labelType,
  hazclassDiv,
}) => {
  const diamondImage = getHazardDiamondImage(hazclassDiv);
  const className = getHazardClassName(hazclassDiv);

  return (
    <View style={styles.card}>
      {diamondImage ? (
        <Image source={diamondImage} style={styles.diamondImage} resizeMode="contain" />
      ) : (
        <View style={styles.iconContainer}>
          <MaterialIcons name="warning" size={24} color={colors.warning} />
        </View>
      )}
      <View style={styles.cardTextContainer}>
        <Text style={styles.cardTitle}>{labelType}</Text>
        {className && <Text style={styles.cardSubtitle}>{className}</Text>}
        {!className && <Text style={styles.cardSubtitle}>Class {hazclassDiv}</Text>}
      </View>
    </View>
  );
};

const IconLabelCard: React.FC<{ label: RequiredLabel }> = ({ label }) => {
  const iconName = labelIconMap[label.id] ?? 'label';
  const isCargoAircraftOnly = label.id === 'cargo-aircraft-only';
  const isMSL = label.id === 'military-shipping-label';

  return (
    <View style={[styles.card, isCargoAircraftOnly && styles.cardWarning]}>
      {isCargoAircraftOnly ? (
        <Image source={cargoAircraftOnlyImage} style={styles.diamondImage} resizeMode="contain" />
      ) : !isMSL ? (
        <View style={styles.iconContainer}>
          <MaterialIcons
            name={iconName}
            size={24}
            color={colors.textSecondary}
          />
        </View>
      ) : null}
      <View style={[styles.cardTextContainer, isMSL && styles.cardTextNoIcon]}>
        <Text style={styles.cardTitle}>{label.label}</Text>
        {isCargoAircraftOnly && (
          <Text style={styles.cardSubtitle}>Restriction - passenger aircraft prohibited</Text>
        )}
      </View>
    </View>
  );
};

const MarkingCard: React.FC<{ marking: RequiredMarking }> = ({ marking }) => {
  const isPOP = marking.renderType === 'pop';
  const displayValue = isPOP
    ? assemblePOPString(marking.metadata)
    : marking.displayValue || marking.value;

  const isLabelOnly = labelOnlyMarkingIds.has(marking.id);
  const showFallback = isPOP && !displayValue;

  return (
    <View style={styles.card}>
      <View style={styles.markingContent}>
        <Text style={styles.markingLabel}>{marking.label}</Text>
        {displayValue ? (
          <Text style={styles.markingValue}>{displayValue}</Text>
        ) : showFallback ? (
          <Text style={styles.markingValueMuted}>Stenciled and/or printed</Text>
        ) : isLabelOnly ? null : (
          marking.value ? (
            <Text style={styles.markingValue}>{marking.value}</Text>
          ) : null
        )}
      </View>
    </View>
  );
};

/**
 * Renders a label item. For subsidiary-risk labels with comma-separated values,
 * splits into multiple HazardLabelCards (one per risk).
 */
function renderLabelItem(label: RequiredLabel, index: number): React.ReactNode {
  if (!pictogramLabelIds.has(label.id)) {
    return <IconLabelCard key={`${label.id}-${index}`} label={label} />;
  }

  // For subsidiary risk, parse comma-separated values into multiple cards
  if (label.id === 'subsidiary-risk' && label.value) {
    const risks = parseSubsidiaryRisks(label.value);
    if (risks.length > 1) {
      return risks.map((risk, riskIndex) => (
        <HazardLabelCard
          key={`${label.id}-${index}-${riskIndex}`}
          labelType="Subsidiary Risk"
          hazclassDiv={risk}
        />
      ));
    }
  }

  return (
    <HazardLabelCard
      key={`${label.id}-${index}`}
      labelType={label.label}
      hazclassDiv={label.value ?? ''}
    />
  );
}

export const StandardLabelingContent: React.FC<StandardLabelingContentProps> = ({
  requiredLabels,
  requiredMarkings,
  limitedQuantity,
}) => {
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

      <SectionHeader
        title="Required Labels"
        icon="label"
        count={{ completed: requiredLabels.length, total: requiredLabels.length }}
      />
      <View style={styles.sectionContent}>
        {requiredLabels.map((label, index) => renderLabelItem(label, index))}
      </View>

      <SectionHeader
        title="Required Markings"
        icon="edit"
        count={{ completed: requiredMarkings.length, total: requiredMarkings.length }}
      />
      <View style={styles.sectionContent}>
        {requiredMarkings.map((marking, index) => (
          <MarkingCard key={`${marking.id}-${index}`} marking={marking} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  bannerContainer: {
    padding: spacing.md,
  },
  sectionContent: {
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    ...shadows.light,
  },
  cardWarning: {
    backgroundColor: colors.warningLight,
    borderColor: colors.warning,
  },
  cardTextContainer: {
    flex: 1,
    marginLeft: spacing.md,
  },
  cardTextNoIcon: {
    marginLeft: 0,
  },
  cardTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  cardSubtitle: {
    ...typography.caption,
    marginTop: 2,
  },
  diamondImage: {
    width: 48,
    height: 48,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  markingContent: {
    flex: 1,
  },
  markingLabel: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  markingValue: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Courier',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  markingValueMuted: {
    ...typography.body,
    fontStyle: 'italic',
    color: colors.textSecondary,
  },
});
