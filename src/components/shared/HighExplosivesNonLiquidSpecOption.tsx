import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

// Types for the component props
interface HighExplosivesNonLiquidContainerSpec {
  type: string;
  description?: string;
  spec?: string | string[];
  maxGrossWeight?: WeightUnits;
  packagingRequirements?: string[];
  bagRequirements?: string[];
  liningRequirements?: string[];
  applicableSubparagraphs?: string[];
  notes?: string[];
}

interface HighExplosivesNonLiquidSpecOptionProps {
  title: string;
  description?: string;
  containerSpec: HighExplosivesNonLiquidContainerSpec;
  applicableSubparagraphs?: string[];
  packagingRequirements?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

/**
 * Specialized component for displaying options related to A27.18.4-12 High Explosives
 * with no liquid explosive ingredient nor any chlorate.
 */
export const HighExplosivesNonLiquidSpecOption: React.FC<
  HighExplosivesNonLiquidSpecOptionProps
> = ({
  title,
  description,
  containerSpec,
  applicableSubparagraphs = [],
  packagingRequirements = [],
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = (e: any) => {
    e.stopPropagation();
    setExpanded(!expanded);
  };

  // Map of subparagraph codes to their descriptions
  const subparagraphDescriptions: Record<string, string> = {
    "A27.18.4.": "High explosives packaged in bags of strong paper",
    "A27.18.5.": "Lined high explosives packed in boxes",
    "A27.18.6.": "Gelatine explosives in cartridges or bags",
    "A27.18.7.": "Cartridges of high explosives exceeding 4 inches in length",
    "A27.18.8.": "Prevention of movement within boxes",
    "A27.18.9.": "High explosive (dynamite) in bags or cartridges",
    "A27.18.10.": "Liquid high explosives in DOT 15L and 15M wooden boxes",
    "A27.18.11.": "High explosives with liquid explosive ingredients",
    "A27.18.12.": "High explosives with no liquid explosive ingredient",
  };

  // Function to render a regulation description
  const renderRegulationDescription = (code: string) => {
    switch (code) {
      case "A27.18.4.":
        return "High explosive packaged bags made of strong paper of equally efficient material so treated or of such nature that it does not absorb the liquid ingredient of the explosive.";
      case "A27.18.5.":
        return "Line high explosives packed in boxes with strong, paraffined paper or other suitable material. Ensure the lining is without joints or other openings or with cemented joints at the bottom, ends, or sides of the boxes. For explosives with liquid ingredients, ensure the lining is impervious to such ingredients and also to water. Protect box covers from contact with explosives by lining paper or other suitable material.";
      case "A27.18.6.":
        return "Pack gelatine explosives in cartridges or bags with dry fine wood pulp or sawdust at least ¼ of an inch in depth spread over the bottom of the box or the bottom of the box may have a full area pad formed of an absorptive cellulose sheet which has a nitroglycerin absorptive value equivalent to sawdust as specified. Similar materials are required in boxes for packing all non-gelatinous types of explosives containing 30 percent or more of liquid explosive ingredient.";
      case "A27.18.7.":
        return "Except for high explosive (gelatin dynamite) in cartridges, place all cartridges of high explosives exceeding 4 inches in length and containing more than 10 percent of a liquid explosive ingredient horizontally in boxes. Pack bags with their filling holes up.";
      case "A27.18.8.":
        return "Prevent movement of high explosives contained in cartridges and bags within the boxes by sufficiently tight packing.";
      case "A27.18.9.":
        return "High explosive (dynamite), except gelatin dynamite, packed in bags or in cartridges over 2 inches in diameter and containing not more than 30 percent liquid explosive ingredients may be packed in outer packagings without sawdust and without lining paper, provided each inside or outer packaging is siftproof and is treated to prevent penetration by the commodity with which the container is filled for shipping.";
      case "A27.18.10.":
        return "Pack liquid high explosives in DOT 15L wooden boxes and DOT 15M wooden boxes. The inside metal containers in the DOT 15M containers cannot contain more than 10 quarts of liquid explosives each.";
      case "A27.18.11.":
        return "High Explosives with Liquid Explosive Ingredients - various packaging requirements based on percentage of liquid explosive ingredients.";
      case "A27.18.12.":
        return "High explosives with no liquid explosive ingredient and propellant explosives, class A - specific packaging requirements including wooden boxes, fiberboard boxes, and polyethylene bag requirements.";
      default:
        return "";
    }
  };

  // Get a simplified key summary of each subparagraph for display in badges
  const getSubparagraphKeyPoints = (code: string) => {
    switch (code) {
      case "A27.18.4.":
        return "Bags";
      case "A27.18.5.":
        return "Lined boxes";
      case "A27.18.6.":
        return "Gelatine explosives";
      case "A27.18.7.":
        return "Cartridge placement";
      case "A27.18.8.":
        return "Movement prevention";
      case "A27.18.9.":
        return "Dynamite packaging";
      case "A27.18.10.":
        return "Liquid explosives";
      case "A27.18.11.":
        return "Liquid ingredients";
      case "A27.18.12.":
        return "Non-liquid explosives";
      default:
        return code;
    }
  };

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
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              isSelected && styles.selectedTitle,
              disabled && styles.disabledText,
            ]}
          >
            {title}
          </Text>
          {description && (
            <Text
              style={[
                styles.description,
                isSelected && styles.selectedDescription,
                disabled && styles.disabledText,
              ]}
            >
              {description}
            </Text>
          )}
          {warningMessage && (
            <View style={styles.warningContainer}>
              <Text style={styles.warningText}>{warningMessage}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={styles.expandButton}
          onPress={toggleExpand}
          disabled={disabled}
        >
          <Text
            style={[
              styles.expandButtonText,
              disabled && styles.disabledText,
              expanded && styles.expandButtonTextExpanded,
            ]}
          >
            {expanded ? "−" : "+"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.expandedContent}>
          {/* Header Section */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>
              High Explosives (No Liquid Ingredients)
            </Text>
            <View style={styles.badgesContainer}>
              {applicableSubparagraphs.map((code, index) => (
                <View key={index} style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {getSubparagraphKeyPoints(code)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Applicable Regulations Section */}
          <View style={styles.regulationsSection}>
            <Text style={styles.regulationsSectionTitle}>
              Applicable Regulations
            </Text>
            {applicableSubparagraphs.length > 0 ? (
              applicableSubparagraphs.map((code, index) => (
                <View key={index} style={styles.regulationBlock}>
                  <View style={styles.regulationHeader}>
                    <Text style={styles.regulationCode}>{code}</Text>
                    <Text style={styles.regulationTitle}>
                      {subparagraphDescriptions[code] || ""}
                    </Text>
                  </View>
                  <Text style={styles.regulationText}>
                    {renderRegulationDescription(code)}
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.noRegulationsText}>
                No specific subparagraphs applicable to this container.
              </Text>
            )}
          </View>

          {/* Packaging Requirements Section */}
          {packagingRequirements && packagingRequirements.length > 0 && (
            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsSectionTitle}>
                Packaging Requirements
              </Text>
              <View style={styles.requirementsList}>
                {packagingRequirements.map((requirement, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Container Information Section */}
          <View style={styles.containerSection}>
            <Text style={styles.containerSectionTitle}>
              Container Information
            </Text>

            {containerSpec.maxGrossWeight && (
              <View style={styles.specDetail}>
                <Text style={styles.specLabel}>Maximum Gross Weight:</Text>
                <Text style={styles.specValue}>
                  {containerSpec.maxGrossWeight.lbs} lbs /{" "}
                  {containerSpec.maxGrossWeight.kg} kg
                </Text>
              </View>
            )}

            {containerSpec.spec && (
              <View style={styles.specDetail}>
                <Text style={styles.specLabel}>Specifications:</Text>
                <Text style={styles.specValue}>
                  {Array.isArray(containerSpec.spec)
                    ? containerSpec.spec.join(", ")
                    : containerSpec.spec}
                </Text>
              </View>
            )}

            {containerSpec.packagingRequirements &&
              containerSpec.packagingRequirements.length > 0 && (
                <View style={styles.specDetailsList}>
                  <Text style={styles.specLabel}>Container Requirements:</Text>
                  {containerSpec.packagingRequirements.map((req, index) => (
                    <View key={index} style={styles.specListItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.specValue}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

            {containerSpec.bagRequirements &&
              containerSpec.bagRequirements.length > 0 && (
                <View style={styles.specDetailsList}>
                  <Text style={styles.specLabel}>Bag Requirements:</Text>
                  {containerSpec.bagRequirements.map((req, index) => (
                    <View key={index} style={styles.specListItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.specValue}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

            {containerSpec.liningRequirements &&
              containerSpec.liningRequirements.length > 0 && (
                <View style={styles.specDetailsList}>
                  <Text style={styles.specLabel}>Lining Requirements:</Text>
                  {containerSpec.liningRequirements.map((req, index) => (
                    <View key={index} style={styles.specListItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.specValue}>{req}</Text>
                    </View>
                  ))}
                </View>
              )}

            {containerSpec.notes && containerSpec.notes.length > 0 && (
              <View style={styles.specDetailsList}>
                <Text style={styles.specLabel}>Notes:</Text>
                {containerSpec.notes.map((note, index) => (
                  <View key={index} style={styles.specListItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.specValue}>{note}</Text>
                  </View>
                ))}
              </View>
            )}
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
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledContainer: {
    opacity: 0.7,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  selectedTitle: {
    color: "#007AFF",
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginTop: 4,
  },
  selectedDescription: {
    color: "#4D9AFF",
  },
  disabledText: {
    color: "#999999",
  },
  expandButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  expandButtonText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#666666",
  },
  expandButtonTextExpanded: {
    color: "#007AFF",
  },
  warningContainer: {
    backgroundColor: "#FFF3E0",
    borderRadius: 4,
    padding: 6,
    marginTop: 6,
  },
  warningText: {
    fontSize: 12,
    color: "#FF9800",
  },
  expandedContent: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  sectionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
    flexWrap: "wrap",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginRight: 8,
    flex: 1,
  },
  badgesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    maxWidth: "60%",
  },
  badge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    margin: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  regulationsSection: {
    marginBottom: 16,
  },
  regulationsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  regulationBlock: {
    backgroundColor: "#FFF8E1",
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  regulationHeader: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "center",
  },
  regulationCode: {
    fontSize: 14,
    fontWeight: "700",
    color: "#795548",
    marginRight: 8,
  },
  regulationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555555",
    flex: 1,
  },
  regulationText: {
    fontSize: 13,
    color: "#333333",
    lineHeight: 18,
  },
  noRegulationsText: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#666666",
  },
  requirementsSection: {
    marginBottom: 16,
  },
  requirementsSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  requirementsList: {
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
    padding: 12,
  },
  requirementItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  containerSection: {
    marginTop: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    padding: 12,
  },
  containerSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  specDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    width: 160,
  },
  specValue: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
  },
  specDetailsList: {
    marginBottom: 8,
  },
  specListItem: {
    flexDirection: "row",
    marginTop: 4,
    paddingLeft: 12,
    alignItems: "flex-start",
  },
});
