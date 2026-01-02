import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { ExceptionsWithAppliesTo } from "../../../server/data/grandfatheredPackagingParagraphReferences";

interface DetonatorsSpecOptionProps {
  title: string;
  description?: string;
  deviceLimits?: {
    deviceType: string;
    description: string;
    maxPerInner?: number;
    maxPerOuter?: number;
    maxGrossWeight?: {
      lbs: number;
      kg: number;
    };
    notes?: string[];
  }[];
  requirements?: {
    description: string;
    cushioning?: string;
    intermediatePackaging?: {
      materials: string[];
      requirements: string[];
    };
    outerSeparation?: {
      minimum: {
        inches: number;
        centimeters: number;
      };
      description: string;
    };
  };
  generalRequirements?: string[];
  exceptions?: ExceptionsWithAppliesTo;
  outerPackaging?: {
    woodenBoxes?: string[];
    fiberboardBoxes?: string[];
  };
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

function formatDeviceCategory(input: string): string {
  switch (input) {
    case "devicesUnder10g":
      return "Devices under 10g";
    case "devicesUnder3g":
      return "Devices under 3g";
    case "plasticSheathedDevices":
      return "Plastic-sheathed Devices";
    default:
      return input;
  }
}

export const DetonatorsSpecOption: React.FC<DetonatorsSpecOptionProps> = ({
  title,
  description,
  deviceLimits,
  requirements,
  generalRequirements,
  exceptions,
  outerPackaging,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Helper function to render device limits
  const renderDeviceLimits = (
    limits: DetonatorsSpecOptionProps["deviceLimits"]
  ) => {
    if (!limits || limits.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Device Limits
        </Text>
        {limits.map((limit, index) => (
          <View key={index} style={styles.limitContainer}>
            <Text style={[styles.limitTitle, disabled && styles.disabledText]}>
              {formatDeviceCategory(limit.deviceType)}
            </Text>
            <Text
              style={[styles.descriptionText, disabled && styles.disabledText]}
            >
              {limit.description}
            </Text>

            <View style={styles.limitDetails}>
              {limit.maxPerInner && (
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, disabled && styles.disabledText]}
                  >
                    Max Per Inner:
                  </Text>
                  <Text
                    style={[styles.infoValue, disabled && styles.disabledText]}
                  >
                    {limit.maxPerInner}
                  </Text>
                </View>
              )}

              {limit.maxPerOuter && (
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, disabled && styles.disabledText]}
                  >
                    Max Per Outer:
                  </Text>
                  <Text
                    style={[styles.infoValue, disabled && styles.disabledText]}
                  >
                    {limit.maxPerOuter}
                  </Text>
                </View>
              )}

              {limit.maxGrossWeight && (
                <View style={styles.infoRow}>
                  <Text
                    style={[styles.infoLabel, disabled && styles.disabledText]}
                  >
                    Max Weight:
                  </Text>
                  <Text
                    style={[styles.infoValue, disabled && styles.disabledText]}
                  >
                    {limit.maxGrossWeight.lbs} lbs / {limit.maxGrossWeight.kg}{" "}
                    kg
                  </Text>
                </View>
              )}
            </View>

            {limit.notes && limit.notes.length > 0 && (
              <View style={styles.notesContainer}>
                {limit.notes.map((note, noteIndex) => (
                  <View key={noteIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text
                      style={[styles.noteText, disabled && styles.disabledText]}
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

  // Helper function to render packaging requirements
  const renderRequirements = (
    req: DetonatorsSpecOptionProps["requirements"]
  ) => {
    if (!req) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Packaging Requirements
        </Text>

        <Text style={[styles.limitTitle, disabled && styles.disabledText]}>
          {req.description}
        </Text>

        {req.cushioning && (
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
              Cushioning:
            </Text>
            <Text style={[styles.infoValue, disabled && styles.disabledText]}>
              {req.cushioning}
            </Text>
          </View>
        )}

        {req.intermediatePackaging && (
          <View style={styles.requirementSection}>
            <Text
              style={[styles.requirementTitle, disabled && styles.disabledText]}
            >
              Intermediate Packaging
            </Text>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Materials:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {req.intermediatePackaging.materials.join(", ")}
              </Text>
            </View>

            <View style={styles.requirementsContainer}>
              {req.intermediatePackaging.requirements.map(
                (reqItem, reqIndex) => (
                  <View key={reqIndex} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text
                      style={[
                        styles.requirementText,
                        disabled && styles.disabledText,
                      ]}
                    >
                      {reqItem}
                    </Text>
                  </View>
                )
              )}
            </View>
          </View>
        )}

        {req.outerSeparation && (
          <View style={styles.requirementSection}>
            <Text
              style={[styles.requirementTitle, disabled && styles.disabledText]}
            >
              Outer Separation
            </Text>

            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, disabled && styles.disabledText]}>
                Minimum:
              </Text>
              <Text style={[styles.infoValue, disabled && styles.disabledText]}>
                {req.outerSeparation.minimum.inches} inches /{" "}
                {req.outerSeparation.minimum.centimeters} cm
              </Text>
            </View>

            <Text
              style={[styles.descriptionText, disabled && styles.disabledText]}
            >
              {req.outerSeparation.description}
            </Text>
          </View>
        )}
      </View>
    );
  };

  // Helper function to render general requirements
  const renderGeneralRequirements = (reqs: string[] | undefined) => {
    if (!reqs || reqs.length === 0) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          General Requirements
        </Text>

        <View style={styles.requirementsContainer}>
          {reqs.map((req, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text
                style={[
                  styles.requirementText,
                  disabled && styles.disabledText,
                ]}
              >
                {req}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Helper function to render exceptions
  const renderExceptions = (exc: DetonatorsSpecOptionProps["exceptions"]) => {
    if (!exc) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Exceptions
        </Text>

        <Text style={[styles.subtitle, disabled && styles.disabledText]}>
          Applies to:
        </Text>

        <View style={styles.bulletsContainer}>
          {exc.appliesTo.map((item, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text
                style={[styles.bulletText, disabled && styles.disabledText]}
              >
                {item}
              </Text>
            </View>
          ))}
        </View>

        <Text
          style={[
            styles.subtitle,
            disabled && styles.disabledText,
            { marginTop: 8 },
          ]}
        >
          Exception Notes:
        </Text>

        <View style={styles.bulletsContainer}>
          {exc.notes.map((note, index) => (
            <View key={index} style={styles.bulletPoint}>
              <Text style={styles.bullet}>•</Text>
              <Text
                style={[styles.bulletText, disabled && styles.disabledText]}
              >
                {note}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Helper function to render outer packaging options
  const renderOuterPackaging = (
    pkg: DetonatorsSpecOptionProps["outerPackaging"]
  ) => {
    if (!pkg) return null;

    return (
      <View style={styles.sectionContainer}>
        <Text style={[styles.sectionTitle, disabled && styles.disabledText]}>
          Outer Packaging Options
        </Text>

        {pkg.woodenBoxes && pkg.woodenBoxes.length > 0 && (
          <View style={styles.packageTypeContainer}>
            <Text
              style={[styles.packageTypeTitle, disabled && styles.disabledText]}
            >
              Wooden Boxes:
            </Text>
            <Text
              style={[styles.packageTypeValue, disabled && styles.disabledText]}
            >
              {pkg.woodenBoxes.join(", ")}
            </Text>
          </View>
        )}

        {pkg.fiberboardBoxes && pkg.fiberboardBoxes.length > 0 && (
          <View style={styles.packageTypeContainer}>
            <Text
              style={[styles.packageTypeTitle, disabled && styles.disabledText]}
            >
              Fiberboard Boxes:
            </Text>
            <Text
              style={[styles.packageTypeValue, disabled && styles.disabledText]}
            >
              {pkg.fiberboardBoxes.join(", ")}
            </Text>
          </View>
        )}
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

          {/* Device Limits */}
          {renderDeviceLimits(deviceLimits)}

          {/* General Requirements */}
          {renderGeneralRequirements(generalRequirements)}

          {/* Specific Packaging Requirements */}
          {renderRequirements(requirements)}

          {/* Exceptions */}
          {renderExceptions(exceptions)}

          {/* Outer Packaging Options */}
          {renderOuterPackaging(outerPackaging)}
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
  },
  limitContainer: {
    marginBottom: 16,
    backgroundColor: "#F8F8F8",
    padding: 10,
    borderRadius: 6,
  },
  limitTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 4,
  },
  limitDetails: {
    marginTop: 6,
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
    width: 110,
  },
  infoValue: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  bulletsContainer: {
    marginTop: 4,
  },
  notesContainer: {
    marginTop: 8,
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
  noteText: {
    fontSize: 14,
    color: "#555555",
    flex: 1,
  },
  requirementsContainer: {
    marginTop: 6,
  },
  requirementText: {
    fontSize: 14,
    color: "#000000",
    flex: 1,
  },
  requirementSection: {
    marginTop: 10,
    marginBottom: 6,
  },
  requirementTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  packageTypeContainer: {
    marginBottom: 8,
  },
  packageTypeTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
  },
  packageTypeValue: {
    fontSize: 14,
    color: "#000000",
  },
});
