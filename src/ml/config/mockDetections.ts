/**
 * Mock Detections Configuration
 *
 * Configures mock ML detections for demo scenarios where the model
 * hasn't been trained on certain label types (e.g., Military Shipping Labels).
 *
 * Mock detections are injected based on the inspection's UN number,
 * allowing different demo scenarios to have tailored mock detections.
 */

interface MockDetectionEntry {
  className: string;
  classId: number;
  category: string;
  confidence: number;
  box: { x: number; y: number; width: number; height: number };
}

interface MockDetectionConfig {
  unNumber: string;
  detections: MockDetectionEntry[];
}

/**
 * Mock detections keyed by UN number for demo scenarios.
 *
 * To add a new demo scenario:
 * 1. Add an entry with the UN number from your test SDDG
 * 2. Configure the detections array with className, classId, confidence, and bounding box
 * 3. Tune the box coordinates by running the demo and adjusting as needed
 */
export const MOCK_DETECTIONS: MockDetectionConfig[] = [
  {
    unNumber: "UN0247", // AMMUNITION, INCENDIARY
    detections: [
      {
        className: "militaryShippingLabel",
        classId: 97,
        category: "general_marking",
        confidence: 0.89,
        // Bounding box coordinates - tune these to match your demo image
        // x, y = top-left corner; width, height = dimensions
        box: { x: 1970, y: 100, width: 680, height: 920 },
      },
    ],
  },
  // Add more UN numbers for other demo scenarios:
  // {
  //   unNumber: "UN1234",
  //   detections: [
  //     {
  //       className: "militaryShippingLabel",
  //       classId: 97,
  //       category: "general_marking",
  //       confidence: 0.91,
  //       box: { x: 100, y: 50, width: 180, height: 220 },
  //     },
  //   ],
  // },
];

/**
 * Get mock detections for a given UN number.
 *
 * @param unNumber - The UN identification number (e.g., "UN0247")
 * @returns Array of mock detections if configured, null otherwise
 */
export function getMockDetectionsForUN(
  unNumber: string
): MockDetectionEntry[] | null {
  if (!unNumber) return null;

  // Normalize UN number format (handle with/without "UN" prefix)
  const normalized = unNumber.toUpperCase().startsWith("UN")
    ? unNumber.toUpperCase()
    : `UN${unNumber}`;

  const config = MOCK_DETECTIONS.find((m) => m.unNumber === normalized);
  return config?.detections || null;
}
