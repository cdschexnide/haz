import { Shipment } from "../../../types";
import React, { JSX, useContext, useEffect, useMemo, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { HazProPreparerContext } from "../../../src/contexts/HazProPreparerProvider/HazProPreparerContext";
import { useNavigationRef } from "../../../src/contexts/NavigationRefProvider/useNavigationRef";
import { HazProInspectorContext } from "../../../src/contexts/HazProInspectorProvider/HazProInspectorContext";
import { InspectorWorkflowRow } from "./InspectorWorkflowRow";
import { useHazProStore } from "../../../src/stores/useHazProStore";

type ChevronHeaderScreenProps = {
  navigation: any;
  route: any;
};

enum WorkflowSteps {
  MATERIAL_ID,
  PACKAGE,
  LABEL_MARK,
  CERTIFY,
  COMPLETE,
}

const stepSubstepMap: Record<number, string[]> = {
  1: ["InspectorShipmentCreationScreen"],
  2: ["InspectorMaterialIDScreen"],
  3: ["InspectorWorkflowSelection"],
  4: ["InspectorSDDG"],
  5: ["InspectorPackaging"],
  6: ["InspectorLabelingAndMarking"],
  7: ["InspectorValidateInspection"],
};

type ChevronHeaderCellSuccessProps = {
  shipment: Shipment;
  activeStep: number | null;
  navigation: any;
};

export function InspectorChevronHeaderCellSuccess({
  shipment,
  activeStep,
  navigation,
}: ChevronHeaderCellSuccessProps): JSX.Element {
  const { state, dispatch } = useContext(HazProPreparerContext);
  const { state: inspectorState, dispatch: inspectorDispatch } = useContext(
    HazProInspectorContext
  );
  const { state: hazProState, actions } = useHazProStore();
  const { sddgWorkflow } = hazProState;

  const isLimitedOrExceptedQuantity = useMemo(() => {
    if (
      inspectorState.hazProInspectorContext.isLimitedQuantity ||
      inspectorState.hazProInspectorContext.isExceptedQuantity
    ) {
      return true;
    } else {
      return false;
    }
  }, [
    inspectorState.hazProInspectorContext.isLimitedQuantity,
    inspectorState.hazProInspectorContext.isExceptedQuantity,
  ]);

  const { navigate, goBack } = useNavigationRef();
  // const { goBack, setParams } =
  //   useNavigation<ChevronHeaderScreenProps["navigation"]>();

  // const route = useRoute<ChevronHeaderScreenProps["route"]>();
  // const params = route?.params ?? { visibleSection: null };

  const [materialIdentified, setMaterialIdentified] = useState<boolean>(false);
  const [packaged, setPackaged] = useState<boolean>(false);
  const [labeled, setLabeled] = useState<boolean>(false);
  const [certified, setCertified] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  const handleNestedPreparerContextFieldUpdate = (
    field: string,
    value: any
  ) => {
    dispatch({ type: "UPDATE_NESTED_FIELD", field, value });
  };

  useEffect(() => {
    setMaterialIdentified(
      shipment.hazardousMaterial.properShippingNames.some(
        (event: any) => event.name === "materialIdentifiedAt"
      )
    );
    setPackaged(
      shipment.hazardousMaterial.properShippingNames.some(
        (event: any) => event.name === "packagedAt"
      )
    );
    setLabeled(
      shipment.hazardousMaterial.properShippingNames.some(
        (event: any) => event.name === "labeledAt"
      )
    );
    setCertified(
      shipment.hazardousMaterial.properShippingNames.some(
        (event: any) => event.name === "certifiedAt"
      )
    );
    setCompleted(
      shipment.hazardousMaterial.properShippingNames.some(
        (event: any) => event.name === "completedAt"
      )
    );
  }, [shipment]);

  const { width: screenWidth } = useWindowDimensions();

  const getSubstepCompletion = (step: number) => {
    const substeps = stepSubstepMap[step];
    if (!substeps) return 0;

    const completed = substeps.filter(screenName =>
      state.hazProPreparerContext.completedSubsteps.includes(screenName)
    );

    const ratio = completed.length / substeps.length;

    return completed.length === substeps.length
      ? 0.9
      : Number(ratio.toFixed(3));
  };

  const isShipmentDetailsComplete =
    activeStep === 2 ||
    activeStep === 3 ||
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isMaterialIDComplete =
    activeStep === 3 ||
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isHazmatQuantityComplete =
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isExceptedOrLimitedQuantityComplete =
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isInitialQuestioningComplete =
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isSDDGComplete =
    activeStep === 6 ||
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isPackagingComplete =
    activeStep === 7 ||
    activeStep === 8 ||
    activeStep === 9 ||
    activeStep === 10;
  const isLabelsAndMarkingsComplete =
    activeStep === 8 || activeStep === 9 || activeStep === 10;
  const isValidateInspectionComplete = activeStep === 10;

  return (
    <>
      <InspectorWorkflowRow
        height={95}
        width={screenWidth - 10}
        disableLimitedOrExceptedChevron={!isLimitedOrExceptedQuantity}
        workflowRowMembers={[
          {
            key: "SDDG",
            title: "SDDG",
            icon: {
              name: "file-document-multiple-outline",
              type: "MaterialCommunityIcons",
            },
            percentComplete: sddgWorkflow.sddgComplete ? 1 : 0,
            onPress: () => {
              actions.setCurrentChevron("sddg");
              // navigate("SDDGUploadAndParse");
            },
            isActive: sddgWorkflow.currentChevron === "sddg",
          },
          {
            key: "Package",
            title: "Package",
            icon: { name: "package-variant", type: "MaterialCommunityIcons" },
            percentComplete: sddgWorkflow.packageComplete ? 1 : 0,
            onPress: () => {
              if (sddgWorkflow.sddgComplete) {
                actions.setCurrentChevron("package");
                // navigate("PackageWorkflowScreen");
              }
            },
            isActive: sddgWorkflow.currentChevron === "package",
          },
          {
            key: "Complete",
            title: "Complete",
            icon: { name: "check-circle", type: "FontAwesome5" },
            percentComplete: 0, // Complete chevron is never "complete"
            onPress: () => {
              if (sddgWorkflow.packageComplete) {
                actions.setCurrentChevron("complete");
                // navigate("CompleteWorkflowScreen"); // TODO: Create this screen
              }
            },
            isActive: sddgWorkflow.currentChevron === "complete",
          },
        ]}
      />
      <View></View>
    </>
  );
}
