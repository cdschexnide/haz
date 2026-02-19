import { evaluateAttachment19Eligibility } from "@/utils/eligibility/attachment19Eligibility";
import { getKey16Quantities } from "@/utils/eligibility/getKey16Quantities";
import { getPackagingTypeFromKey16 } from "@/utils/getPackagingTypeFromKey16";
import { hazardousMaterialsList } from "@/hazardousMaterials/hazardousMaterialsList";
import { hasSpecialProvisionAlphaCode } from "@/utils/specialProvisions";
import {
  getPostSddgStartRoute,
  getSpecialAuthorizationGateDecision,
} from "@/utils/inspectorWorkflowRouting";

type NavigationLike = {
  navigate: (screen: string, params?: Record<string, any>) => void;
};

type InspectionLike = {
  verificationCopy?: {
    unIdNo?: string;
    quantityAndPacking?: string;
  } | null;
  extractedContent?: {
    unIdNo?: string;
  } | null;
  quantityType?: "standard" | "limited" | "excepted";
  specialAuthorizationAttested?: boolean;
  specialAuthorizationType?: "COE" | "CAA" | "DOT-SP" | null;
  specialAuthorizationReference?: string | null;
  coeAndCaaDocuments?: {
    coeDocuments?: Array<unknown>;
    caaDocuments?: Array<unknown>;
  } | null;
  dotSpWaivers?: Array<unknown> | null;
};

interface RouteToPackageStartOptions {
  inspection: InspectionLike;
  navigation: NavigationLike;
  setQuantityType: (quantityType: "standard" | "excepted" | "limited") => void;
  setExceptedQuantityData: (data: any) => void;
  setLimitedQuantityData: (data: any) => void;
  setPackagePackagingType: (
    packagingType: "single" | "combination" | "composite" | null
  ) => void;
  setSpecialAuthorizationData: (
    data: {
      type: "COE" | "CAA" | "DOT-SP";
      referenceNumber: string;
      attested: boolean;
    } | null
  ) => void;
}

/**
 * Routes from the SDDG phase into the package workflow start using the same
 * branching logic as existing SDDG completion screens.
 */
export const routeToPackageWorkflowStart = ({
  inspection,
  navigation,
  setQuantityType,
  setExceptedQuantityData,
  setLimitedQuantityData,
  setPackagePackagingType,
  setSpecialAuthorizationData,
}: RouteToPackageStartOptions) => {
  const unIdNo =
    inspection?.verificationCopy?.unIdNo || inspection?.extractedContent?.unIdNo || "";

  const hasAuthorizationDocuments =
    (inspection?.coeAndCaaDocuments?.coeDocuments?.length || 0) > 0 ||
    (inspection?.coeAndCaaDocuments?.caaDocuments?.length || 0) > 0 ||
    (inspection?.dotSpWaivers?.length || 0) > 0;

  if (inspection.verificationCopy) {
    const specialAuthorizationGate = getSpecialAuthorizationGateDecision(inspection);

    if (
      specialAuthorizationGate.shouldResetAuthorization &&
      !(
        specialAuthorizationGate.action === "go_to_special_authorization_check" &&
        hasAuthorizationDocuments
      )
    ) {
      setSpecialAuthorizationData(null);
    }

    if (specialAuthorizationGate.action === "go_to_ml_detection") {
      setQuantityType("standard");
      setExceptedQuantityData(null);
      setLimitedQuantityData(null);
      setPackagePackagingType(null);
      navigation.navigate("MLDetectionScreen", { unIdNo });
      return;
    }

    if (specialAuthorizationGate.action === "go_to_special_authorization_check") {
      navigation.navigate("InspectorSpecialAuthorizationCheckScreen", {
        packingInstruction: specialAuthorizationGate.packingInstruction,
      });
      return;
    }

    const eligibility = evaluateAttachment19Eligibility({
      sddgContent: inspection.verificationCopy,
      quantities: getKey16Quantities(inspection.verificationCopy),
    });

    const packagingType = getPackagingTypeFromKey16(
      inspection.verificationCopy.quantityAndPacking
    );
    const hazmatItem = hazardousMaterialsList.find(
      item => item.unid === inspection.verificationCopy?.unIdNo
    );
    const hasA2Restriction =
      hazmatItem && hasSpecialProvisionAlphaCode(hazmatItem.specialProvision, "A2");
    const resolvedPackagingType =
      hasA2Restriction && packagingType === "single" ? null : packagingType;

    setQuantityType("standard");
    setExceptedQuantityData(eligibility.exceptedQuantityData);
    setLimitedQuantityData(eligibility.limitedQuantityData);
    setPackagePackagingType(resolvedPackagingType);

    const isEligible =
      eligibility.exceptedQuantityData.eligible ||
      eligibility.limitedQuantityData.eligible;
    const startRoute = getPostSddgStartRoute(inspection);
    const attachment28Params = {
      continueRoute: "InspectorSpecialProvisionsScreen",
      continueParams: {
        continueRoute: "MLDetectionScreen",
        continueParams: { unIdNo },
      },
    };
    const packagingParams = {
      nextRoute: "InspectorAttachment28WizardScreen",
      nextParams: attachment28Params,
    };

    if (startRoute.screen !== "InspectorAttachment28WizardScreen") {
      navigation.navigate(startRoute.screen);
      return;
    }

    if (isEligible) {
      navigation.navigate("InspectorQuantityTypeSelectionScreen", packagingParams);
    } else {
      navigation.navigate("InspectorPackagingTypeSelectionScreen", packagingParams);
    }
    return;
  }

  const startRoute = getPostSddgStartRoute(inspection);
  if (startRoute.screen !== "InspectorAttachment28WizardScreen") {
    navigation.navigate(startRoute.screen);
    return;
  }

  navigation.navigate("InspectorPackagingTypeSelectionScreen", {
    nextRoute: "InspectorAttachment28WizardScreen",
    nextParams: {
      continueRoute: "InspectorSpecialProvisionsScreen",
      continueParams: {
        continueRoute: "MLDetectionScreen",
        continueParams: { unIdNo },
      },
    },
  });
};
