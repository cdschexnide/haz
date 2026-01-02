import React from "react";
import { View, TouchableOpacity, StyleSheet, Vibration } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export interface TappableSDDGFieldProps {
  fieldKey: string;
  fieldLabel: string;
  fieldValue: string;
  isFrustrated: boolean;
  isRecommended?: boolean;
  onPress: (fieldKey: string, fieldLabel: string, fieldValue: string) => void;
  children: React.ReactNode;
}

/**
 * Reusable wrapper component that makes SDDG form fields tappable for frustration entry.
 *
 * Visual States:
 * - Default: Subtle 1px dotted border indicating tappability
 * - Active: Light background overlay on press
 * - Frustrated: 3px solid red border + warning icon
 * - Recommended: Orange warning indicator
 */
const TappableSDDGField: React.FC<TappableSDDGFieldProps> = ({
  fieldKey,
  fieldLabel,
  fieldValue,
  isFrustrated,
  isRecommended = false,
  onPress,
  children,
}) => {
  const handlePress = () => {
    // Haptic feedback for tactile confirmation
    Vibration.vibrate(50);
    onPress(fieldKey, fieldLabel, fieldValue);
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.container,
        // Default state: subtle dotted border
        !isFrustrated && styles.defaultBorder,
        // Frustrated state: solid red border
        isFrustrated && styles.frustratedBorder,
        // Recommended frustration: orange indicator
        isRecommended && !isFrustrated && styles.recommendedBorder,
      ]}
    >
      {/* Tap indicator for default state */}
      {!isFrustrated && !isRecommended && (
        <View style={styles.tapIndicator}>
          <View style={styles.tapIconBackground}>
            <MaterialIcons name="touch-app" size={20} color="#007AFF" />
          </View>
        </View>
      )}

      {/* Frustrated overlay indicator */}
      {isFrustrated && (
        <View style={styles.frustratedOverlay}>
          <View style={styles.frustratedBadge}>
            <MaterialIcons name="warning" size={16} color="#FFFFFF" />
          </View>
        </View>
      )}

      {/* Recommended frustration indicator */}
      {isRecommended && !isFrustrated && (
        <View style={styles.recommendedIndicator}>
          <MaterialIcons name="error-outline" size={18} color="#F57C00" />
        </View>
      )}

      {/* Render the actual form field content */}
      <View style={isFrustrated && styles.frustratedContent}>{children}</View>
    </TouchableOpacity>
  );
};

export default React.memo(TappableSDDGField);

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  defaultBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#94A3B8",
    backgroundColor: "rgba(0, 122, 255, 0.02)",
    borderRadius: 6,
  },
  tapIndicator: {
    position: "absolute",
    top: 6,
    right: 6,
    zIndex: 5,
    opacity: 0.7,
  },
  tapIconBackground: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  frustratedBorder: {
    borderLeftWidth: 3,
    borderLeftColor: "#FF3B30",
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderTopColor: "#FF3B30",
    borderRightColor: "#FF3B30",
    borderBottomColor: "#FF3B30",
    borderRadius: 4,
    backgroundColor: "rgba(255, 59, 48, 0.05)",
  },
  recommendedBorder: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#F57C00",
    borderRadius: 4,
    backgroundColor: "rgba(255, 140, 0, 0.15)",
  },
  frustratedOverlay: {
    position: "absolute",
    top: -8,
    right: -8,
    zIndex: 10,
  },
  frustratedBadge: {
    backgroundColor: "#FF3B30",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  recommendedIndicator: {
    position: "absolute",
    top: 4,
    right: 4,
    zIndex: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 2,
  },
  frustratedContent: {
    opacity: 0.95,
  },
});
