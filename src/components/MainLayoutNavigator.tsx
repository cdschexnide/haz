import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import A85PackagingWizard from "./A8_5PackagingWizard";
import AbsorbentCushioningRequirements from "./AbsorbentCushioningRequirements";
import AccessorialHazardsScreen from "./AccessorialHazardsScreen";
import AccessorialQuantityEntry from "./AccessorialQuantityEntry";
import BatteryPoweredVehicle from "./BatteryPoweredVehicle";
import Capacitors from "./Capacitors";
import { CertifyFormScreen } from "@/screens/preparer";
import CoeAndCaaDisclaimer from "./CoeAndCaaDisclaimer";
import CoeAndCaaScreen from "./CoeAndCaaScreen";
import CylinderEntryScreen from "./CylinderEntryScreen";
import DangerousGoods from "./DangerousGoods";
import { DisclaimerScreen } from "@/screens/preparer";
import DotSpScreen from "./DotSpScreen";
import DryIcePreparationScreen from "./DryIcePreparationScreen";
import DryIcePrepScreen from "./DryIcePrepScreen";
import EnginesInternalCombustion from "./EnginesInternalCombustion";
import ExplosiveDetailsWizard from "./ExplosiveDetailsWizardNew";
import GeneralPackagingAcknowledgementScreen from "./GeneralPackagingAcknowledgementScreen";
import GeneticallyModifiedOrganisms from "./GeneticallyModifiedOrganisms";
import { SpecialProvisionsAcknowledgementScreen } from "@/screens/preparer";
import GrandfatheredPackagingReferenceScreen from "./GrandfatheredPackagingReferenceScreen";
import GrandfatheredWizard from "./GrandfatheredWizard";
import InformativeAndWorkflowModifiersAcknowledgementScreen from "./InformativeAndWorkflowModifiersAcknowledgementScreen";
import InnerPackagingWizard from "./InnerPackagingWizard";
import KitPreparationScreen from "./KitPreparationScreen";
import { LabelingAndMarkingScreen } from "@/screens/preparer";
import LifeSavingAppliances from "./LifeSavingAppliances";
import LithiumBatteriesPrepScreen from "./LithiumBatteriesPrepScreen";
import MagnetizedMaterialPrepScreen from "./MagnetizedMaterialsPrepScreen";
import MainLayout from "./MainLayout";
import ManualEntryPackagingTypeSelectionScreen from "./ManualEntryPackagingTypeSelection";
import MaterialIDScreen from "./MaterialIDScreen";
import PackagingScreen from "./PackagingScreen";
// import PackagingWizard from "./PackagingWizard";
import POPMarkingDataEntry from "./POPMarkingDataEntry";
import { PreparerHomeScreen } from "@/screens/preparer";
import SafetyDevicesPreparationScreen from "./SafetyDevices";
import SDDGUploadAndParse from "./SDDGUploadAndParse";
import { ShipmentCreationScreen } from "@/screens/preparer";
import { ShippersDeclarationScreen } from "@/screens/preparer";
import UN3166FuelEntryScreen from "./UN3166FuelEntryScreen";
import UnauthorizedCylinderSpecification from "./UnauthorizedCylinderSpecification";
import UnauthorizedPopMarking from "./UnauthorizedPopMarking";
import PackagingWizardV2 from "./PackagingWizardV2";
import POPScannerScreen from "./POPScannerScreen";
import POPScanResultsScreen from "./POPScanResultsScreen";
// Excepted and Limited Quantities screens
import { QuantityEntryScreen } from "@/screens/preparer";
import ExceptedQuantityPackagingGuidance from "./ExceptedQuantityPackagingGuidance";
import ExceptedQuantityMarkingPreview from "./ExceptedQuantityMarkingPreview";
import ExceptedQuantityConfirmationScreen from "./ExceptedQuantityConfirmationScreen";
import LimitedQuantityPackagingGuidance from "./LimitedQuantityPackagingGuidance";

const PreparerStack = createStackNavigator();

const PreparerHomeStack = () => (
  <PreparerStack.Navigator screenOptions={{ headerShown: false }}>
    <PreparerStack.Screen name="PreparerHome" component={PreparerHomeScreen} />
  </PreparerStack.Navigator>
);

const MainStack = createStackNavigator();

const WrappedStack = ({ navigation }: { navigation: any }) => (
  <MainLayout navigation={navigation}>
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="Disclaimer" component={DisclaimerScreen} />
      <MainStack.Screen
        name="ShipmentCreation"
        component={ShipmentCreationScreen}
      />
      <MainStack.Screen name="MaterialID" component={MaterialIDScreen} />
      {/* Excepted and Limited Quantities screens */}
      <MainStack.Screen
        name="QuantityEntryScreen"
        component={QuantityEntryScreen}
      />
      <MainStack.Screen
        name="ExceptedQuantityPackagingGuidance"
        component={ExceptedQuantityPackagingGuidance}
      />
      <MainStack.Screen
        name="ExceptedQuantityMarkingPreview"
        component={ExceptedQuantityMarkingPreview}
      />
      <MainStack.Screen
        name="ExceptedQuantityConfirmationScreen"
        component={ExceptedQuantityConfirmationScreen}
      />
      <MainStack.Screen
        name="LimitedQuantityPackagingGuidance"
        component={LimitedQuantityPackagingGuidance}
      />
      <MainStack.Screen
        name="GeneralPackagingAcknowledgement"
        component={GeneralPackagingAcknowledgementScreen}
      />
      <MainStack.Screen
        name="SpecialProvisionsAcknowledgement"
        component={SpecialProvisionsAcknowledgementScreen}
      />
      <MainStack.Screen
        name="InformativeAndWorkflowModifierAcknowledgement"
        component={InformativeAndWorkflowModifiersAcknowledgementScreen}
      />
      <MainStack.Screen name="PackagingScreen" component={PackagingScreen} />
      <MainStack.Screen
        name="ManualEntryPackagingTypeSelectionScreen"
        component={ManualEntryPackagingTypeSelectionScreen}
      />
      <MainStack.Screen
        name="POPMarkingDataEntry"
        component={POPMarkingDataEntry}
      />
      <MainStack.Screen
        name="InnerPackagingWizard"
        component={InnerPackagingWizard}
      />
      <MainStack.Screen
        name="UnauthorizedPopMarking"
        component={UnauthorizedPopMarking}
      />
      <MainStack.Screen
        name="LabelingAndMarking"
        component={LabelingAndMarkingScreen}
      />
      <MainStack.Screen
        name="CylinderEntryScreen"
        component={CylinderEntryScreen}
      />
      <MainStack.Screen
        name="UnauthorizedCylinderSpecification"
        component={UnauthorizedCylinderSpecification}
      />
      <MainStack.Screen
        name="AbsorbentCushioningRequirements"
        component={AbsorbentCushioningRequirements}
      />
      <MainStack.Screen name="Certify" component={CertifyFormScreen} />
      <MainStack.Screen
        name="AccessorialQuantityEntry"
        component={AccessorialQuantityEntry}
      />
      <MainStack.Screen
        name="UN3166FuelEntryScreen"
        component={UN3166FuelEntryScreen}
      />
      <MainStack.Screen
        name="AccessorialHazardsScreen"
        component={AccessorialHazardsScreen}
      />
      <MainStack.Screen
        name="ShippersDeclarationScreen"
        component={ShippersDeclarationScreen}
      />
      {/* <MainStack.Screen name="PackagingWizard" component={PackagingWizard} /> */}
      <MainStack.Screen
        name="PackagingWizardV2"
        component={PackagingWizardV2}
      />
      <MainStack.Screen
        name="ExplosiveDetailsWizard"
        component={ExplosiveDetailsWizard}
      />
      <MainStack.Screen
        name="GrandfatheredPackagingReferenceScreen"
        component={GrandfatheredPackagingReferenceScreen}
      />
      <MainStack.Screen
        name="GrandfatheredWizard"
        component={GrandfatheredWizard}
      />
      <MainStack.Screen name="CoeAndCaaScreen" component={CoeAndCaaScreen} />
      <MainStack.Screen
        name="MagnetizedMaterialPrepScreen"
        component={MagnetizedMaterialPrepScreen}
      />
      <MainStack.Screen name="DryIcePrepScreen" component={DryIcePrepScreen} />
      <MainStack.Screen
        name="DryIcePreparationScreen"
        component={DryIcePreparationScreen}
      />
      <MainStack.Screen
        name="CoeAndCaaDisclaimer"
        component={CoeAndCaaDisclaimer}
      />
      <MainStack.Screen
        name="LithiumBatteriesPrepScreen"
        component={LithiumBatteriesPrepScreen}
      />
      <MainStack.Screen name="DotSpScreen" component={DotSpScreen} />
      <MainStack.Screen
        name="EnginesInternalCombustion"
        component={EnginesInternalCombustion}
      />
      <MainStack.Screen
        name="BatteryPoweredVehicle"
        component={BatteryPoweredVehicle}
      />
      <MainStack.Screen
        name="LifeSavingAppliances"
        component={LifeSavingAppliances}
      />
      <MainStack.Screen
        name="GeneticallyModifiedOrganisms"
        component={GeneticallyModifiedOrganisms}
      />
      <MainStack.Screen name="DangerousGoods" component={DangerousGoods} />
      <MainStack.Screen name="Capacitors" component={Capacitors} />
      <MainStack.Screen
        name="KitPreparationScreen"
        component={KitPreparationScreen}
      />
      <MainStack.Screen
        name="SafetyDevicesPreparationScreen"
        component={SafetyDevicesPreparationScreen}
      />
      <MainStack.Screen
        name="A85PackagingWizard"
        component={A85PackagingWizard}
      />
      <MainStack.Screen
        name="SDDGUploadAndParse"
        component={SDDGUploadAndParse}
      />
    </MainStack.Navigator>
  </MainLayout>
);

const RootStack = createStackNavigator();

const MainLayoutNavigator = () => {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen
        name="PreparerHomeStack"
        component={PreparerHomeStack}
      />
      <RootStack.Screen name="WrappedStack" component={WrappedStack} />
      {/* Full-screen camera screens - outside of MainLayout */}
      <RootStack.Screen
        name="POPScannerScreen"
        component={POPScannerScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
      <RootStack.Screen
        name="POPScanResultsScreen"
        component={POPScanResultsScreen}
        options={{
          headerShown: false,
          gestureEnabled: true,
        }}
      />
    </RootStack.Navigator>
  );
};

export default MainLayoutNavigator;
