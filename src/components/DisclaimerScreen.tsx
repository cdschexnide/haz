import { useHazProStore } from "@/stores/useHazProStore";
import { Card } from "@rneui/themed";
import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-elements";

console.warn = () => {};

const DisclaimerScreen = ({ navigation }: { navigation: any }) => {
  const { state } = useHazProStore();

  const activePersona = state.hazProPreparerContext.activePersona;

  return (
    <View style={styles.container}>
      <Card containerStyle={styles.card}>
        <Card.Title style={styles.cardTitle}>Important Disclaimer</Card.Title>
        <Card.Divider />
        <View style={styles.disclaimerTextContainer}>
          <Text style={styles.disclaimerText}>
            HazPro is a support tool designed to assist in the preparation of
            hazardous materials for shipment. The use of this application does
            not replace or waive any responsibilities, training, or legal
            requirements associated with hazardous material preparation, as
            mandated by applicable laws and regulations.
          </Text>

          <Text style={styles.disclaimerText}>
            Failure to comply in all respects with applicable Hazardous
            Materials / Dangerous Goods Regulations may be in breach of the
            applicable law, subject to legal penalties.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Accept"
            buttonStyle={styles.acceptButton}
            onPress={() => {
              if (activePersona === "Preparer") {
                navigation.navigate("ShipmentCreation");
              } else if (activePersona === "Inspector") {
                navigation.navigate("InspectorShipmentCreationScreen");
              }
            }}
          />
          <Button
            title="Decline"
            buttonStyle={styles.declineButton}
            onPress={() => {
              if (activePersona === "Preparer") {
                navigation.navigate("PreparerHome");
              } else if (activePersona === "Inspector") {
                navigation.navigate("ShipmentHome");
              }
            }}
          />
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
  card: {
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  disclaimerTextContainer: {
    paddingHorizontal: 50,
    paddingVertical: 20,
  },
  disclaimerText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "justify",
    color: "#333",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 20,
  },
  acceptButton: {
    backgroundColor: "#28a745",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 250,
  },
  declineButton: {
    backgroundColor: "red",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: 250,
  },
});

export default DisclaimerScreen;
