// src/components/preparer/VehicleLabelingNotice.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { InfoBox, SectionHeader, spacing } from '@/components/ui';

export const VehicleLabelingNotice: React.FC = () => {
  return (
    <View style={styles.container}>
      <SectionHeader title="Vehicle Shipment" />
      <View style={styles.content}>
        <InfoBox
          variant="info"
          message="Vehicles do not require labels or markings, unless crated and/or packaged."
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.md,
  },
});
