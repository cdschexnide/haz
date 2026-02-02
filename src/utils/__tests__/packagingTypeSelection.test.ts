import { getAllowedPackagingTypes } from "@/utils/getAllowedPackagingTypes";

describe("getAllowedPackagingTypes - Attachment 5 (A5)", () => {
  const cases: Array<[string, Array<"single" | "combination" | "composite">]> = [
    ["A5.4.", ["combination"]],
    ["A5.5.", ["single", "combination"]],
    ["A5.6.", ["combination"]],
    ["A5.7.", ["combination"]],
    ["A5.8.", ["single", "combination"]],
    ["A5.9.", ["combination"]],
    ["A5.10.", ["combination", "composite"]],
    ["A5.11.", ["combination"]],
    ["A5.12.", ["single"]],
    ["A5.13.", ["combination"]],
    ["A5.14.", ["combination"]],
    ["A5.15.", ["single", "combination"]],
    ["A5.16.", ["combination"]],
    ["A5.17.", ["combination"]],
    ["A5.18.", ["combination"]],
    ["A5.19.", ["combination"]],
    ["A5.20.", ["combination"]],
    ["A5.21.", ["combination"]],
    ["A5.22.", ["combination"]],
    ["A5.23.", ["combination"]],
    ["A5.24.", ["combination"]],
    ["A5.25.", ["combination"]],
    ["A5.26.", ["combination", "composite"]],
    ["A5.27.", ["combination"]],
  ];

  test.each(cases)(
    "limits %s to expected packaging types",
    (paragraph, expected) => {
      expect(
        getAllowedPackagingTypes({
          packagingParagraph: paragraph,
          hasA2Restriction: false,
        })
      ).toEqual(expected);
    }
  );

  test("A5.5. excludes single packaging for UN0343", () => {
    expect(
      getAllowedPackagingTypes({
        packagingParagraph: "A5.5.",
        hasA2Restriction: false,
        unIdNo: "UN0343",
        properShippingName: "NITROCELLULOSE, PLASTICIZED",
      })
    ).toEqual(["combination"]);
  });
});

describe("getAllowedPackagingTypes - Attachment 7 (A7)", () => {
  const cases: Array<[string, Array<"single" | "combination" | "composite">]> = [
    ["A7.2.", ["single", "combination", "composite"]],
    ["A7.3.", ["single"]],
    ["A7.4.", ["single"]],
    ["A7.5.", ["single", "combination"]],
    ["A7.6.", ["combination"]],
    ["A7.7.", ["combination"]],
    ["A7.8.", ["single"]],
    ["A7.9.", ["single", "combination"]],
    ["A7.10.", ["single", "combination", "composite"]],
    ["A7.11.", ["single"]],
    ["A7.12.", ["single", "combination"]],
  ];

  test.each(cases)(
    "limits %s to expected packaging types",
    (paragraph, expected) => {
      expect(
        getAllowedPackagingTypes({
          packagingParagraph: paragraph,
          hasA2Restriction: false,
        })
      ).toEqual(expected);
    }
  );
});

describe("getAllowedPackagingTypes - Attachment 8 (A8)", () => {
  const cases: Array<[string, Array<"single" | "combination" | "composite">]> = [
    ["A8.2.", ["single", "combination", "composite"]],
    ["A8.3.", ["single", "combination", "composite"]],
    ["A8.4.", ["single", "combination", "composite"]],
    ["A8.5.", ["single", "combination"]],
    ["A8.6.", ["single"]],
    ["A8.7.", ["single", "combination"]],
    ["A8.8.", ["single", "combination"]],
    ["A8.9.", ["single"]],
    ["A8.10.", ["combination"]],
    ["A8.11.", ["single", "combination"]],
    ["A8.12.", ["combination"]],
    ["A8.13.", ["single"]],
    ["A8.14.", ["combination"]],
    ["A8.15.", ["single", "combination"]],
    ["A8.16.", ["single", "combination"]],
    ["A8.17.", ["combination"]],
    ["A8.18.", ["single"]],
    ["A8.19.", ["combination"]],
    ["A8.20.", ["single"]],
    ["A8.21.", ["single"]],
    ["A8.22.", ["single", "combination"]],
  ];

  test.each(cases)(
    "limits %s to expected packaging types",
    (paragraph, expected) => {
      expect(
        getAllowedPackagingTypes({
          packagingParagraph: paragraph,
          hasA2Restriction: false,
        })
      ).toEqual(expected);
    }
  );
});

describe("getAllowedPackagingTypes - Attachment 9 (A9)", () => {
  const cases: Array<[string, Array<"single" | "combination" | "composite">]> = [
    ["A9.5.", ["single", "combination", "composite"]],
    ["A9.6.", ["single", "combination", "composite"]],
    ["A9.7.", ["single"]],
    ["A9.8.", ["single"]],
    ["A9.9.", ["single", "combination"]],
    ["A9.10.", ["single"]],
  ];

  test.each(cases)(
    "limits %s to expected packaging types",
    (paragraph, expected) => {
      expect(
        getAllowedPackagingTypes({
          packagingParagraph: paragraph,
          hasA2Restriction: false,
        })
      ).toEqual(expected);
    }
  );
});

describe("getAllowedPackagingTypes - Attachment 10 (A10)", () => {
  const cases: Array<[string, Array<"single" | "combination" | "composite">]> = [
    ["A10.4.", ["single", "combination", "composite"]],
    ["A10.5.", ["single", "combination", "composite"]],
    ["A10.6.", ["single", "combination"]],
    ["A10.7.", ["combination"]],
    ["A10.8.", ["combination"]],
    ["A10.9.", ["combination"]],
    ["A10.10.", ["single"]],
    ["A10.11.", ["single", "combination", "composite"]],
    ["A10.12.", ["single", "combination", "composite"]],
    ["A10.13.", ["single", "combination"]],
  ];

  test.each(cases)(
    "limits %s to expected packaging types",
    (paragraph, expected) => {
      expect(
        getAllowedPackagingTypes({
          packagingParagraph: paragraph,
          hasA2Restriction: false,
        })
      ).toEqual(expected);
    }
  );
});
