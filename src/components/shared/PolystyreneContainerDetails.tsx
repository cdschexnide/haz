import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { InfoCardItem } from './InfoCardItem';

interface PolystyreneContainerDetailsProps {
  containerData: {
    type: string;
    containedItem?: string;
    configuration?: {
      itemsPerContainer?: number;
      maxContainersPerBox?: number;
      overwrap?: {
        material?: string;
        dimensions?: {
          thickness?: {
            minimum?: {
              inches?: number;
              centimeters?: number;
            };
          };
        };
      };
      pallet?: {
        border?: {
          height?: {
            exact?: {
              feet?: number;
              meters?: number;
            };
          };
          thickness?: {
            exact?: {
              inches?: number;
              centimeters?: number;
            };
          };
          material?: string;
        };
        box?: string;
        liner?: string;
      };
    };
  };
  isSelected?: boolean;
  isDisabled?: boolean;
  warningMessage?: string;
}

const PolystyreneContainerDetails: React.FC<PolystyreneContainerDetailsProps> = ({
  containerData,
  isSelected = false,
  isDisabled = false,
  warningMessage
}) => {
  if (!containerData || containerData.type !== "Polystyrene containers") {
    return null;
  }

  const { containedItem, configuration } = containerData;

  return (
    <View style={styles.container}>
      {/* Header row with title, warning and radio button */}
      <View style={styles.headerRow}>
        <View style={styles.titleContainer}>
          <Text style={[
            styles.selectionTitle,
            isDisabled && styles.disabledText
          ]}>
            {containerData.type}
          </Text>
          {warningMessage && (
            <Text style={styles.warningText}>
              <MaterialIcons name="error-outline" size={16} color="#D32F2F" />
              {" " + warningMessage}
            </Text>
          )}
        </View>
        <View style={styles.checkboxContainer}>
          {isSelected ? (
            <MaterialIcons
              name="radio-button-checked"
              size={24}
              color={isDisabled ? "#BDBDBD" : "#007AFF"}
            />
          ) : (
            <MaterialIcons
              name="radio-button-unchecked"
              size={24}
              color={isDisabled ? "#BDBDBD" : "#8E8E93"}
            />
          )}
        </View>
      </View>

      <View style={styles.contentContainer}>
        {/* Contained Item Information */}
        {containedItem && (
          <InfoCardItem
            label="For"
            value={containedItem}
            isDisabled={isDisabled}
          />
        )}

        {/* Configuration Information */}
        {configuration && (
          <View style={[
            styles.configSection,
            isDisabled && styles.disabledConfigSection
          ]}>
            <Text style={[
              styles.sectionTitle,
              isDisabled && styles.disabledText
            ]}>
              Configuration Details
            </Text>

            {/* Items Per Container */}
            {configuration.itemsPerContainer && (
              <View style={styles.infoRow}>
                <Text style={[
                  styles.infoLabel,
                  isDisabled && styles.disabledText
                ]}>
                  Items Per Container:
                </Text>
                <Text style={[
                  styles.infoValue,
                  isDisabled && styles.disabledText
                ]}>
                  {configuration.itemsPerContainer}
                </Text>
              </View>
            )}

            {/* Max Containers Per Box */}
            {configuration.maxContainersPerBox && (
              <View style={styles.infoRow}>
                <Text style={[
                  styles.infoLabel,
                  isDisabled && styles.disabledText
                ]}>
                  Max Containers Per Box:
                </Text>
                <Text style={[
                  styles.infoValue,
                  isDisabled && styles.disabledText
                ]}>
                  {configuration.maxContainersPerBox}
                </Text>
              </View>
            )}

            {/* Overwrap Information */}
            {configuration.overwrap && (
              <View style={[
                styles.nestedSection,
                isDisabled && styles.disabledNestedSection
              ]}>
                <Text style={[
                  styles.nestedTitle,
                  isDisabled && styles.disabledNestedTitle
                ]}>
                  Overwrap
                </Text>

                {configuration.overwrap.material && (
                  <View style={styles.infoRow}>
                    <Text style={[
                      styles.nestedLabel,
                      isDisabled && styles.disabledText
                    ]}>
                      Material:
                    </Text>
                    <Text style={[
                      styles.nestedValue,
                      isDisabled && styles.disabledText
                    ]}>
                      {configuration.overwrap.material}
                    </Text>
                  </View>
                )}

                {configuration.overwrap.dimensions?.thickness?.minimum && (
                  <View style={styles.infoRow}>
                    <Text style={[
                      styles.nestedLabel,
                      isDisabled && styles.disabledText
                    ]}>
                      Minimum Thickness:
                    </Text>
                    <Text style={[
                      styles.nestedValue,
                      isDisabled && styles.disabledText
                    ]}>
                      {configuration.overwrap.dimensions.thickness.minimum.inches} in / {' '}
                      {configuration.overwrap.dimensions.thickness.minimum.centimeters} cm
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Pallet Information */}
            {configuration.pallet && (
              <View style={[
                styles.nestedSection,
                isDisabled && styles.disabledNestedSection
              ]}>
                <Text style={[
                  styles.nestedTitle,
                  isDisabled && styles.disabledNestedTitle
                ]}>
                  Pallet Dimensions
                </Text>

                {/* Border Information */}
                {configuration.pallet.border && (
                  <View style={[
                    styles.subNestedSection,
                    isDisabled && styles.disabledSubNestedSection
                  ]}>
                    <Text style={[
                      styles.subNestedTitle,
                      isDisabled && styles.disabledSubNestedTitle
                    ]}>
                      Border
                    </Text>

                    {configuration.pallet.border.height?.exact && (
                      <View style={styles.infoRow}>
                        <Text style={[
                          styles.subNestedLabel,
                          isDisabled && styles.disabledText
                        ]}>
                          Height:
                        </Text>
                        <Text style={[
                          styles.subNestedValue,
                          isDisabled && styles.disabledText
                        ]}>
                          {configuration.pallet.border.height.exact.feet} ft / {' '}
                          {configuration.pallet.border.height.exact.meters} m
                        </Text>
                      </View>
                    )}

                    {configuration.pallet.border.thickness?.exact && (
                      <View style={styles.infoRow}>
                        <Text style={[
                          styles.subNestedLabel,
                          isDisabled && styles.disabledText
                        ]}>
                          Thickness:
                        </Text>
                        <Text style={[
                          styles.subNestedValue,
                          isDisabled && styles.disabledText
                        ]}>
                          {configuration.pallet.border.thickness.exact.inches} in / {' '}
                          {configuration.pallet.border.thickness.exact.centimeters} cm
                        </Text>
                      </View>
                    )}

                    {configuration.pallet.border.material && (
                      <View style={styles.infoRow}>
                        <Text style={[
                          styles.subNestedLabel,
                          isDisabled && styles.disabledText
                        ]}>
                          Material:
                        </Text>
                        <Text style={[
                          styles.subNestedValue,
                          isDisabled && styles.disabledText
                        ]}>
                          {configuration.pallet.border.material}
                        </Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Box Information */}
                {configuration.pallet.box && (
                  <View style={styles.infoRow}>
                    <Text style={[
                      styles.nestedLabel,
                      isDisabled && styles.disabledText
                    ]}>
                      Box:
                    </Text>
                    <Text style={[
                      styles.nestedValue,
                      isDisabled && styles.disabledText
                    ]}>
                      {configuration.pallet.box}
                    </Text>
                  </View>
                )}

                {/* Liner Information */}
                {configuration.pallet.liner && (
                  <View style={styles.infoRow}>
                    <Text style={[
                      styles.nestedLabel,
                      isDisabled && styles.disabledText
                    ]}>
                      Liner:
                    </Text>
                    <Text style={[
                      styles.nestedValue,
                      isDisabled && styles.disabledText
                    ]}>
                      {configuration.pallet.liner}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkboxContainer: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentContainer: {
    marginLeft: 2, // Slight indent from the title
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginRight: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#D32F2F',
    fontWeight: '500',
    flex: 1,
  },
  configSection: {
    marginTop: 12,
  },
  disabledConfigSection: {
    opacity: 0.9, // Less faded than complete disabled
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#424242',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
    marginRight: 4,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#212121',
  },
  nestedSection: {
    marginTop: 10,
    marginBottom: 8,
    marginLeft: 8,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#BBDEFB',
  },
  disabledNestedSection: {
    borderLeftColor: '#E0E0E0',
  },
  nestedTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0277BD',
    marginBottom: 6,
  },
  disabledNestedTitle: {
    color: '#9E9E9E',
  },
  nestedLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    color: '#616161',
    marginRight: 4,
  },
  nestedValue: {
    flex: 2,
    fontSize: 14,
    color: '#212121',
  },
  subNestedSection: {
    marginLeft: 8,
    marginTop: 6,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#E1F5FE',
  },
  disabledSubNestedSection: {
    borderLeftColor: '#EEEEEE',
  },
  subNestedTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0288D1',
    marginBottom: 4,
  },
  disabledSubNestedTitle: {
    color: '#BDBDBD',
  },
  subNestedLabel: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#757575',
    marginRight: 4,
  },
  subNestedValue: {
    flex: 2,
    fontSize: 13,
    color: '#212121',
  },
  disabledText: {
    color: '#9E9E9E',
  },
});

export default PolystyreneContainerDetails;