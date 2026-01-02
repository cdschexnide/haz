export const packagingCodeMap: Record<string, string> = {
  // Boxes (4)
  "4A": "Steel box",
  "4B": "Aluminum box",
  "4C1": "Natural wood, ordinary box",
  "4C2": "Natural wood, sift-proof box",
  "4D": "Plywood box",
  "4F": "Reconstituted wood box",
  "4G": "Fiberboard box",
  "4H1": "Plastic, expanded box",
  "4H2": "Plastic, solid box",
  "4N": "Other metal box",

  // Drums (1)
  "1A1": "Non-removable head steel drum",
  "1A2": "Removable head steel drum",
  "1B1": "Non-removable head aluminum drum",
  "1B2": "Removable head aluminum drum",
  "1N1": "Non-removable head metal drum (other)",
  "1N2": "Removable head metal drum (other)",
  "1D": "Plywood drum",
  "1G": "Fiber drum",
  "1H1": "Non-removable head plastic drum",
  "1H2": "Removable head plastic drum",
  "1T": "Composite drum",

  // Jerricans (3)
  "3A1": "Non-removable head steel jerrican",
  "3A2": "Removable head steel jerrican",
  "3B1": "Non-removable head aluminum jerrican",
  "3B2": "Removable head aluminum jerrican",
  "3H1": "Non-removable head plastic jerrican",
  "3H2": "Removable head plastic jerrican",

  // Bags (5)
  "5H1": "Woven plastic without liner",
  "5H2": "Woven plastic with liner",
  "5L1": "Textile without liner",
  "5L2": "Textile with liner",
  "5M1": "Paper, multiwall, water-resistant",
  "5M2": "Paper, multiwall, sift-proof",

  // Composite Packaging (6)
  "6HA1": "Plastic receptacle in steel drum",
  "6HB1": "Plastic receptacle in aluminum drum",
  "6HC": "Plastic receptacle in wood box",
  "6HD": "Plastic receptacle in plywood box",
  "6HG": "Plastic receptacle in fiberboard box",
  "6HH1": "Plastic receptacle in plastic drum",
  "6HH2": "Plastic receptacle in plastic box",

  // Other
  "11A": "Wood (non-spec bulk packaging)",
  "11B": "Plywood (non-spec bulk packaging)",
  "11G": "Fiberboard (non-spec bulk packaging)",
  "50": "Large packaging (composite, etc.)",
};

export function getContainerDescriptionFromCode(
  packagingCode: string | undefined
): string | undefined {
  if (typeof packagingCode === "undefined") {
    return undefined;
  }
  return packagingCodeMap[packagingCode];
}
