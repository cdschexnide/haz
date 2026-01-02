import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface BlackPowderSpecOptionProps {
  title: string;
  spec?: string | string[];
  dimensions?: any;
  capacity?: any;
  innerContainers?: any[];
  netWeightRestrictions?: any;
  maxGrossWeight?: any;
  lining?: string;
  notes?: string[];
  for?: string;
  performanceRequirement?: string;
  substitutions?: string[];
  maxNetWeight?: any;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const BlackPowderSpecOption: React.FC<BlackPowderSpecOptionProps> = ({
  title,
  spec,
  dimensions,
  capacity,
  innerContainers,
  netWeightRestrictions,
  maxGrossWeight,
  lining,
  notes,
  for: intendedFor,
  performanceRequirement,
  substitutions,
  maxNetWeight,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Format specs array into string
  const formatSpecs = (specs: string | string[]) => {
    if (Array.isArray(specs)) {
      return specs.join(", ");
    }
    return specs;
  };

  // Format weight display
  const formatWeight = (weight: any, label: string) => {
    if (!weight) return null;

    // Handle when weight is an object with lbs and kg
    if (weight.lbs && weight.kg) {
      return (
        <View style={styles.infoRow} key={`${label}-weight`}>
          <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
            {label}:
          </Text>
          <Text style={[styles.infoValue, disabled && styles.disabledText]}>
            {weight.lbs} lbs / {weight.kg} kg
          </Text>
        </View>
      );
    }

    // Handle when weight is a record of container types to weights
    if (typeof weight === "object" && !weight.lbs) {
      return Object.entries(weight).map(
        ([container, containerWeight]: [string, any]) => (
          <View style={styles.infoRow} key={`${container}-weight`}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              {`${label} (${container})`}:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {containerWeight.lbs} lbs / {containerWeight.kg} kg
            </Text>
          </View>
        )
      );
    }

    return null;
  };

  // Render dimensions
  const renderDimensions = (dims: any) => {
    if (!dims) return null;

    const dimensionRows = [];

    if (dims.length && dims.length.minimum) {
      dimensionRows.push(
        <View style={styles.infoRow} key="length">
          <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
            Min Length:
          </Text>
          <Text style={[styles.infoValue, disabled && styles.disabledText]}>
            {dims.length.minimum.inches} in / {dims.length.minimum.centimeters}{" "}
            cm
          </Text>
        </View>
      );
    }

    if (dims.diameter && dims.diameter.maximum) {
      dimensionRows.push(
        <View style={styles.infoRow} key="max-diameter">
          <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
            Max Diameter:
          </Text>
          <Text style={[styles.infoValue, disabled && styles.disabledText]}>
            {dims.diameter.maximum.inches} in /{" "}
            {dims.diameter.maximum.centimeters} cm
          </Text>
        </View>
      );
    }

    if (dims.length && dims.length.maximum) {
      dimensionRows.push(
        <View style={styles.infoRow} key="max-length">
          <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
            Max Length:
          </Text>
          <Text style={[styles.infoValue, disabled && styles.disabledText]}>
            {dims.length.maximum.inches} in / {dims.length.maximum.centimeters}{" "}
            cm
          </Text>
        </View>
      );
    }

    if (dims.thickness && dims.thickness.minimum) {
      dimensionRows.push(
        <View style={styles.infoRow} key="min-thickness">
          <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
            Min Thickness:
          </Text>
          <Text style={[styles.infoValue, disabled && styles.disabledText]}>
            {dims.thickness.minimum.inches} in /{" "}
            {dims.thickness.minimum.centimeters} cm
          </Text>
        </View>
      );
    }

    return dimensionRows.length > 0 ? (
      <View style={styles.dimensionsContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Dimensions
        </Text>
        {dimensionRows}
      </View>
    ) : null;
  };

  // Render inner containers
  const renderInnerContainers = (containers: any[]) => {
    if (!containers || !Array.isArray(containers) || containers.length === 0)
      return null;

    return (
      <View style={styles.innerContainersSection}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Inner Containers
        </Text>
        {containers.map((container, index) => (
          <View style={styles.innerContainer} key={`container-${index}`}>
            <Text
              style={[styles.containerType, disabled && styles.disabledText]}
            >
              {container.type}
            </Text>

            {container.material && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  Material:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {container.material}
                </Text>
              </View>
            )}

            {container.capacity && container.capacity.lbs && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  Capacity:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {container.capacity.lbs} lbs / {container.capacity.kg} kg
                </Text>
              </View>
            )}

            {container.dimensions && renderDimensions(container.dimensions)}

            {container.notes && container.notes.length > 0 && (
              <View style={styles.notesContainer}>
                {container.notes.map((note: string, noteIndex: number) => (
                  <Text
                    key={`note-${noteIndex}`}
                    style={[styles.note, disabled && styles.disabledText]}
                  >
                    • {note}
                  </Text>
                ))}
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  // Render net weight restrictions
  const renderNetWeightRestrictions = (restrictions: any) => {
    if (!restrictions) return null;

    return (
      <View style={styles.netWeightSection}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Net Weight Restrictions
        </Text>

        {restrictions.minimum && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              Minimum:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {restrictions.minimum.lbs} lbs / {restrictions.minimum.kg} kg
            </Text>
          </View>
        )}

        {restrictions.maximum && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              Maximum:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {restrictions.maximum.lbs} lbs / {restrictions.maximum.kg} kg
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.selectionCard,
        isSelected && styles.selectedCard,
        disabled && styles.disabledCard,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
      disabled={disabled}
    >
      <View style={styles.selectionItem}>
        <View style={styles.selectionContent}>
          <View style={styles.titleRow}>
            <Text
              style={[styles.selectionTitle, disabled && styles.disabledText]}
            >
              {title}
            </Text>
            {warningMessage && (
              <Text style={styles.warningText}>
                <MaterialIcons name="error-outline" size={16} color="#D32F2F" />
                {" " + warningMessage}
              </Text>
            )}
          </View>

          {/* Specs */}
          {spec && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Specification:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {formatSpecs(spec)}
              </Text>
            </View>
          )}

          {/* For */}
          {intendedFor && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                For:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {intendedFor}
              </Text>
            </View>
          )}

          {/* Lining */}
          {lining && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Lining:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {lining}
              </Text>
            </View>
          )}

          {/* Performance Requirement */}
          {performanceRequirement && (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Requirement:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {performanceRequirement}
              </Text>
            </View>
          )}

          {/* Dimensions */}
          {dimensions && renderDimensions(dimensions)}

          {/* Net Weight Restrictions */}
          {netWeightRestrictions &&
            renderNetWeightRestrictions(netWeightRestrictions)}

          {/* Inner Containers */}
          {innerContainers && renderInnerContainers(innerContainers)}

          {/* Max Gross Weight */}
          {maxGrossWeight && formatWeight(maxGrossWeight, "Max Gross Weight")}

          {/* Max Net Weight */}
          {maxNetWeight && formatWeight(maxNetWeight, "Max Net Weight")}

          {/* Substitutions */}
          {substitutions && substitutions.length > 0 && (
            <View style={styles.substitutionsContainer}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Substitutions
              </Text>
              {substitutions.map((sub, subIndex) => (
                <Text
                  key={`sub-${subIndex}`}
                  style={[styles.substitution, disabled && styles.disabledText]}
                >
                  • {sub}
                </Text>
              ))}
            </View>
          )}

          {/* Notes */}
          {notes && notes.length > 0 && (
            <View style={styles.notesContainer}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Notes
              </Text>
              {notes.map((note, noteIndex) => (
                <Text
                  key={`note-${noteIndex}`}
                  style={[styles.note, disabled && styles.disabledText]}
                >
                  • {note}
                </Text>
              ))}
            </View>
          )}
        </View>
        <View style={styles.selectionCheckbox}>
          {isSelected ? (
            <MaterialIcons
              name="radio-button-checked"
              size={24}
              color={disabled ? "#BDBDBD" : "#007AFF"}
            />
          ) : (
            <MaterialIcons
              name="radio-button-unchecked"
              size={24}
              color={disabled ? "#BDBDBD" : "#8E8E93"}
            />
          )}
        </View>
      </View>

      {disabled && <View style={styles.disabledOverlay} />}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  selectionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    position: "relative",
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledCard: {
    borderColor: "#D8D8D8",
    backgroundColor: "#FFFFFF",
  },
  disabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 8,
    zIndex: 1,
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 2,
  },
  selectionContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 4,
  },
  selectionTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginRight: 8,
    marginBottom: 8,
  },
  disabledText: {
    color: "#9E9E9E",
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
  },
  selectionCheckbox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 8,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    width: 110,
  },
  infoValue: {
    fontSize: 14,
    color: "#212121",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555555",
    marginTop: 12,
    marginBottom: 8,
  },
  dimensionsContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  innerContainersSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  innerContainer: {
    marginLeft: 4,
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#E0E0E0",
  },
  containerType: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 4,
  },
  notesContainer: {
    marginTop: 8,
  },
  note: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
    marginLeft: 8,
  },
  netWeightSection: {
    marginTop: 8,
    marginBottom: 8,
  },
  substitutionsContainer: {
    marginTop: 8,
  },
  substitution: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
    marginLeft: 8,
  },
});
