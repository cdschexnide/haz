import { informativeSpecialProvisionsMap } from "../../server/informativeStatements/informativeStatements";
import {
  hazProContextLookup,
  HazProContextLookupInput,
} from "../../server/lookupFunctions/hazProContextLookup";
import { packagingDatabaseV2 } from "../../server/lookupFunctions/packagingLookupV2";
import { useHazProStore } from "../stores/useHazProStore";
import { PhysicalState } from "../../types";
import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  ActionFooter,
  colors,
  spacing,
  typography,
} from "@/components/ui";

const InnerPackagingWizard = ({ navigation }: { navigation: any }) => {
  const { state, store } = useHazProStore();
  const physicalState =
    state.hazProPreparerContext.hazardousMaterial?.physicalState;
  const packagingParagraph =
    state.hazProPreparerContext.hazardousMaterial?.packagingParagraph || "";
  const selectedOptionId =
    state.hazProPreparerContext.packaging?.selectedPackagingOptionId;
  const initialInnerPackaging =
    state.hazProPreparerContext.packaging?.combinationPackaging?.innerPackaging
      ?.packagingType || "";

  const [selectedInnerPackaging, setSelectedInnerPackaging] =
    useState(initialInnerPackaging);

  // Use the selected packaging option to find valid inner material choices.
  const innerOptions = useMemo(() => {
    if (!packagingParagraph || !selectedOptionId) return [];

    const packagingEntry = packagingDatabaseV2[packagingParagraph];
    if (!packagingEntry) return [];

    const selectedOption = packagingEntry.packagingOptions?.find(
      option => option.id === selectedOptionId
    );

    return selectedOption?.innerPackaging?.materials || [];
  }, [packagingParagraph, selectedOptionId]);

  const getLiquidQuantityInLiters = (): number | undefined => {
    const packaging = state.hazProPreparerContext.packaging;
    if (!packaging) return undefined;

    const totalLiters = packaging.totalNetVolume?.liters;
    if (
      typeof totalLiters === "number" &&
      Number.isFinite(totalLiters) &&
      totalLiters > 0
    ) {
      return totalLiters;
    }

    const perInnerLiters =
      packaging.combinationPackaging?.volumePerInnerContainer?.liters;
    const innerCount = packaging.combinationPackaging?.numberOfInnerContainers;
    if (
      typeof perInnerLiters === "number" &&
      Number.isFinite(perInnerLiters) &&
      typeof innerCount === "number" &&
      Number.isFinite(innerCount)
    ) {
      const computedTotal = perInnerLiters * innerCount;
      return computedTotal > 0 ? computedTotal : undefined;
    }

    return undefined;
  };

  const handleContinue = () => {
    if (innerOptions.length > 0 && !selectedInnerPackaging) {
      return;
    }

    if (
      selectedInnerPackaging &&
      store.hazProPreparerContext.packaging?.combinationPackaging?.innerPackaging
    ) {
      store.hazProPreparerContext.packaging.combinationPackaging.innerPackaging.packagingType =
        selectedInnerPackaging;
    }

    if (physicalState === PhysicalState.LIQUID) {
      const packagingType =
        state.hazProPreparerContext.packaging?.packagingType || "";

      const lookupInput: HazProContextLookupInput = {
        context: {
          hazardousMaterial: state.hazProPreparerContext.hazardousMaterial,
          physicalState,
        },
        specialProvisionsMap: informativeSpecialProvisionsMap,
        dotCylinderSpecifications: [],
        liquidQuantityInLiters: getLiquidQuantityInLiters(),
        isCombinationPackaging: packagingType === "Combination",
        innerPackagingMaterial: selectedInnerPackaging || undefined,
      };

      const lookupOutput = hazProContextLookup(lookupInput);
      if (typeof lookupOutput === "string") {
        return;
      }

      store.hazProPreparerContext.lookupFunctionsOutput = lookupOutput;

      if (typeof lookupOutput.absorbentCushioningCriteria !== "undefined") {
        store.hazProPreparerContext.absorbentStepRequired = true;
        navigation.navigate("AbsorbentCushioningRequirements");
        return;
      }
    }

    store.hazProPreparerContext.absorbentStepRequired = false;
    navigation.navigate("LabelingAndMarking");
  };

  const canContinue = innerOptions.length === 0 || !!selectedInnerPackaging;

  const footerButtons = [
    {
      label: "Back",
      onPress: () => navigation.goBack(),
      variant: "outline" as const,
    },
    {
      label: "Continue",
      onPress: handleContinue,
      variant: "primary" as const,
      disabled: !canContinue,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Select Inner Packaging Type</Text>

        {innerOptions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No specific inner packaging material options were found for this
              packaging selection. Continue to proceed.
            </Text>
          </View>
        ) : (
          <View style={styles.optionsList}>
            {innerOptions.map(option => {
              const isSelected = selectedInnerPackaging === option;
              return (
                <TouchableOpacity
                  key={option}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => setSelectedInnerPackaging(option)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.radio, isSelected && styles.radioSelected]}>
                    {isSelected && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <ActionFooter buttons={footerButtons} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
    gap: spacing.md,
  },
  header: {
    ...typography.headerTitle,
    color: colors.textPrimary,
  },
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  optionsList: {
    gap: spacing.sm,
  },
  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: colors.surface,
  },
  optionCardSelected: {
    borderWidth: 2,
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "500" as const,
    color: colors.textPrimary,
  },
  optionTitleSelected: {
    color: colors.primary,
    fontWeight: "600" as const,
  },
});

export default InnerPackagingWizard;
