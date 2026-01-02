/**
 * @file testUtils.tsx
 * @description Shared test utilities and mock factories for HazPro component tests.
 *
 * This file provides reusable mock factories and sample data fixtures for
 * snapshot tests. These utilities help ensure consistent mocking patterns
 * across all component tests and reduce duplication.
 *
 * Usage:
 * 1. Import the factories you need in your test file
 * 2. Create mocks using the factory functions with optional overrides
 * 3. Use jest.mock() to replace real modules with these mocks
 */
import React from 'react';

// ============================================
// MOCK FACTORIES
// ============================================

/**
 * Creates a mock HazPro store with customizable state.
 * This is the primary mock for components using useHazProStore hook.
 */
export const createMockHazProStore = (overrides: Record<string, any> = {}) => {
  const defaultPreparerContext = {
    activePersona: 'Preparer',
    activeStep: 0,
    packagingWizardStep: 0,
    completedSubsteps: [],
    hazardousMaterial: null,
    modifiersAndAcknowledgements: null,
    requiredMarkingsArray: [],
    requiredLabelsArray: [],
    shipper: null,
    consignee: null,
    preparer: null,
    shipment: null,
    packaging: null,
    technicalName: null,
    isGrandfatheredExplosive: null,
    lookupFunctionsOutput: null,
    specialProvisionsMap: {},
    allowablePackingGroups: '',
    redirectUnid: null,
    dryIceData: undefined,
    lithiumBatteryData: undefined,
    cylinderProperties: undefined,
    megcProperties: undefined,
    grandfatheredExplosivesContainers: [],
    engineOrMachineryPreparationData: undefined,
    un3166Details: undefined,
    lifeSavingApplianceData: undefined,
    geneticallyModifiedOrganism: undefined,
    batteryVehicle: undefined,
    coeApprovalEntity: undefined,
    caaApprovalEntity: undefined,
    ...overrides,
  };

  return {
    state: {
      hazProPreparerContext: defaultPreparerContext,
      isLoadingShipments: false,
      databaseError: null,
      shipmentsIndex: {},
      ...overrides.state,
    },
    store: {
      hazProPreparerContext: { ...defaultPreparerContext },
      ...overrides.store,
    },
    actions: {
      saveCurrentShipment: jest.fn().mockResolvedValue(undefined),
      loadShipment: jest.fn().mockResolvedValue(undefined),
      deleteShipment: jest.fn().mockResolvedValue(undefined),
      initializeDatabase: jest.fn().mockResolvedValue(undefined),
      refreshShipmentsIndex: jest.fn().mockResolvedValue(undefined),
      resetContext: jest.fn(),
      ...overrides.actions,
    },
    isLoading: overrides.isLoading ?? false,
    error: overrides.error ?? null,
    initializeDatabase: jest.fn().mockResolvedValue(undefined),
    hazProContext: defaultPreparerContext,
    requiredMarkings: [],
    requiredLabels: [],
  };
};

/**
 * Creates a mock navigation object for React Navigation.
 */
export const createMockNavigation = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  isFocused: jest.fn(() => true),
  canGoBack: jest.fn(() => true),
  getParent: jest.fn(),
  getState: jest.fn(() => ({ routes: [], index: 0 })),
  openDrawer: jest.fn(),
  closeDrawer: jest.fn(),
});

/**
 * Creates a mock route object for React Navigation.
 */
export const createMockRoute = (params: Record<string, any> = {}) => ({
  key: 'test-route',
  name: 'TestScreen',
  params,
});

/**
 * Creates a mock navigation ref hook.
 */
export const createMockNavigationRef = () => ({
  navigate: jest.fn(),
  goBack: jest.fn(),
  dispatch: jest.fn(),
  reset: jest.fn(),
  setOptions: jest.fn(),
  getCurrentRoute: jest.fn(() => ({ name: 'TestScreen', params: {} })),
});

/**
 * Creates a mock inspection form context.
 */
export const createMockInspectionForm = (overrides: Record<string, any> = {}) => ({
  inspection: {
    id: 'test-inspection-id',
    sddgStatus: 'NOT_STARTED',
    packageStatus: 'NOT_STARTED',
    frustrations: [],
    packageFrustrations: [],
    ...overrides.inspection,
  },
  workflow: {
    currentChevron: 'SDDG',
    currentSDDGStep: 0,
    currentPackageStep: 0,
    ...overrides.workflow,
  },
  isProcessing: false,
  hasUnsavedChanges: false,
  startNewInspection: jest.fn(),
  loadInspectionForEdit: jest.fn().mockResolvedValue(undefined),
  saveCurrentInspection: jest.fn().mockResolvedValue(undefined),
  completeInspection: jest.fn(),
  ...overrides,
});

/**
 * Creates a mock database context.
 */
export const createMockDatabase = () => ({
  isInitialized: true,
  loadShipment: jest.fn().mockResolvedValue(null),
  saveShipment: jest.fn().mockResolvedValue(undefined),
  deleteShipment: jest.fn().mockResolvedValue(undefined),
  loadInspection: jest.fn().mockResolvedValue(null),
  saveInspection: jest.fn().mockResolvedValue(undefined),
  deleteInspection: jest.fn().mockResolvedValue(undefined),
  getAllShipments: jest.fn().mockResolvedValue([]),
  getAllInspections: jest.fn().mockResolvedValue([]),
  listInspections: jest.fn().mockResolvedValue([]),
  getInspectionStats: jest.fn().mockResolvedValue({ total: 0, completed: 0, frustrated: 0 }),
});

/**
 * Creates a mock HazPro Preparer context (for older context-based components).
 */
export const createMockPreparerContext = (overrides: Record<string, any> = {}) => ({
  state: {
    hazProPreparerContext: {
      activePersona: 'Preparer',
      activeStep: 0,
      ...overrides.state,
    },
    savedShipments: [],
  },
  dispatch: jest.fn(),
});

/**
 * Creates a mock HazPro Inspector context (for older context-based components).
 */
export const createMockInspectorContext = (overrides: Record<string, any> = {}) => ({
  state: {
    activeInspection: null,
    inspections: [],
    ...overrides.state,
  },
  dispatch: jest.fn(),
});

// ============================================
// SAMPLE DATA FIXTURES
// ============================================

export const sampleHazardousMaterial = {
  unid: 'UN1090',
  properShippingName: 'ACETONE',
  hazclassDiv: '3',
  packingGroup: 'II',
  subsidiaryRisk: '',
  specialProvision: '',
  packagingParagraph: 'A3.1.',
  isFixed: false,
  isDomesticShipment: false,
  isTechnicalNameRequired: false,
  details: '',
  physicalState: 'LIQUID' as const,
};

export const sampleShipper = {
  name: 'Test Shipper Inc.',
  address: {
    shipperStreet: '123 Test Street',
    shipperCity: 'Test City',
    shipperState: 'TS',
    shipperZipcode: '12345',
  },
  phoneNumber: {
    type: 'Commercial' as const,
    format: 'Domestic' as const,
    number: '555-123-4567',
    dsnNumber: '312-555-1234',
  },
};

export const sampleConsignee = {
  name: 'Test Consignee LLC',
  address: {
    consigneeDodaac: 'ABC123',
    consigneeStreet: '456 Destination Ave',
    consigneeCity: 'Dest City',
    selectedConsigneeCountry: 'United States',
  },
  phoneNumber: {
    type: 'Commercial' as const,
    format: 'Domestic' as const,
    number: '555-987-6543',
  },
};

export const samplePreparer = {
  preparerName: 'John Doe',
  preparerRank: 'SGT',
  preparerTitle: 'Hazmat Specialist',
  certificationPlace: 'Fort Test',
  signature: null,
};

export const sampleShipment = {
  tcn: 'TCN123456789',
  poe: 'KDOV',
  pod: 'ETAR',
};

export const sampleSavedShipment = {
  id: 'test-shipment-id',
  status: 'in-progress' as const,
  savedAt: new Date().toISOString(),
  hazProPreparerContext: {
    activePersona: 'Preparer',
    activeStep: 2,
    packagingWizardStep: 0,
    completedSubsteps: ['MaterialID'],
    hazardousMaterial: sampleHazardousMaterial,
    shipper: sampleShipper,
    consignee: sampleConsignee,
    preparer: samplePreparer,
    shipment: sampleShipment,
  },
};

export const sampleInspectorShipment = {
  id: 'test-inspection-id',
  tcn: 'TCN987654321',
  unId: 'UN1090',
  properShippingName: 'ACETONE',
  inspector: 'Jane Inspector',
  inspectedAt: new Date().toISOString(),
  status: 'frustrated' as const,
  sddgStatus: 'frustrated' as const,
  packageStatus: null,
};

// ============================================
// ACKNOWLEDGEMENT CONTENT MOCK
// ============================================

export const mockAcknowledgementSections = [
  {
    id: 'purpose',
    title: 'Purpose',
    icon: 'info',
    content: 'This is a test acknowledgement section.',
    items: ['Item 1', 'Item 2'],
  },
  {
    id: 'responsibilities',
    title: 'Responsibilities',
    icon: 'assignment',
    content: 'User responsibilities content.',
    items: ['Responsibility 1', 'Responsibility 2'],
  },
];

export const MOCK_CURRENT_APP_VERSION = '1.0.0-test';

// ============================================
// COMPONENT MOCK FACTORIES
// ============================================

/**
 * Creates a mock for child components that should be rendered as simple views.
 * Useful for isolating component tests from complex child components.
 */
export const createMockComponent = (componentName: string) => {
  const MockComponent = (props: any) => {
    const { children, ...restProps } = props;
    return React.createElement(
      'View',
      { testID: `mock-${componentName}`, ...restProps },
      children
    );
  };
  MockComponent.displayName = `Mock${componentName}`;
  return MockComponent;
};

/**
 * Creates a mock modal component.
 */
export const createMockModal = (componentName: string) => {
  const MockModal = ({ visible, children, ...props }: any) => {
    if (!visible) return null;
    return React.createElement(
      'View',
      { testID: `mock-${componentName}`, ...props },
      children
    );
  };
  MockModal.displayName = `Mock${componentName}`;
  return MockModal;
};

// ============================================
// TEST HELPER FUNCTIONS
// ============================================

/**
 * Waits for all pending promises to resolve.
 * Useful for testing async effects.
 */
export const flushPromises = () => new Promise(resolve => setImmediate(resolve));

/**
 * Creates a delayed promise for testing loading states.
 */
export function createDelayedPromise<T>(value: T, delay: number = 100): Promise<T> {
  return new Promise(resolve => setTimeout(() => resolve(value), delay));
}
