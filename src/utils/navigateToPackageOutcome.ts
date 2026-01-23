import { getPackageFrustrationSnapshot } from "./getPackageFrustrationSnapshot";

export const navigateToPackageOutcome = (
  navigation: any,
  inspection: { packageFrustrations?: any[] } | null | undefined
) => {
  const snapshot = getPackageFrustrationSnapshot(inspection);
  navigation.navigate(
    snapshot.hasAny
      ? "PackageFrustrationSummary"
      : "PackageInspectionCompleteScreen"
  );
};
