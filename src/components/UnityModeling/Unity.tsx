import React, { useCallback, useEffect, useRef, useState } from "react";
import UnityView from "@azesmway/react-native-unity";
import { LayoutChangeEvent, Platform, StyleSheet, View } from "react-native";

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
  onUnityBridgeMessage?: (message: string) => void;
}

const UNITY_READY_FALLBACK_MS = 3000;
const RESIZE_RETRY_DELAYS_MS = [0, 120, 300, 700, 1300, 2200, 3500, 5000, 7000];
const DATA_RETRY_DELAYS_MS = [250, 700, 1400, 2400, 3600, 5200, 7000, 9000];
const FOCUS_RETRY_DELAYS_MS = [0, 120, 360, 750, 1300, 2000];

const UnityApp = ({
  requiredMarkings = [],
  requiredLabels = [],
  packageCode = "",
  packageType = "",
  shipmentData,
  isFullscreen = false,
  onUnityBridgeMessage,
}: UnityAppProps) => {
  const unityRef = useRef<UnityView>(null);
  const lastLayoutRef = useRef<{ width: number; height: number } | null>(null);
  const resizeBurstCleanupRef = useRef<(() => void) | null>(null);
  const [isUnityReady, setIsUnityReady] = useState(false);

  const postMessage = useCallback((method: string, payload: string) => {
    unityRef.current?.postMessage?.("ReactToUnity", method, payload);
  }, []);

  const scheduleBurst = useCallback(
    (callback: () => void, delays: number[]) => {
      const timers: ReturnType<typeof setTimeout>[] = delays.map(delay =>
        setTimeout(callback, delay)
      );

      return () => {
        timers.forEach(clearTimeout);
      };
    },
    []
  );

  const sendResize = useCallback(
    (width: number, height: number) => {
      if (width <= 0 || height <= 0) {
        return () => {};
      }

      const payload = JSON.stringify({ width, height });
      return scheduleBurst(
        () => postMessage("Resize", payload),
        RESIZE_RETRY_DELAYS_MS
      );
    },
    [postMessage, scheduleBurst]
  );

  const pushSceneData = useCallback(() => {
    postMessage("GetRequiredMarkings", JSON.stringify(requiredMarkings));
    postMessage("GetRequiredLabels", JSON.stringify(requiredLabels));
    postMessage(
      "GetPackageData",
      JSON.stringify({ code: packageCode || "", type: packageType || "" })
    );

    if (shipmentData) {
      postMessage("GetShipmentData", JSON.stringify(shipmentData));
    }
  }, [
    packageCode,
    packageType,
    postMessage,
    requiredLabels,
    requiredMarkings,
    shipmentData,
  ]);

  const refreshFocusAndResize = useCallback(() => {
    unityRef.current?.windowFocusChanged?.(true);
    unityRef.current?.resumeUnity?.();

    if (lastLayoutRef.current) {
      postMessage("Resize", JSON.stringify(lastLayoutRef.current));
    }
  }, [postMessage]);

  const resetResizeBurst = useCallback(
    (width: number, height: number) => {
      if (resizeBurstCleanupRef.current) {
        resizeBurstCleanupRef.current();
      }

      resizeBurstCleanupRef.current = sendResize(width, height);
    },
    [sendResize]
  );

  const handleUnityMessage = useCallback((result: any) => {
    const message = result?.nativeEvent?.message;
    if (message) {
      onUnityBridgeMessage?.(message);
      // Treat any Unity -> RN bridge message as proof the player is initialized.
      setIsUnityReady(true);
    }
  }, [onUnityBridgeMessage]);

  // Some builds do not emit a strict ready event; fallback keeps retries alive.
  useEffect(() => {
    setIsUnityReady(false);
    const timer = setTimeout(() => setIsUnityReady(true), UNITY_READY_FALLBACK_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    return () => {
      if (resizeBurstCleanupRef.current) {
        resizeBurstCleanupRef.current();
      }
    };
  }, []);

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout;
      if (width <= 0 || height <= 0) {
        return;
      }

      lastLayoutRef.current = { width, height };
      resetResizeBurst(width, height);
    },
    [resetResizeBurst]
  );

  // Replay the latest measured layout once Unity transitions to ready.
  useEffect(() => {
    if (!isUnityReady || !lastLayoutRef.current) {
      return;
    }

    const { width, height } = lastLayoutRef.current;
    return sendResize(width, height);
  }, [isUnityReady, sendResize]);

  // Force focus + resize on fullscreen transitions for reliable gesture input.
  useEffect(() => {
    const delays = isFullscreen ? FOCUS_RETRY_DELAYS_MS : [0, 400];
    return scheduleBurst(refreshFocusAndResize, delays);
  }, [isFullscreen, refreshFocusAndResize, scheduleBurst]);

  // Keep trying until Unity native libs are ready to accept bridge messages.
  useEffect(() => {
    return scheduleBurst(pushSceneData, DATA_RETRY_DELAYS_MS);
  }, [pushSceneData, scheduleBurst]);

  // Once bridge communication is confirmed, do a short immediate flush.
  useEffect(() => {
    if (!isUnityReady) {
      return;
    }

    return scheduleBurst(pushSceneData, [0, 250, 700]);
  }, [isUnityReady, pushSceneData, scheduleBurst]);

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <UnityView
        ref={unityRef}
        style={styles.unityView}
        onUnityMessage={handleUnityMessage}
        androidKeepPlayerMounted={Platform.OS === "android"}
        fullScreen={isFullscreen}
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
});

export default UnityApp;
