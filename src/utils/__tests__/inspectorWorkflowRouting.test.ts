import { getPostSddgStartRoute, getPostMlDetectionRoute } from "../inspectorWorkflowRouting";

type InspectionLike = {
  verificationCopy?: { unIdNo?: string; packingInstruction?: string };
  extractedContent?: { unIdNo?: string; packingInstruction?: string };
  quantityType?: "standard" | "limited" | "excepted";
};

const baseInspection = (overrides: InspectionLike = {}): InspectionLike => ({
  verificationCopy: { unIdNo: "UN0000", packingInstruction: "A1.1" },
  extractedContent: {},
  quantityType: "standard",
  ...overrides,
});

test("special materials route after SDDG and skip POP after ML", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN2807", packingInstruction: "A1.1" },
  });
  expect(getPostSddgStartRoute(inspection).screen).toBe(
    "InspectorMagnetizedMaterialsScreen"
  );
  expect(getPostMlDetectionRoute(inspection).screen).toBe(
    "InspectorMarkingsLabelsValidationScreen"
  );
});

test("general materials route to POP after ML", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "A5.24" },
  });
  expect(getPostMlDetectionRoute(inspection).screen).toBe(
    "InspectorPOPMarkingDataEntry"
  );
});
