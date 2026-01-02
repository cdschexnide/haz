import colors from "../../src/theming/colors";
import { SatUnsatNa } from "../../types";

interface CheckListButtonsConfig {
  yesNoButtons: SatUnsatNa[];
  yesNoButtonStyles: {
    backgroundColor?: string;
  }[];
  yesNoNaButtons: SatUnsatNa[];
  yesNoNaButtonStyles: {
    backgroundColor?: string;
  }[];
}
export const getChecklistButtons = (): CheckListButtonsConfig => {
  const yesNoButtons = [SatUnsatNa.SAT, SatUnsatNa.UNSAT];
  const yesNoNaButtons = [SatUnsatNa.NA, ...yesNoButtons];
  const styleMap: Record<SatUnsatNa, { backgroundColor?: string }> = {
    [SatUnsatNa.SAT]: { backgroundColor: colors.green },
    [SatUnsatNa.UNSAT]: { backgroundColor: colors.noRed },
    [SatUnsatNa.NA]: { backgroundColor: colors.naGray },
    [SatUnsatNa.FRUSTRATED_SAT]: {},
    [SatUnsatNa.FRUSTRATED]: {},
  };
  const yesNoButtonStyles = yesNoButtons.map(choice => styleMap[choice]);
  const yesNoNaButtonStyles = yesNoNaButtons.map(choice => styleMap[choice]);
  return {
    yesNoButtons,
    yesNoButtonStyles,
    yesNoNaButtons,
    yesNoNaButtonStyles,
  };
};
