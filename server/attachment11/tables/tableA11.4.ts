interface IndustrialPackageIntegrityForLSAOrSCOMaterials {
  contents: string;
  exclusiveUse: string;
  notUnderExclusiveUse: string;
}

/* Table A11.4. Industrial Package Integrity Requirements for LSA and SCO. */
const TableA11_4: IndustrialPackageIntegrityForLSAOrSCOMaterials[] = [
  {
    contents: "LSA-I Solid",
    exclusiveUse: "Type 1",
    notUnderExclusiveUse: "Type 1",
  },
  {
    contents: "LSA-I Liquid",
    exclusiveUse: "Type 1",
    notUnderExclusiveUse: "Type 2",
  },
  {
    contents: "LSA-II Solid",
    exclusiveUse: "Type 2",
    notUnderExclusiveUse: "Type 2",
  },
  {
    contents: "LSA-II Liquid and gas",
    exclusiveUse: "Type 2",
    notUnderExclusiveUse: "Type 3",
  },
  {
    contents: "LSA-III",
    exclusiveUse: "Type 2",
    notUnderExclusiveUse: "Type 3",
  },
  {
    contents: "SCO-I",
    exclusiveUse: "Type 1",
    notUnderExclusiveUse: "Type 1",
  },
  {
    contents: "SCO-II",
    exclusiveUse: "Type 2",
    notUnderExclusiveUse: "Type 2",
  },
];
