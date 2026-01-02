import React, { createContext, useState, useMemo } from "react";

interface SelectedTabIndexContextType {
  selectedTabIndex: number;
  setSelectedTabIndex: React.Dispatch<React.SetStateAction<number>>;
}

const defaultSelectedTabIndexContextValue: SelectedTabIndexContextType = {
  selectedTabIndex: 0,
  setSelectedTabIndex: setSelectedTabIndex => setSelectedTabIndex,
};

export const SelectedTabIndexContext =
  createContext<SelectedTabIndexContextType>(
    defaultSelectedTabIndexContextValue
  );

interface SelectedTabIndexProviderProps {
  children: React.ReactNode;
}

export function SelectedTabIndexProvider({
  children,
}: SelectedTabIndexProviderProps): JSX.Element {
  const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0);

  const contextValue = useMemo<SelectedTabIndexContextType>(
    () => ({
      selectedTabIndex,
      setSelectedTabIndex,
    }),
    [selectedTabIndex, setSelectedTabIndex]
  );

  return (
    <SelectedTabIndexContext.Provider value={contextValue}>
      {children}
    </SelectedTabIndexContext.Provider>
  );
}
