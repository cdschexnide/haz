import { useContext } from "react";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import {
  NavigationRefContext,
  RootStackParamList,
} from "./NavigationRefContext";

export const useNavigationRef = () => {
  const { navigationRef } = useContext(NavigationRefContext);

  const navigate = <T extends keyof RootStackParamList>(
    name: T,
    params?: RootStackParamList[T]
  ) => {
    console.log("🧭 [NavigationRef] navigate called:", name, params);
    if (navigationRef?.current?.navigate) {
      navigationRef.current.navigate(name, params);
    } else {
      console.warn(
        `NavigationRef is not ready. Tried to navigate to "${name}".`
      );
    }
  };

  const goBack = () => {
    if (navigationRef?.current?.canGoBack?.()) {
      navigationRef.current.goBack();
    } else {
      console.warn("NavigationRef cannot go back.");
    }
  };

  const reset = (state: Parameters<
    NavigationContainerRefWithCurrent<RootStackParamList>["reset"]
  >[0]) => {
    console.log("🧭 [NavigationRef] reset called:", state);
    if (navigationRef?.current?.reset) {
      navigationRef.current.reset(state);
    } else {
      console.warn("NavigationRef is not ready. Tried to reset navigation.");
    }
  };

  return {
    navigate,
    goBack,
    reset,
    navigationRef: navigationRef?.current,
  };
};
