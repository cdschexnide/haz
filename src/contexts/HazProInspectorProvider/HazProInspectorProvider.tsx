import React, { useMemo, useReducer } from "react";
import { HazProInspectorContext } from "./HazProInspectorContext";
import {
  hazProInspectorReducer,
  initialHazProInspectorState,
} from "./reducer";

export const HazProInspectorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(hazProInspectorReducer, initialHazProInspectorState);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return (
    <HazProInspectorContext.Provider value={value}>
      {children}
    </HazProInspectorContext.Provider>
  );
};
