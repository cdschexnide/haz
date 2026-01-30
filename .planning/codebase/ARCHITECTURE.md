# Architecture

**Analysis Date:** 2026-01-30

## Pattern Overview

**Overall:** Multi-layered React Native application with clear separation of concerns using Stack Navigation, Context/Valtio state management, and domain-specific service layers.

**Key Characteristics:**
- Screen-based navigation using React Navigation (Stack, Drawer)
- Hybrid state management: Valtio for global preparer state, Context API for form states
- Service layer abstraction for database, file system, and data extraction
- ML/OCR subsystem for document scanning and field extraction
- Role-based UI (Preparer vs Inspector) with distinct workflows

## Layers

**Presentation Layer (UI):**
- Purpose: React Native UI components and screens that users interact with
- Location: `src/screens/`, `src/components/`
- Contains: Screen components, UI components, modals, wizards
- Depends on: Context providers, Valtio store, navigation hooks
- Used by: React Navigation for routing

**Navigation Layer:**
- Purpose: Route management and navigation stack orchestration
- Location: `src/components/MainLayoutNavigator.tsx`, `src/screens/inspector/InspectorLayoutNavigator.tsx`, `src/App.tsx`
- Contains: Stack navigators, screen registration, drawer configuration
- Depends on: React Navigation library, screen components
- Used by: Main app to structure UI flow

**State Management Layer:**
- Purpose: Global and form-level state persistence and synchronization
- Location: `src/stores/` (Valtio), `src/contexts/` (Context API)
- Contains: Valtio proxies, context providers, action dispatchers, form state
- Depends on: Database service, migration service
- Used by: All screens and components for data access

**Business Logic Layer:**
- Purpose: Domain-specific logic, validation, extraction, and processing
- Location: `src/utils/`, `src/services/`, `src/ml/`
- Contains: Validation rules, hazmat compatibility engine, OCR/ML services, data extraction
- Depends on: Type definitions, external libraries (Expo, OpenCV, TensorFlow)
- Used by: Screens, components, and each other

**Data Access Layer:**
- Purpose: File system and database operations
- Location: `src/services/shipment/ShipmentDatabase.ts`, `src/services/shipment/MigrationService.ts`
- Contains: SQLite-like persistence, file system operations, index management
- Depends on: Expo File System, error handling service
- Used by: State management layer, services

**ML/OCR Subsystem:**
- Purpose: Document scanning, text recognition, field extraction
- Location: `src/ml/`
- Contains: Image preprocessing, OCR engine wrappers, postprocessing, component overlays
- Depends on: Tesseract.js, ExecutorchService, image manipulation libraries
- Used by: SDDG extraction workflow, POP marking detection

## Data Flow

**Preparer Workflow:**

1. Login (App.tsx) → sets role and userData
2. ShipmentCreation → creates shipment, stores in Valtio store
3. MaterialID → identifies hazmat material
4. Quantity/Packaging → enters details
5. Labeling/Marking → applies hazmat markings
6. Certification → preparer signs
7. Save to Database → ShipmentDatabase persists shipment

**Inspector Workflow:**

1. Login → sets role
2. InspectorHome → lists available shipments
3. SDDGUpload/MLDetection → scans SDDG document
4. SDDGVerification → reviews extracted fields
5. PackageInspection → checks labeling and marking
6. Frustration → marks non-compliant items
7. Reinspection → corrects previous frustrations
8. Complete → marks inspection done

**State Management:**

- Global Preparer State: `hazProStore` (Valtio) — shipment data, current preparer info, shipments index
- Global Inspector State: `HazProInspectorProvider` (Context) — current inspection session
- Form State: `InspectionFormProvider` (Context) — SDDG workflow state, verification progress
- Transient State: Component-level useState for UI interactions (modals, selections)

**SDDG Extraction Pipeline:**

1. Image Upload → stored in app file system
2. Image Preprocessing → resize, normalize (imagePreprocess.ts)
3. OCR Processing → Tesseract.js or ExecutorchService (ocrService.ts)
4. Field Detection → anchor-based or template-based extraction (anchorBasedExtractor.ts, templateExtractor.ts)
5. Value Extraction → parse OCR results into SDDG fields (valueExtraction.ts)
6. Cell/Line Detection → OpenCV-based grid analysis (opencvCellDetection.ts, lineUtils.ts)
7. Postprocessing → semantic parsing, validation (postprocess.ts)
8. Context Storage → results stored in InspectionFormProvider

## Key Abstractions

**ShipmentDatabase:**
- Purpose: Abstract file system persistence for shipment data
- Examples: `src/services/shipment/ShipmentDatabase.ts`
- Pattern: Singleton with cache, async/await interface

**HazMatCompatibilityEngine:**
- Purpose: Determine valid packaging combinations and material compatibility
- Examples: `src/utils/hazmat-compatibility-engine/`
- Pattern: JSON-based rule engine with validation functions

**OCRService:**
- Purpose: Unified interface to OCR engines (Tesseract.js, ExecutorchService)
- Examples: `src/ml/services/ocrService.ts`
- Pattern: Adapter pattern wrapping multiple engine implementations

**TemplateExtractor:**
- Purpose: Extract SDDG fields from document templates using known field positions
- Examples: `src/services/sddg/templateExtractor.ts`
- Pattern: Position-based extraction with fallback to anchor detection

**AnchorBasedExtractor:**
- Purpose: Extract SDDG fields using visual anchors (field labels) as reference points
- Examples: `src/services/sddg/anchorBasedExtractor.ts`
- Pattern: Anchor detection → coordinate mapping → value extraction

**ValidationSchema:**
- Purpose: Define and enforce data constraints using Yup
- Examples: `src/utils/validation/`
- Pattern: Centralized schema definitions with form resolver integration

## Entry Points

**Application Entry:**
- Location: `src/App.tsx`
- Triggers: App start
- Responsibilities: Provider setup, login/authentication flow, role-based initial route selection

**Preparer Workflow Entry:**
- Location: `src/components/MainLayoutNavigator.tsx`
- Triggers: Preparer role selected
- Responsibilities: Stack navigation setup for preparer screens

**Inspector Workflow Entry:**
- Location: `src/screens/inspector/InspectorLayoutNavigator.tsx`
- Triggers: Inspector role selected
- Responsibilities: Stack navigation setup for inspector screens, shipment loading

**SDDG Upload Entry:**
- Location: `src/screens/inspector/InteractiveSDDGComplianceScreen.tsx` or upload screen
- Triggers: Inspector initiates SDDG scanning
- Responsibilities: Image capture/upload, routing to ML pipeline

## Error Handling

**Strategy:** Layered error handling with recovery attempts

**Patterns:**
- Database errors: `ErrorHandlingService` logs to file system, provides recovery suggestions
- Validation errors: Form validation via Yup with field-level error messages
- OCR errors: Fallback mechanisms (template → anchor detection), manual entry option
- Network/File System: Async try-catch with user-facing error screens (`DatabaseErrorDisplay.tsx`)

## Cross-Cutting Concerns

**Logging:**
- Console logging for development
- ErrorHandlingService for persistence (`src/services/shipment/ErrorHandlingService.ts`)
- Redux DevTools integration for Valtio (development only)

**Validation:**
- Yup schema-based validation in `src/utils/validation/`
- Form-level validation via react-hook-form resolvers
- Domain-specific validation (hazmat compatibility, packaging codes)

**Authentication:**
- Login screen captures role and user data
- LogoutContext manages logout flow
- User data stored in Valtio and InspectionFormProvider per role

---

*Architecture analysis: 2026-01-30*
