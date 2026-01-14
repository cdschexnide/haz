// src/components/ui/ConfirmationCard.tsx

import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, borderRadius, typography, shadows } from './theme';
import { Button } from './Button';

export interface ConfirmationCardProps {
  title: string;
  content: string | ReactNode;
  onAccept: () => void;
  onDecline: () => void;
  acceptLabel?: string;
  declineLabel?: string;
}

export const ConfirmationCard: React.FC<ConfirmationCardProps> = ({
  title,
  content,
  onAccept,
  onDecline,
  acceptLabel = 'Accept',
  declineLabel = 'Decline',
}) => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.divider} />
      <View style={styles.content}>
        {typeof content === 'string' ? (
          <Text style={styles.contentText}>{content}</Text>
        ) : (
          content
        )}
      </View>
      <View style={styles.buttonRow}>
        <Button
          label={declineLabel}
          onPress={onDecline}
          variant="destructive"
          style={styles.button}
        />
        <Button
          label={acceptLabel}
          onPress={onAccept}
          variant="primary"
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    ...shadows.medium,
    maxWidth: 400,
    width: '90%',
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  content: {
    marginBottom: spacing.xl,
  },
  contentText: {
    ...typography.body,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
});
