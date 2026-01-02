import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Icon } from "react-native-elements";
import { Container } from "@/types/packagingStructure";
import colors from "@/theming/colors";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface ContainerCodeCardProps {
  material: string;
  containers: Container[];
  selectedCode: string | null;
  selectedContainerIndex?: number | null;
  onSelectCode: (code: string, containerIndex?: number) => void;
  restrictedCodes?: string[];
  prohibitedCodes?: string[];
  getRestrictionDescription?: (code: string) => string | null;
}

const theme = {
  colors: {
    primary: "#0066cc",
    warning: "#ffc107",
    danger: "#dc3545",
    white: "#ffffff",
    border: "#dee2e6",
    text: {
      primary: "#212529",
      secondary: "#6c757d",
      muted: "#999999",
    },
    background: {
      main: "#f8f9fa",
      card: "#ffffff",
    },
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
  },
};

const ContainerCodeCard: React.FC<ContainerCodeCardProps> = ({
  material,
  containers,
  selectedCode,
  selectedContainerIndex = null,
  onSelectCode,
  restrictedCodes = [],
  prohibitedCodes = [],
  getRestrictionDescription,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatMaterialName = (mat: string): string => {
    return mat
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isProhibited = (code: string): boolean => {
    return prohibitedCodes.includes(code);
  };

  const hasRestriction = (code: string): boolean => {
    return restrictedCodes.includes(code);
  };

  // Check if ALL containers are prohibited
  const allProhibited = containers.every(c => isProhibited(c.code));

  const toggleAccordion = () => {
    if (allProhibited) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <View style={styles.materialCard}>
      <TouchableOpacity
        style={[
          styles.materialHeader,
          allProhibited && styles.materialHeaderProhibited,
        ]}
        onPress={toggleAccordion}
        disabled={!allProhibited}
        activeOpacity={allProhibited ? 0.7 : 1}
      >
        <View style={styles.materialHeaderContent}>
          <Text
            style={[
              styles.materialTitle,
              allProhibited && styles.materialTitleProhibited,
            ]}
          >
            {formatMaterialName(material)}
          </Text>
          {allProhibited && (
            <Icon
              name="cancel"
              size={18}
              color={theme.colors.danger}
              style={styles.prohibitedIcon}
            />
          )}
        </View>
        {allProhibited && (
          <Icon
            name={isExpanded ? "expand-less" : "expand-more"}
            size={24}
            color={theme.colors.text.secondary}
          />
        )}
      </TouchableOpacity>

      {(!allProhibited || isExpanded) && (
        <>
          <View style={styles.divider} />
          <View style={styles.codesContainer}>
            {containers.map((container: Container, index: number) => {
              const prohibited = isProhibited(container.code);
              const restricted = hasRestriction(container.code);
              const isSelected =
                selectedCode === container.code &&
                (selectedContainerIndex === null ||
                  selectedContainerIndex === index);
              const restrictionDesc = getRestrictionDescription?.(
                container.code
              );
              const uniqueKey = `${
                container.code
              }-${index}-${container.description.substring(0, 20)}`;

              return (
                <View key={uniqueKey} style={styles.containerWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.codeButton,
                      isSelected && styles.selectedCodeButton,
                      prohibited && styles.prohibitedCodeButton,
                      restricted && !isSelected && styles.restrictedCodeButton,
                    ]}
                    onPress={() =>
                      !prohibited && onSelectCode(container.code, index)
                    }
                    disabled={prohibited}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: isSelected,
                      disabled: prohibited,
                    }}
                    accessibilityLabel={`Select code ${container.code} - ${container.description}`}
                  >
                    {prohibited && <View style={styles.prohibitedOverlay} />}
                    <View style={styles.codeButtonContent}>
                      <Text
                        style={[
                          styles.codeButtonText,
                          isSelected && styles.selectedCodeButtonText,
                          prohibited && styles.prohibitedCodeButtonText,
                        ]}
                      >
                        {container.code}
                      </Text>
                      {(prohibited || restricted) && (
                        <Icon
                          name={prohibited ? "cancel" : "warning"}
                          size={14}
                          color={
                            prohibited
                              ? theme.colors.danger
                              : theme.colors.warning
                          }
                          style={styles.warningIcon}
                        />
                      )}
                    </View>
                    <Text
                      style={[
                        styles.codeDescription,
                        isSelected && styles.selectedCodeDescription,
                        prohibited && styles.prohibitedCodeDescription,
                      ]}
                    >
                      {container.description}
                    </Text>
                  </TouchableOpacity>
                  {restrictionDesc && (
                    <Text style={styles.restrictionText} numberOfLines={2}>
                      {restrictionDesc}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  materialCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.background.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
  },
  materialHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
    backgroundColor: "#f5f5f5",
  },
  materialHeaderProhibited: {
    backgroundColor: "#fff5f5",
    cursor: "pointer",
  },
  materialHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  materialTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  materialTitleProhibited: {
    color: theme.colors.danger,
  },
  prohibitedIcon: {
    marginLeft: theme.spacing.sm,
  },
  materialCount: {
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  codesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: theme.spacing.md,
    gap: 12,
  },
  containerWrapper: {
    minWidth: 140,
    maxWidth: 200,
    flexGrow: 1,
  },
  codeButton: {
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.background.main,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 4,
    minHeight: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  selectedCodeButton: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
    borderWidth: 2,
  },
  restrictedCodeButton: {
    borderColor: theme.colors.warning,
    borderWidth: 2,
  },
  prohibitedCodeButton: {
    backgroundColor: "#ffe6e6",
    borderColor: theme.colors.danger,
    borderWidth: 2,
    opacity: 0.7,
  },
  prohibitedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(220, 53, 69, 0.05)",
  },
  codeButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.xs,
  },
  codeButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: theme.colors.text.primary,
  },
  selectedCodeButtonText: {
    color: theme.colors.white,
  },
  prohibitedCodeButtonText: {
    color: theme.colors.danger,
    textDecorationLine: "line-through",
  },
  codeDescription: {
    fontSize: 13,
    color: theme.colors.text.secondary,
    textAlign: "center",
    lineHeight: 18,
  },
  selectedCodeDescription: {
    color: theme.colors.white,
  },
  prohibitedCodeDescription: {
    color: theme.colors.danger,
  },
  warningIcon: {
    marginLeft: theme.spacing.xs,
  },
  restrictionText: {
    fontSize: 11,
    color: theme.colors.text.secondary,
    fontStyle: "italic",
    marginTop: theme.spacing.xs,
  },
});

export default ContainerCodeCard;
