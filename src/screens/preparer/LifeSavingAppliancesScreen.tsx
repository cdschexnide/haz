// src/screens/preparer/LifeSavingAppliancesScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useNavigationRef } from '@/contexts/NavigationRefProvider/useNavigationRef';
import { hazardousMaterialsList } from '@/hazardousMaterials/hazardousMaterialsList';
import { useHazProStore } from '@/stores/useHazProStore';
import { HazardousMaterialItem } from '../../../types';
import { SpecialtyMaterialScreen } from '@/components/preparer';
import {
  colors,
  spacing,
  borderRadius,
  typography,
  InfoBox,
  FormInput,
} from '@/components/ui';

export interface LifeSavingApplianceData {
  outerPackage: string;
  itemCount: string;
  components: HazardousMaterialItem[];
  key16: string;
  key19: string;
  packagingType: 'standard' | 'crewKit';
}

const COMMON_COMPONENTS: HazardousMaterialItem[] = [
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN0191',
    properShippingName: 'SIGNAL DEVICES, HAND',
    hazclassDiv: '1.4G ',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5, A69',
    packagingParagraph: 'A5.18.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN0197',
    properShippingName: 'SIGNALS, SMOKE',
    hazclassDiv: '1.4G',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5',
    packagingParagraph: 'A5.18.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN0403',
    properShippingName: 'FLARES, AERIAL',
    hazclassDiv: '1.4G',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5',
    packagingParagraph: 'A5.18.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN1013',
    properShippingName: 'CARBON DIOXIDE',
    details: '',
    hazclassDiv: '2.2',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5',
    packagingParagraph: 'A6.3., A6.4., A6.5.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN3028',
    properShippingName: 'BATTERIES, DRY, CONTAINING POTASSIUM HYDROXIDE SOLID',
    details: 'electric storage',
    hazclassDiv: '8',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5',
    packagingParagraph: 'A12.4.',
  },
  {
    isFixed: '',
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: 'UN3480',
    properShippingName: 'LITHIUM ION BATTERIES',
    details: 'including lithium polymer batteries',
    hazclassDiv: '9',
    subsidiaryRisk: '',
    packingGroup: '',
    specialProvision: 'P5, 388',
    packagingParagraph: 'A13.7.',
  },
];

const LifeSavingAppliancesScreen = ({ navigation }: { navigation: any }) => {
  const { state, store, saveCurrentShipment } = useHazProStore();
  const completedSubsteps = state.hazProPreparerContext.completedSubsteps || [];
  const { navigate } = useNavigationRef();

  const [outerPackage, setOuterPackage] = useState('');
  const [itemCount, setItemCount] = useState('1');
  const [components, setComponents] = useState<HazardousMaterialItem[]>([]);
  const [packagingType, setPackagingType] = useState<'standard' | 'crewKit'>('standard');
  const [showAddComponentModal, setShowAddComponentModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState<HazardousMaterialItem[]>([]);

  const material = state.hazProPreparerContext.hazardousMaterial;

  // Search filtering
  useEffect(() => {
    if (searchQuery.length >= 3) {
      const filtered = hazardousMaterialsList.filter(
        (mat: HazardousMaterialItem) =>
          mat.unid.toLowerCase().includes(searchQuery.toLowerCase()) ||
          mat.properShippingName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMaterials(filtered);
    } else {
      setFilteredMaterials([]);
    }
  }, [searchQuery]);

  // Key 16 for Shipper's Declaration
  const key16 =
    outerPackage && itemCount
      ? `${outerPackage} x ${itemCount} ${
          material?.unid === 'UN2990' ? 'self-inflating' : 'non-self-inflating'
        } life-saving appliance${parseInt(itemCount) > 1 ? 's' : ''}`
      : '';

  // Key 19 for Shipper's Declaration
  const key19 =
    components.length > 0
      ? `Contains: ${components
          .map((comp) => `${comp.properShippingName} (${comp.hazclassDiv})`)
          .join(', ')}`
      : '';

  // Load existing data
  useEffect(() => {
    const existingData = state.hazProPreparerContext.lifeSavingApplianceData;
    if (existingData) {
      if (existingData.outerPackage) setOuterPackage(existingData.outerPackage);
      if (existingData.itemCount) setItemCount(existingData.itemCount);
      if (existingData.components) setComponents([...existingData.components] as HazardousMaterialItem[]);
      if (existingData.packagingType) setPackagingType(existingData.packagingType);
    }
  }, []);

  useEffect(() => {
    store.hazProPreparerContext.activeStep = 2;
  }, []);

  // Validation
  const isOuterPackageValid = outerPackage.trim().length > 0 && outerPackage.length <= 50;
  const isItemCountValid = /^[1-9][0-9]*$/.test(itemCount);
  const areComponentsValid = components.length > 0;
  const isValid = isOuterPackageValid && isItemCountValid && areComponentsValid;

  const handleAddComponent = (item: HazardousMaterialItem) => {
    if (item?.properShippingName && item?.hazclassDiv) {
      setComponents([...components, { ...item }]);
      setShowAddComponentModal(false);
      setSearchQuery('');
    }
  };

  const handleAddCommonComponent = (component: HazardousMaterialItem) => {
    const alreadyExists = components.some(
      (c) =>
        c.properShippingName === component.properShippingName &&
        c.hazclassDiv === component.hazclassDiv
    );
    if (!alreadyExists) {
      setComponents([...components, { ...component }]);
    }
    setShowAddComponentModal(false);
  };

  const handleRemoveComponent = (index: number) => {
    const updatedComponents = [...components];
    updatedComponents.splice(index, 1);
    setComponents(updatedComponents);
  };

  const saveData = (): LifeSavingApplianceData => ({
    outerPackage,
    itemCount,
    components,
    key16,
    key19,
    packagingType,
  });

  const handleCancel = () => navigation.goBack();

  const handleSaveAndExit = () => {
    store.hazProPreparerContext.lifeSavingApplianceData = saveData();
    saveCurrentShipment('in-progress');
    navigate('PreparerHomeStack', { screen: 'PreparerHome' });
  };

  const handleSaveAndContinue = () => {
    if (!isValid) return;
    store.hazProPreparerContext.lifeSavingApplianceData = saveData();
    if (!completedSubsteps.includes('LifeSavingAppliances')) {
      store.hazProPreparerContext.completedSubsteps = [
        ...completedSubsteps,
        'LifeSavingAppliances',
      ];
    }
    navigation.navigate('LabelingAndMarking');
  };

  const materialInfo = {
    unid: material?.unid || '',
    properShippingName: material?.properShippingName || '',
    hazardClass: material?.hazclassDiv || '',
    packingGroup: material?.packingGroup,
  };

  return (
    <SpecialtyMaterialScreen
      title="Life-Saving Appliances"
      onBack={handleCancel}
      material={materialInfo}
      onCancel={handleCancel}
      onSaveExit={handleSaveAndExit}
      onContinue={handleSaveAndContinue}
      continueDisabled={!isValid}
      infoBanner="Life-saving appliances include life-raft kits, life-vest kits, survival kits, ejection seats, and parachutes, that contain small quantities of hazardous materials such as flares, CO2 cylinders, or ammunition."
    >
      {/* Packaging Details Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Packaging Details</Text>

        <InfoBox
          variant="info"
          message="Pack kits in weather-resistant fiberboard or other securely closed strong outer container. Pack hazardous materials contained in the kit in inner packaging that is adequate to prevent accidental activation. Suitably cushion the inner packagings to prevent movement."
        />

        <View style={styles.formGroup}>
          <Text style={styles.label}>Outer Package Description</Text>
          <Text style={styles.helperText}>
            Example: 463L Pallet, 1 x Fiberboard box (4G), Equipment (described), or Plywood box, etc.
          </Text>
          <FormInput
            value={outerPackage}
            onChangeText={setOuterPackage}
            placeholder="e.g., Fiberboard box, Wooden crate, A-3 bag"
            maxLength={60}
            error={outerPackage.length > 50 ? { message: 'Too long' } : undefined}
          />
          <Text style={styles.helperText}>
            {packagingType === 'standard'
              ? 'Weather-resistant fiberboard or equivalent strong container'
              : 'Strong outer container or A-3 bag'}
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Number of Items</Text>
          <FormInput
            value={itemCount}
            onChangeText={(text) => setItemCount(text.replace(/[^0-9]/g, ''))}
            keyboardType="numeric"
            placeholder="Enter quantity (e.g., 1, 2, 3)"
          />
          <Text style={styles.helperText}>
            Number of life-saving appliances in this shipment
          </Text>
        </View>
      </View>

      {/* Hazardous Components Section */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Hazardous Components</Text>
        <Text style={styles.descriptionText}>
          List all hazardous materials contained within the life-saving appliance.
        </Text>

        {/* Components Table */}
        {components.length > 0 ? (
          <View style={styles.componentTable}>
            <View style={styles.componentTableHeader}>
              <Text style={[styles.componentHeaderText, { flex: 2 }]}>
                Proper Shipping Name
              </Text>
              <Text style={[styles.componentHeaderText, { flex: 1 }]}>Class/Division</Text>
              <Text style={[styles.componentHeaderText, { width: 50 }]}>Action</Text>
            </View>
            {components.map((component, index) => (
              <View key={index} style={styles.componentRow}>
                <Text style={[styles.componentText, { flex: 2 }]}>
                  {component.properShippingName}
                </Text>
                <Text style={[styles.componentText, { flex: 1 }]}>
                  {component.hazclassDiv}
                </Text>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleRemoveComponent(index)}
                >
                  <MaterialIcons name="delete" size={20} color={colors.error} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              No hazardous components added yet. Add at least one component.
            </Text>
          </View>
        )}

        {/* Add Component Button */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddComponentModal(!showAddComponentModal)}
        >
          <MaterialIcons name="add" size={20} color={colors.white} />
          <Text style={styles.addButtonText}>
            {showAddComponentModal ? 'Cancel' : 'Add Component'}
          </Text>
        </TouchableOpacity>

        {/* Add Component Form */}
        {showAddComponentModal && (
          <View style={styles.addComponentForm}>
            <Text style={styles.addComponentTitle}>Add New Component</Text>

            {/* Search Input */}
            <View style={styles.searchRow}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={colors.textSecondary} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search by UNID or Name"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  accessibilityLabel="Search hazards input"
                />
              </View>
              <TouchableOpacity
                style={styles.searchCancelButton}
                onPress={() => {
                  setSearchQuery('');
                  setShowAddComponentModal(false);
                }}
                accessibilityRole="button"
                accessibilityLabel="Cancel search"
              >
                <Ionicons name="close-circle" size={22} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Search Results */}
            {searchQuery.length >= 3 && (
              <ScrollView style={styles.searchResults} nestedScrollEnabled>
                {filteredMaterials.map((item, index) => (
                  <TouchableOpacity
                    key={`${item.unid}-${index}`}
                    style={styles.searchResultItem}
                    onPress={() => handleAddComponent(item)}
                  >
                    <Text style={styles.searchResultUnid}>{item.unid}</Text>
                    <Text style={styles.searchResultName}>{item.properShippingName}</Text>
                    <Text style={styles.searchResultClass}>{item.hazclassDiv}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {/* Common Components */}
            <Text style={styles.commonComponentsTitle}>Common Components:</Text>
            <ScrollView horizontal style={styles.commonComponentsScroll}>
              {COMMON_COMPONENTS.map((component, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.commonComponentButton}
                  onPress={() => handleAddCommonComponent(component)}
                >
                  <Text style={styles.commonComponentName}>
                    {component.properShippingName}
                  </Text>
                  <Text style={styles.commonComponentClass}>{component.hazclassDiv}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </SpecialtyMaterialScreen>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.lg,
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  formGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  helperText: {
    ...typography.caption,
  },
  descriptionText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  componentTable: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
  },
  componentTableHeader: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  componentHeaderText: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  componentRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
  },
  componentText: {
    ...typography.body,
    color: colors.textPrimary,
  },
  deleteButton: {
    width: 50,
    alignItems: 'center',
  },
  emptyState: {
    padding: spacing.lg,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  emptyStateText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  addButtonText: {
    ...typography.body,
    color: colors.white,
    fontWeight: '600',
  },
  addComponentForm: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.lg,
    gap: spacing.md,
  },
  addComponentTitle: {
    ...typography.cardTitle,
    color: colors.textPrimary,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    ...typography.body,
    marginLeft: spacing.sm,
  },
  searchCancelButton: {
    padding: spacing.sm,
  },
  searchResults: {
    maxHeight: 200,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.sm,
  },
  searchResultItem: {
    flexDirection: 'row',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: spacing.sm,
  },
  searchResultUnid: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    width: 80,
  },
  searchResultName: {
    ...typography.body,
    flex: 1,
    color: colors.textPrimary,
  },
  searchResultClass: {
    ...typography.body,
    color: colors.textSecondary,
    width: 50,
  },
  commonComponentsTitle: {
    ...typography.body,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  commonComponentsScroll: {
    flexDirection: 'row',
  },
  commonComponentButton: {
    backgroundColor: colors.borderLight,
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginRight: spacing.sm,
    minWidth: 130,
  },
  commonComponentName: {
    ...typography.caption,
    fontWeight: '500',
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  commonComponentClass: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});

export default LifeSavingAppliancesScreen;
