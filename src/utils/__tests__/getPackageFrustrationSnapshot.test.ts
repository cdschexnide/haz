import { getPackageFrustrationSnapshot } from "../getPackageFrustrationSnapshot";

test("snapshot groups ids by category and detects any frustration", () => {
  const snapshot = getPackageFrustrationSnapshot({
    packageFrustrations: [
      { category: "packaging", itemId: "a28-1" },
      { category: "label", itemId: "label-2-orientation" },
      { category: "pop", itemId: "pop-field-b" },
    ],
  });

  expect(snapshot.hasAny).toBe(true);
  expect(snapshot.categories.sort()).toEqual(
    ["label", "packaging", "pop"].sort()
  );
  expect(snapshot.ids).toEqual([
    "a28-1",
    "label-2-orientation",
    "pop-field-b",
  ]);
  expect(snapshot.idsByCategory.packaging).toEqual(["a28-1"]);
});
