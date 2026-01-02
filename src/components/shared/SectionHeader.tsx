import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SectionHeaderProps {
  title: string;
  isDisabled?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  isDisabled = false
}) => {
  return (
    <View style={styles.container}>
      <Text style={[
        styles.title,
        isDisabled && styles.disabledText
      ]}>
        {title}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  disabledText: {
    color: '#ADADAD',
  },
});