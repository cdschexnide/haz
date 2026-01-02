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

interface ExplosiveBombMineSpecOptionProps {
  title: string;
  description: string;
  containerSpec: any;
  subparagraphReference?: string;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const ExplosiveBombMineSpecOption: React.FC<
  ExplosiveBombMineSpecOptionProps
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
    if (title.toLowerCase().includes("wooden")) {
      return "#795548"; // Brown for wooden containers
    } else if (title.toLowerCase().includes("metal")) {
      return "#607D8B"; // Blue-gray for metal containers
    } else if (title.toLowerCase().includes("plastic")) {
      return "#00BCD4"; // Cyan for plastic containers
    } else if (title.toLowerCase().includes("plywood")) {
      return "#8D6E63"; // Light brown for plywood
    } else if (title.toLowerCase().includes("pallet")) {
      return "#5D4037"; // Dark brown for pallets
    } else if (title.toLowerCase().includes("drum")) {
      return "#455A64"; // Dark blue-gray for drums
    } else if (title.toLowerCase().includes("unboxed")) {
      return "#FFA000"; // Amber for unboxed items
    } else {
      return "#2196F3"; // Default blue
    }
  };

  // Format weight for display
  const formatWeight = (weight?: WeightUnits) => {
    if (!weight) return "N/A";
    return `${weight.lbs} lbs / ${weight.kg} kg`;
  };

  // Render item details
  const renderItems = () => {
    const { items, item } = containerSpec;

    if (!items && !item) return null;

    return (
      <View style={styles.itemsContainer}>
        <Text style={styles.itemsTitle}>Applicable For:</Text>
        {items ? (
          items.map((itemName: string, index: number) => (
            <View key={`item-${index}`} style={styles.itemRow}>
              <MaterialIcons
                name="layers"
                size={16}
                color="#455A64"
                style={styles.itemIcon}
              />
              <Text style={styles.itemText}>{itemName}</Text>
            </View>
          ))
        ) : (
          <View style={styles.itemRow}>
            <MaterialIcons
              name="layers"
              size={16}
              color="#455A64"
              style={styles.itemIcon}
            />
            <Text style={styles.itemText}>{item}</Text>
          </View>
        )}
      </View>
    );
  };

  // Render shipping notes
  const renderShippingNotes = () => {
    const { shippingNotes } = containerSpec;

    if (!shippingNotes || shippingNotes.length === 0) return null;

    return (
      <View style={styles.notesContainer}>
        <Text style={styles.notesTitle}>Shipping Notes:</Text>
        {shippingNotes.map((note: string, index: number) => (
          <View key={`note-${index}`} style={styles.noteRow}>
            <MaterialIcons
              name="info"
              size={16}
              color="#0288D1"
              style={styles.noteIcon}
            />
            <Text style={styles.noteText}>{note}</Text>
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
        <Text style={styles.innerDescription}>
          {innerPackaging.description}
        </Text>
      </View>
    );
  };

  // Render configuration details
  const renderConfiguration = () => {
    const { configuration } = containerSpec;

    if (!configuration) return null;

    return (
      <View style={styles.configContainer}>
        <Text style={styles.configTitle}>Configuration:</Text>
        <Text style={styles.configDescription}>{configuration}</Text>
      </View>
    );
  };

  // Render notes
  const renderNotes = () => {
    const { notes } = containerSpec;

    if (!notes || notes.length === 0) return null;

    return (
      <View style={styles.generalNotesContainer}>
        <Text style={styles.generalNotesTitle}>Notes:</Text>
        {notes.map((note: string, index: number) => (
          <View key={`gnote-${index}`} style={styles.generalNoteRow}>
            <View style={styles.bulletPoint} />
            <Text style={styles.generalNoteText}>{note}</Text>
          </View>
        ))}
      </View>
    );
  };

  // Render exceptions
  const renderExceptions = () => {
    const { isException, exceptionDetails } = containerSpec;

    if (!isException) return null;

    return (
      <View style={styles.exceptionContainer}>
        <Text style={styles.exceptionTitle}>Exception:</Text>
        <View style={styles.exceptionContent}>
          <Text style={styles.exceptionCondition}>
            {exceptionDetails.condition}
          </Text>
          <Text style={styles.exceptionPackaging}>
            {exceptionDetails.packaging}
          </Text>
        </View>
      </View>
    );
  };

  // Render container specifications
  const renderContainerSpecs = () => {
    const { containerType, maxGrossWeight } = containerSpec;

    return (
      <View style={styles.detailsContainer}>
        {containerType && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Container Type:</Text>
            <Text style={styles.specValue}>{containerType}</Text>
          </View>
        )}

        {maxGrossWeight && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Max Gross Weight:</Text>
            <Text style={styles.specValue}>{formatWeight(maxGrossWeight)}</Text>
          </View>
        )}

        {subparagraphReference && (
          <View style={styles.specRow}>
            <Text style={styles.specLabel}>Reference:</Text>
            <Text style={styles.specValue}>{subparagraphReference}</Text>
          </View>
        )}

        {renderItems()}
        {renderShippingNotes()}
        {renderInnerPackaging()}
        {renderConfiguration()}
        {renderNotes()}
        {renderExceptions()}
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
              <Text style={styles.badgeText}>
                {containerSpec.item
                  ? containerSpec.item.split(" ")[0]
                  : containerSpec.items
                  ? "Multiple"
                  : title.split(" ")[0]}
              </Text>
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

        {containerSpec.maxGrossWeight && (
          <View style={styles.weightBadge}>
            <Text style={styles.weightText}>
              Max {formatWeight(containerSpec.maxGrossWeight)}
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
  weightBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#FFCDD2",
  },
  weightText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#D32F2F",
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
  itemsContainer: {
    marginTop: 12,
    marginBottom: 12,
    backgroundColor: "#ECEFF1",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#607D8B",
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#455A64",
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  itemIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  itemText: {
    flex: 1,
    fontSize: 14,
    color: "#263238",
    lineHeight: 20,
  },
  notesContainer: {
    marginTop: 12,
    backgroundColor: "#E1F5FE",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#03A9F4",
  },
  notesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0277BD",
    marginBottom: 8,
  },
  noteRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  noteIcon: {
    marginRight: 6,
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: "#01579B",
    lineHeight: 20,
  },
  innerContainer: {
    marginTop: 12,
    backgroundColor: "#E8F5E9",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#4CAF50",
  },
  innerTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#2E7D32",
    marginBottom: 6,
  },
  innerDescription: {
    fontSize: 14,
    color: "#1B5E20",
    lineHeight: 20,
  },
  configContainer: {
    marginTop: 12,
    backgroundColor: "#F3E5F5",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#9C27B0",
  },
  configTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6A1B9A",
    marginBottom: 6,
  },
  configDescription: {
    fontSize: 14,
    color: "#4A148C",
    lineHeight: 20,
  },
  generalNotesContainer: {
    marginTop: 12,
  },
  generalNotesTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  generalNoteRow: {
    flexDirection: "row",
    marginBottom: 4,
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
  generalNoteText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  exceptionContainer: {
    marginTop: 12,
    backgroundColor: "#FFF8E1",
    padding: 12,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: "#FFC107",
  },
  exceptionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#F57F17",
    marginBottom: 8,
  },
  exceptionContent: {
    paddingLeft: 4,
  },
  exceptionCondition: {
    fontSize: 14,
    fontWeight: "500",
    color: "#E65100",
    marginBottom: 4,
  },
  exceptionPackaging: {
    fontSize: 14,
    color: "#E65100",
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
