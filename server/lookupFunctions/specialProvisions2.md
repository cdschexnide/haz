### "A” Provisions. These special provisions are in addition to other requirements for military air shipment. ###

DONE
<!-- A1: "Single packaging is not permitted on aircraft carrying passengers. P4 restrictions apply.",
- for this one, let's say the user is inspecting this material:
  {
    isFixed: "false",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN1438",
    properShippingName: "ALUMINIUM NITRATE",
    hazclassDiv: "5.1",
    subsidiaryRisk: "",
    packingGroup: "III",
    specialProvision: "P5, A1, A29",
    packagingParagraph: "A9.6.",
  },
it has 3 special provision codes: P5 (means it can be transported by both passenger and cargo aircraft), A1, and A29.
According to the SP code A1, if it is being shipped as a single packaging, then now it is required to be shipped as "CARGO AIRCRAFT ONLY" which changes the Key 7 recommended frustration logic in the SDDG, and also adds a label requirement (Cargo Aircraft Only label). However, if it's not being shipped as a single packaging, then it can still be shipped by both passenger and cargo aircraft. -->

DONE
<!-- A2: "Single packagings are not permitted.",
  {
    isFixed: "false",
    isDomesticShipment: false,
    isTechnicalNameRequired: false,
    unid: "UN1310",
    properShippingName: "AMMONIUM PICRATE, WETTED",
    details: "with 10% or more water, by mass",
    hazclassDiv: "4.1",
    subsidiaryRisk: "",
    packingGroup: "I",
    specialProvision: "P4, 23, A2, N41",
    packagingParagraph: "A8.3.",
  },
This material is an example of special code A2. For this, we would need to not allow single packagings.  -->

<!-- INNER PACKAGING INSPECTION -->
A3: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with absorbent material in tightly closed rigid and leak proof receptacles before packing in outer packaging's. (T-0).",
- for this one, we would need to add this as part of the inner packaging inspection

<!-- A4: "Liquids having an inhalation toxicity of packingGroup I and are identified as P1, P2, or P3 are not permitted on passenger aircraft. Deviations are not allowed.", -->

A5: "Solids having an inhalation toxicity of packingGroup I and are identified as P1, P2, or P3, are not permitted on passenger aircraft and may not exceed a maximum net quantity per package of 15 kg (33 pounds) on cargo aircraft. See paragraph 2.2. for deviation authority.",

<!-- INNER PACKAGING INSPECTION -->
A6: "For combination packagings, if plastic inner packagings are used, pack in tightly closed metal receptacles before packing into outer packaging's.",

A7: "Steel packagings must be corrosion-resistant or have protection against corrosion. (T-0).",

<!-- INNER PACKAGING INSPECTION -->
A8: "For combination packagings, if glass inner packagings (including ampoules) are used, they must be packed with cushioning material in tightly closed metal receptacles before packing in outer packaging's. (T-0).",

<!-- INNER PACKAGING INSPECTION -->
A9: "For combination packages, if plastic bags are used, they must be packed in tightly closed metal receptacles before packing in outer packaging's. (T-0).",

A10: "When aluminum or aluminum alloy construction materials are used, they must be resistant to corrosion. (T-0).",

<!-- INNER PACKAGING INSPECTION -->
A11: "For combination packaging's, when metal inner packaging's are permitted, only specification cylinders constructed of metals which are compatible with the hazardous material may be used.",

<!-- INNER PACKAGING INSPECTION -->
A19: "Combination packaging's consisting of outer fiber drums or plywood drums, with inner plastic packaging's, are not authorized.",

<!-- INNER PACKAGING INSPECTION -->
A20: "Plastic bags as inner receptacles of combination packaging's are not authorized.",

<!-- INNER PACKAGING INSPECTION -->
A29: "Combination packaging's consisting of outer expanded plastic boxes with inner plastic bags are not authorized.",

<!-- ASK MARK -->
A30: "Ammonium permanganate is not authorized.",

A35: "This includes material which is not covered by any other hazard class but has anesthetic, narcotic, noxious or other properties such that, in the event of spillage or leakage on the aircraft, extreme annoyance or discomfort could be caused to aircrew members so as to prevent correct performance of assigned duties. For material containing aromatic extract or flavoring, use packaging paragraph A13.2. For all other material shipped under this PSN, use packaging paragraph A13.14.",

A37: "This entry applies only to a material meeting the definition in 49 CFR Section 171.8 for self-defense spray.",

A43: "Toxins from plant, animal or bacterial sources, which contain infectious substances, or toxins that are contained in infectious substances, must be classified as Division 6.2. (T-0).",

A56: "Radioactive material with a subsidiary hazard of Division 4.2 Packing Group I must be transported in Type B packages when offered for transportation by aircraft. Radioactive material with a subsidiary hazard of Division 2.1 is forbidden from transport on passenger aircraft.",

A58: "An aqueous solution containing 24% or less alcohol by volume and more than 50% water is not subject to these regulations.",

A61: "When used for purposes such as sterilization, inner packaging's of peroxyacetic acid, stabilized, classified as UN3107 Organic peroxide type E, liquid or UN3109 Organic peroxide type F, liquid may be fitted with a vent consisting of hydrophobic membrane, provided: (1) Each inner packaging contains not more than 70 mL; (2) The inner packaging is designed so that the vent is not immersed in liquid in any orientation; (3) Each inner packaging is enclosed in an intermediate rigid plastic packaging with a small opening to permit release of gas and contains a buffer that neutralizes the contents of the inner packaging in the event of leakage; (4) Intermediate packaging's are packed in a fiberboard box (4G) outer packaging; (5) Each outer packaging contains not more than 1.4 L of liquid; and (6) The rate of oxygen release from the outer packaging does not exceed 15 mL per hour. Such packages must be transported on cargo aircraft only. (T-0).",

A67: "Non-spillable batteries are considered dry batteries and not subject to any other requirements of this manual if: (1) At a temperature of 55 degrees C (130 degrees F), the electrolyte will not flow from a ruptured or cracked case and there is no free liquid to flow; (T-0). (2) Securely packed in strong outer packaging's or secured to skids or pallets capable of withstanding the shocks normally incident to transportation. The batteries must be loaded or braced so as to prevent damage and short circuits in transit, and any other material loaded in the same vehicle must be blocked, braced, or otherwise secured to prevent contact with or damage to the batteries. (T-0). A non-spillable battery which is an integral part of and necessary for the operation of mechanical or electronic equipment must be securely fastened in the battery holder on the equipment. (T-0).",

A69: "May be transported using a DOT hazard classification approval. Except for Class/Division 1.4S, a copy of the approval must accompany the shipment. (T-0). See A3.3.1.4.",

A87: "Engines or machinery which are not fully enclosed by packaging, crates, or other means that prevent ready identification, are not subject to the marking requirements of Attachment 14, the labeling requirements of Attachment 15, or the placarding requirements of Attachment 16.",

A117: "Wastes containing Category A infectious substances must be assigned to UN2814 or UN2900. (T-0). Wastes transported under UN3291 are wastes containing infectious substances in Category B or wastes that are reasonably believed to have a low probability of containing infectious substances. Decontaminated wastes, which previously contained infectious substances, may be considered as not subject to these Regulations unless the criteria of another Class or Division are met.",

A124: "Only mixtures with not more than 23.5% oxygen may be transported under this entry. A Division 5.1 subsidiary hazard label is not required for any concentration within this limit.",

A140: "Technical name must not be shown on the package, but must be shown on the shipper’s declaration for dangerous goods. (T-0). When the infectious substances to be transported are unknown, but suspected of meeting the criteria for inclusion in Category A and assigned to UN2814 or UN2900, the words “Suspected Category A Infectious Substance” must be shown in parenthesis following the proper shipping name on the shipper’s declaration for dangerous goods but not on the outer package. (T-0).",

A191: "Notwithstanding the Division 6.1 subsidiary hazard for this description, the toxic subsidiary hazard label and the requirement to indicate the subsidiary hazard on the shipping paper are not required for manufactured articles containing less than 5 kg (11 pounds) of mercury.",

A197: "Marine Pollutants in single or combination packagings containing a net quantity per single or inner packaging of 5 L or less for liquids or having a net mass of 5 kg or less for solids, are not subject to any other requirements of this mnanual provided the packagings meet the general requirements in Attachment 3. This exception does not apply to marine pollutants that are a hazardous waste or a hazardous substance. In the case of marine pollutants also meeting the criteria for inclusion in another hazard class, all provisions of this manual relevant to any additional hazards continue to apply.",

A213: "Lithium batteries containing both primary lithium metal cells and rechargeable lithium ion cells must be assigned to UN numbers 3090 or 3091 as appropriate. (T-0).",

A500: "P2 Code applies if rocket motor contains hypergolic liquids.",

A501: "P3 does not apply to unit maintenance and support personnel traveling on Special Assignment Airlift Missions.",

A502: "With approval of Shipper’s HAZMAT service focal point (see paragraph 1.2.2.), may be shipped as P2.",

A503: "Only Class 2 (non-toxic aerosols only), Class 3 (Packing Group II or III only) and Division 6.1 (Packing Group III only) provided such substances do not have a subsidiary hazard may be shipped to an international (non-domestic) location as a Class 9.",

A504: "Deleted",

<!-- INNER PACKAGING INSPECTION -->
A506: "Inner receptacles of a combination package and a single package must be capable of meeting the internal air gauge pressure requirements for a packingGroup III liquid. (T-0).",

A507: "Determine passenger eligibility (“P” Coded special provisions) for radioactive materials as follows: (1) Radioactive materials requiring a Category III-Yellow label are transported under the provisions of P3. Deviations not authorized unless radioactive material intended for use in, or incident to, research, medical diagnosis, or treatment. Also see A22.1.7.2. (2) Radioactive materials requiring a Category II-Yellow label are transported under the provisions of P4. Deviations not authorized unless radioactive material intended for use in, or incident to, research, medical diagnosis, or treatment, and the total TI of all of the packages is 50 TI or less. Also see A22.1.7.2. (3) Radioactive materials requiring a Category I-White or no label are transported under the provisions of P5. Also see A3.3.7.5.4.",

A508: "Diagnostic, Patient, or Clinical Specimens not containing a Category A or B infectious substances are not regulated by this manual.",

A509: "Magnesium alloys with 50% or less magnesium in pellets, turning or ribbons are not regulated.",

A510: "Emergency power units (EPU) for F-16 aircraft are packaged, marked and labeled in accordance with a DOT-SP, CAA or COE.",