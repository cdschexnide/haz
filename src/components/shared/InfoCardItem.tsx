import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface InfoCardItemProps {
  label: string;
  value: string | React.ReactNode;
  isLast?: boolean;
  isDisabled?: boolean;
}

export const InfoCardItem: React.FC<InfoCardItemProps> = ({
  label,
  value,
  isLast = false,
  isDisabled = false
}) => {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text style={[
        styles.infoLabel,
        isDisabled && styles.disabledText
      ]}>
        {label}
      </Text>
      {typeof value === 'string' ? (
        <Text style={[
          styles.infoValue,
          isDisabled && styles.disabledText
        ]}>
          {value}
        </Text>
      ) : (
        value
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  infoRow: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E9E9EB',
  },
  infoLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: '#6E6E6E',
  },
  infoValue: {
    flex: 2,
    fontSize: 15,
    color: '#000000',
  },
  disabledText: {
    color: '#ADADAD',
  },
});