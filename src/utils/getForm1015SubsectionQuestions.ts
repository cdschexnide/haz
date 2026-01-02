import { HazProInspectorContext } from "../../src/contexts/HazProInspectorProvider/reducer";
import { Form1015Subsection, WorkflowFieldContext } from "../../types";

export function getSubsectionQuestions(
  inspectorContext: HazProInspectorContext,
  subsection: Form1015Subsection
): WorkflowFieldContext[] {
  const allQuestions = inspectorContext.form1015Questions;

  switch (subsection) {
    case Form1015Subsection.SDDG:
      return allQuestions.slice(0, 36); // 0 through 35 inclusive

    case Form1015Subsection.PACKAGING:
      return allQuestions.slice(36, 50); // 36 through 49 inclusive

    case Form1015Subsection.LABELS_AND_MARKING: {
      const isRadioactive =
        inspectorContext.hazardousMaterial?.hazclassDiv?.startsWith("7");
      if (isRadioactive) {
        return allQuestions.slice(52, 75); // 52 through 74 inclusive
      } else {
        const range1 = allQuestions.slice(52, 68); // 52 through 67 inclusive
        const range2 = allQuestions.slice(70, 75); // 70 through 74 inclusive
        return [...range1, ...range2];
      }
    }

    case Form1015Subsection.VEHICLES_AND_EQUIPMENT:
      return allQuestions.slice(75, 86); // 75 through 85 inclusive

    default:
      return [];
  }
}
