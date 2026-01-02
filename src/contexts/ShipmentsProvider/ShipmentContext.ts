import React from "react";
import { Action, initialState, State } from "./reducer";

export interface IShipmentsContext {
  state: State;
  dispatch: React.Dispatch<Action>;
}

export const ShipmentsContext = React.createContext<IShipmentsContext>({
  state: initialState,
  dispatch: () => null,
});
