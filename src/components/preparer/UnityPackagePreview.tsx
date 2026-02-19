import React, { useCallback, useEffect } from "react";
import {
  ActivityIndicator,
  BackHandler,
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
  unavailableMessage?: string;
}

export const UnityPackagePreview: React.FC<UnityPackagePreviewProps> = ({
  requiredMarkings,
  requiredLabels,
  packageCode,
  packageType,
  shipmentData,
  unavailableMessage,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [isFullscreenStable, setIsFullscreenStable] = React.useState(false);

  const handleExpand = useCallback(() => {
    setIsExpanded(true);
    setIsFullscreenStable(false);
  }, []);

  const handleClose = useCallback(() => {
    setIsExpanded(false);
    setIsFullscreenStable(false);
  }, []);

  const handleFullscreenUnityMessage = useCallback((message: string) => {
    if (message.toLowerCase().includes("canvas resized")) {
      setIsFullscreenStable(true);
    }
  }, []);

  // Android hardware back button closes fullscreen
  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      handleClose();
      return true;
    });

    return () => sub.remove();
  }, [isExpanded, handleClose]);

  // Fallback so fullscreen doesn't stay blocked if Unity doesn't emit resize logs.
  useEffect(() => {
    if (!isExpanded || isFullscreenStable) {
      return;
    }

    const timer = setTimeout(() => {
      setIsFullscreenStable(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [isExpanded, isFullscreenStable]);

  if (unavailableMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>3D Package Preview</Text>
        </View>
        <View style={styles.unityContainer} testID="unity-preview">
          <View style={styles.unavailableContainer}>
            <Text style={styles.unavailableText}>{unavailableMessage}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>3D Package Preview</Text>
      </View>

      {!isExpanded && (
        <View style={styles.unityContainer} testID="unity-preview">
          <UnityApp
            requiredMarkings={requiredMarkings}
            requiredLabels={requiredLabels}
            packageCode={packageCode}
            packageType={packageType}
            isFullscreen={false}
            shipmentData={shipmentData}
          />

          <TouchableOpacity
            testID="unity-expand-overlay"
            style={styles.unityOverlay}
            activeOpacity={1}
            onPress={handleExpand}
          />
        </View>
      )}

      <Modal
        visible={isExpanded}
        transparent={false}
        animationType="fade"
        onRequestClose={handleClose}
        hardwareAccelerated
        statusBarTranslucent={false}
      >
        <View style={styles.fullscreenUnityWrapper}>
          <View style={styles.closeButtonContainer} pointerEvents="box-none">
            <TouchableOpacity
              testID="unity-close-button"
              onPress={handleClose}
              style={styles.closeButtonLarge}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.fullscreenUnityContent}>
            <UnityApp
              requiredMarkings={requiredMarkings}
              requiredLabels={requiredLabels}
              packageCode={packageCode}
              packageType={packageType}
              isFullscreen
              shipmentData={shipmentData}
              onUnityBridgeMessage={handleFullscreenUnityMessage}
            />
          </View>

          {!isFullscreenStable && (
            <View style={styles.fullscreenLoadingOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.fullscreenLoadingText}>Preparing 3D View...</Text>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.md,
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
    flex: 1,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    position: "relative",
    backgroundColor: colors.surface,
  },
  unityOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    zIndex: 2,
  },
  unavailableContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: spacing.lg,
  },
  unavailableText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textSecondary,
    textAlign: "center",
  },
  fullscreenUnityWrapper: {
    flex: 1,
    backgroundColor: "black",
  },
  fullscreenUnityContent: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  closeButtonContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  closeButtonLarge: {
    alignSelf: "flex-end",
    marginTop: 40,
    marginRight: 20,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },
  fullscreenLoadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  fullscreenLoadingText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default UnityPackagePreview;
