import {
  getPostSddgStartRoute,
  getPostMlDetectionRoute,
  getSpecialAuthorizationGateDecision,
} from "../inspectorWorkflowRouting";

type InspectionLike = {
  verificationCopy?: { unIdNo?: string; packingInstruction?: string };
  extractedContent?: { unIdNo?: string; packingInstruction?: string };
  quantityType?: "standard" | "limited" | "excepted";
  specialAuthorizationAttested?: boolean;
  specialAuthorizationType?: "COE" | "CAA" | "DOT-SP" | null;
  specialAuthorizationReference?: string | null;
};

const baseInspection = (overrides: InspectionLike = {}): InspectionLike => ({
  verificationCopy: { unIdNo: "UN0000", packingInstruction: "A1.1" },
  extractedContent: {},
  quantityType: "standard",
  ...overrides,
});

test("general materials route to POP after ML", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "A5.24" },
  });
  expect(getPostMlDetectionRoute(inspection).screen).toBe(
    "InspectorPOPMarkingDataEntry"
  );
});

test("special materials route after SDDG and skip POP after ML (general path)", () => {
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

test("routes all special materials to their dedicated screens", () => {
  const specialCases: Array<[string, string]> = [
    ["NA2212", "InspectorAsbestosScreen"],
    ["UN2212", "InspectorAsbestosScreen"],
    ["UN2590", "InspectorAsbestosScreen"],
    ["UN3171", "InspectorBatteryPoweredVehicleScreen"],
    ["UN3373", "InspectorBiologicalSubstancesCategoryBScreen"],
    ["UN3508", "InspectorCapacitorsScreen"],
    ["ID8000", "InspectorConsumerCommodityScreen"],
    ["UN3363", "InspectorDangerousGoodsInApparatusScreen"],
    ["UN1845", "InspectorDryIceScreen"],
    ["UN3528", "InspectorEnginesInternalCombustionScreen"],
    ["UN3529", "InspectorEnginesInternalCombustionScreen"],
    ["UN3316", "InspectorFirstAidChemicalKitScreen"],
    ["UN3166", "InspectorFuelPoweredVehicleScreen"],
    ["UN2814", "InspectorInfectiousSubstancesScreen"],
    ["UN2900", "InspectorInfectiousSubstancesScreen"],
    ["UN3245", "InspectorInfectiousSubstancesScreen"],
    ["UN3072", "InspectorLifeSavingAppliancesScreen"],
    ["UN2990", "InspectorLifeSavingAppliancesScreen"],
    ["UN3480", "InspectorLithiumBatteriesScreen"],
    ["UN3090", "InspectorLithiumBatteriesScreen"],
    ["UN2807", "InspectorMagnetizedMaterialsScreen"],
    ["UN3548", "InspectorMiscDangerousGoodsArticlesScreen"],
    ["UN3268", "InspectorSafetyDevicesScreen"],
  ];

  specialCases.forEach(([unIdNo, expected]) => {
    const inspection = baseInspection({
      verificationCopy: { unIdNo, packingInstruction: "A1.1" },
    });
    expect(getPostSddgStartRoute(inspection).screen).toBe(expected);
    expect(getPostMlDetectionRoute(inspection).screen).toBe(
      "InspectorMarkingsLabelsValidationScreen"
    );
  });
});

test("routes lithium variants based on packing instruction", () => {
  const lithiumContained = baseInspection({
    verificationCopy: { unIdNo: "UN3481", packingInstruction: "A13.8" },
  });
  expect(getPostSddgStartRoute(lithiumContained).screen).toBe(
    "InspectorLithiumBatteriesContainedInEquipmentScreen"
  );

  const lithiumPacked = baseInspection({
    verificationCopy: { unIdNo: "UN3091", packingInstruction: "A13.9" },
  });
  expect(getPostSddgStartRoute(lithiumPacked).screen).toBe(
    "InspectorLithiumBatteriesPackedWithEquipmentScreen"
  );
});

test("special authorization inspections skip POP after ML", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "DOT-SP 12345" },
    specialAuthorizationAttested: true,
  });
  expect(getPostMlDetectionRoute(inspection).screen).toBe(
    "InspectorMarkingsLabelsValidationScreen"
  );
});

test("special authorization gate routes invalid key17 to check when not attested", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "DOT-SP 12345" },
  });

  expect(getSpecialAuthorizationGateDecision(inspection)).toEqual({
    action: "go_to_special_authorization_check",
    packingInstruction: "DOT-SP 12345",
    shouldResetAuthorization: true,
  });
});

test("special authorization gate routes invalid key17 to ML when already attested for same reference", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "DOT-SP 12345" },
    specialAuthorizationAttested: true,
    specialAuthorizationType: "DOT-SP",
    specialAuthorizationReference: "DOT-SP 12345",
  });

  expect(getSpecialAuthorizationGateDecision(inspection)).toEqual({
    action: "go_to_ml_detection",
    packingInstruction: "DOT-SP 12345",
    shouldResetAuthorization: false,
  });
});

test("special authorization gate clears stale special auth state when key17 is valid AFMAN", () => {
  const inspection = baseInspection({
    verificationCopy: { unIdNo: "UN0106", packingInstruction: "A5.24" },
    specialAuthorizationAttested: true,
    specialAuthorizationType: "CAA",
    specialAuthorizationReference: "CAA-123",
  });

  expect(getSpecialAuthorizationGateDecision(inspection)).toEqual({
    action: "continue",
    packingInstruction: "A5.24",
    shouldResetAuthorization: true,
  });
});
