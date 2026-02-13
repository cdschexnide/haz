import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import {
  ActionFooter,
  InfoBox,
  RadioGroup,
  ScreenHeader,
  colors,
  spacing,
} from "@/components/ui";
import { isValidAfmanPackagingParagraph } from "@/utils/afmanPackagingParagraphs";

interface InspectorSpecialAuthorizationCheckScreenProps {
  navigation: any;
  route?: { params?: { packingInstruction?: string } };
}

const InspectorSpecialAuthorizationCheckScreen = ({
  navigation,
  route,
}: InspectorSpecialAuthorizationCheckScreenProps) => {
  const { inspection, setSpecialAuthorizationData } = useInspectionForm();

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
      navigation.navigate("InspectorSpecialAuthorizationAttestationScreen", {
        referenceNumber: packingInstruction.trim(),
      });
      return;
    }

    setSpecialAuthorizationData(null);
    Alert.alert(
      "Key 17 Must Be Corrected",
      "If this shipment is not using COE/CAA/DOT-SP, Key 17 must be a valid AFMAN 24-604 packaging paragraph."
    );
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Special Authorization Check"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <InfoBox
          title="Invalid AFMAN paragraph"
          variant="warning"
          message={`Key 17 does not match a valid AFMAN 24-604 packaging paragraph: "${packingInstruction || "Not provided"}"`}
        />

        <View style={styles.referenceCard}>
          <Text style={styles.label}>Key 17 Value</Text>
          <Text style={styles.value}>{packingInstruction || "Not provided"}</Text>
        </View>

        {isValidAfmanPackagingParagraph(packingInstruction) ? (
          <InfoBox
            title="AFMAN Paragraph Detected"
            variant="info"
            message="Key 17 appears valid. Use Back and continue from SDDG to stay in the standard inspection path."
          />
        ) : (
          <RadioGroup
            label="Is this shipment operating under special authorization?"
            required
            options={[
              {
                label: "Yes, shipment uses COE/CAA/DOT-SP",
                value: "yes",
              },
              {
                label: "No, Key 17 should be an AFMAN paragraph",
                value: "no",
              },
            ]}
            value={selection}
            onChange={value => setSelection(value as "yes" | "no")}
          />
        )}
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
    </View>
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
  referenceCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.xs,
  },
  label: {
    fontSize: 12,
    color: colors.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: spacing.xs,
  },
  value: {
    fontSize: 16,
    color: colors.textPrimary,
    fontWeight: "600",
  },
});

export default InspectorSpecialAuthorizationCheckScreen;
