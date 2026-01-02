// US Air Force Ranks

export const AIR_FORCE_RANKS = [
  // Enlisted
  "AB",        // Airman Basic
  "Amn",       // Airman
  "A1C",       // Airman First Class
  "SrA",       // Senior Airman
  "SSgt",      // Staff Sergeant
  "TSgt",      // Technical Sergeant
  "MSgt",      // Master Sergeant
  "1st Sgt",   // First Sergeant
  "SMSgt",     // Senior Master Sergeant
  "CMSgt",     // Chief Master Sergeant
  "CCM",       // Command Chief Master Sergeant
  "CMSAF",     // Chief Master Sergeant of the Air Force

  // Officer
  "2nd Lt",    // Second Lieutenant
  "1st Lt",    // First Lieutenant
  "Capt",      // Captain
  "Maj",       // Major
  "Lt Col",    // Lieutenant Colonel
  "Col",       // Colonel
  "Brig Gen",  // Brigadier General
  "Maj Gen",   // Major General
  "Lt Gen",    // Lieutenant General
  "Gen",       // General
] as const;

export type AirForceRank = typeof AIR_FORCE_RANKS[number];
