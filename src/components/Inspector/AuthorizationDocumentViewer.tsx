import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
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

interface AuthorizationDocumentViewerProps {
  inspection: InspectorShipment;
  onClose: () => void;
}

const AUTH_TYPE_LABELS: Record<string, string> = {
  COE: "COE Document",
  CAA: "CAA Document",
  "DOT-SP": "DOT-SP Document",
};

const sanitizeFilenameSegment = (value: string): string =>
  value.replace(/[^a-zA-Z0-9]/g, "_");

export const AuthorizationDocumentViewer: React.FC<AuthorizationDocumentViewerProps> = ({
  inspection,
  onClose,
}) => {
  const [pdfUri, setPdfUri] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const tempUrisRef = useRef<string[]>([]);

  const ctx = inspection.inspectionContext;
  const authType = ctx?.specialAuthorizationType || null;
  const title = (authType && AUTH_TYPE_LABELS[authType]) || "Authorization Document";

  const getDocuments = useCallback(() => {
    if (!ctx || !authType) return [];
    if (authType === "COE") return ctx.coeAndCaaDocuments?.coeDocuments || [];
    if (authType === "CAA") return ctx.coeAndCaaDocuments?.caaDocuments || [];
    if (authType === "DOT-SP") return ctx.dotSpWaivers || [];
    return [];
  }, [authType, ctx]);

  useEffect(() => {
    let mounted = true;

    const preparePdf = async () => {
      setIsLoading(true);
      setError(null);
      setPdfUri(null);

      try {
        const documents = getDocuments();
        if (documents.length === 0) {
          if (mounted) setError("No authorization documents found.");
          return;
        }

        // Use the first document's base64 data (most common case: single document)
        const doc = documents[0] as { uri?: string; base64Data?: string };

        // Try file URI first
        if (doc.uri) {
          const fileInfo = await FileSystem.getInfoAsync(doc.uri);
          if (fileInfo.exists) {
            if (mounted) setPdfUri(doc.uri);
            return;
          }
        }

        // Fall back to base64 data
        if (doc.base64Data) {
          let base64 = doc.base64Data;
          if (base64.startsWith("data:")) {
            base64 = base64.split(",")[1] || base64;
          }

          const tmpPath = `${FileSystem.cacheDirectory}auth_doc_${Date.now()}.pdf`;
          await FileSystem.writeAsStringAsync(tmpPath, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });
          tempUrisRef.current.push(tmpPath);

          if (mounted) setPdfUri(tmpPath);
          return;
        }

        if (mounted) setError("Authorization document data is unavailable.");
      } catch (err) {
        console.error("Error preparing authorization document:", err);
        if (mounted) setError("Failed to load authorization document.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    preparePdf();

    return () => {
      mounted = false;
      tempUrisRef.current.forEach(uri => {
        FileSystem.deleteAsync(uri, { idempotent: true }).catch(() => {});
      });
      tempUrisRef.current = [];
    };
  }, [getDocuments]);

  const handleShare = useCallback(async () => {
    if (!pdfUri) return;

    setIsSharing(true);
    let namedUri: string | null = null;

    try {
      const tcnSegment = sanitizeFilenameSegment(inspection.tcn || "UNKNOWN_TCN");
      const dateSegment = new Date().toISOString().split("T")[0];
      const typeSegment = authType || "AUTH";
      const filename = `${typeSegment}_${tcnSegment}_${dateSegment}.pdf`;
      namedUri = `${FileSystem.cacheDirectory}${filename}`;

      await FileSystem.copyAsync({ from: pdfUri, to: namedUri });
      await Sharing.shareAsync(namedUri, {
        mimeType: "application/pdf",
        dialogTitle: `Share ${title}`,
        UTI: "com.adobe.pdf",
      });
    } catch (err) {
      console.error("Error sharing authorization document:", err);
      Alert.alert("Error", "Failed to share document.");
    } finally {
      setIsSharing(false);
      if (namedUri) {
        FileSystem.deleteAsync(namedUri, { idempotent: true }).catch(() => {});
      }
    }
  }, [authType, inspection.tcn, pdfUri, title]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.iconButton}>
          <MaterialIcons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity
          onPress={handleShare}
          style={[styles.shareButton, (isSharing || !pdfUri) && styles.shareButtonDisabled]}
          disabled={isSharing || !pdfUri}
        >
          {isSharing ? (
            <ActivityIndicator size="small" color={colors.white} />
          ) : (
            <Text style={styles.shareButtonText}>Share PDF</Text>
          )}
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {error && !isLoading && (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

      {pdfUri && !isLoading && (
        <Pdf
          source={{ uri: pdfUri }}
          style={styles.pdf}
          enablePaging={false}
          horizontal={false}
          fitPolicy={0}
          onError={err => {
            console.error("Error rendering authorization PDF:", err);
            setError("Unable to render document.");
            setPdfUri(null);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AuthorizationDocumentViewer;

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
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg,
  },
  errorText: {
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
  pdf: {
    flex: 1,
    width: "100%",
    backgroundColor: colors.background,
  },
});
