import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

interface SmallArmsAmmunitionSpecOptionProps {
  title: string;
  description?: string;
  containerSpec?: any;
  innerPackagingTypes?: string[];
  innerPackagingRequirements?: string[];
  outerPackagingTypes?: string[];
  outerPackagingRequirements?: string[];
  bulkPackagingInfo?: {
    applicableTo?: string;
    type?: string;
    requirements?: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const SmallArmsAmmunitionSpecOption: React.FC<
  SmallArmsAmmunitionSpecOptionProps
> = ({
  title,
  description = "Small Arms Ammunition and Tear Gas Cartridges",
  containerSpec,
  innerPackagingTypes = [
    "Pasteboard boxes",
    "Other boxes",
    "Partitions",
    "Metal clips",
  ],
  innerPackagingRequirements = [
    "Must fit snugly and protect primers from accidental damage",
  ],
  outerPackagingTypes = [
    "Wooden boxes",
    "Fiberboard boxes",
    "Metal containers",
  ],
  outerPackagingRequirements = [
    "Securely closed",
    "Must hold inside boxes, partitions, or metal clips",
  ],
  bulkPackagingInfo = {
    applicableTo: "Blank industrial power load cartridges",
    type: "Fiberboard boxes",
    requirements: ["Securely closed"],
  },
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
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
          <View style={styles.titleSection}>
            <Text style={[styles.title, disabled && styles.disabledText]}>
              {title}
            </Text>
            <Text style={[styles.description, disabled && styles.disabledText]}>
              {description}
            </Text>
          </View>
          <View
            style={[
              styles.selectionIndicator,
              isSelected && styles.selectionIndicatorSelected,
            ]}
          />
        </View>

        {warningMessage && (
          <View style={styles.warningContainer}>
            <Text style={styles.warningText}>{warningMessage}</Text>
          </View>
        )}

        <View style={styles.contentContainer}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Inner Packaging Options:</Text>
            <View style={styles.bulletList}>
              {innerPackagingTypes.map((item, index) => (
                <Text
                  key={`inner-type-${index}`}
                  style={[styles.bulletItem, disabled && styles.disabledText]}
                >
                  • {item}
                </Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Inner Packaging Requirements:</Text>
            <View style={styles.bulletList}>
              {innerPackagingRequirements.map((item, index) => (
                <Text
                  key={`inner-req-${index}`}
                  style={[styles.bulletItem, disabled && styles.disabledText]}
                >
                  • {item}
                </Text>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Outer Packaging Options:</Text>
            <View style={styles.bulletList}>
              {outerPackagingTypes.map((item, index) => (
                <Text
                  key={`outer-type-${index}`}
                  style={[styles.bulletItem, disabled && styles.disabledText]}
                >
                  • {item}
                </Text>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Outer Packaging Requirements:</Text>
            <View style={styles.bulletList}>
              {outerPackagingRequirements.map((item, index) => (
                <Text
                  key={`outer-req-${index}`}
                  style={[styles.bulletItem, disabled && styles.disabledText]}
                >
                  • {item}
                </Text>
              ))}
            </View>
          </View>

          {bulkPackagingInfo && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bulk Packaging:</Text>
              <Text style={[styles.bulletItem, disabled && styles.disabledText]}>
                • For: {bulkPackagingInfo.applicableTo}
              </Text>
              <Text style={[styles.bulletItem, disabled && styles.disabledText]}>
                • Type: {bulkPackagingInfo.type}
              </Text>
              <View style={styles.bulletList}>
                {bulkPackagingInfo.requirements?.map((item, index) => (
                  <Text
                    key={`bulk-req-${index}`}
                    style={[styles.bulletItem, disabled && styles.disabledText]}
                  >
                    • Requirement: {item}
                  </Text>
                ))}
              </View>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    marginBottom: 12,
    overflow: "hidden",
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
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleSection: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666666",
  },
  selectionIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#007AFF",
    marginLeft: 8,
  },
  selectionIndicatorSelected: {
    backgroundColor: "#007AFF",
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
    marginTop: 8,
  },
  bulletList: {
    marginLeft: 8,
  },
  bulletItem: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 4,
    lineHeight: 20,
  },
  disabledText: {
    color: "#999999",
  },
  warningContainer: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    borderLeftWidth: 4,
    borderLeftColor: "#FFC107",
  },
  warningText: {
    color: "#856404",
    fontSize: 14,
  },
});

export default SmallArmsAmmunitionSpecOption;
