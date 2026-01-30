# External Integrations

**Analysis Date:** 2026-01-30

## APIs & External Services

**Local Development LLM (Ollama):**
- Service: Ollama (local LLM server)
- What it's used for: SDDG form extraction and data parsing via local language model
- SDK/Client: HTTP fetch-based client
- Configuration: `src/config/ollama.config.ts`
- Model: `gemma-sddg-v3` (custom fine-tuned model)
- Endpoints:
  - Base URL: `http://localhost:11434` (iOS Simulator) or `http://192.168.12.210:11434` (Android/Physical)
  - Model timeout: 60s
  - Temperature: 0.1 (low randomness for deterministic parsing)
  - Max tokens: 3000

**Firebase/Google ML Kit (Integrated via Expo plugins):**
- Document Scanner: `@infinitered/react-native-mlkit-document-scanner`
- Text Recognition: `@react-native-ml-kit/text-recognition` (OCR)
- Purpose: On-device ML for document scanning and text extraction
- Auth: Native integration (no API key required)

## Data Storage

**Databases:**
- Type: SQLite (on-device)
- Connection: Via `expo-sqlite` API
- Database name: `hazpro_inspector.db`
- Client: `expo-sqlite` (async SQL execution)
- Schema: `src/contexts/DataProvider/schema.ts`
- Migrations: `src/contexts/DataProvider/migrations.ts` (handles AsyncStorage→SQLite migration)
- Tables:
  - `inspector_shipments` - Inspection records with metadata
  - `migrations` - Track schema versions and migrations

**File Storage:**
- Local filesystem only
- Via `expo-file-system` and `react-native-blob-util`
- Used for: Temporary image caching, PDF generation, document storage
- No cloud integration detected

**Caching:**
- In-memory Valtio store (`src/stores/hazProStore.ts`) for application state
- SQLite for persistent data
- No separate caching service (Redis, Memcached, etc.)

## Authentication & Identity

**Auth Provider:**
- Custom implementation (no third-party provider detected)
- Approach:
  - No OAuth/SSO integration
  - Form-based validation using `react-hook-form` and `yup`
  - Inspector/Preparer roles managed via context (`src/contexts/HazProInspectorProvider`, `src/contexts/HazProPreparerProvider`)
  - No JWT or session management detected in integrations

## Monitoring & Observability

**Error Tracking:**
- No external service detected (Sentry, Bugsnag, etc.)
- Local console logging and error states in contexts

**Logs:**
- Console logging approach
- Performance tracking utility at `src/utils/performanceUtils.ts`
- Conditional logging in development mode via `console.log`
- No log aggregation service

## CI/CD & Deployment

**Hosting:**
- Expo EAS Build (for managed builds)
- Local builds supported for Android/iOS
- No backend API server detected (client-only app)

**CI Pipeline:**
- None detected
- No GitHub Actions, GitLab CI, or other CI configuration

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Computer Vision & ML

**OpenCV:**
- Library: `react-native-fast-opencv 0.4.7`
- Purpose: Cell detection and line detection in SDDG forms
- Exports: `OpenCV`, `ObjectType`, `ColorConversionCodes`, `ThresholdTypes`, `AdaptiveThresholdTypes`
- Usage: `src/services/sddg/opencvCellDetection.ts`

**Tesseract OCR:**
- Library: `tesseract.js 6.0.1`
- Purpose: Fallback text recognition (secondary to ML Kit)
- Execution: JavaScript-based OCR engine
- Usage: Not yet integrated in main extraction pipeline

**PaddleOCR:**
- Engine: `src/services/sddg/paddleOCREngine.ts`
- Purpose: Text extraction from image regions
- Approach: Server-side OCR (if backend integrated), currently placeholder

**ExecuTorch:**
- Library: `react-native-executorch 0.5.6`
- Purpose: On-device PyTorch model inference
- Model formats supported: `.pte` (ExecuTorch), `.onnx`, `.tflite`
- Metro config extensions: `metro.config.js` includes `.pte`, `.onnx`, `.tflite`, `.bin` as asset extensions

## GraphQL

**Schema:**
- Location: `src/graphql/schema.graphql`
- Linting: Configured via `.graphql-schema-linterrc`
- Tooling: `graphql-tools 9.0.22`, `graphql 16.12.0`
- Code generation: `src/generateFromSchema.ts`, `src/code-generators/generate-ydoc-types.ts`
- Current status: Schema defined but no active GraphQL API integration

## Business Logic & Rules

**Hazmat Compatibility Engine:**
- Location: `src/utils/hazmat-compatibility-engine/`
- Engine type: JSON Rules Engine (`json-rules-engine 7.3.1`)
- Purpose: Determine hazmat incompatibility, packing requirements, labeling rules
- Files:
  - `engine.ts` - Base rule evaluation
  - `optimizedEngine.ts` - Performance-optimized version
  - `incompatibilityEngine.ts` - Hazmat incompatibility checks
  - `rules.ts` - Rule definitions
  - `engineTypes.ts` - Type definitions
  - `engineHelperFunctions.ts` - Utility functions

**Hazardous Materials List:**
- Location: `src/hazardousMaterials/hazardousMaterialsList.ts`
- Purpose: Reference data for UN numbers, proper shipping names, classifications
- Integration: Used in SDDG extraction and validation

## Environmental & Data Integration

**Lookup Functions (Server):**
- Location: `server/lookupFunctions/` (external dependency)
- Functions:
  - `hazProContextLookup` - Hazmat context and classification
  - `dotCylinderSpecifications` - DOT cylinder specifications
  - `hazardousSubstanceCriteria` - Reportable quantity criteria

**Data References (Server):**
- Location: `server/data/` (external dependency)
- References:
  - `grandfatheredPackagingParagraphReferences` - Packaging regulations
  - `tableA27_1` - Explosive cross-references

**Informative Statements (Server):**
- Location: `server/informativeStatements/informativeStatements.ts` (external dependency)
- Content: Special provisions, marking/labeling requirements

## Environment Configuration

**Required env vars:**
- None detected (hardcoded configuration)
- Runtime configuration via TypeScript config files

**Secrets location:**
- No secrets management detected
- Ollama URL is hardcoded for development
- No API keys or credentials in codebase

## Media & Print

**Print Functionality:**
- Library: `expo-print 14.1.4`
- Purpose: Print SDDG forms and shipper's declarations
- Implementation: PDF generation via `pdf-lib`

**Sharing:**
- Library: `expo-sharing 13.1.5`
- Purpose: Native share functionality (email, messaging, etc.)

## Icons & Assets

**Vector Icons:**
- Library: `@expo/vector-icons 15.0.3`
- Included icon sets: Material, Feather, and others
- Location: Used throughout UI components

---

*Integration audit: 2026-01-30*
