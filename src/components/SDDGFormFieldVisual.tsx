import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SDDGFormFieldVisualProps {
  fieldType: 'aircraftType' | 'shipmentType';
  selectedValue: string;
  showCrossPattern?: boolean;
}

export default function SDDGFormFieldVisual({ 
  fieldType, 
  selectedValue,
  showCrossPattern = true 
}: SDDGFormFieldVisualProps) {
  
  const isAircraftType = fieldType === 'aircraftType';
  const option1 = isAircraftType ? 'PASSENGER AND\nCARGO AIRCRAFT' : 'NON-RADIOACTIVE';
  const option2 = isAircraftType ? 'CARGO AIRCRAFT\nONLY' : 'RADIOACTIVE';
  
  const isOption1Selected = isAircraftType 
    ? selectedValue === 'Passenger and Cargo Aircraft' || selectedValue === 'PASSENGER AND CARGO AIRCRAFT'
    : selectedValue === 'Non-Radioactive' || selectedValue === 'NON-RADIOACTIVE';
  
  const isOption2Selected = isAircraftType
    ? selectedValue === 'Cargo Aircraft Only' || selectedValue === 'CARGO AIRCRAFT ONLY'
    : selectedValue === 'Radioactive' || selectedValue === 'RADIOACTIVE';

  const renderCrossPattern = () => (
    <View style={styles.crossPatternContainer}>
      <View style={styles.xRows}>
        <Text style={styles.xOverlay}>XXXXXXXXXX</Text>
        <Text style={styles.xOverlay}>XXXXXXXXXX</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerBox}>
        <Text style={styles.headerText}>
          {isAircraftType ? 'AIRCRAFT TYPE' : 'SHIPMENT TYPE'} 
          {isAircraftType ? ' (DELETE NON-APPLICABLE)' : ' (DELETE NON-APPLICABLE)'}
        </Text>
      </View>
      
      <View style={styles.optionsContainer}>
        <View style={[styles.optionBox, isOption2Selected && styles.notApplicable]}>
          <Text style={[styles.optionText, isAircraftType && styles.multilineText]}>
            {option1}
          </Text>
          {showCrossPattern && isOption2Selected && renderCrossPattern()}
        </View>
        
        <View style={[styles.optionBox, isOption1Selected && styles.notApplicable]}>
          <Text style={[styles.optionText, isAircraftType && styles.multilineText]}>
            {option2}
          </Text>
          {showCrossPattern && isOption1Selected && renderCrossPattern()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 4,
    overflow: 'hidden',
  },
  headerBox: {
    backgroundColor: '#F0F0F0',
    borderBottomWidth: 2,
    borderBottomColor: '#000000',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  headerText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    minHeight: 60,
  },
  optionBox: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    paddingVertical: 12,
    paddingHorizontal: 8,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  optionText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#000000',
    textAlign: 'center',
  },
  multilineText: {
    lineHeight: 14,
  },
  notApplicable: {
    backgroundColor: '#F8F8F8',
  },
  crossPatternContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  xRows: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  xOverlay: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    opacity: 1.0,
    letterSpacing: 2,
    lineHeight: 20,
  },
});