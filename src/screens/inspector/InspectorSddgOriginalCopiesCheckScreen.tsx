import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useHazProActions } from "@/stores/useHazProStore";
import { routeToPackageWorkflowStart } from "@/utils/inspectorPostSddgPackageRouting";
import {
  ActionFooter,
  ScreenHeader,
  SelectableCard,
  colors,
  spacing,
  borderRadius,
} from "@/components/ui";

const COPIES_FRUSTRATION_KEY = "sddgOriginalDocumentCopies";
const COPIES_FIELD_LABEL =
  "THREE ORIGINAL DOCUMENTS FOR EACH PSN UNDER A SINGLE TCN (ONLY TWO REQUIRED FOR CHAPTER 3)";

interface InspectorSddgOriginalCopiesCheckScreenProps {
  navigation: any;
  route?: {
    params?: {
      showSummaryOnFailure?: boolean;
    };
  };
}

const InspectorSddgOriginalCopiesCheckScreen = ({
  navigation,
  route,
}: InspectorSddgOriginalCopiesCheckScreenProps) => {
  const {
    inspection,
    addFrustration,
    removeFrustration,
    setCurrentSDDGScreen,
    setCurrentSDDGStep,
    setQuantityType,
    setExceptedQuantityData,
    setLimitedQuantityData,
    setPackagePackagingType,
    setSpecialAuthorizationData,
  } = useInspectionForm();
  const actions = useHazProActions();

  const showSummaryOnFailure = route?.params?.showSummaryOnFailure === true;

  const [chapter3Selection, setChapter3Selection] = useState<"yes" | "no" | "">(
    ""
  );
  const [hasRequiredOriginalCopies, setHasRequiredOriginalCopies] = useState<
    boolean | null
  >(null);

  React.useEffect(() => {
    actions.setCurrentChevron("sddg");
    setCurrentSDDGScreen("InspectorSddgOriginalCopiesCheckScreen");
  }, [actions, setCurrentSDDGScreen]);

  const requiredCopies = useMemo(
    () => (chapter3Selection === "yes" ? 2 : 3),
    [chapter3Selection]
  );

  const handleContinue = () => {
    if (!chapter3Selection) {
      Alert.alert("Selection Required", "Select whether Chapter 3 authorization applies.");
      return;
    }

    if (hasRequiredOriginalCopies === null) {
      Alert.alert(
        "Selection Required",
        "Select whether the shipment contains the required number of original SDDG documents."
      );
      return;
    }

    const chapter3 = chapter3Selection === "yes";
    const isCompliant = hasRequiredOriginalCopies;

    if (isCompliant) {
      removeFrustration(COPIES_FRUSTRATION_KEY);
    } else {
      addFrustration({
        key: COPIES_FRUSTRATION_KEY,
        fieldLabel: COPIES_FIELD_LABEL,
        fieldValue: `Required ${requiredCopies} original SDDG document${requiredCopies === 1 ? "" : "s"} not present`,
        defaultMessage: "Shipment does not include the required number of original SDDG documents.",
        additionalComments: `Required: ${requiredCopies}; Chapter 3: ${chapter3 ? "Yes" : "No"}; Response: No`,
      });
    }

    if (!isCompliant && showSummaryOnFailure) {
      setCurrentSDDGStep("frustration");
      navigation.navigate("SDDGFrustrationSummary", {
        skipOriginalCopiesCheck: true,
      });
      return;
    }

    routeToPackageWorkflowStart({
      inspection,
      navigation,
      setQuantityType,
      setExceptedQuantityData,
      setLimitedQuantityData,
      setPackagePackagingType,
      setSpecialAuthorizationData,
    });
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="SDDG Original Copies"
        onBack={() => navigation.goBack()}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.noticeCard}>
          <View style={styles.noticeHeader}>
            <MaterialIcons name="assignment" size={22} color={colors.warning} />
            <Text style={styles.noticeTitle}>Verify Original Documents</Text>
          </View>
          <Text style={styles.noticeText}>
            Verify the number of original SDDG documents for this shipment before
            package inspection starts.
          </Text>
          <Text style={styles.ruleText}>
            Requirement: 3 originals per PSN under a single TCN, or 2 originals when
            moving under Chapter 3 authorization.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Is this shipment under Chapter 3 authorization?</Text>
        <SelectableCard
          title="Yes"
          subtitle="Only 2 original SDDG documents are required"
          selected={chapter3Selection === "yes"}
          onPress={() => {
            setChapter3Selection("yes");
            setHasRequiredOriginalCopies(null);
          }}
        />
        <SelectableCard
          title="No"
          subtitle="3 original SDDG documents are required"
          selected={chapter3Selection === "no"}
          onPress={() => {
            setChapter3Selection("no");
            setHasRequiredOriginalCopies(null);
          }}
        />

        {chapter3Selection ? (
          <>
            <Text style={styles.sectionTitle}>
              {chapter3Selection === "yes"
                ? "Does the shipment contain 2 original SDDG documents?"
                : "Does the shipment contain 3 original SDDG documents?"}
            </Text>
            <SelectableCard
              title="Yes"
              subtitle={`Shipment contains ${requiredCopies} original SDDG documents`}
              selected={hasRequiredOriginalCopies === true}
              onPress={() => setHasRequiredOriginalCopies(true)}
            />
            <SelectableCard
              title="No"
              subtitle={`Shipment does not contain ${requiredCopies} original SDDG documents`}
              selected={hasRequiredOriginalCopies === false}
              onPress={() => setHasRequiredOriginalCopies(false)}
            />

            {hasRequiredOriginalCopies !== null && (
              <Text style={styles.resultText}>
                Required: {requiredCopies} | Status:{" "}
                {hasRequiredOriginalCopies ? "Compliant" : "Frustrated"}
              </Text>
            )}
          </>
        ) : null}
      </ScrollView>

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
            disabled: !chapter3Selection || hasRequiredOriginalCopies === null,
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
    gap: spacing.md,
  },
  scrollView: {
    flex: 1,
  },
  noticeCard: {
    backgroundColor: colors.warningLight,
    borderWidth: 1,
    borderColor: colors.warning,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  noticeHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  noticeTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  noticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  ruleText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontWeight: "600",
    lineHeight: 18,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  resultText: {
    marginTop: spacing.xs,
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
});

export default InspectorSddgOriginalCopiesCheckScreen;
