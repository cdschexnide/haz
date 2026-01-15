// src/components/ui/DocumentModal.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { MaterialIcons } from '@expo/vector-icons';
import { colors, spacing, typography, borderRadius } from './theme';

export interface DocumentModalTab {
  key: string;
  label: string;
  content: string; // HTML content
}

export interface DocumentModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  htmlContent?: string; // Used when no tabs
  tabs?: DocumentModalTab[];
  defaultTabKey?: string;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({
  visible,
  onClose,
  title,
  htmlContent,
  tabs,
  defaultTabKey,
}) => {
  const [activeTabKey, setActiveTabKey] = useState<string>(
    defaultTabKey || (tabs?.[0]?.key ?? '')
  );

  if (!visible) {
    return null;
  }

  const getHtmlContent = (): string => {
    if (tabs && tabs.length > 0) {
      const activeTab = tabs.find((tab) => tab.key === activeTabKey);
      return activeTab?.content ?? '';
    }
    return htmlContent ?? '';
  };

  const wrapHtmlContent = (content: string): string => {
    return `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              font-size: 16px;
              line-height: 1.5;
              color: #333;
              padding: 16px;
            }
            strong {
              color: #0b2e59;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>{title}</Text>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
              testID="close-button"
            >
              <MaterialIcons name="close" size={24} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Tab Bar */}
          {tabs && tabs.length > 0 && (
            <View style={styles.tabBar}>
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab.key}
                  style={[
                    styles.tab,
                    activeTabKey === tab.key && styles.activeTab,
                  ]}
                  onPress={() => setActiveTabKey(tab.key)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTabKey === tab.key && styles.activeTabText,
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>
            <WebView
              testID="document-webview"
              source={{ html: wrapHtmlContent(getHtmlContent()) }}
              style={styles.webview}
              scrollEnabled
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    width: '90%',
    height: '80%',
    padding: spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.md,
  },
  title: {
    ...typography.headerTitle,
    color: colors.textPrimary,
    flex: 1,
  },
  closeButton: {
    padding: spacing.xs,
  },
  tabBar: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  activeTabText: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    minHeight: 300,
  },
  webview: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
