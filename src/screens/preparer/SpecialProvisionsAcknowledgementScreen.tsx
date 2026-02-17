// src/screens/preparer/SpecialProvisionsAcknowledgementScreen.tsx

import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ActionFooter, ScreenHeader, colors, spacing, shadows, borderRadius } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { getNextRoute } from '@/utils/navigation/unidRouting';

export interface SpecialProvisionsAcknowledgementScreenProps {
  navigation: any;
}

interface ProvisionCardProps {
  code: string;
  description: string;
}

const ProvisionCard: React.FC<ProvisionCardProps> = ({ code, description }) => (
  <View style={styles.card}>
    <View style={styles.cardContent}>
      <View style={styles.codeContainer}>
        <Text style={styles.provisionCode}>{code}</Text>
      </View>
      <View style={styles.dividerVertical} />
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  </View>
);

export const SpecialProvisionsAcknowledgementScreen: React.FC<SpecialProvisionsAcknowledgementScreenProps> = ({
  navigation,
}) => {
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;
  const specialProvisionsMap = state.hazProPreparerContext.specialProvisionsMap || {};

  const provisionsList = useMemo(() => {
    return Object.entries(specialProvisionsMap).map(([code, description]) => ({
      code,
      description,
    }));
  }, [specialProvisionsMap]);

  const navigateToNextScreen = () => {
    // Mark special provisions as acknowledged
    if (store.hazProPreparerContext) {
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
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged = true;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.specialProvisionsAcknowledged = true;
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.workflowModifiersAcknowledged = true;
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        'SpecialProvisionsAcknowledgement',
      ];
    }

    // Handle grandfathered explosives
    if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
      navigation.navigate('LabelingAndMarking');
      return;
    }

    // Use routing utility for UNID-based navigation
    const unid = state.hazProPreparerContext.hazardousMaterial?.unid;
    const route = getNextRoute(unid || '', 'PackagingScreen');
    navigation.navigate(route);
  };

  // Auto-navigate if no special provisions exist
  useEffect(() => {
    if (provisionsList.length === 0) {
      navigateToNextScreen();
    }
  }, []);

  const handleAcknowledge = () => {
    navigateToNextScreen();
  };

  const handleReject = () => {
    if (store.hazProPreparerContext) {
      Object.keys(store.hazProPreparerContext).forEach(key => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete (store.hazProPreparerContext as unknown as Record<string, unknown>)[key];
      });
    }
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  // Don't render if no provisions (will auto-navigate)
  if (provisionsList.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader title="Special Provisions Requirements" />
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
        {provisionsList.map(({ code, description }) => (
          <ProvisionCard key={code} code={code} description={description} />
        ))}
      </ScrollView>
      <ActionFooter
        buttons={[
          {
            label: 'Acknowledge Requirements',
            onPress: handleAcknowledge,
            variant: 'primary',
          },
                    {
            label: 'Reject Requirements',
            onPress: handleReject,
            variant: 'outline',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: spacing.lg,
    paddingBottom: spacing.sm,
  },
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: spacing.md,
    overflow: 'hidden',
    ...shadows.light,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 60,
  },
  codeContainer: {
    backgroundColor: colors.backgroundSecondary,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  provisionCode: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  dividerVertical: {
    width: 1,
    backgroundColor: colors.border,
  },
  descriptionContainer: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  descriptionText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});

export default SpecialProvisionsAcknowledgementScreen;
