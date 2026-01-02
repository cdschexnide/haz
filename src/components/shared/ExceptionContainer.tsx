import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ExceptionContainerProps {
  item?: string;
  maxGrossWeight?: {
    lbs: number;
    kg: number;
  };
  isDisabled?: boolean;
  children?: React.ReactNode;
}

export const ExceptionContainer: React.FC<ExceptionContainerProps> = ({
  item,
  maxGrossWeight,
  isDisabled = false,
  children
}) => {
  return (
    <View style={[
      styles.exceptionContainer,
      isDisabled && styles.disabledExceptionContainer
    ]}>
      <Text style={[
        styles.exceptionLabel,
        isDisabled && styles.disabledExceptionLabel
      ]}>
        Exception:
      </Text>

      {item && (
        <Text style={[
          styles.exceptionItem,
          isDisabled && styles.disabledText
        ]}>
          Item: {item}
        </Text>
      )}

      {maxGrossWeight && (
        <Text style={[
          styles.exceptionWeight,
          isDisabled && styles.disabledText
        ]}>
          Max Weight: {maxGrossWeight.lbs} lbs / {maxGrossWeight.kg} kg
        </Text>
      )}

      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  exceptionContainer: {
    marginTop: 8,
    backgroundColor: '#FFF8E1', // Yellow background for normal state
    borderRadius: 6,
    padding: 8,
  },
  disabledExceptionContainer: {
    backgroundColor: '#FAFAFA', // Light gray for disabled state
    borderColor: '#EBEBEB',
    borderWidth: 1,
  },
  exceptionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800', // Orange for normal state
    marginBottom: 4,
  },
  disabledExceptionLabel: {
    color: '#9E9E9E', // Gray for disabled state
  },
  exceptionItem: {
    fontSize: 14,
    color: '#000000',
  },
  exceptionWeight: {
    fontSize: 14,
    color: '#000000',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});