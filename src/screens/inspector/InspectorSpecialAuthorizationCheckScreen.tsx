import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
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

  const packingInstruction = useMemo(
    () =>
      route?.params?.packingInstruction ||
      inspection.verificationCopy?.packingInstruction ||
      "",
    [inspection.verificationCopy?.packingInstruction, route?.params?.packingInstruction]
  );

  const [selection, setSelection] = useState<"yes" | "no" | "">("");

  const handleContinue = () => {
    if (!selection) {
      Alert.alert(
        "Selection Required",
        "Confirm whether this shipment is using COE/CAA/DOT-SP."
      );
      return;
    }

    if (selection === "yes") {
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
        <View style={styles.flagCard}>
          <View style={styles.flagCardHeader}>
            <MaterialIcons name="warning" size={22} color={colors.warning} />
            <Text style={styles.flagCardTitle}>Key 17 Flagged</Text>
          </View>
          <Text style={styles.flagCardDescription}>
            The packing instruction doesn't match a known AFMAN 24-604 paragraph.
          </Text>
          <View style={styles.key17ValueBox}>
            <Text style={styles.key17Label}>KEY 17 VALUE</Text>
            <Text style={styles.key17Value}>
              {packingInstruction || "Not provided"}
            </Text>
          </View>
        </View>

        <Text style={styles.questionText}>What applies to this shipment?</Text>

        <SelectableCard
          title="Uses special authorization"
          subtitle="Shipment is operating under a COE, CAA, or DOT-SP"
          selected={selection === "yes"}
          onPress={() => setSelection("yes")}
        />

        <SelectableCard
          title="Key 17 is incorrect"
          subtitle="Should be a valid AFMAN packaging paragraph"
          selected={selection === "no"}
          onPress={() => setSelection("no")}
        />
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
    gap: spacing.lg,
  },
  flagCard: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  flagCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  flagCardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  flagCardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  key17ValueBox: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  key17Label: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  key17Value: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

export default InspectorSpecialAuthorizationCheckScreen;
