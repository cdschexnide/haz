import { Shipment } from "../../types";

export const months: string[] = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const mockShipments: Shipment[] = [
  {
    tcn: "FD50003065021XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0225",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.1B",
            class: 1,
            division: 1,
            compatibilityGroup: "B",
          },
          name: "BOOSTERS WITH DETONATOR",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065022XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0382",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.2B",
            class: 1,
            division: 2,
            compatibilityGroup: "B",
          },
          name: "COMPONENTS, EXPLOSIVE TRAIN, N.O.S.",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065023XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2796",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "8",
            class: 8,
            division: null,
            compatibilityGroup: null,
          },
          name: "BATTERY FLUID, ACID",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065024XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2692",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "8",
            class: 8,
            division: null,
            compatibilityGroup: null,
          },
          name: "BORON TRIBROMIDE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065025XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1745",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "5.1",
            class: 5,
            division: 1,
            compatibilityGroup: null,
          },
          name: "BROMINE PENTAFLUORIDE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065026XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1570",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "BRUCINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065027XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1123",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "BUTYL ACETATES",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065028XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2738",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "N-BUTYLANILINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065029XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1914",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "BUTYL PROPIONATES",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065030XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0457",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.1D",
            class: 1,
            division: 1,
            compatibilityGroup: "D",
          },
          name: "CHARGES, BURSTING, PLASTICS BONDED",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065031XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1017",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "2.3",
            class: 2,
            division: 3,
            compatibilityGroup: null,
          },
          name: "CHLORINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065032XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2668",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "CHLOROACETONITRILE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065033XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1148",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "DIACETONE ALCOHOL",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065034XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1159",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "DIISOPROPYL ETHER",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD50003065035XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2529",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "ISOBUTYRIC ACID",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065021XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0225",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.1B",
            class: 1,
            division: 1,
            compatibilityGroup: "B",
          },
          name: "BOOSTERS WITH DETONATOR",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065022XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0382",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.2B",
            class: 1,
            division: 2,
            compatibilityGroup: "B",
          },
          name: "COMPONENTS, EXPLOSIVE TRAIN, N.O.S.",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065023XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2796",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "8",
            class: 8,
            division: null,
            compatibilityGroup: null,
          },
          name: "BATTERY FLUID, ACID",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065024XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2692",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "8",
            class: 8,
            division: null,
            compatibilityGroup: null,
          },
          name: "BORON TRIBROMIDE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065025XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1745",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "5.1",
            class: 5,
            division: 1,
            compatibilityGroup: null,
          },
          name: "BROMINE PENTAFLUORIDE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065026XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1570",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "BRUCINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065027XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1123",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "BUTYL ACETATES",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065028XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2738",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "N-BUTYLANILINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065029XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1914",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "BUTYL PROPIONATES",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065030XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN0457",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "1.1D",
            class: 1,
            division: 1,
            compatibilityGroup: "D",
          },
          name: "CHARGES, BURSTING, PLASTICS BONDED",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065031XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1017",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "2.3",
            class: 2,
            division: 3,
            compatibilityGroup: null,
          },
          name: "CHLORINE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065032XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2668",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "6.1",
            class: 6,
            division: 1,
            compatibilityGroup: null,
          },
          name: "CHLOROACETONITRILE",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065033XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1148",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "DIACETONE ALCOHOL",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065034XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN1159",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "DIISOPROPYL ETHER",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
  {
    tcn: "FD60003065035XXXX",
    portOfEmbarkationAPC: "DOV",
    portOfDebarkationAPC: "RMS",
    hazardousMaterial: {
      unid: "UN2529",
      properShippingNames: [
        {
          hazardClass: {
            classDivisionNumber: "3",
            class: 3,
            division: null,
            compatibilityGroup: null,
          },
          name: "ISOBUTYRIC ACID",
        },
      ],
    },
    signatory: "John Doe",
    inspector: "Caroline Smith",
  },
];
