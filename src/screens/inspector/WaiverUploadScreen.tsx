import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import * as Print from "expo-print";
import DocumentScanner, {
  ResponseType,
} from "react-native-document-scanner-plugin";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useHazProActions } from "@/stores/useHazProStore";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";
import {
  ActionFooter,
  ScreenHeader,
  SectionHeader,
  colors,
  spacing,
  borderRadius,
  shadows,
} from "@/components/ui";

interface WaiverUploadScreenProps {
  navigation: any;
  route?: { params?: { key17Value?: string } };
}

type AuthType = SpecialAuthorizationType;

const AUTH_TYPES: { label: string; value: AuthType }[] = [
  { label: "COE", value: "COE" },
  { label: "CAA", value: "CAA" },
  { label: "DOT-SP", value: "DOT-SP" },
];

const WaiverUploadScreen = ({ navigation, route }: WaiverUploadScreenProps) => {
  const {
    inspection,
    addCoeCaaDocument,
    removeCoeCaaDocument,
    addDotSpWaiver,
    removeDotSpWaiver,
    pruneAuthorizationDocumentsByType,
  } = useInspectionForm();
  const actions = useHazProActions();

  const key17Value = route?.params?.key17Value || "";

  const [authType, setAuthType] = useState<AuthType | "">("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(
    Platform.OS === "ios" ? true : null
  );

  const checkCameraPermission = useCallback(async () => {
    if (Platform.OS !== "android") return;
    try {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA
      );
      setCameraPermission(result === PermissionsAndroid.RESULTS.GRANTED);
    } catch {
      setCameraPermission(false);
    }
  }, []);

  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, [actions]);

  useEffect(() => {
    checkCameraPermission();
  }, [checkCameraPermission]);

  const documents = useMemo(() => {
    if (authType === "COE") {
      return inspection.coeAndCaaDocuments?.coeDocuments || [];
    }
    if (authType === "CAA") {
      return inspection.coeAndCaaDocuments?.caaDocuments || [];
    }
    if (authType === "DOT-SP") {
      return inspection.dotSpWaivers || [];
    }
    return [];
  }, [
    authType,
    inspection.coeAndCaaDocuments?.coeDocuments,
    inspection.coeAndCaaDocuments?.caaDocuments,
    inspection.dotSpWaivers,
  ]);

  const otherTypesHaveDocuments = (nextType: AuthType): boolean => {
    const coeCount = inspection.coeAndCaaDocuments?.coeDocuments?.length || 0;
    const caaCount = inspection.coeAndCaaDocuments?.caaDocuments?.length || 0;
    const dotSpCount = inspection.dotSpWaivers?.length || 0;

    if (nextType === "COE") return caaCount > 0 || dotSpCount > 0;
    if (nextType === "CAA") return coeCount > 0 || dotSpCount > 0;
    return coeCount > 0 || caaCount > 0;
  };

  const handleAuthTypeChange = (nextType: AuthType) => {
    if (nextType === authType || isProcessing) return;

    if (!otherTypesHaveDocuments(nextType)) {
      setAuthType(nextType);
      return;
    }

    Alert.alert(
      "Switch Authorization Type?",
      "Switching will remove uploaded documents for the other type(s).",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Switch",
          style: "destructive",
          onPress: () => {
            pruneAuthorizationDocumentsByType(nextType);
            setAuthType(nextType);
          },
        },
      ]
    );
  };

  const saveImageAsPdf = useCallback(
    async (imageUri: string, capturedAuthType: AuthType) => {
      setIsProcessing(true);
      try {
        const currentAuthType = capturedAuthType;
        const ext = imageUri.toLowerCase().endsWith(".png") ? "png" : "jpeg";
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const htmlContent = `<!DOCTYPE html><html><head><meta charset="utf-8" /></head><body style="margin:0;padding:0;"><div><img src="data:image/${ext};base64,${base64Image}" style="width:100%;height:auto;display:block;" /></div></body></html>`;

        const { uri: tmpPdf } = await Print.printToFileAsync({
          html: htmlContent,
        });

        const fileName = `${currentAuthType}_${Date.now()}.pdf`;
        const newUri = `${FileSystem.documentDirectory || ""}${fileName}`;
        await FileSystem.copyAsync({ from: tmpPdf, to: newUri });

        const base64Pdf = await FileSystem.readAsStringAsync(newUri, {
          encoding: FileSystem.EncodingType.Base64,
        });

        const id = Date.now().toString();
        const dateAdded = new Date().toISOString();

        if (currentAuthType === "COE" || currentAuthType === "CAA") {
          addCoeCaaDocument({
            id,
            documentType: currentAuthType,
            uri: newUri,
            base64Data: base64Pdf,
            name: `${currentAuthType} Document`,
            dateAdded,
          });
        } else if (currentAuthType === "DOT-SP") {
          addDotSpWaiver({
            id,
            uri: newUri,
            base64Data: base64Pdf,
            waiverNumber: key17Value,
            agency: "DOT",
            dateAdded,
          });
        }
      } catch (err) {
        console.error("PDF generation failed:", err);
        Alert.alert("Error", "Failed to process document. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    },
    [addCoeCaaDocument, addDotSpWaiver, key17Value]
  );

  const handleScan = async () => {
    if (!authType) {
      Alert.alert("Select Type", "Choose an authorization type before scanning.");
      return;
    }

    const capturedType = authType;
    try {
      const { scannedImages } = await DocumentScanner.scanDocument({
        croppedImageQuality: 80,
        maxNumDocuments: 1,
        responseType: ResponseType.ImageFilePath,
      });

      if (scannedImages && scannedImages.length > 0) {
        await saveImageAsPdf(scannedImages[0], capturedType);
      }
    } catch (error) {
      console.error("Document scanning error:", error);
      Alert.alert("Scanning Failed", "Please try again.");
    }
  };

  const handleGalleryPick = async () => {
    if (!authType) {
      Alert.alert("Select Type", "Choose an authorization type before selecting.");
      return;
    }

    const capturedType = authType;
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        await saveImageAsPdf(result.assets[0].uri, capturedType);
      }
    } catch (error) {
      console.error("Gallery pick error:", error);
      Alert.alert("Selection Failed", "Please try again.");
    }
  };

  const handleDeleteDocument = (docId: string) => {
    Alert.alert("Delete Document", "Are you sure you want to remove this document?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          if (authType === "COE" || authType === "CAA") {
            removeCoeCaaDocument(docId, authType);
          } else if (authType === "DOT-SP") {
            removeDotSpWaiver(docId);
          }
        },
      },
    ]);
  };

  const handleContinue = () => {
    navigation.navigate("WaiverAttestationScreen", {
      authorizationType: authType,
      key17Value,
    });
  };

  const canContinue = !!authType && documents.length > 0 && !isProcessing;

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Upload Authorization" onBack={() => navigation.goBack()} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Authorization Type</Text>
        <View style={styles.typeRow}>
          {AUTH_TYPES.map(({ label, value }) => (
            <TouchableOpacity
              key={value}
              style={[styles.typePill, authType === value && styles.typePillActive, isProcessing && styles.typePillDisabled]}
              onPress={() => handleAuthTypeChange(value)}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              <Text
                style={[
                  styles.typePillText,
                  authType === value && styles.typePillTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {cameraPermission === false && (
          <View style={styles.permissionBanner}>
            <MaterialIcons name="no-photography" size={20} color={colors.error} />
            <Text style={styles.permissionBannerText}>
              Camera access denied. Scan will be unavailable.
            </Text>
            <TouchableOpacity onPress={checkCameraPermission} activeOpacity={0.7}>
              <Text style={styles.permissionRetryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.uploadZone}>
          {cameraPermission === null && Platform.OS === "android" ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <MaterialIcons
              name="cloud-upload"
              size={36}
              color={authType ? colors.primary : colors.textSecondary}
            />
          )}
          <Text style={styles.uploadZoneText}>
            {authType ? "Scan or select your document" : "Select an authorization type first"}
          </Text>
          <View style={styles.uploadActions}>
            <TouchableOpacity
              style={[styles.uploadButton, (!authType || cameraPermission === false) && styles.uploadButtonDisabled]}
              onPress={handleScan}
              disabled={!authType || isProcessing || cameraPermission === false}
              activeOpacity={0.8}
            >
              <MaterialIcons name="document-scanner" size={20} color={colors.white} />
              <Text style={styles.uploadButtonText}>Scan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                styles.uploadButtonSecondary,
                !authType && styles.uploadButtonDisabled,
              ]}
              onPress={handleGalleryPick}
              disabled={!authType || isProcessing}
              activeOpacity={0.8}
            >
              <MaterialIcons name="photo-library" size={20} color={colors.white} />
              <Text style={styles.uploadButtonText}>Gallery</Text>
            </TouchableOpacity>
          </View>
        </View>

        {documents.length > 0 && (
          <View style={styles.documentSection}>
            <SectionHeader title={`Documents (${documents.length})`} icon="description" />
            {documents.map((doc: any) => {
              const docId = doc.id || "";
              return (
                <View key={docId} style={styles.documentCard}>
                  <View style={[styles.documentThumb, styles.documentThumbPlaceholder]}>
                    <MaterialIcons
                      name="picture-as-pdf"
                      size={24}
                      color={colors.textSecondary}
                    />
                  </View>
                  <View style={styles.documentInfo}>
                    <Text style={styles.documentTitle}>{authType} Document</Text>
                    <Text style={styles.documentMeta}>
                      {doc.dateAdded
                        ? new Date(doc.dateAdded).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : ""}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteDocument(docId)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <MaterialIcons name="delete-outline" size={22} color={colors.error} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
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
            onPress: handleContinue,
            icon: "arrow-forward",
            iconPosition: "right",
            disabled: !canContinue,
            loading: isProcessing,
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
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  typeRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  typePill: {
    flex: 1,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
  },
  typePillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.infoLight,
  },
  typePillText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  typePillTextActive: {
    color: colors.primary,
  },
  typePillDisabled: {
    opacity: 0.5,
  },
  permissionBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.error,
  },
  permissionBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.error,
  },
  permissionRetryText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.primary,
  },
  uploadZone: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: colors.border,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.xl,
    paddingHorizontal: spacing.lg,
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.surface,
  },
  uploadZoneText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  uploadActions: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  uploadButtonSecondary: {
    backgroundColor: colors.textSecondary,
  },
  uploadButtonDisabled: {
    opacity: 0.4,
  },
  uploadButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },
  documentSection: {
    gap: spacing.sm,
  },
  documentCard: {
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
  documentMeta: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  deleteButton: {
    padding: spacing.xs,
  },
});

export default WaiverUploadScreen;
