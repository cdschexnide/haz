import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

interface RocketMotorJetThrustSpecOptionProps {
  title: string;
  description: string;
  containerSpec: any;
  subparagraphReference?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const RocketMotorJetThrustSpecOption: React.FC<
  RocketMotorJetThrustSpecOptionProps
> = ({
  title,
  description,
  containerSpec,
  subparagraphReference,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  // Determine badge color based on container type
  const getBadgeColor = () => {
    if (title.toLowerCase().includes("metal")) {
      return "#607D8B"; // Blue-gray for metal containers
    } else if (title.toLowerCase().includes("wooden")) {
      return "#795548"; // Brown for wooden boxes
    } else if (title.toLowerCase().includes("fiberboard")) {
      return "#FF9800"; // Orange for fiberboard boxes
    } else if (title.toLowerCase().includes("combination")) {
      return "#4CAF50"; // Green for combination packages
    } else if (title.toLowerCase().includes("motor")) {
      return "#3F51B5"; // Indigo for rocket motors
    } else {
      return "#2196F3"; // Default blue
    }
  };

  // Format weight for display
  const formatWeight = (weight?: WeightUnits) => {
    if (!weight) return "N/A";
    return `${weight.lbs} lbs / ${weight.kg} kg`;
  };

  // Render container specifications
  const renderContainerSpecs = () => {
    const {
      spec,
      maxGrossWeight,
      maxNetWeight,
      containerRequirements = [],
    } = containerSpec;

    return (
      <View style={styles.detailsContainer}>
        {spec && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Specification:</Text>
            <Text style={styles.specValue}>
              {Array.isArray(spec) ? spec.join(", ") : spec}
            </Text>
          </View>
        )}

        {maxGrossWeight && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Max Gross Weight:</Text>
            <Text style={styles.specValue}>{formatWeight(maxGrossWeight)}</Text>
          </View>
        )}

        {maxNetWeight && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Max Net Weight:</Text>
            <Text style={styles.specValue}>{formatWeight(maxNetWeight)}</Text>
          </View>
        )}

        {subparagraphReference && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Reference:</Text>
            <Text style={styles.specValue}>{subparagraphReference}</Text>
          </View>
        )}

        {containerRequirements.length > 0 && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            {containerRequirements.map((req: string, index: number) => (
              <View key={`req-${index}`} style={styles.requirementItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {containerSpec.notes && containerSpec.notes.length > 0 && (
          <View style={styles.notesContainer}>
            <Text style={styles.notesTitle}>Notes:</Text>
            {containerSpec.notes.map((note: string, index: number) => (
              <View key={`note-${index}`} style={styles.noteItem}>
                <Text style={styles.noteMarker}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </View>
        )}

        {containerSpec.innerPackaging && (
          <View style={styles.innerContainer}>
            <Text style={styles.innerTitle}>Inner Packaging:</Text>
            {containerSpec.innerPackaging.description && (
              <Text style={styles.innerDescription}>
                {containerSpec.innerPackaging.description}
              </Text>
            )}
            {containerSpec.innerPackaging.requirements &&
              containerSpec.innerPackaging.requirements.length > 0 && (
                <View style={styles.innerRequirements}>
                  {containerSpec.innerPackaging.requirements.map(
                    (req: string, index: number) => (
                      <View
                        key={`inner-req-${index}`}
                        style={styles.innerRequirementItem}
                      >
                        <Text style={styles.innerReqMarker}>-</Text>
                        <Text style={styles.innerReqText}>{req}</Text>
                      </View>
                    )
                  )}
                </View>
              )}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, isSelected && styles.selectedContainer]}>
      <TouchableOpacity
        style={[styles.mainContent, disabled && styles.disabledContent]}
        onPress={disabled ? undefined : onSelect}
        disabled={disabled}
      >
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <View
              style={[styles.typeBadge, { backgroundColor: getBadgeColor() }]}
            >
              <Text style={styles.badgeText}>{title.split(" ")[0]}</Text>
            </View>
            <Text style={[styles.title, disabled && styles.disabledText]}>
              {title}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            {isSelected ? (
              <MaterialIcons name="check-circle" size={24} color="#007AFF" />
            ) : (
              <View style={styles.uncheckedCircle} />
            )}
          </View>
        </View>

        <Text style={[styles.description, disabled && styles.disabledText]}>
          {description}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.detailsToggle} onPress={toggleDetails}>
        <Text style={styles.detailsToggleText}>
          {showDetails ? "Hide Details" : "Show Details"}
        </Text>
        <MaterialIcons
          name={showDetails ? "expand-less" : "expand-more"}
          size={20}
          color="#007AFF"
        />
      </TouchableOpacity>

      {showDetails && renderContainerSpecs()}

      {disabled && warningMessage && (
        <View style={styles.warningContainer}>
          <MaterialIcons name="warning" size={16} color="#FF3B30" />
          <Text style={styles.warningText}>{warningMessage}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
  },
  selectedContainer: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  mainContent: {
    padding: 16,
  },
  disabledContent: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  disabledText: {
    color: "#999999",
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionContainer: {
    marginLeft: 8,
  },
  uncheckedCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#CCCCCC",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  detailsToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
    paddingVertical: 10,
    backgroundColor: "#F5F5F5",
  },
  detailsToggleText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#007AFF",
    marginRight: 4,
  },
  detailsContainer: {
    padding: 16,
    backgroundColor: "#F9F9F9",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  specRow: {
    flexDirection: "row",
    marginBottom: 8,
  },
  specLabel: {
    width: 140,
    fontSize: 14,
    fontWeight: "500",
    color: "#666666",
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
  },
  requirementsContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
  requirementsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: "row",
    marginBottom: 6,
    paddingLeft: 4,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#333333",
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  notesContainer: {
    marginTop: 12,
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  noteItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  noteMarker: {
    width: 14,
    fontSize: 14,
    color: "#666666",
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#666666",
    lineHeight: 20,
  },
  innerContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: "#E3F2FD",
    borderRadius: 6,
  },
  innerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1565C0",
    marginBottom: 6,
  },
  innerDescription: {
    fontSize: 14,
    color: "#0D47A1",
    marginBottom: 8,
  },
  innerRequirements: {
    marginTop: 4,
  },
  innerRequirementItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  innerReqMarker: {
    width: 14,
    fontSize: 14,
    color: "#1565C0",
  },
  innerReqText: {
    flex: 1,
    fontSize: 14,
    color: "#1565C0",
    lineHeight: 20,
  },
  warningContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF3F3",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "#FFD0D0",
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    color: "#FF3B30",
    marginLeft: 6,
  },
});
