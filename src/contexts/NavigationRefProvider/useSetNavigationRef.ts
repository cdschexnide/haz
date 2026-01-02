import { useContext } from "react";
import {
  NavigationRefContext,
  RootStackParamList,
} from "./NavigationRefContext";
import { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import type { RefObject } from "react";

export const useSetNavigationRef = () => {
  const { setNavigationRef } = useContext(NavigationRefContext);

  return (ref: RefObject<NavigationContainerRefWithCurrent<any>>) => {
    if (setNavigationRef) {
      setNavigationRef(
        ref as RefObject<NavigationContainerRefWithCurrent<RootStackParamList>>
      );
    }
  };
};
