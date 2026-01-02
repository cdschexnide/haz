interface AircraftActivityLimitForLSAOrSCOMaterials {
  natureOfMaterial: string;
  activityLimitPerAircraft: string;
}

/* Table A11.3. Aircraft Activity Limits for LSA Material and SCO in Industrial Packages. */
const AircraftActivityLimits: AircraftActivityLimitForLSAOrSCOMaterials[] = [
  {
    natureOfMaterial: "LSA-I",
    activityLimitPerAircraft: "No Limit",
  },
  {
    natureOfMaterial: "LSA-II and LSA-III noncombustible solids",
    activityLimitPerAircraft: "No Limit",
  },
  {
    natureOfMaterial:
      "LSA-II and LSA-III combustible solids, and all liquids and gases",
    activityLimitPerAircraft: "100 A2",
  },
  {
    natureOfMaterial: "SCO",
    activityLimitPerAircraft: "100 A2",
  },
];
