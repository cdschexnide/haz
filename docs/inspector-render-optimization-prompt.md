# Inspector Workflow Render Optimization Analysis

## Mission

Perform an **EXPERT-LEVEL ANALYSIS** of React render performance across the Inspector workflow screens. Identify the most impactful opportunities for refactoring that would eliminate unnecessary re-renders.

## Critical Constraint

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   THIS IS A PERFORMANCE-ONLY REFACTOR. ZERO FUNCTIONALITY CHANGES.           ║
║                                                                              ║
║   Before proposing ANY change, ask:                                          ║
║   "Does the app still do EXACTLY what it did before, just faster?"           ║
║                                                                              ║
║   If the answer is not a definitive "YES" → DO NOT PROCEED WITH THAT CHANGE  ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```

**What this means:**
- NO changing what data is displayed
- NO changing user interaction flows
- NO changing business logic or validation rules
- NO changing navigation behavior
- NO changing API/database call patterns (order, frequency, payload)
- NO changing error handling behavior
- NO removing features "for performance"

**What IS allowed:**
- Memoizing components, values, and callbacks
- Splitting contexts to reduce subscription scope
- Moving state closer to where it's used
- Lazy loading components that aren't immediately visible
- Optimizing selector patterns
- Adding React.memo() boundaries
- Restructuring component hierarchies (if functionally equivalent)

---

## Instructions for Claude Code

### 1. Enable Extended Thinking

Use `ultrathink` or maximum extended thinking for this analysis. This is a complex codebase analysis that requires deep reasoning about React render behavior, component relationships, and state flow.

### 2. Use Superpowers Skills

Invoke the following skills as appropriate:
- `superpowers:brainstorming` - Before diving into analysis, brainstorm the approach
- `superpowers:dispatching-parallel-agents` - Use parallel agents for independent screen analysis
- `superpowers:writing-plans` - Document the analysis plan before execution

### 3. Dispatch Parallel Analysis Agents

Use the Task tool to dispatch **parallel subagents** for independent analysis. Each agent should analyze 2-3 screens:

**Agent 1: Entry & Upload Screens**
- `InspectorHomeScreen.tsx`
- `SDDGUploadAndParse.tsx`
- `MLDetectionScreen.tsx`

**Agent 2: SDDG Compliance Flow**
- `InteractiveSDDGComplianceScreen.tsx`
- `SDDGFrustrationSummary.tsx`
- `SDDGInspectionCompleteScreen.tsx`

**Agent 3: Package Inspection Flow**
- `InspectorMarkingsLabelsValidationScreen.tsx`
- `PackageFrustrationSummary.tsx`
- `PackageInspectionCompleteScreen.tsx`

**Agent 4: Data Entry & Forms**
- `InspectorPOPMarkingDataEntry.tsx`
- `InspectorAMC1015Form.tsx`

Each agent prompt should include:
```
Analyze render performance for [SCREEN_NAMES]. For each screen:

1. Read the component file completely
2. Identify ALL hooks used (useState, useEffect, useContext, useMemo, useCallback, custom hooks)
3. Trace context subscriptions - what contexts does this component subscribe to?
4. Identify inline function definitions that create new references on every render
5. Identify object/array literals in JSX props that create new references
6. Check for missing React.memo() on child components
7. Look for state that could be derived instead of stored
8. Check for useEffect dependencies that change too frequently
9. Identify expensive computations that should be memoized

Output format for each screen:
- Current render triggers (what causes this component to re-render)
- Specific optimization opportunities with code locations (line numbers)
- Estimated impact (HIGH/MEDIUM/LOW)
- Proposed fix pattern (conceptual, not full implementation)

CRITICAL: Do NOT propose any changes that would alter functionality. Performance only.
```

---

## Analysis Framework

### For Each Screen, Document:

#### A. Render Trigger Analysis
```markdown
### [ScreenName] Render Triggers

| Trigger | Source | Frequency | Impact |
|---------|--------|-----------|--------|
| Context update | InspectionFormContext | Every field change | HIGH |
| State change | useState for X | On user action | LOW |
| Parent re-render | NavigationContainer | On nav events | MEDIUM |
```

#### B. Optimization Opportunities
```markdown
### [ScreenName] Optimization Opportunities

#### 1. [Opportunity Title]
- **Location:** `src/screens/inspector/ScreenName.tsx:45-67`
- **Current Behavior:** [What happens now]
- **Problem:** [Why this causes unnecessary renders]
- **Proposed Fix:** [Conceptual solution]
- **Impact:** HIGH/MEDIUM/LOW
- **Risk:** [Any risk to functionality - should be NONE]
- **Verification:** [How to verify functionality unchanged]
```

#### C. Context Subscription Audit
```markdown
### [ScreenName] Context Subscriptions

| Context | Fields Used | Fields Available | Over-subscription? |
|---------|-------------|------------------|-------------------|
| InspectionFormContext | currentInspection, saveCurrentInspection | 15+ fields | YES - subscribes to all |
```

---

## Specific Patterns to Look For

### 1. Context Over-Subscription
```typescript
// BAD: Subscribes to entire context, re-renders on ANY change
const { currentInspection, saveCurrentInspection } = useInspectionForm();

// BETTER: Split context or use selectors
const currentInspection = useInspectionFormSelector(state => state.currentInspection);
```

### 2. Inline Functions in JSX
```typescript
// BAD: New function reference every render
<Button onPress={() => handleSave(item.id)} />

// BETTER: Memoized callback
const handleSaveCallback = useCallback(() => handleSave(item.id), [item.id]);
<Button onPress={handleSaveCallback} />
```

### 3. Inline Object/Array Literals
```typescript
// BAD: New object reference every render
<View style={{ marginTop: 10 }} />

// BETTER: StyleSheet or memoized style
<View style={styles.container} />
```

### 4. Missing React.memo on Child Components
```typescript
// BAD: Child re-renders whenever parent re-renders
const ItemRow = ({ item }) => <View>...</View>;

// BETTER: Only re-renders when props change
const ItemRow = React.memo(({ item }) => <View>...</View>);
```

### 5. Expensive Computations
```typescript
// BAD: Recalculates on every render
const sortedItems = items.sort((a, b) => a.date - b.date);

// BETTER: Only recalculates when items change
const sortedItems = useMemo(() => items.sort((a, b) => a.date - b.date), [items]);
```

### 6. useEffect with Unstable Dependencies
```typescript
// BAD: Effect runs every render because object reference changes
useEffect(() => {
  doSomething(config);
}, [config]); // config is { a: 1, b: 2 } defined inline

// BETTER: Stable reference or primitive dependencies
useEffect(() => {
  doSomething(config);
}, [config.a, config.b]);
```

---

## Output Document Structure

Create a file at: `docs/inspector-render-optimization-analysis.md`

```markdown
# Inspector Workflow Render Optimization Analysis

Generated: [DATE]
Analyzed by: Claude Code with Extended Thinking

## Executive Summary
- Total screens analyzed: 11
- High-impact opportunities: X
- Medium-impact opportunities: Y
- Low-impact opportunities: Z
- Estimated render reduction: [percentage if measurable]

## Critical Constraint Reminder
[Repeat the constraint about no functionality changes]

## High-Impact Optimizations (Do These First)

### 1. [Optimization Title]
[Full details per format above]

### 2. [Optimization Title]
...

## Medium-Impact Optimizations

...

## Low-Impact Optimizations (Nice to Have)

...

## Context Architecture Recommendations

[If context splitting would help, describe the proposed architecture]

## Implementation Order

1. [First thing to implement - lowest risk, highest impact]
2. [Second thing]
...

## Verification Checklist

For each optimization implemented:
- [ ] App builds without errors
- [ ] All existing tests pass
- [ ] Manual smoke test of affected screen
- [ ] Functionality identical to before
- [ ] Render count reduced (verify with useRenderTracker)

## Appendix: Per-Screen Analysis

### InspectorHomeScreen.tsx
[Full analysis]

### SDDGUploadAndParse.tsx
[Full analysis]

... [All 11 screens]
```

---

## Files to Analyze

All files are in `src/screens/inspector/`:

1. `InspectorHomeScreen.tsx`
2. `SDDGUploadAndParse.tsx`
3. `InteractiveSDDGComplianceScreen.tsx`
4. `SDDGFrustrationSummary.tsx`
5. `SDDGInspectionCompleteScreen.tsx`
6. `MLDetectionScreen.tsx`
7. `InspectorPOPMarkingDataEntry.tsx`
8. `InspectorMarkingsLabelsValidationScreen.tsx`
9. `PackageFrustrationSummary.tsx`
10. `PackageInspectionCompleteScreen.tsx`
11. `InspectorAMC1015Form.tsx`

Also analyze these supporting files for context:
- `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx` - Main state context
- `src/contexts/DataProvider/DataProvider.tsx` - Database context
- `src/hooks/useRenderTracker.ts` - Existing render tracking (use this for verification)
- `src/utils/performanceUtils.ts` - Existing performance utilities

---

## Execution Command

```
claude --dangerously-skip-permissions --model opus ultrathink
```

Then paste this entire prompt, or reference this file:
```
Read docs/inspector-render-optimization-prompt.md and execute the analysis as described.
```

---

## Final Reminder

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                                                                              ║
║   FUNCTIONALITY MUST NOT CHANGE. OPTIMIZE ONLY.                              ║
║                                                                              ║
║   Every proposed change must pass this test:                                 ║
║   "Does the app still do EXACTLY what it did before, just faster?"           ║
║                                                                              ║
║   If you cannot answer "YES" with 100% confidence, do not propose it.        ║
║                                                                              ║
╚══════════════════════════════════════════════════════════════════════════════╝
```
