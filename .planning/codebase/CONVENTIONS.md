# Coding Conventions

**Analysis Date:** 2026-01-30

## Naming Patterns

**Files:**
- React Components: PascalCase (e.g., `CustomDrawerContent.tsx`, `POPMarkingDataEntry.tsx`)
- Utilities/Services: camelCase (e.g., `anchorDetection.ts`, `validatePopMarking.tsx`)
- Test files: `*.test.ts` or `*.test.tsx` (e.g., `markingRequirements.class1.test.ts`)
- Context files: PascalCase with descriptive naming (e.g., `InspectionFormProvider.tsx`, `DataProvider.tsx`)

**Functions:**
- camelCase for all functions, including React hooks (e.g., `fuzzyMatch()`, `handleLogout()`, `initializeDb()`)
- Async functions explicitly async: `async function initializeDb()` or `const initializeDb = async ()`
- Event handlers prefixed with `handle`: `handleLogout()`, `handlePress()`, `onPress()`
- Custom hooks prefixed with `use`: `useInspectionForm()`, `useDatabase()`, `useNavigation()`

**Variables:**
- camelCase for local variables and state: `isInitialized`, `formData`, `shipmentId`
- UPPERCASE_SNAKE_CASE for constants: `DATABASE_NAME`, `PERFORMANCE_TRACKING_ENABLED`, `SDDG_ANCHORS`
- Context/Provider references use PascalCase: `DataProviderContext`, `InspectionFormProvider`

**Types:**
- PascalCase for interfaces: `HazardousMaterialData`, `DataProviderContextValue`, `PackagingInstruction`
- PascalCase for type aliases: `ExtractedSDDGContent`, `ValidationResult`, `InspectionStatus`
- Enum values use UPPERCASE: `PhysicalState.SOLID`, `PhysicalState.LIQUID`

**Component Props:**
- Props interface named `{ComponentName}Props`: `CustomDrawerContentProps`, `InspectionFormProviderProps`

## Code Style

**Formatting:**
- No explicit ESLint/Prettier config in root directory
- Consistent use of double quotes for strings in TypeScript
- 2-space indentation observed throughout codebase
- Semicolons consistently used

**Linting:**
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- Path aliases configured: `@/*` maps to `./src/*`
- No active ESLint config at root level; rely on TypeScript strict checking

## Import Organization

**Order:**
1. React and React Native imports
2. Navigation imports (React Navigation)
3. Context/Provider imports
4. Local type imports
5. Utility and service imports
6. Local component imports

**Example from codebase:**
```typescript
import React, { useEffect, useState } from "react";
import { render, act } from "@testing-library/react-native";
import { InspectionFormProvider, useInspectionForm } from "@/contexts/InspectionFormProvider";
import { HazProPreparerContext } from "../../contexts/HazProPreparerProvider/reducer";
import { HazardousMaterialItem, PhysicalState } from "../../../types";
```

**Path Aliases:**
- Use `@/` prefix for absolute imports from `src/`: `@/contexts`, `@/types`, `@/services`
- Relative imports discouraged in favor of path aliases

## Error Handling

**Patterns:**
- Try-catch with explicit error logging: `console.error('📊 [DataProvider] Failed to load shipment:', error)`
- Emoji-prefixed console logs by module (`📊`, `📦`, etc.)
- Error messages include context module in brackets: `[DataProvider]`, `[PreparerForm]`
- Promise rejections handled in `.catch()` or `try-catch`
- Database errors return via context state: `error: string | null`

**Example from codebase:**
```typescript
try {
  console.log("📊 [DataProvider] Initializing database...");
  setIsLoading(true);
  setError(null);
  const db = await SQLite.openDatabaseAsync(DATABASE_NAME);
  setIsInitialized(true);
} catch (err) {
  const errorMessage = err instanceof Error ? err.message : String(err);
  setError(errorMessage);
}
```

## Logging

**Framework:** `console` (no centralized logging library)

**Patterns:**
- Use `console.log()` for informational logs with emoji prefixes
- Use `console.error()` for errors with emoji prefixes
- Logs include module context in brackets: `📊 [DataProvider]`, `📦 [PreparerForm]`
- Async operation tracking includes start/end logging

**Example:**
```typescript
console.log('📦 [PreparerForm] Starting new shipment');
console.log('📦 [PreparerForm] Shipment saved successfully:', id);
console.error('📦 [PreparerForm] Failed to save shipment:', error);
```

## Comments

**When to Comment:**
- File-level JSDoc blocks explaining module purpose (seen in `jest.config.js`, `jest.setup.js`)
- Complex algorithm explanations (e.g., Levenshtein distance in `anchorDetection.ts`)
- Non-obvious business logic specific to hazmat regulations

**JSDoc/TSDoc:**
- Used for type definitions and interfaces
- Parameter and return type documentation via TypeScript types
- Module-level comments with `/**` blocks at file top

**Example from codebase:**
```typescript
/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
```

## Function Design

**Size:**
- Small, focused functions preferred (most utilities 20-50 lines)
- Complex operations broken into helper functions
- Example: `normalizeText()`, `stripOcrArtifacts()` split from main logic in `anchorDetection.ts`

**Parameters:**
- Explicit typed parameters (no `any` preferred)
- Optional parameters use `?` with default values
- Complex configs use object parameter: `options: { usesPopMarking?: boolean, ... }`

**Return Values:**
- Explicit return types for all exported functions
- Promise-returning functions clearly marked `async` or return `Promise<T>`
- Nullable returns use `T | null`

**Example from codebase:**
```typescript
export function fuzzyMatch(
  text: string,
  patterns: string[],
  maxDistance: number = 2
): boolean {
  // function body
}

const initializeDb = async () => {
  // async operations
};
```

## Module Design

**Exports:**
- Explicit `export` statements (no `export default` preferred for components)
- Named exports for functions and types: `export function fuzzyMatch()`, `export interface DataProviderContextValue`
- Single default export acceptable for context providers

**Barrel Files:**
- Used in type directories: `/src/types/index.ts` aggregates type exports
- Provides single import point: `import { ExtractedSDDGContent } from '@/types'`
- Pattern: Re-export grouped by domain (SDDG, Packaging, etc.)

**Example from codebase:**
```typescript
// src/types/index.ts
export {
  type ExtractedSDDGContent,
  type ReinspectionAttempt,
  // ... more SDDG types
} from "./sddg";

export {
  type Region,
  type FieldRegion,
  // ... more template types
} from "./sddg-template";
```

## Special Patterns

**React Hooks in Contexts:**
- Custom hooks return context values directly: `useInspectionForm()` returns full context
- Context hooks provide both state and operations

**Async/Await:**
- Preferred over `.then()` chaining
- Used throughout database operations and data loading

**Test Helpers:**
- Mock functions created with `jest.fn()`
- Mock modules established in setup files (`jest.setup.js`)
- Reusable test context builders: `createClass1Context()` pattern

---

*Convention analysis: 2026-01-30*
