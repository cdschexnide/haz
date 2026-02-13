import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

// Screens in same folder (./*)
import InspectorHomeScreen from "./InspectorHomeScreen";
import InspectorWorkflowSelection from "./InspectorWorkflowSelection";
import InspectorDisclaimerScreen from "./InspectorDisclaimerScreen";
import ValidateInspection from "./ValidateInspectionScreen";
import { InspectorHazmatQuantityEntryScreen } from "./InspectorHazmatQuantityEntry";
import InspectorInitialQuestioningScreen from "./InspectorInitialQuestioningScreen";
import { InspectorExceptedOrLimitedQuantities } from "./InspectorExceptedOrLimitedQuantities";
import InteractiveSDDGComplianceScreen from "./InteractiveSDDGComplianceScreen";
import InspectorSpecialAuthorizationCheckScreen from "./InspectorSpecialAuthorizationCheckScreen";
import InspectorSpecialAuthorizationAttestationScreen from "./InspectorSpecialAuthorizationAttestationScreen";
import InspectorCoeAndCaaScreen from "./InspectorCoeAndCaaScreen";
import InspectorDotSpScreen from "./InspectorDotSpScreen";
import SDDGManualEntryScreen from "./SDDGManualEntryScreen";
import InspectorQuantityTypeSelectionScreen from "./InspectorQuantityTypeSelectionScreen";
import InspectorPackagingTypeSelectionScreen from "./InspectorPackagingTypeSelectionScreen";
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
import InspectorInfectiousSubstancesScreen from "./InspectorInfectiousSubstancesScreen";
import InspectorBiologicalSubstancesCategoryBScreen from "./InspectorBiologicalSubstancesCategoryBScreen";
import InspectorEnginesInternalCombustionScreen from "./InspectorEnginesInternalCombustionScreen";
import InspectorFirstAidChemicalKitScreen from "./InspectorFirstAidChemicalKitScreen";
import InspectorDangerousGoodsInApparatusScreen from "./InspectorDangerousGoodsInApparatusScreen";
import InspectorBatteryPoweredVehicleScreen from "./InspectorBatteryPoweredVehicleScreen";
import InspectorFuelPoweredVehicleScreen from "./InspectorFuelPoweredVehicleScreen";
import InspectorLithiumBatteriesScreen from "./InspectorLithiumBatteriesScreen";
import InspectorLithiumBatteriesContainedInEquipmentScreen from "./InspectorLithiumBatteriesContainedInEquipmentScreen";
import InspectorLithiumBatteriesPackedWithEquipmentScreen from "./InspectorLithiumBatteriesPackedWithEquipmentScreen";
import InspectorClass9GeneralScreen from "./InspectorClass9GeneralScreen";
import InspectorAsbestosScreen from "./InspectorAsbestosScreen";
import InspectorConsumerCommodityScreen from "./InspectorConsumerCommodityScreen";
import InspectorMiscDangerousGoodsArticlesScreen from "./InspectorMiscDangerousGoodsArticlesScreen";
import InspectorCompressedGasesScreen from "./InspectorCompressedGasesScreen";
import InspectorCylinderTypeSelectionScreen from "./InspectorCylinderTypeSelectionScreen";
import InspectorPOPScannerScreen from "./InspectorPOPScannerScreen";
import InspectorPOPScanResultsScreen from "./InspectorPOPScanResultsScreen";
import InspectorPOPMethodSelectionScreen from "./InspectorPOPMethodSelectionScreen";
import MLDetectionScreen from "./MLDetectionScreen";
import InspectorLabelingExceptionsScreen from "./InspectorLabelingExceptionsScreen";
import InspectorMarkingsLabelsValidationScreen from "./InspectorMarkingsLabelsValidationScreen";
import InspectorAttachment28WizardScreen from "./InspectorAttachment28WizardScreen";
import InspectorSpecialProvisionsScreen from "./InspectorSpecialProvisionsScreen";

// Inner packaging screens (./inner-packaging/*)
import InnerPackagingConfirmation from "./inner-packaging/InnerPackagingConfirmation";
import OpeningProcedures from "./inner-packaging/OpeningProcedures";
import InnerPackagingInspection from "./inner-packaging/InnerPackagingInspection";
import ClosingProcedures from "./inner-packaging/ClosingProcedures";

// Components that stayed in src/components/ (../../components/*)
import InspectorMainLayout from "../../components/Inspector/InspectorMainLayout";
// import ShippersDeclarationScreen from "../../components/ShippersDeclarationScreen";
import SDDGUploadAndParse from "../../components/SDDGUploadAndParse";
import SDDGVerificationScreen from "../../components/SDDGVerificationScreen";
import SDDGFrustrationSummary from "../../components/SDDGFrustrationSummary";
import SDDGComplianceValidation from "../../components/SDDGComplianceValidation";
import SDDGInspectionCompleteScreen from "../../components/SDDGInspectionCompleteScreen";

// SDDG screens in src/screens/SDDG/ (../SDDG/*)
import SDDGCameraScreen from "../SDDG/SDDGCameraScreen";
import SDDGProcessingScreen from "../SDDG/SDDGProcessingScreen";
import SDDGRegionAdjustmentScreen from "../SDDG/SDDGRegionAdjustmentScreen";

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
      {/* <MainStack.Screen
        name="ShippersDeclarationScreen"
        component={ShippersDeclarationScreen}
      /> */}
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
        name="InspectorSpecialAuthorizationCheckScreen"
        component={InspectorSpecialAuthorizationCheckScreen}
      />
      <MainStack.Screen
        name="InspectorSpecialAuthorizationAttestationScreen"
        component={InspectorSpecialAuthorizationAttestationScreen}
      />
      <MainStack.Screen
        name="InspectorCoeAndCaaScreen"
        component={InspectorCoeAndCaaScreen}
      />
      <MainStack.Screen
        name="InspectorDotSpScreen"
        component={InspectorDotSpScreen}
      />
      <MainStack.Screen
        name="InspectorQuantityTypeSelectionScreen"
        component={InspectorQuantityTypeSelectionScreen}
      />
      <MainStack.Screen
        name="InspectorPackagingTypeSelectionScreen"
        component={InspectorPackagingTypeSelectionScreen}
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
        name="InspectorInfectiousSubstancesScreen"
        component={InspectorInfectiousSubstancesScreen}
      />
      <MainStack.Screen
        name="InspectorBiologicalSubstancesCategoryBScreen"
        component={InspectorBiologicalSubstancesCategoryBScreen}
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
        name="InspectorFuelPoweredVehicleScreen"
        component={InspectorFuelPoweredVehicleScreen}
      />
      <MainStack.Screen
        name="InspectorLithiumBatteriesScreen"
        component={InspectorLithiumBatteriesScreen}
      />
      <MainStack.Screen
        name="InspectorLithiumBatteriesContainedInEquipmentScreen"
        component={InspectorLithiumBatteriesContainedInEquipmentScreen}
      />
      <MainStack.Screen
        name="InspectorLithiumBatteriesPackedWithEquipmentScreen"
        component={InspectorLithiumBatteriesPackedWithEquipmentScreen}
      />
      <MainStack.Screen
        name="InspectorClass9GeneralScreen"
        component={InspectorClass9GeneralScreen}
      />
      <MainStack.Screen
        name="InspectorAsbestosScreen"
        component={InspectorAsbestosScreen}
      />
      <MainStack.Screen
        name="InspectorConsumerCommodityScreen"
        component={InspectorConsumerCommodityScreen}
      />
      <MainStack.Screen
        name="InspectorMiscDangerousGoodsArticlesScreen"
        component={InspectorMiscDangerousGoodsArticlesScreen}
      />
      <MainStack.Screen
        name="InspectorCompressedGasesScreen"
        component={InspectorCompressedGasesScreen}
      />
      <MainStack.Screen
        name="InspectorCylinderTypeSelectionScreen"
        component={InspectorCylinderTypeSelectionScreen}
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
        name="InspectorLabelingExceptionsScreen"
        component={InspectorLabelingExceptionsScreen}
      />
      <MainStack.Screen
        name="InspectorMarkingsLabelsValidationScreen"
        component={InspectorMarkingsLabelsValidationScreen}
      />
      <MainStack.Screen
        name="InspectorAttachment28WizardScreen"
        component={InspectorAttachment28WizardScreen}
      />
      <MainStack.Screen
        name="InspectorSpecialProvisionsScreen"
        component={InspectorSpecialProvisionsScreen}
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
