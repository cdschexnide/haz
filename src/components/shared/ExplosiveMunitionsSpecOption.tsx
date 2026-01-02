import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ExceptionWithCondition } from "../../../server/data/grandfatheredPackagingParagraphReferences";

interface ExplosiveMunitionsSpecOptionProps {
  title: string;
  description?: string;
  generalRequirements?: string[];
  exceptions?: ExceptionWithCondition[];
  specialProvisions?: string[];
  weightLimits?: {
    grenadesOrMinesBox?: {
      lbs: number;
      kg: number;
    };
    multipleBombsWarheadsOrProjectiles?: {
      lbs: number;
      kg: number;
    };
    [key: string]:
      | {
          lbs: number;
          kg: number;
        }
      | undefined;
  };
  containerSpecific?: {
    items?: string[];
    item?: string;
    containerType: string;
    shippingNotes?: string[];
    innerPackaging?: {
      description: string;
    };
    configuration?: string;
    notes?: string[];
    maxGrossWeight?: {
      lbs: number;
      kg: number;
    };
  }[];
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const ExplosiveMunitionsSpecOption: React.FC<
  ExplosiveMunitionsSpecOptionProps
> = ({
  title,
  description,
  generalRequirements,
  exceptions,
  specialProvisions,
  weightLimits,
  containerSpecific,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Helper function to render general requirements
  const renderGeneralRequirements = (requirements: string[] | undefined) => {
    if (!requirements || requirements.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          General Requirements
        </Text>
        {requirements.map((requirement, index) => (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.bulletText, disabled && styles.disabledText]}>
              {requirement}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Helper function to render exceptions
  const renderExceptions = (
    excs: ExplosiveMunitionsSpecOptionProps["exceptions"]
  ) => {
    if (!excs || excs.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Exceptions
        </Text>
        {excs.map((exception, index) => (
          <View key={index} style={styles.exceptionContainer}>
            <Text
              style={[styles.exceptionTitle, disabled && styles.disabledText]}
            >
              {exception.condition}
            </Text>
            <Text
              style={[styles.exceptionContent, disabled && styles.disabledText]}
            >
              {exception.packaging}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Helper function to render special provisions
  const renderSpecialProvisions = (provisions: string[] | undefined) => {
    if (!provisions || provisions.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Special Provisions
        </Text>
        {provisions.map((provision, index) => (
          <View key={index} style={styles.bulletPoint}>
            <Text style={styles.bullet}>•</Text>
            <Text style={[styles.bulletText, disabled && styles.disabledText]}>
              {provision}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  // Helper function to render weight limits
  const renderWeightLimits = (
    limits: ExplosiveMunitionsSpecOptionProps["weightLimits"]
  ) => {
    if (!limits) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Weight Limits
        </Text>
        {limits.grenadesOrMinesBox && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              Grenades/Mines Box:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {limits.grenadesOrMinesBox.lbs} lbs /{" "}
              {limits.grenadesOrMinesBox.kg} kg
            </Text>
          </View>
        )}
        {limits.multipleBombsWarheadsOrProjectiles && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              Multiple Bombs/Warheads:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {limits.multipleBombsWarheadsOrProjectiles.lbs} lbs /{" "}
              {limits.multipleBombsWarheadsOrProjectiles.kg} kg
            </Text>
          </View>
        )}
        {/* Render any additional weight limits */}
        {Object.entries(limits).map(([key, value]) => {
          if (
            key !== "grenadesOrMinesBox" &&
            key !== "multipleBombsWarheadsOrProjectiles" &&
            value
          ) {
            return (
              <View key={key} style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  {key}:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {value.lbs} lbs / {value.kg} kg
                </Text>
              </View>
            );
          }
          return null;
        })}
      </View>
    );
  };

  // Helper function to render container specific information
  const renderContainerSpecific = (
    containers: ExplosiveMunitionsSpecOptionProps["containerSpecific"]
  ) => {
    if (!containers || containers.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Container-Specific Information
        </Text>
        {containers.map((container, index) => (
          <View key={index} style={styles.containerSpecificItem}>
            {/* Item or Items */}
            {container.item ? (
              <Text style={[styles.itemTitle, disabled && styles.disabledText]}>
                {container.item}
              </Text>
            ) : container.items && container.items.length > 0 ? (
              <View>
                <Text
                  style={[styles.itemTitle, disabled && styles.disabledText]}
                >
                  Items:
                </Text>
                <Text
                  style={[styles.itemsList, disabled && styles.disabledText]}
                >
                  {container.items.join(", ")}
                </Text>
              </View>
            ) : null}

            {/* Container Type */}
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Container:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {container.containerType}
              </Text>
            </View>

            {/* Inner Packaging */}
            {container.innerPackaging && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  Inner Packaging:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {container.innerPackaging.description}
                </Text>
              </View>
            )}

            {/* Configuration */}
            {container.configuration && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  Configuration:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {container.configuration}
                </Text>
              </View>
            )}

            {/* Maximum Gross Weight */}
            {container.maxGrossWeight && (
              <View style={styles.infoRow}>
                <Text
                  style={[styles.infoLabel, disabled && styles.disabledText]}
                >
                  Max Weight:
                </Text>
                <Text
                  style={[styles.infoValue, disabled && styles.disabledText]}
                >
                  {container.maxGrossWeight.lbs} lbs /{" "}
                  {container.maxGrossWeight.kg} kg
                </Text>
              </View>
            )}

            {/* Shipping Notes */}
            {container.shippingNotes && container.shippingNotes.length > 0 && (
              <View style={styles.shippingNotesContainer}>
                <Text
                  style={[
                    styles.shippingNotesTitle,
                    disabled && styles.disabledText,
                  ]}
                >
                  Shipping Notes:
                </Text>
                {container.shippingNotes.map((note, noteIndex) => (
                  <View key={noteIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text
                      style={[
                        styles.bulletText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {note}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Notes */}
            {container.notes && container.notes.length > 0 && (
              <View style={styles.notesContainer}>
                <Text
                  style={[styles.notesTitle, disabled && styles.disabledText]}
                >
                  Notes:
                </Text>
                {container.notes.map((note, noteIndex) => (
                  <View key={noteIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text
                      style={[
                        styles.bulletText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {note}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
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
            {warningMessage && (
              <Text style={styles.warningText}>
                <MaterialIcons name="error-outline" size={16} color="#D32F2F" />
                {" " + warningMessage}
              </Text>
            )}
          </View>

          {/* Description */}
          {description && (
            <Text
              style={[styles.descriptionText, disabled && styles.disabledText]}
            >
              {description}
            </Text>
          )}

          {/* General Requirements */}
          {renderGeneralRequirements(generalRequirements)}

          {/* Exceptions */}
          {renderExceptions(exceptions)}

          {/* Special Provisions */}
          {renderSpecialProvisions(specialProvisions)}

          {/* Weight Limits */}
          {renderWeightLimits(weightLimits)}

          {/* Container Specific Information */}
          {renderContainerSpecific(containerSpecific)}
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

      {disabled && <View style={styles.disabledOverlay} />}
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
    borderColor: "#EBEBEB",
    position: "relative",
  },
  selectedCard: {
    borderColor: "#007AFF",
    backgroundColor: "#F0F8FF",
  },
  disabledCard: {
    borderColor: "#D8D8D8",
    backgroundColor: "#FFFFFF",
  },
  disabledOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.08)",
    borderRadius: 8,
    zIndex: 1,
  },
  selectionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    zIndex: 2,
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
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    marginRight: 8,
    flex: 1,
  },
  disabledText: {
    color: "#9E9E9E",
  },
  warningText: {
    fontSize: 14,
    color: "#D32F2F",
    fontWeight: "500",
  },
  selectionCheckbox: {
    width: 28,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  descriptionText: {
    fontSize: 14,
    color: "#000000",
    fontStyle: "italic",
    marginBottom: 12,
  },
  sectionContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 4,
  },
  bulletPoint: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  bullet: {
    fontSize: 14,
    marginRight: 6,
    color: "#000000",
  },
  bulletText: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#6E6E6E",
    width: 120,
  },
  infoValue: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  exceptionContainer: {
    backgroundColor: "#FFF8E1",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
  exceptionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FF9800",
    marginBottom: 4,
  },
  exceptionContent: {
    fontSize: 14,
    color: "#000000",
  },
  containerSpecificItem: {
    backgroundColor: "#F5F5F5",
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#0277BD",
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0277BD",
    marginBottom: 6,
  },
  itemsList: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
  },
  shippingNotesContainer: {
    marginTop: 8,
  },
  shippingNotesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5D4037",
    marginBottom: 4,
  },
  notesContainer: {
    marginTop: 8,
  },
  notesTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 4,
  },
});
