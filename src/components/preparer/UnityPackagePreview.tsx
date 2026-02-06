import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import UnityApp, { UnityShipmentData } from "@/components/UnityModeling/Unity";
import { RequiredLabel } from "@/utils/labelingRequirements";
import { RequiredMarking } from "@/utils/markingRequirements";
import { colors, spacing } from "@/components/ui";

interface UnityPackagePreviewProps {
  requiredMarkings: readonly RequiredMarking[];
  requiredLabels: readonly RequiredLabel[];
  packageCode?: string;
  packageType?: string;
  shipmentData?: UnityShipmentData;
}

export const UnityPackagePreview: React.FC<UnityPackagePreviewProps> = ({
  requiredMarkings,
  requiredLabels,
  packageCode,
  packageType,
  shipmentData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [shouldRenderFullscreenUnity, setShouldRenderFullscreenUnity] =
    useState(false);
  const [isUnityLoading, setIsUnityLoading] = useState(false);
  const [isMiniLoading, setIsMiniLoading] = useState(false);
  const [unityKey, setUnityKey] = useState(0);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setIsUnityLoading(true);
    setUnityKey(prev => prev + 1);

    setTimeout(() => {
      setShouldRenderFullscreenUnity(true);
      setTimeout(() => {
        setIsUnityLoading(false);
      }, 1000);
    }, 150);
  }, []);

  const handleClose = useCallback(() => {
    setShouldRenderFullscreenUnity(false);
    setIsUnityLoading(false);
    setIsMiniLoading(true);

    setTimeout(() => {
      setIsExpanded(false);
      setTimeout(() => {
        setIsMiniLoading(false);
      }, 1000);
    }, 150);
  }, []);

  useEffect(() => {
    if (!isExpanded) {
      setShouldRenderFullscreenUnity(false);
    }
  }, [isExpanded]);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>3D Package Preview</Text>
      </View>

      <View style={styles.unityContainer} testID="unity-preview">
        {isMiniLoading && (
          <View style={styles.miniLoadingOverlay}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.miniLoadingText}>Loading...</Text>
          </View>
        )}

        <View style={[styles.unityContent, isMiniLoading && styles.hiddenContent]}>
          <UnityApp
            key={`mini-unity-${unityKey}`}
            requiredMarkings={requiredMarkings}
            requiredLabels={requiredLabels}
            packageCode={packageCode}
            packageType={packageType}
            isFullscreen={false}
            shipmentData={shipmentData}
          />
        </View>

        {!isMiniLoading && (
          <TouchableOpacity
            testID="unity-expand-overlay"
            style={styles.unityOverlay}
            activeOpacity={1}
            onPress={handleExpand}
          />
        )}
      </View>

      <Modal
        visible={isExpanded}
        transparent={false}
        animationType="fade"
        onRequestClose={handleClose}
        hardwareAccelerated={true}
        statusBarTranslucent={true}
      >
        <View style={styles.fullscreenUnityWrapper}>
          <TouchableOpacity
            testID="unity-close-button"
            onPress={handleClose}
            style={styles.closeButtonLarge}
          >
            <Ionicons name="close" size={32} color="#fff" />
          </TouchableOpacity>

          {isUnityLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.loadingText}>Loading 3D View...</Text>
            </View>
          )}

          {shouldRenderFullscreenUnity && (
            <View
              style={[
                styles.fullscreenUnityContent,
                isUnityLoading && styles.hiddenContent,
              ]}
            >
              <UnityApp
                key={`fullscreen-unity-${unityKey}`}
                requiredMarkings={requiredMarkings}
                requiredLabels={requiredLabels}
                packageCode={packageCode}
                packageType={packageType}
                isFullscreen={true}
                shipmentData={shipmentData}
              />
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  headerRow: {
    marginBottom: spacing.sm,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
  },
  unityContainer: {
    width: "100%",
    height: 260,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    backgroundColor: colors.surface,
  },
  unityContent: {
    flex: 1,
  },
  unityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  fullscreenUnityWrapper: {
    flex: 1,
    backgroundColor: "black",
    width: "100%",
    height: "100%",
  },
  fullscreenUnityContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  closeButtonLarge: {
    position: "absolute",
    top: 40,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  miniLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.95)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
    borderRadius: 10,
  },
  miniLoadingText: {
    color: colors.primary,
    fontSize: 16,
    marginTop: 12,
    fontWeight: "600",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  loadingText: {
    color: "#fff",
    fontSize: 18,
    marginTop: 12,
  },
  hiddenContent: {
    opacity: 0,
  },
});

export default UnityPackagePreview;
