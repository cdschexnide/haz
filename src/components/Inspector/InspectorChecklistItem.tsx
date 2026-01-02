import { ListItem, ButtonGroup } from "react-native-elements";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import React, { JSX } from "react";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { ListQuestion, SatUnsatNa, Validation } from "../../../types";
import colors from "../../../src/theming/colors";
import { getChecklistButtons } from "../../../src/utils/getChecklistButtons";

export interface MemoizedChecklistItemProps {
  navigateToWalkthrough: (stepIndex: number) => void;
  updateListQuestions: (answerIndex: number, identifier: string) => void;
  item: ListQuestion;
  index: number;
  hazmatAcknowledgement: boolean;
}

export const MemoizedChecklistItem = React.memo(
  ({
    navigateToWalkthrough,
    updateListQuestions,
    item,
    index,
  }: MemoizedChecklistItemProps): JSX.Element => {
    const { isOptional, identifier, label, currentValue } = item;
    const tmp = [];
    const { buttons: checklistButtons, styles: checklistButtonStyles } =
      getButtonsWithStyles(isOptional);

    if (identifier === "12d") {
      tmp.push(
        <MaterialCommunityIcons
          name="airplane"
          size={styles.icons.fontSize}
          color={styles.icons.color}
          style={styles.icons}
          testID="airplaneIcon"
        />
      );
      checklistButtonStyles.unshift({ backgroundColor: undefined });
    } else if (identifier === "12e") {
      tmp.push(
        <Feather
          name="type"
          size={styles.icons.fontSize}
          color={styles.icons.color}
          testID="centerOfBalanceIcon"
        />
      );
      checklistButtonStyles.unshift({ backgroundColor: undefined });
    }
    tmp.push(checklistButtons);
    const checkListButtons = tmp.flat();

    let selectedChecklistButton: number | null = null;

    if (currentValue !== null) {
      if (isOptional) {
        if (currentValue === Validation.NOT_APPLICABLE) {
          selectedChecklistButton = 0;
        } else if (currentValue === Validation.VALID) {
          selectedChecklistButton = 1;
        } else if (currentValue === Validation.INVALID) {
          selectedChecklistButton = 2;
        }
      } else {
        selectedChecklistButton = currentValue === Validation.VALID ? 0 : 1;
      }
    }

    const handlePress = (pressIndex: number, identifier: string): void => {
      if (isOptional) {
        if (pressIndex === 0) {
          updateListQuestions(Validation.NOT_APPLICABLE, identifier);
        } else if (pressIndex === 1) {
          updateListQuestions(Validation.VALID, identifier);
        } else {
          updateListQuestions(Validation.INVALID, identifier);
        }
      } else {
        updateListQuestions(
          pressIndex === 0 ? Validation.VALID : Validation.INVALID,
          identifier
        );
      }
    };

    return (
      <ListItem
        style={styles.listItem}
        containerStyle={styles.listItemContainerStyle}
        bottomDivider
      >
        <ListItem.Content style={styles.listContent}>
          <View style={styles.listDescription}>
            <TouchableOpacity
              onPress={(): void => navigateToWalkthrough(index)}
            >
              <ListItem.Title>
                <Text>
                  {identifier}. {label}
                </Text>
              </ListItem.Title>
            </TouchableOpacity>
          </View>
          <ButtonGroup
            buttons={checkListButtons}
            onPress={(pressIndex): void => handlePress(pressIndex, identifier)}
            selectedIndex={selectedChecklistButton}
            selectedButtonStyle={
              checklistButtonStyles[selectedChecklistButton ?? 0]
            }
            buttonStyle={styles.button}
            selectedTextStyle={styles.selectedButton}
            containerStyle={styles.buttonGroupContainer}
            textStyle={styles.buttonGroupText}
          />
        </ListItem.Content>
      </ListItem>
    );
  }
);

MemoizedChecklistItem.displayName = "MemoizedChecklistItem";

const getButtonsWithStyles = (
  isOptional: boolean | undefined
): { buttons: SatUnsatNa[]; styles: { backgroundColor?: string }[] } => {
  const {
    yesNoButtons,
    yesNoButtonStyles,
    yesNoNaButtons,
    yesNoNaButtonStyles,
  } = getChecklistButtons();

  if (isOptional) {
    return {
      buttons: yesNoNaButtons,
      styles: yesNoNaButtonStyles,
    };
  }
  return {
    buttons: yesNoButtons,
    styles: yesNoButtonStyles,
  };
};

const styles = StyleSheet.create({
  alignCenter: { alignItems: "center" },
  button: {
    width: 100,
  },
  buttonGroupContainer: {
    height: 75,
  },
  buttonGroupText: {
    fontSize: 24,
  },
  frustratedButton: {
    alignContent: "center",
    backgroundColor: colors.noRed,
    borderColor: colors.borderGray,
    borderRadius: 5,
    borderWidth: 2,
    height: 60,
    justifyContent: "center",
    marginRight: 10,
    marginVertical: 5,
    width: 200,
  },
  frustratedText: {
    color: colors.white,
    fontSize: 24,
    textAlign: "center",
  },
  icons: {
    color: colors.black,
    fontSize: 30,
    textAlign: "center",
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
    flex: 3,
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
  noRightMargin: { marginRight: 0 },
  noRightPadding: { paddingRight: 0 },
  quickLinkText: {
    color: colors.blue,
  },
  selectedButton: {
    fontWeight: "700",
  },
  viewButton: {
    width: 120,
  },
});
