import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import { HazProInspectorContext } from "../../contexts/HazProInspectorProvider/HazProInspectorContext";
import colors from "../../theming/colors";

export const InspectorExceptedOrLimitedQuantities = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, dispatch } = useContext(HazProInspectorContext);
  const [
    shipmentIsMovingAsExceptedQuantity,
    setShipmentIsMovingAsExceptedQuantity,
  ] = useState<boolean>(false);
  const [
    shipmentIsMovingAsLimitedQuantity,
    setShipmentIsMovingAsLimitedQuantity,
  ] = useState<boolean>(false);

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const renderYesNoButtons = (
    onYes: () => void,
    onNo: () => void,
    selectedValue?: boolean
  ) => (
    <View style={styles.buttonGroup}>
      <Button
        title="Yes"
        type={selectedValue === true ? "solid" : "outline"}
        onPress={onYes}
        buttonStyle={styles.choiceButton}
        titleStyle={
          selectedValue === true ? styles.selectedText : styles.unselectedText
        }
      />
      <Button
        title="No"
        type={selectedValue === false ? "solid" : "outline"}
        onPress={onNo}
        buttonStyle={styles.choiceButton}
        titleStyle={
          selectedValue === false ? styles.selectedText : styles.unselectedText
        }
      />
    </View>
  );

  useEffect(() => {
    handleNestedInspectorContextFieldUpdate("activeStep", 4);
  }, []);

  const handleSubmit = () => {
    // if (shipmentIsMovingAsExceptedQuantity) {
    //   handleNestedInspectorContextFieldUpdate("activeStep", 8);
    //   navigation.navigate("InspectorLabelingAndMarkingScreen");
    // }
    navigation.navigate("InspectorInitialQuestioningScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Special Shipment Type</Text>

      {state.hazProInspectorContext.isLimitedQuantity && (
        <View style={styles.section}>
          <Text style={styles.question}>
            Is the shipper moving this shipment under the conditions of limited
            quantities?
          </Text>
          {renderYesNoButtons(
            () => {
              setShipmentIsMovingAsLimitedQuantity(true);
              handleNestedInspectorContextFieldUpdate(
                "shipment.beingShippedAsLimitedQuantity",
                true
              );
            },
            () => {
              setShipmentIsMovingAsLimitedQuantity(false);
              handleNestedInspectorContextFieldUpdate(
                "shipment.beingShippedAsLimitedQuantity",
                false
              );
            },
            state.hazProInspectorContext.shipment?.beingShippedAsLimitedQuantity
          )}
        </View>
      )}

      {state.hazProInspectorContext.isExceptedQuantity && (
        <View style={styles.section}>
          <Text style={styles.question}>
            Is the shipper moving this shipment under the conditions of excepted
            quantities?
          </Text>
          {renderYesNoButtons(
            () => {
              setShipmentIsMovingAsExceptedQuantity(true);
              handleNestedInspectorContextFieldUpdate(
                "exceptedQuantityMarkingStatus.applicable",
                true
              );
              handleNestedInspectorContextFieldUpdate(
                "shipment.beingShippedAsExceptedQuantity",
                true
              );
            },
            () => {
              setShipmentIsMovingAsExceptedQuantity(false);
              handleNestedInspectorContextFieldUpdate(
                "exceptedQuantityMarkingStatus.applicable",
                false
              );
              handleNestedInspectorContextFieldUpdate(
                "shipment.beingShippedAsExceptedQuantity",
                false
              );
            },
            state.hazProInspectorContext.shipment
              ?.beingShippedAsExceptedQuantity
          )}
        </View>
      )}
      <View style={styles.buttonRow}>
        <Button
          title="Cancel"
          type="outline"
          buttonStyle={styles.cancelButton}
          titleStyle={styles.cancelButtonText}
          containerStyle={styles.buttonWrapper}
          onPress={() => {
            // navigation.goBack();
            handleNestedInspectorContextFieldUpdate("activeStep", 3);
            navigation.navigate("InspectorHazmatQuantityEntryScreen");
          }}
        />
        <Button
          title="Submit"
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitButtonText}
          containerStyle={styles.buttonWrapper}
          disabled={
            (state.hazProInspectorContext.isLimitedQuantity &&
              state.hazProInspectorContext.shipment
                ?.beingShippedAsLimitedQuantity === undefined) ||
            (state.hazProInspectorContext.isExceptedQuantity &&
              state.hazProInspectorContext.shipment
                ?.beingShippedAsExceptedQuantity === undefined)
          }
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "flex-start",
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  section: {
    marginBottom: 30,
  },
  question: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  choiceButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  selectedText: {
    color: colors.white,
    fontWeight: "bold",
  },
  unselectedText: {
    color: colors.black,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingTop: 20,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingBottom: 10,
    paddingTop: 20,
    paddingHorizontal: 20,
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
  disabledSubmitButton: {
    backgroundColor: "#ccc",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});
