import { createContext } from "react";
import {
  initialHazProPreparerState,
  HazProPreparerState,
  HazProPreparerAction,
} from "./reducer";

import { ShipmentMetadata } from "../../../src/services/shipment/ShipmentDatabase";

export interface HazProPreparerContextType {
  state: HazProPreparerState;
  dispatch: React.Dispatch<HazProPreparerAction>;

  // Database operations
  saveCurrentShipment: (
    status: "in-progress" | "completed",
    id?: string
  ) => Promise<void>;
  loadShipment: (shipmentId: string) => Promise<void>;
  listShipments: () => Promise<ShipmentMetadata[]>;
  deleteShipment: (shipmentId: string) => Promise<void>;

  // Database state
  isLoading: boolean;
  error: string | null;
}

export const HazProPreparerContext = createContext<HazProPreparerContextType>({
  state: initialHazProPreparerState,
  dispatch: () => null,

  // Database operations
  saveCurrentShipment: async () => {},
  loadShipment: async () => {},
  listShipments: async () => [],
  deleteShipment: async () => {},

  // Database state
  isLoading: false,
  error: null,
});
