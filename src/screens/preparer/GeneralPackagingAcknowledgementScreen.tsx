// src/screens/preparer/GeneralPackagingAcknowledgementScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ActionFooter, ScreenHeader, colors, spacing, typography } from '@/components/ui';
import { useHazProStore } from '@/stores/useHazProStore';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { renderGeneralPackagingRequirementsDocumentNodes } from '../../../afmanData/generalPackagingRequirements';
import { cylinderRequirementsForCompressGases } from '../../../server/attachment6/tables/tableA6.1';
import { informativeSpecialProvisionsMap } from '../../../server/informativeStatements/informativeStatements';
import {
  hazProContextLookup,
  HazProContextLookupInput,
} from '../../../server/lookupFunctions/hazProContextLookup';

export interface GeneralPackagingAcknowledgementScreenProps {
  navigation: any;
}

export const GeneralPackagingAcknowledgementScreen: React.FC<GeneralPackagingAcknowledgementScreenProps> = ({
  navigation,
}) => {
  const { state, store } = useHazProStore();
  const { navigate } = useNavigationRef();

  useEffect(() => {
    const material = state.hazProPreparerContext.hazardousMaterial;

    if (!material?.properShippingName) return;

    const match = cylinderRequirementsForCompressGases.find(
      entry =>
        entry.name.toUpperCase() ===
          material.properShippingName.toUpperCase() ||
        entry.alternativeName?.toUpperCase() ===
          material.properShippingName.toUpperCase()
    );

    if (match) {
      const cylinderRestriction = {
        ...(match.maxFillingDensityPercent !== undefined && {
          maxFillingDensityLimit: {
            percentage: match.maxFillingDensityPercent,
          },
        }),
        cylinderTypes: match.cylinderTypes,
        massCapacityLimit: {
          kg: 0,
          lbs: 0,
        },
      };

      store.hazProPreparerContext.cylinderRestrictions = cylinderRestriction;
    }
  }, [state.hazProPreparerContext.hazardousMaterial]);

  useEffect(() => {
    const lookupInput: HazProContextLookupInput = {
      context: {
        hazardousMaterial: state.hazProPreparerContext.hazardousMaterial,
        physicalState:
          state.hazProPreparerContext.hazardousMaterial?.physicalState,
      },
      specialProvisionsMap: informativeSpecialProvisionsMap,
      dotCylinderSpecifications: [],
    };

    const lookupOutput = hazProContextLookup(lookupInput);
    if (typeof lookupOutput === 'string') {
      return;
    }
    store.hazProPreparerContext.lookupFunctionsOutput = lookupOutput;
  }, []);

  const handleAcknowledge = () => {
    // Mark general packaging requirements as acknowledged
    if (store.hazProPreparerContext) {
      if (!store.hazProPreparerContext.modifiersAndRequiredAcknowledgements) {
        store.hazProPreparerContext.modifiersAndRequiredAcknowledgements = {
          generalPackagingRequirementsAcknowledged: false,
          informativeStatementsAcknowledged: false,
          workflowModifiersAcknowledged: false,
          specialProvisionsAcknowledged: false,
          documentNodeInformativeStatements: [],
          documentNodeWorkflowModifiers: [],
          specialProvisionsInformativeStatements: {},
          specialProvisionsWorkflowModifiers: {},
        };
      }
      store.hazProPreparerContext.modifiersAndRequiredAcknowledgements.generalPackagingRequirementsAcknowledged =
        true;
    }

    if (state.hazProPreparerContext.isGrandfatheredExplosive === true) {
      navigation.navigate('LabelingAndMarking');
      return;
    }
    const unid = state.hazProPreparerContext.hazardousMaterial?.unid;
    if (unid === 'UN3166') {
      navigation.navigate('UN3166FuelEntryScreen');
      return;
    }
    if (unid === 'UN2807') {
      navigation.navigate('MagnetizedMaterialPrepScreen');
      return;
    }
    if (unid === 'UN3268') {
      navigation.navigate('SafetyDevicesPreparationScreen');
      return;
    }
    if (unid === 'UN1845') {
      navigation.navigate('DryIcePrepScreen');
      return;
    }
    if (unid === 'UN3090' || unid === 'UN3480') {
      navigation.navigate('LithiumBatteriesPrepScreen');
      return;
    }
    if (unid === 'UN3529' || unid === 'UN3528' || unid === 'UN3530') {
      navigation.navigate('EnginesInternalCombustion');
      return;
    }
    if (unid === 'UN3171') {
      navigation.navigate('BatteryPoweredVehicle');
      return;
    }
    if (unid === 'UN3072' || unid === 'UN2990') {
      navigation.navigate('LifeSavingAppliances');
      return;
    }
    if (unid === 'UN3316') {
      navigation.navigate('KitPreparationScreen');
      return;
    }
    if (unid === 'UN3245' || unid === 'UN2900' || unid === 'UN2814') {
      navigation.navigate('GeneticallyModifiedOrganisms');
      return;
    }
    if (unid === 'UN3363') {
      navigation.navigate('DangerousGoods');
      return;
    }
    if (unid === 'UN3508' || unid === 'UN3499') {
      navigation.navigate('Capacitors');
      return;
    }
    navigation.navigate('SpecialProvisionsAcknowledgement');
    return;
  };

  const handleReject = () => {
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  const generalPackagingContent =
    renderGeneralPackagingRequirementsDocumentNodes();

  return (
    <View style={styles.container}>
      <ScreenHeader title="General Packaging Requirements" />
      <WebView
        originWhitelist={['*']}
        source={{ html: generalPackagingContent }}
        style={styles.webView}
      />
      <ActionFooter
        buttons={[
          {
            label: 'Reject Requirements',
            onPress: handleReject,
            variant: 'outline',
          },
          {
            label: 'Acknowledge Requirements',
            onPress: handleAcknowledge,
            variant: 'primary',
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  webView: {
    flex: 1,
  },
});

export default GeneralPackagingAcknowledgementScreen;
