import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface PracticeAmmoSpecOptionProps {
  title: string;
  closure?: string;
  requirements?: string[];
  examples?: string[];
  performanceRequirement?: string;
  dropTestHeight?: {
    feet: number;
    meters: number;
  };
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const PracticeAmmoSpecOption: React.FC<PracticeAmmoSpecOptionProps> = ({
  title,
  closure,
  requirements,
  examples,
  performanceRequirement,
  dropTestHeight,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Helper function to render requirements with bullets
  const renderRequirements = (reqs: string[]) => {
    return (
      <View style={styles.requirementsContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Requirements
        </Text>
        {reqs.map((req, index) => (
          <Text
            key={`req-${index}`}
            style={[styles.requirement, disabled && styles.disabledText]}
          >
            • {req}
          </Text>
        ))}
      </View>
    );
  };

  // Helper function to render examples with bullets
  const renderExamples = (exampleItems: string[]) => {
    return (
      <View style={styles.examplesContainer}>
        <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
          Examples:
        </Text>
        <View style={styles.examplesList}>
          {exampleItems.map((example, index) => (
            <Text
              key={`example-${index}`}
              style={[styles.exampleItem, disabled && styles.disabledText]}
            >
              • {example}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  // Helper function to render drop test height
  const renderDropTestHeight = (height: { feet: number; meters: number }) => {
    return (
      <View style={styles.infoRow}>
        <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
          Drop Test Height:
        </Text>
        <Text style={[styles.infoValue, disabled && styles.disabledText]}>
          {height.feet} ft / {height.meters} m
        </Text>
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
            {warningMessage ? (
              <Text style={styles.warningText}>
                <MaterialIcons name="error-outline" size={16} color="#D32F2F" />
                {" " + warningMessage}
              </Text>
            ) : null}
          </View>

          {/* Closure */}
          {closure ? (
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Closure:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {closure}
              </Text>
            </View>
          ) : null}

          {/* Examples */}
          {examples && examples.length > 0 ? renderExamples(examples) : null}

          {/* Performance Requirement */}
          {performanceRequirement ? (
            <View style={styles.performanceContainer}>
              <Text
                style={[styles.sectionTitle, disabled && styles.disabledText]}
              >
                Performance Requirement
              </Text>
              <Text
                style={[
                  styles.performanceText,
                  disabled && styles.disabledText,
                ]}
              >
                {performanceRequirement}
              </Text>
            </View>
          ) : null}

          {/* Drop Test Height */}
          {dropTestHeight ? renderDropTestHeight(dropTestHeight) : null}

          {/* Requirements */}
          {requirements && requirements.length > 0
            ? renderRequirements(requirements)
            : null}
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

      {disabled ? <View style={styles.disabledOverlay} /> : null}
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
    borderColor: "transparent",
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledCard: {
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  selectionContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 8,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
    flex: 1,
  },
  selectionCheckbox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6E6E6E",
    width: 110,
  },
  infoValue: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginTop: 10,
    marginBottom: 6,
  },
  requirementsContainer: {
    marginTop: 8,
  },
  requirement: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 4,
    paddingLeft: 4,
  },
  examplesContainer: {
    marginBottom: 6,
  },
  examplesList: {
    paddingLeft: 8,
  },
  exampleItem: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 2,
  },
  performanceContainer: {
    marginVertical: 8,
  },
  performanceText: {
    fontSize: 14,
    color: "#000000",
    fontStyle: "italic",
  },
  disabledText: {
    color: "#9E9E9E",
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "500",
    flex: 1,
    marginLeft: 4,
  },
  disabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderRadius: 8,
  },
});
