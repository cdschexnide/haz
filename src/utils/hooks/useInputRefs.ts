import { useRef } from "react";
import { TextInput } from "react-native";

export function useInputRefs(length: number) {
  const refs = useRef<(TextInput | null)[]>([]);

  const getRef = (index: number) => (el: TextInput | null) => {
    refs.current[index] = el;
  };

  const focusNext = (index: number) => {
    if (refs.current[index + 1]) {
      refs.current[index + 1]?.focus();
    }
  };

  return { getRef, focusNext };
}
