import { parseConsigneeInfo } from "../InteractiveSDDGForm";

describe("parseConsigneeInfo", () => {
  it("should handle multi-line consignee with all address lines", () => {
    const input =
      "SW3119\nDLA DISTRIBUTION WARNER ROBINS\n455 BYRON STREET BLDG 376\nROBINS A F B\nGA 31098-1887\nROBINS A F B\nGA 310981887";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "SW3119",
      "DLA DISTRIBUTION WARNER ROBINS",
      "455 BYRON STREET BLDG 376",
      "ROBINS A F B",
      "GA 31098-1887",
      "ROBINS A F B",
      "GA 310981887",
    ]);
  });

  it("should handle simple 2-line consignee", () => {
    const input = "NUWC KEYPORT (US NAVY)\n610 DOWELL STREET\nKEYPORT, WA 98345 US";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
    ]);
  });

  it("should handle single-line consignee", () => {
    const input = "DF YOUNG INC 176-20 147 AVENUE JAMAICA NY 11434";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "DF YOUNG INC 176-20 147 AVENUE JAMAICA NY 11434",
    ]);
  });

  it("should filter out empty lines", () => {
    const input = "DLA DISTRIBUTION\n\n\n455 BYRON STREET";
    const result = parseConsigneeInfo(input);
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION",
      "455 BYRON STREET",
    ]);
  });

  it("should return fallback for empty input", () => {
    const result = parseConsigneeInfo("");
    expect(result.addressLines).toEqual(["No consignee data"]);
  });

  it("should return fallback for undefined-like input", () => {
    const result = parseConsigneeInfo(undefined as unknown as string);
    expect(result.addressLines).toEqual(["No consignee data"]);
  });
});
