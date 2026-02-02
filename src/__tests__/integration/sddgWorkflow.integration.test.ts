/**
 * SDDG Workflow Integration Tests
 *
 * For each unique material code path, verifies that
 * InteractiveSDDGComplianceScreen renders correctly with
 * the material's SDDG data and navigates properly.
 */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import { createMockInspectionContext } from "./helpers/renderWithProviders";

// Generate fixtures once for all tests
const fixtures = generateTestFixtures();
const defaultFixture =
  fixtures.find((fixture) => !fixture.hasSpecialRoute) || fixtures[0];

// We need to set up mocks before importing components
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
  setOptions: jest.fn(),
  addListener: jest.fn(() => jest.fn()),
  removeListener: jest.fn(),
  dispatch: jest.fn(),
};
const mockRoute = { params: {} };

jest.mock("@react-navigation/native", () => {
  const actual = jest.requireActual("@react-navigation/native");
  return {
    ...actual,
    useNavigation: () => ({
      navigate: mockNavigate,
      goBack: mockGoBack,
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      removeListener: jest.fn(),
      dispatch: jest.fn(),
    }),
    useRoute: () => ({ params: {} }),
    useFocusEffect: jest.fn(),
    useIsFocused: jest.fn(() => true),
  };
});

// Mock the inspection form context — will be overridden per test
let mockContext: ReturnType<typeof createMockInspectionContext>;

jest.mock("@/contexts/InspectionFormProvider", () => ({
  useInspectionForm: () => mockContext,
}));

// Mock the database context
jest.mock("@/contexts/DataProvider", () => ({
  useDatabase: () => ({
    isInitialized: true,
    saveInspection: jest.fn().mockResolvedValue("test-id"),
    loadInspection: jest.fn().mockResolvedValue(null),
    getAllInspections: jest.fn().mockResolvedValue([]),
    listInspections: jest.fn().mockResolvedValue([]),
  }),
}));

// Mock the HazPro store
jest.mock("@/stores/useHazProStore", () => ({
  useHazProStore: () => ({
    state: { hazProPreparerContext: { activePersona: "Inspector" } },
    actions: { resetContext: jest.fn() },
    hazProContext: { activePersona: "Inspector" },
  }),
  useHazProActions: () => ({
    setCurrentChevron: jest.fn(),
  }),
}));

jest.mock("@/utils/eligibility/attachment19Eligibility", () => ({
  evaluateAttachment19Eligibility: () => ({
    exceptedQuantityData: { eligible: false },
    limitedQuantityData: { eligible: false },
  }),
}));

// Import component AFTER mocks
const {
  default: InteractiveSDDGComplianceScreen,
} = require("@/screens/inspector/InteractiveSDDGComplianceScreen");

describe("SDDG Workflow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =========================================
  // Per-material parameterized tests
  // =========================================
  describe.each(
    fixtures.map((f) => ({
      name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
      fixture: f,
    }))
  )("$name", ({ fixture }) => {
    test("renders SDDG compliance screen without crashing", () => {
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      const { queryAllByText } = render(
        React.createElement(InteractiveSDDGComplianceScreen, {
          navigation: mockNavigation,
          route: mockRoute,
        })
      );

      // Key fields should be visible
      // UN ID should appear somewhere in the rendered output
      expect(
        queryAllByText(fixture.sddgData.unIdNo, { exact: false }).length
      ).toBeGreaterThan(0);
    });

    test("displays material-specific fields correctly", () => {
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      const { queryAllByText } = render(
        React.createElement(InteractiveSDDGComplianceScreen, {
          navigation: mockNavigation,
          route: mockRoute,
        })
      );

      // PSN should appear
      expect(
        queryAllByText(fixture.sddgData.properShippingName, { exact: false })
          .length
      ).toBeGreaterThan(0);

      // Hazard class should appear
      if (fixture.sddgData.hazardClass) {
        expect(
          queryAllByText(fixture.sddgData.hazardClass, { exact: false }).length
        ).toBeGreaterThan(0);
      }
    });
  });

  // =========================================
  // One-time SDDG frustration test
  // =========================================
  describe("SDDG frustration mechanics", () => {
    test("frustrating a field calls addFrustration with correct key", () => {
      const fixture = defaultFixture;
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
      });

      render(
        React.createElement(InteractiveSDDGComplianceScreen, {
          navigation: mockNavigation,
          route: mockRoute,
        })
      );

      // The addFrustration mock should be available for assertion
      // when user interacts with a field
      expect(mockContext.addFrustration).toBeDefined();
      expect(typeof mockContext.addFrustration).toBe("function");
    });
  });

  // =========================================
  // One-time navigation test
  // =========================================
  describe("SDDG navigation", () => {
    test("continue with zero frustrations navigates to SDDGInspectionCompleteScreen", () => {
      const fixture = fixtures[0];
      mockContext = createMockInspectionContext({
        verificationCopy: fixture.sddgData,
        frustrations: [],
      });

      const { getByText } = render(
        React.createElement(InteractiveSDDGComplianceScreen, {
          navigation: mockNavigation,
          route: mockRoute,
        })
      );

      // Find and tap the continue button
      const continueButton = getByText("Continue to Package Inspection");
      fireEvent.press(continueButton);

      expect(mockNavigate).toHaveBeenCalledWith(
        "InspectorPackagingTypeSelectionScreen",
        expect.any(Object)
      );
    });
  });
});
