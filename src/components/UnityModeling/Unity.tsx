import React, { useCallback, useEffect, useRef, useState } from "react";
import UnityView from "@azesmway/react-native-unity";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";

export interface UnityShipmentData {
  tcn: string;
  fromDodaac: string;
  fromAddress: string;
  poe: string;
  pod: string;
  consigneeDodaac: string;
  consigneeAddress: string;
}

interface UnityAppProps {
  requiredMarkings?: unknown[];
  requiredLabels?: unknown[];
  packageCode?: string;
  packageType?: string;
  shipmentData?: UnityShipmentData;
  isFullscreen?: boolean;
}

const UNITY_READY_FALLBACK_MS = 800;
const SEND_DELAY_MS = 200;

const UnityApp = ({
  requiredMarkings = [],
  requiredLabels = [],
  packageCode = "",
  packageType = "",
  shipmentData,
  isFullscreen = false,
}: UnityAppProps) => {
  const unityRef = useRef<UnityView>(null);
  const [isUnityReady, setIsUnityReady] = useState(false);

  const postMessage = useCallback(
    (method: string, payload: string) => {
      unityRef.current?.postMessage?.("ReactToUnity", method, payload);
    },
    []
  );

  const handleUnityMessage = useCallback((result: any) => {
    const message = result?.nativeEvent?.message;
    if (message === "UnityReady" || message === "ready") {
      setIsUnityReady(true);
    }
  }, []);

  // Unity currently does not consistently emit a ready event.
  useEffect(() => {
    setIsUnityReady(false);
    const timer = setTimeout(() => setIsUnityReady(true), UNITY_READY_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, [isFullscreen]);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      if (!isUnityReady) {
        return;
      }
      const { width, height } = event.nativeEvent.layout;
      postMessage("Resize", JSON.stringify({ width, height }));
    },
    [isUnityReady, postMessage]
  );

  useEffect(() => {
    if (!isUnityReady) {
      return;
    }

    const timer = setTimeout(() => {
      if (requiredMarkings.length > 0) {
        postMessage("GetRequiredMarkings", JSON.stringify(requiredMarkings));
      }
      if (requiredLabels.length > 0) {
        postMessage("GetRequiredLabels", JSON.stringify(requiredLabels));
      }
      if (packageCode || packageType) {
        postMessage(
          "GetPackageData",
          JSON.stringify({ code: packageCode || "", type: packageType || "" })
        );
      }
      if (shipmentData) {
        postMessage("GetShipmentData", JSON.stringify(shipmentData));
      }
    }, SEND_DELAY_MS);

    return () => clearTimeout(timer);
  }, [
    isUnityReady,
    packageCode,
    packageType,
    postMessage,
    requiredLabels,
    requiredMarkings,
    shipmentData,
  ]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <UnityView
        ref={unityRef}
        style={[styles.unityView, isFullscreen && styles.fullscreenUnity]}
        onUnityMessage={handleUnityMessage}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  unityView: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  fullscreenUnity: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default UnityApp;
