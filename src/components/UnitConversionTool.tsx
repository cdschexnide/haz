import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import convert from 'convert-units';

const { width } = Dimensions.get('window');
const MODAL_MAX_WIDTH = 600;

interface UnitConversionToolProps {
  visible: boolean;
  onClose: () => void;
}

const UnitConversionTool: React.FC<UnitConversionToolProps> = ({ visible, onClose }) => {
  const measurementCategories = [
    'length',
    'area', 
    'mass',
    'volume',
    'volumeFlowRate',
    'temperature',
    'time',
    'frequency',
    'speed',
    'torque',
    'pace',
    'pressure',
    'digital',
    'illuminance',
    'partsPer',
    'voltage',
    'current',
    'power',
    'apparentPower',
    'reactivePower',
    'energy',
    'reactiveEnergy',
    'angle',
    'charge',
    'force',
    'acceleration',
    'pieces'
  ] as const;

  type MeasurementCategory = typeof measurementCategories[number];

  // State management
  const [selectedCategory, setSelectedCategory] = useState<MeasurementCategory>('mass');
  const [inputValue, setInputValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('kg');
  const [toUnit, setToUnit] = useState<string>('lb');
  const [result, setResult] = useState<string>('2.20462');
  const [availableUnits, setAvailableUnits] = useState<Array<{ abbr: string; singular: string; plural: string }>>([]);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // Category display names
  const categoryDisplayNames: Record<MeasurementCategory, string> = {
    length: 'Length',
    area: 'Area',
    mass: 'Mass',
    volume: 'Volume',
    volumeFlowRate: 'Volume Flow Rate',
    temperature: 'Temperature',
    time: 'Time',
    frequency: 'Frequency',
    speed: 'Speed',
    torque: 'Torque',
    pace: 'Pace',
    pressure: 'Pressure',
    digital: 'Digital',
    illuminance: 'Illuminance',
    partsPer: 'Parts-Per',
    voltage: 'Voltage',
    current: 'Current',
    power: 'Power',
    apparentPower: 'Apparent Power',
    reactivePower: 'Reactive Power',
    energy: 'Energy',
    reactiveEnergy: 'Reactive Energy',
    angle: 'Angle',
    charge: 'Charge',
    force: 'Force',
    acceleration: 'Acceleration',
    pieces: 'Pieces'
  };

  // Keyboard event listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardHeight(0);
    });

    return () => {
      keyboardDidShowListener?.remove();
      keyboardDidHideListener?.remove();
    };
  }, []);

  // Update available units when category changes
  useEffect(() => {
    try {
      const units = convert().list(selectedCategory as any);
      setAvailableUnits(units);
      
      if (units.length > 0) {
        setFromUnit(units[0].abbr);
        setToUnit(units.length > 1 ? units[1].abbr : units[0].abbr);
      }
    } catch (error) {
      console.warn(`No units available for category: ${selectedCategory}`);
      setAvailableUnits([]);
    }
  }, [selectedCategory]);

  // Perform conversion when inputs change
  useEffect(() => {
    if (!inputValue || !fromUnit || !toUnit || availableUnits.length === 0) {
      setResult('');
      return;
    }

    try {
      const numericValue = parseFloat(inputValue);
      if (isNaN(numericValue)) {
        setResult('');
        return;
      }

      const convertedValue = convert(numericValue).from(fromUnit as any).to(toUnit as any);
      
      // Format the result to a reasonable number of decimal places
      if (convertedValue === 0) {
        setResult('0');
      } else if (Math.abs(convertedValue) >= 1000000) {
        setResult(convertedValue.toExponential(6));
      } else if (Math.abs(convertedValue) >= 1) {
        setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
      } else {
        setResult(convertedValue.toFixed(8).replace(/\.?0+$/, ''));
      }
    } catch (error) {
      console.error('Conversion error:', error);
      setResult('Error');
    }
  }, [inputValue, fromUnit, toUnit, availableUnits]);

  const handleInputChange = (text: string) => {
    // Allow numbers, decimal point, and negative sign
    const cleanText = text.replace(/[^0-9.-]/g, '');
    setInputValue(cleanText);
  };

  const swapUnits = () => {
    const tempUnit = fromUnit;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    
    // Also swap the values
    setInputValue(result);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.overlay}>
          <KeyboardAvoidingView
            style={styles.keyboardWrapper}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={[styles.card, { width: Math.min(MODAL_MAX_WIDTH, width * 0.9) }]}> 
              <View style={styles.header}>
                <Text style={styles.title}>Unit Converter</Text>
                {onClose && (
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={onClose}
                    accessibilityLabel="Close converter"
                  >
                    <MaterialCommunityIcons name="close" size={22} color="#666" />
                  </TouchableOpacity>
                )}
              </View>
              <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="none"
              >
                {/* Category Selector */}
                <View style={styles.categoryContainer}>
                  <Text style={styles.sectionLabel}>Category</Text>
                  <View style={styles.pickerContainer}>
                    <Picker
                      selectedValue={selectedCategory}
                      onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                      style={styles.picker}
                    >
                      {measurementCategories.map((category) => (
                        <Picker.Item
                          key={category}
                          label={categoryDisplayNames[category]}
                          value={category}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                {/* Conversion Panel */}
                <View style={styles.conversionPanel}>
                  {/* From (Input) Section */}
                  <View style={styles.conversionSection}>
                    <View style={styles.inputContainer}>
                      <TextInput
                        style={styles.valueInput}
                        value={inputValue}
                        onChangeText={handleInputChange}
                        placeholder="Enter value"
                        keyboardType="numeric"
                        selectTextOnFocus
                      />
                    </View>
                    <View style={styles.unitPickerContainer}>
                      <Picker
                        selectedValue={fromUnit}
                        onValueChange={(itemValue) => setFromUnit(itemValue)}
                        style={styles.unitPicker}
                        enabled={availableUnits.length > 0}
                      >
                        {availableUnits.map((unit) => (
                          <Picker.Item
                            key={unit.abbr}
                            label={`${unit.singular} (${unit.abbr})`}
                            value={unit.abbr}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                  {/* Equals Sign and Swap Button */}
                  <View style={styles.equalsSection}>
                    <Text style={styles.equalsText}>=</Text>
                    <TouchableOpacity onPress={swapUnits} style={styles.swapButton}>
                      <Text style={styles.swapButtonText}>⇄</Text>
                    </TouchableOpacity>
                  </View>
                  {/* To (Result) Section */}
                  <View style={styles.conversionSection}>
                    <View style={styles.inputContainer}>
                      <Text style={styles.resultText}>{result}</Text>
                    </View>
                    <View style={styles.unitPickerContainer}>
                      <Picker
                        selectedValue={toUnit}
                        onValueChange={(itemValue) => setToUnit(itemValue)}
                        style={styles.unitPicker}
                        enabled={availableUnits.length > 0}
                      >
                        {availableUnits.map((unit) => (
                          <Picker.Item
                            key={unit.abbr}
                            label={`${unit.singular} (${unit.abbr})`}
                            value={unit.abbr}
                          />
                        ))}
                      </Picker>
                    </View>
                  </View>
                </View>
                {/* Unit Information */}
                {availableUnits.length === 0 && (
                  <View style={styles.noUnitsContainer}>
                    <Text style={styles.noUnitsText}>
                      No units available for this category
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardWrapper: {
    width: "100%",
    alignItems: "center",
  },
    safeArea: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: MODAL_MAX_WIDTH,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fcfcfc',
    marginBottom: 0,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2d3748',
  },
  closeButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    paddingBottom: 20,
  },
  categoryContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  picker: {
    height: 55,
  },
  conversionPanel: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  conversionSection: {
    flex: 1,
    maxWidth: '42%',
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 12,
    marginBottom: 6,
    minHeight: 44,
    justifyContent: 'center',
  },
  valueInput: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  resultText: {
    fontSize: 16,
    color: '#1f2937',
    textAlign: 'center',
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  unitPickerContainer: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    overflow: 'hidden',
  },
  unitPicker: {
    height: 55,
  },
  equalsSection: {
    width: '16%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
  },
  equalsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 6,
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  swapButtonText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 5
  },
  noUnitsContainer: {
    padding: 12,
    backgroundColor: '#fef3cd',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#f59e0b',
  },
  noUnitsText: {
    fontSize: 12,
    color: '#92400e',
    textAlign: 'center',
  },
});

export default UnitConversionTool;
