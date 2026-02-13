import React from "react";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { SDDGTemplate } from "@/types/sddg-template";

export type RootStackParamList = {
  PreparerHome: undefined;
  Disclaimer: undefined;
  ShipmentCreation: undefined;
  MaterialID: undefined;
  MaterialIDScreen: undefined;
  PackagingScreen: undefined;
  LabelingAndMarking: undefined;
  ShippersDeclarationScreen: undefined;
  SpecialAuthorizationPackingDataScreen: {
    authorizationType: "COE" | "CAA" | "DOT-SP";
    referenceNumber: string;
  };
  SpecialAuthorizationAttestationScreen: {
    authorizationType: "COE" | "CAA" | "DOT-SP";
    referenceNumber: string;
  };
  Certify: undefined;
  CertifyForm: undefined;
  Identify: undefined;
  GenPkgAck: undefined;
  InfoAndMods: undefined;
  Start: undefined;
  Type: undefined;
  Outer: undefined;
  SuggestedPop: undefined;
  Inner: undefined;
  LabelAndMark: undefined;
  PackagingWizard: undefined;
  WrappedStack: {
    screen: string;
  };
  InspectorPOPMarkingDataEntry: undefined;
  InspectorPOPScanResultsScreen: undefined;
  InspectorPOPScannerScreen: undefined;
  InspectorHome: undefined;
  InspectorShipmentCreationScreen: undefined;
  InspectorMaterialIDScreen: undefined;
  InspectorWorkflowSelection: undefined;
  InspectorSDDG: undefined;
  InspectorPackaging: undefined;
  InspectorLabelingAndMarking: undefined;
  InspectorValidateInspection: undefined;
  InspectorHazmatQuantityEntryScreen: undefined;
  InspectorInitialQuestioningScreen: undefined;
  InspectorPackageMarkingsScreen: undefined;
  InspectorLabelingExceptionsScreen: undefined;
  InspectorSpecialAuthorizationCheckScreen: {
    packingInstruction?: string;
  };
  InspectorSpecialAuthorizationAttestationScreen: {
    referenceNumber?: string;
  };
  InspectorCoeAndCaaScreen: {
    documentType?: "COE" | "CAA";
  };
  InspectorDotSpScreen: undefined;
  InspectorWrappedStack: {
    screen: string;
  };
  PreparerHomeStack: {
    screen: string;
  };
  // SDDG OCR Template Screens
  SDDGCameraScreen: undefined;
  SDDGRegionAdjustmentScreen: {
    imageUri: string;
    isScanned?: boolean;
  };
  SDDGProcessingScreen: {
    imageUri: string;
    isScanned?: boolean;
    customTemplate?: SDDGTemplate;
  };
  // POP Marking Screens
  POPScannerScreen: undefined;
  POPScanResultsScreen: {
    imageUri: string;
    rawOCRText: string;
    parsedFields: any;
    confidence: number;
    issues: string[];
    detectedType: any;
  };
  POPMarkingDataEntry: undefined;
  InteractiveSDDGComplianceScreen: undefined;
};

export const NavigationRefContext = React.createContext<{
  navigationRef: React.RefObject<
    NavigationContainerRefWithCurrent<RootStackParamList>
  >;
  setNavigationRef?: (
    ref: React.RefObject<NavigationContainerRefWithCurrent<RootStackParamList>>
  ) => void;
}>({
  navigationRef: ({ current: null } as unknown) as React.RefObject<
    NavigationContainerRefWithCurrent<RootStackParamList>
  >,
});
