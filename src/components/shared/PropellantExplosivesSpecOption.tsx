import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

// Types for the component props
interface PropellantExplosivesContainerSpec {
  type: string;
  description?: string;
  spec?: string | string[];
  maxGrossWeight?: WeightUnits;
  maxNetWeight?: WeightUnits;
  containerRequirements?: string[];
  notes?: string[];
  subparagraphReference?: string;
}

interface PropellantExplosivesSpecOptionProps {
  title: string;
  description?: string;
  containerSpec: PropellantExplosivesContainerSpec;
  subparagraphReference?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

/**
 * A specialized SelectOption variant for A27.24 Propellant Explosives (Solid or Liquid)
 * Displays packaging requirements based on the AFMAN 24-204 A27.24 specifications
 */
export const PropellantExplosivesSpecOption: React.FC<
  PropellantExplosivesSpecOptionProps
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
  // State to manage the expanded/collapsed view
  const [isExpanded, setIsExpanded] = useState(false);

  // Toggle expanded state
  const toggleExpand = (e: any) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  // Format the subparagraph reference for display
  const formattedReference = subparagraphReference
    ? subparagraphReference
    : containerSpec.subparagraphReference || "";

  // Determine the badge text based on container type
  const getBadgeText = () => {
    const type = containerSpec.type.toLowerCase();
    if (type.includes("metal")) return "METAL";
    if (type.includes("fiber")) return "FIBER";
    if (type.includes("wooden")) return "WOODEN";
    return "CONTAINER";
  };

  // Get the badge color based on container type
  const getBadgeColor = () => {
    const type = containerSpec.type.toLowerCase();
    if (type.includes("metal")) return "#3F51B5"; // Indigo
    if (type.includes("fiber")) return "#8D6E63"; // Brown
    if (type.includes("wooden")) return "#795548"; // Deeper Brown
    return "#607D8B"; // Blue Grey
  };

  // Determine if the container has weight limits
  const hasWeightLimits =
    containerSpec.maxGrossWeight || containerSpec.maxNetWeight;

  return (
    <View
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        disabled && styles.disabledContainer,
      ]}
    >
      <TouchableOpacity
        style={styles.header}
        onPress={onSelect}
        disabled={disabled}
      >
        <View style={styles.titleRow}>
          <View style={[styles.badge, { backgroundColor: getBadgeColor() }]}>
            <Text style={styles.badgeText}>{getBadgeText()}</Text>
          </View>

          <Text
            style={[
              styles.title,
              isSelected && styles.selectedTitle,
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
        </View>

        {description && (
          <Text style={[styles.description, disabled && styles.disabledText]}>
            {description}
          </Text>
        )}

        {formattedReference && (
          <Text style={styles.reference}>Reference: {formattedReference}</Text>
        )}

        {hasWeightLimits && (
          <View style={styles.weightSection}>
            {containerSpec.maxGrossWeight && (
              <Text style={styles.weightText}>
                Max Gross Weight: {containerSpec.maxGrossWeight.lbs} lbs /{" "}
                {containerSpec.maxGrossWeight.kg} kg
              </Text>
            )}
            {containerSpec.maxNetWeight && (
              <Text style={styles.weightText}>
                Max Net Weight: {containerSpec.maxNetWeight.lbs} lbs /{" "}
                {containerSpec.maxNetWeight.kg} kg
              </Text>
            )}
          </View>
        )}

        {warningMessage && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{warningMessage}</Text>
          </View>
        )}

        <TouchableOpacity style={styles.expandButton} onPress={toggleExpand}>
          <Text style={styles.expandButtonText}>
            {isExpanded ? "▲ Less Details" : "▼ More Details"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.expandedContent}>
          {/* Regulation Block */}
          <View style={styles.regulationBlock}>
            <Text style={styles.sectionTitle}>AFMAN 24-204 Requirements</Text>

            <View style={styles.regulationContent}>
              <Text style={styles.regulationText}>
                A27.24. Propellant Explosives, Solid or Liquid (Class A or B
                Explosives). Package propellant explosives in accordance with
                the specific requirements for the selected container type.
              </Text>
            </View>
          </View>

          {/* Container Requirements */}
          {containerSpec.containerRequirements &&
            containerSpec.containerRequirements.length > 0 && (
              <View style={styles.requirementsBlock}>
                <Text style={styles.sectionTitle}>Container Requirements</Text>

                {containerSpec.containerRequirements.map(
                  (requirement, index) => (
                    <View key={`req-${index}`} style={styles.requirementItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.requirementText}>{requirement}</Text>
                    </View>
                  )
                )}
              </View>
            )}

          {/* Container Notes */}
          {containerSpec.notes && containerSpec.notes.length > 0 && (
            <View style={styles.notesBlock}>
              <Text style={styles.sectionTitle}>Notes</Text>

              {containerSpec.notes.map((note, index) => (
                <View key={`note-${index}`} style={styles.noteItem}>
                  <Text style={styles.noteText}>• {note}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Container Specifications */}
          <View style={styles.specBlock}>
            <Text style={styles.sectionTitle}>Container Specifications</Text>

            <View style={styles.specContent}>
              <Text style={styles.specText}>Type: {containerSpec.type}</Text>

              {containerSpec.spec && (
                <Text style={styles.specText}>
                  Specification:{" "}
                  {Array.isArray(containerSpec.spec)
                    ? containerSpec.spec.join(", ")
                    : containerSpec.spec}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  selectedContainer: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledContainer: {
    opacity: 0.7,
    borderColor: "#E0E0E0",
    backgroundColor: "#F5F5F5",
  },
  header: {
    padding: 16,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
  },
  badgeText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  selectedTitle: {
    color: "#007AFF",
  },
  description: {
    fontSize: 14,
    color: "#5A5A5A",
    marginBottom: 8,
  },
  reference: {
    fontSize: 13,
    color: "#757575",
    fontStyle: "italic",
    marginBottom: 8,
  },
  weightSection: {
    marginTop: 4,
    marginBottom: 8,
  },
  weightText: {
    fontSize: 14,
    color: "#424242",
    fontWeight: "500",
  },
  warningContainer: {
    backgroundColor: "#FFF3E0",
    borderRadius: 4,
    padding: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#FF9800",
  },
  warningText: {
    color: "#E65100",
    fontSize: 14,
  },
  expandButton: {
    alignSelf: "center",
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
  },
  expandButtonText: {
    color: "#616161",
    fontSize: 13,
    fontWeight: "500",
  },
  disabledText: {
    color: "#9E9E9E",
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    padding: 16,
    backgroundColor: "#FAFAFA",
  },
  regulationBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#424242",
    marginBottom: 8,
  },
  regulationContent: {
    backgroundColor: "#EFF7FF",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#2196F3",
  },
  regulationText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#333333",
  },
  requirementsBlock: {
    marginBottom: 16,
  },
  requirementItem: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#007AFF",
    marginTop: 7,
    marginRight: 8,
  },
  requirementText: {
    fontSize: 14,
    color: "#333333",
    flex: 1,
    lineHeight: 20,
  },
  notesBlock: {
    marginBottom: 16,
  },
  noteItem: {
    marginBottom: 6,
  },
  noteText: {
    fontSize: 14,
    color: "#555555",
    lineHeight: 20,
  },
  specBlock: {
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  specContent: {
    paddingHorizontal: 8,
  },
  specText: {
    fontSize: 14,
    color: "#424242",
    marginBottom: 4,
  },
});
