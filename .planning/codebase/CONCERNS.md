# Codebase Concerns

**Analysis Date:** 2026-01-30

## Tech Debt

**Massive Hazardous Materials Data Lists:**
- Issue: `hazardousMaterialsList.ts` contains 39,264 lines of raw material definitions (39,000+ entries), and `allHazmatCompatibilityKeys.ts` contains 19,346 lines. These are hardcoded arrays bundled into the application.
- Files: `src/hazardousMaterials/hazardousMaterialsList.ts`, `src/hazardousMaterials/hazardousMaterialsListWithoutPackingGroups.ts`, `src/utils/hazmat-compatibility-engine/allHazmatCompatibilityKeys.ts`
- Impact:
  - Massively increases bundle size
  - Makes code changes/updates extremely difficult (impossible in production)
  - Violates single responsibility principle
  - Difficult to maintain and sync with regulatory updates
  - Lookup performance degrades as arrays scale
- Fix approach:
  - Migrate to a database-driven approach using SQLite (already partially in place with DataProvider)
  - Create dynamic lookup service that queries SQLite instead of scanning arrays
  - Keep only essential/high-frequency materials in-app
  - Implement lazy-loading for full lists

**Untyped State Management (any types):**
- Issue: Multiple use of `any` type in stores and context providers, bypassing TypeScript safety
- Files: `src/stores/useHazProStore.ts` (uses `any` for hazProPreparerContext navigation), `src/stores/hazProActions.ts` (downcasting with `as any`), `src/contexts/InspectionFormProvider/__tests__/InspectionFormProvider.test.tsx` (test mocks using `as any`)
- Impact:
  - Loss of type checking at compile time
  - Runtime errors possible from typos in property names
  - Refactoring becomes risky
  - IDE autocomplete fails
- Fix approach:
  - Define strict types for all store slices
  - Use discriminated unions for state variants
  - Create properly typed action creators instead of dynamic access
  - Eliminate `as any` casts by improving type definitions

**Excessive console.log Statements (1,369+ calls):**
- Issue: Heavy console logging throughout application (1,369+ console calls detected)
- Files: Scattered across `src/services/sddg/`, `src/components/`, and other modules
- Impact:
  - Performance degradation in production
  - Security risk - sensitive data may be logged
  - Bloats app memory and storage when recording logs
  - Makes logs unreadable with excessive noise
  - Difficult to distinguish critical from debug information
- Fix approach:
  - Implement structured logging service with log levels (debug, info, warn, error)
  - Remove console.log calls; replace with conditional logger calls
  - Create environment-aware logger that disables debug in production
  - Use logger service: `src/utils/performanceUtils.ts` as a model for conditional logging

**Large Component Files (Over-Complexity):**
- Issue: Multiple components exceed reasonable size thresholds with complex state management and nested logic
- Files:
  - `src/components/GrandfatheredWizard.tsx` (4,064 lines) - Multi-step wizard with nested conditionals
  - `src/components/CompatibilitySegregationModal.tsx` (3,228 lines) - Complex modal with rules engine
  - `src/components/SDDGUploadAndParse.tsx` (2,805 lines) - File upload and parsing with state management
  - `src/screens/inspector/InspectorAMC1015Form.tsx` (3,357 lines) - Large form component
  - `src/contexts/InspectionFormProvider/InspectionFormProvider.tsx` (1,749 lines) - Complex context provider
- Impact:
  - Difficult to test individual features
  - High risk when making changes
  - Performance issues from re-rendering complexity
  - Violates single responsibility principle
  - Cognitive overload for developers
- Fix approach:
  - Extract form sections into separate components
  - Break down multi-step wizards into atomic steps
  - Move business logic to custom hooks
  - Create separate container and presentation components
  - Aim for components under 500 lines

## Fragile Areas

**SDDG Extraction Pipeline (Critical Feature):**
- Files: `src/services/sddg/anchorBasedExtractor.ts`, `src/services/sddg/templateExtractor.ts`, `src/services/sddg/opencvCellDetection.ts`, `src/services/sddg/valueExtraction.ts`
- Why fragile:
  - Multiple OCR engines being integrated (ML Kit, Paddle, OpenCV)
  - Dependency on native modules: `react-native-ml-kit/text-recognition`, `react-native-fast-opencv`, `react-native-executorch`
  - OpenCV module optional at runtime (caught with try/catch but undefined if missing)
  - Complex chain of transformations: image → preprocessing → OCR → anchor detection → region inference → value extraction
  - Magic numbers throughout for threshold tuning (LINE_THRESHOLD=20px, etc.)
  - Relies on regex patterns for value parsing that may not match all formats
- Safe modification:
  - Ensure all tests pass before touching extraction logic
  - Add integration tests with real SDDG form samples
  - Use feature flags for new extraction methods
  - Log extraction confidence scores for debugging
  - Create regression tests for known problem areas
- Test coverage:
  - Has test files: `__tests__/anchorDetection.test.ts`, `__tests__/cellBuilder.test.ts`, etc.
  - Gap: No E2E tests for full extraction pipeline
  - Gap: Integration tests with real forms limited

**Dynamic Property Access in State:**
- Files: `src/stores/hazProActions.ts`, `src/contexts/HazProPreparerProvider/reducer.tsx`
- Why fragile:
  - Uses bracket notation for nested property access: `(hazProStore.hazProPreparerContext.packaging[field1] as any)[field2] = value`
  - No validation that field paths exist or have correct types
  - Typos in field names fail silently at runtime
  - Refactoring field names breaks without compiler errors
- Safe modification:
  - Create explicit setters for each field instead of dynamic access
  - Use TypeScript discriminated unions for variant state
  - Add runtime validation before property assignment
  - Log deprecation warnings when deprecated fields are accessed

**OpenCV Optional Dependency:**
- Files: `src/services/sddg/opencvCellDetection.ts` lines 26-41
- Why fragile:
  - OpenCV module loaded with optional require() and caught silently
  - Code may fail at runtime if OpenCV not available but cell detection called
  - No clear indication to user when feature unavailable
  - Fallback behavior not defined
- Safe modification:
  - Use dependency injection pattern for OpenCV
  - Implement graceful degradation with alternative extraction method
  - Check at app startup if all required modules available
  - Surface availability in feature flags UI

**Database Migration Robustness:**
- Files: `src/contexts/DataProvider/migrations.ts`
- Why fragile:
  - Migration from AsyncStorage to SQLite happens once on first run
  - If migration fails partway through, can corrupt both storage systems
  - No rollback mechanism if new schema has issues
  - Error count tracking but no per-record error details
- Safe modification:
  - Add transaction support to ensure all-or-nothing migration
  - Implement versioning on migration status
  - Add detailed logging of each migrated record
  - Create migration rollback capability
  - Test migrations with corrupted data and edge cases

## Performance Bottlenecks

**Hazmat Lookup Performance (Array Search):**
- Problem: All hazmat lookups scan entire array of 39,000+ items
- Files: `src/hazardousMaterials/hazardousMaterialsList.ts` (bundled at startup)
- Cause: Linear search through array; no indexing or caching
- Current impact: Startup time and lookup latency scales with dataset size
- Improvement path:
  - Index materials by UN number and proper shipping name in SQLite with proper indexes
  - Implement memoized lookup cache with LRU eviction
  - Use trie structure for shipping name prefix matching
  - Profile: measure current lookup times and set target <10ms

**Excessive Re-renders in Large Forms:**
- Problem: Components like GrandfatheredWizard re-render entire tree on single state change
- Files: `src/components/GrandfatheredWizard.tsx`, `src/components/CompatibilitySegregationModal.tsx`, `src/screens/inspector/InspectorAMC1015Form.tsx`
- Cause: State stored at component level; no memoization; large state objects trigger full re-render
- Improvement path:
  - Use `React.memo()` for all presentation components
  - Break state into smaller, related atoms
  - Use `useCallback` for event handlers to maintain referential equality
  - Implement virtual scrolling for long lists
  - Measure with React DevTools Profiler

**Startup Time (Bundle Loading):**
- Problem: 39K-line arrays loaded and parsed synchronously at startup
- Files: Application root imports `src/hazardousMaterials/hazardousMaterialsList.ts` early
- Cause: Synchronous array parsing, no lazy loading, monolithic bundle
- Improvement path:
  - Lazy-load hazmat lists only when needed
  - Use code splitting for feature areas
  - Defer non-critical initialization to background
  - Measure with lighthouse/performance profiler

**Console Logging Overhead (1,369+ calls):**
- Problem: Every action logged with `console.log` adds processing overhead
- Files: Throughout `src/services/sddg/`, `src/components/`
- Cause: Unfiltered logging at all levels
- Improvement path:
  - Create logger service with log level configuration
  - Disable debug logging in production builds
  - Use logger that batches/throttles output

## Scaling Limits

**Hazmat Data Growth:**
- Current capacity: 39,000+ materials hardcoded in bundle
- Limit: App bundle size continues growing; becomes unmaintainable
- Scaling path:
  - Migrate to SQLite with remote sync capability
  - Implement delta sync for regulatory updates
  - Support partial/cached materialization (don't load all at startup)

**Form State Management:**
- Current capacity: Single large context provider managing all inspection state
- Limit: State object becomes unwieldy; difficult to serialize/persist; performance degrades with size
- Scaling path:
  - Split into domain-specific contexts (SDDG context, packaging context, etc.)
  - Implement proper state normalization
  - Use SQLite as source of truth instead of in-memory state

**Test Execution Time:**
- Current: Jest tests with full Transform ignore patterns
- Limit: Test suite slows as more tests added
- Scaling path:
  - Implement faster test runner or parallelization
  - Create focused test suites by feature area
  - Use snapshot testing judiciously to avoid brittleness

## Security Considerations

**Console Logging of Potentially Sensitive Data:**
- Risk: Hazmat materials details, shipper/consignee information, inspection results may be logged with `console.log`
- Files: 1,369+ console calls throughout codebase
- Current mitigation: No filtering; logs go to browser console and potentially analytics
- Recommendations:
  - Audit all console calls for sensitive data
  - Implement data masking in logger service
  - Disable console in production builds
  - Encrypt logs if persisted locally

**AsyncStorage Data Migration:**
- Risk: Old AsyncStorage data survives migration; duplicate data in both systems creates inconsistency
- Files: `src/contexts/DataProvider/migrations.ts` lines 88-96
- Current mitigation: Only cleans AsyncStorage after successful migration
- Recommendations:
  - Add secure deletion (overwrite bytes) instead of just removal
  - Validate consistency between AsyncStorage and SQLite after migration
  - Add audit trail of what was migrated

**Type Casting to Any (as any):**
- Risk: Lost type safety allows injection of unexpected types at runtime
- Files: `src/stores/hazProActions.ts`, test files with mocks
- Current mitigation: None; as any bypasses all checks
- Recommendations:
  - Eliminate all `as any` casts in production code
  - Use proper typing for test mocks instead of `as any`
  - Enable TypeScript `noImplicitAny` rule enforcement

## Test Coverage Gaps

**SDDG Extraction Integration Tests:**
- What's not tested: End-to-end extraction with real form images; preprocessing pipeline with various image quality conditions; anchor detection with rotated/skewed forms
- Files: `src/services/sddg/__tests__/` has unit tests but limited integration tests
- Risk: Extraction may fail on real-world forms; regressions in pipeline not caught
- Priority: High - core feature, user-visible failures

**Form Validation Edge Cases:**
- What's not tested: Boundary values, concurrent edits, missing required fields, invalid cross-field combinations
- Files: Form components validated with Yup schema but tests don't cover all validation rules
- Risk: Invalid forms may be submitted; data quality issues
- Priority: High - regulatory compliance risk

**Database Migration Edge Cases:**
- What's not tested: Corrupted AsyncStorage data, partial migration failures, version mismatches, concurrent database access
- Files: `src/contexts/DataProvider/migrations.ts` has try/catch but no unit tests
- Risk: Data loss; inconsistent state; app crash on startup
- Priority: Critical - data loss scenario

**Hazmat Compatibility Engine Rules:**
- What's not tested: Complex multi-material interactions, all special provision combinations, edge cases in compatibility tables
- Files: `src/utils/hazmat-compatibility-engine/` with 3,353 lines of rules but limited test coverage for complex scenarios
- Risk: Incompatible materials allowed; compliance violations
- Priority: Critical - safety/regulatory

**State Persistence and Recovery:**
- What's not tested: App crash and recovery with partial state, locale changes during inspection, network interruptions during sync
- Files: `src/contexts/InspectionFormProvider/` and `src/contexts/DataProvider/`
- Risk: Lost work; corrupted inspection data
- Priority: Medium - user experience impact

**Component Snapshot Regression:**
- What's not tested: Large components like GrandfatheredWizard and CompatibilitySegregationModal lack comprehensive snapshot tests
- Files: `src/components/GrandfatheredWizard.tsx`, `src/components/CompatibilitySegregationModal.tsx`
- Risk: UI changes and regressions not caught
- Priority: Medium - visual consistency

## Dependency Risks

**Optional Native Modules at Runtime:**
- Risk: OpenCV, ML Kit, and other native modules may not be available
- Impact: Cell detection, OCR features fail silently
- Migration plan:
  - Implement feature detection at app startup
  - Use dependency injection for optional features
  - Provide fallback extraction methods
  - Create build variants for platforms with/without certain dependencies

**Large Transitive Dependencies:**
- Risk: Heavy dependencies like `react-native-paper`, `lodash`, `pdf-lib` increase bundle size
- Impact: Slower initial load, more memory usage
- Migration plan:
  - Audit and remove unused dependencies
  - Replace heavy utilities with lightweight alternatives
  - Tree-shake unused code with proper bundler config
  - Consider lightweight UI library alternatives

**Outdated Dependency Versions:**
- Risk: react-native 0.79.3, expo 53.0.11 may have security issues
- Impact: Known vulnerabilities; compatibility issues with new packages
- Migration plan:
  - Create upgrade plan with testing for each major version
  - Monitor security advisories
  - Use Dependabot for automated updates

## Missing Critical Features

**Offline Data Sync:**
- Problem: SDDG forms and hazmat data require real-time sync; no offline support with sync on reconnect
- Blocks: Using app in low-connectivity environments (airports, remote areas)
- Solution: Implement background sync queue with eventual consistency

**Form Autosave:**
- Problem: Large inspection forms have no autosave; user loses work on app crash
- Blocks: User data loss; poor user experience
- Solution: Implement periodic autosave to SQLite with conflict resolution

**Analytics and Monitoring:**
- Problem: No visibility into extraction failures, performance issues, user errors
- Blocks: Cannot identify problem areas; difficult to prioritize fixes
- Solution: Implement client-side error tracking and performance monitoring

**Regulatory Compliance Audit Trail:**
- Problem: No immutable log of inspection changes for compliance audits
- Blocks: Cannot prove data integrity or who made changes
- Solution: Implement append-only audit log with checksums

---

*Concerns audit: 2026-01-30*
