import { useSnapshot } from 'valtio';
import { hazProStore } from './hazProStore';
import { hazProActions } from './hazProActions';

/**
 * Full store hook with reactive state subscription.
 * Use this when you need to read state values that should trigger re-renders.
 *
 * WARNING: This subscribes to the ENTIRE store via useSnapshot().
 * Any state change will cause components using this hook to re-render.
 * If you only need actions, use useHazProActions() instead.
 */
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

/**
 * Actions-only hook - NO reactive state subscription.
 * Use this when you only need to dispatch actions and don't need to read state.
 *
 * PERFORMANCE: This hook does NOT use useSnapshot(), so components using it
 * will NOT re-render when store state changes. This is ideal for components
 * that only call actions like setCurrentChevron(), addFrustration(), etc.
 *
 * @example
 * // Before (causes re-renders on ANY store state change):
 * const { actions } = useHazProStore();
 *
 * // After (no re-renders from store state changes):
 * const actions = useHazProActions();
 */
export function useHazProActions() {
  return hazProActions;
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