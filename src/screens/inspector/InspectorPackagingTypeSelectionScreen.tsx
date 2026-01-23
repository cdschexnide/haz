import React, { useMemo, useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { hasSpecialProvisionAlphaCode } from "@/utils/specialProvisions";
import { parseQuantityAndPacking } from "@/utils/sddgQuantityAndPackingParser";
import { getAllowedPackagingTypes } from "@/utils/getAllowedPackagingTypes";
import {
  ActionFooter,
  Button,
  ScreenHeader,
  spacing,
  colors,
  borderRadius,
} from "@/components/ui";

type PackagingType = "single" | "combination" | "composite";

interface SelectableCardProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onPress: () => void;
  disabled?: boolean;
  disabledReason?: string;
}

const SelectableCard: React.FC<SelectableCardProps> = ({
  title,
  subtitle,
  selected,
  onPress,
  disabled,
  disabledReason,
}) => (
  <TouchableOpacity
    style={[
      styles.selectableCard,
      selected && styles.selectableCardSelected,
      disabled && styles.selectableCardDisabled,
    ]}
    onPress={onPress}
    disabled={disabled}
    activeOpacity={0.7}
  >
    <Text
      style={[
        styles.selectableCardTitle,
        selected && styles.selectableCardTitleSelected,
        disabled && styles.selectableCardTitleDisabled,
      ]}
    >
      {title}
    </Text>
    <Text
      style={[
        styles.selectableCardSubtitle,
        disabled && styles.selectableCardSubtitleDisabled,
      ]}
    >
      {subtitle}
    </Text>
    {disabled && disabledReason && (
      <Text style={styles.disabledReason}>{disabledReason}</Text>
    )}
  </TouchableOpacity>
);

const InspectorPackagingTypeSelectionScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: { params?: { nextRoute?: string; nextParams?: Record<string, any> } };
}) => {
  const {
    inspection,
    workflow,
    setPackagePackagingType,
    addPackageFrustration,
    removePackageFrustration,
    resolvePackageFrustration,
    refrustratePackageFrustration,
  } = useInspectionForm();
  const nextRoute = route.params?.nextRoute || "MLDetectionScreen";
  const nextParams = route.params?.nextParams;
  const key16Value = inspection.verificationCopy?.quantityAndPacking || "";

  const unIdNo =
    inspection.verificationCopy?.unIdNo ||
    inspection.extractedContent?.unIdNo ||
    "";
  const hazmatItem = hazardousMaterialsList.find(item => item.unid === unIdNo);
  const hasA2Restriction =
    hazmatItem &&
    hasSpecialProvisionAlphaCode(hazmatItem.specialProvision, "A2");
  const packagingParagraph =
    inspection.verificationCopy?.packingInstruction ||
    inspection.extractedContent?.packingInstruction ||
    "";

  const parsedKey16 = useMemo(
    () => parseQuantityAndPacking(key16Value),
    [key16Value]
  );
  const key16PackagingText = useMemo(() => {
    if (parsedKey16.packagingDescription) {
      const countPrefix = parsedKey16.packageCount
        ? `${parsedKey16.packageCount} `
        : "";
      const codeSuffix = parsedKey16.packagingCode
        ? ` (${parsedKey16.packagingCode})`
        : "";
      return `${countPrefix}${parsedKey16.packagingDescription}${codeSuffix}`.trim();
    }
    return parsedKey16.raw || "Not provided";
  }, [parsedKey16]);

  const mismatchItemId = "packaging-key16-mismatch";
  const mismatchLabel = "Package does not match Key 16 of SDDG";
  const existingMismatch = inspection.packageFrustrations.find(
    (frustration) => frustration.itemId === mismatchItemId
  );

  const [selection, setSelection] = useState<PackagingType | "">(
    inspection.packagePackagingType || ""
  );
  const [key16Match, setKey16Match] = useState<"yes" | "no" | "">(
    existingMismatch ? "no" : ""
  );

  useEffect(() => {
    if (hasA2Restriction && selection === "single") {
      setSelection("");
    }
  }, [hasA2Restriction, selection]);

  const allowedPackagingTypes = useMemo(() => {
    return getAllowedPackagingTypes({
      packagingParagraph,
      hasA2Restriction,
      unIdNo,
      properShippingName:
        hazmatItem?.properShippingName ||
        inspection.verificationCopy?.properShippingName ||
        inspection.extractedContent?.properShippingName ||
        "",
    });
  }, [
    hasA2Restriction,
    hazmatItem?.properShippingName,
    inspection.extractedContent?.properShippingName,
    inspection.verificationCopy?.properShippingName,
    packagingParagraph,
    unIdNo,
  ]);

  useEffect(() => {
    if (selection && !allowedPackagingTypes.includes(selection)) {
      setSelection("");
    }
  }, [allowedPackagingTypes, selection]);

  useEffect(() => {
    if (!selection && allowedPackagingTypes.length === 1) {
      setSelection(allowedPackagingTypes[0]);
    }
  }, [allowedPackagingTypes, selection]);

  const handleContinue = () => {
    setPackagePackagingType(selection as "single" | "combination" | "composite");
    if (key16Match === "no") {
      if (!existingMismatch) {
        addPackageFrustration({
          category: "packaging",
          itemId: mismatchItemId,
          itemLabel: mismatchLabel,
          expectedValues: [key16PackagingText],
          verificationStatus: "incorrect",
          defaultMessage: "Package does not match Key 16 of the SDDG.",
          afmanReference: "AFMAN 24-604",
        });
      } else if (workflow.reinspection.mode === "package") {
        refrustratePackageFrustration(mismatchItemId, inspection.inspector);
      }
    } else if (key16Match === "yes" && existingMismatch) {
      if (workflow.reinspection.mode === "package") {
        resolvePackageFrustration(mismatchItemId, inspection.inspector);
      } else {
        removePackageFrustration(mismatchItemId);
      }
    }
    navigation.navigate(nextRoute, nextParams);
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Packaging Type"
        subtitle="Confirm how the package is constructed."
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <View style={styles.content}>
        {/* Left Column - Key 16 Confirmation */}
        <View style={styles.leftColumn}>
          <Text style={styles.sectionLabel}>CONFIRM KEY 16</Text>
          <View style={styles.key16Card}>
            <Text style={styles.key16Label}>KEY 16 VALUE</Text>
            <Text style={styles.key16Value}>{key16Value || "Not provided"}</Text>
          </View>
          <Text style={styles.questionText}>Does the package match?</Text>
          <View style={styles.buttonRow}>
            <Button
              label="Yes"
              variant="outline"
              onPress={() => setKey16Match("yes")}
              style={[
                styles.matchButton,
                key16Match === "yes" && styles.yesButtonSelected,
              ]}
              textStyle={key16Match === "yes" ? styles.selectedButtonText : undefined}
            />
            <Button
              label="No"
              variant="outline"
              onPress={() => setKey16Match("no")}
              style={[
                styles.matchButton,
                key16Match === "no" && styles.noButtonSelected,
              ]}
              textStyle={key16Match === "no" ? styles.selectedButtonText : undefined}
            />
          </View>
          {key16Match === "no" && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠ This will add a frustration for Key 16 mismatch
              </Text>
            </View>
          )}
        </View>

        {/* Right Column - Packaging Type Selection */}
        <View style={styles.rightColumn}>
          <Text style={styles.sectionLabel}>SELECT PACKAGING TYPE</Text>
          <View style={styles.cardsContainer}>
            {allowedPackagingTypes.includes("single") && (
              <SelectableCard
                title="Single"
                subtitle="Nonbulk packaging other than combination or composite"
                selected={selection === "single"}
                onPress={() => setSelection("single")}
                disabled={!!hasA2Restriction}
                disabledReason={hasA2Restriction ? "Not permitted (A2)" : undefined}
              />
            )}
            {allowedPackagingTypes.includes("combination") && (
              <SelectableCard
                title="Combination"
                subtitle="Inner packagings in an outer packaging"
                selected={selection === "combination"}
                onPress={() => setSelection("combination")}
              />
            )}
            {allowedPackagingTypes.includes("composite") && (
              <SelectableCard
                title="Composite"
                subtitle="Outer packaging with integrated inner receptacle"
                selected={selection === "composite"}
                onPress={() => setSelection("composite")}
              />
            )}
          </View>
        </View>
      </View>
      <ActionFooter
        buttons={[
          {
            label: "Continue",
            onPress: handleContinue,
            disabled: !selection || !key16Match,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: spacing.lg,
    gap: spacing.xl,
  },
  leftColumn: {
    flex: 0.4,
    gap: spacing.md,
  },
  rightColumn: {
    flex: 0.6,
    gap: spacing.md,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  key16Card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  key16Label: {
    fontSize: 10,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.4,
  },
  key16Value: {
    fontSize: 14,
    color: colors.textPrimary,
  },
  questionText: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  buttonRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  matchButton: {
    flex: 1,
  },
  yesButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  noButtonSelected: {
    backgroundColor: colors.error,
    borderColor: colors.error,
  },
  selectedButtonText: {
    color: colors.white,
  },
  warningBox: {
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
  },
  warningText: {
    fontSize: 13,
    color: "#B45309",
  },
  cardsContainer: {
    gap: spacing.md,
  },
  selectableCard: {
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
  },
  selectableCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.infoLight,
  },
  selectableCardDisabled: {
    opacity: 0.5,
    backgroundColor: colors.backgroundSecondary,
  },
  selectableCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  selectableCardTitleSelected: {
    color: colors.primary,
  },
  selectableCardTitleDisabled: {
    color: colors.textSecondary,
  },
  selectableCardSubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  selectableCardSubtitleDisabled: {
    color: colors.textSecondary,
  },
  disabledReason: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.warning,
    marginTop: spacing.sm,
  },
});

export default InspectorPackagingTypeSelectionScreen;
