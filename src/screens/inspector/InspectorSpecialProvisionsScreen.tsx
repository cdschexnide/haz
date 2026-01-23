import React, { useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useInspectionForm } from "../../contexts/InspectionFormProvider";
import { hazardousMaterialsList } from "../../hazardousMaterials/hazardousMaterialsList";
import { specialProvisionsMap } from "../../../server/lookupFunctions/specialProvisions";
import {
  ScreenHeader,
  ActionFooter,
  InfoBox,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "../../components/ui";

interface InspectorSpecialProvisionsScreenProps {
  navigation: any;
  route?: { params?: { continueRoute?: string; continueParams?: any } };
}

const parseSpecialProvisionCodes = (value: string): string[] => {
  if (!value) {
    return [];
  }
  return value
    .split(/[,:]/)
    .map(code => code.trim())
    .filter(Boolean);
};

const InspectorSpecialProvisionsScreen = ({
  navigation,
  route,
}: InspectorSpecialProvisionsScreenProps) => {
  const { inspection } = useInspectionForm();
  const unIdNo =
    inspection?.verificationCopy?.unIdNo ||
    inspection?.extractedContent?.unIdNo ||
    "";

  const hazmatItem = hazardousMaterialsList.find(
    item => item.unid === unIdNo
  );
  const specialProvision = hazmatItem?.specialProvision || "";

  const codes = useMemo(
    () => parseSpecialProvisionCodes(specialProvision),
    [specialProvision]
  );

  const handleContinue = () => {
    if (route?.params?.continueRoute) {
      navigation.navigate(route.params.continueRoute, route.params.continueParams);
      return;
    }
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Special Provisions"
        subtitle={`UN ${unIdNo || "Unknown"} guidance`}
        showBackButton
        onBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={styles.content}>
        <InfoBox
          title="Read-only guidance"
          variant="info"
          message="These special provisions apply to the material you are inspecting. Review them before continuing."
        />

        {codes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No special provisions listed</Text>
            <Text style={styles.emptySubtitle}>
              This material does not include special provision codes in the database.
            </Text>
          </View>
        ) : (
          codes.map(code => (
            <View key={code} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.codeBadge}>{code}</Text>
                <Text style={styles.codeTitle}>Special Provision</Text>
              </View>
              <Text style={styles.codeDescription}>
                {specialProvisionsMap[code] || "No definition available in the special provisions map."}
              </Text>
            </View>
          ))
        )}
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
            variant: "primary",
            onPress: handleContinue,
            icon: "arrow-forward",
            iconPosition: "right",
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
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  card: {
    marginTop: spacing.lg,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.light,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  codeBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
    backgroundColor: colors.primaryLight,
    color: colors.primary,
    fontWeight: "700",
    marginRight: spacing.sm,
  },
  codeTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  codeDescription: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
});

export default InspectorSpecialProvisionsScreen;
