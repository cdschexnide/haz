/**
 * AMC IMT 1033 Template Definition
 * Air Mobility Command Form for Shipper's Declaration for Dangerous Goods
 *
 * Form Reference: AMC IMT 1033, 20050204, V1
 *
 * Coordinate System: Based on scanned form at 300 DPI
 * - Origin (0,0) is top-left corner
 * - Measurements in pixels
 * - Standard letter size: ~2550 x 3300 pixels at 300 DPI
 *
 * Note: These coordinates are approximate and may need adjustment
 * based on actual scan resolution and form variations.
 */

import { SDDGTemplate } from "../types/sddg-template";

export const AMC_IMT_1033_TEMPLATE: SDDGTemplate = {
  formType: "AMC_IMT_1033",
  formName: "Air Mobility Command - Shipper's Declaration for Dangerous Goods",
  version: "V1",
  identifiers: [
    {
      text: "AMC IMT 1033",
      region: {
        x: 75,
        y: 1090,
        w: 200,
        h: 25,
      },
      confidence: 0.9,
    },
    {
      text: "SHIPPER'S DECLARATION FOR DANGEROUS GOODS",
      region: {
        x: 80,
        y: 52,
        w: 600,
        h: 25,
      },
      confidence: 0.95,
    },
    {
      text: "AIR WAYBILL NO",
      region: {
        x: 550,
        y: 92,
        w: 150,
        h: 20,
      },
      confidence: 0.85,
    },
  ],
  regions: {
    shipper: {
      x: 264,
      y: 397,
      w: 1174,
      h: 291,
      fieldType: "text",
      validation: "shipper",
    },
    air_waybill: {
      awb_number: {
        x: 1432,
        y: 391,
        w: 833,
        h: 78,
        fieldType: "alphanumeric",
        validation: "awb_number",
      },
      page_info: {
        x: 1429,
        y: 462,
        w: 847,
        h: 117,
        fieldType: "text",
        regex: "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES",
      },
    },
    shipper_reference: {
      tcn: {
        x: 1438,
        y: 573,
        w: 833,
        h: 123,
        fieldType: "alphanumeric",
        validation: "tcn",
        regex: "[A-Z0-9]{17}",
      },
    },
    consignee: {
      x: 263,
      y: 687,
      w: 1178,
      h: 210,
      fieldType: "text",
      validation: "consignee",
    },
    inspector: {
      x: 1429,
      y: 679,
      w: 825,
      h: 211,
      fieldType: "text",
      validation: "inspector",
      optional: true,
    },
    transportation_details: {
      airport_departure: {
        x: 1093,
        y: 1019,
        w: 334,
        h: 215,
        fieldType: "text",
        validation: "airport_code",
        regex: "[A-Z]{3}",
      },
      cargo_aircraft_only: {
        x: 353,
        y: 1106,
        w: 749,
        h: 138,
        fieldType: "checkbox",
      },
      airport_destination: {
        x: 269,
        y: 1235,
        w: 1154,
        h: 98,
        fieldType: "text",
        validation: "airport_code",
        regex: "[A-Z]{3}",
      },
    },
    shipment_type: {
      non_radioactive: {
        x: 1495,
        y: 1214,
        w: 284,
        h: 73,
        fieldType: "checkbox",
      },
      radioactive: {
        x: 1839,
        y: 1194,
        w: 237,
        h: 101,
        fieldType: "checkbox",
      },
    },
    dangerous_goods: {
      un_number: {
        x: 283,
        y: 1509,
        w: 188,
        h: 611,
        fieldType: "alphanumeric",
        validation: "un_number",
        regex: "UN\\d{4}",
      },
      proper_shipping_name: {
        x: 464,
        y: 1508,
        w: 512,
        h: 607,
        fieldType: "text",
      },
      class_division: {
        x: 991,
        y: 1505,
        w: 266,
        h: 596,
        fieldType: "alphanumeric",
      },
      packing_group: {
        x: 1258,
        y: 1507,
        w: 140,
        h: 599,
        fieldType: "alphanumeric",
        regex: "I{1,3}",
        optional: true,
      },
      quantity_packing: {
        x: 1389,
        y: 1507,
        w: 365,
        h: 595,
        fieldType: "text",
      },
      packing_inst: {
        x: 1749,
        y: 1509,
        w: 246,
        h: 605,
        fieldType: "alphanumeric",
        optional: true,
      },
      authorization: {
        x: 1982,
        y: 1503,
        w: 272,
        h: 593,
        fieldType: "text",
        optional: true,
      },
    },
    additional_handling: {
      x: 278,
      y: 2100,
      w: 1965,
      h: 341,
      fieldType: "text",
      optional: true,
    },
    signature_block: {
      name_title: {
        x: 1524,
        y: 2433,
        w: 727,
        h: 140,
        fieldType: "text",
      },
      place_date: {
        x: 1535,
        y: 2573,
        w: 368,
        h: 98,
        fieldType: "text",
        validation: "place_date",
      },
      signature_date: {
        x: 1912,
        y: 2573,
        w: 343,
        h: 102,
        fieldType: "text",
        validation: "date",
        regex: "\\w{3}\\s+\\d{1,2},\\s+\\d{4}",
      },
      signature: {
        x: 1543,
        y: 2662,
        w: 703,
        h: 143,
        fieldType: "signature",
      },
    },
  },
};

/**
 * Helper function to get a specific region by path
 * Example: getRegion('shipper.shipper_id')
 */
export function getRegion(path: string): any {
  const parts = path.split(".");
  let current: any = AMC_IMT_1033_TEMPLATE.regions;

  for (const part of parts) {
    if (current[part]) {
      current = current[part];
    } else {
      return null;
    }
  }

  return current;
}

/**
 * Helper function to get all text field regions (excludes tables, checkboxes)
 */
export function getTextFieldRegions(): Array<{ path: string; region: any }> {
  const fields: Array<{ path: string; region: any }> = [];

  function traverse(obj: any, path: string = "") {
    for (const key in obj) {
      const value = obj[key];
      const currentPath = path ? `${path}.${key}` : key;

      if (value.fieldType && value.fieldType !== "checkbox") {
        fields.push({ path: currentPath, region: value });
      } else if (
        typeof value === "object" &&
        !value.fieldType &&
        !value.columns
      ) {
        traverse(value, currentPath);
      }
    }
  }

  traverse(AMC_IMT_1033_TEMPLATE.regions);
  return fields;
}
