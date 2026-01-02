/**
 * ImageCropScreen - Crop interface for captured/selected images
 *
 * REDESIGNED: Uses react-native-gesture-handler + Reanimated for reliable,
 * smooth gesture handling. Each corner and move area has its own gesture
 * detector, eliminating hit detection issues.
 */

import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImageManipulator from "expo-image-manipulator";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  runOnJS,
  withTiming,
} from "react-native-reanimated";
import { CapturedImage } from "../types";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const HEADER_HEIGHT = 56;
const FOOTER_HEIGHT = 80;
const PADDING = 16;
const MIN_CROP_SIZE = 100;
const HANDLE_HIT_SIZE = 48; // Touch target size (Apple HIG minimum is 44)
const HANDLE_VISUAL_SIZE = 28; // Visual L-shape size

interface ImageCropScreenProps {
  image: CapturedImage;
  onCrop: (croppedImage: CapturedImage) => void;
  onSkip: () => void;
  onCancel: () => void;
  source: "camera" | "preview";
}

export function ImageCropScreen({
  image,
  onCrop,
  onSkip,
  onCancel,
  source,
}: ImageCropScreenProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageLayout, setImageLayout] = useState({
    displayWidth: 0,
    displayHeight: 0,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  });

  // Reanimated shared values for smooth 60fps gesture updates
  const cropX = useSharedValue(0);
  const cropY = useSharedValue(0);
  const cropWidth = useSharedValue(0);
  const cropHeight = useSharedValue(0);

  // Starting values for gesture (captured at gesture start)
  const startX = useSharedValue(0);
  const startY = useSharedValue(0);
  const startW = useSharedValue(0);
  const startH = useSharedValue(0);

  // Store display dimensions in shared values for worklet access
  const displayW = useSharedValue(0);
  const displayH = useSharedValue(0);

  // React state for final crop operation
  const [finalCropBox, setFinalCropBox] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });

  // Sync shared values to React state (called from gesture onEnd)
  const syncToState = useCallback(() => {
    setFinalCropBox({
      x: cropX.value,
      y: cropY.value,
      width: cropWidth.value,
      height: cropHeight.value,
    });
  }, [cropX, cropY, cropWidth, cropHeight]);

  // Calculate image display dimensions and initialize crop box
  useEffect(() => {
    const availableWidth = SCREEN_WIDTH - PADDING * 2;
    const availableHeight =
      SCREEN_HEIGHT - HEADER_HEIGHT - FOOTER_HEIGHT - PADDING * 2 - 60;

    const imageAspect = image.width / image.height;
    const containerAspect = availableWidth / availableHeight;

    let dw: number;
    let dh: number;

    if (imageAspect > containerAspect) {
      dw = availableWidth;
      dh = availableWidth / imageAspect;
    } else {
      dh = availableHeight;
      dw = availableHeight * imageAspect;
    }

    const scale = dw / image.width;
    const offsetX = (availableWidth - dw) / 2 + PADDING;
    const offsetY = (availableHeight - dh) / 2;

    setImageLayout({
      displayWidth: dw,
      displayHeight: dh,
      offsetX,
      offsetY,
      scale,
    });

    // Store in shared values for worklet access
    displayW.value = dw;
    displayH.value = dh;

    // Initialize crop box to 80% of image, centered
    const initialWidth = dw * 0.8;
    const initialHeight = dh * 0.8;
    const initialX = (dw - initialWidth) / 2;
    const initialY = (dh - initialHeight) / 2;

    cropX.value = initialX;
    cropY.value = initialY;
    cropWidth.value = initialWidth;
    cropHeight.value = initialHeight;

    setFinalCropBox({
      x: initialX,
      y: initialY,
      width: initialWidth,
      height: initialHeight,
    });
  }, [image.width, image.height, cropX, cropY, cropWidth, cropHeight, displayW, displayH]);

  // ============ GESTURE HANDLERS ============

  // Helper to capture starting position (called at gesture start)
  const captureStart = () => {
    "worklet";
    startX.value = cropX.value;
    startY.value = cropY.value;
    startW.value = cropWidth.value;
    startH.value = cropHeight.value;
  };

  // MOVE gesture (drag the crop box)
  const moveGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      captureStart();
    })
    .onUpdate((e) => {
      "worklet";
      const newX = Math.max(
        0,
        Math.min(displayW.value - startW.value, startX.value + e.translationX)
      );
      const newY = Math.max(
        0,
        Math.min(displayH.value - startH.value, startY.value + e.translationY)
      );
      cropX.value = newX;
      cropY.value = newY;
    })
    .onEnd(() => {
      "worklet";
      runOnJS(syncToState)();
    });

  // TOP-LEFT corner gesture
  const tlGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      captureStart();
    })
    .onUpdate((e) => {
      "worklet";
      // Moving TL corner: x increases, y increases -> width/height decrease
      // Constrain: x >= 0, width >= MIN_CROP_SIZE
      const maxDx = startW.value - MIN_CROP_SIZE;
      const minDx = -startX.value;
      const dx = Math.max(minDx, Math.min(maxDx, e.translationX));

      const maxDy = startH.value - MIN_CROP_SIZE;
      const minDy = -startY.value;
      const dy = Math.max(minDy, Math.min(maxDy, e.translationY));

      cropX.value = startX.value + dx;
      cropY.value = startY.value + dy;
      cropWidth.value = startW.value - dx;
      cropHeight.value = startH.value - dy;
    })
    .onEnd(() => {
      "worklet";
      runOnJS(syncToState)();
    });

  // TOP-RIGHT corner gesture
  const trGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      captureStart();
    })
    .onUpdate((e) => {
      "worklet";
      // Moving TR: x stays, width changes; y increases -> height decreases
      const maxWidth = displayW.value - startX.value;
      const newWidth = Math.max(
        MIN_CROP_SIZE,
        Math.min(maxWidth, startW.value + e.translationX)
      );

      const maxDy = startH.value - MIN_CROP_SIZE;
      const minDy = -startY.value;
      const dy = Math.max(minDy, Math.min(maxDy, e.translationY));

      cropY.value = startY.value + dy;
      cropWidth.value = newWidth;
      cropHeight.value = startH.value - dy;
    })
    .onEnd(() => {
      "worklet";
      runOnJS(syncToState)();
    });

  // BOTTOM-LEFT corner gesture
  const blGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      captureStart();
    })
    .onUpdate((e) => {
      "worklet";
      // Moving BL: x increases -> width decreases; height increases
      const maxDx = startW.value - MIN_CROP_SIZE;
      const minDx = -startX.value;
      const dx = Math.max(minDx, Math.min(maxDx, e.translationX));

      const maxHeight = displayH.value - startY.value;
      const newHeight = Math.max(
        MIN_CROP_SIZE,
        Math.min(maxHeight, startH.value + e.translationY)
      );

      cropX.value = startX.value + dx;
      cropWidth.value = startW.value - dx;
      cropHeight.value = newHeight;
    })
    .onEnd(() => {
      "worklet";
      runOnJS(syncToState)();
    });

  // BOTTOM-RIGHT corner gesture
  const brGesture = Gesture.Pan()
    .minDistance(0)
    .onStart(() => {
      captureStart();
    })
    .onUpdate((e) => {
      "worklet";
      // Moving BR: both width and height increase
      const maxWidth = displayW.value - startX.value;
      const maxHeight = displayH.value - startY.value;

      const newWidth = Math.max(
        MIN_CROP_SIZE,
        Math.min(maxWidth, startW.value + e.translationX)
      );
      const newHeight = Math.max(
        MIN_CROP_SIZE,
        Math.min(maxHeight, startH.value + e.translationY)
      );

      cropWidth.value = newWidth;
      cropHeight.value = newHeight;
    })
    .onEnd(() => {
      "worklet";
      runOnJS(syncToState)();
    });

  // ============ ANIMATED STYLES ============

  // Crop box border
  const cropBoxStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value,
    top: cropY.value,
    width: cropWidth.value,
    height: cropHeight.value,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  }));

  // Move area (center of crop box, excluding corners)
  const moveAreaStyle = useAnimatedStyle(() => {
    const inset = HANDLE_HIT_SIZE / 2;
    return {
      position: "absolute" as const,
      left: cropX.value + inset,
      top: cropY.value + inset,
      width: Math.max(0, cropWidth.value - inset * 2),
      height: Math.max(0, cropHeight.value - inset * 2),
    };
  });

  // Corner handle styles
  const tlHandleStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value - HANDLE_HIT_SIZE / 2,
    top: cropY.value - HANDLE_HIT_SIZE / 2,
    width: HANDLE_HIT_SIZE,
    height: HANDLE_HIT_SIZE,
    justifyContent: "flex-start" as const,
    alignItems: "flex-start" as const,
  }));

  const trHandleStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value + cropWidth.value - HANDLE_HIT_SIZE / 2,
    top: cropY.value - HANDLE_HIT_SIZE / 2,
    width: HANDLE_HIT_SIZE,
    height: HANDLE_HIT_SIZE,
    justifyContent: "flex-start" as const,
    alignItems: "flex-end" as const,
  }));

  const blHandleStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value - HANDLE_HIT_SIZE / 2,
    top: cropY.value + cropHeight.value - HANDLE_HIT_SIZE / 2,
    width: HANDLE_HIT_SIZE,
    height: HANDLE_HIT_SIZE,
    justifyContent: "flex-end" as const,
    alignItems: "flex-start" as const,
  }));

  const brHandleStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    left: cropX.value + cropWidth.value - HANDLE_HIT_SIZE / 2,
    top: cropY.value + cropHeight.value - HANDLE_HIT_SIZE / 2,
    width: HANDLE_HIT_SIZE,
    height: HANDLE_HIT_SIZE,
    justifyContent: "flex-end" as const,
    alignItems: "flex-end" as const,
  }));

  // Overlay styles (dark areas outside crop)
  const topOverlayStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: 0,
    left: 0,
    right: 0,
    height: Math.max(0, cropY.value),
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }));

  const bottomOverlayStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: cropY.value + cropHeight.value,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }));

  const leftOverlayStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: cropY.value,
    left: 0,
    width: Math.max(0, cropX.value),
    height: cropHeight.value,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }));

  const rightOverlayStyle = useAnimatedStyle(() => ({
    position: "absolute" as const,
    top: cropY.value,
    left: cropX.value + cropWidth.value,
    right: 0,
    height: cropHeight.value,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  }));

  // ============ ACTIONS ============

  const handleCrop = useCallback(async () => {
    setIsProcessing(true);

    try {
      const { scale } = imageLayout;

      // Use final synced state for crop
      const originX = Math.round(finalCropBox.x / scale);
      const originY = Math.round(finalCropBox.y / scale);
      const cw = Math.round(finalCropBox.width / scale);
      const ch = Math.round(finalCropBox.height / scale);

      const safeOriginX = Math.max(0, Math.min(originX, image.width - 1));
      const safeOriginY = Math.max(0, Math.min(originY, image.height - 1));
      const safeWidth = Math.min(cw, image.width - safeOriginX);
      const safeHeight = Math.min(ch, image.height - safeOriginY);

      const result = await ImageManipulator.manipulateAsync(
        image.uri,
        [
          {
            crop: {
              originX: safeOriginX,
              originY: safeOriginY,
              width: safeWidth,
              height: safeHeight,
            },
          },
        ],
        {
          compress: 0.8,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      );

      const croppedImage: CapturedImage = {
        uri: result.uri,
        width: result.width,
        height: result.height,
        timestamp: Date.now(),
      };

      onCrop(croppedImage);
    } catch (error) {
      console.error("Failed to crop image:", error);
      onSkip();
    } finally {
      setIsProcessing(false);
    }
  }, [finalCropBox, imageLayout, image, onCrop, onSkip]);

  const handleReset = useCallback(() => {
    const { displayWidth, displayHeight } = imageLayout;
    cropX.value = withTiming(0);
    cropY.value = withTiming(0);
    cropWidth.value = withTiming(displayWidth);
    cropHeight.value = withTiming(displayHeight);

    // Sync after animation
    setTimeout(() => {
      setFinalCropBox({
        x: 0,
        y: 0,
        width: displayWidth,
        height: displayHeight,
      });
    }, 300);
  }, [imageLayout, cropX, cropY, cropWidth, cropHeight]);

  const buttonLabels = {
    skip: source === "camera" ? "Use Original" : "Skip",
    crop: "Crop",
  };

  return (
    <GestureHandlerRootView style={styles.gestureRoot}>
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={onCancel}
          disabled={isProcessing}
        >
          <MaterialIcons name="close" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Crop Image</Text>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handleReset}
          disabled={isProcessing}
        >
          <MaterialIcons name="refresh" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Instructions */}
      <View style={styles.instructions}>
        <Text style={styles.instructionsText}>
          Drag to move • Drag corners to resize
        </Text>
      </View>

      {/* Image with Crop Overlay */}
      <View style={styles.imageContainer}>
        <View
          style={[
            styles.imageWrapper,
            {
              width: imageLayout.displayWidth,
              height: imageLayout.displayHeight,
            },
          ]}
        >
          {/* Original Image */}
          <Image
            source={{ uri: image.uri }}
            style={[
              styles.image,
              {
                width: imageLayout.displayWidth,
                height: imageLayout.displayHeight,
              },
            ]}
            resizeMode="contain"
          />

          {/* Dark overlays outside crop area */}
          <Animated.View style={topOverlayStyle} pointerEvents="none" />
          <Animated.View style={bottomOverlayStyle} pointerEvents="none" />
          <Animated.View style={leftOverlayStyle} pointerEvents="none" />
          <Animated.View style={rightOverlayStyle} pointerEvents="none" />

          {/* Crop box border with grid */}
          <Animated.View style={cropBoxStyle} pointerEvents="none">
            {/* Grid lines */}
            <View style={[styles.gridLine, styles.gridLineH1]} />
            <View style={[styles.gridLine, styles.gridLineH2]} />
            <View style={[styles.gridLine, styles.gridLineV1]} />
            <View style={[styles.gridLine, styles.gridLineV2]} />
          </Animated.View>

          {/* Move area (center) */}
          <GestureDetector gesture={moveGesture}>
            <Animated.View style={moveAreaStyle} />
          </GestureDetector>

          {/* Corner handles */}
          <GestureDetector gesture={tlGesture}>
            <Animated.View style={tlHandleStyle}>
              <View style={styles.handleVisual}>
                <View style={[styles.handleBar, styles.handleBarH]} />
                <View style={[styles.handleBar, styles.handleBarV]} />
              </View>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={trGesture}>
            <Animated.View style={trHandleStyle}>
              <View style={[styles.handleVisual, styles.handleVisualTR]}>
                <View style={[styles.handleBar, styles.handleBarH]} />
                <View style={[styles.handleBar, styles.handleBarV]} />
              </View>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={blGesture}>
            <Animated.View style={blHandleStyle}>
              <View style={[styles.handleVisual, styles.handleVisualBL]}>
                <View style={[styles.handleBar, styles.handleBarH]} />
                <View style={[styles.handleBar, styles.handleBarV]} />
              </View>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={brGesture}>
            <Animated.View style={brHandleStyle}>
              <View style={[styles.handleVisual, styles.handleVisualBR]}>
                <View style={[styles.handleBar, styles.handleBarH]} />
                <View style={[styles.handleBar, styles.handleBarV]} />
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.skipButton}
          onPress={onSkip}
          disabled={isProcessing}
        >
          <Text style={styles.skipButtonText}>{buttonLabels.skip}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.cropButton, isProcessing && styles.cropButtonDisabled]}
          onPress={handleCrop}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <MaterialIcons name="crop" size={20} color="#FFFFFF" />
              <Text style={styles.cropButtonText}>{buttonLabels.crop}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  gestureRoot: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: "#1C1C1E",
  },
  header: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#1C1C1E",
  },
  headerButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  instructions: {
    paddingVertical: 8,
    alignItems: "center",
  },
  instructionsText: {
    fontSize: 13,
    color: "#8E8E93",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: PADDING,
  },
  imageWrapper: {
    position: "relative",
    overflow: "visible",
  },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
  },
  gridLine: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  gridLineH1: {
    left: 0,
    right: 0,
    top: "33.33%",
    height: 1,
  },
  gridLineH2: {
    left: 0,
    right: 0,
    top: "66.66%",
    height: 1,
  },
  gridLineV1: {
    top: 0,
    bottom: 0,
    left: "33.33%",
    width: 1,
  },
  gridLineV2: {
    top: 0,
    bottom: 0,
    left: "66.66%",
    width: 1,
  },
  handleVisual: {
    width: HANDLE_VISUAL_SIZE,
    height: HANDLE_VISUAL_SIZE,
    position: "relative",
  },
  handleVisualTR: {
    transform: [{ scaleX: -1 }],
  },
  handleVisualBL: {
    transform: [{ scaleY: -1 }],
  },
  handleVisualBR: {
    transform: [{ scaleX: -1 }, { scaleY: -1 }],
  },
  handleBar: {
    position: "absolute",
    backgroundColor: "#FFFFFF",
  },
  handleBarH: {
    height: 4,
    width: HANDLE_VISUAL_SIZE,
    top: 0,
    left: 0,
  },
  handleBarV: {
    width: 4,
    height: HANDLE_VISUAL_SIZE,
    top: 0,
    left: 0,
  },
  footer: {
    height: FOOTER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    gap: 16,
    backgroundColor: "#1C1C1E",
  },
  skipButton: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#8E8E93",
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#8E8E93",
  },
  cropButton: {
    flex: 1,
    height: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    gap: 8,
  },
  cropButtonDisabled: {
    backgroundColor: "#4A4A4C",
  },
  cropButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});

export default ImageCropScreen;
