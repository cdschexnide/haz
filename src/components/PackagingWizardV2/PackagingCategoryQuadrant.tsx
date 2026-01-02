import React from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
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

interface PackagingCategoryQuadrantProps {
  category: PackagingCategory;
  selected: boolean;
  prohibited: boolean;
  restrictionMessages: string[];
  containerCount: number;
  materialsPreview: string;
  onPress: () => void;
  onRestrictionPress?: () => void;
  itemCount: number; // Total number of items to determine grid layout
}

const theme = {
  colors: {
    primary: "#0066cc",
    primaryDark: "#0056b3",
    white: "#ffffff",
    black: "#212529",
    lightGrey: "#f0f0f0",
    darkGrey: "#999999",
    borderGrey: "#dee2e6",
    textGrey: "#6c757d",
  },
};

const PackagingCategoryQuadrant: React.FC<PackagingCategoryQuadrantProps> = ({
  category,
  selected,
  prohibited,
  restrictionMessages,
  containerCount,
  materialsPreview,
  onPress,
  onRestrictionPress,
  itemCount,
}) => {
  const getCategoryIcon = () => {
    const iconColor = prohibited ? theme.colors.darkGrey : theme.colors.black;
    const iconSize = 110;

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

  const handlePress = () => {
    if (prohibited && onRestrictionPress) {
      onRestrictionPress();
    } else if (!prohibited) {
      onPress();
    }
  };

  // Calculate width based on item count
  const getQuadrantWidth = () => {
    if (itemCount === 2) return "49.5%"; // 2x1
    if (itemCount === 3) return "32%"; // 3x1
    return "49.5%"; // 2x2, 2x3, etc.
  };

  const quadrantStyle: ViewStyle[] = [
    styles.quadrant,
    { width: getQuadrantWidth() },
    ...(selected && !prohibited ? [styles.selectedQuadrant] : []),
    ...(prohibited ? [styles.prohibitedQuadrant] : []),
  ];

  const categoryNameColor = prohibited
    ? theme.colors.darkGrey
    : theme.colors.primary;
  const subtextColor = prohibited
    ? theme.colors.darkGrey
    : theme.colors.textGrey;

  return (
    <TouchableOpacity
      style={quadrantStyle}
      onPress={handlePress}
      activeOpacity={prohibited ? 1 : 0.7}
      accessibilityRole="button"
      accessibilityState={{ selected, disabled: prohibited }}
      accessibilityLabel={`${getCategoryName()}, ${containerCount} container options, ${materialsPreview}`}
    >
      {/* Icon */}
      <View style={styles.iconContainer}>{getCategoryIcon()}</View>

      {/* Category Name */}
      <Text style={[styles.categoryName, { color: categoryNameColor }]}>
        {getCategoryName()}
      </Text>

      {/* Subtext */}
      <Text style={[styles.subtext, { color: subtextColor }]}>
        {containerCount} container option{containerCount !== 1 ? "s" : ""} •{" "}
        {materialsPreview}
      </Text>

      {/* Prohibition X Icon Overlay */}
      {prohibited && (
        <View style={styles.prohibitionOverlay}>
          <Icon name="cancel" size={28} color={theme.colors.darkGrey} />
        </View>
      )}

      {/* Selection Checkmark */}
      {selected && !prohibited && (
        <View style={styles.checkmarkOverlay}>
          <Icon name="check-circle" size={28} color={theme.colors.primary} />
        </View>
      )}
    </TouchableOpacity>
  );
};

export default PackagingCategoryQuadrant;

const styles = StyleSheet.create({
  quadrant: {
    height: 180,
    backgroundColor: "#ffffff",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#dee2e6",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    marginBottom: 6,
  },
  selectedQuadrant: {
    backgroundColor: "#e6f0ff",
    borderColor: "#0066cc",
    borderWidth: 2,
  },
  prohibitedQuadrant: {
    backgroundColor: "#f0f0f0",
    borderColor: "#999999",
    borderWidth: 2,
  },
  iconContainer: {
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtext: {
    fontSize: 12,
    textAlign: "center",
    paddingHorizontal: 4,
    lineHeight: 16,
  },
  prohibitionOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  checkmarkOverlay: {
    position: "absolute",
    top: 8,
    right: 8,
  },
});
