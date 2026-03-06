import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { captureRef } from "react-native-view-shot";
import * as FileSystem from "expo-file-system";

const STAMP_POSITION = {
  top: "28%",
  left: "62%",
  width: "30%",
} as const;

const STAMP_FONT_SCALE = 0.018;
const MAX_IMAGE_DIMENSION = 2048;
export const STAMP_TIMEOUT_MS = 10000;

export interface StampInspectorInfo {
  inspectorName: string;
  inspectorRank: string | null;
  inspectorTitle: string;
}

export interface SddgStampOverlayHandle {
  stamp: (
    imageUri: string,
    inspector: StampInspectorInfo,
    date: Date
  ) => Promise<string | null>;
}

export function scaleToMax(
  width: number,
  height: number,
  maxDimension: number = MAX_IMAGE_DIMENSION
): { width: number; height: number } {
  if (width <= maxDimension && height <= maxDimension) {
    return { width, height };
  }

  const scale = maxDimension / Math.max(width, height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale)),
  };
}

export function buildStampLines(
  inspector: StampInspectorInfo,
  date: Date
): { line1: string; line2: string } {
  const rankPrefix = inspector.inspectorRank ? `${inspector.inspectorRank} ` : "";
  const line1 = `Inspected by ${rankPrefix}${inspector.inspectorName}`;
  const formattedDate = date.toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "2-digit",
  });
  const line2 = `${inspector.inspectorTitle} Date: ${formattedDate}`;
  return { line1, line2 };
}

export const SddgStampOverlay = forwardRef<SddgStampOverlayHandle, {}>(
  (_props, ref) => {
    const viewRef = useRef<View>(null);
    const resolveRef = useRef<((uri: string | null) => void) | null>(null);
    const isMountedRef = useRef(true);

    const [imageUri, setImageUri] = useState<string | null>(null);
    const [renderDims, setRenderDims] = useState<{ width: number; height: number } | null>(null);
    const [stampText, setStampText] = useState<{ line1: string; line2: string } | null>(null);

    const clearRenderState = useCallback(() => {
      if (!isMountedRef.current) {
        return;
      }
      setImageUri(null);
      setRenderDims(null);
      setStampText(null);
    }, []);

    const resolveAndReset = useCallback(
      (uri: string | null) => {
        const resolve = resolveRef.current;
        resolveRef.current = null;
        resolve?.(uri);
        clearRenderState();
      },
      [clearRenderState]
    );

    const handleImageLoad = useCallback(() => {
      requestAnimationFrame(async () => {
        try {
          if (!viewRef.current || !renderDims) {
            console.error("[SddgStamp] viewRef/renderDims not available for capture");
            resolveAndReset(null);
            return;
          }

          const capturedUri = await captureRef(viewRef.current, {
            format: "jpg",
            quality: 0.92,
            width: renderDims.width,
            height: renderDims.height,
          });

          const dir = `${FileSystem.documentDirectory}sddg_images/`;
          const dirInfo = await FileSystem.getInfoAsync(dir);
          if (!dirInfo.exists) {
            await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
          }

          const destUri = `${dir}sddg_stamped_${Date.now()}.jpg`;
          await FileSystem.moveAsync({ from: capturedUri, to: destUri });
          resolveAndReset(destUri);
        } catch (error) {
          console.error("[SddgStamp] Capture failed:", error);
          resolveAndReset(null);
        }
      });
    }, [renderDims, resolveAndReset]);

    const handleImageError = useCallback(() => {
      console.error("[SddgStamp] Image failed to load for stamping");
      resolveAndReset(null);
    }, [resolveAndReset]);

    useImperativeHandle(
      ref,
      () => ({
        stamp: (uri: string, inspector: StampInspectorInfo, date: Date) => {
          return new Promise<string | null>(resolve => {
            if (resolveRef.current) {
              resolveRef.current(null);
            }
            resolveRef.current = resolve;

            const { line1, line2 } = buildStampLines(inspector, date);
            Image.getSize(
              uri,
              (width, height) => {
                const scaled = scaleToMax(width, height);
                setRenderDims(scaled);
                setStampText({ line1, line2 });
                setImageUri(uri);
              },
              error => {
                console.error("[SddgStamp] Failed to get image size:", error);
                resolveAndReset(null);
              }
            );
          });
        },
      }),
      [resolveAndReset]
    );

    useEffect(() => {
      return () => {
        isMountedRef.current = false;
        if (resolveRef.current) {
          resolveRef.current(null);
          resolveRef.current = null;
        }
      };
    }, []);

    if (!imageUri || !renderDims || !stampText) {
      return <View style={styles.offscreen} />;
    }

    const fontSize = Math.max(10, Math.round(renderDims.width * STAMP_FONT_SCALE));

    return (
      <View style={styles.offscreen}>
        <View
          ref={viewRef}
          style={{ width: renderDims.width, height: renderDims.height }}
          collapsable={false}
        >
          <Image
            source={{ uri: imageUri }}
            style={{ width: renderDims.width, height: renderDims.height }}
            resizeMode="cover"
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
          <View
            style={[
              styles.stampContainer,
              {
                top: STAMP_POSITION.top,
                left: STAMP_POSITION.left,
                width: STAMP_POSITION.width,
              },
            ]}
          >
            <Text style={[styles.stampText, { fontSize }]}>{stampText.line1}</Text>
            <Text style={[styles.stampText, { fontSize }]}>{stampText.line2}</Text>
          </View>
        </View>
      </View>
    );
  }
);

SddgStampOverlay.displayName = "SddgStampOverlay";

const styles = StyleSheet.create({
  offscreen: {
    position: "absolute",
    left: -9999,
    top: -9999,
    opacity: 0,
  },
  stampContainer: {
    position: "absolute",
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  stampText: {
    color: "#1a1a1a",
    fontWeight: "600",
  },
});
