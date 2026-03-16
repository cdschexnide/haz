import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Pdf from "react-native-pdf";
import { colors, spacing, borderRadius } from "../ui";
import { InspectorShipment } from "../../types/sddg";
import InspectorShippersDeclarationForm from "./InspectorShippersDeclarationForm";
import {
  cleanupInspectorDocumentTempUris,
  composeInspectorSddgPdf,
  getInspectorAuthorizationAttachmentContext,
} from "@/utils/inspectorSddgDocumentComposer";
import {
  getInspectorSddgFormDataFromInspection,
  InspectorSddgDocumentSource,
} from "@/utils/inspectorSddgDocumentSource";

interface SDDGImageViewerProps {
  inspection: InspectorShipment;
  onClose: () => void;
}

const sanitizeFilenameSegment = (value: string): string =>
  value.replace(/[^a-zA-Z0-9]/g, "_");

export const SDDGImageViewer: React.FC<SDDGImageViewerProps> = ({
  inspection,
  onClose,
}) => {
  const [documentSource, setDocumentSource] =
    useState<InspectorSddgDocumentSource | null>(null);
  const [isPreparingDocument, setIsPreparingDocument] = useState(false);
  const [mergedPdfUri, setMergedPdfUri] = useState<string | null>(null);
  const [prepareError, setPrepareError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const tempUrisRef = useRef<string[]>([]);

  const imageUri = useMemo(
    () => inspection.inspectionContext?.originalImageUri || null,
    [inspection.inspectionContext?.originalImageUri]
  );
  const authorizationContext = useMemo(
    () => getInspectorAuthorizationAttachmentContext(inspection),
    [inspection]
  );
  const digitalFormData = useMemo(
    () => getInspectorSddgFormDataFromInspection(inspection),
    [inspection]
  );
  const hasDigitalDocument = digitalFormData !== null;
  const hasAttachments =
    authorizationContext.isAttested && authorizationContext.attachments.length > 0;

  const cleanupTempUris = useCallback(async () => {
    const uris = [...tempUrisRef.current];
    tempUrisRef.current = [];
    await cleanupInspectorDocumentTempUris(uris);
  }, []);

  useEffect(() => {
    let mounted = true;

    const prepareDocument = async () => {
      setPrepareError(null);
      setMergedPdfUri(null);
      setDocumentSource(null);
      await cleanupTempUris();

      try {
        let resolvedSource: InspectorSddgDocumentSource = "none";

        if (imageUri) {
          const fileInfo = await FileSystem.getInfoAsync(imageUri);
          if (fileInfo.exists) {
            resolvedSource = "image";
          } else if (hasDigitalDocument) {
            resolvedSource = "digital";
            if (mounted) {
              setPrepareError(
                "Original SDDG image not found. Showing generated digital SDDG."
              );
            }
          }
        } else if (hasDigitalDocument) {
          resolvedSource = "digital";
        }

        if (!mounted) return;
        setDocumentSource(resolvedSource);

        if (resolvedSource !== "image" || !hasAttachments) {
          return;
        }

        setIsPreparingDocument(true);
        const composed = await composeInspectorSddgPdf(inspection);
        tempUrisRef.current.push(...composed.tempUris);

        if (composed.warnings.length > 0) {
          if (mounted) {
            setPrepareError(composed.warnings.join("\n"));
          }
        }

        if (composed.includesAuthAttachments && mounted) {
          setMergedPdfUri(composed.pdfUri);
        }
      } catch (error) {
        console.error("Error preparing merged SDDG document:", error);
        if (mounted) {
          if (hasDigitalDocument) {
            setDocumentSource("digital");
            setPrepareError(
              "Original SDDG image unavailable. Showing generated digital SDDG."
            );
          } else {
            setDocumentSource("none");
            setPrepareError("Unable to load SDDG document.");
          }
        }
      } finally {
        if (mounted) {
          setIsPreparingDocument(false);
        }
      }
    };

    prepareDocument();

    return () => {
      mounted = false;
      cleanupTempUris();
    };
  }, [
    cleanupTempUris,
    hasAttachments,
    hasDigitalDocument,
    imageUri,
    inspection,
  ]);

  const handleSharePdf = useCallback(async () => {
    if (!documentSource || documentSource === "none") {
      Alert.alert("Not Available", "SDDG document not available.");
      return;
    }

    setIsSharing(true);
    let composeResult:
      | Awaited<ReturnType<typeof composeInspectorSddgPdf>>
      | null = null;
    let pdfUri: string | null = mergedPdfUri;
    let namedUri: string | null = null;

    try {
      if (!pdfUri) {
        composeResult = await composeInspectorSddgPdf(inspection);
        tempUrisRef.current.push(...composeResult.tempUris);
        pdfUri = composeResult.pdfUri;
      }

      const tcnSegment = sanitizeFilenameSegment(inspection.tcn || "UNKNOWN_TCN");
      const dateSegment = new Date().toISOString().split("T")[0];
      const includesAuth = mergedPdfUri || composeResult?.includesAuthAttachments;
      const filename = includesAuth
        ? `SDDG_${tcnSegment}_WITH_AUTH_${dateSegment}.pdf`
        : `SDDG_${tcnSegment}_${dateSegment}.pdf`;
      namedUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.copyAsync({ from: pdfUri, to: namedUri });
      await Sharing.shareAsync(namedUri, {
        mimeType: "application/pdf",
        dialogTitle: "Share SDDG Document",
        UTI: "com.adobe.pdf",
      });
    } catch (error) {
      console.error("Error sharing SDDG PDF:", error);
      Alert.alert("Error", "Failed to generate or share PDF.");
    } finally {
      setIsSharing(false);
    }
  }, [documentSource, inspection, inspection.tcn, mergedPdfUri]);

  const renderUnavailableState = () => (
    <View style={styles.unavailableContainer}>
      <Text style={styles.unavailableTitle}>SDDG document not available</Text>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>Close</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>SDDG Document</Text>
        <TouchableOpacity
          onPress={handleSharePdf}
          style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
          disabled={isSharing || !documentSource || documentSource === "none"}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.shareButtonText}>Share PDF</Text>
          )}
        </TouchableOpacity>
      </View>

      {documentSource === null && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {documentSource === "none" && renderUnavailableState()}

      {(documentSource === "image" || documentSource === "digital") && (
        <>
          {documentSource === "digital" && (
            <View style={styles.banner}>
              <MaterialIcons
                name="description"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.bannerText}>
                Showing generated digital SDDG (no uploaded source image).
              </Text>
            </View>
          )}

          {hasAttachments && (
            <View style={styles.banner}>
              <MaterialIcons
                name="attach-file"
                size={16}
                color={colors.textSecondary}
              />
              <Text style={styles.bannerText}>
                {documentSource === "digital"
                  ? "Shared PDF will include attested authorization attachment(s)."
                  : mergedPdfUri
                  ? "Showing SDDG with appended authorization document(s)."
                  : isPreparingDocument
                  ? "Preparing SDDG with appended authorization document(s)..."
                  : "Showing SDDG image only."}
              </Text>
            </View>
          )}

          {prepareError && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{prepareError}</Text>
            </View>
          )}

          {isPreparingDocument && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {!isPreparingDocument && mergedPdfUri ? (
            <Pdf
              source={{ uri: mergedPdfUri }}
              style={styles.pdf}
              enablePaging={false}
              horizontal={false}
              fitPolicy={0}
              onError={error => {
                console.error("Error rendering merged PDF:", error);
                setPrepareError(
                  "Unable to render merged PDF. Showing SDDG image only."
                );
                setMergedPdfUri(null);
              }}
            />
          ) : documentSource === "digital" && digitalFormData ? (
            <ScrollView
              style={styles.digitalViewer}
              contentContainerStyle={styles.digitalViewerContent}
              showsVerticalScrollIndicator
            >
              <InspectorShippersDeclarationForm extractedData={digitalFormData} />
            </ScrollView>
          ) : imageUri && imageUri.toLowerCase().endsWith(".pdf") ? (
            <Pdf
              source={{ uri: imageUri }}
              style={styles.pdf}
              enablePaging={false}
              horizontal={false}
              fitPolicy={0}
              onError={error => {
                console.error("Error rendering SDDG PDF:", error);
                setPrepareError("Unable to render SDDG document.");
              }}
            />
          ) : (
            imageUri && (
              <ScrollView
                style={styles.viewer}
                contentContainerStyle={styles.viewerContent}
                maximumZoomScale={3}
                minimumZoomScale={1}
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
              >
                <Image
                  source={{ uri: imageUri }}
                  style={styles.image}
                  resizeMode="contain"
                />
              </ScrollView>
            )
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default SDDGImageViewer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.surface,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    textAlign: "center",
  },
  shareButton: {
    minWidth: 84,
    height: 36,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  shareButtonDisabled: {
    opacity: 0.7,
  },
  shareButtonText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "700",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "#EEF4FF",
  },
  bannerText: {
    flex: 1,
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  errorBanner: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: "#FFF4E5",
  },
  errorBannerText: {
    fontSize: 12,
    color: "#8C4A00",
    lineHeight: 17,
  },
  viewer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewerContent: {
    padding: spacing.md,
    alignItems: "center",
  },
  digitalViewer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  digitalViewerContent: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  image: {
    width: "100%",
    minHeight: 500,
  },
  pdf: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },
  unavailableContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  unavailableTitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  closeButton: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.primary,
  },
  closeButtonText: {
    color: colors.white,
    fontWeight: "700",
  },
});
