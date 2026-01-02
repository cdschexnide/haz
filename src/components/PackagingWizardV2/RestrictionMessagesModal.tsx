import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { Icon } from "react-native-elements";
import { PackagingCategory } from "@/types/packagingStructure";
import {
  BagIcon,
  DrumIcon,
  BarrelIcon,
  JerricanIcon,
  BoxIcon,
} from "./PackagingIcons";

interface RestrictionMessagesModalProps {
  visible: boolean;
  category: PackagingCategory | null;
  messages: string[];
  onDismiss: () => void;
}

const theme = {
  colors: {
    primary: "#0066cc",
    danger: "#dc3545",
    warning: "#ffc107",
    white: "#ffffff",
    lightGrey: "#f8f9fa",
    darkGrey: "#6c757d",
    text: "#212529",
    border: "#dee2e6",
  },
  spacing: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
};

const RestrictionMessagesModal: React.FC<RestrictionMessagesModalProps> = ({
  visible,
  category,
  messages,
  onDismiss,
}) => {
  if (!category) return null;

  const getCategoryIcon = () => {
    const iconColor = theme.colors.danger;
    const iconSize = 64;

    switch (category.type.toLowerCase()) {
      case "drums":
        return <DrumIcon size={iconSize} color={iconColor} />;
      case "barrels":
        return <BarrelIcon size={iconSize} color={iconColor} />;
      case "jerricans":
        return <JerricanIcon size={iconSize} color={iconColor} />;
      case "boxes":
        return <BoxIcon size={iconSize} color={iconColor} />;
      case "bags":
        return <BagIcon size={iconSize} color={iconColor} />;
      default:
        return <JerricanIcon size={iconSize} color={iconColor} />;
    }
  };

  const getCategoryName = () => {
    return category.type.charAt(0).toUpperCase() + category.type.slice(1);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View style={styles.iconContainer}>{getCategoryIcon()}</View>
            <Text style={styles.modalTitle}>
              {getCategoryName()} Not Available
            </Text>
            <Text style={styles.modalSubtitle}>
              This packaging category cannot be used for your material's packing
              group
            </Text>
          </View>

          {/* Restriction Messages */}
          <ScrollView style={styles.messagesContainer}>
            {messages.map((message, index) => (
              <View key={index} style={styles.messageRow}>
                <Icon
                  name="warning"
                  size={20}
                  color={theme.colors.warning}
                  style={styles.messageIcon}
                />
                <Text style={styles.messageText}>{message}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Dismiss Button */}
          <TouchableOpacity
            style={styles.dismissButton}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.dismissButtonText}>Got It</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default RestrictionMessagesModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  modalContent: {
    backgroundColor: theme.colors.white,
    borderRadius: 8,
    width: "100%",
    maxWidth: 400,
    maxHeight: "80%",
  },
  modalHeader: {
    alignItems: "center",
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconContainer: {
    marginBottom: theme.spacing.md,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: theme.spacing.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: theme.colors.darkGrey,
    textAlign: "center",
    lineHeight: 20,
  },
  messagesContainer: {
    padding: theme.spacing.lg,
    maxHeight: 300,
  },
  messageRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.md,
    backgroundColor: "#fff3cd",
    padding: theme.spacing.md,
    borderRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.warning,
  },
  messageIcon: {
    marginRight: theme.spacing.sm,
    marginTop: 2,
  },
  messageText: {
    flex: 1,
    fontSize: 14,
    color: "#856404",
    lineHeight: 20,
  },
  dismissButton: {
    backgroundColor: theme.colors.primary,
    margin: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: 4,
    alignItems: "center",
  },
  dismissButtonText: {
    color: theme.colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
});
