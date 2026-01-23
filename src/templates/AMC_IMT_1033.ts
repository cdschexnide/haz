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

// Adjusted template - Generated 2026-01-22T20:41:58.015Z
// Adjusted fields: shipper, air_waybill.awb_number, air_waybill.page_info, shipper_reference.tcn, consignee, inspector, transportation_details.airport_destination, transportation_details.cargo_aircraft_only, transportation_details.airport_departure, shipment_type.radioactive, shipment_type.non_radioactive, signature_block.signature, signature_block.signature_date, signature_block.place_date, signature_block.name_title, additional_handling, dangerous_goods.un_number, dangerous_goods.proper_shipping_name, dangerous_goods.class_division, dangerous_goods.packing_group, dangerous_goods.authorization, dangerous_goods.packing_inst, dangerous_goods.quantity_packing
 
export const AMC_IMT_1033_TEMPLATE: SDDGTemplate = {
  "formType": "AMC_IMT_1033",
  "formName": "Air Mobility Command - Shipper's Declaration for Dangerous Goods",
  "version": "V1",
  "identifiers": [
    {
      "text": "AMC IMT 1033",
      "region": {
        "x": 75,
        "y": 1090,
        "w": 200,
        "h": 25
      },
      "confidence": 0.9
    },
    {
      "text": "SHIPPER'S DECLARATION FOR DANGEROUS GOODS",
      "region": {
        "x": 80,
        "y": 52,
        "w": 600,
        "h": 25
      },
      "confidence": 0.95
    },
    {
      "text": "AIR WAYBILL NO",
      "region": {
        "x": 550,
        "y": 92,
        "w": 150,
        "h": 20
      },
      "confidence": 0.85
    }
  ],
  "regions": {
    "shipper": {
      "x": 255,
      "y": 275,
      "w": 1179,
      "h": 301,
      "fieldType": "text",
      "validation": "shipper"
    },
    "air_waybill": {
      "awb_number": {
        "x": 1472,
        "y": 303,
        "w": 799,
        "h": 79,
        "fieldType": "alphanumeric",
        "validation": "awb_number"
      },
      "page_info": {
        "x": 1468,
        "y": 376,
        "w": 822,
        "h": 103,
        "fieldType": "text",
        "regex": "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES"
      }
    },
    "shipper_reference": {
      "tcn": {
        "x": 1462,
        "y": 489,
        "w": 812,
        "h": 113,
        "fieldType": "alphanumeric",
        "validation": "tcn",
        "regex": "[A-Z0-9]{17}"
      }
    },
    "consignee": {
      "x": 254,
      "y": 570,
      "w": 1177,
      "h": 202,
      "fieldType": "text",
      "validation": "consignee"
    },
    "inspector": {
      "x": 1491,
      "y": 628,
      "w": 790,
      "h": 152,
      "fieldType": "text",
      "validation": "inspector",
      "optional": true
    },
    "transportation_details": {
      "airport_departure": {
        "x": 1109,
        "y": 931,
        "w": 354,
        "h": 204,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      },
      "cargo_aircraft_only": {
        "x": 243,
        "y": 907,
        "w": 851,
        "h": 232,
        "fieldType": "checkbox"
      },
      "airport_destination": {
        "x": 229,
        "y": 1136,
        "w": 1211,
        "h": 98,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      }
    },
    "shipment_type": {
      "non_radioactive": {
        "x": 1522,
        "y": 1131,
        "w": 285,
        "h": 80,
        "fieldType": "checkbox"
      },
      "radioactive": {
        "x": 1899,
        "y": 1139,
        "w": 215,
        "h": 82,
        "fieldType": "checkbox"
      }
    },
    "dangerous_goods": {
      "un_number": {
        "x": 236,
        "y": 1419,
        "w": 190,
        "h": 635,
        "fieldType": "alphanumeric",
        "validation": "un_number",
        "regex": "UN\\d{4}"
      },
      "proper_shipping_name": {
        "x": 434,
        "y": 1417,
        "w": 506,
        "h": 633,
        "fieldType": "text"
      },
      "class_division": {
        "x": 1008,
        "y": 1446,
        "w": 220,
        "h": 610,
        "fieldType": "alphanumeric"
      },
      "packing_group": {
        "x": 1273,
        "y": 1457,
        "w": 125,
        "h": 589,
        "fieldType": "alphanumeric",
        "regex": "I{1,3}",
        "optional": true
      },
      "quantity_packing": {
        "x": 1418,
        "y": 1454,
        "w": 344,
        "h": 606,
        "fieldType": "text"
      },
      "packing_inst": {
        "x": 1825,
        "y": 1467,
        "w": 198,
        "h": 594,
        "fieldType": "alphanumeric",
        "optional": true
      },
      "authorization": {
        "x": 2063,
        "y": 1491,
        "w": 208,
        "h": 579,
        "fieldType": "text",
        "optional": true
      }
    },
    "additional_handling": {
      "x": 205,
      "y": 2066,
      "w": 2073,
      "h": 371,
      "fieldType": "text",
      "optional": true
    },
    "signature_block": {
      "name_title": {
        "x": 1550,
        "y": 2446,
        "w": 765,
        "h": 143,
        "fieldType": "text"
      },
      "place_date": {
        "x": 1548,
        "y": 2590,
        "w": 312,
        "h": 105,
        "fieldType": "text",
        "validation": "place_date"
      },
      "signature_date": {
        "x": 2002,
        "y": 2644,
        "w": 300,
        "h": 70,
        "fieldType": "text",
        "validation": "date",
        "regex": "\\w{3}\\s+\\d{1,2},\\s+\\d{4}"
      },
      "signature": {
        "x": 1555,
        "y": 2706,
        "w": 763,
        "h": 138,
        "fieldType": "signature"
      }
    }
  }
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
