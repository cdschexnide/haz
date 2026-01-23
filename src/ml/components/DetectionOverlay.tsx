/**
 * DetectionOverlay component - SIMPLIFIED for Android compatibility
 */

import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';
import { Detection, ImageDetectionResult } from '../types';
import { getCategoryColor, formatClassName } from '../services/postprocess';

interface DetectionOverlayProps {
  result: ImageDetectionResult;
  maxHeight?: number;
}

export function DetectionOverlay({ result, maxHeight = 400 }: DetectionOverlayProps) {
  const { imageUri, imageWidth, imageHeight, detections } = result;

  const screenWidth = Dimensions.get('window').width - 32;
  const aspectRatio = imageWidth / imageHeight;

  let displayWidth = screenWidth;
  let displayHeight = screenWidth / aspectRatio;

  if (displayHeight > maxHeight) {
    displayHeight = maxHeight;
    displayWidth = maxHeight * aspectRatio;
  }

  const scaleX = displayWidth / imageWidth;
  const scaleY = displayHeight / imageHeight;

  return (
    <View style={[styles.container, { width: displayWidth, height: displayHeight }]}>
      <Image
        source={{ uri: imageUri }}
        style={[styles.image, { width: displayWidth, height: displayHeight }]}
        resizeMode="contain"
      />

      <View style={[styles.overlay, { width: displayWidth, height: displayHeight }]}>
        {detections.map((detection) => (
          <BoundingBoxView
            key={detection.id}
            detection={detection}
            scaleX={scaleX}
            scaleY={scaleY}
          />
        ))}
      </View>

      {detections.length > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {detections.length} label{detections.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

interface BoundingBoxViewProps {
  detection: Detection;
  scaleX: number;
  scaleY: number;
}

function BoundingBoxView({ detection, scaleX, scaleY }: BoundingBoxViewProps) {
  const { box, className, category, confidence } = detection;
  const color = getCategoryColor(category);

  const left = box.x * scaleX;
  const top = box.y * scaleY;
  const width = box.width * scaleX;
  const height = box.height * scaleY;

  const labelText = formatClassName(className);
  const labelBelow = top < 32;

  return (
    <View
      style={[
        styles.boundingBox,
        {
          left,
          top,
          width,
          height,
          borderColor: color,
        },
      ]}
    >
      <View
        style={[
          styles.labelContainer,
          labelBelow ? styles.labelBelow : styles.labelAbove,
          { backgroundColor: color },
        ]}
      >
        <Text style={styles.labelText}>
          {labelText}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignSelf: 'center',
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#1C1C1E',
  },
  image: {
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  boundingBox: {
    position: 'absolute',
    borderWidth: 2,
    borderRadius: 4,
  },
  labelContainer: {
    position: 'absolute',
    left: -2,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  labelAbove: {
    bottom: '100%',
    marginBottom: 4,
  },
  labelBelow: {
    top: '100%',
    marginTop: 4,
  },
  labelText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4,
  },
  confidenceBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 2,
  },
  confidenceText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  countBadge: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default DetectionOverlay;
