import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { InfoCardItem } from './InfoCardItem';

interface DimensionDisplayProps {
  dimensions: any;
}

export const DimensionDisplay: React.FC<DimensionDisplayProps> = ({ dimensions }) => {
  const dimensionItems = [];

  if (dimensions.length) {
    dimensionItems.push(
      <InfoCardItem
        key="length"
        label="Length"
        value={`${dimensions.length?.inches || ''} in${dimensions.length?.centimeters ? ` / ${dimensions.length.centimeters} cm` : ''}`}
      />
    );
  }

  if (dimensions.width) {
    dimensionItems.push(
      <InfoCardItem
        key="width"
        label="Width"
        value={`${dimensions.width?.inches || ''} in${dimensions.width?.centimeters ? ` / ${dimensions.width.centimeters} cm` : ''}`}
      />
    );
  }

  if (dimensions.height) {
    dimensionItems.push(
      <InfoCardItem
        key="height"
        label="Height"
        value={`${dimensions.height?.inches || ''} in${dimensions.height?.centimeters ? ` / ${dimensions.height.centimeters} cm` : ''}`}
      />
    );
  }

  if (dimensions.diameter) {
    dimensionItems.push(
      <InfoCardItem
        key="diameter"
        label="Diameter"
        value={`${dimensions.diameter?.inches || ''} in${dimensions.diameter?.centimeters ? ` / ${dimensions.diameter.centimeters} cm` : ''}`}
      />
    );
  }

  return (
    <View>
      {dimensionItems.length > 0 ? (
        dimensionItems
      ) : (
        <Text style={styles.noDataText}>No dimensions specified</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  noDataText: {
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
});