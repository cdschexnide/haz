/**
 * Unit tests for hazProActions
 *
 * Tests all exported action functions and their state mutations on the
 * Valtio proxy store (hazProStore).
 */

// ---- mocks (must be declared before imports) ----

jest.mock("../../../src/services/shipment/ShipmentDatabase", () => ({
  __esModule: true,
  default: {
    saveShipment: jest.fn().mockResolvedValue(undefined),
    loadShipment: jest.fn().mockResolvedValue(null),
    deleteShipment: jest.fn().mockResolvedValue(undefined),
    listShipments: jest.fn().mockResolvedValue({}),
  },
}));

jest.mock("../../../src/services/shipment/DatabaseInitializer", () => ({
  __esModule: true,
  default: {
    initializeWithMockData: jest.fn().mockResolvedValue(undefined),
    clearAndReinitialize: jest.fn().mockResolvedValue(undefined),
  },
}));

jest.mock("../../../src/services/shipment/ErrorHandlingService", () => ({
  __esModule: true,
  default: {
    logError: jest.fn().mockResolvedValue(undefined),
    attemptRecovery: jest.fn().mockResolvedValue(false),
  },
}));

jest.mock("../../../src/services/inspection/InspectorShipmentDatabase", () => ({
  __esModule: true,
  default: {
    initializeWithMockData: jest.fn().mockResolvedValue(undefined),
    saveInspection: jest.fn().mockResolvedValue(undefined),
    loadInspection: jest.fn().mockResolvedValue(null),
    deleteInspection: jest.fn().mockResolvedValue(undefined),
    listInspections: jest.fn().mockResolvedValue([]),
    getStats: jest.fn().mockResolvedValue({
      totalInspections: 5,
      completedInspections: 3,
      frustratedInspections: 2,
    }),
  },
}));

jest.mock("../../../src/data/mockInspectorShipments", () => ({
  mockInspectorShipments: [],
}));

jest.mock("../../../src/utils/performanceUtils", () => ({
  storeUpdateTracker: { recordUpdate: jest.fn() },
  PERFORMANCE_TRACKING_ENABLED: false,
}));

jest.mock("../../../src/utils/markingRequirements", () => ({
  evaluateMarkingRequirements: jest.fn().mockReturnValue([
    { label: "UN Number", afmanRef: "1.2.3" },
    { label: "PSN", afmanRef: "1.2.4" },
  ]),
}));

jest.mock("../../../src/utils/labelingRequirements", () => ({
  evaluateLabelingRequirements: jest.fn().mockReturnValue([
    { label: "Class 3", afmanRef: "2.3.4" },
  ]),
}));

// ---- imports ----

import { hazProStore } from "../hazProStore";
import { hazProActions } from "../hazProActions";
import { initialHazProPreparerContext } from "../../../src/contexts/HazProPreparerProvider/reducer";
import {
  initialWorkflowState,
  initialInspectionContext,
} from "../../../src/contexts/InspectionFormProvider/types";
import ShipmentDatabase from "../../../src/services/shipment/ShipmentDatabase";
import DatabaseInitializer from "../../../src/services/shipment/DatabaseInitializer";
import ErrorHandlingService from "../../../src/services/shipment/ErrorHandlingService";
import InspectorShipmentDatabase from "../../../src/services/inspection/InspectorShipmentDatabase";

// ---- helpers ----

/** Reset the whole store to its initial shape before each test */
function resetStore() {
  hazProStore.hazProPreparerContext = JSON.parse(
    JSON.stringify(initialHazProPreparerContext)
  );
  hazProStore.shipmentsIndex = {};
  hazProStore.isLoadingShipments = false;
  hazProStore.loadingShipmentId = undefined;
  hazProStore.loadingInspectionId = undefined;
  hazProStore.databaseError = null;
  hazProStore.sddgWorkflow = JSON.parse(
    JSON.stringify(initialWorkflowState)
  );
  hazProStore.sddgInspectionContext = JSON.parse(
    JSON.stringify(initialInspectionContext)
  );
  (hazProStore as any).isLoadingInspectorShipments = false;
  (hazProStore as any).inspectorShipmentsIndex = {};
  (hazProStore as any).currentInspectionShipment = null;
}

beforeEach(() => {
  resetStore();
  jest.clearAllMocks();
});

// =============================================================================
// Field update actions
// =============================================================================

describe("hazProActions", () => {
  // ---------------------------------------------------------------------------
  // updateHazardousMaterial
  // ---------------------------------------------------------------------------
  describe("updateHazardousMaterial", () => {
    it("sets hazardousMaterial on context", () => {
      const material = { unid: "UN1234", psn: "Flammable liquid" } as any;
      hazProActions.updateHazardousMaterial(material);
      expect(hazProStore.hazProPreparerContext.hazardousMaterial).toEqual(material);
    });

    it("sets hazardousMaterial to null", () => {
      hazProStore.hazProPreparerContext.hazardousMaterial = { unid: "UN0000" } as any;
      hazProActions.updateHazardousMaterial(null);
      expect(hazProStore.hazProPreparerContext.hazardousMaterial).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // updatePackaging
  // ---------------------------------------------------------------------------
  describe("updatePackaging", () => {
    it("merges partial updates into packaging", () => {
      hazProActions.updatePackaging({ packagingType: "Single" });
      expect(hazProStore.hazProPreparerContext.packaging.packagingType).toBe("Single");
    });

    it("does nothing when packaging is falsy", () => {
      (hazProStore.hazProPreparerContext as any).packaging = null;
      // should not throw
      hazProActions.updatePackaging({ packagingType: "Combination" });
    });
  });

  // ---------------------------------------------------------------------------
  // updatePOPMarking
  // ---------------------------------------------------------------------------
  describe("updatePOPMarking", () => {
    it("updates a specific POP marking field", () => {
      // Ensure inputPOPMarking exists
      hazProStore.hazProPreparerContext.packaging.inputPOPMarking = {
        A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null,
      };
      hazProActions.updatePOPMarking("A", "4G");
      expect(
        hazProStore.hazProPreparerContext.packaging.inputPOPMarking!.A
      ).toBe("4G");
    });

    it("does nothing if packaging or inputPOPMarking is undefined", () => {
      (hazProStore.hazProPreparerContext as any).packaging = null;
      expect(() => hazProActions.updatePOPMarking("A", "4G")).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // updateShipment / updateShipper / updateConsignee
  // ---------------------------------------------------------------------------
  describe("updateShipment", () => {
    it("merges updates into shipment", () => {
      hazProActions.updateShipment({ tcn: "NEW-TCN-123" });
      expect(hazProStore.hazProPreparerContext.shipment!.tcn).toBe("NEW-TCN-123");
    });

    it("does nothing when shipment is null", () => {
      (hazProStore.hazProPreparerContext as any).shipment = null;
      expect(() => hazProActions.updateShipment({ tcn: "X" })).not.toThrow();
    });
  });

  describe("updateShipper", () => {
    it("merges updates into shipper", () => {
      hazProStore.hazProPreparerContext.shipper = { name: "Old" } as any;
      hazProActions.updateShipper({ name: "New Shipper" } as any);
      expect((hazProStore.hazProPreparerContext.shipper as any).name).toBe("New Shipper");
    });

    it("does nothing when shipper is null", () => {
      (hazProStore.hazProPreparerContext as any).shipper = null;
      expect(() => hazProActions.updateShipper({} as any)).not.toThrow();
    });
  });

  describe("updateConsignee", () => {
    it("merges updates into consignee", () => {
      hazProStore.hazProPreparerContext.consignee = { city: "Old" } as any;
      hazProActions.updateConsignee({ city: "New City" } as any);
      expect((hazProStore.hazProPreparerContext.consignee as any).city).toBe("New City");
    });

    it("does nothing when consignee is null", () => {
      (hazProStore.hazProPreparerContext as any).consignee = null;
      expect(() => hazProActions.updateConsignee({} as any)).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // updatePreparer
  // ---------------------------------------------------------------------------
  describe("updatePreparer", () => {
    it("merges into existing preparer", () => {
      hazProActions.updatePreparer({ preparerName: "Jane Doe" });
      expect(hazProStore.hazProPreparerContext.preparer!.preparerName).toBe("Jane Doe");
    });

    it("creates preparer object if it is null and applies updates", () => {
      (hazProStore.hazProPreparerContext as any).preparer = null;
      hazProActions.updatePreparer({ preparerName: "New Preparer" });
      expect(hazProStore.hazProPreparerContext.preparer!.preparerName).toBe("New Preparer");
      // default fields should be null
      expect(hazProStore.hazProPreparerContext.preparer!.preparerRank).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // updateNestedPackagingField
  // ---------------------------------------------------------------------------
  describe("updateNestedPackagingField", () => {
    it("sets a nested field on packaging", () => {
      hazProStore.hazProPreparerContext.packaging.inputPOPMarking = {
        A: null, B: null, C: null, D: null, E: null, F: null, G: null, H: null,
      };
      hazProActions.updateNestedPackagingField("inputPOPMarking", "B", "1A1");
      expect(
        hazProStore.hazProPreparerContext.packaging.inputPOPMarking!.B
      ).toBe("1A1");
    });

    it("does nothing when packaging is null", () => {
      (hazProStore.hazProPreparerContext as any).packaging = null;
      expect(() =>
        hazProActions.updateNestedPackagingField("inputPOPMarking" as any, "B" as any, "X")
      ).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // Step management
  // ---------------------------------------------------------------------------
  describe("step management", () => {
    it("setActiveStep sets activeStep", () => {
      hazProActions.setActiveStep(3);
      expect(hazProStore.hazProPreparerContext.activeStep).toBe(3);
    });

    it("setActiveStep allows null", () => {
      hazProActions.setActiveStep(null);
      expect(hazProStore.hazProPreparerContext.activeStep).toBeNull();
    });

    it("setActiveSubstep sets activeSubstep", () => {
      hazProActions.setActiveSubstep(2);
      expect(hazProStore.hazProPreparerContext.activeSubstep).toBe(2);
    });

    it("completeSubstep adds a substep once", () => {
      hazProActions.completeSubstep("step-a");
      hazProActions.completeSubstep("step-a"); // duplicate
      hazProActions.completeSubstep("step-b");
      expect(hazProStore.hazProPreparerContext.completedSubsteps).toEqual([
        "step-a",
        "step-b",
      ]);
    });
  });

  // ---------------------------------------------------------------------------
  // Excepted / Limited Quantities
  // ---------------------------------------------------------------------------
  describe("excepted and limited quantities", () => {
    it("updateExceptedQuantityData creates data if none exists", () => {
      hazProStore.hazProPreparerContext.exceptedQuantityData = undefined;
      hazProActions.updateExceptedQuantityData({ maxNetQuantityPerInnerPackaging: "30 ml" } as any);
      expect(
        (hazProStore.hazProPreparerContext.exceptedQuantityData as any)
          .maxNetQuantityPerInnerPackaging
      ).toBe("30 ml");
    });

    it("updateExceptedQuantityData merges into existing data", () => {
      hazProStore.hazProPreparerContext.exceptedQuantityData = {
        maxNetQuantityPerInnerPackaging: "30 ml",
      } as any;
      hazProActions.updateExceptedQuantityData({ outerPackagingType: "4G" } as any);
      expect(
        (hazProStore.hazProPreparerContext.exceptedQuantityData as any)
          .outerPackagingType
      ).toBe("4G");
      expect(
        (hazProStore.hazProPreparerContext.exceptedQuantityData as any)
          .maxNetQuantityPerInnerPackaging
      ).toBe("30 ml");
    });

    it("clearExceptedQuantityData sets to undefined", () => {
      hazProStore.hazProPreparerContext.exceptedQuantityData = { x: 1 } as any;
      hazProActions.clearExceptedQuantityData();
      expect(hazProStore.hazProPreparerContext.exceptedQuantityData).toBeUndefined();
    });

    it("updateLimitedQuantityData creates data if none exists", () => {
      hazProStore.hazProPreparerContext.limitedQuantityData = undefined;
      hazProActions.updateLimitedQuantityData({ maxNetQuantity: "1 L" } as any);
      expect(
        (hazProStore.hazProPreparerContext.limitedQuantityData as any).maxNetQuantity
      ).toBe("1 L");
    });

    it("updateLimitedQuantityData merges into existing data", () => {
      hazProStore.hazProPreparerContext.limitedQuantityData = { maxNetQuantity: "1 L" } as any;
      hazProActions.updateLimitedQuantityData({ innerPackagingType: "glass" } as any);
      expect(
        (hazProStore.hazProPreparerContext.limitedQuantityData as any).innerPackagingType
      ).toBe("glass");
    });

    it("clearLimitedQuantityData sets to undefined", () => {
      hazProStore.hazProPreparerContext.limitedQuantityData = { y: 2 } as any;
      hazProActions.clearLimitedQuantityData();
      expect(hazProStore.hazProPreparerContext.limitedQuantityData).toBeUndefined();
    });

    it("setIsExceptedQuantity(true) sets flag without clearing data", () => {
      hazProStore.hazProPreparerContext.exceptedQuantityData = { x: 1 } as any;
      hazProActions.setIsExceptedQuantity(true);
      expect(hazProStore.hazProPreparerContext.isExceptedQuantity).toBe(true);
      expect(hazProStore.hazProPreparerContext.exceptedQuantityData).toBeDefined();
    });

    it("setIsExceptedQuantity(false) clears excepted data", () => {
      hazProStore.hazProPreparerContext.exceptedQuantityData = { x: 1 } as any;
      hazProActions.setIsExceptedQuantity(false);
      expect(hazProStore.hazProPreparerContext.isExceptedQuantity).toBe(false);
      expect(hazProStore.hazProPreparerContext.exceptedQuantityData).toBeUndefined();
    });

    it("setIsLimitedQuantity(true) sets flag without clearing data", () => {
      hazProStore.hazProPreparerContext.limitedQuantityData = { y: 2 } as any;
      hazProActions.setIsLimitedQuantity(true);
      expect(hazProStore.hazProPreparerContext.isLimitedQuantity).toBe(true);
      expect(hazProStore.hazProPreparerContext.limitedQuantityData).toBeDefined();
    });

    it("setIsLimitedQuantity(false) clears limited data", () => {
      hazProStore.hazProPreparerContext.limitedQuantityData = { y: 2 } as any;
      hazProActions.setIsLimitedQuantity(false);
      expect(hazProStore.hazProPreparerContext.isLimitedQuantity).toBe(false);
      expect(hazProStore.hazProPreparerContext.limitedQuantityData).toBeUndefined();
    });

    it("clearExceptedLimitedQuantityData resets both flags and data", () => {
      hazProStore.hazProPreparerContext.isExceptedQuantity = true;
      hazProStore.hazProPreparerContext.isLimitedQuantity = true;
      hazProStore.hazProPreparerContext.exceptedQuantityData = { x: 1 } as any;
      hazProStore.hazProPreparerContext.limitedQuantityData = { y: 2 } as any;

      hazProActions.clearExceptedLimitedQuantityData();

      expect(hazProStore.hazProPreparerContext.isExceptedQuantity).toBe(false);
      expect(hazProStore.hazProPreparerContext.isLimitedQuantity).toBe(false);
      expect(hazProStore.hazProPreparerContext.exceptedQuantityData).toBeUndefined();
      expect(hazProStore.hazProPreparerContext.limitedQuantityData).toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Database operations (async)
  // ---------------------------------------------------------------------------
  describe("initializeDatabase", () => {
    it("initializes and refreshes index on success", async () => {
      await hazProActions.initializeDatabase();
      expect(DatabaseInitializer.initializeWithMockData).toHaveBeenCalled();
      expect(hazProStore.isLoadingShipments).toBe(false);
      expect(hazProStore.databaseError).toBeNull();
    });

    it("sets databaseError and rethrows on failure", async () => {
      (DatabaseInitializer.initializeWithMockData as jest.Mock).mockRejectedValueOnce(
        new Error("init failed")
      );
      await expect(hazProActions.initializeDatabase()).rejects.toThrow("init failed");
      expect(hazProStore.databaseError).toBe("init failed");
      expect(hazProStore.isLoadingShipments).toBe(false);
    });

    it("uses generic message for non-Error throws", async () => {
      (DatabaseInitializer.initializeWithMockData as jest.Mock).mockRejectedValueOnce(
        "raw string"
      );
      await expect(hazProActions.initializeDatabase()).rejects.toBe("raw string");
      expect(hazProStore.databaseError).toBe("Failed to initialize database");
    });
  });

  describe("clearAndReinitializeDatabase", () => {
    it("clears and reinitializes on success", async () => {
      await hazProActions.clearAndReinitializeDatabase();
      expect(DatabaseInitializer.clearAndReinitialize).toHaveBeenCalled();
      expect(hazProStore.isLoadingShipments).toBe(false);
    });

    it("sets databaseError and rethrows on failure", async () => {
      (DatabaseInitializer.clearAndReinitialize as jest.Mock).mockRejectedValueOnce(
        new Error("reinit failed")
      );
      await expect(hazProActions.clearAndReinitializeDatabase()).rejects.toThrow(
        "reinit failed"
      );
      expect(hazProStore.databaseError).toBe("reinit failed");
      expect(hazProStore.isLoadingShipments).toBe(false);
    });
  });

  describe("saveCurrentShipment", () => {
    it("saves with 'in-progress' status", async () => {
      await hazProActions.saveCurrentShipment("in-progress", "ship-1");
      expect(ShipmentDatabase.saveShipment).toHaveBeenCalledWith(
        expect.objectContaining({ id: "ship-1", status: "in-progress" })
      );
      expect(hazProStore.isLoadingShipments).toBe(false);
    });

    it("resets context when status is 'completed'", async () => {
      hazProStore.hazProPreparerContext.hazardousMaterial = { unid: "UN9999" } as any;
      await hazProActions.saveCurrentShipment("completed", "ship-2");
      // resetContext replaces with initialHazProPreparerContext
      expect(hazProStore.hazProPreparerContext.hazardousMaterial).toBeNull();
    });

    it("does not reset context when status is 'in-progress'", async () => {
      hazProStore.hazProPreparerContext.hazardousMaterial = { unid: "UN9999" } as any;
      await hazProActions.saveCurrentShipment("in-progress", "ship-3");
      expect(hazProStore.hazProPreparerContext.hazardousMaterial).not.toBeNull();
    });

    it("generates id from Date.now when id is not provided", async () => {
      jest.spyOn(Date, "now").mockReturnValue(1234567890);
      await hazProActions.saveCurrentShipment("in-progress");
      expect(ShipmentDatabase.saveShipment).toHaveBeenCalledWith(
        expect.objectContaining({ id: "1234567890" })
      );
      jest.restoreAllMocks();
    });

    it("attempts recovery on error and rethrows if recovery fails", async () => {
      (ShipmentDatabase.saveShipment as jest.Mock).mockRejectedValueOnce(
        new Error("save failed")
      );
      await expect(hazProActions.saveCurrentShipment("in-progress")).rejects.toThrow(
        "save failed"
      );
      expect(ErrorHandlingService.attemptRecovery).toHaveBeenCalled();
      expect(hazProStore.databaseError).toBe("save failed");
    });

    it("does not rethrow if recovery succeeds", async () => {
      (ShipmentDatabase.saveShipment as jest.Mock).mockRejectedValueOnce(
        new Error("save failed")
      );
      (ErrorHandlingService.attemptRecovery as jest.Mock).mockResolvedValueOnce(true);
      // should not throw
      await hazProActions.saveCurrentShipment("in-progress");
      expect(hazProStore.isLoadingShipments).toBe(false);
    });
  });

  describe("loadShipment", () => {
    it("loads shipment into context", async () => {
      const fakeShipment = {
        hazProPreparerContext: {
          ...initialHazProPreparerContext,
          hazardousMaterial: { unid: "UN1234" },
        },
      };
      (ShipmentDatabase.loadShipment as jest.Mock).mockResolvedValueOnce(fakeShipment);

      await hazProActions.loadShipment("abc-123");

      expect(hazProStore.hazProPreparerContext.currentShipmentId).toBe("abc-123");
      expect(
        (hazProStore.hazProPreparerContext.hazardousMaterial as any).unid
      ).toBe("UN1234");
      expect(hazProStore.isLoadingShipments).toBe(false);
      expect(hazProStore.loadingShipmentId).toBeUndefined();
    });

    it("sets databaseError when shipment not found", async () => {
      (ShipmentDatabase.loadShipment as jest.Mock).mockResolvedValueOnce(null);
      await hazProActions.loadShipment("missing-id");
      expect(hazProStore.databaseError).toBe("Shipment missing-id not found");
    });

    it("sets databaseError on exception", async () => {
      (ShipmentDatabase.loadShipment as jest.Mock).mockRejectedValueOnce(
        new Error("db error")
      );
      await hazProActions.loadShipment("err-id");
      expect(hazProStore.databaseError).toBe("db error");
      expect(hazProStore.isLoadingShipments).toBe(false);
    });
  });

  describe("deleteShipment", () => {
    it("deletes and refreshes index", async () => {
      await hazProActions.deleteShipment("del-1");
      expect(ShipmentDatabase.deleteShipment).toHaveBeenCalledWith("del-1");
      expect(hazProStore.isLoadingShipments).toBe(false);
    });

    it("sets databaseError on failure", async () => {
      (ShipmentDatabase.deleteShipment as jest.Mock).mockRejectedValueOnce(
        new Error("delete failed")
      );
      await hazProActions.deleteShipment("del-2");
      expect(hazProStore.databaseError).toBe("delete failed");
    });
  });

  describe("refreshShipmentsIndex", () => {
    it("populates shipmentsIndex", async () => {
      const index = { s1: { id: "s1" }, s2: { id: "s2" } };
      (ShipmentDatabase.listShipments as jest.Mock).mockResolvedValueOnce(index);
      await hazProActions.refreshShipmentsIndex();
      expect(hazProStore.shipmentsIndex).toEqual(index);
    });

    it("does not throw on error (logs to console)", async () => {
      (ShipmentDatabase.listShipments as jest.Mock).mockRejectedValueOnce(
        new Error("list fail")
      );
      await expect(hazProActions.refreshShipmentsIndex()).resolves.toBeUndefined();
    });
  });

  // ---------------------------------------------------------------------------
  // Context management
  // ---------------------------------------------------------------------------
  describe("resetContext", () => {
    it("replaces context with initialHazProPreparerContext", () => {
      hazProStore.hazProPreparerContext.hazardousMaterial = { unid: "UN0000" } as any;
      hazProActions.resetContext();
      expect(hazProStore.hazProPreparerContext.hazardousMaterial).toBeNull();
    });
  });

  describe("clearDatabaseError", () => {
    it("clears the databaseError", () => {
      hazProStore.databaseError = "some error";
      hazProActions.clearDatabaseError();
      expect(hazProStore.databaseError).toBeNull();
    });
  });

  describe("batchUpdate", () => {
    it("executes the callback immediately", () => {
      const fn = jest.fn();
      hazProActions.batchUpdate(fn);
      expect(fn).toHaveBeenCalledTimes(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Complex state updates
  // ---------------------------------------------------------------------------
  describe("updateLithiumBatteryData", () => {
    it("creates lithiumBatteryData if none exists", () => {
      (hazProStore.hazProPreparerContext as any).lithiumBatteryData = null;
      hazProActions.updateLithiumBatteryData({ batteryType: "ion" } as any);
      expect(
        (hazProStore.hazProPreparerContext.lithiumBatteryData as any).batteryType
      ).toBe("ion");
    });

    it("merges into existing lithiumBatteryData", () => {
      hazProStore.hazProPreparerContext.lithiumBatteryData = {
        batteryType: "ion",
      } as any;
      hazProActions.updateLithiumBatteryData({ wattHours: 100 } as any);
      expect(
        (hazProStore.hazProPreparerContext.lithiumBatteryData as any).wattHours
      ).toBe(100);
      expect(
        (hazProStore.hazProPreparerContext.lithiumBatteryData as any).batteryType
      ).toBe("ion");
    });
  });

  describe("updateUN3166Details", () => {
    it("merges into un3166Details", () => {
      hazProActions.updateUN3166Details({ vehicleNomenclature: "HMMWV" });
      expect(
        hazProStore.hazProPreparerContext.un3166Details.vehicleNomenclature
      ).toBe("HMMWV");
    });
  });

  // ---------------------------------------------------------------------------
  // Markings and Labels
  // ---------------------------------------------------------------------------
  describe("updateRequiredMarkingsAndLabels", () => {
    it("computes and stores structured arrays plus legacy records", () => {
      hazProActions.updateRequiredMarkingsAndLabels();

      // Structured arrays
      expect(hazProStore.hazProPreparerContext.requiredMarkingsArray).toEqual([
        { label: "UN Number", afmanRef: "1.2.3" },
        { label: "PSN", afmanRef: "1.2.4" },
      ]);
      expect(hazProStore.hazProPreparerContext.requiredLabelsArray).toEqual([
        { label: "Class 3", afmanRef: "2.3.4" },
      ]);

      // Legacy record format
      expect(hazProStore.hazProPreparerContext.requiredMarkings).toEqual({
        "UN Number": "UN Number",
        PSN: "PSN",
      });
      expect(hazProStore.hazProPreparerContext.requiredLabels).toEqual({
        "Class 3": "Class 3",
      });
    });
  });

  // ---------------------------------------------------------------------------
  // Additional handling info
  // ---------------------------------------------------------------------------
  describe("updateAccessorialHazmat", () => {
    it("sets accessorialHazmat array", () => {
      const hazmat = [{ name: "batteries" }] as any;
      hazProActions.updateAccessorialHazmat(hazmat);
      expect(
        hazProStore.hazProPreparerContext.additionalHandlingInfo.accessorialHazmat
      ).toEqual(hazmat);
    });
  });

  describe("addNote / removeNote", () => {
    it("addNote appends a note", () => {
      hazProActions.addNote("First note");
      hazProActions.addNote("Second note");
      expect(
        hazProStore.hazProPreparerContext.additionalHandlingInfo.notes
      ).toEqual(["First note", "Second note"]);
    });

    it("removeNote removes by index", () => {
      hazProStore.hazProPreparerContext.additionalHandlingInfo.notes = [
        "A", "B", "C",
      ];
      hazProActions.removeNote(1);
      expect(
        hazProStore.hazProPreparerContext.additionalHandlingInfo.notes
      ).toEqual(["A", "C"]);
    });
  });

  // ---------------------------------------------------------------------------
  // Acknowledgements
  // ---------------------------------------------------------------------------
  describe("acknowledgement actions", () => {
    beforeEach(() => {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements = {
        generalPackagingRequirementsAcknowledged: false,
        informativeStatementsAcknowledged: false,
        workflowModifiersAcknowledged: false,
        specialProvisionsAcknowledged: false,
        documentNodeInformativeStatements: [],
        documentNodeWorkflowModifiers: [],
        specialProvisionsInformativeStatements: {} as any,
        specialProvisionsWorkflowModifiers: {} as any,
      };
    });

    it("acknowledgeGeneralPackagingRequirements", () => {
      hazProActions.acknowledgeGeneralPackagingRequirements();
      expect(
        hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements!
          .generalPackagingRequirementsAcknowledged
      ).toBe(true);
    });

    it("acknowledgeInformativeStatements", () => {
      hazProActions.acknowledgeInformativeStatements();
      expect(
        hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements!
          .informativeStatementsAcknowledged
      ).toBe(true);
    });

    it("acknowledgeWorkflowModifiers", () => {
      hazProActions.acknowledgeWorkflowModifiers();
      expect(
        hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements!
          .workflowModifiersAcknowledged
      ).toBe(true);
    });

    it("acknowledgeSpecialProvisions", () => {
      hazProActions.acknowledgeSpecialProvisions();
      expect(
        hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements!
          .specialProvisionsAcknowledged
      ).toBe(true);
    });

    it("does nothing when modifiersAndRequiredAcknowledgements is null", () => {
      hazProStore.hazProPreparerContext.modifiersAndRequiredAcknowledgements = null;
      expect(() => hazProActions.acknowledgeGeneralPackagingRequirements()).not.toThrow();
      expect(() => hazProActions.acknowledgeInformativeStatements()).not.toThrow();
      expect(() => hazProActions.acknowledgeWorkflowModifiers()).not.toThrow();
      expect(() => hazProActions.acknowledgeSpecialProvisions()).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // SDDG Inspection Context
  // ---------------------------------------------------------------------------
  describe("setExtractedSDDGContent", () => {
    const content = {
      shipper: "ACME",
      consignee: "CORP",
      unIdNo: "UN1234",
      properShippingName: "Flammable liquid",
    } as any;

    it("sets extractedContent and creates verificationCopy", () => {
      hazProActions.setExtractedSDDGContent(content, "file://image.png");
      expect(hazProStore.sddgInspectionContext.extractedContent).toEqual(content);
      expect(hazProStore.sddgInspectionContext.verificationCopy).toEqual(content);
      // verificationCopy should be a copy, not same reference
      expect(hazProStore.sddgInspectionContext.verificationCopy).not.toBe(content);
      expect(hazProStore.sddgInspectionContext.originalImageUri).toBe("file://image.png");
      expect(hazProStore.sddgInspectionContext.inspectionStartTime).toBeInstanceOf(Date);
      expect(hazProStore.sddgInspectionContext.inspectionCompleteTime).toBeNull();
    });

    it("preserves existing frustrations", () => {
      hazProStore.sddgInspectionContext.frustrations = [
        { key: "shipper", fieldLabel: "Shipper" } as any,
      ];
      hazProActions.setExtractedSDDGContent(content);
      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.frustrations[0].key).toBe("shipper");
    });

    it("starts with empty frustrations when there were none", () => {
      hazProStore.sddgInspectionContext.frustrations = [];
      hazProActions.setExtractedSDDGContent(content);
      expect(hazProStore.sddgInspectionContext.frustrations).toEqual([]);
    });

    it("defaults imageUri to empty string", () => {
      hazProActions.setExtractedSDDGContent(content);
      expect(hazProStore.sddgInspectionContext.originalImageUri).toBe("");
    });
  });

  describe("setVerificationCopy", () => {
    it("sets a copy of the content", () => {
      const content = { shipper: "ACME" } as any;
      hazProActions.setVerificationCopy(content);
      expect(hazProStore.sddgInspectionContext.verificationCopy).toEqual(content);
      expect(hazProStore.sddgInspectionContext.verificationCopy).not.toBe(content);
    });
  });

  describe("updateVerificationCopyField", () => {
    it("updates a single field on the verification copy", () => {
      hazProStore.sddgInspectionContext.verificationCopy = {
        shipper: "Old",
        consignee: "Corp",
      } as any;
      hazProActions.updateVerificationCopyField("shipper", "New Shipper");
      expect(hazProStore.sddgInspectionContext.verificationCopy!.shipper).toBe(
        "New Shipper"
      );
    });

    it("does nothing if verificationCopy is null", () => {
      hazProStore.sddgInspectionContext.verificationCopy = null;
      expect(() =>
        hazProActions.updateVerificationCopyField("shipper", "X")
      ).not.toThrow();
    });
  });

  // ---------------------------------------------------------------------------
  // Frustrations
  // ---------------------------------------------------------------------------
  describe("addFrustration", () => {
    it("adds a new frustration with date and inspector", () => {
      hazProStore.sddgInspectionContext.inspector = {
        inspectorName: "John",
        inspectorRank: null,
        inspectorTitle: "Inspector",
      };
      hazProActions.addFrustration({
        key: "shipper",
        fieldLabel: "Shipper",
        fieldValue: "Wrong",
        defaultMessage: "Incorrect shipper",
      } as any);

      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
      const f = hazProStore.sddgInspectionContext.frustrations[0];
      expect(f.key).toBe("shipper");
      expect(f.frustrationDate).toBeInstanceOf(Date);
      expect(f.inspector.inspectorName).toBe("John");
    });

    it("replaces existing frustration with same key", () => {
      hazProStore.sddgInspectionContext.frustrations = [
        { key: "shipper", fieldValue: "Old" } as any,
      ];
      hazProActions.addFrustration({
        key: "shipper",
        fieldLabel: "Shipper",
        fieldValue: "New",
        defaultMessage: "msg",
      } as any);
      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.frustrations[0].fieldValue).toBe("New");
    });
  });

  describe("removeFrustration", () => {
    it("removes frustration by key", () => {
      hazProStore.sddgInspectionContext.frustrations = [
        { key: "shipper" } as any,
        { key: "consignee" } as any,
      ];
      hazProActions.removeFrustration("shipper");
      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.frustrations[0].key).toBe("consignee");
    });
  });

  // ---------------------------------------------------------------------------
  // Package Frustrations
  // ---------------------------------------------------------------------------
  describe("addPackageFrustration", () => {
    it("adds with generated id, date, and inspector", () => {
      hazProActions.addPackageFrustration({
        category: "marking" as any,
        itemId: "m1",
        itemLabel: "UN Number",
        expectedValues: ["UN1234"],
        verificationStatus: "missing",
        defaultMessage: "Missing marking",
      } as any);

      expect(hazProStore.sddgInspectionContext.packageFrustrations).toHaveLength(1);
      const pf = hazProStore.sddgInspectionContext.packageFrustrations[0];
      expect(pf.id).toContain("marking-m1-");
      expect(pf.frustrationDate).toBeInstanceOf(Date);
    });

    it("replaces existing frustration with same itemId", () => {
      hazProStore.sddgInspectionContext.packageFrustrations = [
        { itemId: "m1", verificationStatus: "missing" } as any,
      ];
      hazProActions.addPackageFrustration({
        category: "marking" as any,
        itemId: "m1",
        itemLabel: "UN Number",
        expectedValues: ["UN5678"],
        verificationStatus: "incorrect",
        defaultMessage: "Wrong",
      } as any);
      expect(hazProStore.sddgInspectionContext.packageFrustrations).toHaveLength(1);
      expect(
        hazProStore.sddgInspectionContext.packageFrustrations[0].verificationStatus
      ).toBe("incorrect");
    });
  });

  describe("removePackageFrustration", () => {
    it("removes package frustration by itemId", () => {
      hazProStore.sddgInspectionContext.packageFrustrations = [
        { itemId: "m1" } as any,
        { itemId: "m2" } as any,
      ];
      hazProActions.removePackageFrustration("m1");
      expect(hazProStore.sddgInspectionContext.packageFrustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.packageFrustrations[0].itemId).toBe("m2");
    });
  });

  // ---------------------------------------------------------------------------
  // clearInspectionContext / resetSDDGWorkflowData
  // ---------------------------------------------------------------------------
  describe("clearInspectionContext", () => {
    it("resets inspection context but preserves inspector", () => {
      hazProStore.sddgInspectionContext.inspector = {
        inspectorName: "Jane",
        inspectorRank: "SGT",
        inspectorTitle: "QA",
      };
      hazProStore.sddgInspectionContext.frustrations = [{ key: "x" } as any];
      hazProActions.clearInspectionContext();

      expect(hazProStore.sddgInspectionContext.extractedContent).toBeNull();
      expect(hazProStore.sddgInspectionContext.frustrations).toEqual([]);
      expect(hazProStore.sddgInspectionContext.inspector.inspectorName).toBe("Jane");
    });
  });

  describe("resetSDDGWorkflowData", () => {
    it("resets inspection data and workflow state", () => {
      hazProStore.sddgInspectionContext.extractedContent = { shipper: "X" } as any;
      hazProStore.sddgWorkflow.currentChevron = "package";
      hazProStore.sddgWorkflow.sddgComplete = true;
      hazProStore.sddgWorkflow.completedSDDGSubsteps = ["a", "b"];

      hazProActions.resetSDDGWorkflowData();

      expect(hazProStore.sddgInspectionContext.extractedContent).toBeNull();
      expect(hazProStore.sddgInspectionContext.verificationCopy).toBeNull();
      expect(hazProStore.sddgInspectionContext.frustrations).toEqual([]);
      expect(hazProStore.sddgWorkflow.currentChevron).toBe("sddg");
      expect(hazProStore.sddgWorkflow.currentSDDGStep).toBe("upload");
      expect(hazProStore.sddgWorkflow.currentSDDGScreen).toBe("SDDGUploadAndParse");
      expect(hazProStore.sddgWorkflow.completedSDDGSubsteps).toEqual([]);
      expect(hazProStore.sddgWorkflow.sddgComplete).toBe(false);
      expect(hazProStore.sddgWorkflow.packageComplete).toBe(false);
    });
  });

  describe("completeInspection", () => {
    it("sets inspectionCompleteTime to current date", () => {
      hazProActions.completeInspection();
      expect(hazProStore.sddgInspectionContext.inspectionCompleteTime).toBeInstanceOf(Date);
    });
  });

  describe("setInspector", () => {
    it("sets the inspector on inspection context", () => {
      const inspector = {
        inspectorName: "Bob",
        inspectorRank: "CPT",
        inspectorTitle: "Lead Inspector",
      };
      hazProActions.setInspector(inspector);
      expect(hazProStore.sddgInspectionContext.inspector).toEqual(inspector);
    });
  });

  // ---------------------------------------------------------------------------
  // SDDG Workflow Actions
  // ---------------------------------------------------------------------------
  describe("SDDG workflow actions", () => {
    it("setCurrentChevron", () => {
      hazProActions.setCurrentChevron("package");
      expect(hazProStore.sddgWorkflow.currentChevron).toBe("package");
    });

    it("setCurrentSDDGStep", () => {
      hazProActions.setCurrentSDDGStep("verification");
      expect(hazProStore.sddgWorkflow.currentSDDGStep).toBe("verification");
    });

    it("setSDDGComplete", () => {
      hazProActions.setSDDGComplete(true);
      expect(hazProStore.sddgWorkflow.sddgComplete).toBe(true);
    });

    it("setPackageComplete", () => {
      hazProActions.setPackageComplete(true);
      expect(hazProStore.sddgWorkflow.packageComplete).toBe(true);
    });

    it("resetWorkflow resets to initial state with reinspection defaults", () => {
      hazProStore.sddgWorkflow.currentChevron = "complete";
      hazProStore.sddgWorkflow.sddgComplete = true;
      hazProActions.resetWorkflow();
      expect(hazProStore.sddgWorkflow.currentChevron).toBe("sddg");
      expect(hazProStore.sddgWorkflow.sddgComplete).toBe(false);
      expect(hazProStore.sddgWorkflow.reinspection.mode).toBeNull();
      expect(hazProStore.sddgWorkflow.reinspection.targetFrustrations).toEqual([]);
    });

    it("completeSDDGAndMoveToPackage", () => {
      hazProActions.completeSDDGAndMoveToPackage();
      expect(hazProStore.sddgWorkflow.sddgComplete).toBe(true);
      expect(hazProStore.sddgWorkflow.currentChevron).toBe("package");
    });
  });

  // ---------------------------------------------------------------------------
  // SDDG Substep Management
  // ---------------------------------------------------------------------------
  describe("SDDG substep management", () => {
    it("setCurrentSDDGScreen", () => {
      hazProActions.setCurrentSDDGScreen("SDDGVerification");
      expect(hazProStore.sddgWorkflow.currentSDDGScreen).toBe("SDDGVerification");
    });

    it("completeSDDGSubstep adds substep only once", () => {
      hazProActions.completeSDDGSubstep("upload");
      hazProActions.completeSDDGSubstep("upload");
      hazProActions.completeSDDGSubstep("verification");
      expect(hazProStore.sddgWorkflow.completedSDDGSubsteps).toEqual([
        "upload",
        "verification",
      ]);
    });

    it("resetSDDGSubsteps clears substeps and resets screen/step", () => {
      hazProStore.sddgWorkflow.completedSDDGSubsteps = ["a", "b"];
      hazProStore.sddgWorkflow.currentSDDGScreen = "SomeScreen";
      hazProStore.sddgWorkflow.currentSDDGStep = "compliance";
      hazProActions.resetSDDGSubsteps();
      expect(hazProStore.sddgWorkflow.completedSDDGSubsteps).toEqual([]);
      expect(hazProStore.sddgWorkflow.currentSDDGScreen).toBe("SDDGUploadAndParse");
      expect(hazProStore.sddgWorkflow.currentSDDGStep).toBe("upload");
    });
  });

  // ---------------------------------------------------------------------------
  // Magnetized Material Inspection
  // ---------------------------------------------------------------------------
  describe("magnetized material inspection", () => {
    it("setMagnetizedMaterialInspection sets data as copy", () => {
      const data = { fieldStrength: "2.5 mG" } as any;
      hazProActions.setMagnetizedMaterialInspection(data);
      expect(
        hazProStore.sddgInspectionContext.magnetizedMaterialInspection
      ).toEqual(data);
      expect(
        hazProStore.sddgInspectionContext.magnetizedMaterialInspection
      ).not.toBe(data);
    });

    it("updateMagnetizedMaterialInspectionField updates a field", () => {
      hazProStore.sddgInspectionContext.magnetizedMaterialInspection = {
        fieldStrength: "old",
      } as any;
      hazProActions.updateMagnetizedMaterialInspectionField(
        "fieldStrength" as any,
        "3.0 mG" as any
      );
      expect(
        (hazProStore.sddgInspectionContext.magnetizedMaterialInspection as any)
          .fieldStrength
      ).toBe("3.0 mG");
    });

    it("updateMagnetizedMaterialInspectionField does nothing if null", () => {
      hazProStore.sddgInspectionContext.magnetizedMaterialInspection = null;
      expect(() =>
        hazProActions.updateMagnetizedMaterialInspectionField(
          "fieldStrength" as any,
          "X" as any
        )
      ).not.toThrow();
    });

    it("clearMagnetizedMaterialInspection sets to null", () => {
      hazProStore.sddgInspectionContext.magnetizedMaterialInspection = { x: 1 } as any;
      hazProActions.clearMagnetizedMaterialInspection();
      expect(hazProStore.sddgInspectionContext.magnetizedMaterialInspection).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Reinspection
  // ---------------------------------------------------------------------------
  describe("reinspection actions", () => {
    it("startSDDGReinspection sets mode to sddg", () => {
      hazProActions.startSDDGReinspection(["shipper", "consignee"]);
      const r = hazProStore.sddgWorkflow.reinspection;
      expect(r.mode).toBe("sddg");
      expect(r.targetFrustrations).toEqual(["shipper", "consignee"]);
      expect(r.totalItems).toBe(2);
      expect(r.currentItemIndex).toBe(0);
      expect(r.sessionId).toContain("sddg-reinspection-");
    });

    it("startPackageReinspection sets mode to package", () => {
      hazProActions.startPackageReinspection(["m1", "m2", "l1"]);
      const r = hazProStore.sddgWorkflow.reinspection;
      expect(r.mode).toBe("package");
      expect(r.totalItems).toBe(3);
      expect(r.sessionId).toContain("package-reinspection-");
    });

    it("advanceReinspectionItem increments index", () => {
      hazProStore.sddgWorkflow.reinspection = {
        mode: "sddg",
        targetFrustrations: ["a", "b", "c"],
        sessionId: "s1",
        currentItemIndex: 0,
        totalItems: 3,
      };
      hazProActions.advanceReinspectionItem();
      expect(hazProStore.sddgWorkflow.reinspection.currentItemIndex).toBe(1);
    });

    it("advanceReinspectionItem does not go past last item", () => {
      hazProStore.sddgWorkflow.reinspection = {
        mode: "sddg",
        targetFrustrations: ["a", "b"],
        sessionId: "s1",
        currentItemIndex: 1,
        totalItems: 2,
      };
      hazProActions.advanceReinspectionItem();
      expect(hazProStore.sddgWorkflow.reinspection.currentItemIndex).toBe(1);
    });

    it("completeReinspection resets reinspection state", () => {
      hazProStore.sddgWorkflow.reinspection = {
        mode: "sddg",
        targetFrustrations: ["a"],
        sessionId: "s1",
        currentItemIndex: 0,
        totalItems: 1,
      };
      hazProActions.completeReinspection();
      expect(hazProStore.sddgWorkflow.reinspection.mode).toBeNull();
      expect(hazProStore.sddgWorkflow.reinspection.targetFrustrations).toEqual([]);
      expect(hazProStore.sddgWorkflow.reinspection.sessionId).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // updateFrustrationStatus
  // ---------------------------------------------------------------------------
  describe("updateFrustrationStatus", () => {
    it("removes sddg frustration when resolved", () => {
      hazProStore.sddgInspectionContext.frustrations = [
        { key: "shipper" } as any,
        { key: "consignee" } as any,
      ];
      hazProActions.updateFrustrationStatus("sddg", "shipper", "resolved");
      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.frustrations[0].key).toBe("consignee");
    });

    it("does not remove sddg frustration when confirmed", () => {
      hazProStore.sddgInspectionContext.frustrations = [
        { key: "shipper" } as any,
      ];
      hazProActions.updateFrustrationStatus("sddg", "shipper", "confirmed");
      expect(hazProStore.sddgInspectionContext.frustrations).toHaveLength(1);
    });

    it("removes package frustration when resolved", () => {
      hazProStore.sddgInspectionContext.packageFrustrations = [
        { itemId: "m1" } as any,
        { itemId: "m2" } as any,
      ];
      hazProActions.updateFrustrationStatus("package", "m1", "resolved");
      expect(hazProStore.sddgInspectionContext.packageFrustrations).toHaveLength(1);
      expect(hazProStore.sddgInspectionContext.packageFrustrations[0].itemId).toBe("m2");
    });

    it("does not remove package frustration when confirmed", () => {
      hazProStore.sddgInspectionContext.packageFrustrations = [
        { itemId: "m1" } as any,
      ];
      hazProActions.updateFrustrationStatus("package", "m1", "confirmed");
      expect(hazProStore.sddgInspectionContext.packageFrustrations).toHaveLength(1);
    });
  });

  // ---------------------------------------------------------------------------
  // Inspector Shipment Management (async)
  // ---------------------------------------------------------------------------
  describe("initializeInspectorDatabase", () => {
    it("initializes inspector database", async () => {
      await hazProActions.initializeInspectorDatabase();
      expect(InspectorShipmentDatabase.initializeWithMockData).toHaveBeenCalled();
      expect((hazProStore as any).isLoadingInspectorShipments).toBe(false);
    });

    it("sets error and rethrows on failure", async () => {
      (InspectorShipmentDatabase.initializeWithMockData as jest.Mock).mockRejectedValueOnce(
        new Error("init fail")
      );
      await expect(hazProActions.initializeInspectorDatabase()).rejects.toThrow("init fail");
      expect(hazProStore.databaseError).toBe("init fail");
    });
  });

  describe("saveCurrentInspection", () => {
    it("throws if no inspection data to save", async () => {
      hazProStore.sddgInspectionContext.extractedContent = null;
      hazProStore.sddgInspectionContext.verificationCopy = null;
      await expect(hazProActions.saveCurrentInspection()).rejects.toThrow(
        "No inspection data to save"
      );
    });

    it("saves inspection and clears current inspection on success", async () => {
      hazProStore.sddgInspectionContext.extractedContent = { shipper: "X" } as any;
      hazProStore.sddgInspectionContext.verificationCopy = {
        shippersReferenceNumber: "TCN1",
        unIdNo: "UN1234",
        properShippingName: "Test",
      } as any;
      hazProStore.sddgInspectionContext.frustrations = [];
      hazProStore.sddgInspectionContext.packageFrustrations = [];

      await hazProActions.saveCurrentInspection();

      expect(InspectorShipmentDatabase.saveInspection).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "completed",
          sddgStatus: "verified",
          packageStatus: "verified",
          totalFrustrations: 0,
        })
      );
    });

    it("saves as frustrated when there are frustrations", async () => {
      hazProStore.sddgInspectionContext.extractedContent = { shipper: "X" } as any;
      hazProStore.sddgInspectionContext.verificationCopy = {
        shippersReferenceNumber: "TCN2",
        unIdNo: "UN5678",
        properShippingName: "Test2",
      } as any;
      hazProStore.sddgInspectionContext.frustrations = [{ key: "a" } as any];
      hazProStore.sddgInspectionContext.packageFrustrations = [{ itemId: "b" } as any];

      await hazProActions.saveCurrentInspection();

      expect(InspectorShipmentDatabase.saveInspection).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "frustrated",
          sddgStatus: "frustrated",
          packageStatus: "frustrated",
          totalFrustrations: 2,
          sddgFrustrations: 1,
          packageFrustrations: 1,
        })
      );
    });
  });

  describe("loadInspectionShipment", () => {
    it("loads inspection into store", async () => {
      const inspection = {
        id: "insp-1",
        inspectionContext: {
          extractedContent: { shipper: "Loaded" },
          frustrations: [],
          packageFrustrations: [],
          inspector: { inspectorName: "X", inspectorRank: null, inspectorTitle: "Y" },
        },
      };
      (InspectorShipmentDatabase.loadInspection as jest.Mock).mockResolvedValueOnce(
        inspection
      );

      await hazProActions.loadInspectionShipment("insp-1");

      expect((hazProStore as any).currentInspectionShipment).toEqual(inspection);
      expect(hazProStore.sddgInspectionContext.extractedContent).toEqual({
        shipper: "Loaded",
      });
      expect((hazProStore as any).isLoadingInspectorShipments).toBe(false);
      expect((hazProStore as any).loadingInspectionId).toBeUndefined();
    });

    it("sets error when inspection not found", async () => {
      (InspectorShipmentDatabase.loadInspection as jest.Mock).mockResolvedValueOnce(null);
      await hazProActions.loadInspectionShipment("missing");
      expect(hazProStore.databaseError).toBe("Inspection missing not found");
    });

    it("sets error on exception", async () => {
      (InspectorShipmentDatabase.loadInspection as jest.Mock).mockRejectedValueOnce(
        new Error("load err")
      );
      await hazProActions.loadInspectionShipment("err-id");
      expect(hazProStore.databaseError).toBe("load err");
    });
  });

  describe("deleteInspectionShipment", () => {
    it("deletes and refreshes index", async () => {
      await hazProActions.deleteInspectionShipment("del-1");
      expect(InspectorShipmentDatabase.deleteInspection).toHaveBeenCalledWith("del-1");
    });

    it("clears current inspection if it was the deleted one", async () => {
      (hazProStore as any).currentInspectionShipment = { id: "del-1" };
      await hazProActions.deleteInspectionShipment("del-1");
      expect((hazProStore as any).currentInspectionShipment).toBeNull();
    });

    it("does not clear current inspection if different id", async () => {
      (hazProStore as any).currentInspectionShipment = { id: "other" };
      await hazProActions.deleteInspectionShipment("del-1");
      expect((hazProStore as any).currentInspectionShipment).toEqual({ id: "other" });
    });

    it("sets error on failure", async () => {
      (InspectorShipmentDatabase.deleteInspection as jest.Mock).mockRejectedValueOnce(
        new Error("del fail")
      );
      await hazProActions.deleteInspectionShipment("x");
      expect(hazProStore.databaseError).toBe("del fail");
    });
  });

  describe("refreshInspectorShipmentsIndex", () => {
    it("converts array to indexed object", async () => {
      (InspectorShipmentDatabase.listInspections as jest.Mock).mockResolvedValueOnce([
        { id: "a", status: "completed" },
        { id: "b", status: "frustrated" },
      ]);
      await hazProActions.refreshInspectorShipmentsIndex();
      expect((hazProStore as any).inspectorShipmentsIndex).toEqual({
        a: { id: "a", status: "completed" },
        b: { id: "b", status: "frustrated" },
      });
    });

    it("does not throw on error", async () => {
      (InspectorShipmentDatabase.listInspections as jest.Mock).mockRejectedValueOnce(
        new Error("list fail")
      );
      await expect(
        hazProActions.refreshInspectorShipmentsIndex()
      ).resolves.toBeUndefined();
    });
  });

  describe("clearCurrentInspection", () => {
    it("clears current inspection, inspection context, and resets workflow", () => {
      (hazProStore as any).currentInspectionShipment = { id: "x" };
      hazProStore.sddgInspectionContext.frustrations = [{ key: "a" } as any];
      hazProStore.sddgWorkflow.currentChevron = "complete";

      hazProActions.clearCurrentInspection();

      expect((hazProStore as any).currentInspectionShipment).toBeNull();
      expect(hazProStore.sddgInspectionContext.frustrations).toEqual([]);
      expect(hazProStore.sddgWorkflow.currentChevron).toBe("sddg");
    });
  });

  describe("startNewInspection", () => {
    it("delegates to clearCurrentInspection", () => {
      (hazProStore as any).currentInspectionShipment = { id: "old" };
      hazProActions.startNewInspection();
      expect((hazProStore as any).currentInspectionShipment).toBeNull();
    });
  });

  describe("completeInspectionWithFrustration", () => {
    it("returns success on happy path", async () => {
      hazProStore.sddgInspectionContext.extractedContent = { shipper: "X" } as any;
      hazProStore.sddgInspectionContext.verificationCopy = {
        shippersReferenceNumber: "TCN",
        unIdNo: "UN1234",
        properShippingName: "Test",
      } as any;
      hazProStore.sddgInspectionContext.frustrations = [{ key: "a" } as any];
      hazProStore.sddgInspectionContext.packageFrustrations = [];

      const result = await hazProActions.completeInspectionWithFrustration();
      expect(result.success).toBe(true);
    });

    it("returns failure when save fails", async () => {
      // No extractedContent -> saveCurrentInspection will throw
      hazProStore.sddgInspectionContext.extractedContent = null;
      hazProStore.sddgInspectionContext.verificationCopy = null;

      const result = await hazProActions.completeInspectionWithFrustration();
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe("getInspectorDatabaseStats", () => {
    it("returns stats from database", async () => {
      const stats = await hazProActions.getInspectorDatabaseStats();
      expect(stats).toEqual({
        totalInspections: 5,
        completedInspections: 3,
        frustratedInspections: 2,
      });
    });

    it("returns zeroed stats on error", async () => {
      (InspectorShipmentDatabase.getStats as jest.Mock).mockRejectedValueOnce(
        new Error("stats fail")
      );
      const stats = await hazProActions.getInspectorDatabaseStats();
      expect(stats).toEqual({
        totalInspections: 0,
        completedInspections: 0,
        frustratedInspections: 0,
      });
    });
  });
});
