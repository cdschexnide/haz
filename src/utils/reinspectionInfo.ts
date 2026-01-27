import {
  FrustrationRecord,
  PackageFrustrationRecord,
} from "@/types/sddg";

export const getLatestReinspectionInfo = ({
  sddgFrustrations,
  packageFrustrations,
  resolvedSddgFrustrations,
  resolvedPackageFrustrations,
}: {
  sddgFrustrations: FrustrationRecord[];
  packageFrustrations: PackageFrustrationRecord[];
  resolvedSddgFrustrations: FrustrationRecord[];
  resolvedPackageFrustrations: PackageFrustrationRecord[];
}): { latestDate: Date | null; latestInspector: string } => {
  let latestDate: Date | null = null;
  let latestInspector = "";

  const considerAttempts = (
    attempts: { date: Date; inspector: string }[] | undefined
  ) => {
    if (!attempts?.length) return;

    const lastAttempt = attempts[attempts.length - 1];
    const attemptDate = new Date(lastAttempt.date);

    if (!latestDate || attemptDate > latestDate) {
      latestDate = attemptDate;
      latestInspector = lastAttempt.inspector || "";
    }
  };

  sddgFrustrations.forEach(frustration => {
    considerAttempts(frustration.reinspectionHistory);
  });

  packageFrustrations.forEach(frustration => {
    considerAttempts(frustration.reinspectionHistory);
  });

  resolvedSddgFrustrations.forEach(frustration => {
    considerAttempts(frustration.reinspectionHistory);
  });

  resolvedPackageFrustrations.forEach(frustration => {
    considerAttempts(frustration.reinspectionHistory);
  });

  return { latestDate, latestInspector };
};
