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

// UN2807
// export const AMC_IMT_1033_TEMPLATE: SDDGTemplate = {
//   "formType": "AMC_IMT_1033",
//   "formName": "Air Mobility Command - Shipper's Declaration for Dangerous Goods",
//   "version": "V1",
//   "identifiers": [
//     {
//       "text": "AMC IMT 1033",
//       "region": {
//         "x": 75,
//         "y": 1090,
//         "w": 200,
//         "h": 25
//       },
//       "confidence": 0.9
//     },
//     {
//       "text": "SHIPPER'S DECLARATION FOR DANGEROUS GOODS",
//       "region": {
//         "x": 80,
//         "y": 52,
//         "w": 600,
//         "h": 25
//       },
//       "confidence": 0.95
//     },
//     {
//       "text": "AIR WAYBILL NO",
//       "region": {
//         "x": 550,
//         "y": 92,
//         "w": 150,
//         "h": 20
//       },
//       "confidence": 0.85
//     }
//   ],
//   "regions": {
//     "shipper": {
//       "x": 69,
//       "y": 182,
//       "w": 1394,
//       "h": 339,
//       "fieldType": "text",
//       "validation": "shipper"
//     },
//     "air_waybill": {
//       "awb_number": {
//         "x": 1493,
//         "y": 190,
//         "w": 988,
//         "h": 66,
//         "fieldType": "alphanumeric",
//         "validation": "awb_number"
//       },
//       "page_info": {
//         "x": 1510,
//         "y": 260,
//         "w": 966,
//         "h": 107,
//         "fieldType": "text",
//         "regex": "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES"
//       }
//     },
//     "shipper_reference": {
//       "tcn": {
//         "x": 1491,
//         "y": 405,
//         "w": 960,
//         "h": 104,
//         "fieldType": "alphanumeric",
//         "validation": "tcn",
//         "regex": "[A-Z0-9]{17}"
//       }
//     },
//     "consignee": {
//       "x": 71,
//       "y": 532,
//       "w": 1392,
//       "h": 218,
//       "fieldType": "text",
//       "validation": "consignee"
//     },
//     "inspector": {
//       "x": 1510,
//       "y": 548,
//       "w": 951,
//       "h": 187,
//       "fieldType": "text",
//       "validation": "inspector",
//       "optional": true
//     },
//     "transportation_details": {
//       "airport_departure": {
//         "x": 1065,
//         "y": 921,
//         "w": 409,
//         "h": 246,
//         "fieldType": "text",
//         "validation": "airport_code",
//         "regex": "[A-Z]{3}"
//       },
//       "cargo_aircraft_only": {
//         "x": 146,
//         "y": 1016,
//         "w": 435,
//         "h": 186,
//         "fieldType": "checkbox"
//       },
//       "airport_destination": {
//         "x": 71,
//         "y": 1189,
//         "w": 1357,
//         "h": 88,
//         "fieldType": "text",
//         "validation": "airport_code",
//         "regex": "[A-Z]{3}"
//       }
//     },
//     "shipment_type": {
//       "non_radioactive": {
//         "x": 1557,
//         "y": 1160,
//         "w": 322,
//         "h": 75,
//         "fieldType": "checkbox"
//       },
//       "radioactive": {
//         "x": 2003,
//         "y": 1153,
//         "w": 217,
//         "h": 84,
//         "fieldType": "checkbox"
//       }
//     },
//     "dangerous_goods": {
//       "un_number": {
//         "x": 63,
//         "y": 1508,
//         "w": 210,
//         "h": 708,
//         "fieldType": "alphanumeric",
//         "validation": "un_number",
//         "regex": "UN\\d{4}"
//       },
//       "proper_shipping_name": {
//         "x": 296,
//         "y": 1507,
//         "w": 592,
//         "h": 703,
//         "fieldType": "text"
//       },
//       "class_division": {
//         "x": 962,
//         "y": 1516,
//         "w": 266,
//         "h": 540,
//         "fieldType": "alphanumeric"
//       },
//       "packing_group": {
//         "x": 1270,
//         "y": 1517,
//         "w": 128,
//         "h": 529,
//         "fieldType": "alphanumeric",
//         "regex": "I{1,3}",
//         "optional": true
//       },
//       "quantity_packing": {
//         "x": 1454,
//         "y": 1520,
//         "w": 396,
//         "h": 685,
//         "fieldType": "text"
//       },
//       "packing_inst": {
//         "x": 1923,
//         "y": 1515,
//         "w": 229,
//         "h": 716,
//         "fieldType": "alphanumeric",
//         "optional": true
//       },
//       "authorization": {
//         "x": 2191,
//         "y": 1531,
//         "w": 243,
//         "h": 679,
//         "fieldType": "text",
//         "optional": true
//       }
//     },
//     "additional_handling": {
//       "x": 62,
//       "y": 2241,
//       "w": 2390,
//       "h": 394,
//       "fieldType": "text",
//       "optional": true
//     },
//     "signature_block": {
//       "name_title": {
//         "x": 1606,
//         "y": 2653,
//         "w": 857,
//         "h": 154,
//         "fieldType": "text"
//       },
//       "place_date": {
//         "x": 1601,
//         "y": 2816,
//         "w": 414,
//         "h": 108,
//         "fieldType": "text",
//         "validation": "place_date"
//       },
//       "signature_date": {
//         "x": 2051,
//         "y": 2836,
//         "w": 413,
//         "h": 85,
//         "fieldType": "text",
//         "validation": "date",
//         "regex": "\\w{3}\\s+\\d{1,2},\\s+\\d{4}"
//       },
//       "signature": {
//         "x": 1596,
//         "y": 2924,
//         "w": 879,
//         "h": 153,
//         "fieldType": "signature"
//       }
//     }
//   }
// };

// UN1845
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
      "x": 118,
      "y": 254,
      "w": 1366,
      "h": 332,
      "fieldType": "text",
      "validation": "shipper"
    },
    "air_waybill": {
      "awb_number": {
        "x": 1493,
        "y": 264,
        "w": 920,
        "h": 63,
        "fieldType": "alphanumeric",
        "validation": "awb_number"
      },
      "page_info": {
        "x": 1513,
        "y": 332,
        "w": 931,
        "h": 125,
        "fieldType": "text",
        "regex": "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES"
      }
    },
    "shipper_reference": {
      "tcn": {
        "x": 1498,
        "y": 458,
        "w": 940,
        "h": 130,
        "fieldType": "alphanumeric",
        "validation": "tcn",
        "regex": "[A-Z0-9]{17}"
      }
    },
    "consignee": {
      "x": 111,
      "y": 597,
      "w": 1368,
      "h": 217,
      "fieldType": "text",
      "validation": "consignee"
    },
    "inspector": {
      "x": 1517,
      "y": 617,
      "w": 924,
      "h": 197,
      "fieldType": "text",
      "validation": "inspector",
      "optional": true
    },
    "transportation_details": {
      "airport_departure": {
        "x": 1085,
        "y": 997,
        "w": 401,
        "h": 246,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      },
      "cargo_aircraft_only": {
        "x": 212,
        "y": 1105,
        "w": 369,
        "h": 148,
        "fieldType": "checkbox"
      },
      "airport_destination": {
        "x": 110,
        "y": 1253,
        "w": 1358,
        "h": 98,
        "fieldType": "text",
        "validation": "airport_code",
        "regex": "[A-Z]{3}"
      }
    },
    "shipment_type": {
      "non_radioactive": {
        "x": 1552,
        "y": 1219,
        "w": 333,
        "h": 91,
        "fieldType": "checkbox"
      },
      "radioactive": {
        "x": 2039,
        "y": 1222,
        "w": 202,
        "h": 106,
        "fieldType": "checkbox"
      }
    },
    "dangerous_goods": {
      "un_number": {
        "x": 118,
        "y": 1594,
        "w": 189,
        "h": 622,
        "fieldType": "alphanumeric",
        "validation": "un_number",
        "regex": "UN\\d{4}"
      },
      "proper_shipping_name": {
        "x": 344,
        "y": 1588,
        "w": 576,
        "h": 622,
        "fieldType": "text"
      },
      "class_division": {
        "x": 1006,
        "y": 1593,
        "w": 222,
        "h": 463,
        "fieldType": "alphanumeric"
      },
      "packing_group": {
        "x": 1286,
        "y": 1604,
        "w": 112,
        "h": 442,
        "fieldType": "alphanumeric",
        "regex": "I{1,3}",
        "optional": true
      },
      "quantity_packing": {
        "x": 1445,
        "y": 1592,
        "w": 436,
        "h": 613,
        "fieldType": "text"
      },
      "packing_inst": {
        "x": 1898,
        "y": 1593,
        "w": 242,
        "h": 638,
        "fieldType": "alphanumeric",
        "optional": true
      },
      "authorization": {
        "x": 2191,
        "y": 1606,
        "w": 242,
        "h": 702,
        "fieldType": "text",
        "optional": true
      }
    },
    "additional_handling": {
      "x": 97,
      "y": 2326,
      "w": 2329,
      "h": 402,
      "fieldType": "text",
      "optional": true
    },
    "signature_block": {
      "name_title": {
        "x": 1606,
        "y": 2738,
        "w": 836,
        "h": 154,
        "fieldType": "text"
      },
      "place_date": {
        "x": 1605,
        "y": 2910,
        "w": 398,
        "h": 117,
        "fieldType": "text",
        "validation": "place_date"
      },
      "signature_date": {
        "x": 2074,
        "y": 2950,
        "w": 379,
        "h": 82,
        "fieldType": "text",
        "validation": "date",
        "regex": "\\w{3}\\s+\\d{1,2},\\s+\\d{4}"
      },
      "signature": {
        "x": 1600,
        "y": 3034,
        "w": 842,
        "h": 151,
        "fieldType": "signature"
      }
    }
  }
};

// UN0247
// export const AMC_IMT_1033_TEMPLATE: SDDGTemplate = {
//   "formType": "AMC_IMT_1033",
//   "formName": "Air Mobility Command - Shipper's Declaration for Dangerous Goods",
//   "version": "V1",
//   "identifiers": [
//     {
//       "text": "AMC IMT 1033",
//       "region": {
//         "x": 75,
//         "y": 1090,
//         "w": 200,
//         "h": 25
//       },
//       "confidence": 0.9
//     },
//     {
//       "text": "SHIPPER'S DECLARATION FOR DANGEROUS GOODS",
//       "region": {
//         "x": 80,
//         "y": 52,
//         "w": 600,
//         "h": 25
//       },
//       "confidence": 0.95
//     },
//     {
//       "text": "AIR WAYBILL NO",
//       "region": {
//         "x": 550,
//         "y": 92,
//         "w": 150,
//         "h": 20
//       },
//       "confidence": 0.85
//     }
//   ],
//   "regions": {
//     "shipper": {
//       "x": 255,
//       "y": 275,
//       "w": 1179,
//       "h": 301,
//       "fieldType": "text",
//       "validation": "shipper"
//     },
//     "air_waybill": {
//       "awb_number": {
//         "x": 1472,
//         "y": 303,
//         "w": 799,
//         "h": 79,
//         "fieldType": "alphanumeric",
//         "validation": "awb_number"
//       },
//       "page_info": {
//         "x": 1468,
//         "y": 376,
//         "w": 822,
//         "h": 103,
//         "fieldType": "text",
//         "regex": "PAGE\\s+\\d+\\s+OF\\s+\\d+\\s+PAGES"
//       }
//     },
//     "shipper_reference": {
//       "tcn": {
//         "x": 1462,
//         "y": 489,
//         "w": 812,
//         "h": 113,
//         "fieldType": "alphanumeric",
//         "validation": "tcn",
//         "regex": "[A-Z0-9]{17}"
//       }
//     },
//     "consignee": {
//       "x": 254,
//       "y": 570,
//       "w": 1177,
//       "h": 202,
//       "fieldType": "text",
//       "validation": "consignee"
//     },
//     "inspector": {
//       "x": 1491,
//       "y": 628,
//       "w": 790,
//       "h": 152,
//       "fieldType": "text",
//       "validation": "inspector",
//       "optional": true
//     },
//     "transportation_details": {
//       "airport_departure": {
//         "x": 1109,
//         "y": 931,
//         "w": 354,
//         "h": 204,
//         "fieldType": "text",
//         "validation": "airport_code",
//         "regex": "[A-Z]{3}"
//       },
//       "cargo_aircraft_only": {
//         "x": 243,
//         "y": 907,
//         "w": 851,
//         "h": 232,
//         "fieldType": "checkbox"
//       },
//       "airport_destination": {
//         "x": 229,
//         "y": 1136,
//         "w": 1211,
//         "h": 98,
//         "fieldType": "text",
//         "validation": "airport_code",
//         "regex": "[A-Z]{3}"
//       }
//     },
//     "shipment_type": {
//       "non_radioactive": {
//         "x": 1522,
//         "y": 1131,
//         "w": 285,
//         "h": 80,
//         "fieldType": "checkbox"
//       },
//       "radioactive": {
//         "x": 1899,
//         "y": 1139,
//         "w": 215,
//         "h": 82,
//         "fieldType": "checkbox"
//       }
//     },
//     "dangerous_goods": {
//       "un_number": {
//         "x": 236,
//         "y": 1419,
//         "w": 190,
//         "h": 635,
//         "fieldType": "alphanumeric",
//         "validation": "un_number",
//         "regex": "UN\\d{4}"
//       },
//       "proper_shipping_name": {
//         "x": 434,
//         "y": 1417,
//         "w": 506,
//         "h": 633,
//         "fieldType": "text"
//       },
//       "class_division": {
//         "x": 1008,
//         "y": 1446,
//         "w": 220,
//         "h": 610,
//         "fieldType": "alphanumeric"
//       },
//       "packing_group": {
//         "x": 1273,
//         "y": 1457,
//         "w": 125,
//         "h": 589,
//         "fieldType": "alphanumeric",
//         "regex": "I{1,3}",
//         "optional": true
//       },
//       "quantity_packing": {
//         "x": 1418,
//         "y": 1454,
//         "w": 344,
//         "h": 606,
//         "fieldType": "text"
//       },
//       "packing_inst": {
//         "x": 1825,
//         "y": 1467,
//         "w": 198,
//         "h": 594,
//         "fieldType": "alphanumeric",
//         "optional": true
//       },
//       "authorization": {
//         "x": 2063,
//         "y": 1491,
//         "w": 208,
//         "h": 579,
//         "fieldType": "text",
//         "optional": true
//       }
//     },
//     "additional_handling": {
//       "x": 205,
//       "y": 2066,
//       "w": 2073,
//       "h": 371,
//       "fieldType": "text",
//       "optional": true
//     },
//     "signature_block": {
//       "name_title": {
//         "x": 1550,
//         "y": 2446,
//         "w": 765,
//         "h": 143,
//         "fieldType": "text"
//       },
//       "place_date": {
//         "x": 1548,
//         "y": 2590,
//         "w": 312,
//         "h": 105,
//         "fieldType": "text",
//         "validation": "place_date"
//       },
//       "signature_date": {
//         "x": 2002,
//         "y": 2644,
//         "w": 300,
//         "h": 70,
//         "fieldType": "text",
//         "validation": "date",
//         "regex": "\\w{3}\\s+\\d{1,2},\\s+\\d{4}"
//       },
//       "signature": {
//         "x": 1555,
//         "y": 2706,
//         "w": 763,
//         "h": 138,
//         "fieldType": "signature"
//       }
//     }
//   }
// };


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
