import { createContext } from "react";
import {
  initialHazProInspectorState,
  HazProInspectorState,
  HazProInspectorAction,
} from "./reducer";

export interface HazProInspectorContextType {
  state: HazProInspectorState;
  dispatch: React.Dispatch<HazProInspectorAction>;
}

export const HazProInspectorContext = createContext<HazProInspectorContextType>(
  {
    state: initialHazProInspectorState,
    dispatch: () => null,
  }
);
