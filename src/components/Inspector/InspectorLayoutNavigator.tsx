import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import InspectorHomeScreen from "./InspectorHomeScreen";
import ShippersDeclarationScreen from "../ShippersDeclarationScreen";
import InspectorWorkflowSelection from "./InspectorWorkflowSelection";
import InspectorDisclaimerScreen from "./InspectorDisclaimerScreen";
import InspectorMainLayout from "./InspectorMainLayout";
import ValidateInspection from "./ValidateInspectionScreen";
import { InspectorHazmatQuantityEntryScreen } from "./InspectorHazmatQuantityEntry";
import InspectorInitialQuestioningScreen from "./InspectorInitialQuestioningScreen";
import { InspectorExceptedOrLimitedQuantities } from "./InspectorExceptedOrLimitedQuantities";
import SDDGUploadAndParse from "../SDDGUploadAndParse";
import SDDGVerificationScreen from "../SDDGVerificationScreen";
import SDDGFrustrationSummary from "../SDDGFrustrationSummary";
import SDDGComplianceValidation from "../SDDGComplianceValidation";
import InteractiveSDDGComplianceScreen from "./InteractiveSDDGComplianceScreen";
import SDDGManualEntryScreen from "./SDDGManualEntryScreen";
import SDDGInspectionCompleteScreen from "../SDDGInspectionCompleteScreen";
import InspectorShippersDeclarationScreen from "./InspectorShippersDeclarationScreen";
import InspectorPackageVerificationScreen from "./InspectorPackageVerificationScreen";
import InspectorPopMarking from "./InspectorPopMarking";
import InspectorPOPMarkingDataEntry from "./InspectorPOPMarkingDataEntry";
import PackageFrustrationSummary from "./PackageFrustrationSummary";
import PackageInspectionCompleteScreen from "./PackageInspectionCompleteScreen";
import { InspectorAMC1015Form } from "./InspectorAMC1015Form";
import InspectorDryIceScreen from "./InspectorDryIceScreen";
import InspectorCapacitorsScreen from "./InspectorCapacitorsScreen";
import InspectorMagnetizedMaterialsScreen from "./InspectorMagnetizedMaterialsScreen";
import InspectorSafetyDevicesScreen from "./InspectorSafetyDevicesScreen";
import InspectorLifeSavingAppliancesScreen from "./InspectorLifeSavingAppliancesScreen";
import InspectorGeneticallyModifiedOrganismsScreen from "./InspectorGeneticallyModifiedOrganismsScreen";
import InspectorEnginesInternalCombustionScreen from "./InspectorEnginesInternalCombustionScreen";
import InspectorFirstAidChemicalKitScreen from "./InspectorFirstAidChemicalKitScreen";
import InspectorDangerousGoodsInApparatusScreen from "./InspectorDangerousGoodsInApparatusScreen";
import InspectorBatteryPoweredVehicleScreen from "./InspectorBatteryPoweredVehicleScreen";
import InspectorLithiumBatteriesScreen from "./InspectorLithiumBatteriesScreen";
import InnerPackagingConfirmation from "./InnerPackaging/InnerPackagingConfirmation";
import OpeningProcedures from "./InnerPackaging/OpeningProcedures";
import InnerPackagingInspection from "./InnerPackaging/InnerPackagingInspection";
import ClosingProcedures from "./InnerPackaging/ClosingProcedures";
import SDDGCameraScreen from "../../screens/SDDG/SDDGCameraScreen";
import SDDGProcessingScreen from "../../screens/SDDG/SDDGProcessingScreen";
import SDDGRegionAdjustmentScreen from "../../screens/SDDG/SDDGRegionAdjustmentScreen";
import InspectorPOPScannerScreen from "./InspectorPOPScannerScreen";
import InspectorPOPScanResultsScreen from "./InspectorPOPScanResultsScreen";
import InspectorPOPMethodSelectionScreen from "./InspectorPOPMethodSelectionScreen";
import MLDetectionScreen from "./MLDetectionScreen";
import InspectorPOPMarkingValidationScreen from "./InspectorPOPMarkingValidationScreen";
import InspectorMarkingsLabelsValidationScreen from "./InspectorMarkingsLabelsValidationScreen";

const InspectorStack = createStackNavigator();

const InspectorHomeStack = () => (
  <InspectorStack.Navigator screenOptions={{ headerShown: false }}>
    <InspectorStack.Screen
      name="InspectorHome"
      component={InspectorHomeScreen}
    />
  </InspectorStack.Navigator>
);

const MainStack = createStackNavigator();

const InspectorWrappedStack = ({ navigation }: { navigation: any }) => (
  <InspectorMainLayout navigation={navigation}>
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen
        name="InspectorDisclaimerScreen"
        component={InspectorDisclaimerScreen}
      />
      <MainStack.Screen
        name="InspectorWorkflowSelection"
        component={InspectorWorkflowSelection}
      />
      <MainStack.Screen
        name="InspectorHazmatQuantityEntryScreen"
        component={InspectorHazmatQuantityEntryScreen}
      />
      <MainStack.Screen
        name="InspectorExceptedOrLimitedQuantities"
        component={InspectorExceptedOrLimitedQuantities}
      />
      <MainStack.Screen
        name="InspectorInitialQuestioningScreen"
        component={InspectorInitialQuestioningScreen}
      />
      <MainStack.Screen
        name="InspectorPackageVerification"
        component={InspectorPackageVerificationScreen}
      />
      <MainStack.Screen
        name="InspectorPopMarking"
        component={InspectorPopMarking}
      />
      <MainStack.Screen
        name="InspectorPOPMarkingDataEntry"
        component={InspectorPOPMarkingDataEntry}
      />
      <MainStack.Screen
        name="ValidateInspection"
        component={ValidateInspection}
      />
      <MainStack.Screen
        name="InspectorPOPMethodSelectionScreen"
        component={InspectorPOPMethodSelectionScreen}
      />
      <MainStack.Screen
        name="ShippersDeclarationScreen"
        component={ShippersDeclarationScreen}
      />
      <MainStack.Screen
        name="SDDGUploadAndParse"
        component={SDDGUploadAndParse}
      />
      <MainStack.Screen
        name="SDDGVerificationScreen"
        component={SDDGVerificationScreen}
      />
      <MainStack.Screen
        name="SDDGComplianceValidation"
        component={SDDGComplianceValidation}
      />
      <MainStack.Screen
        name="InteractiveSDDGComplianceScreen"
        component={InteractiveSDDGComplianceScreen}
      />
      <MainStack.Screen
        name="SDDGManualEntryScreen"
        component={SDDGManualEntryScreen}
      />
      <MainStack.Screen
        name="SDDGFrustrationSummary"
        component={SDDGFrustrationSummary}
      />
      <MainStack.Screen
        name="SDDGInspectionCompleteScreen"
        component={SDDGInspectionCompleteScreen}
      />
      <MainStack.Screen
        name="InspectorShippersDeclarationScreen"
        component={InspectorShippersDeclarationScreen}
      />
      <MainStack.Screen
        name="PackageFrustrationSummary"
        component={PackageFrustrationSummary}
      />
      <MainStack.Screen
        name="PackageInspectionCompleteScreen"
        component={PackageInspectionCompleteScreen}
      />
      <MainStack.Screen
        name="InspectorAMC1015Form"
        component={InspectorAMC1015Form}
      />
      <MainStack.Screen
        name="InspectorDryIceScreen"
        component={InspectorDryIceScreen}
      />
      <MainStack.Screen
        name="InspectorCapacitorsScreen"
        component={InspectorCapacitorsScreen}
      />
      <MainStack.Screen
        name="InspectorMagnetizedMaterialsScreen"
        component={InspectorMagnetizedMaterialsScreen}
      />
      <MainStack.Screen
        name="InspectorGeneticallyModifiedOrganismsScreen"
        component={InspectorGeneticallyModifiedOrganismsScreen}
      />
      <MainStack.Screen
        name="InspectorSafetyDevicesScreen"
        component={InspectorSafetyDevicesScreen}
      />
      <MainStack.Screen
        name="InspectorLifeSavingAppliancesScreen"
        component={InspectorLifeSavingAppliancesScreen}
      />
      <MainStack.Screen
        name="InspectorEnginesInternalCombustionScreen"
        component={InspectorEnginesInternalCombustionScreen}
      />
      <MainStack.Screen
        name="InspectorFirstAidChemicalKitScreen"
        component={InspectorFirstAidChemicalKitScreen}
      />
      <MainStack.Screen
        name="InspectorDangerousGoodsInApparatusScreen"
        component={InspectorDangerousGoodsInApparatusScreen}
      />
      <MainStack.Screen
        name="InspectorBatteryPoweredVehicleScreen"
        component={InspectorBatteryPoweredVehicleScreen}
      />
      <MainStack.Screen
        name="InspectorLithiumBatteriesScreen"
        component={InspectorLithiumBatteriesScreen}
      />
      <MainStack.Screen
        name="InnerPackagingConfirmation"
        component={InnerPackagingConfirmation}
      />
      <MainStack.Screen
        name="OpeningProcedures"
        component={OpeningProcedures}
      />
      <MainStack.Screen
        name="InnerPackagingInspection"
        component={InnerPackagingInspection}
      />
      <MainStack.Screen
        name="ClosingProcedures"
        component={ClosingProcedures}
      />
      <MainStack.Screen
        name="MLDetectionScreen"
        component={MLDetectionScreen}
      />
      <MainStack.Screen
        name="InspectorPOPMarkingValidationScreen"
        component={InspectorPOPMarkingValidationScreen}
      />
      <MainStack.Screen
        name="InspectorMarkingsLabelsValidationScreen"
        component={InspectorMarkingsLabelsValidationScreen}
      />
    </MainStack.Navigator>
  </InspectorMainLayout>
);

const RootStack = createStackNavigator();

const InspectorLayoutNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen
        name="InspectorHomeStack"
        component={InspectorHomeStack}
      />
      <RootStack.Screen
        name="InspectorWrappedStack"
        component={InspectorWrappedStack}
      />
      {/* Full-screen camera screens - outside of InspectorMainLayout */}
      <RootStack.Screen
        name="SDDGCameraScreen"
        component={SDDGCameraScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen
        name="SDDGRegionAdjustmentScreen"
        component={SDDGRegionAdjustmentScreen}
        options={{
          headerShown: true,
          title: "Adjust Template Regions",
          headerBackTitle: "Back",
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen
        name="SDDGProcessingScreen"
        component={SDDGProcessingScreen}
        options={{
          headerShown: true,
          title: "Processing Form...",
          gestureEnabled: false,
        }}
      />
      <RootStack.Screen
        name="InspectorPOPScannerScreen"
        component={InspectorPOPScannerScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen
        name="InspectorPOPScanResultsScreen"
        component={InspectorPOPScanResultsScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </RootStack.Navigator>
  );
};

export default InspectorLayoutNavigator;
