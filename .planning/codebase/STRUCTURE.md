# Codebase Structure

**Analysis Date:** 2026-01-30

## Directory Layout

```
src/
├── App.tsx                           # Main app entry, provider setup, login flow
├── components/                       # UI components and preparer-specific screens
│   ├── MainLayoutNavigator.tsx      # Preparer workflow stack navigation
│   ├── MainLayout.tsx               # Main layout wrapper with header/footer
│   ├── LoginScreen.tsx              # Role and user data login
│   ├── AcknowledgementScreen.tsx    # User acknowledgement gate
│   ├── Inspector/                   # Inspector-specific UI components
│   ├── SDDG/                        # SDDG-specific components (dragging, etc)
│   ├── preparer/                    # Preparer-specific reusable components
│   ├── ui/                          # Shared UI primitives (Button, FormField, etc)
│   ├── Package/                     # Package-related components
│   ├── shared/                      # Shared components across roles
│   └── [Screen].tsx                 # Individual wizard and screen components
├── screens/
│   ├── preparer/                    # Preparer workflow screens
│   │   ├── ShipmentCreationScreen.tsx
│   │   ├── MaterialIDScreen.tsx
│   │   ├── PackagingScreen.tsx
│   │   ├── LabelingAndMarkingScreen.tsx
│   │   ├── CertifyFormScreen.tsx
│   │   └── [ScreenName].tsx
│   ├── inspector/                   # Inspector workflow screens
│   │   ├── InspectorLayoutNavigator.tsx
│   │   ├── InspectorHomeScreen.tsx
│   │   ├── InteractiveSDDGComplianceScreen.tsx
│   │   ├── InspectorPackageVerificationScreen.tsx
│   │   ├── InspectorWorkflowSelection.tsx
│   │   ├── inner-packaging/         # Inner packaging inspection subflow
│   │   └── [ScreenName].tsx
│   └── SDDG/                        # SDDG upload and processing screens
│       ├── SDDGUploadAndParse.tsx
│       └── [SDDG-specific].tsx
├── stores/
│   ├── hazProStore.ts              # Valtio proxy store definition
│   ├── hazProActions.ts            # Actions to mutate Valtio store
│   └── useHazProStore.ts           # Hook to use snapshot in components
├── contexts/
│   ├── HazProPreparerProvider/      # Preparer data context
│   │   ├── HazProValtioProvider.tsx # Database init and Valtio setup
│   │   └── reducer.ts
│   ├── HazProInspectorProvider/     # Inspector global context
│   ├── InspectionFormProvider/      # SDDG inspection workflow state
│   │   └── types.ts
│   ├── PreparerFormProvider/        # Preparer form state
│   ├── DataProvider/                # Shared data provider
│   ├── ShipmentsProvider/           # Shipments list provider
│   └── NavigationRefProvider/       # Navigation ref for imperative navigation
├── services/
│   ├── shipment/
│   │   ├── ShipmentDatabase.ts     # File system persistence (Expo FileSystem)
│   │   ├── MigrationService.ts     # Data migration utilities
│   │   └── ErrorHandlingService.ts # Centralized error logging and recovery
│   ├── inspection/                  # Inspection-specific business logic
│   └── sddg/                        # SDDG extraction and validation
│       ├── templateExtractor.ts    # Template-based field extraction
│       ├── anchorBasedExtractor.ts # Anchor-based field extraction
│       ├── anchorDetection.ts      # Anchor position detection
│       ├── anchorConfig.ts         # Anchor position definitions
│       ├── valueExtraction.ts      # OCR value parsing and normalization
│       ├── opencvCellDetection.ts  # OpenCV-based grid detection
│       ├── cellBuilder.ts          # Construct cells from detected lines
│       ├── lineUtils.ts            # Line detection and merging
│       ├── templateAutoAlignment.ts # Automatic template alignment
│       ├── adaptiveRegionDetection.ts # Region detection heuristics
│       ├── regionInference.ts      # Infer regions from context
│       ├── validators.ts           # SDDG field validators
│       └── __tests__/              # Service tests
├── types/
│   ├── index.ts                    # Core type exports
│   ├── sddg.ts                     # SDDG form and inspection types
│   ├── packagingStructure.ts       # Packaging data models
│   ├── innerPackaging.ts           # Inner packaging types
│   ├── dryIceInspection.ts         # Dry ice specific types
│   └── sddg-template.ts            # SDDG template structure
├── utils/
│   ├── validation/                  # Yup validation schemas
│   │   ├── shipmentSchema.ts
│   │   └── [domain]Schema.ts
│   ├── eligibility/                 # Material eligibility checking
│   ├── hazmat-compatibility-engine/ # Compatibility and segregation rules
│   ├── hooks/
│   │   └── useInputRefs.ts         # Input ref management
│   ├── navigation/                  # Navigation utilities
│   ├── sddg/                        # SDDG parsing utilities
│   ├── valtio/                      # Valtio utilities and type generation
│   ├── yjs/                         # Y.js CRDT utilities
│   ├── materialId/                  # Material ID lookup and generation
│   ├── shipment/                    # Shipment creation and manipulation
│   ├── labelingRequirements.ts      # Labeling rules
│   ├── markingRequirements.ts       # Marking/POP rules
│   ├── gasQuantityCalculator.ts     # Gas quantity math
│   └── [utility].ts
├── ml/
│   ├── components/                  # ML-specific UI components
│   │   ├── MLCamera.tsx
│   │   ├── DetectionOverlay.tsx
│   │   ├── ImageCropScreen.tsx
│   │   └── [Component].tsx
│   ├── services/                    # ML/OCR services
│   │   ├── ocrService.ts           # Tesseract.js and ExecutorchService wrapper
│   │   ├── imagePreprocess.ts      # Image normalization
│   │   ├── postprocess.ts          # OCR result postprocessing
│   │   └── executorchService.ts    # ExecutorchService integration
│   ├── types/                       # ML-specific types
│   │   └── ocr.ts                  # OCR result and analysis types
│   ├── config/                      # ML configuration
│   ├── hooks/                       # ML-specific hooks
│   ├── data/                        # ML training data and assets
│   └── theme/                       # ML-specific theming
├── hooks/
│   ├── useBenchmark.ts             # Performance benchmarking
│   ├── useShipmentDatabase.ts      # Shipment DB operations
│   ├── usePackageCodeValidation.ts # Package code validation
│   └── useRenderTracker.ts         # Render performance tracking
├── constants/
│   └── [domain].ts                 # Domain-specific constants
├── config/
│   └── [environment].ts            # Environment configuration
├── theming/
│   ├── index.ts                    # Theme definitions
│   └── [ThemeFile].ts
├── data/
│   └── [domain].json               # Static JSON data (materials, codes, etc)
├── templates/
│   ├── index.ts
│   └── [Template].ts               # Document template definitions
├── testScenarios/
│   └── [scenario]/                 # Test data and mock scenarios
├── mock/
│   └── [mockData].ts               # Mock data for development
├── hazardousMaterials/
│   └── [materials].ts              # Hazardous materials database
└── __mocks__/
    └── [mockedModule].ts           # Jest mocks
```

## Directory Purposes

**src/components/:**
- Purpose: React Native components for UI rendering
- Contains: Screens, wizards, modals, forms, reusable UI elements
- Key files: `MainLayoutNavigator.tsx`, `Inspector/`, `ui/index.ts`

**src/screens/:**
- Purpose: Full-screen components organized by workflow (preparer/inspector/sddg)
- Contains: Navigation stacks, role-specific workflows, screen implementations
- Key files: `preparer/index.ts` (barrel exports), `InspectorLayoutNavigator.tsx`

**src/stores/:**
- Purpose: Valtio global state store
- Contains: Proxy state definition, action dispatchers, hooks for accessing state
- Key files: `hazProStore.ts` (state definition), `hazProActions.ts` (mutations)

**src/contexts/:**
- Purpose: React Context API providers for form state and global data
- Contains: Provider components, reducer logic, type definitions
- Key files: `HazProValtioProvider.tsx`, `InspectionFormProvider/types.ts`

**src/services/:**
- Purpose: Business logic and external integrations
- Contains: Database access, error handling, SDDG extraction pipeline
- Key files: `shipment/ShipmentDatabase.ts`, `sddg/` (extraction services)

**src/types/:**
- Purpose: TypeScript type definitions for domain models
- Contains: Interfaces for shipments, inspections, SDDG data, packaging
- Key files: `sddg.ts`, `packagingStructure.ts`, `index.ts`

**src/utils/:**
- Purpose: Utility functions and business logic organized by domain
- Contains: Validation schemas, material compatibility, navigation logic, hooks
- Key files: `validation/`, `hazmat-compatibility-engine/`

**src/ml/:**
- Purpose: Machine learning and OCR functionality
- Contains: Image preprocessing, OCR service wrappers, ML components, analysis types
- Key files: `services/ocrService.ts`, `services/imagePreprocess.ts`

**src/hooks/:**
- Purpose: Custom React hooks for component logic
- Contains: Database operations, validation, performance tracking
- Key files: `useShipmentDatabase.ts`, `useRenderTracker.ts`

## Key File Locations

**Entry Points:**
- `src/App.tsx`: Root component with provider hierarchy and login logic
- `src/components/MainLayoutNavigator.tsx`: Preparer workflow stack
- `src/screens/inspector/InspectorLayoutNavigator.tsx`: Inspector workflow stack

**Configuration:**
- `tsconfig.json`: Path aliases (`@/*` → `src/*`)
- `src/config/`: Environment-specific configs
- `src/ml/config/`: ML model parameters

**Core Logic:**
- `src/stores/hazProActions.ts`: All Valtio state mutations
- `src/services/sddg/`: SDDG extraction pipeline
- `src/utils/hazmat-compatibility-engine/`: Material compatibility rules

**Testing:**
- `src/**/__tests__/`: Co-located test files
- `src/testScenarios/`: Integration test data
- `jest.config.js`: Test configuration (at project root)

## Naming Conventions

**Files:**
- Screens: PascalCase with "Screen" suffix (e.g., `ShipmentCreationScreen.tsx`)
- Components: PascalCase (e.g., `FormField.tsx`, `MainLayout.tsx`)
- Services: camelCase with descriptive names (e.g., `ShipmentDatabase.ts`, `ocrService.ts`)
- Utilities: camelCase with specific purpose (e.g., `gasQuantityCalculator.ts`)
- Types: PascalCase with "Type" or interface naming (e.g., `SDDGInspectionContext`)
- Hooks: camelCase starting with "use" (e.g., `useHazProStore.ts`)

**Directories:**
- Feature domains: PascalCase (e.g., `Inspector/`, `SDDG/`)
- Utility domains: camelCase (e.g., `validation/`, `hazmat-compatibility-engine/`)
- Service domains: camelCase (e.g., `shipment/`, `sddg/`)

**Exports:**
- Barrel exports: `index.ts` re-exports from same directory
- Example: `src/screens/preparer/index.ts` exports all preparer screens

## Where to Add New Code

**New Preparer Feature:**
- Primary code: `src/screens/preparer/[FeatureScreen].tsx`
- Supporting components: `src/components/preparer/[Component].tsx`
- Validation: `src/utils/validation/[feature]Schema.ts`
- Tests: `src/screens/preparer/__tests__/[Feature].test.tsx`

**New Inspector Feature:**
- Primary code: `src/screens/inspector/Inspector[Feature]Screen.tsx`
- Supporting components: `src/components/Inspector/[Component].tsx`
- Types: Add to `src/types/sddg.ts` or new `src/types/[feature].ts`
- Tests: `src/screens/inspector/__tests__/Inspector[Feature].test.tsx`

**New SDDG Extraction Component:**
- Implementation: `src/services/sddg/[extractor].ts`
- Configuration: `src/services/sddg/[config].ts`
- Types: `src/services/sddg/[types].ts`
- Tests: `src/services/sddg/__tests__/[extractor].test.ts`

**New Utility/Helper:**
- Location: `src/utils/[domain]/[utility].ts`
- Tests: `src/utils/[domain]/__tests__/[utility].test.ts`

**New Custom Hook:**
- Location: `src/hooks/use[Name].ts`
- Alternative: `src/utils/hooks/use[Name].ts` (for domain-specific hooks)

## Special Directories

**src/testScenarios/:**
- Purpose: Scenario-based test data for integration testing
- Generated: No
- Committed: Yes - provides reproducible test scenarios

**src/__mocks__/:**
- Purpose: Jest mock implementations for testing
- Generated: No
- Committed: Yes - necessary for test execution

**src/graphql/:**
- Purpose: GraphQL schema and code generation
- Generated: Partially (generated types)
- Committed: Yes - schema source files

**src/ml/data/:**
- Purpose: ML model assets and training data
- Generated: No
- Committed: Yes - necessary for model loading

---

*Structure analysis: 2026-01-30*
