import React, { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { ActionFooter, InfoBox, RadioGroup, ScreenHeader, spacing } from "@/components/ui";

const InspectorQuantityTypeSelectionScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route: { params?: { nextRoute?: string; nextParams?: Record<string, any> } };
}) => {
  const { inspection, setQuantityType } = useInspectionForm();
  const nextRoute = route.params?.nextRoute || "MLDetectionScreen";
  const nextParams = route.params?.nextParams;

  const isExceptedEligible = inspection.exceptedQuantityData?.eligible === true;
  const isLimitedEligible = inspection.limitedQuantityData?.eligible === true;

  const options = useMemo(() => {
    const base = [
      { label: "Standard quantity (default requirements apply)", value: "standard" },
    ];

    if (isExceptedEligible) {
      base.push({
        label: "Excepted Quantity (A19.2) – EQ marking only",
        value: "excepted",
      });
    }

    if (isLimitedEligible) {
      base.push({
        label: "Limited Quantity (A19.3) – limited quantity rules",
        value: "limited",
      });
    }

    return base;
  }, [isExceptedEligible, isLimitedEligible]);

  const defaultSelection =
    isExceptedEligible && !isLimitedEligible
      ? "excepted"
      : !isExceptedEligible && isLimitedEligible
      ? "limited"
      : "standard";

  const [selection, setSelection] = useState<string>(defaultSelection);

  const handleContinue = () => {
    setQuantityType(selection as "standard" | "excepted" | "limited");
    navigation.navigate("InspectorPackagingTypeSelectionScreen", {
      nextRoute,
      nextParams,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Shipment Quantity Type"
        subtitle="Confirm how this shipment is being moved."
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoBox
          title="Eligibility Check"
          variant={isExceptedEligible || isLimitedEligible ? "success" : "warning"}
          message={
            isExceptedEligible || isLimitedEligible
              ? "This shipment is eligible for alternate quantity rules. Confirm the actual shipping status."
              : "This shipment does not meet the requirements for Excepted or Limited Quantity."
          }
        />
        <RadioGroup
          label="Shipment status"
          options={options}
          value={selection}
          onChange={setSelection}
          required
        />
      </ScrollView>
      <ActionFooter
        buttons={[
          { label: "Continue", onPress: handleContinue, disabled: !selection },
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
    padding: spacing.lg,
    gap: spacing.lg,
  },
});

export default InspectorQuantityTypeSelectionScreen;
