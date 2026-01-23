import React, { useEffect, useMemo, useState } from "react";
import { View, ScrollView, StyleSheet, Text } from "react-native";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import {
  ActionFooter,
  InfoBox,
  RadioGroup,
  ScreenHeader,
  colors,
  spacing,
} from "@/components/ui";

const COMPATIBILITY_GROUP_OPTIONS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "N",
  "S",
];

const yesNoOptions = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

const InspectorLabelingExceptionsScreen = ({
  navigation,
  route,
}: {
  navigation: any;
  route?: { params?: { fromPopMarking?: boolean } };
}) => {
  const { inspection, setLabelingContext } = useInspectionForm();
  const extracted =
    inspection.verificationCopy || inspection.extractedContent;

  const unIdNo = extracted?.unIdNo || "";
  const properShippingName = extracted?.properShippingName || "";
  const hazmatItem = hazardousMaterialsList.find(item => item.unid === unIdNo);
  const hazardClass = hazmatItem?.hazclassDiv || extracted?.hazardClass || "";
  const subsidiaryRisk =
    hazmatItem?.subsidiaryRisk || extracted?.subsidiaryRisk || "";
  const labelingContext = inspection.labelingContext || {};

  const isEngineCandidate = ["UN3528", "UN3529", "UN3530"].includes(unIdNo);
  const isVehicleCandidate = unIdNo === "UN3166";
  const isClass1 = hazardClass.startsWith("1");
  const hasCompatibilityLetter = /[A-Z]$/.test(hazardClass.trim());
  const needsCompatibilityGroup = isClass1 && !hasCompatibilityLetter;
  const isRecoilCandidate =
    /RECOIL|ARTILLERY/.test(properShippingName.toUpperCase());
  const hasDiv42Subsidiary =
    hazardClass.startsWith("4.1") && subsidiaryRisk.includes("4.2");
  const hasClass8With6_1 =
    hazardClass.startsWith("8") && subsidiaryRisk.includes("6.1");

  const shouldShow = useMemo(
    () =>
      isEngineCandidate ||
      isVehicleCandidate ||
      needsCompatibilityGroup ||
      isRecoilCandidate ||
      hasDiv42Subsidiary ||
      hasClass8With6_1,
    [
      isEngineCandidate,
      isVehicleCandidate,
      needsCompatibilityGroup,
      isRecoilCandidate,
      hasDiv42Subsidiary,
      hasClass8With6_1,
    ]
  );

  const [engineSelection, setEngineSelection] = useState(
    labelingContext.isUnenclosedEngineOrMachinery ? "yes" : "no"
  );
  const [vehicleSelection, setVehicleSelection] = useState(
    labelingContext.isVehicleUN3166WithNoLabelsRequired ? "yes" : "no"
  );
  const [compatibilityGroup, setCompatibilityGroup] = useState(
    labelingContext.class1CompatibilityGroupLetter || ""
  );
  const [recoilSelection, setRecoilSelection] = useState(
    labelingContext.isRecoilMechanismOrArtilleryMount ? "yes" : "no"
  );
  const [div42Selection, setDiv42Selection] = useState(
    labelingContext.hasDiv42LabelApplied ? "yes" : "no"
  );
  const [corrosiveSelection, setCorrosiveSelection] = useState(
    labelingContext.isCorrosiveOnlyForClass8With6_1 ? "yes" : "no"
  );

  useEffect(() => {
    if (!shouldShow) {
      navigation.replace("InspectorMarkingsLabelsValidationScreen", {
        fromPopMarking: route?.params?.fromPopMarking,
      });
    }
  }, [navigation, shouldShow]);

  const handleContinue = () => {
    if (!shouldShow) {
      navigation.replace("InspectorMarkingsLabelsValidationScreen", {
        fromPopMarking: route?.params?.fromPopMarking,
      });
      return;
    }

    const nextContext = {
      ...labelingContext,
      ...(isEngineCandidate
        ? { isUnenclosedEngineOrMachinery: engineSelection === "yes" }
        : {}),
      ...(isVehicleCandidate
        ? { isVehicleUN3166WithNoLabelsRequired: vehicleSelection === "yes" }
        : {}),
      ...(needsCompatibilityGroup
        ? { class1CompatibilityGroupLetter: compatibilityGroup }
        : {}),
      ...(isRecoilCandidate
        ? { isRecoilMechanismOrArtilleryMount: recoilSelection === "yes" }
        : {}),
      ...(hasDiv42Subsidiary
        ? { hasDiv42LabelApplied: div42Selection === "yes" }
        : {}),
      ...(hasClass8With6_1
        ? {
            isCorrosiveOnlyForClass8With6_1: corrosiveSelection === "yes",
          }
        : {}),
    };

    setLabelingContext(nextContext);
    navigation.navigate("InspectorMarkingsLabelsValidationScreen", {
      fromPopMarking: route?.params?.fromPopMarking,
    });
  };

  const isContinueDisabled =
    needsCompatibilityGroup && !compatibilityGroup;

  if (!shouldShow) {
    return null;
  }

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Labeling Exceptions"
        subtitle="Confirm any special labeling rules before validation."
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoBox
          title="A15 exceptions"
          variant="info"
          message="These questions apply only to specific materials. Confirm details to determine which labels are required."
        />

        {isEngineCandidate ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UN3528/3529/3530 Engines</Text>
            <RadioGroup
              label="Is the engine/machinery unenclosed?"
              value={engineSelection}
              onChange={setEngineSelection}
              options={yesNoOptions}
            />
          </View>
        ) : null}

        {isVehicleCandidate ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>UN3166 Vehicles</Text>
            <RadioGroup
              label="Does this vehicle qualify for no labels required?"
              value={vehicleSelection}
              onChange={setVehicleSelection}
              options={yesNoOptions}
            />
          </View>
        ) : null}

        {needsCompatibilityGroup ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class 1 Compatibility Group</Text>
            <RadioGroup
              label="Select the compatibility group letter"
              value={compatibilityGroup}
              onChange={setCompatibilityGroup}
              options={COMPATIBILITY_GROUP_OPTIONS.map(letter => ({
                label: letter,
                value: letter,
              }))}
              required
              horizontal
            />
          </View>
        ) : null}

        {isRecoilCandidate ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recoil/Artillery Components</Text>
            <RadioGroup
              label="Is this a recoil mechanism or artillery gun mount?"
              value={recoilSelection}
              onChange={setRecoilSelection}
              options={yesNoOptions}
            />
          </View>
        ) : null}

        {hasDiv42Subsidiary ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Division 4.1 / 4.2 Labels</Text>
            <RadioGroup
              label="Is a Division 4.2 label applied?"
              value={div42Selection}
              onChange={setDiv42Selection}
              options={yesNoOptions}
            />
          </View>
        ) : null}

        {hasClass8With6_1 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Class 8 with 6.1 Subsidiary</Text>
            <RadioGroup
              label="Is this corrosive-only (no 6.1 label required)?"
              value={corrosiveSelection}
              onChange={setCorrosiveSelection}
              options={yesNoOptions}
            />
          </View>
        ) : null}
      </ScrollView>

      <ActionFooter
        buttons={[
          {
            label: "Back",
            onPress: () => navigation.goBack(),
            variant: "outline",
          },
          {
            label: "Continue",
            onPress: handleContinue,
            disabled: isContinueDisabled,
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
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  section: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
});

export default InspectorLabelingExceptionsScreen;
