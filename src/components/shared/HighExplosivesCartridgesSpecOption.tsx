import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

// Types to represent the High Explosives Cartridges data structure
interface ShellMaterial {
  name: string;
  description?: string;
}

interface CartridgeRequirement {
  description: string;
}

interface ExplosiveCartridgeContainerSpec {
  type: string;
  description?: string;
  spec?: string | string[];
  maxGrossWeight?: WeightUnits;
  shellMaterials?: string[];
  requirements?: string[];
  notes?: string[];
}

interface HighExplosivesCartridgesSpecOptionProps {
  title: string;
  description?: string;
  containerSpec: ExplosiveCartridgeContainerSpec;
  cartridgeRequirements?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

/**
 * Specialized component for displaying options related to A27.18.3 High Explosives
 * cartridges with specific shell requirements.
 */
export const HighExplosivesCartridgesSpecOption: React.FC<
  HighExplosivesCartridgesSpecOptionProps
> = ({
  title,
  description,
  containerSpec,
  cartridgeRequirements = [],
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
          {/* A27.18.3 Information header */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>High Explosive Cartridges</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>A27.18.3</Text>
            </View>
          </View>

          {/* A27.18.3 full regulation text */}
          <View style={styles.regulationBlock}>
            <Text style={styles.regulationText}>
              A27.18.3. High explosive cartridges consist of a column of
              explosives completely enclosed in a shell made of strong paper or
              polyethylene or a combination of paper and polyethylene, treated
              so that it does not absorb the liquid ingredient of the explosive.
            </Text>
          </View>

          {/* A27.18.3 Specific Requirements - This is what the paragraph actually specifies */}
          <View style={styles.infoBlock}>
            <Text style={styles.infoBlockTitle}>
              Special Requirements for High Explosive Cartridges
            </Text>
            <Text style={styles.infoDescription}>
              A27.18.3 specifies requirements for the shell material enclosing
              high explosive cartridges. These requirements ensure proper
              containment of the explosive material, particularly for cartridges
              containing liquid ingredients.
            </Text>
          </View>

          {/* Shell Material Requirements section */}
          <View style={styles.requirementsSection}>
            <Text style={styles.requirementsSectionTitle}>
              Shell Material Requirements
            </Text>
            <View style={styles.materialsList}>
              <View style={styles.materialItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.materialText}>
                  Must be made of strong paper, polyethylene, or a combination
                  of paper and polyethylene
                </Text>
              </View>
              <View style={styles.materialItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.materialText}>
                  Must completely enclose the column of explosives
                </Text>
              </View>
              <View style={styles.materialItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.materialText}>
                  Must be treated to prevent absorption of any liquid explosive
                  ingredients
                </Text>
              </View>
            </View>
          </View>

          {/* Additional Cartridge Requirements */}
          {cartridgeRequirements && cartridgeRequirements.length > 0 && (
            <View style={styles.requirementsSection}>
              <Text style={styles.requirementsSectionTitle}>
                Additional Requirements
              </Text>
              <View style={styles.requirementsList}>
                {cartridgeRequirements.map((requirement, index) => (
                  <View key={index} style={styles.requirementItem}>
                    <View style={styles.bulletPoint} />
                    <Text style={styles.requirementText}>{requirement}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Container Information section */}
          <View style={styles.containerSection}>
            <Text style={styles.containerSectionTitle}>
              Container Information
            </Text>
            <Text style={styles.containerNote}>
              Note: A27.18.3 specifies requirements for high explosive cartridge
              construction. The container options below are for packaging these
              pre-enclosed cartridges.
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

            {containerSpec.shellMaterials &&
              containerSpec.shellMaterials.length > 0 && (
                <View style={styles.specDetailsList}>
                  <Text style={styles.specLabel}>
                    Approved Shell Materials:
                  </Text>
                  {containerSpec.shellMaterials.map((material, index) => (
                    <View key={index} style={styles.specListItem}>
                      <View style={styles.bulletPoint} />
                      <Text style={styles.specValue}>{material}</Text>
                    </View>
                  ))}
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
  materialsList: {
    backgroundColor: "#F0F8FF",
    borderRadius: 6,
    padding: 12,
  },
  materialItem: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  materialText: {
    flex: 1,
    fontSize: 14,
    color: "#333333",
    lineHeight: 20,
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
