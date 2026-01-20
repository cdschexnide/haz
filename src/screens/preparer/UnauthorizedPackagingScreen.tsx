// src/screens/preparer/UnauthorizedPackagingScreen.tsx

import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import {
  ScreenHeader,
  ActionFooter,
  InfoBox,
  colors,
  spacing,
} from '@/components/ui';

export type UnauthorizedPackagingType = 'pop' | 'cylinder';

export interface UnauthorizedPackagingScreenProps {
  navigation: any;
  route: {
    params: {
      type: UnauthorizedPackagingType;
      enteredValue?: string;
      reason?: string;
    };
  };
}

const content: Record<UnauthorizedPackagingType, { title: string; message: string }> = {
  pop: {
    title: 'Unauthorized POP Marking',
    message: 'The POP marking entered is not authorized for this hazardous material. Please verify the packaging code and try again, or select a different packaging option.',
  },
  cylinder: {
    title: 'Unauthorized Cylinder Specification',
    message: 'The cylinder specification entered is not authorized for this hazardous material. Please verify the DOT specification and try again.',
  },
};

export const UnauthorizedPackagingScreen: React.FC<UnauthorizedPackagingScreenProps> = ({
  navigation,
  route,
}) => {
  const { type, enteredValue, reason } = route.params;
  const { title, message } = content[type];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title={title} onBack={() => navigation.goBack()} />

      <View style={styles.content}>
        <InfoBox variant="error" message={message} />

        {enteredValue && (
          <InfoBox
            variant="info"
            title="Entered Value"
            message={enteredValue}
          />
        )}

        {reason && (
          <InfoBox
            variant="warning"
            title="Reason"
            message={reason}
          />
        )}
      </View>

      <ActionFooter
        buttons={[
          {
            label: 'Go Back',
            onPress: () => navigation.goBack(),
          },
        ]}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    gap: spacing.md,
  },
});

export default UnauthorizedPackagingScreen;
