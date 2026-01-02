import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

// Types to represent the High Explosives Liquids data structure
interface AbsorbentRequirement {
  material: string;
  description: string;
}

interface MoistureLimitation {
  material: string;
  maximumPercentage: string;
}

interface LiquidExplosiveContainerSpec {
  type: string;
  description?: string;
  spec?: string | string[];
  maxGrossWeight?: WeightUnits;
  requirements?: string[];
  notes?: string[];
}

interface HighExplosivesLiquidsSpecOptionProps {
  title: string;
  description?: string;
  containerSpec: LiquidExplosiveContainerSpec;
  liquidRequirements?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

/**
 * Specialized component for displaying options related to A27.18.1 High Explosives
 * with liquid ingredients that require absorbent material.
 */
export const HighExplosivesLiquidsSpecOption: React.FC<
  HighExplosivesLiquidsSpecOptionProps
> = ({
  title,
  description,
  containerSpec,
  liquidRequirements = [],
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
          {/* A27.18.1 Information header */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>High Explosives, Liquids</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>A27.18.1</Text>
            </View>
          </View>

          {/* A27.18.1 full regulation text */}
          <View style={styles.regulationBlock}>
            <Text style={styles.regulationText}>
              A27.18.1. High explosives, consisting of a liquid mixed with an
              absorbent material, require the absorbent (wood pulp or similar
              material) in sufficient quantity and be of satisfactory quality,
              and properly dried at the time of mixing. Ensure the nitrate of
              soda is dried at the time of mixing to less than 1 percent of
              moisture; and the ingredients are uniformly mixed so that the
              liquid remains thoroughly absorbed under the most unfavorable
              atmospheric conditions incident to transportation.
            </Text>
          </View>

          {/* A27.18.1 Specific Requirements - This is what the paragraph actually specifies */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>
              Special Requirements for Liquid High Explosives
            </Text>
            <Text style={styles.infoDescription}>
              A27.18.1 specifies requirements for the absorbent material and
              handling of high explosives with liquid components. These
              requirements must be followed regardless of the packaging
              container selected.
            </Text>
          </View>

          {/* Requirements section */}
          <View style={styles.requirementsSection}>
            <Text style={styles.requirementsSectionTitle}>
              Liquid Requirements
            </Text>
            <View style={styles.requirementsList}>
              {liquidRequirements.map((requirement, index) => (
                <View key={index} style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>{requirement}</Text>
                </View>
              ))}
              {liquidRequirements.length === 0 && (
                <View style={styles.requirementItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.requirementText}>
                    Absorbent material must be sufficient and properly dried
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Container Information section */}
          <View style={styles.containerSection}>
            <Text style={styles.containerSectionTitle}>
              Container Information
            </Text>
            <Text style={styles.containerNote}>
              Note: A27.18.1 specifies requirements for handling liquid high
              explosives. Container options are based on general high explosives
              packaging requirements.
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

            {containerSpec.requirements &&
              containerSpec.requirements.length > 0 && (
                <View style={styles.specDetailsList}>
                  <Text style={styles.specLabel}>Container Requirements:</Text>
                  {containerSpec.requirements.map((req, index) => (
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
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
  },
  badge: {
    backgroundColor: "#FFCA28",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333333",
  },
  regulationBlock: {
    backgroundColor: "#FFF3E0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: "#FFB74D",
  },
  regulationText: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
  },
  infoBlock: {
    backgroundColor: "#FFF3E0",
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  infoBlockTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#E65100",
    marginBottom: 6,
  },
  infoDescription: {
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
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
    backgroundColor: "#FAFAFA",
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
    backgroundColor: "#FF9800",
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
  containerNote: {
    fontSize: 14,
    color: "#666666",
    fontStyle: "italic",
    marginBottom: 12,
  },
  specDetail: {
    flexDirection: "row",
    marginBottom: 8,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333333",
    width: 120,
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
