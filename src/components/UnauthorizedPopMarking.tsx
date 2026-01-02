import { useHazProStore } from "@/stores/useHazProStore";
import { validatePopMarking } from "@/utils/validatePopMarking";
import { Button, Icon, Text } from "react-native-elements";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "@rneui/themed";

const UnauthorizedPopMarking = ({ navigation }: { navigation: any }) => {
  // ✅ NEW: Direct mutations replace dispatch pattern
  const { state, store } = useHazProStore();

  const completedSubsteps = state.hazProPreparerContext.completedSubsteps;

  // ✅ NEW: Direct mutations replace dispatch pattern

  const validationResult = validatePopMarking(
    state.hazProPreparerContext.hazardousMaterial,
    state.hazProPreparerContext.lookupFunctionsOutput,
    state.hazProPreparerContext.packaging?.inputPOPMarking?.B,
    state.hazProPreparerContext.packaging?.inputPOPMarking?.C
  );

  const popMarking = state.hazProPreparerContext.packaging?.inputPOPMarking || {
    A: "",
    B: "",
    C: "",
    D: "",
    E: "",
    F: "",
    G: "",
    H: "",
  };

  const formattedPOP = `${popMarking.A}   ${popMarking.B} / ${popMarking.C} ${popMarking.D} / ${popMarking.E} / ${popMarking.F} / ${popMarking.G} / ${popMarking.H}`;

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
          {/* <Text style={styles.popMarkingLabel}>Entered POP Marking:</Text> */}
          <Text style={styles.popMarking}>{formattedPOP}</Text>
        </Card>
      </View>

      {/* Scrollable Error & Suggestions Section */}
      <ScrollView style={styles.errorContainer}>
        {/* Display Reasons for Invalidity */}
        {validationResult.errors && validationResult.errors?.length > 0 && (
          <Card containerStyle={styles.errorCard}>
            <Card.Title style={styles.errorHeader}>
              Reasons for Invalidity
            </Card.Title>
            <Card.Divider />
            {validationResult.errors.map((error, index) => (
              <Text key={index} style={styles.errorText}>
                {"\u2022"} {error}
              </Text>
            ))}
          </Card>
        )}

        {/* Display valid packing group options if applicable */}
        {validationResult.availablePackingGroups && (
          <Card containerStyle={styles.suggestionCard}>
            <Card.Title style={styles.suggestionHeader}>
              Valid Packing Group Options
            </Card.Title>
            <Card.Divider />
            <Text style={styles.suggestionText}>
              {validationResult.availablePackingGroups.join(", ")}
            </Text>
          </Card>
        )}

        {/* Display valid packaging options if applicable */}
        {validationResult.availablePackagingOptions && (
          <Card containerStyle={styles.suggestionCard}>
            <Card.Title style={styles.suggestionHeader}>
              Valid Packaging Options
            </Card.Title>
            <Card.Divider />
            {Object.entries(validationResult.availablePackagingOptions).map(
              ([category, options], index) => (
                <Text key={index} style={styles.suggestionText}>
                  <Text style={styles.categoryLabel}>{category}: </Text>{" "}
                  {options.join(", ")}
                </Text>
              )
            )}
          </Card>
        )}
      </ScrollView>

      {/* Back Button */}
      <Button
        title="Go Back"
        buttonStyle={styles.backButton}
        titleStyle={styles.backButtonText}
        onPress={() => {
          // ✅ NEW: Direct mutations replace dispatch pattern
          if (store.hazProPreparerContext) {
            store.hazProPreparerContext.completedSubsteps =
              completedSubsteps.slice(0, -1);
          }
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default UnauthorizedPopMarking;

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
