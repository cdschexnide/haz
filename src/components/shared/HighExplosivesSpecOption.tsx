import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

// Types to represent the High Explosives data structure
interface DimensionLimits {
  diameter?: string;
  length?: string;
  weight?: string;
}

interface BagSpec {
  material?: string;
  capacity?: string;
  thickness?: string;
  closure?: string;
}

interface CartridgeSpec {
  diameter?: string | DimensionLimits;
  length?: string | DimensionLimits;
  weight?: string;
  construction?: string;
}

interface HighExplosiveContainerSpec {
  type: string;
  spec?: string | string[];
  maxGrossWeight?: WeightUnits;
  insideContainers?: {
    type: string;
    specs?: BagSpec | CartridgeSpec;
    requirements?: string[];
  }[];
  requirements?: string[];
  notes?: string[];
  substances?: string[];
  liquidIngredientPercent?: string;
  containerLimits?: {
    diameter?: string;
    length?: string;
    weight?: string;
  };
  materialRequirements?: string[];
  capacity?: string;
  liningRequirements?: string[];
}

interface HighExplosivesSpecOptionProps {
  title: string;
  description?: string;
  subCategory?: string;
  explosiveType?: string;
  containerSpec: HighExplosiveContainerSpec;
  generalRequirements?: string[];
  liquidIngredientPercent?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const HighExplosivesSpecOption: React.FC<
  HighExplosivesSpecOptionProps
> = ({
  title,
  description,
  subCategory,
  explosiveType,
  containerSpec,
  generalRequirements = [],
  liquidIngredientPercent,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  // Format spec array to string if needed
  const specText = containerSpec.spec
    ? Array.isArray(containerSpec.spec)
      ? containerSpec.spec.join(", ")
      : containerSpec.spec
    : null;

  // Helper function to toggle expanded state
  const toggleExpand = (e: any) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        disabled && styles.disabledContainer,
      ]}
      onPress={onSelect}
      disabled={disabled}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text
            style={[
              styles.title,
              isSelected && styles.selectedTitle,
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
          {isSelected && (
            <View style={styles.checkmark}>
              <Text style={styles.checkmarkText}>✓</Text>
            </View>
          )}
        </View>

        {/* Explosive Type Badge */}
        {explosiveType && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{explosiveType}</Text>
          </View>
        )}

        {/* Liquid Ingredient Badge (if applicable) */}
        {liquidIngredientPercent && (
          <View style={styles.liquidBadge}>
            <Text style={styles.liquidBadgeText}>
              {liquidIngredientPercent} liquid explosive
            </Text>
          </View>
        )}

        {warningMessage && (
          <Text style={styles.warningText}>{warningMessage}</Text>
        )}
      </View>

      {/* Subheading for subcategory */}
      {subCategory && (
        <Text style={[styles.subCategory, disabled && styles.disabledText]}>
          {subCategory}
        </Text>
      )}

      {description && (
        <Text style={[styles.description, disabled && styles.disabledText]}>
          {description}
        </Text>
      )}

      {/* Basic Details Section */}
      <View style={styles.detailsContainer}>
        {/* Specification information */}
        {specText && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Specification:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {specText}
            </Text>
          </View>
        )}

        {/* Maximum Weight */}
        {containerSpec.maxGrossWeight && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Max Gross Weight:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {containerSpec.maxGrossWeight.lbs} lbs /{" "}
              {containerSpec.maxGrossWeight.kg} kg
            </Text>
          </View>
        )}

        {/* Container Limits */}
        {containerSpec.containerLimits && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Container Limits:
            </Text>
            <View style={styles.limitsList}>
              {containerSpec.containerLimits.diameter && (
                <Text
                  style={[styles.limitItem, disabled && styles.disabledText]}
                >
                  • Max diameter: {containerSpec.containerLimits.diameter}
                </Text>
              )}
              {containerSpec.containerLimits.length && (
                <Text
                  style={[styles.limitItem, disabled && styles.disabledText]}
                >
                  • Max length: {containerSpec.containerLimits.length}
                </Text>
              )}
              {containerSpec.containerLimits.weight && (
                <Text
                  style={[styles.limitItem, disabled && styles.disabledText]}
                >
                  • Max weight: {containerSpec.containerLimits.weight}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>

      {/* Expand/Collapse Button */}
      <TouchableOpacity
        style={styles.expandButton}
        onPress={toggleExpand}
        activeOpacity={0.7}
      >
        <Text style={styles.expandButtonText}>
          {expanded ? "Show Less" : "Show More Details"}
        </Text>
      </TouchableOpacity>

      {/* Expanded Details Section */}
      {expanded && (
        <View style={styles.expandedSection}>
          {/* Inside Containers Section */}
          {containerSpec.insideContainers &&
            containerSpec.insideContainers.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, disabled && styles.disabledText]}
                >
                  Inside Containers:
                </Text>
                {containerSpec.insideContainers.map((container, index) => (
                  <View
                    key={`container-${index}`}
                    style={styles.insideContainer}
                  >
                    <Text
                      style={[
                        styles.insideContainerType,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {container.type}
                    </Text>

                    {/* Bag Specifications */}
                    {container.specs && "material" in container.specs && (
                      <View style={styles.specsList}>
                        {container.specs.material && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Material: {container.specs.material}
                          </Text>
                        )}
                        {container.specs.capacity && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Capacity: {container.specs.capacity}
                          </Text>
                        )}
                        {container.specs.thickness && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Thickness: {container.specs.thickness}
                          </Text>
                        )}
                        {container.specs.closure && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Closure: {container.specs.closure}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Cartridge Specifications */}
                    {container.specs && "diameter" in container.specs && (
                      <View style={styles.specsList}>
                        {container.specs.diameter && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Diameter:{" "}
                            {typeof container.specs.diameter === "string"
                              ? container.specs.diameter
                              : `Min: ${container.specs.diameter.diameter}`}
                          </Text>
                        )}
                        {container.specs.length && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Length:{" "}
                            {typeof container.specs.length === "string"
                              ? container.specs.length
                              : `Max: ${container.specs.length.length}`}
                          </Text>
                        )}
                        {container.specs.weight && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Weight: {container.specs.weight}
                          </Text>
                        )}
                        {container.specs.construction && (
                          <Text
                            style={[
                              styles.specItem,
                              disabled && styles.disabledText,
                            ]}
                          >
                            • Construction: {container.specs.construction}
                          </Text>
                        )}
                      </View>
                    )}

                    {/* Container Requirements */}
                    {container.requirements &&
                      container.requirements.length > 0 && (
                        <View style={styles.requirementsList}>
                          {container.requirements.map((req, reqIndex) => (
                            <Text
                              key={`req-${index}-${reqIndex}`}
                              style={[
                                styles.requirementItem,
                                disabled && styles.disabledText,
                              ]}
                            >
                              • {req}
                            </Text>
                          ))}
                        </View>
                      )}
                  </View>
                ))}
              </View>
            )}

          {/* Lining Requirements */}
          {containerSpec.liningRequirements &&
            containerSpec.liningRequirements.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, disabled && styles.disabledText]}
                >
                  Lining Requirements:
                </Text>
                {containerSpec.liningRequirements.map((req, index) => (
                  <Text
                    key={`lining-${index}`}
                    style={[styles.listItem, disabled && styles.disabledText]}
                  >
                    • {req}
                  </Text>
                ))}
              </View>
            )}

          {/* Material Requirements */}
          {containerSpec.materialRequirements &&
            containerSpec.materialRequirements.length > 0 && (
              <View style={styles.section}>
                <Text
                  style={[styles.sectionTitle, disabled && styles.disabledText]}
                >
                  Material Requirements:
                </Text>
                {containerSpec.materialRequirements.map((req, index) => (
                  <Text
                    key={`material-${index}`}
                    style={[styles.listItem, disabled && styles.disabledText]}
                  >
                    • {req}
                  </Text>
                ))}
              </View>
            )}

          {/* Container Requirements */}
          {containerSpec.requirements && containerSpec.requirements.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Container Requirements:
              </Text>
              {containerSpec.requirements.map((req, index) => (
                <Text
                  key={`req-${index}`}
                  style={[styles.listItem, disabled && styles.disabledText]}
                >
                  • {req}
                </Text>
              ))}
            </View>
          )}

          {/* General Requirements (if any) */}
          {generalRequirements && generalRequirements.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                General Requirements:
              </Text>
              {generalRequirements.map((req, index) => (
                <Text
                  key={`gen-req-${index}`}
                  style={[styles.listItem, disabled && styles.disabledText]}
                >
                  • {req}
                </Text>
              ))}
            </View>
          )}

          {/* Notes */}
          {containerSpec.notes && containerSpec.notes.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Notes:
              </Text>
              {containerSpec.notes.map((note, index) => (
                <Text
                  key={`note-${index}`}
                  style={[styles.listItem, disabled && styles.disabledText]}
                >
                  • {note}
                </Text>
              ))}
            </View>
          )}

          {/* Applicable Substances */}
          {containerSpec.substances && containerSpec.substances.length > 0 && (
            <View style={styles.section}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Applicable Substances:
              </Text>
              <Text
                style={[styles.substancesList, disabled && styles.disabledText]}
              >
                {containerSpec.substances.join(", ")}
              </Text>
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
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
    borderColor: "transparent",
  },
  selectedContainer: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledContainer: {
    backgroundColor: "#FAFAFA",
    borderColor: "#E0E0E0",
  },
  header: {
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  selectedTitle: {
    color: "#007AFF",
  },
  subCategory: {
    fontSize: 16,
    fontWeight: "500",
    color: "#555555",
    marginBottom: 8,
  },
  typeBadge: {
    backgroundColor: "#E3F2FD",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  typeBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1976D2",
  },
  liquidBadge: {
    backgroundColor: "#FFF3E0",
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
    marginBottom: 4,
  },
  liquidBadgeText: {
    fontSize: 12,
    fontWeight: "500",
    color: "#E65100",
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  checkmarkText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "500",
    marginTop: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
    fontStyle: "italic",
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666666",
    width: 140,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 15,
    color: "#000000",
    flex: 1,
  },
  limitsList: {
    flex: 1,
  },
  limitItem: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 4,
  },
  expandButton: {
    backgroundColor: "#F5F5F5",
    padding: 8,
    borderRadius: 4,
    alignItems: "center",
    marginTop: 8,
  },
  expandButtonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#0066CC",
  },
  expandedSection: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingTop: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  insideContainer: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#E0E0E0",
  },
  insideContainerType: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
    marginBottom: 6,
  },
  specsList: {
    marginLeft: 8,
    marginBottom: 6,
  },
  specItem: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
  },
  requirementsList: {
    marginLeft: 8,
  },
  requirementItem: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
    lineHeight: 20,
  },
  listItem: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 6,
    paddingLeft: 8,
    lineHeight: 20,
  },
  substancesList: {
    fontSize: 14,
    color: "#555555",
    paddingLeft: 8,
    lineHeight: 20,
  },
  disabledText: {
    color: "#9E9E9E",
  },
});
