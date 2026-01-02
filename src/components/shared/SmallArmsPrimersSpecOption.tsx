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

interface SmallArmsPrimersSpecOptionProps {
  title: string;
  description: string;
  containerSpec: any;
  subparagraphReference?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const SmallArmsPrimersSpecOption: React.FC<
  SmallArmsPrimersSpecOptionProps
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
    } else if (title.toLowerCase().includes("percussion")) {
      return "#9C27B0"; // Purple for percussion caps
    } else if (title.toLowerCase().includes("cellular")) {
      return "#4CAF50"; // Green for cellular packages
    } else if (title.toLowerCase().includes("plastic")) {
      return "#00BCD4"; // Cyan for plastic containers
    } else if (title.toLowerCase().includes("mixed")) {
      return "#FFC107"; // Amber for mixed packaging
    } else {
      return "#2196F3"; // Default blue
    }
  };

  // Format weight for display
  const formatWeight = (weight?: WeightUnits) => {
    if (!weight) return "N/A";
    return `${weight.lbs} lbs / ${weight.kg} kg`;
  };

  // Render quantity limitations
  const renderQuantityLimits = () => {
    const { maxOuterBoxCount, maxQuantity } = containerSpec;

    if (!maxOuterBoxCount && !maxQuantity) return null;

    return (
      <View style={styles.quantityContainer}>
        <Text style={styles.quantityTitle}>Quantity Limits:</Text>
        {maxOuterBoxCount && (
          <View style={styles.quantityItem}>
            <MaterialIcons
              name="inventory"
              size={16}
              color="#FF8F00"
              style={styles.quantityIcon}
            />
            <Text style={styles.quantityText}>
              Maximum {maxOuterBoxCount.toLocaleString()} primers per outside
              box
            </Text>
          </View>
        )}
        {maxQuantity && (
          <View style={styles.quantityItem}>
            <MaterialIcons
              name="inventory"
              size={16}
              color="#FF8F00"
              style={styles.quantityIcon}
            />
            <Text style={styles.quantityText}>
              Maximum {maxQuantity.toLocaleString()} items per container
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Render construction details
  const renderConstruction = () => {
    const { construction } = containerSpec;

    if (!construction || construction.length === 0) return null;

    return (
      <View style={styles.constructionContainer}>
        <Text style={styles.constructionTitle}>Construction Details:</Text>
        {construction.map((detail: string, index: number) => (
          <View key={`construction-${index}`} style={styles.constructionItem}>
            <MaterialIcons
              name="build"
              size={16}
              color="#5D4037"
              style={styles.constructionIcon}
            />
            <Text style={styles.constructionText}>{detail}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render inner packaging details
  const renderInnerPackaging = () => {
    const { innerPackaging } = containerSpec;

    if (!innerPackaging) return null;

    return (
      <View style={styles.innerContainer}>
        <Text style={styles.innerTitle}>Inner Packaging:</Text>
        {Array.isArray(innerPackaging) ? (
          innerPackaging.map((pkg: any, index: number) => (
            <View key={`inner-${index}`} style={styles.innerPackItem}>
              <View style={styles.innerPackHeader}>
                <MaterialIcons name="layers" size={16} color="#1565C0" />
                <Text style={styles.innerPackType}>
                  {pkg.type || "Package"}
                </Text>
              </View>

              {pkg.maxQuantity && (
                <Text style={styles.innerPackDetail}>
                  Maximum quantity: {pkg.maxQuantity} per container
                </Text>
              )}

              {pkg.midLevelPackaging && (
                <View style={styles.midLevelContainer}>
                  <Text style={styles.midLevelTitle}>Mid-level Packaging:</Text>
                  <Text style={styles.midLevelDetail}>
                    {pkg.midLevelPackaging.type}:{" "}
                    {pkg.midLevelPackaging.capacity}
                  </Text>
                </View>
              )}

              {pkg.outerPackaging && (
                <View style={styles.outerContainer}>
                  <Text style={styles.outerTitle}>Outer Packaging:</Text>
                  <Text style={styles.outerDetail}>
                    {pkg.outerPackaging.type}
                    {pkg.outerPackaging.capacity &&
                      `: ${pkg.outerPackaging.capacity}`}
                  </Text>
                </View>
              )}

              {pkg.safetyRequirements && pkg.safetyRequirements.length > 0 && (
                <View style={styles.safetyContainer}>
                  <Text style={styles.safetyTitle}>Safety Requirements:</Text>
                  {pkg.safetyRequirements.map(
                    (req: string, reqIndex: number) => (
                      <Text
                        key={`safety-${reqIndex}`}
                        style={styles.safetyText}
                      >
                        • {req}
                      </Text>
                    )
                  )}
                </View>
              )}

              {pkg.maxGrossWeight && (
                <Text style={styles.innerPackWeight}>
                  Max gross weight: {formatWeight(pkg.maxGrossWeight)}
                </Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.innerDescription}>
            {typeof innerPackaging === "string"
              ? innerPackaging
              : "See requirements for details"}
          </Text>
        )}
      </View>
    );
  };

  // Render container specifications
  const renderContainerSpecs = () => {
    const {
      spec,
      maxGrossWeight,
      maxNetWeight,
      netWeight,
      containerRequirements = [],
      requirements = [],
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

        {(maxGrossWeight || netWeight) && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Max Gross Weight:</Text>
            <Text style={styles.specValue}>
              {formatWeight(maxGrossWeight || netWeight)}
            </Text>
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

        {(containerRequirements.length > 0 || requirements.length > 0) && (
          <View style={styles.requirementsContainer}>
            <Text style={styles.requirementsTitle}>Requirements:</Text>
            {containerRequirements
              .concat(requirements)
              .map((req: string, index: number) => (
                <View key={`req-${index}`} style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{req}</Text>
                </View>
              ))}
          </View>
        )}

        {renderQuantityLimits()}
        {renderConstruction()}

        {containerSpec.handholeDimensions && (
          <View style={styles.dimensionsContainer}>
            <Text style={styles.dimensionsTitle}>Hand-hole Dimensions:</Text>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Width:</Text>
              <Text style={styles.dimensionValue}>
                Maximum {containerSpec.handholeDimensions.width.maximum.inches}{" "}
                in /{" "}
                {containerSpec.handholeDimensions.width.maximum.centimeters} cm
              </Text>
            </View>
            <View style={styles.dimensionItem}>
              <Text style={styles.dimensionLabel}>Height:</Text>
              <Text style={styles.dimensionValue}>
                Maximum {containerSpec.handholeDimensions.height.maximum.inches}{" "}
                in /{" "}
                {containerSpec.handholeDimensions.height.maximum.centimeters} cm
              </Text>
            </View>
          </View>
        )}

        {renderInnerPackaging()}

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

        {containerSpec.allowedWith && (
          <View style={styles.allowedContainer}>
            <Text style={styles.allowedTitle}>
              Mixed Packaging Allowed With:
            </Text>
            {containerSpec.allowedWith.map((item: string, index: number) => (
              <View key={`allowed-${index}`} style={styles.allowedItem}>
                <MaterialIcons
                  name="check-circle"
                  size={16}
                  color="#4CAF50"
                  style={styles.allowedIcon}
                />
                <Text style={styles.allowedText}>{item}</Text>
              </View>
            ))}
            {containerSpec.maxWeightPerContainer && (
              <View style={styles.weightLimitTag}>
                <MaterialIcons name="warning" size={14} color="#FFA000" />
                <Text style={styles.weightLimitText}>
                  Maximum {formatWeight(containerSpec.maxWeightPerContainer)} of
                  primers/caps per container
                </Text>
              </View>
            )}
          </View>
        )}

        {containerSpec.constructionNotes &&
          containerSpec.constructionNotes.length > 0 && (
            <View style={styles.constructionNotesContainer}>
              <Text style={styles.constructionNotesTitle}>
                Construction Notes:
              </Text>
              {containerSpec.constructionNotes.map(
                (note: string, index: number) => (
                  <View
                    key={`cnote-${index}`}
                    style={styles.constructionNoteItem}
                  >
                    <MaterialIcons
                      name="info"
                      size={16}
                      color="#0288D1"
                      style={styles.constructionNoteIcon}
                    />
                    <Text style={styles.constructionNoteText}>{note}</Text>
                  </View>
                )
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

        {containerSpec.maxOuterBoxCount && (
          <View style={styles.limitBadge}>
            <MaterialIcons name="inbox" size={14} color="#0D47A1" />
            <Text style={styles.limitText}>
              Max {containerSpec.maxOuterBoxCount.toLocaleString()} primers
            </Text>
          </View>
        )}
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
  limitBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#BBDEFB",
  },
  limitText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1565C0",
    marginLeft: 4,
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
  quantityContainer: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#FFB300",
  },
  quantityTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F57F17",
    marginBottom: 8,
  },
  quantityItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  quantityIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  quantityText: {
    flex: 1,
    fontSize: 14,
    color: "#E65100",
    lineHeight: 20,
  },
  constructionContainer: {
    marginTop: 8,
    marginBottom: 12,
    backgroundColor: "#EFEBE9",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#795548",
  },
  constructionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#5D4037",
    marginBottom: 8,
  },
  constructionItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  constructionIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  constructionText: {
    flex: 1,
    fontSize: 14,
    color: "#4E342E",
    lineHeight: 20,
  },
  dimensionsContainer: {
    marginTop: 12,
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 6,
  },
  dimensionsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 8,
  },
  dimensionItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  dimensionLabel: {
    width: 100,
    fontSize: 14,
    color: "#388E3C",
  },
  dimensionValue: {
    flex: 1,
    fontSize: 14,
    color: "#1B5E20",
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
  innerPackItem: {
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 4,
    padding: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#1976D2",
  },
  innerPackHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  innerPackType: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1565C0",
  },
  innerPackDetail: {
    fontSize: 13,
    color: "#283593",
    marginBottom: 4,
    marginLeft: 24,
  },
  innerPackWeight: {
    fontSize: 13,
    color: "#283593",
    marginTop: 6,
    marginLeft: 24,
    fontWeight: "500",
  },
  midLevelContainer: {
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  midLevelTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1976D2",
    marginBottom: 2,
  },
  midLevelDetail: {
    fontSize: 13,
    color: "#283593",
  },
  outerContainer: {
    marginLeft: 24,
    marginTop: 4,
    marginBottom: 4,
  },
  outerTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1976D2",
    marginBottom: 2,
  },
  outerDetail: {
    fontSize: 13,
    color: "#283593",
  },
  safetyContainer: {
    marginLeft: 24,
    marginTop: 6,
    backgroundColor: "#E8F5E9",
    padding: 6,
    borderRadius: 4,
  },
  safetyTitle: {
    fontSize: 13,
    fontWeight: "500",
    color: "#2E7D32",
    marginBottom: 2,
  },
  safetyText: {
    fontSize: 13,
    color: "#1B5E20",
    marginLeft: 4,
  },
  allowedContainer: {
    marginTop: 12,
    backgroundColor: "#F1F8E9",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#8BC34A",
  },
  allowedTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#33691E",
    marginBottom: 8,
  },
  allowedItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  allowedIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  allowedText: {
    flex: 1,
    fontSize: 14,
    color: "#33691E",
    lineHeight: 20,
  },
  weightLimitTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFDE7",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    marginTop: 8,
  },
  weightLimitText: {
    fontSize: 13,
    color: "#F57F17",
    marginLeft: 6,
    fontWeight: "500",
  },
  constructionNotesContainer: {
    marginTop: 12,
    backgroundColor: "#E1F5FE",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#03A9F4",
  },
  constructionNotesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#01579B",
    marginBottom: 8,
  },
  constructionNoteItem: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  constructionNoteIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  constructionNoteText: {
    flex: 1,
    fontSize: 14,
    color: "#01579B",
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
