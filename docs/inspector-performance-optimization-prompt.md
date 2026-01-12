# Inspector State Management & SQLite Performance Optimization Analysis

## Context

You are analyzing a React Native (Expo, TypeScript) hazmat inspection application for the US Air Force. The app has significant performance issues when:

1. **Loading an inspection** from SQLite into the Valtio/Context state
2. **Saving/updating an inspection** from state back to SQLite
3. **Rendering the completed inspections list** when the SQLite table grows large

The entire inspection object is stored as a single massive record, and serialization/deserialization is the primary bottleneck.

---

## ⚠️ CRITICAL CONSTRAINT ⚠️

**THIS IS A REFACTOR FOR PERFORMANCE OPTIMIZATION ONLY.**

You MUST NOT:
- Remove any existing functionality
- Change any user-facing behavior
- Alter the inspection workflow logic
- Modify what data is captured or how it's validated
- Break any existing screens or navigation flows

You MUST:
- Preserve 100% functional parity with the current implementation
- Ensure all data that is currently saved is still saved
- Maintain all relationships between data (frustrations, ML results, POP markings, etc.)
- Keep the same API surface for components consuming the state

**If you are uncertain whether a change would affect functionality, DO NOT make that change. Flag it for human review instead.**

---

## Your Task

Perform a **deep analysis** of the inspector state management system and SQLite persistence layer, then propose performance optimizations. Use subagents to parallelize the analysis.

### Phase 1: Discovery & Analysis

#### Subagent 1: Valtio/Context State Structure Analysis

Analyze these files to understand the current state shape:

```
src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
src/stores/useHazProStore.ts
```

Document:
1. The complete TypeScript interface for `InspectionFormState` and all nested types
2. Which fields are actively mutated during the workflow vs. static after initial load
3. The size/complexity of each major section (estimate field counts, array sizes)
4. Any deeply nested structures that would be expensive for Valtio to proxy
5. Current serialization approach (JSON.stringify? Custom?)

#### Subagent 2: SQLite Schema & Query Analysis

Analyze these files/patterns:

```
- Any files in src/database/ or similar
- Any files using expo-sqlite
- Search for: db.runAsync, db.getAllAsync, db.getFirstAsync, SQLite patterns
```

Document:
1. Current table schema(s) for inspections
2. Whether the inspection is stored as a JSON blob or normalized columns
3. All queries that load/save inspections
4. Index usage (or lack thereof)
5. Any existing pagination or lazy-loading patterns

#### Subagent 3: Data Flow & Serialization Hotspots

Trace the data flow for these critical operations:

1. **Load inspection from SQLite into state** (find `loadInspectionForEdit` or similar)
2. **Save new inspection to SQLite** (find `saveInspection`, `completeInspection`, etc.)
3. **Update existing inspection** (find update patterns)
4. **Load inspection list for InspectorHomeScreen**

For each, identify:
- Where JSON.parse/JSON.stringify occurs
- Time complexity of the operation
- Any blocking UI during these operations
- Whether operations are batched or individual

#### Subagent 4: Inspection Object Size Analysis

Find and analyze a real inspection object structure by examining:

1. `InspectorShipment` interface and all its nested types
2. `ExtractedSDDGContent` structure
3. `AggregatedAnalysis` (ML results) structure
4. `PackageFrustrationRecord[]` structure
5. `PackagePopMarking` structure
6. Any image data or base64 stored in the inspection

Estimate the approximate JSON size of a typical inspection with:
- 20 SDDG fields
- 6 package images with ML detection results
- 5 frustrations
- Full POP marking data

---

### Phase 2: Reference Documentation

Read the architecture documentation thoroughly:

```
docs/architecture/inspector-workflow-and-ml-detection.md
```

Pay special attention to:
- Section 15: State Management Architecture
- Section 16: Frustration System
- The `InspectorShipment` status values and what each field means
- The relationship between `InspectionFormProvider` context and SQLite persistence

---

### Phase 3: Optimization Proposals

Based on your analysis, propose optimizations in these categories:

#### A. SQLite Schema Normalization

If the inspection is stored as a single JSON blob, propose a normalized schema:

```sql
-- Example structure (adapt based on actual findings)
inspections (
  id TEXT PRIMARY KEY,
  status TEXT,
  created_at INTEGER,
  tcn TEXT,
  un_id TEXT,
  proper_shipping_name TEXT,
  inspector TEXT,
  sddg_status TEXT,
  package_status TEXT,
  -- Only lightweight, frequently-queried fields here
)

inspection_sddg_data (
  inspection_id TEXT PRIMARY KEY,
  data_json TEXT,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
)

inspection_ml_results (
  inspection_id TEXT PRIMARY KEY,
  data_json TEXT,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
)

inspection_frustrations (
  id TEXT PRIMARY KEY,
  inspection_id TEXT,
  category TEXT,
  item_id TEXT,
  item_label TEXT,
  data_json TEXT,
  FOREIGN KEY (inspection_id) REFERENCES inspections(id)
)

-- etc.
```

For each proposed table:
1. Explain what data it holds
2. Why separating it improves performance
3. When it would be loaded (eager vs. lazy)

#### B. Lazy Loading Strategy

Propose which data should be:
- **Eager loaded** (needed immediately for list view or navigation)
- **Lazy loaded** (only when user navigates to that section)
- **Loaded on demand** (only when explicitly requested)

Example:
```typescript
// Eager: Just enough for the list view
const loadInspectionSummary = (id: string) => {
  return db.getFirstAsync(
    'SELECT id, tcn, proper_shipping_name, sddg_status, package_status FROM inspections WHERE id = ?',
    [id]
  );
};

// Lazy: Load when entering SDDG review
const loadSDDGData = (inspectionId: string) => {
  return db.getFirstAsync(
    'SELECT data_json FROM inspection_sddg_data WHERE inspection_id = ?',
    [inspectionId]
  );
};
```

#### C. Valtio/Context Optimization

Propose changes to reduce proxy overhead:

1. **Use `ref()` for static data** that won't change after load
2. **Split the monolithic state** into separate concerns
3. **Incremental hydration** pattern for large objects
4. **Consider replacing deeply nested Valtio state** with simpler React state for non-reactive data

Example:
```typescript
import { proxy, ref } from 'valtio';

const inspectionStore = proxy({
  // Reactive - changes during workflow
  currentStep: 'sddg',
  frustrations: [],
  
  // Non-reactive after load - wrap in ref()
  sddgData: ref(null),
  mlResults: ref(null),
});
```

#### D. Query & Index Optimization

Propose indexes for common query patterns:

```sql
CREATE INDEX idx_inspections_status ON inspections(status);
CREATE INDEX idx_inspections_created_at ON inspections(created_at DESC);
CREATE INDEX idx_frustrations_inspection_id ON inspection_frustrations(inspection_id);
```

#### E. Serialization Optimization

If JSON.parse/stringify is a bottleneck, propose alternatives:

1. **Partial parsing** - only parse what's needed
2. **Streaming/chunked parsing** for large objects
3. **Alternative serializers** (msgpack, flatted) if appropriate
4. **Compression** for storage if size is an issue

---

### Phase 4: Implementation Plan

Create a phased implementation plan that:

1. **Phase 1**: Add instrumentation/timing to identify exact bottlenecks
2. **Phase 2**: Implement SQLite schema changes with migration
3. **Phase 3**: Update data access layer (new load/save functions)
4. **Phase 4**: Update state management to use lazy loading
5. **Phase 5**: Optimize list rendering (pagination, virtualization)

For each phase, specify:
- Files to modify
- Estimated complexity (low/medium/high)
- Risk level for regression
- How to verify no functionality was lost

---

### Phase 5: Deliverables

Produce these artifacts:

1. **ANALYSIS_REPORT.md**: Detailed findings from Phase 1
2. **OPTIMIZATION_PROPOSAL.md**: All proposed optimizations with rationale
3. **MIGRATION_PLAN.md**: Step-by-step implementation plan
4. **SCHEMA_MIGRATION.sql**: SQL migration script (if applicable)
5. **TYPE_DEFINITIONS.ts**: Updated TypeScript interfaces for new data structures
6. **TEST_CHECKLIST.md**: Manual test cases to verify functional parity

---

## Files to Analyze

Start by examining these key files:

```
# State Management
src/contexts/InspectionFormProvider/InspectionFormProvider.tsx
src/stores/useHazProStore.ts

# Database Layer
src/database/ (if exists)
src/services/database.ts (or similar)
Any file containing: expo-sqlite, SQLite, db.run, db.get

# Key Screens (to understand data requirements)
src/components/Inspector/InspectorHomeScreen.tsx
src/components/Inspector/MLDetectionScreen.tsx
src/components/Inspector/InspectorPOPMarkingValidationScreen.tsx

# Types
src/types/ (all inspection-related types)
src/contexts/InspectionFormProvider/types.ts (if exists)

# Architecture Documentation
docs/architecture/inspector-workflow-and-ml-detection.md
```

---

## Expected Analysis Approach

1. **Start with `view` commands** to understand file structure
2. **Use `grep` or `ripgrep`** to find all SQLite usage patterns
3. **Trace the data flow** from UI action → state update → database
4. **Identify the largest/most complex nested objects**
5. **Look for existing performance patterns** (debouncing, memoization, etc.)
6. **Check for any existing lazy loading** that could be extended

---

## Questions to Answer

1. What is the approximate size (in KB) of a serialized inspection object?
2. How many database operations occur when saving a complete inspection?
3. Are there any circular references that complicate serialization?
4. Is image data (base64) stored in the inspection object or separately?
5. What percentage of the inspection data is actually needed for the home screen list?
6. Are there any existing indexes on the inspections table?
7. Is the database connection being reused or recreated?
8. Are saves happening synchronously on the UI thread?

---

## Final Reminder

**DO NOT MODIFY FUNCTIONALITY. OPTIMIZE ONLY.**

Every change must be validated against this question: "Does the app still do exactly what it did before, just faster?"

If the answer is not a definitive "yes," do not proceed with that change.
