import React, { useContext, JSX } from "react";
import { View, FlatList, StyleSheet, Text } from "react-native";
import { Button, ButtonGroup, ListItem } from "react-native-elements";
import { Pre1015Question, Validation, PhysicalState } from "../../../types";
import { getChecklistButtons } from "../../../src/utils/getChecklistButtons";
import colors from "../../../src/theming/colors";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";

interface Props {
  questions: Pre1015Question[];
  updateQuestion: (value: Validation, id: string) => void;
  onSubmit: () => void;
  goBack: () => void;
}

const InspectorInitialQuestioningChecklist = ({
  questions,
  updateQuestion,
  onSubmit,
  goBack,
}: Props): JSX.Element => {
  const { state, dispatch } = useContext(HazProInspectorContext);
  const { yesNoButtons, yesNoButtonStyles } = getChecklistButtons();

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const unid = state.hazProInspectorContext.hazardousMaterial?.unid ?? "N/A";

  return (
    <View style={styles.flex1}>
      <View style={styles.headerContainer}>
        <View style={styles.unidBox}>
          <Text style={styles.unidText}>{unid}</Text>
        </View>
        <View style={styles.headerContent}>
          <Text style={styles.header}>Initial Inspector Questions</Text>
          <Text style={styles.subheader}>
            Please answer all items below before proceeding.
          </Text>
        </View>
      </View>

      {/* <FlatList
        data={questions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ListItem
            style={styles.listItem}
            containerStyle={styles.listItemContainerStyle}
            bottomDivider
          >
            <ListItem.Content style={styles.listContent}>
              <View style={styles.listDescription}>
                <ListItem.Title>
                  <Text>{item.text}</Text>
                </ListItem.Title>
              </View>
              <ButtonGroup
                buttons={yesNoButtons}
                onPress={(pressIndex): void => {
                  const val =
                    pressIndex === 0 ? Validation.VALID : Validation.INVALID;
                  updateQuestion(val, item.id);
                }}
                selectedIndex={
                  item.value === null
                    ? undefined
                    : item.value === true
                      ? 0
                      : 1
                }
                selectedButtonStyle={
                  item.value === null
                    ? undefined
                    : yesNoButtonStyles[item.value === true ? 0 : 1]
                }
                buttonStyle={styles.checklistButton}
                selectedTextStyle={styles.selectedButton}
                containerStyle={styles.buttonGroupContainer}
                textStyle={styles.buttonGroupText}
              />
            </ListItem.Content>
          </ListItem>
        )}
      /> */}
      <FlatList
        data={questions}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ListItem
            style={styles.listItem}
            containerStyle={styles.listItemContainerStyle}
            bottomDivider
          >
            <ListItem.Content style={styles.listContent}>
              <View style={styles.listDescription}>
                <ListItem.Title>
                  <Text>{item.text}</Text>
                </ListItem.Title>
              </View>
              <View style={styles.buttonGroupWrapper}>
                <Button
                  title="Yes"
                  onPress={() => updateQuestion(Validation.VALID, item.id)}
                  buttonStyle={[
                    styles.yesNoButton,
                    item.value === true && styles.selectedYesNoButton,
                  ]}
                  titleStyle={[
                    styles.yesNoButtonText,
                    item.value === true && styles.selectedYesNoButtonText,
                  ]}
                  type="outline"
                />
                <Button
                  title="No"
                  onPress={() => updateQuestion(Validation.INVALID, item.id)}
                  buttonStyle={[
                    styles.yesNoButton,
                    item.value === false && styles.selectedYesNoButton,
                  ]}
                  titleStyle={[
                    styles.yesNoButtonText,
                    item.value === false && styles.selectedYesNoButtonText,
                  ]}
                  type="outline"
                />
              </View>
            </ListItem.Content>
          </ListItem>
        )}
      />

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
          title="Submit"
          buttonStyle={styles.submitButton}
          titleStyle={styles.submitButtonText}
          containerStyle={styles.buttonWrapper}
          disabled={questions.some(q => q.value === null)}
          onPress={onSubmit}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.blue,
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    width: 187,
  },
  buttonGroupContainer: {
    height: 75,
  },
  buttonGroupText: {
    fontSize: 24,
  },
  checklistButton: {
    width: 100,
  },
  flex1: {
    flex: 1,
    backgroundColor: colors.white,
  },
  listContent: {
    backgroundColor: colors.white,
    flexDirection: "row",
    flexShrink: 1,
    flexWrap: "wrap",
    height: 75,
    marginVertical: 0,
    overflow: "scroll",
    paddingVertical: 0,
  },
  listDescription: {
    flex: 1,
  },
  listItem: {
    alignItems: "flex-start",
    backgroundColor: colors.white,
    flexDirection: "column",
    flexShrink: 2,
    flexWrap: "wrap",
    marginVertical: 0,
    paddingLeft: 2,
    paddingVertical: 0,
  },
  listItemContainerStyle: {
    paddingVertical: 0,
  },
  selectedButton: {
    fontWeight: "700",
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    marginBottom: 20,
    backgroundColor: colors.white,
    flexDirection: "row",
    alignItems: "center",
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 6,
    color: colors.black,
    textAlign: "center",
  },
  subheader: {
    fontSize: 20,
    fontWeight: "400",
    color: colors.darkGrey,
    textAlign: "center",
  },
  unidBox: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: colors.borderGray,
    marginRight: 12,
  },
  unidText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
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
  buttonGroupWrapper: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginTop: 5,
  },

  yesNoButton: {
    width: 80,
    borderColor: "#007bff",
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    backgroundColor: "white",
  },

  selectedYesNoButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },

  yesNoButtonText: {
    fontSize: 18,
    color: "#007bff",
    fontWeight: "600",
  },

  selectedYesNoButtonText: {
    color: "white",
  },
});

export default InspectorInitialQuestioningChecklist;
