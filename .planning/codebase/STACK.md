# Technology Stack

**Analysis Date:** 2026-01-30

## Languages

**Primary:**
- TypeScript 5.8.3 - Application code and all source files
- JavaScript - Configuration files and some build utilities
- GraphQL - Schema definition for data modeling

**Secondary:**
- Kotlin - Android native code (in `/android` directory)
- Swift - iOS native code (in `/ios` directory)
- SQL - Database schemas and migrations via SQLite

## Runtime

**Environment:**
- Node.js 18.20.8 - Development and build-time runtime
- React Native 0.79.3 - Mobile application framework
- Expo 53.0.11 - React Native development platform and build tooling

**Package Manager:**
- npm 10.8.2
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- Expo 53.0.11 - React Native development platform, simplifies native module management and deployment
- React 19.0.0 - UI library and component framework
- React Native 0.79.3 - Native mobile application framework

**Navigation:**
- @react-navigation/native 7.1.9 - Navigation state management
- @react-navigation/stack 7.3.2 - Stack navigation support
- @react-navigation/drawer 7.3.12 - Drawer navigation support

**UI Components:**
- react-native-paper 5.14.1 - Material Design 3 components
- @rneui/base 4.0.0-rc.7 - React Native Elements base components
- @rneui/themed 4.0.0-rc.8 - React Native Elements themed components
- rneui 1.0.0-stable.0 - React Native Elements unified package
- expo-linear-gradient 14.0.2 - Linear gradient component

**Testing:**
- Jest 29.7.0 - Unit and integration test runner
- jest-expo 53.0.0 - Expo-specific Jest configuration and utilities
- @testing-library/react-native 12.4.0 - React Native component testing utilities
- react-test-renderer 19.0.0 - React component snapshot testing

**Build/Dev:**
- TypeScript 5.8.3 - Type checking and compilation
- Babel 7.25.2 - JavaScript transpilation with Expo preset
- Metro - Module bundler for React Native (via Expo)
- Vite - Local web build tool (for web platform only, via `vite.config.local.js`)
- ts-node 10.9.2 - TypeScript execution in Node.js
- tsx 4.20.6 - TypeScript executor for code generation scripts

## Key Dependencies

**Critical:**
- valtio 2.2.0 - Lightweight proxy-based state management library; primary state store (`src/stores/hazProStore.ts`)
- expo-sqlite 15.2.14 - SQLite database for local data persistence; critical for inspection data storage
- react-hook-form 7.56.3 - Form state management and validation
- yup 1.6.1 - Schema validation for form data

**Camera & Vision:**
- expo-camera 16.1.7 - Camera access for hazmat label scanning
- @infinitered/react-native-mlkit-document-scanner 3.1.0 - ML Kit document scanner plugin
- @infinitered/react-native-mlkit-core 3.1.0 - ML Kit core library
- @react-native-ml-kit/text-recognition 2.0.0 - OCR text recognition via ML Kit
- react-native-fast-opencv 0.4.7 - OpenCV bindings for computer vision (cell detection, image processing)
- react-native-document-scanner-plugin 1.0.1 - Document scanning with edge detection
- tesseract.js 6.0.1 - Fallback OCR engine for text recognition

**Image & PDF Processing:**
- expo-image-manipulator 13.1.7 - Image resizing and transformation
- expo-image 2.3.0 - Optimized image component
- jpeg-js 0.4.4 - JPEG image encoding/decoding
- pdf-lib 1.17.1 - PDF document generation and manipulation
- react-native-view-shot 4.0.3 - Screenshot capture utility
- react-native-svg 15.11.2 - SVG rendering support

**ML/AI:**
- react-native-executorch 0.5.6 - ExecuTorch model inference (PyTorch models in `.pte` format)
- json-rules-engine 7.3.1 - Hazmat compatibility and requirements rules engine

**Data & Storage:**
- @react-native-async-storage/async-storage 2.2.0 - Legacy key-value storage (being migrated to SQLite)
- react-native-blob-util 0.22.2 - File system access and blob handling
- expo-file-system 18.1.11 - File system operations and asset access

**Utilities:**
- lodash 4.17.21 - Utility functions for arrays, objects, and functional programming
- convert-units 2.3.4 - Unit conversion for quantity calculations
- crypto-js 4.2.0 - Cryptographic functions (hashing, encryption)
- qrcode 1.5.4 - QR code generation
- react-native-qrcode-svg 6.3.16 - SVG-based QR code component

**Gestures & Animation:**
- react-native-gesture-handler 2.24.0 - Gesture recognition and handling
- react-native-reanimated 3.17.4 - High-performance animation library

**Other:**
- react-native-autocomplete-dropdown 5.0.0 - Autocomplete input component
- react-native-elements 3.4.3 - UI component library
- react-native-pdf 6.7.7 - PDF viewer component
- react-native-signature-canvas 4.7.4 - Digital signature capture
- react-native-webview 13.13.5 - WebView component for embedded web content
- graphql-tools 9.0.22 - GraphQL utilities and schema utilities
- graphql 16.12.0 - GraphQL query language and tools
- expo-print 14.1.4 - Print functionality
- expo-sharing 13.1.5 - Native share functionality
- expo-clipboard 8.0.8 - Clipboard access
- expo-document-picker 13.1.5 - Document selection
- expo-image-picker 16.1.4 - Photo/gallery picker
- expo-media-library 17.1.7 - Media library access
- expo-font 14.0.9 - Custom font loading
- expo-constants 18.0.10 - App configuration constants
- expo-dev-client 5.2.0 - Development build utilities
- expo-status-bar 2.2.3 - Status bar management
- expo-asset 12.0.9 - Asset management
- expo-blur 14.0.3 - Blur effect component
- expo-system-ui 5.0.8 - System UI customization
- @expo/vector-icons 15.0.3 - Icon library (Material, Feather, etc.)
- ts-morph 27.0.2 - TypeScript AST manipulation (for code generation)

## Configuration

**Environment:**
- Development: Uses hardcoded IP addresses for Ollama local LLM integration (see `src/config/ollama.config.ts`)
  - iOS Simulator: `http://localhost:11434`
  - Android: `http://192.168.12.210:11434`
  - Physical devices: `http://192.168.12.210:11434`
- No `.env` files detected; configuration is code-based
- Platform detection via `react-native` Platform API

**Build:**
- `tsconfig.json` - TypeScript compiler configuration with path aliases (`@/*` → `src/*`)
- `babel.config.js` - Babel preset configured for Expo
- `metro.config.js` - Metro bundler config with model file asset extensions (`.pte`, `.onnx`, `.tflite`, `.bin`)
- `jest.config.js` - Jest testing configuration with jest-expo preset
- `app.json` - Expo app configuration with Android/iOS-specific settings and permissions
- `.graphql-schema-linterrc` - GraphQL schema linting rules

## Platform Requirements

**Development:**
- macOS (primary platform based on file paths)
- Node.js 18.x
- Xcode (for iOS development)
- Android SDK (for Android development)
- Expo CLI
- Ruby (for iOS CocoaPods)

**Production:**
- iOS 14+ (via Expo)
- Android 8+ (API 26+)
- Deployment via Expo EAS Build or local builds

## Database

**Primary:** SQLite 3 (via `expo-sqlite 15.2.14`)
- Database: `hazpro_inspector.db`
- Schema version: 2
- Tables: `inspector_shipments`, `migrations`
- Uses async SQLite operations

**Legacy:** AsyncStorage (being phased out in favor of SQLite)
- Migration path: `src/contexts/DataProvider/migrations.ts`

---

*Stack analysis: 2026-01-30*
