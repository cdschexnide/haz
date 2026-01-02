import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ExplosiveRivetsSpecOptionProps {
  title: string;
  description?: string;
  unitContainers?: string[];
  maxExplosivePerRivet?: { mg: number };
  outerContainers?: {
    type: string;
    description?: string;
    approvedBy?: string[];
  }[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const ExplosiveRivetsSpecOption: React.FC<
  ExplosiveRivetsSpecOptionProps
> = ({
  title,
  description,
  unitContainers = [],
  maxExplosivePerRivet,
  outerContainers = [],
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
        {warningMessage && (
          <Text style={styles.warningText}>{warningMessage}</Text>
        )}
      </View>

      {description && (
        <Text style={[styles.description, disabled && styles.disabledText]}>
          {description}
        </Text>
      )}

      <View style={styles.detailsContainer}>
        {maxExplosivePerRivet && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Max Explosive Per Rivet:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {maxExplosivePerRivet.mg} mg
            </Text>
          </View>
        )}

        {unitContainers && unitContainers.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, disabled && styles.disabledText]}
            >
              Unit Containers:
            </Text>
            {unitContainers.map((container, index) => (
              <Text
                key={`unit-${index}`}
                style={[styles.listItem, disabled && styles.disabledText]}
              >
                • {container}
              </Text>
            ))}
          </View>
        )}

        {outerContainers && outerContainers.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, disabled && styles.disabledText]}
            >
              Approval Requirements:
            </Text>
            {outerContainers.map((container, index) => {
              if (!container) return null;
              return (
                <View key={`outer-${index}`} style={styles.containerInfo}>
                  {container.description && (
                    <Text
                      style={[
                        styles.containerDescription,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {container.description}
                    </Text>
                  )}
                  {container.approvedBy && container.approvedBy.length > 0 && (
                    <Text
                      style={[
                        styles.approvalText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      Approved by: {container.approvedBy.join(", ")}
                    </Text>
                  )}
                </View>
              );
            })}
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
    marginBottom: 8,
    alignItems: "center",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666666",
    width: 180,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 15,
    color: "#000000",
    flex: 1,
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
  listItem: {
    fontSize: 14,
    color: "#555555",
    marginBottom: 4,
    paddingLeft: 8,
  },
  containerInfo: {
    marginBottom: 8,
    paddingLeft: 8,
  },
  containerType: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
  },
  containerDescription: {
    fontSize: 14,
    color: "#555555",
    marginTop: 2,
  },
  approvalText: {
    fontSize: 13,
    color: "#666666",
    fontStyle: "italic",
    marginTop: 2,
  },
  disabledText: {
    color: "#9E9E9E",
  },
});
