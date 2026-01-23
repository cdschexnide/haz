type PackageFrustration = { category: string; itemId: string };

type PackageFrustrationSnapshot = {
  hasAny: boolean;
  categories: string[];
  ids: string[];
  idsByCategory: Record<string, string[]>;
};

export const getPackageFrustrationSnapshot = (
  inspection: { packageFrustrations?: PackageFrustration[] } | null | undefined
): PackageFrustrationSnapshot => {
  const frustrations = inspection?.packageFrustrations || [];
  const idsByCategory: Record<string, string[]> = {};

  frustrations.forEach(frustration => {
    if (!idsByCategory[frustration.category]) {
      idsByCategory[frustration.category] = [];
    }
    idsByCategory[frustration.category].push(frustration.itemId);
  });

  return {
    hasAny: frustrations.length > 0,
    categories: Object.keys(idsByCategory),
    ids: frustrations.map(f => f.itemId),
    idsByCategory,
  };
};
