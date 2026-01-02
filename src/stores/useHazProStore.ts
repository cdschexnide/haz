import { useSnapshot } from 'valtio';
import { hazProStore } from './hazProStore';
import { hazProActions } from './hazProActions';

export function useHazProStore() {
  const snap = useSnapshot(hazProStore);

  return {
    state: snap,
    store: hazProStore,
    actions: hazProActions,

    isLoading: snap.isLoadingShipments,
    error: snap.databaseError,
    hazProContext: snap.hazProPreparerContext,

    // Convenient access to markings/labels with defaults
    requiredMarkings: snap.hazProPreparerContext.requiredMarkingsArray || [],
    requiredLabels: snap.hazProPreparerContext.requiredLabelsArray || [],

    // Common action shortcuts
    saveCurrentShipment: hazProActions.saveCurrentShipment,
    loadShipment: hazProActions.loadShipment,
    deleteShipment: hazProActions.deleteShipment,
    initializeDatabase: hazProActions.initializeDatabase,
    clearAndReinitializeDatabase: hazProActions.clearAndReinitializeDatabase,
    refreshShipmentsIndex: hazProActions.refreshShipmentsIndex,
  };
}

export function getNestedValue<T = any>(path: string): T | undefined {
  const fields = path.split('.');
  let current: any = hazProStore.hazProPreparerContext;
  
  for (const field of fields) {
    if (current?.[field] === undefined) {
      return undefined;
    }
    current = current[field];
  }
  
  return current as T;
}

export function setNestedValue(path: string, value: any): void {
  const fields = path.split('.');
  let current: any = hazProStore.hazProPreparerContext;
  
  for (let i = 0; i < fields.length - 1; i++) {
    if (!current[fields[i]]) {
      current[fields[i]] = {};
    }
    current = current[fields[i]];
  }
  
  current[fields[fields.length - 1]] = value;
}