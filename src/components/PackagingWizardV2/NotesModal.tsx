import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Icon } from 'react-native-elements';

interface NotesModalProps {
  visible: boolean;
  title?: string;
  notes: string[];
  onDismiss: () => void;
  themeType?: 'warning' | 'info';
}

const theme = {
  colors: {
    primary: '#0066cc',
    warning: '#ffc107',
    text: {
      primary: '#212529',
      secondary: '#6c757d',
    },
    background: {
      card: '#ffffff',
    },
    border: '#dee2e6',
  },
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const NotesModal: React.FC<NotesModalProps> = ({
  visible,
  title = 'Important Notes',
  notes,
  onDismiss,
  themeType = 'warning',
}) => {
  const getColorScheme = () => {
    switch (themeType) {
      case 'info':
        return {
          headerBackground: '#e8f4fd',
          iconName: 'info',
          iconColor: '#0066cc',
          bulletColor: '#0066cc',
        };
      case 'warning':
      default:
        return {
          headerBackground: '#fff3cd',
          iconName: 'warning',
          iconColor: theme.colors.warning,
          bulletColor: theme.colors.warning,
        };
    }
  };

  const colorScheme = getColorScheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalContainer}>
          <View style={[styles.header, { backgroundColor: colorScheme.headerBackground }]}>
            <Icon name={colorScheme.iconName} color={colorScheme.iconColor} size={28} />
            <Text style={styles.headerText}>{title}</Text>
          </View>

          <ScrollView style={styles.contentScroll}>
            <View style={styles.notesContainer}>
              {notes.map((note, index) => (
                <View key={index} style={styles.noteItem}>
                  <View style={styles.bulletContainer}>
                    <View style={[styles.bullet, { backgroundColor: colorScheme.bulletColor }]} />
                  </View>
                  <Text style={styles.noteText}>{note}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={onDismiss}
              activeOpacity={0.8}
              accessibilityLabel="I understand these requirements"
              accessibilityRole="button"
            >
              <Text style={styles.dismissButtonText}>I Understand</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.lg,
  },
  modalContainer: {
    backgroundColor: theme.colors.background.card,
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text.primary,
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  contentScroll: {
    maxHeight: 400,
  },
  notesContainer: {
    padding: theme.spacing.lg,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: theme.spacing.lg,
  },
  bulletContainer: {
    marginTop: 6,
    marginRight: theme.spacing.md,
  },
  bullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  noteText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: theme.colors.text.primary,
  },
  footer: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  dismissButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default NotesModal;
