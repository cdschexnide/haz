import { Shipment } from "../../../types";

export type State = {
  shipments: Shipment[];
};

export type Action =
  | {
      type: "create-shipment";
      payload: Shipment;
    }
  | {
      type: "delete-shipment";
      payload: { tcn: string };
    }
  | {
      type: "read-shipments";
      payload: Shipment[];
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "create-shipment":
      return {
        ...state,
        shipments: [...state.shipments, action.payload],
      };

    case "delete-shipment":
      return {
        ...state,
        shipments: state.shipments.filter(
          shipment => shipment.tcn !== action.payload.tcn
        ),
      };

    case "read-shipments":
      return {
        ...state,
        shipments: action.payload,
      };

    default:
      return state;
  }
};

export const initialState: State = {
  shipments: [],
};
