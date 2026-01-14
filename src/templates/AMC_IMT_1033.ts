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
      "x": 138,
      "y": 173,
      "w": 1308,
      "h": 351,
      "fieldType": "text",
      "validation": "shipper"
    },
    "air_waybill": {
      "awb_number": {
        "x": 1472,
        "y": 179,
        "w": 869,
        "h": 69,
        "fieldType": "alphanumeric",
        "validation": "awb_number"
      },
      "page_info": {
        "x": 1468,
        "y": 257,
        "w": 888,
        "h": 91,
        "fieldType": "text",
        "regex": "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES"
      }
    },
    "shipper_reference": {
      "tcn": {
        "x": 1462,
        "y": 371,
        "w": 877,
        "h": 142,
        "fieldType": "alphanumeric",
        "validation": "tcn",
        "regex": "[A-Z0-9]{17}"
      }
    },
    "consignee": {
      "x": 145,
      "y": 534,
      "w": 1320,
      "h": 227,
      "fieldType": "text",
      "validation": "consignee"
    },
    "inspector": {
      "x": 1491,
      "y": 570,
      "w": 848,
      "h": 159,
      "fieldType": "text",
      "validation": "inspector",
      "optional": true
    },
    "transportation_details": {
      "airport_departure": {
        "x": 1070,
        "y": 931,
        "w": 393,
        "h": 245,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      },
      "cargo_aircraft_only": {
        "x": 149,
        "y": 931,
        "w": 926,
        "h": 258,
        "fieldType": "checkbox"
      },
      "airport_destination": {
        "x": 145,
        "y": 1204,
        "w": 1280,
        "h": 113,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      }
    },
    "shipment_type": {
      "non_radioactive": {
        "x": 1527,
        "y": 1146,
        "w": 320,
        "h": 116,
        "fieldType": "checkbox"
      },
      "radioactive": {
        "x": 1937,
        "y": 1162,
        "w": 250,
        "h": 94,
        "fieldType": "checkbox"
      }
    },
    "dangerous_goods": {
      "un_number": {
        "x": 143,
        "y": 1525,
        "w": 193,
        "h": 744,
        "fieldType": "alphanumeric",
        "validation": "un_number",
        "regex": "UN\\d{4}"
      },
      "proper_shipping_name": {
        "x": 358,
        "y": 1530,
        "w": 582,
        "h": 520,
        "fieldType": "text"
      },
      "class_division": {
        "x": 944,
        "y": 1525,
        "w": 284,
        "h": 531,
        "fieldType": "alphanumeric"
      },
      "packing_group": {
        "x": 1270,
        "y": 1547,
        "w": 128,
        "h": 499,
        "fieldType": "alphanumeric",
        "regex": "I{1,3}",
        "optional": true
      },
      "quantity_packing": {
        "x": 1418,
        "y": 1519,
        "w": 426,
        "h": 541,
        "fieldType": "text"
      },
      "packing_inst": {
        "x": 1853,
        "y": 1539,
        "w": 235,
        "h": 522,
        "fieldType": "alphanumeric",
        "optional": true
      },
      "authorization": {
        "x": 2132,
        "y": 1545,
        "w": 248,
        "h": 525,
        "fieldType": "text",
        "optional": true
      }
    },
    "additional_handling": {
      "x": 147,
      "y": 2277,
      "w": 2232,
      "h": 426,
      "fieldType": "text",
      "optional": true
    },
    "signature_block": {
      "name_title": {
        "x": 1575,
        "y": 2685,
        "w": 802,
        "h": 184,
        "fieldType": "text"
      },
      "place_date": {
        "x": 1583,
        "y": 2867,
        "w": 406,
        "h": 145,
        "fieldType": "text",
        "validation": "place_date"
      },
      "signature_date": {
        "x": 2056,
        "y": 2902,
        "w": 327,
        "h": 114,
        "fieldType": "text",
        "validation": "date",
        "regex": "\\w{3}\\s+\\d{1,2},\\s+\\d{4}"
      },
      "signature": {
        "x": 1576,
        "y": 3013,
        "w": 817,
        "h": 126,
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
