import React, { useMemo, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import {
  ActionFooter,
  InfoBox,
  RadioGroup,
  ScreenHeader,
  colors,
  spacing,
} from "@/components/ui";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";
import {
  findMatchingAuthorizationDocuments,
  normalizeAuthorizationReference,
} from "@/utils/specialAuthorizationReference";

interface InspectorSpecialAuthorizationAttestationScreenProps {
  navigation: any;
  route?: { params?: { referenceNumber?: string } };
}

const InspectorSpecialAuthorizationAttestationScreen = ({
  navigation,
  route,
}: InspectorSpecialAuthorizationAttestationScreenProps) => {
  const {
    inspection,
    setSpecialAuthorizationData,
    setQuantityType,
    setExceptedQuantityData,
    setLimitedQuantityData,
    setPackagePackagingType,
    setPackageComplete,
    finalizeInspection,
    pruneAuthorizationDocumentsByType,
  } = useInspectionForm();

  const referenceNumber = useMemo(
    () =>
      route?.params?.referenceNumber?.trim() ||
      inspection.verificationCopy?.packingInstruction?.trim() ||
      "",
    [inspection.verificationCopy?.packingInstruction, route?.params?.referenceNumber]
  );

  const [authorizationType, setAuthorizationType] = useState<
    SpecialAuthorizationType | ""
  >(inspection.specialAuthorizationType || "");
  const [isAttested, setIsAttested] = useState(
    inspection.specialAuthorizationAttested === true
  );
  const [isCompleting, setIsCompleting] = useState(false);
  const coeCount = inspection.coeAndCaaDocuments?.coeDocuments?.length || 0;
  const caaCount = inspection.coeAndCaaDocuments?.caaDocuments?.length || 0;
  const dotSpCount = inspection.dotSpWaivers?.length || 0;

  const selectedDocumentCount =
    authorizationType === "COE"
      ? coeCount
      : authorizationType === "CAA"
      ? caaCount
      : authorizationType === "DOT-SP"
      ? dotSpCount
      : 0;

  const selectedDocuments = useMemo(() => {
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
    inspection.coeAndCaaDocuments?.caaDocuments,
    inspection.coeAndCaaDocuments?.coeDocuments,
    inspection.dotSpWaivers,
  ]);

  const hasMatchingReference =
    !!authorizationType &&
    !!referenceNumber &&
    findMatchingAuthorizationDocuments({
      key17Reference: referenceNumber,
      type: authorizationType,
      documents: selectedDocuments,
    }).length > 0;

  const handleAuthorizationTypeChange = (nextType: SpecialAuthorizationType) => {
    if (nextType === authorizationType) {
      return;
    }

    const hasOtherTypeDocuments =
      nextType === "COE"
        ? caaCount > 0 || dotSpCount > 0
        : nextType === "CAA"
        ? coeCount > 0 || dotSpCount > 0
        : coeCount > 0 || caaCount > 0;

    if (!hasOtherTypeDocuments) {
      setAuthorizationType(nextType);
      return;
    }

    Alert.alert(
      "Switch Authorization Type?",
      "Switching authorization type will remove uploaded documents for the other type(s) in this inspection.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          style: "destructive",
          onPress: () => {
            pruneAuthorizationDocumentsByType(nextType);
            setAuthorizationType(nextType);
          },
        },
      ]
    );
  };

  const handleUploadPress = () => {
    if (authorizationType === "COE" || authorizationType === "CAA") {
      navigation.navigate("InspectorCoeAndCaaScreen", {
        documentType: authorizationType,
      });
      return;
    }
    if (authorizationType === "DOT-SP") {
      navigation.navigate("InspectorDotSpScreen");
      return;
    }
    Alert.alert(
      "Authorization Type Required",
      "Select COE, CAA, or DOT-SP before uploading."
    );
  };

  const handleContinue = async () => {
    if (!referenceNumber) {
      Alert.alert(
        "Missing Key 17 Reference",
        "Key 17 must contain the COE/CAA/DOT-SP reference number before continuing."
      );
      return;
    }

    if (!authorizationType) {
      Alert.alert(
        "Authorization Type Required",
        "Select COE, CAA, or DOT-SP before continuing."
      );
      return;
    }

    if (!isAttested) {
      Alert.alert(
        "Attestation Required",
        "You must attest that the shipment adheres to the uploaded authorization."
      );
      return;
    }

    if (selectedDocumentCount === 0) {
      Alert.alert(
        "Authorization Document Required",
        authorizationType === "DOT-SP"
          ? "Upload at least one DOT-SP document before completing the inspection."
          : `Upload at least one ${authorizationType} document before completing the inspection.`
      );
      return;
    }

    if (!hasMatchingReference) {
      const normalizedKey17 = normalizeAuthorizationReference(
        referenceNumber,
        authorizationType
      );
      const uploadedReferences = selectedDocuments
        .map(doc =>
          authorizationType === "DOT-SP"
            ? (doc as { waiverNumber?: string }).waiverNumber || ""
            : (doc as { name?: string }).name || ""
        )
        .filter(Boolean)
        .slice(0, 3);

      const listText =
        uploadedReferences.length > 0
          ? uploadedReferences.map(value => `- ${value}`).join("\n")
          : "- No reference values found";

      Alert.alert(
        "Reference Mismatch",
        `Key 17 reference "${referenceNumber}" does not match uploaded ${authorizationType} document references.\n\nNormalized Key 17: ${normalizedKey17 || "N/A"}\n\nUploaded references:\n${listText}`
      );
      return;
    }

    setSpecialAuthorizationData({
      type: authorizationType,
      referenceNumber,
      attested: true,
    });
    setQuantityType("standard");
    setExceptedQuantityData(null);
    setLimitedQuantityData(null);
    setPackagePackagingType(null);
    setPackageComplete(true);

    try {
      setIsCompleting(true);
      const result = await finalizeInspection();
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
          routes: [
            {
              name: "InspectorHomeStack",
              params: { screen: "InspectorHome" },
            },
          ],
        });
      } else {
        navigation.navigate("InspectorHomeStack", {
          screen: "InspectorHome",
        });
      }
    } catch (error) {
      Alert.alert(
        "Unable to Complete Inspection",
        "An unexpected error occurred while completing this inspection."
      );
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScreenHeader
        title="Special Authorization Attestation"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <InfoBox
          title="Reference from Key 17"
          variant="info"
          message={referenceNumber || "Not provided"}
        />

        <RadioGroup
          label="Authorization type"
          required
          options={[
            { label: "COE (Certificate of Equivalency)", value: "COE" },
            { label: "CAA (Competent Authority Approval)", value: "CAA" },
            { label: "DOT-SP (Special Permit)", value: "DOT-SP" },
          ]}
          value={authorizationType}
          onChange={value =>
            handleAuthorizationTypeChange(value as SpecialAuthorizationType)
          }
        />

        <View style={styles.documentCard}>
          <View style={styles.documentCardHeader}>
            <MaterialIcons
              name="description"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.documentCardTitle}>
              Upload Authorization Document
            </Text>
          </View>
          <Text style={styles.documentCardText}>
            {authorizationType
              ? `Saved ${authorizationType} documents: ${selectedDocumentCount}`
              : "Select an authorization type, then upload the matching documentation."}
          </Text>
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={handleUploadPress}
            activeOpacity={0.85}
          >
            <MaterialIcons name="upload-file" size={20} color={colors.white} />
            <Text style={styles.uploadButtonText}>
              {authorizationType === "DOT-SP"
                ? "Upload DOT-SP"
                : "Upload COE/CAA"}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.attestationRow}
          onPress={() => setIsAttested(prev => !prev)}
          activeOpacity={0.8}
        >
          <MaterialIcons
            name={isAttested ? "check-box" : "check-box-outline-blank"}
            size={24}
            color={isAttested ? colors.primary : colors.textSecondary}
          />
          <Text style={styles.attestationText}>
            I attest this shipment has been prepared in accordance with the
            selected COE/CAA/DOT-SP authorization and its criteria.
          </Text>
        </TouchableOpacity>
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
            label: "Complete Inspection",
            onPress: handleContinue,
            icon: "arrow-forward",
            iconPosition: "right",
            disabled:
              !authorizationType ||
              !isAttested ||
              selectedDocumentCount === 0 ||
              !hasMatchingReference ||
              !referenceNumber ||
              isCompleting,
            loading: isCompleting,
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
  documentCard: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
    gap: spacing.sm,
  },
  documentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  documentCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  documentCardText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignSelf: "flex-start",
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  attestationRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: spacing.md,
  },
  attestationText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: colors.textPrimary,
  },
});

export default InspectorSpecialAuthorizationAttestationScreen;
