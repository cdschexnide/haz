import React, {
  useState,
  useReducer,
  useCallback,
  useContext,
  JSX,
} from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import { getSubsectionQuestions } from "../../../src/utils/getForm1015SubsectionQuestions";
import { Form1015Subsection, Validation, WorkflowFieldContext } from "../../../types";
import { HazProInspectorContext as Context } from "../../../src/contexts/HazProInspectorProvider/reducer";
import { Wizard } from "../Wizard";
import { MemoizedChecklistItem } from "./InspectorChecklistItem";
import colors from "../../../src/theming/colors";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";

enum Tabs {
  WALKTHROUGH = "Walkthrough",
  LIST = "List",
}

interface Props {
  inspectorContext: Context;
  onSubmit: () => void;
  updateQuestion: (
    value: Validation,
    identifier: string,
    childId?: string
  ) => void;
  goBack: () => void;
}

interface FilterOption {
  label: string;
  value: boolean;
}

interface ChecklistFilter {
  notApplicable: FilterOption;
  satisfactory: FilterOption;
  unsatisfactory: FilterOption;
  todo: FilterOption;
}

const initialChecklistFilterState: ChecklistFilter = {
  notApplicable: { label: "N/A", value: false },
  satisfactory: { label: "SAT", value: false },
  unsatisfactory: { label: "UNSAT", value: false },
  todo: { label: "Incomplete", value: true },
};

type ChecklistFilterAction =
  | { type: "TOGGLE_FILTER"; filter: keyof ChecklistFilter }
  | { type: "RESET_FILTERS" };

const checklistFilterReducer = (
  state: ChecklistFilter,
  action: ChecklistFilterAction
): ChecklistFilter => {
  switch (action.type) {
    case "TOGGLE_FILTER":
      return {
        ...state,
        [action.filter]: {
          ...state[action.filter],
          value: !state[action.filter].value,
        },
      };
    case "RESET_FILTERS":
      return initialChecklistFilterState;
    default:
      return state;
  }
};

export const InspectorForm1015LabelingAndMarkingChecklist = ({
  inspectorContext,
  updateQuestion,
  onSubmit,
  goBack,
}: Props): JSX.Element => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filters, dispatchFilter] = useReducer(
    checklistFilterReducer,
    initialChecklistFilterState
  );
  const { state, dispatch } = useContext(HazProInspectorContext);

  const handleNestedInspectorContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  const [startingStepIndex, setStartingStepIndex] = useState<number>(0);
  const [currentWalkthroughIndex, setCurrentWalkthroughIndex] =
    useState<number>(0);

  const questions: WorkflowFieldContext[] = getSubsectionQuestions(
    inspectorContext,
    Form1015Subsection.LABELS_AND_MARKING
  );

  // const exceptedQuestion: WorkflowFieldContext = {
  //   id: "999",
  //   identifier: "999",
  //   childFields: [
  //     {
  //       id: "999a",
  //       identifier: "999a",
  //       label: "",
  //       currentValue: null,
  //       isValid: true,
  //       childFields: [],
  //     },
  //   ],
  //   label:
  //     /* label for the list item for excepted quantity marking */,
  //   currentValue: null,
  //   isValid: true,
  //   isOptional: true,
  // };

  const applyFilters = useCallback(
    (q: WorkflowFieldContext) => {
      if (!Object.values(filters).some(f => f.value)) return true;
      const val = q.currentValue;
      return (
        (filters.satisfactory.value && val === Validation.VALID) ||
        (filters.unsatisfactory.value && val === Validation.INVALID) ||
        (filters.notApplicable.value && val === Validation.NOT_APPLICABLE) ||
        (filters.todo.value && val === null)
      );
    },
    [filters]
  );

  const filteredQuestions = questions.filter(applyFilters);

  return (
    <View style={styles.container}>
      <ButtonGroup
        buttons={[Tabs.WALKTHROUGH, Tabs.LIST]}
        selectedIndex={tabIndex}
        onPress={setTabIndex}
        containerStyle={styles.tabContainer}
        selectedTextStyle={styles.selectedTab}
        textStyle={styles.tabText}
      />

      {tabIndex === 1 && (
        <>
          <View style={styles.filterRow}>
            {Object.entries(filters).map(([key, f]) => (
              <TouchableOpacity
                key={key}
                style={[styles.filterButton, f.value && styles.activeFilter]}
                onPress={() =>
                  dispatchFilter({
                    type: "TOGGLE_FILTER",
                    filter: key as keyof ChecklistFilter,
                  })
                }
              >
                <Text style={styles.filterLabel}>{f.label}</Text>
              </TouchableOpacity>
            ))}
            <Button
              title="Reset Filters"
              onPress={() => dispatchFilter({ type: "RESET_FILTERS" })}
              buttonStyle={styles.resetButton}
            />
          </View>
          <FlatList
            data={filteredQuestions}
            keyExtractor={item => item.identifier}
            renderItem={({ item, index }) => (
              <MemoizedChecklistItem
                item={{
                  identifier: item.identifier,
                  label: item.label,
                  currentValue: item.currentValue,
                  isFrustrated: false,
                  walkthroughQuestions: item.childFields.map(c => ({
                    id: c.id,
                    label: c.label,
                    currentValue: c.currentValue,
                    isFrustrated: false,
                    isOptional: c.isOptional,
                  })),
                }}
                index={parseInt(item.identifier)}
                updateListQuestions={updateQuestion}
                navigateToWalkthrough={() => {
                  setTabIndex(0);
                  const fullIndex = questions.findIndex(
                    q => q.identifier === item.identifier
                  );
                  if (fullIndex !== -1) {
                    setStartingStepIndex(fullIndex);
                    setCurrentWalkthroughIndex(0);
                  }
                }}
                hazmatAcknowledgement={true}
              />
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
              onPress={onSubmit}
            />
          </View>
        </>
      )}

      {tabIndex === 0 && (
        <Wizard
          onSubmit={onSubmit}
          setStepValue={updateQuestion}
          steps={questions.map(q => ({
            identifier: q.identifier,
            label: q.label,
            currentValue: q.currentValue,
            isFrustrated: false,
            isOptional: q.isOptional,
            walkthroughQuestions: q.childFields.map(c => ({
              id: c.id,
              label: c.label,
              currentValue: c.currentValue,
              isFrustrated: false,
              isOptional: c.isOptional,
            })),
          }))}
          startingStepIndex={startingStepIndex}
          setStartingStepIndex={setStartingStepIndex}
          setCurrentWalkthroughIndex={setCurrentWalkthroughIndex}
          currentWalkthroughIndex={currentWalkthroughIndex}
          navigateToFrustrationView={() => {}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  tabContainer: {
    backgroundColor: colors.tabGray,
    borderColor: colors.borderGray,
    borderRadius: 10,
    borderWidth: 2,
    height: 55,
  },
  tabText: { fontSize: 24 },
  selectedTab: { fontWeight: "bold" },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 10,
    paddingHorizontal: 10,
    gap: 5,
    justifyContent: "flex-end",
  },
  filterButton: {
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: colors.lightGrey,
    borderColor: colors.grey,
  },
  activeFilter: {
    backgroundColor: colors.highlightBlue,
    borderColor: colors.jiJoeBlue,
  },
  resetButton: {
    borderRadius: 5,
    backgroundColor: colors.blue,
    paddingVertical: 10,
    paddingHorizontal: 15,
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
  submitButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  filterLabel: {
    fontSize: 16,
  },
});
