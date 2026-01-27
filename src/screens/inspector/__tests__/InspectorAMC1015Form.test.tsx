import React from "react";
import { Alert, Text } from "react-native";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import { InspectorAMC1015Form } from "../InspectorAMC1015Form";

const mockFinalizeInspection = jest.fn().mockResolvedValue({ success: true });
const mockSetCurrentChevron = jest.fn();

jest.mock("@/contexts/InspectionFormProvider", () => ({
  useInspectionForm: () => ({
    inspection: {
      frustrations: [],
      packageFrustrations: [],
      resolvedFrustrations: [],
      resolvedPackageFrustrations: [],
      verificationCopy: null,
      inspector: "I",
    },
    finalizeInspection: mockFinalizeInspection,
  }),
}));

jest.mock("@/stores/useHazProStore", () => ({
  useHazProActions: () => ({
    setCurrentChevron: mockSetCurrentChevron,
  }),
}));

jest.mock("@/utils/sddgToForm1015Mapping", () => ({
  mapFrustrationsToForm1015WithResolved: () => ({
    currentlyFrustrated: new Set<string>(),
    resolved: new Set<string>(),
  }),
  getForm1015FrustrationDescription: () => null,
  PACKAGE_TO_FORM1015_MAPPING: {},
}));

jest.mock("@/components/Inspector/Form1015CheckboxWithStatus", () => ({
  Form1015CheckBoxWithStatus: () => null,
}));

jest.mock("@/components/ui", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    ActionFooter: ({
      buttons,
    }: {
      buttons: Array<{ label: string; onPress: () => void }>;
    }) => (
      <>
        {buttons.map(button => (
          <Text key={button.label} onPress={button.onPress}>
            {button.label}
          </Text>
        ))}
      </>
    ),
    colors: { surface: "#fff", textPrimary: "#000" },
    spacing: {},
    borderRadius: {},
  };
});

jest.mock("@/hazardousMaterials/hazardousMaterialsA13List", () => ({
  hazardousMaterialsA13List: [],
}));

jest.mock("@/components/dev/DevBenchmarkButton", () => ({
  DevBenchmarkButton: () => null,
}));

jest.mock("expo-file-system", () => ({}));
jest.mock("expo-print", () => ({}));
jest.mock("expo-sharing", () => ({}));

jest.mock("@expo/vector-icons", () => ({
  MaterialIcons: "MaterialIcons",
}));

describe("InspectorAMC1015Form", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("resets navigation after completing inspection", async () => {
    const navigation = {
      reset: jest.fn(),
      navigate: jest.fn(),
      goBack: jest.fn(),
    };

    jest.spyOn(Alert, "alert").mockImplementation((_, __, buttons) => {
      const confirmButton = buttons?.[1];
      confirmButton?.onPress?.();
    });

    render(<InspectorAMC1015Form navigation={navigation} />);

    fireEvent.press(screen.getByText("Complete Inspection"));

    await waitFor(() => {
      expect(mockFinalizeInspection).toHaveBeenCalled();
      expect(navigation.reset).toHaveBeenCalled();
    });
  });
});
