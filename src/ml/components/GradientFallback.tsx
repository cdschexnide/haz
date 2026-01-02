/**
 * Fallback components when expo-linear-gradient or expo-blur is not available
 * These provide graceful degradation
 */

import React from 'react';
import { View, ViewStyle, StyleProp, Platform } from 'react-native';

interface GradientProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

// Check if LinearGradient is available
let LinearGradientComponent: React.ComponentType<GradientProps> | null = null;
let BlurViewComponent: React.ComponentType<any> | null = null;

try {
  const gradient = require('expo-linear-gradient');
  LinearGradientComponent = gradient.LinearGradient;
} catch (e) {
  // expo-linear-gradient not available
}

try {
  const blur = require('expo-blur');
  BlurViewComponent = blur.BlurView;
} catch (e) {
  // expo-blur not available
}

/**
 * LinearGradient with fallback to solid color View
 */
export function LinearGradient({ colors, style, children, ...props }: GradientProps) {
  if (LinearGradientComponent) {
    return (
      <LinearGradientComponent colors={colors} style={style} {...props}>
        {children}
      </LinearGradientComponent>
    );
  }

  // Fallback: use the first color as solid background
  return (
    <View style={[style, { backgroundColor: colors[0] }]}>
      {children}
    </View>
  );
}

/**
 * BlurView with fallback to semi-transparent View
 */
interface BlurProps {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default';
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

export function BlurView({ intensity = 50, tint = 'default', style, children }: BlurProps) {
  // Use native BlurView only on iOS - Android has conflicts with Reanimated causing
  // "Trying to add unknown view tag" errors when navigating between screens
  if (BlurViewComponent && Platform.OS === 'ios') {
    return (
      <BlurViewComponent intensity={intensity} tint={tint} style={style}>
        {children}
      </BlurViewComponent>
    );
  }

  // Fallback: use semi-transparent background
  const backgroundColor = tint === 'dark'
    ? `rgba(0, 0, 0, ${Math.min(intensity / 100, 0.7)})`
    : tint === 'light'
    ? `rgba(255, 255, 255, ${Math.min(intensity / 100, 0.7)})`
    : `rgba(128, 128, 128, ${Math.min(intensity / 100, 0.5)})`;

  return (
    <View style={[style, { backgroundColor }]}>
      {children}
    </View>
  );
}

// Export availability flags
export const isLinearGradientAvailable = LinearGradientComponent !== null;
// BlurView is only "available" on iOS due to Android/Reanimated conflicts
export const isBlurViewAvailable = BlurViewComponent !== null && Platform.OS === 'ios';
