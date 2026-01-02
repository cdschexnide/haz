import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

interface PackagingTypeCardProps {
  type: string;
  label: string;
  description: string;
  innerRequired: boolean;
  noteCount?: number;
  selected: boolean;
  disabled?: boolean;
  disabledReason?: string;
  onPress: () => void;
}

const theme = {
  colors: {
    primary: "#0066cc",
    primaryLight: "#e6f0ff",
    white: "#ffffff",
    border: "#dee2e6",
    danger: "#dc3545",
    warning: "#ffc107",
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      muted: "#999999",
      disabled: "#adb5bd",
    },
    background: {
      card: "#ffffff",
      disabled: "#f5f5f5",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
};

const PackagingTypeCard: React.FC<PackagingTypeCardProps> = ({
  type,
  label,
  description,
  innerRequired,
  noteCount = 0,
  selected,
  disabled = false,
  disabledReason,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        selected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={disabled ? undefined : onPress}
      activeOpacity={disabled ? 1 : 0.8}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={`${label}: ${description}${disabled ? ` - Not permitted: ${disabledReason}` : ""}`}
    >
      <View style={styles.cardContent}>
        <View style={styles.mainContent}>
          <View style={styles.labelRow}>
            <Text
              style={[
                styles.label,
                selected && styles.selectedText,
                disabled && styles.disabledText,
              ]}
            >
              {label}
            </Text>
            {disabled && (
              <View style={styles.prohibitedBadge}>
                <Icon
                  name="block"
                  color={theme.colors.danger}
                  size={18}
                  style={styles.prohibitedIcon}
                />
                <Text style={styles.prohibitedBadgeText}>Not Permitted</Text>
              </View>
            )}
          </View>
          <Text
            style={[
              styles.description,
              selected && styles.selectedDescription,
              disabled && styles.disabledText,
            ]}
          >
            {description}
          </Text>

          {disabled && disabledReason && (
            <View style={styles.reasonContainer}>
              <Icon
                name="info"
                color={theme.colors.danger}
                size={16}
                style={styles.reasonIcon}
              />
              <Text style={styles.reasonText}>{disabledReason}</Text>
            </View>
          )}
        </View>

        {selected && !disabled && (
          <Icon
            name="check"
            color={theme.colors.primary}
            size={24}
            style={styles.checkIcon}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background.card,
    padding: theme.spacing.md,
    borderRadius: 4,
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    borderWidth: 2,
    backgroundColor: theme.colors.primaryLight,
  },
  disabledCard: {
    backgroundColor: theme.colors.background.disabled,
    borderColor: "#ddd",
    borderWidth: 2,
    opacity: 0.75,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainContent: {
    flex: 1,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.text.primary,
    flex: 1,
  },
  selectedText: {
    color: theme.colors.primary,
  },
  disabledText: {
    color: theme.colors.text.disabled,
    textDecorationLine: "line-through",
  },
  description: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  selectedDescription: {
    color: theme.colors.text.primary,
  },
  prohibitedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fee",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: theme.colors.danger,
  },
  prohibitedIcon: {
    marginRight: 4,
  },
  prohibitedBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: theme.colors.danger,
    textTransform: "uppercase",
  },
  reasonContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#fff3cd",
    padding: theme.spacing.sm,
    borderRadius: 3,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.danger,
    marginTop: theme.spacing.xs,
  },
  reasonIcon: {
    marginRight: theme.spacing.xs,
    marginTop: 2,
  },
  reasonText: {
    flex: 1,
    fontSize: 13,
    color: "#856404",
    lineHeight: 18,
  },
  metadata: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: theme.spacing.xs,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.md,
    marginTop: theme.spacing.xs,
  },
  badgeIcon: {
    marginRight: theme.spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    color: theme.colors.text.secondary,
  },
  selectedBadgeText: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  checkIcon: {
    marginLeft: theme.spacing.sm,
  },
});

export default PackagingTypeCard;
