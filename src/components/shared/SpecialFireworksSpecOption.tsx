import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface SpecialFireworksSpecOptionProps {
  title: string;
  description: string;
  containerSpec: any;
  fireworksType?: string[];
  packagingRequirements?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const SpecialFireworksSpecOption: React.FC<
  SpecialFireworksSpecOptionProps
> = ({
  title,
  description,
  containerSpec,
  fireworksType = [],
  packagingRequirements = [],
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
        <View style={styles.headerRow}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            {isSelected && (
              <MaterialIcons name="check-circle" size={24} color="#007AFF" />
            )}
          </View>
          {disabled && warningMessage && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>{warningMessage}</Text>
            </View>
          )}
        </View>

        {description && <Text style={styles.description}>{description}</Text>}

        {containerSpec?.maxGrossWeight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Gross Weight:</Text>
            <Text style={styles.infoValue}>
              {containerSpec.maxGrossWeight.lbs} lbs (
              {containerSpec.maxGrossWeight.kg} kg)
            </Text>
          </View>
        )}

        {fireworksType.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Fireworks Types:</Text>
            {fireworksType.map((type, index) => (
              <Text key={index} style={styles.bulletItem}>
                • {type}
              </Text>
            ))}
          </View>
        )}

        {containerSpec?.spec && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Container Specification:</Text>
            <Text style={styles.infoValue}>
              {Array.isArray(containerSpec.spec)
                ? containerSpec.spec.join(", ")
                : containerSpec.spec}
            </Text>
          </View>
        )}

        {packagingRequirements.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Packaging Requirements:</Text>
            {packagingRequirements.map((req, index) => (
              <Text key={index} style={styles.bulletItem}>
                • {req}
              </Text>
            ))}
          </View>
        )}

        {containerSpec?.notes && containerSpec.notes.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            {containerSpec.notes.map((note: string, index: number) => (
              <Text key={index} style={styles.bulletItem}>
                • {note}
              </Text>
            ))}
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
    borderWidth: 1,
    borderColor: "#E0E0E0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedContainer: {
    borderColor: "#007AFF",
    borderWidth: 2,
  },
  disabledContainer: {
    opacity: 0.6,
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
    marginRight: 8,
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: "#666666",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    marginVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    width: 150,
  },
  infoValue: {
    fontSize: 14,
    flex: 1,
  },
  sectionContainer: {
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  bulletItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 2,
  },
  warningBadge: {
    backgroundColor: "#FFEBEE",
    borderRadius: 4,
    padding: 4,
    maxWidth: 150,
  },
  warningText: {
    fontSize: 12,
    color: "#D32F2F",
    textAlign: "center",
  },
});
