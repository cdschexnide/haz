import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface RailwayTorpedoesSpecOptionProps {
  title: string;
  description: string;
  specs?: string[];
  maxNetWeight?: {
    lbs: number;
    kg: number;
  };
  maxGrossWeight?: {
    lbs: number;
    kg: number;
  };
  maxQuantity?: number;
  innerPackaging?: {
    type: string;
    maxQuantity?: number;
    description?: string;
  };
  minDimension?: {
    inches: number;
    centimeters: number;
  };
  requirements?: string[];
  notes?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
  referenceSection?: string;
}

export const RailwayTorpedoesSpecOption: React.FC<
  RailwayTorpedoesSpecOptionProps
> = ({
  title,
  description,
  specs,
  maxNetWeight,
  maxGrossWeight,
  maxQuantity,
  innerPackaging,
  minDimension,
  requirements,
  notes,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
  referenceSection,
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

        {referenceSection && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Reference:</Text>
            <Text style={styles.infoValue}>{referenceSection}</Text>
          </View>
        )}

        {specs && specs.length > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Specifications:</Text>
            <Text style={styles.infoValue}>{specs.join(", ")}</Text>
          </View>
        )}

        {maxNetWeight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Net Weight:</Text>
            <Text style={styles.infoValue}>
              {maxNetWeight.lbs} lbs ({maxNetWeight.kg} kg)
            </Text>
          </View>
        )}

        {maxGrossWeight && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Gross Weight:</Text>
            <Text style={styles.infoValue}>
              {maxGrossWeight.lbs} lbs ({maxGrossWeight.kg} kg)
            </Text>
          </View>
        )}

        {maxQuantity && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Max Quantity:</Text>
            <Text style={styles.infoValue}>{maxQuantity} torpedoes</Text>
          </View>
        )}

        {minDimension && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Min Dimension:</Text>
            <Text style={styles.infoValue}>
              {minDimension.inches} inches ({minDimension.centimeters} cm)
            </Text>
          </View>
        )}

        {innerPackaging && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Inner Packaging:</Text>
            <View style={styles.indent}>
              {innerPackaging.type && (
                <Text style={styles.bulletItem}>
                  • Type: {innerPackaging.type}
                </Text>
              )}
              {innerPackaging.maxQuantity && (
                <Text style={styles.bulletItem}>
                  • Max Quantity: {innerPackaging.maxQuantity} torpedoes per
                  carton
                </Text>
              )}
              {innerPackaging.description && (
                <Text style={styles.bulletItem}>
                  • {innerPackaging.description}
                </Text>
              )}
            </View>
          </View>
        )}

        {requirements && requirements.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Requirements:</Text>
            {requirements.map((req, index) => (
              <Text key={index} style={styles.bulletItem}>
                • {req}
              </Text>
            ))}
          </View>
        )}

        {notes && notes.length > 0 && (
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notes:</Text>
            {notes.map((note, index) => (
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
    marginBottom: 4,
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
  indent: {
    paddingLeft: 8,
  },
});
