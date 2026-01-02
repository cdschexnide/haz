import { SpecialProvisionsMap } from "../../../lookupFunctions/specialProvisions";

export const pCodePassengerEligibilityModifiers: SpecialProvisionsMap = {
  /* applicable across all hazardous materials, all materials must have a P code no matter what */
  P1: "Transport this material on dedicated airlift (e.g., Special Assignment Airlift Mission) aircraft as identified in Attachment 24. Material authorized on cargo aircraft only. Passenger deviations are not authorized.",
  P2: "Transport this material on cargo aircraft only. Passenger deviations are not authorized.",
  P3: "Transport this material on cargo aircraft only. Deviations are authorized according to paragraph 2.2. and Attachment 22.",
  P4: "Transport this material on cargo aircraft only. Deviations are authorized according to paragraph 2.2. and Attachment 22. DOD duty passengers do not require a deviation.",
  P5: "Transport this material on passenger or cargo aircraft without passenger restriction.",
};

export const aCodePassengerEligibilityModifiers: SpecialProvisionsMap = {
  A4: "Liquids having an inhalation toxicity of packingGroup I and are identified as P1, P2, or P3 are not permitted on passenger aircraft. Deviations are not allowed.",
  A5: "Solids having an inhalation toxicity of packingGroup I and are identified as P1, P2, or P3, are not permitted on passenger aircraft and may not exceed a maximum net quantity per package of 15 kg (33 pounds) on cargo aircraft. See paragraph 2.2. for deviation authority.",
  A500: "P2 Code applies if rocket motor contains hypergolic liquids.",
  A502: "With approval of Shipper's HAZMAT service focal point (see paragraph 1.2.2.), may be shipped as P2.",
  A507: "Determine passenger eligibility (“P” Coded special provisions) for radioactive materials as follows: (1) Radioactive materials requiring a Category III-Yellow label are transported under the provisions of P3. Deviations not authorized unless radioactive material intended for use in, or incident to, research, medical diagnosis, or treatment. Also see A22.1.7.2.\n(2) Radioactive materials requiring a Category II-Yellow label are transported under the provisions of P4. Deviations not authorized unless radioactive material intended for use in, or incident to, research, medical diagnosis, or treatment, and the total TI of all of the packages is 50 TI or less. Also see A22.1.7.2. (3) Radioactive materials requiring a Category I-White or no label are transported under the provisions of P5. Also see A3.3.7.5.4.",
};
