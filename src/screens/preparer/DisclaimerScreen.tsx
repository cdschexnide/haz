// src/screens/preparer/DisclaimerScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ConfirmationCard, colors, spacing } from '@/components/ui';

interface DisclaimerScreenProps {
  navigation: {
    navigate: (screen: string) => void;
  };
}

const DISCLAIMER_CONTENT = `HazPro is a support tool designed to assist in the preparation of hazardous materials shipments. It is not a substitute for proper training, certification, or professional judgment.

Users are responsible for ensuring all shipments comply with applicable regulations, including AFMAN 24-604 and other governing standards. Always verify information independently and consult qualified personnel when in doubt.`;

export const DisclaimerScreen: React.FC<DisclaimerScreenProps> = ({
  navigation,
}) => {
  const handleAccept = () => {
    navigation.navigate('ShipmentCreation');
  };

  const handleDecline = () => {
    navigation.navigate('PreparerHome');
  };

  return (
    <View style={styles.container}>
      <ConfirmationCard
        title="Important Disclaimer"
        content={DISCLAIMER_CONTENT}
        onAccept={handleAccept}
        onDecline={handleDecline}
        acceptLabel="Accept"
        declineLabel="Decline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
});

export default DisclaimerScreen;
