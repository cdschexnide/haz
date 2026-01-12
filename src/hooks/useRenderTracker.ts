/**
 * useRenderTracker Hook
 *
 * Tracks component renders for performance analysis.
 * Automatically records each render and detects prop/state changes that caused it.
 *
 * @version 2.0
 * @date 2026-01-07
 */

import { useRef, useEffect, useMemo } from 'react';
import {
  renderTracker,
  PERFORMANCE_TRACKING_ENABLED,
} from '@/utils/performanceUtils';

interface RenderInfo {
  count: number;
  lastRenderTime: number;
  changedProps: string[];
  changedState: string[];
  reason: string;
}

interface TrackedState {
  [key: string]: unknown;
}

/**
 * Hook to track component renders with DETAILED logging
 *
 * @param componentName - Name of the component for reporting
 * @param props - Current props object (optional, for change detection)
 * @param state - Current state object (optional, for change detection)
 *
 * @example
 * function MyComponent(props) {
 *   const [count, setCount] = useState(0);
 *   useRenderTracker('MyComponent', props, { count });
 *   // ... component code
 * }
 */
export function useRenderTracker(
  componentName: string,
  props?: Record<string, unknown>,
  state?: TrackedState
): RenderInfo {
  const renderCount = useRef(0);
  const prevPropsRef = useRef<Record<string, unknown> | undefined>(undefined);
  const prevStateRef = useRef<TrackedState | undefined>(undefined);
  const renderStartTime = useRef(performance.now());
  const lastLogTime = useRef(0);

  // Increment render count
  renderCount.current += 1;
  const currentCount = renderCount.current;

  // Detect which props changed
  const changedProps: string[] = [];
  if (props && prevPropsRef.current) {
    const prevProps = prevPropsRef.current;
    const allKeys = new Set([...Object.keys(props), ...Object.keys(prevProps)]);

    allKeys.forEach((key) => {
      if (props[key] !== prevProps[key]) {
        changedProps.push(key);
      }
    });
  }

  // Detect which state changed
  const changedState: string[] = [];
  if (state && prevStateRef.current) {
    const prevState = prevStateRef.current;
    const allKeys = new Set([...Object.keys(state), ...Object.keys(prevState)]);

    allKeys.forEach((key) => {
      if (state[key] !== prevState[key]) {
        changedState.push(key);
      }
    });
  }

  // Determine reason for render
  const reason = useMemo(() => {
    if (currentCount === 1) return 'mount';

    const reasons: string[] = [];
    if (changedProps.length > 0) {
      reasons.push(`props[${changedProps.join(', ')}]`);
    }
    if (changedState.length > 0) {
      reasons.push(`state[${changedState.join(', ')}]`);
    }

    return reasons.length > 0 ? reasons.join(' + ') : 'parent/context';
  }, [currentCount, changedProps.length, changedState.length]);

  // Record the render - LOG EVERY RENDER
  useEffect(() => {
    const renderTime = performance.now() - renderStartTime.current;
    const now = performance.now();

    if (PERFORMANCE_TRACKING_ENABLED) {
      renderTracker.recordRender(componentName, reason, renderTime);

      // Log EVERY render with detailed info
      // Throttle to avoid spam (max 1 log per 100ms per component)
      if (now - lastLogTime.current > 100 || currentCount <= 3) {
        const emoji = currentCount === 1 ? '🟢' : currentCount > 10 ? '🔴' : '🟡';
        console.log(
          `${emoji} [${componentName}] #${currentCount} (${renderTime.toFixed(1)}ms) - ${reason}`
        );
        lastLogTime.current = now;
      }
    }
  });

  // Store current props and state for next comparison
  useEffect(() => {
    prevPropsRef.current = props ? { ...props } : undefined;
    prevStateRef.current = state ? { ...state } : undefined;
  });

  // Reset render start time for next render
  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  return {
    count: currentCount,
    lastRenderTime: performance.now() - renderStartTime.current,
    changedProps,
    changedState,
    reason,
  };
}

/**
 * Hook to track context subscription renders
 * Use this to identify which context is causing re-renders
 */
export function useContextRenderTracker(
  componentName: string,
  contextName: string,
  contextValue: unknown
): void {
  const renderCount = useRef(0);
  const prevValueRef = useRef<unknown>(undefined);
  const prevValueStringRef = useRef<string>('');

  renderCount.current += 1;

  useEffect(() => {
    if (!PERFORMANCE_TRACKING_ENABLED) return;

    const currentValueString = JSON.stringify(contextValue);
    const changed = currentValueString !== prevValueStringRef.current;

    if (changed && renderCount.current > 1) {
      console.log(
        `📡 [${componentName}] Context "${contextName}" changed → render #${renderCount.current}`
      );

      // Try to identify what changed in the context
      if (typeof contextValue === 'object' && contextValue !== null && prevValueRef.current) {
        const prev = prevValueRef.current as Record<string, unknown>;
        const curr = contextValue as Record<string, unknown>;
        const changedKeys: string[] = [];

        Object.keys(curr).forEach(key => {
          if (typeof curr[key] !== 'function' && curr[key] !== prev[key]) {
            changedKeys.push(key);
          }
        });

        if (changedKeys.length > 0 && changedKeys.length < 10) {
          console.log(`   Changed keys: ${changedKeys.join(', ')}`);
        }
      }
    }

    prevValueRef.current = contextValue;
    prevValueStringRef.current = currentValueString;
  });
}

/**
 * Hook to track why a component re-rendered (more detailed)
 * Use this for components you suspect are re-rendering excessively
 */
export function useWhyDidYouRender(
  componentName: string,
  props: Record<string, unknown>,
  state?: Record<string, unknown>
): void {
  const prevPropsRef = useRef<Record<string, unknown> | undefined>(undefined);
  const prevStateRef = useRef<Record<string, unknown> | undefined>(undefined);

  useEffect(() => {
    if (!PERFORMANCE_TRACKING_ENABLED) return;

    const prevProps = prevPropsRef.current;
    const prevState = prevStateRef.current;

    if (prevProps) {
      const propChanges: string[] = [];
      const allPropKeys = new Set([...Object.keys(props), ...Object.keys(prevProps)]);

      allPropKeys.forEach((key) => {
        if (props[key] !== prevProps[key]) {
          propChanges.push(key);
          console.log(
            `  📦 Prop "${key}" changed:`,
            '\n    Old:', prevProps[key],
            '\n    New:', props[key]
          );
        }
      });

      if (propChanges.length > 0) {
        console.log(`🔍 [${componentName}] Re-rendered due to prop changes: ${propChanges.join(', ')}`);
      }
    }

    if (state && prevState) {
      const stateChanges: string[] = [];
      const allStateKeys = new Set([...Object.keys(state), ...Object.keys(prevState)]);

      allStateKeys.forEach((key) => {
        if (state[key] !== prevState[key]) {
          stateChanges.push(key);
          console.log(
            `  🗃️ State "${key}" changed:`,
            '\n    Old:', prevState[key],
            '\n    New:', state[key]
          );
        }
      });

      if (stateChanges.length > 0) {
        console.log(`🔍 [${componentName}] Re-rendered due to state changes: ${stateChanges.join(', ')}`);
      }
    }

    prevPropsRef.current = { ...props };
    prevStateRef.current = state ? { ...state } : undefined;
  });
}

export default useRenderTracker;
