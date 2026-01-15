import React, { useContext, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { HazProInspectorContext } from "../../contexts/HazProInspectorProvider/HazProInspectorContext";
import { Validation } from "../../../types";
import InspectorInitialQuestioningChecklist from "../../components/Inspector/InspectorInitialQuestioningChecklist";

const InspectorInitialQuestioningScreen = ({
  navigation,
}: {
  navigation: any;
}) => {
  const { state, dispatch } = useContext(HazProInspectorContext);

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  // const updateInitialQuestion = (value: Validation, id: string) => {
  //   console.log('id: ', id);
  //   console.log('value: ', value);
  //   const updated = state.hazProInspectorContext.initial1015Questions.map((q) =>
  //     q.id === id ? { ...q, value } : q
  //   );
  //   console.log('updated: ', JSON.stringify(updated, null, 2));
  //   handleNestedInspectorContextFieldUpdate("initial1015Questions", updated);
  // };

  const updateInitialQuestion = (value: Validation, id: string) => {
    const booleanValue = value === Validation.VALID ? true : false;
    const updated = state.hazProInspectorContext.initial1015Questions.map(q =>
      q.id === id ? { ...q, value: booleanValue } : q
    );

    handleNestedInspectorContextFieldUpdate("initial1015Questions", updated);
  };

  const onSubmit = () => {
    navigation.navigate("InspectorSDDGScreen");
  };

  useEffect(() => {
    handleNestedInspectorContextFieldUpdate("activeStep", 5);
  }, []);

  const goBack = () => {
    if (
      state.hazProInspectorContext.isLimitedQuantity ||
      state.hazProInspectorContext.isExceptedQuantity
    ) {
      handleNestedInspectorContextFieldUpdate("activeStep", 4);
      navigation.navigate("InspectorExceptedOrLimitedQuantities");
    } else {
      handleNestedInspectorContextFieldUpdate("activeStep", 3);
      navigation.navigate("InspectorHazmatQuantityEntryScreen");
    }
  };

  return (
    <View style={styles.container}>
      <InspectorInitialQuestioningChecklist
        questions={state.hazProInspectorContext.initial1015Questions}
        updateQuestion={updateInitialQuestion}
        onSubmit={onSubmit}
        goBack={goBack}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
});

export default InspectorInitialQuestioningScreen;
