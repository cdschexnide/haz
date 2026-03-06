import React, { useEffect, useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useHazProActions } from "@/stores/useHazProStore";
import {
  ActionFooter,
  ScreenHeader,
  SelectableCard,
  colors,
  spacing,
  borderRadius,
} from "@/components/ui";

interface InspectorSpecialAuthorizationCheckScreenProps {
  navigation: any;
  route?: { params?: { packingInstruction?: string } };
}

const InspectorSpecialAuthorizationCheckScreen = ({
  navigation,
  route,
}: InspectorSpecialAuthorizationCheckScreenProps) => {
  const { inspection, addFrustration, completeSDDGSubstep, setCurrentSDDGStep } = useInspectionForm();
  const actions = useHazProActions();

  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, [actions]);

  const packingInstruction = useMemo(
    () =>
      route?.params?.packingInstruction ||
      inspection.verificationCopy?.packingInstruction ||
      "",
    [inspection.verificationCopy?.packingInstruction, route?.params?.packingInstruction]
  );

  const [selection, setSelection] = useState<"yes" | "no" | "">("");

  const preloadedAuthorization = useMemo(() => {
    const coeCount = inspection.coeAndCaaDocuments?.coeDocuments?.length || 0;
    const caaCount = inspection.coeAndCaaDocuments?.caaDocuments?.length || 0;
    const dotSpCount = inspection.dotSpWaivers?.length || 0;

    const countByType: Record<"COE" | "CAA" | "DOT-SP", number> = {
      COE: coeCount,
      CAA: caaCount,
      "DOT-SP": dotSpCount,
    };

    const currentType = inspection.specialAuthorizationType;
    if (currentType && countByType[currentType] > 0) {
      return { type: currentType, documentCount: countByType[currentType] };
    }

    const populated = (Object.entries(countByType) as Array<[
      "COE" | "CAA" | "DOT-SP",
      number
    ]>).filter(([, count]) => count > 0);

    if (populated.length === 1) {
      const [type, documentCount] = populated[0];
      return { type, documentCount };
    }

    if (packingInstruction.toUpperCase().includes("DOT-SP") && dotSpCount > 0) {
      return { type: "DOT-SP" as const, documentCount: dotSpCount };
    }

    return null;
  }, [
    inspection.coeAndCaaDocuments?.coeDocuments,
    inspection.coeAndCaaDocuments?.caaDocuments,
    inspection.dotSpWaivers,
    inspection.specialAuthorizationType,
    packingInstruction,
  ]);

  const handleContinue = () => {
    if (!selection) {
      Alert.alert(
        "Selection Required",
        "Confirm whether this shipment is using COE/CAA/DOT-SP."
      );
      return;
    }

    if (selection === "yes") {
      if (preloadedAuthorization) {
        navigation.navigate("InspectorPreloadedAuthorizationReviewScreen", {
          authorizationType: preloadedAuthorization.type,
          key17Value: packingInstruction.trim(),
        });
        return;
      }

      navigation.navigate("WaiverUploadScreen", {
        key17Value: packingInstruction.trim(),
      });
      return;
    }

    addFrustration({
      key: "packingInstruction",
      fieldLabel: "PACKING INSTRUCTION (KEY 17)",
      fieldValue: packingInstruction,
      correctValue: undefined,
      defaultMessage:
        "Key 17 does not match a valid AFMAN 24-604 packaging paragraph",
    });
    completeSDDGSubstep("InteractiveSDDGComplianceScreen");
    setCurrentSDDGStep("frustration");
    navigation.navigate("SDDGFrustrationSummary");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Special Authorization Check"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <View style={styles.flagBanner}>
          <View style={styles.flagBannerRow}>
            <MaterialIcons name="warning" size={18} color={colors.warning} />
            <Text style={styles.flagBannerTitle}>Key 17 Flagged:</Text>
            <Text style={styles.flagBannerValue} numberOfLines={1}>
              {packingInstruction || "Not provided"}
            </Text>
          </View>
          <Text style={styles.flagBannerDescription}>
            Not a known AFMAN 24-604 packaging paragraph
          </Text>
        </View>

        <View style={styles.questionSection}>
          <Text style={styles.questionText}>What applies to this shipment?</Text>
          {preloadedAuthorization ? (
            <Text style={styles.preloadedHint}>
              Found {preloadedAuthorization.documentCount} preloaded{" "}
              {preloadedAuthorization.type} document
              {preloadedAuthorization.documentCount === 1 ? "" : "s"} from the
              matched Preparer shipment.
            </Text>
          ) : null}
        </View>

        <View style={styles.optionsGroup}>
          <SelectableCard
            title="Uses special authorization"
            subtitle="Operating under a COE, CAA, or DOT-SP"
            selected={selection === "yes"}
            onPress={() => setSelection("yes")}
          />
          <View style={styles.optionsDivider} />
          <SelectableCard
            title="Key 17 is incorrect"
            subtitle="Should be a valid AFMAN packaging paragraph"
            selected={selection === "no"}
            onPress={() => setSelection("no")}
          />
        </View>
      </View>

      <ActionFooter
        buttons={[
          {
            label: "Back",
            variant: "outline",
            onPress: () => navigation.goBack(),
            icon: "arrow-back",
          },
          {
            label: "Continue",
            onPress: handleContinue,
            icon: "arrow-forward",
            iconPosition: "right",
            disabled: !selection,
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
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
  flagBanner: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  flagBannerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  flagBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  flagBannerValue: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: colors.warning,
  },
  flagBannerDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginLeft: 22,
  },
  questionSection: {
    gap: spacing.xs,
  },
  questionText: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  preloadedHint: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  optionsGroup: {
    borderRadius: borderRadius.lg,
    overflow: "hidden",
  },
  optionsDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
});

export default InspectorSpecialAuthorizationCheckScreen;
