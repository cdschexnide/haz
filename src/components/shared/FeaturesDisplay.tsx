import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface FeaturesDisplayProps {
  features: string[];
  isDisabled?: boolean;
}

export const FeaturesDisplay: React.FC<FeaturesDisplayProps> = ({
  features,
  isDisabled = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={[
        styles.label,
        isDisabled && styles.disabledText
      ]}>
        Features:
      </Text>
      {features.map((feature, index) => (
        <View key={`feature-${index}`} style={styles.featureRow}>
          <Text style={[
            styles.bulletPoint,
            isDisabled && styles.disabledText
          ]}>
            •
          </Text>
          <Text style={[
            styles.featureText,
            isDisabled && styles.disabledText
          ]}>
            {feature}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6E6E6E',
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: 'row',
    marginVertical: 2,
    paddingLeft: 4,
  },
  bulletPoint: {
    fontSize: 15,
    color: '#000000',
    marginRight: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#000000',
    flex: 1,
  },
  disabledText: {
    color: '#ADADAD',
  },
});