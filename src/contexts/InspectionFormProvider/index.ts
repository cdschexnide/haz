/**
 * InspectionFormProvider Module
 * React Context for managing current inspection workflow state
 */

export {
  InspectionFormProvider,
  useInspectionForm,
  // Selector hooks for performance optimization
  useInspectionFormActions,
  useInspectionFrustrations,
  useVerificationCopy,
  useExtractedContent,
  useInspectorData,
  useWorkflowState,
  useReinspectionState,
  useMLAnalysisResults,
  usePackagePopMarking,
  usePackagePackagingType,
  useInspectionId,
} from './InspectionFormProvider';
export type {
  ChevronType,
  SDDGStepType,
  ReinspectionModeType,
  ReinspectionState,
  SDDGWorkflowState,
  InspectionFormState,
} from './types';
export { initialWorkflowState, initialInspectionContext } from './types';
