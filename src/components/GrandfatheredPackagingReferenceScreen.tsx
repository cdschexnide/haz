import { MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { Button } from 'react-native-elements';
import GrandfatheredPackagingReferenceViewer from './GrandfatheredExplosivePackagingReferenceViewer';

const GrandfatheredPackagingReferenceScreen = ({ navigation }: { navigation: any }) => {
  const [showPrintOptions, setShowPrintOptions] = useState(false);

  const handleCancel = () => {
    navigation.goBack();
  };

  const handleSaveAndExit = () => {
    navigation.goBack();
  };

  const handleSaveNext = () => {
    navigation.navigate('SpecialProvisionsAcknowledgement');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#fff"
      />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Packaging Reference</Text>
      </View>
      {showPrintOptions && (
        <View style={styles.printOptionsContainer}>
          <TouchableOpacity
            style={styles.printOption}
            onPress={() => {
              setShowPrintOptions(false);
            }}
          >
            <MaterialIcons name="description" size={20} color="#333" />
            <Text style={styles.printOptionText}>Print full document</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.printOption}
            onPress={() => {
              setShowPrintOptions(false);
            }}
          >
            <MaterialIcons name="summarize" size={20} color="#333" />
            <Text style={styles.printOptionText}>Print summary</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={styles.contentContainer}>
        <GrandfatheredPackagingReferenceViewer />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          title="Cancel"
          type="outline"
          buttonStyle={styles.cancelButton}
          titleStyle={styles.cancelButtonText}
          onPress={handleCancel}
          containerStyle={styles.rightButtonContainer}
        />
        <Button
          title="Save & Exit"
          type="outline"
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
          onPress={handleSaveAndExit}
          containerStyle={styles.centerButtonContainer}
        />
        <Button
          title="Save & Continue"
          buttonStyle={styles.saveButton}
          titleStyle={styles.saveButtonText}
          onPress={handleSaveNext}
          containerStyle={styles.leftButtonContainer}
        />

      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  contentContainer: {
    flex: 1,
    marginBottom: 80, 
  },
  printOptionsContainer: {
    position: 'absolute',
    top: 56,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 1000,
    width: 200,
    paddingVertical: 8,
  },
  printOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  printOptionText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
  },
  leftButtonContainer: {
    width: '30%',
  },
  centerButtonContainer: {
    width: '30%',
  },
  rightButtonContainer: {
    width: '30%',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  disabledSaveButton: {
    backgroundColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  saveExitButton: {
    borderColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  saveExitButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
  cancelButton: {
    borderColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
  },
});

export default GrandfatheredPackagingReferenceScreen;
