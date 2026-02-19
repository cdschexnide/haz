import React, { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useHazProActions } from "@/stores/useHazProStore";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";
import {
  ActionFooter,
  ChecklistItem,
  DetailCard,
  ScreenHeader,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "@/components/ui";

interface WaiverAttestationScreenProps {
  navigation: any;
  route?: {
    params?: {
      authorizationType?: SpecialAuthorizationType;
      key17Value?: string;
    };
  };
}

const WaiverAttestationScreen = ({
  navigation,
  route,
}: WaiverAttestationScreenProps) => {
  const {
    inspection,
    setSpecialAuthorizationData,
  } = useInspectionForm();
  const actions = useHazProActions();

  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, [actions]);

  const authorizationType = route?.params?.authorizationType || null;
  const key17Value = route?.params?.key17Value || "";

  const [isAttested, setIsAttested] = useState(false);
  const documents = useMemo(() => {
    if (authorizationType === "COE") {
      return inspection.coeAndCaaDocuments?.coeDocuments || [];
    }
    if (authorizationType === "CAA") {
      return inspection.coeAndCaaDocuments?.caaDocuments || [];
    }
    if (authorizationType === "DOT-SP") {
      return inspection.dotSpWaivers || [];
    }
    return [];
  }, [
    authorizationType,
    inspection.coeAndCaaDocuments?.coeDocuments,
    inspection.coeAndCaaDocuments?.caaDocuments,
    inspection.dotSpWaivers,
  ]);

  const resolvedReference = useMemo(() => {
    const fromKey17 = key17Value.trim();
    if (fromKey17) return fromKey17;

    const existing = (inspection.specialAuthorizationReference || "").trim();
    if (existing) return existing;

    if (authorizationType === "COE") {
      return (
        inspection.coeAndCaaDocuments?.coeDocuments?.[
          (inspection.coeAndCaaDocuments?.coeDocuments?.length || 1) - 1
        ]?.name || ""
      ).trim();
    }
    if (authorizationType === "CAA") {
      return (
        inspection.coeAndCaaDocuments?.caaDocuments?.[
          (inspection.coeAndCaaDocuments?.caaDocuments?.length || 1) - 1
        ]?.name || ""
      ).trim();
    }
    if (authorizationType === "DOT-SP") {
      return (
        inspection.dotSpWaivers?.[(inspection.dotSpWaivers?.length || 1) - 1]
          ?.waiverNumber || ""
      ).trim();
    }

    return "";
  }, [
    authorizationType,
    key17Value,
    inspection.specialAuthorizationReference,
    inspection.coeAndCaaDocuments?.coeDocuments,
    inspection.coeAndCaaDocuments?.caaDocuments,
    inspection.dotSpWaivers,
  ]);

  const handleContinueToForm1015 = () => {
    if (!authorizationType) {
      Alert.alert("Error", "Authorization type is missing.");
      return;
    }

    if (!isAttested) {
      Alert.alert(
        "Attestation Required",
        "You must attest before completing the inspection."
      );
      return;
    }

    if (documents.length === 0) {
      Alert.alert(
        "No Documents",
        "Go back and upload at least one authorization document."
      );
      return;
    }

    if (!resolvedReference) {
      Alert.alert(
        "Reference Required",
        "No authorization reference was found. Return to upload/review and confirm Key 17 value."
      );
      return;
    }

    setSpecialAuthorizationData({
      type: authorizationType,
      referenceNumber: resolvedReference,
      attested: true,
    });

    navigation.navigate("InspectorAMC1015Form");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Review & Attest" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DetailCard
          title="Summary"
          icon="info"
          fields={[
            { label: "Authorization", value: authorizationType || "—" },
            { label: "Key 17 Value", value: key17Value || "—" },
            { label: "Reference", value: resolvedReference || "—" },
            {
              label: "Documents",
              value: `${documents.length} uploaded`,
            },
          ]}
        />

        {documents.length > 0 && (
          <View style={styles.documentsSection}>
            <SectionHeader
              title={`Uploaded Documents (${documents.length})`}
              icon="description"
            />
            {documents.map((doc: any) => (
              <View key={doc.id} style={styles.documentRow}>
                <View
                  style={[styles.documentThumb, styles.documentThumbPlaceholder]}
                >
                  <MaterialIcons
                    name="picture-as-pdf"
                    size={24}
                    color={colors.textSecondary}
                  />
                </View>
                <View style={styles.documentInfo}>
                  <Text style={styles.documentTitle}>{authorizationType} Document</Text>
                  <Text style={styles.documentDate}>
                    {doc.dateAdded
                      ? new Date(doc.dateAdded).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : ""}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <View style={styles.attestationCard}>
          <ChecklistItem
            label="I attest that this shipment has been prepared in accordance with the selected authorization and its conditions/criteria."
            checked={isAttested}
            onChange={setIsAttested}
          />
        </View>
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
            label: "Continue to Form 1015",
            onPress: handleContinueToForm1015,
            icon: "arrow-forward",
            disabled:
              !isAttested ||
              !authorizationType ||
              documents.length === 0,
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  documentsSection: {
    gap: spacing.sm,
  },
  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.light,
  },
  documentThumb: {
    width: 60,
    height: 80,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.backgroundSecondary,
  },
  documentThumbPlaceholder: {
    alignItems: "center",
    justifyContent: "center",
  },
  documentInfo: {
    flex: 1,
    gap: 2,
  },
  documentTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  documentDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  attestationCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
});

export default WaiverAttestationScreen;
