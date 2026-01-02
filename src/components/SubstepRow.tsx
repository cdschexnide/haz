import React from "react";
import { useNavigationState, useRoute } from "@react-navigation/native";
import { useWindowDimensions } from "react-native";
import { WorkflowRow, WorkflowRowMember } from "./WorkflowRow";
import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";

export type RootStackParamList = {
  PreparerHome: undefined;
  Disclaimer: undefined;
  ShipmentCreation: undefined;
  MaterialID: undefined;
  PackagingScreen: undefined;
  LabelingAndMarking: undefined;
  Certify: undefined;
  Identify: undefined;
  GenPkgAck: undefined;
  InfoAndMods: undefined;
  Start: undefined;
  Type: undefined;
  Outer: undefined;
  SuggestedPop: undefined;
  Inner: undefined;
  LabelAndMark: undefined;
  WrappedStack: {
    screen: string;
  };
  PackagingWizard: undefined;
  InspectorHome: undefined;
  InspectorShipmentCreationScreen: undefined;
  InspectorMaterialIDScreen: undefined;
  InspectorWorkflowSelection: undefined;
  InspectorSDDG: undefined;
  InspectorPackaging: undefined;
  InspectorLabelingAndMarking: undefined;
  InspectorValidateInspection: undefined;
  InspectorWrappedStack: {
    screen: string;
  };
};

type SubstepMeta = {
  step: number;
  index: number;
  title: string;
};

type SubstepRowProps = {
  activeStep: number | null;
};

export function SubstepRow({
  activeStep,
}: SubstepRowProps): JSX.Element | null {
  const { state } = useHazProStore();
  const route = useRoute();
  const { navigate } = useNavigationRef();
  const { width: screenWidth } = useWindowDimensions();
  const absorbentStepShouldRender =
    state.hazProPreparerContext.absorbentStepRequired;
  const selectedUNID = state.hazProPreparerContext.hazardousMaterial?.unid;

  const isVehicleWorkflow = selectedUNID === "UN3166";

  const subStepMap: Record<string, SubstepMeta> = isVehicleWorkflow
    ? {
        // UN3166 version
        MaterialID: { step: 1, index: 0, title: "Identify" },
        GeneralPackagingAcknowledgement: {
          step: 1,
          index: 1,
          title: "Packaging Requirements",
        },
        InformativeAndWorkflowModifierAcknowledgement: {
          step: 1,
          index: 2,
          title: "Special Provisions",
        },
        UN3166FuelEntryScreen: { step: 2, index: 0, title: "Fuel Level Entry" },
        AccessorialHazardsScreen: {
          step: 2,
          index: 1,
          title: "Accessorial Hazards",
        },
        // AccessorialHazmatScreen: { step: 2, index: 1, title: "Add Additional Hazards" },
        AccessorialQuantityEntry: {
          step: 2,
          index: 2,
          title: "Enter Quantities",
        },
      }
    : {
        // Standard workflow
        MaterialID: { step: 1, index: 0, title: "Identify" },
        GeneralPackagingAcknowledgement: {
          step: 1,
          index: 1,
          title: "Packaging Requirements",
        },
        InformativeAndWorkflowModifierAcknowledgement: {
          step: 1,
          index: 2,
          title: "Special Provisions",
        },
        PackagingScreen: { step: 2, index: 0, title: "Identify Package" },
        PackagingWizard: { step: 2, index: 1, title: "Packaging Wizard" },
        POPMarkingDataEntry: { step: 2, index: 2, title: "POP Entry" },
        InnerPackagingWizard: { step: 2, index: 3, title: "Inner Packaging" },
        AbsorbentCushioningRequirements: {
          step: 2,
          index: 4,
          title: "Absorbent",
        },
      };

  const navigationState = useNavigationState(state => state);

  const currentScreenName = (() => {
    if (!navigationState || !navigationState.routes) return "Unknown";

    const drawerRoute = navigationState.routes[navigationState.index];
    if (drawerRoute.state && drawerRoute.state.routes) {
      const stackRoute =
        drawerRoute.state?.routes?.[drawerRoute.state.index ?? 0];
      return stackRoute?.name || "Unknown";
    }

    return drawerRoute.name;
  })();

  const currentMeta = subStepMap[currentScreenName];

  if (!activeStep || !currentMeta || currentMeta.step !== activeStep) {
    return null;
  }

  const substepTitles = Object.entries(subStepMap)
    .filter(([key, meta]) => {
      if (meta.step !== activeStep) return false;

      if (
        key === "AbsorbentCushioningRequirements" &&
        !absorbentStepShouldRender
      ) {
        return false;
      }

      if (
        state.hazProPreparerContext?.packaging?.packagingType &&
        key === "InnerPackagingWizard" &&
        ![
          "Combination",
          "Composite",
          "CompositePackagingWithPlasticInnerReceptacles",
          "CompositePackagingWithGlassPorcelainOrStonewareInnerReceptacles",
        ].includes(state.hazProPreparerContext?.packaging?.packagingType)
      ) {
        return false;
      }

      if (key === "UnauthorizedPopMarking") {
        return state.hazProPreparerContext.packaging?.popIsValid === false;
      }

      return true;
    })
    .sort((a, b) => a[1].index - b[1].index);

  const members: WorkflowRowMember[] = substepTitles.map(
    ([screenName, meta]) => {
      const typedScreenName = screenName as keyof RootStackParamList;
      const isCompleted =
        state.hazProPreparerContext.completedSubsteps.includes(screenName);
      return {
        key: screenName,
        title: meta.title,
        percentComplete: isCompleted ? 1 : 0,
        isActive: meta.index === currentMeta.index,
        onPress: () => navigate(typedScreenName),
      };
    }
  );

  return (
    <WorkflowRow
      height={50}
      width={screenWidth - 100}
      workflowRowMembers={members}
    />
  );
}
