import React, { useRef, useCallback, useState } from "react";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { NavigationRefContext, RootStackParamList } from "./NavigationRefContext";

export type Props = {
  children: React.ReactElement;
};

export function NavigationRefProvider({ children }: Props): JSX.Element {
  const [navigationRef, setNavigationRefState] = useState<React.RefObject<NavigationContainerRefWithCurrent<RootStackParamList>>>({
    current: null,
  });

  const setNavigationRef = useCallback(
    (ref: React.RefObject<NavigationContainerRefWithCurrent<RootStackParamList>>) => {
      setNavigationRefState(ref);
    },
    []
  );

  return (
    <NavigationRefContext.Provider value={{ navigationRef, setNavigationRef }}>
      {children}
    </NavigationRefContext.Provider>
  );
}
