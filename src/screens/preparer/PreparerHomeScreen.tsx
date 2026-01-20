// src/screens/preparer/PreparerHomeScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SavedShipment } from '@/contexts/HazProPreparerProvider/reducer';
import { RootStackParamList } from '@/contexts/NavigationRefProvider/NavigationRefContext';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import ShipmentDatabase from '@/services/shipment/ShipmentDatabase';
import { useHazProStore } from '@/stores/useHazProStore';
import { colors, spacing, borderRadius, shadows } from '@/components/ui/theme';
import {
  convertShipmentFileToSavedShipment,
  sortShipmentsByDate,
} from '@/utils/shipment/shipmentLoader';
import DatabaseErrorDisplay from '@/components/DatabaseErrorDisplay';
import TopNavBar from '@/components/TopNavBar';
import {
  ToolButtonsBar,
  ShipmentTable,
  ShipmentContextMenu,
} from '@/components/preparer';
import GasCalculatorTool from '@/components/GasCalculatorTool';
import DryIceCalculator from '@/components/DryIceCalculator';
import UnitConversionTool from '@/components/UnitConversionTool';
import PlacardingTool from '@/components/PlacardingTool';

interface PreparerHomeScreenProps {
  navigation: any;
}

export const PreparerHomeScreen: React.FC<PreparerHomeScreenProps> = ({
  navigation,
}) => {
  const { state, actions, error, initializeDatabase } = useHazProStore();
  const { navigate } = useNavigationRef();

  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [shipmentsList, setShipmentsList] = useState<SavedShipment[]>([]);
  const [localLoading, setLocalLoading] = useState(true);

  // Modal states
  const [gasModalVisible, setGasModalVisible] = useState(false);
  const [dryIceModalVisible, setDryIceModalVisible] = useState(false);
  const [unitConversionModalVisible, setUnitConversionModalVisible] =
    useState(false);
  const [placardingModalVisible, setPlacardingModalVisible] = useState(false);
  const [placardingModalExpanded, setPlacardingModalExpanded] = useState(false);

  // Context menu state
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] =
    useState<SavedShipment | null>(null);

  // Tool buttons configuration
  const toolButtons = [
    {
      icon: 'calculate' as const,
      label: 'Gas Calculator',
      onPress: () => setGasModalVisible(true),
    },
    {
      icon: 'ac-unit' as const,
      label: 'Dry Ice Calculator',
      onPress: () => setDryIceModalVisible(true),
    },
    {
      icon: 'swap-horiz' as const,
      label: 'Unit Converter',
      onPress: () => setUnitConversionModalVisible(true),
    },
    {
      icon: 'signpost' as const,
      label: 'Placarding Tool',
      onPress: () => setPlacardingModalVisible(true),
    },
    {
      icon: 'compare-arrows' as const,
      label: 'Compatibility/Segregation Tool',
      onPress: () => {},
      disabled: true,
    },
  ];

  // Convert shipments index to SavedShipment array
  const loadAndConvertShipments = useCallback(async (): Promise<SavedShipment[]> => {
    const shipmentsMetadata = Object.values(state.shipmentsIndex);
    const savedShipments: SavedShipment[] = [];

    for (const metadata of shipmentsMetadata) {
      try {
        const fullShipment = await ShipmentDatabase.loadShipment(metadata.id);
        if (fullShipment) {
          savedShipments.push(convertShipmentFileToSavedShipment(fullShipment));
        }
      } catch (err) {
        console.warn(`Failed to load shipment ${metadata.id}:`, err);
      }
    }

    return sortShipmentsByDate(savedShipments);
  }, [state.shipmentsIndex]);

  // Load shipments on mount
  useEffect(() => {
    loadShipmentsList();
  }, []);

  // React to store changes
  useEffect(() => {
    loadAndConvertShipments().then(setShipmentsList);
  }, [loadAndConvertShipments]);

  const loadShipmentsList = async () => {
    try {
      setLocalLoading(true);
      await initializeDatabase();
      await actions.refreshShipmentsIndex();
      await new Promise((resolve) => setTimeout(resolve, 100));
      const shipments = await loadAndConvertShipments();
      setShipmentsList(shipments);
    } finally {
      setLocalLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadShipmentsList();
    setRefreshing(false);
  };

  // Filtered shipments
  const filteredShipments = shipmentsList.filter((s) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      s.hazProPreparerContext.shipment?.tcn
        ?.toLowerCase()
        .includes(searchLower) ||
      s.hazProPreparerContext.hazardousMaterial?.unid
        ?.toLowerCase()
        .includes(searchLower) ||
      s.hazProPreparerContext.hazardousMaterial?.hazclassDiv
        ?.toLowerCase()
        .includes(searchLower) ||
      s.hazProPreparerContext.shipment?.poe
        ?.toLowerCase()
        .includes(searchLower) ||
      s.hazProPreparerContext.shipment?.pod
        ?.toLowerCase()
        .includes(searchLower) ||
      s.hazProPreparerContext.preparer?.preparerName
        ?.toLowerCase()
        .includes(searchLower)
    );
  });

  // Handlers
  const handleLongPress = (shipment: SavedShipment) => {
    setSelectedShipment(shipment);
    setBottomSheetVisible(true);
  };

  const handleDelete = async (shipmentId: string) => {
    try {
      await actions.deleteShipment(shipmentId);
      await loadShipmentsList();
    } catch (err) {
      console.error('Failed to delete shipment:', err);
    }
  };

  const handleCopy = (shipmentId: string) => {
    // TODO: Implement copy functionality
    console.log('Copy shipment:', shipmentId);
  };

  const handleResume = async () => {
    if (!selectedShipment) return;
    setBottomSheetVisible(false);

    try {
      const shipmentFile = await ShipmentDatabase.loadShipment(
        selectedShipment.id
      );
      if (!shipmentFile) return;

      await actions.loadShipment(selectedShipment.id);

      const step = shipmentFile.hazProPreparerContext.activeStep;
      const substep = shipmentFile.hazProPreparerContext.packagingWizardStep;
      const completed = shipmentFile.hazProPreparerContext.completedSubsteps;

      const stepToScreenMap: Record<number, keyof RootStackParamList> = {
        1: 'MaterialID',
        2: 'PackagingScreen',
        3: 'LabelingAndMarking',
        4: 'ShippersDeclarationScreen',
        5: 'Certify',
      };

      if (step === 2 && completed.includes('PackagingWizard')) {
        navigation.navigate('WrappedStack', { screen: 'POPMarkingDataEntry' });
        return;
      } else if (
        step === 2 &&
        completed.includes('PackagingScreen') &&
        !completed.includes('PackagingWizard') &&
        typeof substep === 'number' &&
        substep >= 0 &&
        substep <= 3
      ) {
        navigation.navigate('WrappedStack', { screen: 'PackagingWizard' });
        return;
      } else if (typeof step === 'number' && stepToScreenMap[step]) {
        navigation.navigate('WrappedStack', { screen: stepToScreenMap[step] });
      }
    } catch (err) {
      console.error('Failed to resume shipment:', err);
    }
  };

  const handleViewSDDG = async () => {
    if (!selectedShipment) return;
    setBottomSheetVisible(false);

    try {
      await actions.loadShipment(selectedShipment.id);
      navigation.navigate('WrappedStack', {
        screen: 'ShippersDeclarationScreen',
      });
    } catch (err) {
      console.error('Failed to view SDDG:', err);
    }
  };

  return (
    <>
      <View>
        <TopNavBar
          onMenuPress={() => navigation.openDrawer()}
          onSelectRole={() => {}}
        />
      </View>

      <View style={styles.container}>
        <View style={styles.whiteContainer}>
          {error && (
            <DatabaseErrorDisplay
              error={error}
              service="HazProValtioStore"
              operation="listShipments"
              onRetry={loadShipmentsList}
              showTechnicalDetails={false}
            />
          )}

          {/* Tool Buttons */}
          <ToolButtonsBar tools={toolButtons} />

          {/* Header Row */}
          <View style={styles.headerRow}>
            <Text style={styles.sectionTitle}>
              Shipments {!localLoading && `(${filteredShipments.length})`}
            </Text>
            <View style={styles.headerActions}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search by TCN, UN/ID, Class, POE, POD, or Signatory"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              <TouchableOpacity
                style={styles.createButton}
                onPress={() =>
                  navigate('WrappedStack', { screen: 'Disclaimer' })
                }
              >
                <Text style={styles.createButtonText}>Create New Shipment</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Shipment Table */}
          <ShipmentTable
            shipments={filteredShipments}
            onShipmentLongPress={handleLongPress}
            onDelete={handleDelete}
            onCopy={handleCopy}
            isLoading={localLoading}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        </View>
      </View>

      <StatusBar style="auto" />

      {/* Context Menu */}
      <ShipmentContextMenu
        visible={bottomSheetVisible}
        shipment={selectedShipment}
        onClose={() => setBottomSheetVisible(false)}
        onResume={handleResume}
        onViewSDDG={handleViewSDDG}
      />

      {/* Modals */}
      <GasCalculatorTool
        visible={gasModalVisible}
        onClose={() => setGasModalVisible(false)}
      />
      <DryIceCalculator
        visible={dryIceModalVisible}
        onClose={() => setDryIceModalVisible(false)}
      />
      <UnitConversionTool
        visible={unitConversionModalVisible}
        onClose={() => setUnitConversionModalVisible(false)}
      />
      <PlacardingTool
        visible={placardingModalVisible}
        onClose={() => {
          setPlacardingModalVisible(false);
          setPlacardingModalExpanded(false);
        }}
        onExpandChange={setPlacardingModalExpanded}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.backgroundSecondary,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: spacing.md,
    paddingBottom: 0,
    ...shadows.light,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    marginLeft: spacing.md,
    color: colors.textPrimary,
  },
  headerActions: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    marginHorizontal: spacing.md,
    height: 50,
  },
  createButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.sm,
  },
  createButtonText: {
    color: colors.surface,
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PreparerHomeScreen;
