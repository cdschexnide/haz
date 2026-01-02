import { useContext } from "react";
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

  return {
    navigate,
    goBack,
    navigationRef: navigationRef?.current,
  };
};
