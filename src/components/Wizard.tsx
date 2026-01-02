import React, { FC, useState, useMemo, useEffect, JSX } from "react";
import { View, StyleSheet, Image, FlatList, Pressable } from "react-native";
import { Button, ButtonGroup, Text } from "react-native-elements";
// import { walkthroughImages } from "../mockData/inspectionQuestions";
// import { JiJoeView } from "../types";
import { TouchableOpacity } from "react-native-gesture-handler";
import colors from "@/theming/colors";
import { ListQuestion, Validation, WalkthroughQuestion } from "../../types";
import { getChecklistButtons } from "@/utils/getChecklistButtons";
import { walkthroughImages } from "@/mock/walkthroughImages";

export interface WizardInput {
  onSubmit: () => void;
  steps: ListQuestion[];
  setStepValue: (
    selectedValue: number,
    blockLabel: string,
    childId?: string
  ) => void;
  startingStepIndex: number;
  setCurrentWalkthroughIndex: React.Dispatch<React.SetStateAction<number>>;
  currentWalkthroughIndex: number;
  navigateToFrustrationView: (identifier: string) => void;
  setStartingStepIndex: React.Dispatch<React.SetStateAction<number>>;
}

export const Wizard: FC<WizardInput> = ({
  steps,
  onSubmit,
  setStepValue,
  startingStepIndex = 0,
  setCurrentWalkthroughIndex,
  currentWalkthroughIndex,
  navigateToFrustrationView,
  setStartingStepIndex,
}: WizardInput): JSX.Element => {
  const [currentStepIndex, setCurrentStepIndex] = useState(startingStepIndex);
  const [selectedImage, setSelectedImage] = useState();

  const currentStepValue = useMemo(() => {
    if (steps.length === 0) {
      return null;
    }

    if (currentStepIndex > steps.length - 1) {
      setCurrentStepIndex(0);
      return steps[0];
    }
    return steps[currentStepIndex];
  }, [steps, currentStepIndex]);

  const hasWalkthroughQuestions = useMemo(() => {
    if (!currentStepValue) {
      return false;
    }
    return currentStepValue.walkthroughQuestions.length !== 0;
  }, [currentStepValue]);

  const currentWalkthrough = useMemo(() => {
    if (!hasWalkthroughQuestions || !currentStepValue) {
      return null;
    }
    return currentStepValue.walkthroughQuestions[currentWalkthroughIndex];
  }, [currentStepValue, currentWalkthroughIndex, hasWalkthroughQuestions]);

  const currentWalkthroughImage = walkthroughImages.find(image => {
    // console.log('image.label: ', image.label);
    // console.log('currentWalkthrough?.label: ', currentWalkthrough?.label);
    return image.label === currentWalkthrough?.label;
  });

  useEffect(() => {
    if (currentWalkthroughImage?.src.length) {
      setSelectedImage(currentWalkthroughImage.src[0]);
    }
  }, [currentWalkthroughIndex, currentWalkthroughImage]);

  // useEffect(() => {
  //   console.log('currentWalkthroughImage: ', currentWalkthroughImage);
  // }, [currentWalkthroughImage]);

  const stepForward = (): void => {
    if (!currentStepValue) {
      return;
    }

    if (
      currentWalkthroughIndex <
      currentStepValue.walkthroughQuestions.length - 1
    ) {
      setCurrentWalkthroughIndex(prev => prev + 1);
    } else if (currentStepIndex < steps.length - 1) {
      setStartingStepIndex(currentStepIndex + 1);
      setCurrentStepIndex(prev => prev + 1);
      setCurrentWalkthroughIndex(0);
    }
  };

  const stepBack = (): void => {
    if (currentWalkthroughIndex > 0) {
      setCurrentWalkthroughIndex(prev => prev - 1);
    } else if (currentStepIndex > 0) {
      const previousWalkthroughIndex =
        steps[currentStepIndex - 1].walkthroughQuestions.length - 1;
      setStartingStepIndex(currentStepIndex - 1);

      setCurrentStepIndex(prev => prev - 1);
      setCurrentWalkthroughIndex(
        previousWalkthroughIndex < 0 ? 0 : previousWalkthroughIndex
      );
    }
  };

  const handleWalkthroughSelection = (pressIndex: number): void => {
    if (!currentStepValue) {
      return;
    }

    if (!hasWalkthroughQuestions) {
      setStepValue(pressIndex, currentStepValue.identifier);
      return;
    }

    setStepValue(
      pressIndex,
      currentStepValue.identifier,
      currentWalkthrough?.id
    );
  };

  // const handleWalkthroughSelection = (pressIndex: number): void => {
  //   if (!currentStepValue) return;

  //   const isOptional =
  //     (currentWalkthrough && currentWalkthrough.isOptional) ||
  //     currentStepValue?.isOptional;

  //   let validationValue: Validation;

  //   if (isOptional) {
  //     if (pressIndex === 0) {
  //       validationValue = Validation.NOT_APPLICABLE;
  //     } else if (pressIndex === 1) {
  //       validationValue = Validation.VALID;
  //     } else {
  //       validationValue = Validation.INVALID;
  //     }
  //   } else {
  //     validationValue = pressIndex === 0 ? Validation.VALID : Validation.INVALID;
  //   }

  //   setStepValue(
  //     validationValue,
  //     currentStepValue.identifier,
  //     currentWalkthrough?.id
  //   );
  // };

  // Render image list
  const renderImageList = (): JSX.Element => {
    if (!currentWalkthroughImage?.src || !currentWalkthroughImage.src.length) {
      return <></>;
    }

    return (
      <View style={styles.container}>
        <View style={styles.maxWidth}>
          {selectedImage && (
            <View style={styles.maxWidthAndHeight}>
              <Image
                style={styles.maxWidthAndHeight}
                source={selectedImage}
                resizeMode="contain"
              />
            </View>
          )}
        </View>
        <View style={styles.imagePreviewContainer}>
          <FlatList
            data={currentWalkthroughImage.src}
            persistentScrollbar
            renderItem={(data): JSX.Element => (
              <Pressable
                style={[
                  styles.imagePreview,
                  selectedImage === data.item
                    ? styles.highlightedPreview
                    : styles.whiteBackground,
                ]}
                onPress={(): void => setSelectedImage(data.item)}
              >
                <Image
                  style={styles.imagePreview}
                  source={data.item}
                  resizeMode="center"
                />
              </Pressable>
            )}
          />
        </View>
      </View>
    );
  };

  const renderSingleImage = (): JSX.Element => {
    if (!currentWalkthroughImage) {
      return <></>;
    }
    return (
      <Image
        style={styles.image}
        resizeMode="contain"
        onError={(error): void => console.log("error", error)}
        source={currentWalkthroughImage.src}
      />
    );
  };

  // Render buttons based on currentStep type
  const renderWalkthroughButtons = (): JSX.Element => {
    if (!currentStepValue) {
      return <View />;
    }

    if (currentStepValue?.isFrustrated) {
      return (
        <TouchableOpacity
          onPress={(): void =>
            navigateToFrustrationView(currentStepValue.identifier)
          }
        >
          <View style={styles.frustratedButton}>
            <Text style={styles.frustratedText}>FRUSTRATED</Text>
          </View>
        </TouchableOpacity>
      );
    }
    const memoizedWalkthroughButtons = useMemo(
      () => (
        <NormalWalkthroughButtons
          key={`${currentStepValue?.identifier}-${currentWalkthrough?.id}`}
          currentWalkthrough={currentWalkthrough}
          currentStepValue={currentStepValue}
          handleWalkthroughSelection={handleWalkthroughSelection}
        />
      ),
      [
        currentStepValue?.identifier,
        currentWalkthrough?.id,
        currentWalkthrough?.currentValue,
        currentStepValue?.currentValue,
      ]
    );

    return memoizedWalkthroughButtons;
  };

  const renderNavigationButtons = (): JSX.Element => {
    if (!currentStepValue) {
      return <View />;
    }
    return (
      <View style={styles.buttonWrapper}>
        <Button
          title="Previous"
          disabled={currentStepIndex === 0 && currentWalkthroughIndex === 0}
          onPress={(): void => stepBack()}
          buttonStyle={styles.button}
          titleStyle={styles.title}
        />
        {currentStepIndex !== steps.length - 1 ||
        (currentStepIndex === steps.length - 1 &&
          currentWalkthroughIndex !==
            currentStepValue.walkthroughQuestions.length - 1) ? (
          <Button
            title="Next"
            onPress={(): void => stepForward()}
            buttonStyle={styles.button}
            titleStyle={styles.title}
          />
        ) : (
          <Button
            title="Submit"
            disabled={currentStepIndex === 0}
            onPress={onSubmit}
            buttonStyle={styles.button}
            titleStyle={styles.title}
          />
        )}
      </View>
    );
  };

  if (!currentStepValue) {
    return <View />;
  }
  return (
    <View style={styles.root}>
      <View style={styles.wizardStep}>
        <Text style={styles.text}>
          {currentStepValue.identifier}.{" "}
          {currentWalkthrough
            ? currentWalkthrough.label
            : currentStepValue.label}
        </Text>
        {(currentStepValue.identifier === "12d" ||
          currentStepValue.identifier === "12e") && (
          <Text
            // onPress={(): void =>
            //   changeView(
            //     currentStepValue.identifier === "12d"
            //       ? JiJoeView.AIRCRAFT_CHARACTERISTICS
            //       : JiJoeView.CB
            //   )
            // }
            style={[styles.text, styles.quickLinkText]}
          >
            (view{" "}
            {currentStepValue.identifier === "12d"
              ? "aircraft characteristics"
              : "center of balance tool"}
            )
          </Text>
        )}
        <View style={styles.walkthroughImageContainer}>
          {currentWalkthroughImage && (
            <>
              {currentWalkthroughImage.src.length
                ? renderImageList()
                : renderSingleImage()}
            </>
          )}
        </View>
      </View>

      {renderWalkthroughButtons()}
      {renderNavigationButtons()}
    </View>
  );
};

const NormalWalkthroughButtons = ({
  currentWalkthrough,
  currentStepValue,
  handleWalkthroughSelection,
}: {
  currentWalkthrough: WalkthroughQuestion | null;
  currentStepValue: ListQuestion;
  handleWalkthroughSelection: (pressIndex: number) => void;
}): JSX.Element => {
  const {
    yesNoButtons,
    yesNoButtonStyles,
    yesNoNaButtons,
    yesNoNaButtonStyles,
  } = getChecklistButtons();
  const buttons =
    (currentWalkthrough && currentWalkthrough.isOptional) ||
    currentStepValue?.isOptional
      ? yesNoNaButtons
      : yesNoButtons;
  // const selectedValue = currentWalkthrough
  //   ? currentWalkthrough.currentValue
  //   : currentStepValue.currentValue;
  const selectedValue = currentStepValue.currentValue;
  const selectedButtonStyles =
    (currentWalkthrough && currentWalkthrough.isOptional) ||
    currentStepValue?.isOptional
      ? yesNoNaButtonStyles
      : yesNoButtonStyles;

  const selectedButtonStylesBoolean =
    (currentWalkthrough && currentWalkthrough.isOptional) ||
    currentStepValue?.isOptional
      ? "yesNoNaButtonStyles"
      : "yesNoButtonStyles";

  let selectedButtonIndex = null;

  if (selectedValue !== null) {
    if (buttons.length === 3) {
      // N/A, SAT, UNSAT buttons
      if (selectedValue === Validation.NOT_APPLICABLE) {
        selectedButtonIndex = 0;
      } else if (selectedValue === Validation.VALID) {
        selectedButtonIndex = 1;
      } else if (selectedValue === Validation.INVALID) {
        selectedButtonIndex = 2;
      }
    } else {
      selectedButtonIndex = selectedValue === Validation.VALID ? 0 : 1;
    }
  }

  const handleOnPress = (pressIndex: number): void => {
    if (buttons.length !== 3) {
      handleWalkthroughSelection(pressIndex);
      return;
    }

    // if the question has N/A we need to map the value differently...
    if (pressIndex === 0) {
      // update answer to be N/A
      handleWalkthroughSelection(2);
    } else if (pressIndex === 1) {
      // update answer to be SAT
      handleWalkthroughSelection(0);
    } else {
      // update answer to be UNSAT
      handleWalkthroughSelection(1);
    }
  };

  return (
    <ButtonGroup
      buttons={buttons}
      selectedIndex={selectedButtonIndex}
      selectedButtonStyle={selectedButtonStyles[selectedButtonIndex ?? 0]}
      onPress={handleOnPress}
      selectedTextStyle={styles.selectedButton}
      containerStyle={styles.buttonGroupContainer}
      textStyle={styles.buttonText}
    />
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
    borderColor: colors.borderGray,
    borderRadius: 5,
    borderWidth: 2,
    height: 60,
    width: "98%",
  },
  buttonText: { fontSize: 24 },
  buttonWrapper: {
    alignItems: "center",
    flexDirection: "row",
    height: 80,
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginTop: -15,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  frustratedButton: {
    alignContent: "center",
    backgroundColor: colors.noRed,
    borderColor: colors.borderGray,
    borderRadius: 5,
    borderWidth: 2,
    height: 60,
    justifyContent: "center",
    marginHorizontal: 10,
    marginVertical: 5,
    width: "98%",
  },
  frustratedText: {
    color: colors.white,
    fontSize: 24,
    textAlign: "center",
  },
  highlightedPreview: {
    backgroundColor: colors.highlightBlue,
  },
  image: {
    height: "100%",
    width: "100%",
    // backgroundColor: "red",
  },
  imagePreview: { height: 200, width: 200 },
  imagePreviewContainer: { width: 200 },
  maxWidth: { flex: 1 },
  maxWidthAndHeight: { height: "100%", width: "100%" },
  quickLinkText: {
    color: colors.blue,
  },
  root: {
    flex: 1,
  },
  selectedButton: {
    fontWeight: "700",
  },
  text: {
    fontSize: 18,
    fontWeight: "400",
    marginHorizontal: 15,
    marginTop: 18,
    textAlign: "center",
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "900",
  },
  walkthroughImageContainer: { height: "80%" },
  whiteBackground: {
    backgroundColor: colors.white,
  },
  wizardStep: {
    flex: 1,
    justifyContent: "space-between",
  },
});
