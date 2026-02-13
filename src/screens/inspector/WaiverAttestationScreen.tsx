import React, { useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
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
    finalizeInspection,
  } = useInspectionForm();

  const authorizationType = route?.params?.authorizationType || null;
  const key17Value = route?.params?.key17Value || "";

  const [isAttested, setIsAttested] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

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

  const handleComplete = async () => {
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

    try {
      setIsCompleting(true);
      const result = await finalizeInspection({
        specialAuthorizationType: authorizationType,
        specialAuthorizationReference: key17Value,
        specialAuthorizationAttested: true,
        quantityType: "standard",
        exceptedQuantityData: null,
        limitedQuantityData: null,
        packagePackagingType: null,
      });
      if (!result.success) {
        Alert.alert(
          "Unable to Complete Inspection",
          result.error || "Failed to complete and save inspection."
        );
        return;
      }

      if (navigation?.reset) {
        navigation.reset({
          index: 0,
          routes: [{ name: "InspectorHomeStack", params: { screen: "InspectorHome" } }],
        });
      } else {
        navigation.navigate("InspectorHomeStack", {
          screen: "InspectorHome",
        });
      }
    } catch (_error) {
      Alert.alert(
        "Unable to Complete Inspection",
        "An unexpected error occurred while completing this inspection."
      );
    } finally {
      setIsCompleting(false);
    }
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
            label: "Complete Inspection",
            onPress: handleComplete,
            icon: "check",
            disabled:
              !isAttested ||
              !authorizationType ||
              documents.length === 0 ||
              isCompleting,
            loading: isCompleting,
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
