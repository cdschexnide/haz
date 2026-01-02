import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import { Button } from "react-native-elements";
import React, { useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import { useNavigationRef } from "../../../src/contexts/NavigationRefProvider/useNavigationRef";

const { height } = Dimensions.get("window");

const ValidateInspection = ({ navigation }: { navigation: any }) => {
  const { state, dispatch } = useContext(HazProInspectorContext);

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };
  const { navigate } = useNavigationRef();

  useEffect(() => {
    handleNestedInspectorContextFieldUpdate("activeStep", 9);
  }, []);

  const goBack = () => {
    handleNestedInspectorContextFieldUpdate("activeStep", 8);
    navigation.goBack();
  };

  const failedItems = state.hazProInspectorContext.form1015Questions
    .filter(item => item.currentValue === 1)
    .map(item => item.identifier);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.keyboardAvoidingView}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.container}>
          <Text style={styles.title}>Validate Inspection</Text>
          <InspectorAMC1015Form />
          <View style={styles.buttonRow}>
            <Button
              title="Cancel"
              type="outline"
              buttonStyle={styles.cancelButton}
              titleStyle={styles.cancelButtonText}
              containerStyle={styles.buttonWrapper}
              onPress={() => goBack()}
            />
            <Button
              title="Validate"
              buttonStyle={styles.submitButton}
              titleStyle={styles.submitButtonText}
              containerStyle={styles.buttonWrapper}
              // disabled
              onPress={() => {
                dispatch({ type: "RESET_CONTEXT" });
                navigate("PreparerHomeStack", { screen: "PreparerHome" });
              }}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ValidateInspection;

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    backgroundColor: "white",
  },
  scrollContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
    backgroundColor: "white",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    alignSelf: "center",
    marginTop: 20,
  },
  placeholderElement: {
    height: height * 0.6,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingBottom: 10,
  },
  buttonWrapper: {
    width: "20%",
  },
  cancelButton: {
    borderColor: "#007bff",
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 5,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
  },
  submitButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
