/* Figure A3.5. Filling Density for Cryogenic Liquids of Hydrogen */
const fillingDensityHydrogen = {
  designServiceTemperature: {
    fahrenheit: -423,
    celsius: -253,
    description: "Minus 253 degrees C (-423 degrees F) or colder",
  },
  maxFillingDensity: {
    percentage: 6.7,
    description:
      "Maximum permitted filling density, based on cylinder capacity at -253 degrees C (-423 degrees F) (see note)",
  },
  pressureControlValve: {
    kPa: 117,
    psig: 17,
    description:
      "The pressure control valve must be designed and set to limit the pressure in the cylinder to not more than",
  },
  note: `The filling density for hydrogen, cryogenic liquid, is defined as the percent ratio of the weight of lading in a package to the weight of water that the packaging will hold at -253 degrees C (-423 degrees F). The volume of the packaging at -253 degrees C (-423 degrees F) is determined in cubic inches. The volume is converted to pounds of water (1 pound of water = 27.737 cubic inches). Each cylinder must be constructed, insulated, and maintained so that the total rate of venting must not be over 30 standard cubic feet (SCF) of hydrogen per hour during transportation. (T-0).`,
};
