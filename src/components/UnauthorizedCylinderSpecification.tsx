import { useHazProStore } from "@/stores/useHazProStore";
import { Button, Icon, Text } from "react-native-elements";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "@rneui/themed";

const UnauthorizedCylinderSpecification = ({
  navigation,
}: {
  navigation: any;
}) => {
  // ✅ NEW: Direct mutations replace dispatch pattern
  const { state } = useHazProStore();

  const invalidDotCylinderSpecification =
    state.hazProPreparerContext.packaging?.inputCylinderPOPMarking || "";

  return (
    <View style={styles.container}>
      {/* Row for Unauthorized Box & POP Marking */}
      <View style={styles.rowContainer}>
        {/* Unauthorized Box */}
        <Card containerStyle={styles.unauthorizedBox}>
          <View style={styles.unauthorizedHeader}>
            <Icon name="close" size={30} color="red" />
            <Text style={styles.unauthText}>Unauthorized</Text>
          </View>
        </Card>

        {/* POP Marking Display */}
        <Card containerStyle={styles.popMarkingContainer}>
          <Text style={styles.popMarkingLabel}>
            Entered DOT Cylinder Specification:
          </Text>
          <Text style={styles.popMarking}>
            {invalidDotCylinderSpecification}
          </Text>
        </Card>
      </View>

      {/* Scrollable Error & Suggestions Section */}
      <ScrollView style={styles.errorContainer}>
        {/* Display Reasons for Invalidity */}
        <Card containerStyle={styles.errorCard}>
          <Card.Title style={styles.errorHeader}>
            Reasons for Invalidity
          </Card.Title>
          <Card.Divider />
          <Text style={styles.errorText}>
            {`${invalidDotCylinderSpecification} is not a valid DOT Cylinder Specification.`}
          </Text>
        </Card>

        <Card containerStyle={styles.suggestionCard}>
          <Card.Title style={styles.suggestionHeader}>
            How to Proceed
          </Card.Title>
          <Card.Divider />
          <Text style={styles.suggestionText}>
            The DOT cylinder specification you entered is not authorized for
            use. Please return to the previous screen and enter a different DOT
            cylinder specification that is valid for this packaging scenario.
          </Text>
        </Card>
      </ScrollView>

      {/* Back Button */}
      <Button
        title="Go Back"
        buttonStyle={styles.backButton}
        titleStyle={styles.backButtonText}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
};

export default UnauthorizedCylinderSpecification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  unauthorizedBox: {
    backgroundColor: "#ffe6e6",
    borderColor: "red",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    padding: 10,
    flex: 1,
    marginRight: 10,
  },
  unauthorizedHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  unauthText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "red",
    marginLeft: 10,
  },
  popMarkingContainer: {
    backgroundColor: "#f4f4f4",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    flex: 1,
  },
  popMarkingLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  popMarking: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#555",
    textAlign: "center",
  },
  errorContainer: {
    flex: 1,
  },
  errorCard: {
    backgroundColor: "#ffebee",
    borderRadius: 8,
  },
  errorHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#c62828",
  },
  errorText: {
    fontSize: 16,
    color: "#b71c1c",
    marginBottom: 8,
  },
  suggestionCard: {
    backgroundColor: "#e3f2fd",
    borderRadius: 8,
  },
  suggestionHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e88e5",
  },
  suggestionText: {
    fontSize: 16,
    color: "#1565c0",
    marginBottom: 8,
  },
  categoryLabel: {
    fontWeight: "bold",
    color: "#0d47a1",
  },
  backButton: {
    backgroundColor: "#007bff",
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 20,
    width: "30%",
    marginLeft: 320,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
});
