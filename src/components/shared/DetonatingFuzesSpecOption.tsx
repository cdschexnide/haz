import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

interface DetonatingFuzesSpecOptionProps {
  title: string;
  description?: string;
  requirements?: string[];
  weightCategory?: "detonatingFuzes" | "boostersBurstersSupplementary";
  weightCategoryDescription?: string;
  maxGrossWeight?: {
    lbs: number;
    kg: number;
  };
  notes?: string[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const DetonatingFuzesSpecOption: React.FC<
  DetonatingFuzesSpecOptionProps
> = ({
  title,
  description,
  requirements,
  weightCategory,
  weightCategoryDescription,
  maxGrossWeight,
  notes,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
    // Helper function to render requirements with bullets
    const renderRequirements = (requirementsList: string[]) => {
      return (
        <View style={styles.requirementsContainer}>
          <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
            Requirements
          </Text>
          {requirementsList.map((requirement, index) => (
            <Text
              key={`requirement-${index}`}
              style={[styles.requirement, disabled && styles.disabledText]}
            >
              • {requirement}
            </Text>
          ))}
        </View>
      );
    };

    // Helper function to render notes with bullets
    const renderNotes = (notesList: string[]) => {
      return (
        <View style={styles.notesContainer}>
          <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
            Notes
          </Text>
          {notesList.map((note, index) => (
            <Text
              key={`note-${index}`}
              style={[styles.note, disabled && styles.disabledText]}
            >
              • {note}
            </Text>
          ))}
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

            {/* Description */}
            {description ? (
              <View style={styles.infoRow}>
                <Text
                  style={[
                    styles.descriptionText,
                    disabled && styles.disabledText,
                  ]}
                >
                  {description}
                </Text>
              </View>
            ) : null}

            {/* Weight Category */}
            {weightCategoryDescription ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                  Type:
                </Text>
                <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                  {weightCategoryDescription}
                </Text>
              </View>
            ) : null}

            {/* Maximum Gross Weight */}
            {maxGrossWeight ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                  Max Weight:
                </Text>
                <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                  {maxGrossWeight.lbs} lbs / {maxGrossWeight.kg} kg
                </Text>
              </View>
            ) : null}

            {/* Requirements */}
            {requirements && requirements.length > 0
              ? renderRequirements(requirements)
              : null}

            {/* Notes */}
            {notes && notes.length > 0 ? renderNotes(notes) : null}
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
  descriptionText: {
    fontSize: 14,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 8,
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
  notesContainer: {
    marginTop: 8,
  },
  note: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 4,
    paddingLeft: 4,
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
