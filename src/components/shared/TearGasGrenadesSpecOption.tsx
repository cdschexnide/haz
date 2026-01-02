import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { WeightUnits } from "../../../server/data/grandfatheredPackagingParagraphReferences";

interface ContentDetails {
  dispensers?: number;
  modules?: number;
  bomblets?: number;
  bombletContents?: string;
}

interface MaxQuantity {
  grenades?: number;
  functioningDevices?: number;
}

interface TearGasGrenadesSpecOptionProps {
  title: string;
  description?: string;
  spec?: string | string[];
  model?: string;
  requirements?: string[];
  maxGrossWeight?: WeightUnits;
  maxQuantity?: MaxQuantity;
  contents?: string;
  safetyDesign?: string;
  marking?: string;
  contentDetails?: ContentDetails;
  isSelected: boolean;
  onSelect: () => void;
  disabled?: boolean;
  warningMessage?: string;
}

export const TearGasGrenadesSpecOption: React.FC<
  TearGasGrenadesSpecOptionProps
> = ({
  title,
  description,
  spec,
  model,
  requirements = [],
  maxGrossWeight,
  maxQuantity,
  contents,
  safetyDesign,
  marking,
  contentDetails,
  isSelected,
  onSelect,
  disabled = false,
  warningMessage,
}) => {
  // Format spec array to string if needed
  const specText = Array.isArray(spec) ? spec.join(", ") : spec;

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
        {/* Specification information */}
        {specText && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Specification:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {specText}
            </Text>
          </View>
        )}

        {/* Model information */}
        {model && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Model:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {model}
            </Text>
          </View>
        )}

        {/* Contents information */}
        {contents && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Contents:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {contents}
            </Text>
          </View>
        )}

        {/* Marking information */}
        {marking && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Marking:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {marking}
            </Text>
          </View>
        )}

        {/* Safety Design information */}
        {safetyDesign && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Safety Design:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {safetyDesign}
            </Text>
          </View>
        )}

        {/* Maximum Weight */}
        {maxGrossWeight && (
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, disabled && styles.disabledText]}>
              Max Gross Weight:
            </Text>
            <Text style={[styles.detailValue, disabled && styles.disabledText]}>
              {maxGrossWeight.lbs} lbs / {maxGrossWeight.kg} kg
            </Text>
          </View>
        )}

        {/* Maximum Quantity */}
        {maxQuantity &&
          (maxQuantity.grenades || maxQuantity.functioningDevices) && (
            <View style={styles.detailRow}>
              <Text
                style={[styles.detailLabel, disabled && styles.disabledText]}
              >
                Maximum Quantity:
              </Text>
              <View style={styles.quantityContainer}>
                {maxQuantity.grenades && (
                  <Text
                    style={[
                      styles.quantityText,
                      disabled && styles.disabledText,
                    ]}
                  >
                    • {maxQuantity.grenades} grenades
                  </Text>
                )}
                {maxQuantity.functioningDevices && (
                  <Text
                    style={[
                      styles.quantityText,
                      disabled && styles.disabledText,
                    ]}
                  >
                    • {maxQuantity.functioningDevices} functioning devices
                  </Text>
                )}
              </View>
            </View>
          )}

        {/* Content Details */}
        {contentDetails && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, disabled && styles.disabledText]}
            >
              Content Details:
            </Text>
            {contentDetails.dispensers && (
              <Text style={[styles.listItem, disabled && styles.disabledText]}>
                • {contentDetails.dispensers} dispensers
              </Text>
            )}
            {contentDetails.modules && (
              <Text style={[styles.listItem, disabled && styles.disabledText]}>
                • {contentDetails.modules} modules
              </Text>
            )}
            {contentDetails.bomblets && (
              <Text style={[styles.listItem, disabled && styles.disabledText]}>
                • {contentDetails.bomblets} bomblets
              </Text>
            )}
            {contentDetails.bombletContents && (
              <Text style={[styles.listItem, disabled && styles.disabledText]}>
                • Bomblet contents: {contentDetails.bombletContents}
              </Text>
            )}
          </View>
        )}

        {/* Requirements section */}
        {requirements.length > 0 && (
          <View style={styles.section}>
            <Text
              style={[styles.sectionTitle, disabled && styles.disabledText]}
            >
              Requirements:
            </Text>
            {requirements.map((req, index) => (
              <Text
                key={`req-${index}`}
                style={[styles.listItem, disabled && styles.disabledText]}
              >
                • {req}
              </Text>
            ))}
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
    marginBottom: 12,
    alignItems: "flex-start",
  },
  detailLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666666",
    width: 140,
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
    marginBottom: 6,
    paddingLeft: 8,
    lineHeight: 20,
  },
  quantityContainer: {
    flex: 1,
  },
  quantityText: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 4,
  },
  disabledText: {
    color: "#9E9E9E",
  },
});
