import { parseShipperInfo } from "../InteractiveSDDGForm";

describe("parseShipperInfo", () => {
  it("should extract labeled phone and DSN (PHONE NUMBER: / DSN: format)", () => {
    const input = [
      "FY4484",
      "BLDG 1757 VANDENBERG AVE",
      "MCGUIRE AFB NJ 08641",
      "",
      "PHONE NUMBER:",
      "(609) 754-2665    DSN:    650-2665",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(609) 754-2665");
    expect(result.dsn).toBe("650-2665");
    expect(result.addressLines).toEqual([
      "FY4484",
      "BLDG 1757 VANDENBERG AVE",
      "MCGUIRE AFB NJ 08641",
    ]);
  });

  it("should extract standalone phone at top of block", () => {
    const input = [
      "(808) 786-2398",
      "DLA DISTRIBUTION PEARL HARBOR",
      "2000 GAFFNEY ST BLDG 1900",
      "PEARL HARBOR USA HI 96860 4518",
      "USA",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(808) 786-2398");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION PEARL HARBOR",
      "2000 GAFFNEY ST BLDG 1900",
      "PEARL HARBOR USA HI 96860 4518",
      "USA",
    ]);
  });

  it("should extract standalone phone at bottom (bare 10 digits)", () => {
    const input = [
      "THE BOEING COMPANY",
      "BLDG 598A",
      "2600 NORTH THIRD STREET",
      "ST. CHARLES, MO 63301",
      "U.S.A.",
      "3144612582",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("3144612582");
    expect(result.addressLines).toEqual([
      "THE BOEING COMPANY",
      "BLDG 598A",
      "2600 NORTH THIRD STREET",
      "ST. CHARLES, MO 63301",
      "U.S.A.",
    ]);
  });

  it("should extract standalone phone in middle of block", () => {
    const input = [
      "Wesco/Northlake Hub",
      "4250 DALE EARNHARDT WAY SUITE#100",
      "817-767-4353",
      "76262 NORTHLAKE TX",
      "U.S.A.",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("817-767-4353");
    expect(result.addressLines).toEqual([
      "Wesco/Northlake Hub",
      "4250 DALE EARNHARDT WAY SUITE#100",
      "76262 NORTHLAKE TX",
      "U.S.A.",
    ]);
  });

  it("should extract dash-formatted phone at bottom", () => {
    const input = [
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
      "360-396-2185",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("360-396-2185");
    expect(result.addressLines).toEqual([
      "NUWC KEYPORT (US NAVY)",
      "610 DOWELL STREET",
      "KEYPORT, WA 98345 US",
    ]);
  });

  it("should extract phone at top with dash format", () => {
    const input = [
      "904-542-0156",
      "DLA DISTRIBUTION JACKSONVILLE FL",
      "BLDG 175, SWAN ROAD",
      "NAS JACKSONVILLE    FL    32212 0103",
      "USA",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("904-542-0156");
    expect(result.addressLines).toEqual([
      "DLA DISTRIBUTION JACKSONVILLE FL",
      "BLDG 175, SWAN ROAD",
      "NAS JACKSONVILLE    FL    32212 0103",
      "USA",
    ]);
  });

  it("should handle no phone and no DSN", () => {
    const input = [
      "DF YOUNG INC",
      "176-20 147 AVENUE",
      "JAMAICA, NY 11434",
      "UNITED STATES",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "DF YOUNG INC",
      "176-20 147 AVENUE",
      "JAMAICA, NY 11434",
      "UNITED STATES",
    ]);
  });

  it("should NOT extract phone embedded in address text", () => {
    // "717 267 8800" is part of the address line, not a standalone phone
    const input = [
      "W39Z LETTERKENNY MUNITIONS CTR",
      "VOELZ GATE EMERGENCY 717 267 8800",
      "CHAMBERSBURG PA  17201-4150",
      "",
      "PHONE NUMBER:",
      "7172675421    DSN:",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("7172675421");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "W39Z LETTERKENNY MUNITIONS CTR",
      "VOELZ GATE EMERGENCY 717 267 8800",
      "CHAMBERSBURG PA  17201-4150",
    ]);
  });

  it("should handle labeled phone and DSN on same line", () => {
    const input = [
      "N00109 Navy Munitions Command Det Yorktown",
      "Naval Weapons Station Bldg 2037",
      "Yorktown VA 23691-4099",
      "",
      "PHONE NUMBER:",
      "(757) 887-4099                DSN:    953-4099",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("(757) 887-4099");
    expect(result.dsn).toBe("953-4099");
    expect(result.addressLines).toEqual([
      "N00109 Navy Munitions Command Det Yorktown",
      "Naval Weapons Station Bldg 2037",
      "Yorktown VA 23691-4099",
    ]);
  });

  it("should handle no phone/DSN with NAVSUP format", () => {
    const input = [
      "NAVSUP FLTLOGCEN JACKSONVILLE DETACHMENT,",
      "GULFPORT, MS (RIC 4NN)",
      "511 NORTH BROWN AVE, BLDG 437",
      "GULFPORT, MS  39501-5000 UNITED STATES",
    ].join("\n");

    const result = parseShipperInfo(input);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
    expect(result.addressLines).toEqual([
      "NAVSUP FLTLOGCEN JACKSONVILLE DETACHMENT,",
      "GULFPORT, MS (RIC 4NN)",
      "511 NORTH BROWN AVE, BLDG 437",
      "GULFPORT, MS  39501-5000 UNITED STATES",
    ]);
  });

  it("should handle empty input", () => {
    const result = parseShipperInfo("");
    expect(result.addressLines).toEqual([]);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
  });

  it("should handle whitespace-only input", () => {
    const result = parseShipperInfo("   \n  \n  ");
    expect(result.addressLines).toEqual([]);
    expect(result.phone).toBe("");
    expect(result.dsn).toBe("");
  });
});
