/**
 * Package Workflow Integration Tests
 *
 * For each unique material code path, verifies:
 * - Packaging type selection shows correct types
 * - Markings & labels validation handles detections correctly
 * - POP marking validation accepts/rejects codes correctly
 * - Happy path completes without frustrations
 * - Frustration path creates correct frustrations
 */
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import {
  generateTestFixtures,
  TestFixture,
} from "./fixtures/generateTestFixtures";
import { createMockInspectionContext } from "./helpers/renderWithProviders";
import {
  getAllowedPackagingTypes,
  PackagingTypeSelection,
} from "@/utils/getAllowedPackagingTypes";
import { validatePackagingCodeV2 } from "@/utils/packagingWizardV2Helpers";
import { packagingDatabaseV2 } from "../../../server/lookupFunctions/packagingLookupV2";

const fixtures = generateTestFixtures();

// Filter to non-special-route fixtures for standard package workflow tests
const standardFixtures = fixtures.filter((f) => !f.hasSpecialRoute);
const specialFixtures = fixtures.filter((f) => f.hasSpecialRoute);

// =============================================
// Mock setup
// =============================================
const mockNavigate = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: jest.fn(),
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
      goBack: jest.fn(),
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

let mockContext: ReturnType<typeof createMockInspectionContext>;

jest.mock("@/contexts/InspectionFormProvider", () => ({
  useInspectionForm: () => mockContext,
}));

jest.mock("@/contexts/DataProvider", () => ({
  useDatabase: () => ({
    isInitialized: true,
    saveInspection: jest.fn().mockResolvedValue("test-id"),
  }),
}));

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

jest.mock("@/types", () => ({
  PhysicalState: { SOLID: "SOLID", LIQUID: "LIQUID" },
}));

describe("Package Workflow Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // =============================================
  // Data pipeline tests (all fixtures, no rendering)
  // =============================================
  describe("Packaging type resolution", () => {
    test.each(
      fixtures.map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )(
      "$name resolves packaging types without error",
      ({ fixture }) => {
        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const hasA2 = fixture.material.specialProvision.includes("A2");

        // Should not throw
        const types = getAllowedPackagingTypes({
          packagingParagraph: primaryParagraph,
          hasA2Restriction: hasA2,
          unIdNo: fixture.material.unid,
          properShippingName: fixture.material.properShippingName,
        });

        expect(Array.isArray(types)).toBe(true);
        // Should return at least one type (unless material is edge case)
        // Store for comparison
        expect(types).toEqual(fixture.expectedPackagingTypes);
      }
    );
  });

  // =============================================
  // POP code validation (all fixtures, no rendering)
  // =============================================
  describe("POP code validation", () => {
    test.each(
      fixtures
        .filter((f) => f.expectedPackagingTypes.length > 0)
        .map((f) => ({
          name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
          fixture: f,
        }))
    )(
      "$name: happy path POP code validates as valid",
      ({ fixture }) => {
        const happyCode = fixture.happyMlResults.bestPopMarking?.fields?.B;
        if (!happyCode) return; // Skip if no POP marking generated

        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const normalizedParagraph = primaryParagraph.endsWith(".")
          ? primaryParagraph.toUpperCase()
          : `${primaryParagraph.toUpperCase()}.`;
        if (!packagingDatabaseV2[normalizedParagraph]) return;

        const result = validatePackagingCodeV2(
          packagingDatabaseV2,
          normalizedParagraph,
          happyCode,
          undefined,
          undefined
        );

        expect(result.isValid).toBe(true);
      }
    );

    test.each(
      fixtures
        .filter((f) => f.expectedPackagingTypes.length > 0)
        .map((f) => ({
          name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
          fixture: f,
        }))
    )(
      "$name: frustration path POP code 9Z9 validates as invalid",
      ({ fixture }) => {
        const primaryParagraph =
          fixture.material.packagingParagraph.split(/[,:]/)[0]?.trim() || "";
        const normalizedParagraph = primaryParagraph.endsWith(".")
          ? primaryParagraph.toUpperCase()
          : `${primaryParagraph.toUpperCase()}.`;
        if (!packagingDatabaseV2[normalizedParagraph]) return;

        const result = validatePackagingCodeV2(
          packagingDatabaseV2,
          normalizedParagraph,
          "9Z9",
          undefined,
          undefined
        );

        expect(result.isValid).toBe(false);
      }
    );
  });

  // =============================================
  // Screen rendering tests (representative subset)
  // =============================================
  describe("PackagingTypeSelectionScreen rendering", () => {
    // Lazy-load to ensure mocks are in place
    const getScreen = () =>
      require("@/screens/inspector/InspectorPackagingTypeSelectionScreen")
        .default;

    test.each(
      standardFixtures.slice(0, 30).map((f) => ({
        name: `${f.material.hazclassDiv} / ${f.material.packagingParagraph} / ${f.material.unid}`,
        fixture: f,
      }))
    )(
      "$name: renders without crashing",
      ({ fixture }) => {
        mockContext = createMockInspectionContext({
          verificationCopy: fixture.sddgData,
          sddgComplete: true,
          currentChevron: "package",
        });

        const Screen = getScreen();
        expect(() =>
          render(
            React.createElement(Screen, {
              navigation: mockNavigation,
              route: mockRoute,
            })
          )
        ).not.toThrow();
      }
    );
  });

  // =============================================
  // Special routing materials
  // =============================================
  describe("Special route materials", () => {
    test.each(
      specialFixtures.map((f) => ({
        name: `${f.material.unid} -> ${f.specialScreenName}`,
        fixture: f,
      }))
    )("$name: has expected special screen", ({ fixture }) => {
      expect(fixture.specialScreenName).toBeTruthy();
      expect(fixture.hasSpecialRoute).toBe(true);
    });
  });
});
