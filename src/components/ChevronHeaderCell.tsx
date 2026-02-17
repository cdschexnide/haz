import { useNavigationRef } from "@/contexts/NavigationRefProvider/useNavigationRef";
import { useHazProStore } from "@/stores/useHazProStore";
import { Shipment } from "../../types";
import React, { JSX, useEffect, useState } from "react";
import { useWindowDimensions, View } from "react-native";
import { SubstepRow } from "./SubstepRow";
import { WorkflowRow } from "./WorkflowRow";

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
  1: ["MaterialID", "SpecialProvisionsAcknowledgement"],
  2: [
    "PackagingScreen",
    "WalkthroughPackagingTypeSelectionScreen",
    "OuterPackagingWalkthrough",
    "SuggestedPopMarking",
    "InnerPackagingWizard",
  ],
  3: ["LabelingAndMarking"],
};

type ChevronHeaderCellSuccessProps = {
  shipment: Shipment;
  activeStep: number | null;
  navigation: any;
};

export function ChevronHeaderCellSuccess({
  shipment,
  activeStep,
  navigation,
}: ChevronHeaderCellSuccessProps): JSX.Element {
  const { state, store } = useHazProStore();
  const { navigate, goBack } = useNavigationRef();
  const [materialIdentified, setMaterialIdentified] = useState<boolean>(false);
  const [packaged, setPackaged] = useState<boolean>(false);
  const [labeled, setLabeled] = useState<boolean>(false);
  const [certified, setCertified] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

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

    const completed = substeps.filter(screenName => {
      if (screenName !== "SpecialProvisionsAcknowledgement") {
        return state.hazProPreparerContext.completedSubsteps.includes(
          screenName
        );
      }

      return (
        state.hazProPreparerContext.completedSubsteps.includes(
          "SpecialProvisionsAcknowledgement"
        ) ||
        state.hazProPreparerContext.completedSubsteps.includes(
          "InformativeAndWorkflowModifierAcknowledgement"
        ) ||
        state.hazProPreparerContext.completedSubsteps.includes(
          "GeneralPackagingAcknowledgement"
        )
      );
    });

    const ratio = completed.length / substeps.length;

    return completed.length === substeps.length
      ? 0.9
      : Number(ratio.toFixed(3));
  };

  const isMaterialIdComplete =
    activeStep === 2 ||
    activeStep === 3 ||
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7;
  const isPackageComplete =
    activeStep === 3 ||
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7;
  const isLabelingAndMarkingComplete =
    activeStep === 4 ||
    activeStep === 5 ||
    activeStep === 6 ||
    activeStep === 7;
  const isSDDGComplete = activeStep === 5 || activeStep === 6;
  const isCertifyComplete = activeStep === 6 || activeStep === 7;
  const isSignatureComplete = activeStep === 7;

  return (
    <>
      <WorkflowRow
        height={80}
        width={screenWidth - 18}
        workflowRowMembers={[
          {
            key: WorkflowSteps.MATERIAL_ID.toString(),
            title: "Material ID",
            icon: { name: "id-card", type: "FontAwesome5" },
            percentComplete:
              activeStep === 1
                ? getSubstepCompletion(1)
                : isMaterialIdComplete
                ? 1
                : activeStep === null
                ? 0
                : 0,
            onPress: () => {
              store.hazProPreparerContext.activeStep = 1;
              navigate("MaterialID");
            },
            isActive: activeStep === 1,
          },
          {
            key: WorkflowSteps.PACKAGE.toString(),
            title: "Package",
            icon: { name: "box", type: "FontAwesome5" },
            percentComplete:
              activeStep === 2
                ? getSubstepCompletion(2)
                : isPackageComplete
                ? 1
                : activeStep === null
                ? 0
                : 0,
            // onPress: () => {
            //   handleNestedPreparerContextFieldUpdate("activeStep", 2);
            //   navigate("PackagingSummary");
            // },
            isActive: activeStep === 2,
          },
          {
            key: WorkflowSteps.LABEL_MARK.toString(),
            title: "Label/Mark",
            icon: { name: "tags", type: "FontAwesome5" },
            percentComplete: isLabelingAndMarkingComplete ? 1 : 0,
            onPress: () => {
              store.hazProPreparerContext.activeStep = 3;
              navigate("LabelingAndMarking");
            },
            isActive: activeStep === 3,
          },
          {
            key: "SDDG",
            title: "SDDG",
            icon: {
              name: "file-document-multiple-outline",
              type: "MaterialCommunityIcons",
            },
            percentComplete: activeStep !== 4 && isSDDGComplete ? 1 : 0,
            onPress: () => {
              store.hazProPreparerContext.activeStep = 4;
              navigate("ShippersDeclarationScreen");
            },
            isActive: activeStep === 4,
          },
          {
            key: WorkflowSteps.CERTIFY.toString(),
            title: "Certify",
            icon: { name: "clipboard-check", type: "FontAwesome5" },
            percentComplete: isCertifyComplete ? 1 : 0,
            onPress: () => {
              store.hazProPreparerContext.activeStep = 5;
              navigate("Certify");
            },
            isActive: activeStep === 5,
          },
          // {
          //   key: WorkflowSteps.COMPLETE.toString(),
          //   title: "Complete",
          //   icon: { name: "check-circle", type: "FontAwesome5" },
          //   percentComplete: isSignatureComplete ? 1 : 0,
          //   onPress: () => {
          //   },
          //   isActive: activeStep === 6,
          // },
        ]}
      />
      <View>
        <SubstepRow activeStep={activeStep} />
      </View>
    </>
  );
}
