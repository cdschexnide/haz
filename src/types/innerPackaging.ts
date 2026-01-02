/**
 * Inner Packaging Inspection Types
 *
 * Type definitions for inspecting inner packagings of combination packaging
 * per AFMAN 24-604, Attachment 28, Section A28.2
 */

/**
 * Container types for outer packaging
 * Mapped to AFMAN 24-604 A28.2.2 container categories
 */
export type ContainerType =
  | 'fiberboard-box'      // A28.2.2.1 - Fiberboard boxes
  | 'wood-box'            // A28.2.2.3 - Wood boxes
  | 'drum'                // A28.2.2.5 - Drums (combination package or overpack)
  | 'overpack'            // A28.2.2.7 - Overpacks
  | 'jerrican'            // A28.2.2.9 - UN Specification Jerricans
  | 'non-specification'   // A28.2.2.8 - Non-specification packaging
  | null;

/**
 * Individual inspection item for inner packaging checklist
 * Based on A28.2.1.2 Combination Packaging inspection areas
 */
export interface InnerPackagingInspectionItem {
  /** Unique identifier for the inspection item */
  id: string;

  /** Human-readable label for display */
  label: string;

  /** Inspection status */
  status: 'pass' | 'fail' | 'not-applicable' | 'pending';

  /** Optional inspector notes for this specific item */
  notes?: string;

  /** AFMAN reference for this inspection requirement */
  afmanReference: string;
}

/**
 * Complete inner packaging inspection data
 * Tracks the entire inspection workflow from opening to closing
 */
export interface InnerPackagingInspectionData {
  /** Whether the package has inner packagings requiring inspection */
  hasInnerPackaging: boolean | null;

  /** Type of outer container being opened (auto-detected or manually selected) */
  containerType: ContainerType;

  /** Inspection items checklist (A28.2.1.2.1 - A28.2.1.2.6) */
  inspectionItems: InnerPackagingInspectionItem[];

  /** Timestamp when container was opened */
  openedAt: Date | null;

  /** Timestamp when inspection was performed */
  inspectedAt: Date | null;

  /** Timestamp when container was closed */
  closedAt: Date | null;

  /** Whether a new shipper's certification is required after reclosure */
  newCertificationRequired: boolean;

  /** Description of how the container was reclosed (relevant for certification determination) */
  reclosureMethod: string;

  /** General notes from inspector about inner packaging inspection */
  inspectorNotes: string;

  /** Overall compliance status of inner packaging inspection */
  overallStatus: 'compliant' | 'non-compliant' | 'pending' | null;
}
