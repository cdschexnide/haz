### Numeric Special Provisions ###

*** SPECIAL PROVISION CODES 1 THROUGH 5 ***
For special provision 1, 2, 3, 4, 5 --> reference TableA17_1 in server/attachment17/documentNodes/A17.ts, it tells you what needs to be added to Key 12 of the SDDG, this would be an area for a potential recommended frustration, if the hazardous material being inspected has a special provision code of 1, 2, 3, 4, or 5, and does not have the requisite Key 12 content in it's SDDG form
  "1": "This material is poisonous by inhalation in Hazard Zone A, describe as an inhalation hazard.", 
  "2": "This material is poisonous by inhalation in Hazard Zone B, describe as an inhalation hazard.",
  "3": "This material is poisonous by inhalation in Hazard Zone C, describe as an inhalation hazard.",
  "4": "This material is poisonous by inhalation in Hazard Zone D, describe as an inhalation hazard.",
For example, the following is an element from the hazardousMaterialsList array:
  {
    isFixed: "false",
    isDomesticShipment: false,
    isTechnicalNameRequired: true,
    unid: "UN1955",
    properShippingName: "COMPRESSED GAS, TOXIC, N.O.S.",
    details: "Inhalation Hazard Zone A",
    hazclassDiv: "2.3",
    subsidiaryRisk: "",
    packingGroup: "",
    specialProvision: "P1, 1",
    packagingParagraph: "A6.15.",
  },
It has 2 special provision codes: P1 and 1
P1 indicates "Transport this material on dedicated airlift (e.g., Special Assignment Airlift Mission) aircraft as identified in Attachment 24. Material authorized on cargo aircraft only. Passenger deviations are not authorized." We are already validating Key 7 of the SDDG based on this special provision code.
We would need to add validation for Key 12 for this material, because it has a special provision code of 1 (again, reference TableA17_1 in server/attachment17/documentNodes/A17.ts, it tells you what needs to be added to Key 12 of the SDDG)

*** SPECIAL PROVISION CODE 6 ***
"6": "This material is poisonous by inhalation and must be described as an inhalation hazard. (T-0).",
This is similar, I believe it requires a Key 12 modification to add "Inhalation Hazard".

*** SPECIAL PROVISION CODE 13 ***
"13": "Enter the words “Inhalation Hazard” on each shipping paper in association with the shipping description.",
This is similar, I believe it requires a Key 12 modification to add "Inhalation Hazard".

*** SPECIAL PROVISION CODE 53 ***
"53": 'Packages of these materials must bear a subsidiary hazard label, "EXPLOSIVE", unless exempted by the DOT. (T-0). A copy of the permit must accompany the shipment.
Ignore the "unless exempted by the DOT" part. We are not handling exemptions/waivers yet in the app. But this special provision code would add a label requirement (i.e. must bear a subsidiary hazard label, "EXPLOSIVE")

*** SPECIAL PROVISION CODE 177 ***
"177": "Gasoline, or, ethanol and gasoline mixtures, for use in internal combustion engines (e.g., in automobiles, stationary engines and other engines) must be assigned to Packing Group II regardless of variations in volatility. (T-0)."
This special provision code means that the packing group on the SDDG (i.e. the Key 15 value on the SDDG) needs to be II. For the UN Specification POP marking for the package, the packing group code needs to be either X or Y. So this special provision code modifies the inspector workflow in 2 places: adds a Key 15 requirement of II on the SDDG, and adds a packing group code requirement of X or Y on the UN Specification POP marking for the package

