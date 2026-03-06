import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import Pdf from "react-native-pdf";
import { useInspectionForm } from "@/contexts/InspectionFormProvider";
import { useHazProActions } from "@/stores/useHazProStore";
import type { SpecialAuthorizationType } from "@/utils/afmanPackagingParagraphs";
import {
  ActionFooter,
  ScreenHeader,
  colors,
  spacing,
  borderRadius,
} from "@/components/ui";

interface InspectorPreloadedAuthorizationReviewScreenProps {
  navigation: any;
  route?: {
    params?: {
      authorizationType?: SpecialAuthorizationType;
      key17Value?: string;
    };
  };
}

const InspectorPreloadedAuthorizationReviewScreen = ({
  navigation,
  route,
}: InspectorPreloadedAuthorizationReviewScreenProps) => {
  const { inspection } = useInspectionForm();
  const actions = useHazProActions();

  const authorizationType = route?.params?.authorizationType || null;
  const key17Value = route?.params?.key17Value || "";

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

  const [selectedDocumentIndex, setSelectedDocumentIndex] = useState(0);
  const [isLoadingPdf, setIsLoadingPdf] = useState(false);
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [pdfError, setPdfError] = useState<string | null>(null);
  const tempUrisRef = useRef<string[]>([]);

  useEffect(() => {
    actions.setCurrentChevron("sddg");
  }, [actions]);

  useEffect(() => {
    setSelectedDocumentIndex(0);
  }, [authorizationType]);

  useEffect(() => {
    let mounted = true;

    const loadDocument = async () => {
      if (documents.length === 0 || !documents[selectedDocumentIndex]) {
        setPdfUri(null);
        setPdfError("No preloaded authorization documents found.");
        return;
      }

      setIsLoadingPdf(true);
      setPdfUri(null);
      setPdfError(null);

      try {
        const selected = documents[selectedDocumentIndex] as {
          uri?: string;
          base64Data?: string;
        };

        if (selected.uri) {
          const fileInfo = await FileSystem.getInfoAsync(selected.uri);
          if (fileInfo.exists) {
            if (mounted) {
              setPdfUri(selected.uri);
              setPdfError(null);
            }
            return;
          }
        }

        if (selected.base64Data) {
          let base64 = selected.base64Data;
          if (base64.startsWith("data:")) {
            base64 = base64.split(",")[1] || base64;
          }

          const tmpPath = `${FileSystem.cacheDirectory}preloaded_auth_${Date.now()}.pdf`;
          await FileSystem.writeAsStringAsync(tmpPath, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          tempUrisRef.current.push(tmpPath);

          if (mounted) {
            setPdfUri(tmpPath);
            setPdfError(null);
          }
          return;
        }

        if (mounted) {
          setPdfError("Authorization document data is unavailable.");
        }
      } catch (error) {
        console.error("Failed to load preloaded authorization document:", error);
        if (mounted) {
          setPdfError("Unable to open the preloaded authorization document.");
        }
      } finally {
        if (mounted) {
          setIsLoadingPdf(false);
        }
      }
    };

    loadDocument();

    return () => {
      mounted = false;
    };
  }, [documents, selectedDocumentIndex]);

  useEffect(() => {
    return () => {
      tempUrisRef.current.forEach(uri => {
        FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
      });
      tempUrisRef.current = [];
    };
  }, []);

  const handleContinue = () => {
    if (!authorizationType) {
      Alert.alert("Missing Authorization Type", "Authorization type is required.");
      return;
    }

    if (documents.length === 0) {
      Alert.alert(
        "No Documents",
        "No preloaded authorization documents were found for this shipment."
      );
      return;
    }

    navigation.navigate("WaiverAttestationScreen", {
      authorizationType,
      key17Value,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Authorization Document"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {documents.length > 1 ? (
          <View style={styles.selectorRow}>
            {documents.map((doc: any, index) => (
              <TouchableOpacity
                key={doc.id || String(index)}
                style={[
                  styles.selectorPill,
                  selectedDocumentIndex === index && styles.selectorPillActive,
                ]}
                onPress={() => setSelectedDocumentIndex(index)}
              >
                <Text
                  style={[
                    styles.selectorText,
                    selectedDocumentIndex === index && styles.selectorTextActive,
                  ]}
                >
                  Doc {index + 1}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        <View style={styles.viewerCard}>
          {isLoadingPdf ? (
            <View style={styles.centeredState}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.stateText}>Loading document...</Text>
            </View>
          ) : null}

          {!isLoadingPdf && pdfError ? (
            <View style={styles.centeredState}>
              <MaterialIcons name="error-outline" size={28} color={colors.error} />
              <Text style={styles.stateText}>{pdfError}</Text>
            </View>
          ) : null}

          {!isLoadingPdf && !pdfError && pdfUri ? (
            <Pdf
              source={{ uri: pdfUri }}
              style={styles.pdf}
              enablePaging
              spacing={0}
              horizontal={false}
              fitPolicy={0}
              onError={error => {
                console.error("Preloaded authorization PDF render failed:", error);
                setPdfError("Unable to render authorization document.");
                setPdfUri(null);
              }}
            />
          ) : null}
        </View>
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
            label: "Continue to Review & Attest",
            onPress: handleContinue,
            icon: "arrow-forward",
            iconPosition: "right",
            disabled: documents.length === 0,
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
    gap: spacing.md,
  },
  selectorRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  selectorPill: {
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  selectorPillActive: {
    borderColor: colors.primary,
    backgroundColor: colors.infoLight,
  },
  selectorText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  selectorTextActive: {
    color: colors.primary,
  },
  viewerCard: {
    flex: 1,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  centeredState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    padding: spacing.lg,
  },
  stateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  pdf: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },
});

export default InspectorPreloadedAuthorizationReviewScreen;
