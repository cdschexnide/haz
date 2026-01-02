import React from "react";
import { reducer, initialState } from "./reducer";
import { ShipmentsContext } from "./ShipmentContext";

export type Props = {
  children: React.ReactElement;
};

export function ShipmentsProvider({ children }: Props): JSX.Element {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state, dispatch]
  );
  return (
    <ShipmentsContext.Provider value={value}>
      {children}
    </ShipmentsContext.Provider>
  );
}
