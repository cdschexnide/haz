import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface SDDGRecommendedFrustrationBannerProps {
  message: string;
  onAccept: () => void;
  onDismiss: () => void;
}

/**
 * Warning banner component for displaying automated compliance check recommendations.
 * Shows above affected fields when automated checks detect potential issues.
 *
 * Used for:
 * - UN3508: Missing Wh rating
 * - UN2807: Missing handling instructions
 * - UN1845: Dry ice packaging check
 */
const SDDGRecommendedFrustrationBanner: React.FC<SDDGRecommendedFrustrationBannerProps> = ({
  message,
  onAccept,
  onDismiss,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="error-outline" size={24} color="#FF9500" />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>⚠️ RECOMMENDED FRUSTRATION</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <MaterialIcons name="warning" size={16} color="#FFFFFF" />
            <Text style={styles.acceptButtonText}>Apply Frustration</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
            <Text style={styles.dismissButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default SDDGRecommendedFrustrationBanner;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFF9F0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9500',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#FF9500',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginRight: 12,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF9500',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: '#1D1D1F',
    lineHeight: 20,
    marginBottom: 10,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  acceptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF9500',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    gap: 6,
  },
  acceptButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  dismissButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FF9500',
  },
  dismissButtonText: {
    color: '#FF9500',
    fontSize: 13,
    fontWeight: '600',
  },
});
