export interface ReportableQuantityCriteria {
  pounds: number;
  kilograms: number;
}

// Table A4.3 Hazardous Substance Criteria
export const hazardousSubstancesCriteriaMap: Record<
  string,
  ReportableQuantityCriteria
> = {
  A2213: {
    pounds: 5000,
    kilograms: 2270,
  },
  Acenaphthene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Acenaphthylene: {
    pounds: 5000,
    kilograms: 2270,
  },
  Acetaldehyde: {
    pounds: 1000,
    kilograms: 454,
  },
  "Acetaldehyde, chloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Acetaldehyde, trichloro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  Acetamide: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Acetamide, N-(aminothioxomethyl)-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Acetamide, N-(4-ethoxyphenyl)-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Acetamide, N-9H-fluoren-2-yl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Acetamide, 2-fluoro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Acetic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Acetic acid, ethyl ester": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Acetic acid, fluoro-, sodium salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Acetic acid, lead(2 + ) salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Acetic acid, thallium(1 + ) salt": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Acetic acid, (2,4,5-trichlorophenoxy)-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Acetic anhydride": {
    pounds: 5000,
    kilograms: 2270,
  },
  Acetone: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Acetone cyanohydrin": {
    pounds: 10,
    kilograms: 4.54,
  },
  Acetonitrile: {
    pounds: 5000,
    kilograms: 2270,
  },
  Acetophenone: {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Acetylaminofluorene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Acetyl bromide": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Acetyl chloride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Acetyl-2-thiourea": {
    pounds: 1000,
    kilograms: 454,
  },
  Acrolein: {
    pounds: 1,
    kilograms: 0.454,
  },
  Acrylamide: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Acrylic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Acrylonitrile: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Adipic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Aldicarb: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aldicarb sulfone": {
    pounds: 100,
    kilograms: 45.4,
  },
  Aldrin: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Allyl alcohol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Allyl chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Aluminum phosphide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Aluminum sulfate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "4-Aminobiphenyl": {
    pounds: 1,
    kilograms: 0.454,
  },
  "5-(Aminomethyl)-3-isoxazolol": {
    pounds: 1000,
    kilograms: 454,
  },
  "4-Aminopyridine": {
    pounds: 1000,
    kilograms: 454,
  },
  Amitrole: {
    pounds: 10,
    kilograms: 4.54,
  },
  Ammonia: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ammonium acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium benzoate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium bicarbonate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium bichromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ammonium bifluoride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ammonium bisulfite": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium carbamate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium carbonate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium chloride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ammonium citrate, dibasic": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium dichromate@": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ammonium fluoborate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium fluoride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ammonium hydroxide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ammonium oxalate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium picrate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ammonium silicofluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ammonium sulfamate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium sulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ammonium sulfite": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium tartrate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium thiocyanate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ammonium vanadate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Amyl acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  Aniline: {
    pounds: 5000,
    kilograms: 2270,
  },
  "o-Anisidine": {
    pounds: 100,
    kilograms: 45.4,
  },
  Anthracene: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Antimony¢": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Antimony pentachloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Antimony potassium tartrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Antimony tribromide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Antimony trichloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Antimony trifluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Antimony trioxide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Argentate(1-), bis(cyano-C)-, potassium": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1016": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1221": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1232": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1242": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1248": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1254": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aroclor 1260": {
    pounds: 1,
    kilograms: 0.454,
  },
  Aroclors: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic¢": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic acid H3AsO4": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic disulfide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic oxide As2O3": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic oxide As2O5": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic pentoxide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic trichloride": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic trioxide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsenic trisulfide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsine, diethyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsinic acid, dimethyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Arsonous dichloride, phenyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Asbestos¢¢": {
    pounds: 1,
    kilograms: 0.454,
  },
  Auramine: {
    pounds: 100,
    kilograms: 45.4,
  },
  Azaserine: {
    pounds: 1,
    kilograms: 0.454,
  },
  Aziridine: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Aziridine, 2-methyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  Barban: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Barium cyanide": {
    pounds: 10,
    kilograms: 4.54,
  },
  Bendiocarb: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Bendiocarb phenol": {
    pounds: 1000,
    kilograms: 454,
  },
  Benomyl: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benz[c]acridine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzal chloride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benz[a]anthracene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,2-Benzanthracene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benz[a]anthracene, 7,12-dimethyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  Benzenamine: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzenamine, 4-chloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzenamine, 2-methyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenamine, 4-methyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenamine, 2-methyl-, hydrochloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenamine, 2-methyl-5-nitro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenamine, 4-nitro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  Benzene: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, 1-bromo-4-phenoxy-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, chloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, (chloromethyl)-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenediamine, ar-methyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, 1,2-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, 1,3-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, 1,4-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, (dichloromethyl)-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzene, 1,3-diisocyanatomethyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, dimethyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Benzenediol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzene, hexachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, hexahydro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzene, methyl-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzene, 1-methyl-2,4-dinitro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, 2-methyl-1,3-dinitro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, (1-methylethyl)-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzene, nitro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzene, pentachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, pentachloronitro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenesulfonic acid chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzenesulfonyl chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene,1,2,4,5-tetrachloro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  Benzenethiol: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Benzene, (trichloromethyl)-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzene, 1,3,5-trinitro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  Benzidine: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Benzo[a]anthracene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,3-Benzodioxole, 5-(1-propenyl)-1": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Benzodioxole, 5-(2-propenyl)-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Benzodioxole, 5-propyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,3-Benzodioxol-4-ol, 2,2-dimethyl-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzo[b]fluoranthene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Benzo(k)fluoranthene": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzoic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Benzonitrile: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzo[rst]pentaphene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzo[ghi]perylene": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Benzo[a]pyrene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "3,4-Benzopyrene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "p-Benzoquinone": {
    pounds: 10,
    kilograms: 4.54,
  },
  Benzotrichloride: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Benzoyl chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzyl chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Beryllium¢": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Beryllium chloride": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Beryllium fluoride": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Beryllium nitrate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Beryllium powder¢": {
    pounds: 10,
    kilograms: 4.54,
  },
  "alpha-BHC": {
    pounds: 10,
    kilograms: 4.54,
  },
  "beta-BHC": {
    pounds: 1,
    kilograms: 0.454,
  },
  "delta-BHC": {
    pounds: 1,
    kilograms: 0.454,
  },
  "gamma-BHC": {
    pounds: 1,
    kilograms: 0.454,
  },
  "2,2′-Bioxirane": {
    pounds: 10,
    kilograms: 4.54,
  },
  Biphenyl: {
    pounds: 100,
    kilograms: 45.4,
  },
  "[1,1′-Biphenyl]-4,4′-diamine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Bis(2-chloroethoxy) methane": {
    pounds: 1000,
    kilograms: 454,
  },
  "Bis(2-chloroethyl) ether": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Bis(chloromethyl) ether": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Bis(2-ethylhexyl) phthalate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Bromoacetone: {
    pounds: 1000,
    kilograms: 454,
  },
  Bromoform: {
    pounds: 100,
    kilograms: 45.4,
  },
  Bromomethane: {
    pounds: 1000,
    kilograms: 454,
  },
  "4-Bromophenyl phenyl ether": {
    pounds: 100,
    kilograms: 45.4,
  },
  Brucine: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Butadiene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,3-Butadiene, 1,1,2,3,4,4-hexachloro-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "1-Butanamine, N-butyl-N-nitroso-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1-Butanol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Butanone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Butanone peroxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2-Butenal": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Butene, 1,4-dichloro-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "2-Butenoic acid,": {
    pounds: 2,
    kilograms: 7,
  },
  "Butyl acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "n-Butyl alcohol": {
    pounds: 5000,
    kilograms: 2270,
  },
  Butylamine: {
    pounds: 1000,
    kilograms: 454,
  },
  "Butyl benzyl phthalate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "n-Butyl phthalate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Butyric acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Cacodylic acid": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Cadmium¢": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cadmium acetate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cadmium bromide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cadmium chloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Calcium arsenate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Calcium arsenite": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Calcium carbide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Calcium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Calcium cyanamide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Calcium cyanide Ca(CN)2": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Calcium dodecylbenzenesulfonate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Calcium hypochlorite": {
    pounds: 10,
    kilograms: 4.54,
  },
  Captan: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbamic acid, ethyl ester": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Carbamic acid, methylnitroso-, ethyl ester": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Carbamic chloride, dimethyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  Carbaryl: {
    pounds: 100,
    kilograms: 45.4,
  },
  Carbendazim: {
    pounds: 10,
    kilograms: 4.54,
  },
  Carbofuran: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbofuran phenol": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbon disulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Carbonic acid, dithallium(1 + ) salt": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Carbonic dichloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbonic difluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Carbonochloridic acid, methyl ester": {
    pounds: 1000,
    kilograms: 454,
  },
  "Carbon oxyfluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Carbon tetrachloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbonyl sulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  Carbosulfan: {
    pounds: 1000,
    kilograms: 454,
  },
  Catechol: {
    pounds: 100,
    kilograms: 45.4,
  },
  Chloral: {
    pounds: 5000,
    kilograms: 2270,
  },
  Chloramben: {
    pounds: 100,
    kilograms: 45.4,
  },
  Chlorambucil: {
    pounds: 10,
    kilograms: 4.54,
  },
  Chlordane: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Chlordane, alpha & gamma isomers": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Chlorinated camphene": {
    pounds: 1,
    kilograms: 0.454,
  },
  Chlorine: {
    pounds: 10,
    kilograms: 4.54,
  },
  Chlornaphazine: {
    pounds: 100,
    kilograms: 45.4,
  },
  Chloroacetaldehyde: {
    pounds: 1000,
    kilograms: 454,
  },
  "Chloroacetic acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Chloroacetophenone": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Chloroaniline": {
    pounds: 1000,
    kilograms: 454,
  },
  Chlorobenzene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Chlorobenzilate: {
    pounds: 10,
    kilograms: 4.54,
  },
  "p-Chloro-m-cresol": {
    pounds: 5000,
    kilograms: 2270,
  },
  Chlorodibromomethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1-Chloro-2,3-epoxypropane": {
    pounds: 100,
    kilograms: 45.4,
  },
  Chloroethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Chloroethyl vinyl ether": {
    pounds: 1000,
    kilograms: 454,
  },
  Chloroform: {
    pounds: 10,
    kilograms: 4.54,
  },
  Chloromethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Chloromethyl methyl ether": {
    pounds: 10,
    kilograms: 4.54,
  },
  "beta-Chloronaphthalene": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Chloronaphthalene": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Chlorophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Chlorophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "4-Chlorophenyl phenyl ether": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-(o-Chlorophenyl)thiourea": {
    pounds: 100,
    kilograms: 45.4,
  },
  Chloroprene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "3-Chloropropionitrile": {
    pounds: 1000,
    kilograms: 454,
  },
  "Chlorosulfonic acid": {
    pounds: 1000,
    kilograms: 454,
  },
  "4-Chloro-o-toluidine, hydrochloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  Chlorpyrifos: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Chromic acetate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Chromic acid": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Chromic acid H2CrO4, calcium salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Chromic sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Chromium ¢": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Chromous chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  Chrysene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cobaltous bromide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Cobaltous formate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Cobaltous sulfamate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Coke Oven Emissions": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Copper ¢": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Copper chloride @": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Copper cyanide Cu(CN)": {
    pounds: 10,
    kilograms: 4.54,
  },
  Coumaphos: {
    pounds: 10,
    kilograms: 4.54,
  },
  Creosote: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Cresol (cresylic acid)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "m-Cresol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Cresol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Cresol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cresols (isomers and mixture)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cresylic acid (isomers and mixture)": {
    pounds: 100,
    kilograms: 45.4,
  },
  Crotonaldehyde: {
    pounds: 100,
    kilograms: 45.4,
  },
  Cumene: {
    pounds: 5000,
    kilograms: 2270,
  },
  "m-Cumenyl methylcarbamate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cupric acetate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cupric acetoarsenite": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Cupric chloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cupric nitrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cupric oxalate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cupric sulfate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cupric sulfate, ammoniated": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cupric tartrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Cyanogen: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cyanogen bromide (CN)Br": {
    pounds: 1000,
    kilograms: 454,
  },
  "Cyanogen chloride (CN)Cl": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,5-Cyclohexadiene-1,4-dione": {
    pounds: 10,
    kilograms: 4.54,
  },
  Cyclohexane: {
    pounds: 1000,
    kilograms: 454,
  },
  "(1α, 2α, 3β-, 4α,": {
    pounds: 5,
    kilograms: 6,
  },
  Cyclohexanone: {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Cyclohexyl-4,6-dinitrophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  Cyclophosphamide: {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4-D Acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4-D Ester": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4-D, salts and esters": {
    pounds: 100,
    kilograms: 45.4,
  },
  Daunomycin: {
    pounds: 10,
    kilograms: 4.54,
  },
  DDD: {
    pounds: 1,
    kilograms: 0.454,
  },
  "4,4′-DDD": {
    pounds: 1,
    kilograms: 0.454,
  },
  "DDE (72-55-9)#": {
    pounds: 1,
    kilograms: 0.454,
  },
  "DDE (3547-04-4)#": {
    pounds: 5000,
    kilograms: 2270,
  },
  "4,4′-DDE": {
    pounds: 1,
    kilograms: 0.454,
  },
  DDT: {
    pounds: 1,
    kilograms: 0.454,
  },
  "4,4′-DDT": {
    pounds: 1,
    kilograms: 0.454,
  },
  DEHP: {
    pounds: 100,
    kilograms: 45.4,
  },
  Diallate: {
    pounds: 100,
    kilograms: 45.4,
  },
  Diazinon: {
    pounds: 1,
    kilograms: 0.454,
  },
  Diazomethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Dibenz[a,h]anthracene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "1,2:5,6-Dibenzanthracene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Dibenzo[a,h]anthracene": {
    pounds: 1,
    kilograms: 0.454,
  },
  Dibenzofuran: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Dibenzo[a,i]pyrene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,2-Dibromo-3-chloropropane": {
    pounds: 1,
    kilograms: 0.454,
  },
  Dibromoethane: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Dibutyl phthalate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Di-n-butyl phthalate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Dicamba: {
    pounds: 1000,
    kilograms: 454,
  },
  Dichlobenil: {
    pounds: 100,
    kilograms: 45.4,
  },
  Dichlone: {
    pounds: 1,
    kilograms: 0.454,
  },
  Dichlorobenzene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,4-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "m-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "3,3′-Dichlorobenzidine": {
    pounds: 1,
    kilograms: 0.454,
  },
  Dichlorobromomethane: {
    pounds: 5000,
    kilograms: 2270,
  },
  "1,4-Dichloro-2-butene": {
    pounds: 1,
    kilograms: 0.454,
  },
  Dichlorodifluoromethane: {
    pounds: 5000,
    kilograms: 2270,
  },
  "1,1-Dichloroethane": {
    pounds: 1000,
    kilograms: 454,
  },
  "1,2-Dichloroethane": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,1-Dichloroethylene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Dichloroethylene": {
    pounds: 1000,
    kilograms: 454,
  },
  "Dichloroethyl ether": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Dichloroisopropyl ether": {
    pounds: 1000,
    kilograms: 454,
  },
  Dichloromethane: {
    pounds: 1000,
    kilograms: 454,
  },
  Dichloromethoxyethane: {
    pounds: 1000,
    kilograms: 454,
  },
  "Dichloromethyl ether": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4-Dichlorophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,6-Dichlorophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  Dichlorophenylarsine: {
    pounds: 1,
    kilograms: 0.454,
  },
  Dichloropropane: {
    pounds: 1000,
    kilograms: 454,
  },
  "1,2-Dichloropropane": {
    pounds: 1000,
    kilograms: 454,
  },
  Dichloropropene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Dichloropropene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,2-Dichloropropionic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Dichlorvos: {
    pounds: 10,
    kilograms: 4.54,
  },
  Dicofol: {
    pounds: 10,
    kilograms: 4.54,
  },
  Dieldrin: {
    pounds: 1,
    kilograms: 0.454,
  },
  "1,2:3,4-Diepoxybutane": {
    pounds: 10,
    kilograms: 4.54,
  },
  Diethanolamine: {
    pounds: 100,
    kilograms: 45.4,
  },
  Diethylamine: {
    pounds: 100,
    kilograms: 45.4,
  },
  "N,N-Diethylaniline": {
    pounds: 1000,
    kilograms: 454,
  },
  Diethylarsine: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Diethylene glycol, dicarbamate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1,4-Diethyleneoxide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Diethylhexyl phthalate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "N,N′-Diethylhydrazine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "O,O-Diethyl S-methyl dithiophosphate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Diethyl-p-nitrophenyl phosphate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Diethyl phthalate": {
    pounds: 1000,
    kilograms: 454,
  },
  Diethylstilbestrol: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Diethyl sulfate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Dihydrosafrole: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Diisopropylfluorophosphate (DFP)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "hexahydro-, (1alpha,": {
    pounds: 4,
    kilograms: 4,
  },
  "5alpha,": {
    pounds: 8,
    kilograms: 8,
  },
  "5beta, 8beta,": {
    pounds: 8,
    kilograms: 0.454,
  },
  "2beta, 2aalpha, 3beta,": {
    pounds: 6,
    kilograms: 6,
  },
  "2beta, 2abeta, 3alpha,": {
    pounds: 6,
    kilograms: 6,
  },
  Dimethoate: {
    pounds: 10,
    kilograms: 4.54,
  },
  "3,3′-Dimethoxybenzidine": {
    pounds: 100,
    kilograms: 45.4,
  },
  Dimethylamine: {
    pounds: 1000,
    kilograms: 454,
  },
  "Dimethyl aminoazobenzene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "p-Dimethylaminoazobenzene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N,N-Dimethylaniline": {
    pounds: 100,
    kilograms: 45.4,
  },
  "7,12-Dimethylbenz[a]anthracene": {
    pounds: 1,
    kilograms: 0.454,
  },
  "3,3′-Dimethylbenzidine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Dimethylcarbamoyl chloride": {
    pounds: 1,
    kilograms: 0.454,
  },
  Dimethylformamide: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,1-Dimethylhydrazine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,2-Dimethylhydrazine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Dimethylhydrazine, unsymmetrical@": {
    pounds: 10,
    kilograms: 4.54,
  },
  "alpha,alpha-Dimethylphenethylamine": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2,4-Dimethylphenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Dimethyl phthalate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Dimethyl sulfate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Dimetilan: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Dinitrobenzene (mixed)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "4,6-Dinitro-o-cresol, and salts": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Dinitrogen tetroxide@": {
    pounds: 10,
    kilograms: 4.54,
  },
  Dinitrophenol: {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4-Dinitrophenol": {
    pounds: 10,
    kilograms: 4.54,
  },
  Dinitrotoluene: {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4-Dinitrotoluene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,6-Dinitrotoluene": {
    pounds: 100,
    kilograms: 45.4,
  },
  Dinoseb: {
    pounds: 1000,
    kilograms: 454,
  },
  "Di-n-octyl phthalate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1,4-Dioxane": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Diphenylhydrazine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Diphosphoramide, octamethyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Diphosphoric acid, tetraethyl ester": {
    pounds: 10,
    kilograms: 4.54,
  },
  Dipropylamine: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Di-n-propylnitrosamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  Diquat: {
    pounds: 1000,
    kilograms: 454,
  },
  Disulfoton: {
    pounds: 1,
    kilograms: 0.454,
  },
  Dithiobiuret: {
    pounds: 100,
    kilograms: 45.4,
  },
  Diuron: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Dodecylbenzenesulfonic acid": {
    pounds: 1000,
    kilograms: 454,
  },
  Endosulfan: {
    pounds: 1,
    kilograms: 0.454,
  },
  "alpha-Endosulfan": {
    pounds: 1,
    kilograms: 0.454,
  },
  "beta-Endosulfan": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Endosulfan sulfate": {
    pounds: 1,
    kilograms: 0.454,
  },
  Endothall: {
    pounds: 1000,
    kilograms: 454,
  },
  Endrin: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Endrin aldehyde": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Endrin, & metabolites": {
    pounds: 1,
    kilograms: 0.454,
  },
  Epichlorohydrin: {
    pounds: 100,
    kilograms: 45.4,
  },
  Epinephrine: {
    pounds: 1000,
    kilograms: 454,
  },
  "1,2-Epoxybutane": {
    pounds: 100,
    kilograms: 45.4,
  },
  Ethanal: {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethanamine, N,N-diethyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethanamine, N-ethyl-N-nitroso-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethane, 1,2-dibromo-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethane, 1,1-dichloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethane, 1,2-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  Ethanedinitrile: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethane, hexachloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethane, 1,1′-oxybis-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethane, 1,1′-oxybis[2-chloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ethane, pentachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ethane, 1,1,1,2-tetrachloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethane, 1,1,2,2-tetrachloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  Ethanethioamide: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ethane, 1,1,1-trichloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethane, 1,1,2-trichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethanol, 2-ethoxy-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethanol, 2,2′-(nitrosoimino)bis-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethanol, 2,2′-oxybis-, dicarbamate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethanone, 1-phenyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethene, chloro-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethene, (2-chloroethoxy)-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethene, 1,1-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethene, 1,2-dichloro-(E)": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethene, tetrachloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethene, trichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  Ethion: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Ethyl acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethyl acrylate": {
    pounds: 1000,
    kilograms: 454,
  },
  Ethylbenzene: {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethyl carbamate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethyl chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethyl cyanide": {
    pounds: 10,
    kilograms: 4.54,
  },
  Ethylenediamine: {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethylenediamine-tetraacetic acid (EDTA)": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethylene dibromide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethylene dichloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethylene glycol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Ethylene glycol monoethyl ether": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethylene oxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  Ethylenethiourea: {
    pounds: 10,
    kilograms: 4.54,
  },
  Ethylenimine: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethyl ether": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ethylidene dichloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethyl methacrylate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ethyl methanesulfonate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Ethyl methyl ketone@": {
    pounds: 5000,
    kilograms: 2270,
  },
  Famphur: {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferric ammonium citrate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferric ammonium oxalate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferric chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferric fluoride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ferric nitrate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferric sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferrous ammonium sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Ferrous chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Ferrous sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  Fluoranthene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Fluorene: {
    pounds: 5000,
    kilograms: 2270,
  },
  Fluorine: {
    pounds: 10,
    kilograms: 4.54,
  },
  Fluoroacetamide: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Fluoroacetic acid, sodium salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  Formaldehyde: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Formetanate hydrochloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Formic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Formparanate: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Fulminic acid, mercury(2 + )salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Fumaric acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  Furan: {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Furancarboxyaldehyde": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2,5-Furandione": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Furan, tetrahydro-": {
    pounds: 1000,
    kilograms: 454,
  },
  Furfural: {
    pounds: 5000,
    kilograms: 2270,
  },
  Furfuran: {
    pounds: 100,
    kilograms: 45.4,
  },
  Glycidylaldehyde: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Guanidine, N-methyl-N′-nitro-N-nitroso-": {
    pounds: 10,
    kilograms: 4.54,
  },
  Guthion: {
    pounds: 1,
    kilograms: 0.454,
  },
  Heptachlor: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Heptachlor epoxide": {
    pounds: 1,
    kilograms: 0.454,
  },
  Hexachlorobenzene: {
    pounds: 10,
    kilograms: 4.54,
  },
  Hexachlorobutadiene: {
    pounds: 1,
    kilograms: 0.454,
  },
  Hexachlorocyclopentadiene: {
    pounds: 10,
    kilograms: 4.54,
  },
  Hexachloroethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  Hexachlorophene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Hexachloropropene: {
    pounds: 1000,
    kilograms: 454,
  },
  "Hexaethyl tetraphosphate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hexamethylene-1,6-diisocyanate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Hexamethylphosphoramide: {
    pounds: 1,
    kilograms: 0.454,
  },
  Hexane: {
    pounds: 5000,
    kilograms: 2270,
  },
  Hexone: {
    pounds: 5000,
    kilograms: 2270,
  },
  Hydrazine: {
    pounds: 1,
    kilograms: 0.454,
  },
  Hydrazinecarbothioamide: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hydrazine, 1,2-diethyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrazine, 1,1-dimethyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrazine, 1,2-dimethyl-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Hydrazine, 1,2-diphenyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrazine, methyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrochloric acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Hydrocyanic acid": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrofluoric acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hydrogen chloride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Hydrogen cyanide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hydrogen fluoride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hydrogen phosphide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hydrogen sulfide H2S": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Hydroperoxide, 1-methyl-1-phenylethyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  Hydroquinone: {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Imidazolidinethione": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Indeno(1,2,3-cd)pyrene": {
    pounds: 100,
    kilograms: 45.4,
  },
  Iodomethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,3-Isobenzofurandione": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Isobutyl alcohol": {
    pounds: 5000,
    kilograms: 2270,
  },
  Isodrin: {
    pounds: 1,
    kilograms: 0.454,
  },
  Isolan: {
    pounds: 100,
    kilograms: 45.4,
  },
  Isophorone: {
    pounds: 5000,
    kilograms: 2270,
  },
  Isoprene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "3-Isopropylphenyl N-methylcarbamate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Isosafrole: {
    pounds: 100,
    kilograms: 45.4,
  },
  "3(2H)-Isoxazolone, 5-(aminomethyl)-": {
    pounds: 1000,
    kilograms: 454,
  },
  Kepone: {
    pounds: 1,
    kilograms: 0.454,
  },
  Lasiocarpine: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead¢": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead acetate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead arsenate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Lead, bis(acetato-O)tetrahydroxytri-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead chloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead fluoborate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead fluoride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead iodide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead nitrate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead phosphate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead stearate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead subacetate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead sulfate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead sulfide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lead thiocyanate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Lindane: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Lindane (all isomers)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Lithium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Malathion: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Maleic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Maleic anhydride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Maleic hydrazide": {
    pounds: 5000,
    kilograms: 2270,
  },
  Malononitrile: {
    pounds: 1000,
    kilograms: 454,
  },
  "Manganese dimethyldithiocarbamate": {
    pounds: 10,
    kilograms: 4.54,
  },
  MDI: {
    pounds: 5000,
    kilograms: 2270,
  },
  MEK: {
    pounds: 5000,
    kilograms: 2270,
  },
  Melphalan: {
    pounds: 1,
    kilograms: 0.454,
  },
  Mercaptodimethur: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Mercuric cyanide": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Mercuric nitrate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Mercuric sulfate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Mercuric thiocyanate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Mercurous nitrate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Mercury: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Mercury, (acetato-O)phenyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Mercury fulminate": {
    pounds: 10,
    kilograms: 4.54,
  },
  Methacrylonitrile: {
    pounds: 1000,
    kilograms: 454,
  },
  "Methanamine, N-methyl-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methanamine, N-methyl-N-nitroso-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methane, bromo-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methane, chloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methane, chloromethoxy-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methane, dibromo-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methane, dichloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methane, dichlorodifluoro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methane, iodo-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methane, isocyanato-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methane, oxybis(chloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methanesulfenyl chloride, trichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methanesulfonic acid, ethyl ester": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Methane, tetrachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methane, tetranitro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  Methanethiol: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methane, tribromo-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methane, trichloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methane, trichlorofluoro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "phenyl]-, monohydrochloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  Methanol: {
    pounds: 5000,
    kilograms: 2270,
  },
  Methapyrilene: {
    pounds: 5000,
    kilograms: 2270,
  },
  Methiocarb: {
    pounds: 10,
    kilograms: 4.54,
  },
  Methomyl: {
    pounds: 100,
    kilograms: 45.4,
  },
  Methoxychlor: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Methyl alcohol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methylamine @": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Methyl aziridine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Methyl bromide": {
    pounds: 1000,
    kilograms: 454,
  },
  "1-Methylbutadiene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methyl chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methyl chlorocarbonate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methyl chloroform": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methyl chloroformate @": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methyl chloromethyl ether @": {
    pounds: 10,
    kilograms: 4.54,
  },
  "3-Methylcholanthrene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "4,4′-Methylenebis(2-chloroaniline)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methylene bromide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methylene chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "4,4′-Methylenedianiline": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methylene diphenyl diisocyanate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methyl ethyl ketone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methyl ethyl ketone peroxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methyl hydrazine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methyl iodide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methyl isobutyl ketone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methyl isocyanate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2-Methyllactonitrile": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Methyl mercaptan": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Methyl methacrylate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Methyl parathion": {
    pounds: 100,
    kilograms: 45.4,
  },
  "4-Methyl-2-pentanone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Methyl tert-butyl ether": {
    pounds: 1000,
    kilograms: 454,
  },
  Methylthiouracil: {
    pounds: 10,
    kilograms: 4.54,
  },
  Metolcarb: {
    pounds: 1000,
    kilograms: 454,
  },
  Mevinphos: {
    pounds: 10,
    kilograms: 4.54,
  },
  Mexacarbate: {
    pounds: 1000,
    kilograms: 454,
  },
  "Mitomycin C": {
    pounds: 10,
    kilograms: 4.54,
  },
  MNNG: {
    pounds: 10,
    kilograms: 4.54,
  },
  Monoethylamine: {
    pounds: 100,
    kilograms: 45.4,
  },
  Monomethylamine: {
    pounds: 100,
    kilograms: 45.4,
  },
  Naled: {
    pounds: 10,
    kilograms: 4.54,
  },
  "1-Naphthalenamine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Naphthalenamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  Naphthalene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Naphthalene, 2-chloro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1,4-Naphthalenedione": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Naphthalenol, methylcarbamate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Naphthenic acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,4-Naphthoquinone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "alpha-Naphthylamine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "beta-Naphthylamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "alpha-Naphthylthiourea": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nickel¢": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nickel ammonium sulfate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nickel carbonyl Ni(CO)4, (T-4)-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nickel chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nickel cyanide Ni(CN)2": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nickel hydroxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nickel nitrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nickel sulfate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nicotine, & salts": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nitric acid": {
    pounds: 1000,
    kilograms: 454,
  },
  "Nitric acid, thallium (1 + ) salt": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Nitric oxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "p-Nitroaniline": {
    pounds: 5000,
    kilograms: 2270,
  },
  Nitrobenzene: {
    pounds: 1000,
    kilograms: 454,
  },
  "4-Nitrobiphenyl": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nitrogen dioxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nitrogen oxide NO": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nitrogen oxide NO2": {
    pounds: 10,
    kilograms: 4.54,
  },
  Nitroglycerine: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Nitrophenol (mixed)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Nitrophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Nitrophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Nitrophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "4-Nitrophenol": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Nitropropane": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N-Nitrosodi-n-butylamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N-Nitrosodiethanolamine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitrosodiethylamine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitrosodimethylamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N-Nitrosodiphenylamine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "N-Nitroso-N-ethylurea": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitroso-N-methylurea": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitroso-N-methylurethane": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitrosomethylvinylamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N-Nitrosomorpholine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "N-Nitrosopiperidine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "N-Nitrosopyrrolidine": {
    pounds: 1,
    kilograms: 0.454,
  },
  Nitrotoluene: {
    pounds: 1000,
    kilograms: 454,
  },
  "5-Nitro-o-toluidine": {
    pounds: 100,
    kilograms: 45.4,
  },
  Octamethylpyrophosphoramide: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Osmium oxide OsO4, (T-4)-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Osmium tetroxide": {
    pounds: 1000,
    kilograms: 454,
  },
  Oxamyl: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Oxathiolane, 2,2-dioxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  Oxirane: {
    pounds: 10,
    kilograms: 4.54,
  },
  Oxiranecarboxyaldehyde: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Oxirane, (chloromethyl)-": {
    pounds: 100,
    kilograms: 45.4,
  },
  Paraformaldehyde: {
    pounds: 1000,
    kilograms: 454,
  },
  Paraldehyde: {
    pounds: 1000,
    kilograms: 454,
  },
  Parathion: {
    pounds: 10,
    kilograms: 4.54,
  },
  PCBs: {
    pounds: 1,
    kilograms: 0.454,
  },
  PCNB: {
    pounds: 100,
    kilograms: 45.4,
  },
  Pentachlorobenzene: {
    pounds: 10,
    kilograms: 4.54,
  },
  Pentachloroethane: {
    pounds: 10,
    kilograms: 4.54,
  },
  Pentachloronitrobenzene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Pentachlorophenol: {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,3-Pentadiene": {
    pounds: 100,
    kilograms: 45.4,
  },
  Perchloroethylene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Perchloromethyl mercaptan@": {
    pounds: 100,
    kilograms: 45.4,
  },
  Phenacetin: {
    pounds: 100,
    kilograms: 45.4,
  },
  Phenanthrene: {
    pounds: 5000,
    kilograms: 2270,
  },
  Phenol: {
    pounds: 1000,
    kilograms: 454,
  },
  "Phenol, 2-chloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 4-chloro-3-methyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Phenol, 2-cyclohexyl-4,6-dinitro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 2,4-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 2,6-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 2,4-dimethyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 2,4-dinitro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, methyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, 2-methyl-4,6-dinitro-, & salts": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, 2-(1-methylpropyl)-4,6-dinitro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Phenol, 4-nitro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenol, pentachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, 2,3,4,6-tetrachloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, 2,4,5-trichloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, 2,4,6-trichloro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Phenol, 2,4,6-trinitro-, ammonium salt": {
    pounds: 10,
    kilograms: 4.54,
  },
  "p-Phenylenediamine": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Phenyl mercaptan@": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phenylmercury acetate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Phenylthiourea: {
    pounds: 100,
    kilograms: 45.4,
  },
  Phorate: {
    pounds: 10,
    kilograms: 4.54,
  },
  Phosgene: {
    pounds: 10,
    kilograms: 4.54,
  },
  Phosphine: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phosphoric acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Phosphoric acid, lead(2 + ) salt (2:3)": {
    pounds: 10,
    kilograms: 4.54,
  },
  Phosphorus: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Phosphorus oxychloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Phosphorus pentasulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phosphorus sulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Phosphorus trichloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Phthalic anhydride": {
    pounds: 5000,
    kilograms: 2270,
  },
  Physostigmine: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Physostigmine salicylate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Picoline": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Piperidine, 1-nitroso-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Plumbane, tetraethyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "POLYCHLORINATED BIPHENYLS": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Potassium arsenate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Potassium arsenite": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Potassium bichromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Potassium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Potassium cyanide K(CN)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Potassium hydroxide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Potassium permanganate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Potassium silver cyanide": {
    pounds: 1,
    kilograms: 0.454,
  },
  Promecarb: {
    pounds: 1000,
    kilograms: 454,
  },
  Pronamide: {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Propanamine": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Propanamine, N-propyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Propanamine, N-nitroso-N-propyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Propane, 1,2-dibromo-3-chloro-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Propane, 1,2-dichloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  Propanedinitrile: {
    pounds: 1000,
    kilograms: 454,
  },
  Propanenitrile: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Propanenitrile, 3-chloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Propanenitrile, 2-hydroxy-2-methyl-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Propane, 2-nitro-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Propane, 2,2′-oxybis[2-chloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "1,3-Propane sultone": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,2,3-Propanetriol, trinitrate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1-Propanol, 2-methyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Propanone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Propanone, 1-bromo-": {
    pounds: 1000,
    kilograms: 454,
  },
  Propargite: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Propargyl alcohol": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propenal": {
    pounds: 1,
    kilograms: 0.454,
  },
  "2-Propenamide": {
    pounds: 5000,
    kilograms: 2270,
  },
  "1-Propene, 1,3-dichloro-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1-Propene, 1,1,2,3,3,3-hexachloro-": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propenenitrile": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2-Propenenitrile, 2-methyl-": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propenoic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2-Propenoic acid, ethyl ester": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propenoic acid, 2-methyl-, ethyl ester": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propenoic acid, 2-methyl-, methyl ester": {
    pounds: 1000,
    kilograms: 454,
  },
  "2-Propen-1-ol": {
    pounds: 100,
    kilograms: 45.4,
  },
  Propham: {
    pounds: 1000,
    kilograms: 454,
  },
  "beta-Propiolactone": {
    pounds: 10,
    kilograms: 4.54,
  },
  Propionaldehyde: {
    pounds: 1000,
    kilograms: 454,
  },
  "Propionic acid": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Propionic anhydride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Propoxur (Baygon)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "n-Propylamine": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Propylene dichloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Propylene oxide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Propylenimine": {
    pounds: 1,
    kilograms: 0.454,
  },
  "2-Propyn-1-ol": {
    pounds: 1000,
    kilograms: 454,
  },
  Prosulfocarb: {
    pounds: 5000,
    kilograms: 2270,
  },
  Pyrene: {
    pounds: 5000,
    kilograms: 2270,
  },
  Pyrethrins: {
    pounds: 1,
    kilograms: 0.454,
  },
  "3,6-Pyridazinedione, 1,2-dihydro-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "4-Pyridinamine": {
    pounds: 1000,
    kilograms: 454,
  },
  Pyridine: {
    pounds: 1000,
    kilograms: 454,
  },
  "Pyridine, 2-methyl-": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Pyrrolidine, 1-nitroso-": {
    pounds: 1,
    kilograms: 0.454,
  },
  Quinoline: {
    pounds: 5000,
    kilograms: 2270,
  },
  Quinone: {
    pounds: 10,
    kilograms: 4.54,
  },
  Quintobenzene: {
    pounds: 100,
    kilograms: 45.4,
  },
  Reserpine: {
    pounds: 5000,
    kilograms: 2270,
  },
  Resorcinol: {
    pounds: 5000,
    kilograms: 2270,
  },
  Safrole: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Selenious acid": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Selenious acid, dithallium (1 + ) salt": {
    pounds: 1000,
    kilograms: 454,
  },
  "Selenium¢": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Selenium dioxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Selenium oxide": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Selenium sulfide SeS2": {
    pounds: 10,
    kilograms: 4.54,
  },
  Selenourea: {
    pounds: 1000,
    kilograms: 454,
  },
  "L-Serine, diazoacetate (ester)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Silver¢": {
    pounds: 1000,
    kilograms: 454,
  },
  "Silver cyanide Ag(CN)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Silver nitrate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Silvex (2,4,5-TP)": {
    pounds: 100,
    kilograms: 45.4,
  },
  Sodium: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Sodium arsenate": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Sodium arsenite": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Sodium azide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sodium bichromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Sodium bifluoride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sodium bisulfite": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Sodium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Sodium cyanide Na(CN)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Sodium dodecylbenzenesulfonate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sodium fluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sodium hydrosulfide": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Sodium hydroxide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sodium hypochlorite": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sodium methylate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sodium nitrite": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sodium phosphate, dibasic": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Sodium phosphate, tribasic": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Sodium selenite": {
    pounds: 100,
    kilograms: 45.4,
  },
  Streptozotocin: {
    pounds: 1,
    kilograms: 0.454,
  },
  "Strontium chromate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Strychnidin-10-one, & salts": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Strychnidin-10-one, 2,3-dimethoxy-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Strychnine, & salts": {
    pounds: 10,
    kilograms: 4.54,
  },
  Styrene: {
    pounds: 1000,
    kilograms: 454,
  },
  "Styrene oxide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sulfur chlorides@": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sulfuric acid": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sulfuric acid, dimethyl ester": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sulfuric acid, dithallium (1 + ) salt": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Sulfur monochloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Sulfur phosphide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4,5-T": {
    pounds: 1000,
    kilograms: 454,
  },
  "2,4,5-T acid": {
    pounds: 1000,
    kilograms: 454,
  },
  "2,4,5-T amines": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2,4,5-T esters": {
    pounds: 1000,
    kilograms: 454,
  },
  "2,4,5-T salts": {
    pounds: 1000,
    kilograms: 454,
  },
  TCDD: {
    pounds: 1,
    kilograms: 0.454,
  },
  TDE: {
    pounds: 1,
    kilograms: 0.454,
  },
  "1,2,4,5-Tetrachlorobenzene": {
    pounds: 5000,
    kilograms: 2270,
  },
  "2,3,7,8-Tetrachlorodibenzo-p-dioxin": {
    pounds: 1,
    kilograms: 0.454,
  },
  "1,1,1,2-Tetrachloroethane": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,1,2,2-Tetrachloroethane": {
    pounds: 100,
    kilograms: 45.4,
  },
  Tetrachloroethylene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,3,4,6-Tetrachlorophenol": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Tetraethyl pyrophosphate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Tetraethyl lead": {
    pounds: 10,
    kilograms: 4.54,
  },
  Tetraethyldithiopyrophosphate: {
    pounds: 100,
    kilograms: 45.4,
  },
  Tetrahydrofuran: {
    pounds: 1000,
    kilograms: 454,
  },
  Tetranitromethane: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Tetraphosphoric acid, hexaethyl ester": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallic oxide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium¢": {
    pounds: 1000,
    kilograms: 454,
  },
  "Thallium (I) acetate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium (I) carbonate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium chloride TlCl": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium (I) nitrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium oxide Tl2O3": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thallium (I) selenite": {
    pounds: 1000,
    kilograms: 454,
  },
  "Thallium (I) sulfate": {
    pounds: 100,
    kilograms: 45.4,
  },
  Thioacetamide: {
    pounds: 10,
    kilograms: 4.54,
  },
  Thiodicarb: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thiodiphosphoric acid, tetraethyl ester": {
    pounds: 100,
    kilograms: 45.4,
  },
  Thiofanox: {
    pounds: 100,
    kilograms: 45.4,
  },
  Thiomethanol: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thiophanate-methyl": {
    pounds: 10,
    kilograms: 4.54,
  },
  Thiophenol: {
    pounds: 100,
    kilograms: 45.4,
  },
  Thiosemicarbazide: {
    pounds: 100,
    kilograms: 45.4,
  },
  Thiourea: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Thiourea, (2-chlorophenyl)-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thiourea, 1-naphthalenyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Thiourea, phenyl-": {
    pounds: 100,
    kilograms: 45.4,
  },
  Thiram: {
    pounds: 10,
    kilograms: 4.54,
  },
  Tirpate: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Titanium tetrachloride": {
    pounds: 1000,
    kilograms: 454,
  },
  Toluene: {
    pounds: 1000,
    kilograms: 454,
  },
  Toluenediamine: {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4-Toluene diamine": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Toluene diisocyanate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4-Toluene diisocyanate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Toluidine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Toluidine": {
    pounds: 100,
    kilograms: 45.4,
  },
  "o-Toluidine hydrochloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  Toxaphene: {
    pounds: 1,
    kilograms: 0.454,
  },
  "2,4,5-TP acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4,5-TP esters": {
    pounds: 100,
    kilograms: 45.4,
  },
  Triallate: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1H-1,2,4-Triazol-3-amine": {
    pounds: 10,
    kilograms: 4.54,
  },
  Trichlorfon: {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2,4-Trichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,1,1-Trichloroethane": {
    pounds: 1000,
    kilograms: 454,
  },
  "1,1,2-Trichloroethane": {
    pounds: 100,
    kilograms: 45.4,
  },
  Trichloroethylene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Trichloromethanesulfenyl chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  Trichloromonofluoromethane: {
    pounds: 5000,
    kilograms: 2270,
  },
  Trichlorophenol: {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4,5-Trichlorophenol": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4,6-Trichlorophenol": {
    pounds: 10,
    kilograms: 4.54,
  },
  Triethylamine: {
    pounds: 5000,
    kilograms: 2270,
  },
  Trifluralin: {
    pounds: 10,
    kilograms: 4.54,
  },
  Trimethylamine: {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,2,4-Trimethylpentane": {
    pounds: 1000,
    kilograms: 454,
  },
  "1,3,5-Trinitrobenzene": {
    pounds: 10,
    kilograms: 4.54,
  },
  "1,3,5-Trioxane, 2,4,6-trimethyl-": {
    pounds: 1000,
    kilograms: 454,
  },
  "Tris(2,3-dibromopropyl) phosphate": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Trypan blue": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Arsenic (D004)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Barium (D005)": {
    pounds: 1000,
    kilograms: 454,
  },
  "Benzene (D018)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Cadmium (D006)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Carbon tetrachloride (D019)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Chlordane (D020)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Chlorobenzene (D021)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Chloroform (D022)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Chromium (D007)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "o-Cresol (D023)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "m-Cresol (D024)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "p-Cresol (D025)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Cresol (D026)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4-D (D016)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,4-Dichlorobenzene (D027)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,2-Dichloroethane (D028)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "1,1-Dichloroethylene (D029)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4-Dinitrotoluene (D030)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Endrin (D012)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Heptachlor (and epoxide) (D031)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Hexachlorobenzene (D032)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Hexachlorobutadiene (D033)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Hexachloroethane (D034)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Lead (D008)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Lindane (D013)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Mercury (D009)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Methoxychlor (D014)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Methyl ethyl ketone (D035)": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Nitrobenzene (D036)": {
    pounds: 1000,
    kilograms: 454,
  },
  "Pentachlorophenol (D037)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Pyridine (D038)": {
    pounds: 1000,
    kilograms: 454,
  },
  "Selenium (D010)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Silver (D011)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Tetrachloroethylene (D039)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Toxaphene (D015)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Trichloroethylene (D040)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "2,4,5-Trichlorophenol (D041)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4,6-Trichlorophenol (D042)": {
    pounds: 10,
    kilograms: 4.54,
  },
  "2,4,5-TP (D017)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Vinyl chloride (D043)": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Uracil mustard": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Uranyl acetate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Uranyl nitrate": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Urea, N-ethyl-N-nitroso-": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Urea, N-methyl-N-nitroso-": {
    pounds: 1,
    kilograms: 0.454,
  },
  Urethane: {
    pounds: 100,
    kilograms: 45.4,
  },
  "Vanadic acid, ammonium salt": {
    pounds: 1000,
    kilograms: 454,
  },
  "Vanadium oxide V2O5": {
    pounds: 1000,
    kilograms: 454,
  },
  "Vanadium pentoxide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Vanadyl sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Vinyl acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Vinyl acetate monomer": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Vinylamine, N-methyl-N-nitroso-": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Vinyl bromide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Vinyl chloride": {
    pounds: 1,
    kilograms: 0.454,
  },
  "Vinylidene chloride": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Warfarin, & salts": {
    pounds: 100,
    kilograms: 45.4,
  },
  Xylene: {
    pounds: 100,
    kilograms: 45.4,
  },
  "m-Xylene": {
    pounds: 1000,
    kilograms: 454,
  },
  "o-Xylene": {
    pounds: 1000,
    kilograms: 454,
  },
  "p-Xylene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Xylene (mixed)": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Xylenes (isomers and mixture)": {
    pounds: 100,
    kilograms: 45.4,
  },
  Xylenol: {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc¢": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc acetate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc ammonium chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc borate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc bromide": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc carbonate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc cyanide Zn(CN)2": {
    pounds: 10,
    kilograms: 4.54,
  },
  "Zinc fluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc formate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc hydrosulfite": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc nitrate": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zinc phenolsulfonate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Zinc phosphide Zn3P2": {
    pounds: 100,
    kilograms: 45.4,
  },
  "Zinc silicofluoride": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Zinc sulfate": {
    pounds: 1000,
    kilograms: 454,
  },
  Ziram: {
    pounds: 10,
    kilograms: 4.54,
  },
  "Zirconium nitrate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Zirconium potassium fluoride": {
    pounds: 1000,
    kilograms: 454,
  },
  "Zirconium sulfate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "Zirconium tetrachloride": {
    pounds: 5000,
    kilograms: 2270,
  },
  F001: {
    pounds: 10,
    kilograms: 4.54,
  },
  "(a) Tetrachloroethylene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(b) Trichloroethylene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(c) Methylene chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "(d) 1,1,1-Trichloroethane": {
    pounds: 1000,
    kilograms: 454,
  },
  "(e) Carbon tetrachloride": {
    pounds: 10,
    kilograms: 4.54,
  },
  "(f) Chlorinated fluorocarbons": {
    pounds: 5000,
    kilograms: 2270,
  },
  F002: {
    pounds: 10,
    kilograms: 4.54,
  },
  "(b) Methylene chloride": {
    pounds: 1000,
    kilograms: 454,
  },
  "(c) Trichloroethylene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(e) Chlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(f) 1,1,2-Trichloro-1,2,2-trifluoroethane": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(g) o-Dichlorobenzene": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(h) Trichlorofluoromethane": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(i) 1,1,2-Trichloroethane": {
    pounds: 100,
    kilograms: 45.4,
  },
  F003: {
    pounds: 100,
    kilograms: 45.4,
  },
  "(a) Xylene": {
    pounds: 1000,
    kilograms: 454,
  },
  "(b) Acetone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(c) Ethyl acetate": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(d) Ethylbenzene": {
    pounds: 1000,
    kilograms: 454,
  },
  "(e) Ethyl ether": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(f) Methyl isobutyl ketone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(g) n-Butyl alcohol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(h) Cyclohexanone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(i) Methanol": {
    pounds: 5000,
    kilograms: 2270,
  },
  F004: {
    pounds: 100,
    kilograms: 45.4,
  },
  "(a) Cresols/Cresylic acid": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(b) Nitrobenzene": {
    pounds: 1000,
    kilograms: 454,
  },
  F005: {
    pounds: 100,
    kilograms: 45.4,
  },
  "(a) Toluene": {
    pounds: 1000,
    kilograms: 454,
  },
  "(b) Methyl ethyl ketone": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(c) Carbon disulfide": {
    pounds: 100,
    kilograms: 45.4,
  },
  "(d) Isobutanol": {
    pounds: 5000,
    kilograms: 2270,
  },
  "(e) Pyridine": {
    pounds: 1000,
    kilograms: 454,
  },
  F006: {
    pounds: 10,
    kilograms: 4.54,
  },
  F007: {
    pounds: 10,
    kilograms: 4.54,
  },
  F008: {
    pounds: 10,
    kilograms: 4.54,
  },
  F009: {
    pounds: 10,
    kilograms: 4.54,
  },
  F010: {
    pounds: 10,
    kilograms: 4.54,
  },
  F011: {
    pounds: 10,
    kilograms: 4.54,
  },
  F012: {
    pounds: 10,
    kilograms: 4.54,
  },
  F019: {
    pounds: 10,
    kilograms: 4.54,
  },
  F020: {
    pounds: 1,
    kilograms: 0.454,
  },
  F021: {
    pounds: 1,
    kilograms: 0.454,
  },
  F022: {
    pounds: 1,
    kilograms: 0.454,
  },
  F023: {
    pounds: 1,
    kilograms: 0.454,
  },
  F024: {
    pounds: 1,
    kilograms: 0.454,
  },
  F025: {
    pounds: 1,
    kilograms: 0.454,
  },
  F026: {
    pounds: 1,
    kilograms: 0.454,
  },
  F027: {
    pounds: 1,
    kilograms: 0.454,
  },
  F028: {
    pounds: 1,
    kilograms: 0.454,
  },
  F032: {
    pounds: 1,
    kilograms: 0.454,
  },
  F034: {
    pounds: 1,
    kilograms: 0.454,
  },
  F035: {
    pounds: 1,
    kilograms: 0.454,
  },
  F037: {
    pounds: 1,
    kilograms: 0.454,
  },
  F038: {
    pounds: 1,
    kilograms: 0.454,
  },
  F039: {
    pounds: 1,
    kilograms: 0.454,
  },
  K001: {
    pounds: 1,
    kilograms: 0.454,
  },
  K002: {
    pounds: 10,
    kilograms: 4.54,
  },
  K003: {
    pounds: 10,
    kilograms: 4.54,
  },
  K004: {
    pounds: 10,
    kilograms: 4.54,
  },
  K005: {
    pounds: 10,
    kilograms: 4.54,
  },
  K006: {
    pounds: 10,
    kilograms: 4.54,
  },
  K007: {
    pounds: 10,
    kilograms: 4.54,
  },
  K008: {
    pounds: 10,
    kilograms: 4.54,
  },
  K009: {
    pounds: 10,
    kilograms: 4.54,
  },
  K010: {
    pounds: 10,
    kilograms: 4.54,
  },
  K011: {
    pounds: 10,
    kilograms: 4.54,
  },
  K013: {
    pounds: 10,
    kilograms: 4.54,
  },
  K014: {
    pounds: 5000,
    kilograms: 2270,
  },
  K015: {
    pounds: 10,
    kilograms: 4.54,
  },
  K016: {
    pounds: 1,
    kilograms: 0.454,
  },
  K017: {
    pounds: 10,
    kilograms: 4.54,
  },
  K018: {
    pounds: 1,
    kilograms: 0.454,
  },
  K019: {
    pounds: 1,
    kilograms: 0.454,
  },
  K020: {
    pounds: 1,
    kilograms: 0.454,
  },
  K021: {
    pounds: 10,
    kilograms: 4.54,
  },
  K022: {
    pounds: 1,
    kilograms: 0.454,
  },
  K023: {
    pounds: 5000,
    kilograms: 2270,
  },
  K024: {
    pounds: 5000,
    kilograms: 2270,
  },
  K025: {
    pounds: 10,
    kilograms: 4.54,
  },
  K026: {
    pounds: 1000,
    kilograms: 454,
  },
  K027: {
    pounds: 10,
    kilograms: 4.54,
  },
  K028: {
    pounds: 1,
    kilograms: 0.454,
  },
  K029: {
    pounds: 1,
    kilograms: 0.454,
  },
  K030: {
    pounds: 1,
    kilograms: 0.454,
  },
  K031: {
    pounds: 1,
    kilograms: 0.454,
  },
  K032: {
    pounds: 10,
    kilograms: 4.54,
  },
  K033: {
    pounds: 10,
    kilograms: 4.54,
  },
  K034: {
    pounds: 10,
    kilograms: 4.54,
  },
  K035: {
    pounds: 1,
    kilograms: 0.454,
  },
  K036: {
    pounds: 1,
    kilograms: 0.454,
  },
  K037: {
    pounds: 1,
    kilograms: 0.454,
  },
  K038: {
    pounds: 10,
    kilograms: 4.54,
  },
  K039: {
    pounds: 10,
    kilograms: 4.54,
  },
  K040: {
    pounds: 10,
    kilograms: 4.54,
  },
  K041: {
    pounds: 1,
    kilograms: 0.454,
  },
  K042: {
    pounds: 10,
    kilograms: 4.54,
  },
  K043: {
    pounds: 10,
    kilograms: 4.54,
  },
  K044: {
    pounds: 10,
    kilograms: 4.54,
  },
  K045: {
    pounds: 10,
    kilograms: 4.54,
  },
  K046: {
    pounds: 10,
    kilograms: 4.54,
  },
  K047: {
    pounds: 10,
    kilograms: 4.54,
  },
  K048: {
    pounds: 10,
    kilograms: 4.54,
  },
  K049: {
    pounds: 10,
    kilograms: 4.54,
  },
  K050: {
    pounds: 10,
    kilograms: 4.54,
  },
  K051: {
    pounds: 10,
    kilograms: 4.54,
  },
  K052: {
    pounds: 10,
    kilograms: 4.54,
  },
  K060: {
    pounds: 1,
    kilograms: 0.454,
  },
  K061: {
    pounds: 10,
    kilograms: 4.54,
  },
  K062: {
    pounds: 10,
    kilograms: 4.54,
  },
  K064: {
    pounds: 10,
    kilograms: 4.54,
  },
  K065: {
    pounds: 10,
    kilograms: 4.54,
  },
  K066: {
    pounds: 10,
    kilograms: 4.54,
  },
  K069: {
    pounds: 10,
    kilograms: 4.54,
  },
  K071: {
    pounds: 1,
    kilograms: 0.454,
  },
  K073: {
    pounds: 10,
    kilograms: 4.54,
  },
  K083: {
    pounds: 100,
    kilograms: 45.4,
  },
  K084: {
    pounds: 1,
    kilograms: 0.454,
  },
  K085: {
    pounds: 10,
    kilograms: 4.54,
  },
  K086: {
    pounds: 10,
    kilograms: 4.54,
  },
  K087: {
    pounds: 100,
    kilograms: 45.4,
  },
  K088: {
    pounds: 10,
    kilograms: 4.54,
  },
  K090: {
    pounds: 10,
    kilograms: 4.54,
  },
  K091: {
    pounds: 10,
    kilograms: 4.54,
  },
  K093: {
    pounds: 5000,
    kilograms: 2270,
  },
  K094: {
    pounds: 5000,
    kilograms: 2270,
  },
  K095: {
    pounds: 100,
    kilograms: 45.4,
  },
  K096: {
    pounds: 100,
    kilograms: 45.4,
  },
  K097: {
    pounds: 1,
    kilograms: 0.454,
  },
  K098: {
    pounds: 1,
    kilograms: 0.454,
  },
  K099: {
    pounds: 10,
    kilograms: 4.54,
  },
  K100: {
    pounds: 10,
    kilograms: 4.54,
  },
  K101: {
    pounds: 1,
    kilograms: 0.454,
  },
  K102: {
    pounds: 1,
    kilograms: 0.454,
  },
  K103: {
    pounds: 100,
    kilograms: 45.4,
  },
  K104: {
    pounds: 10,
    kilograms: 4.54,
  },
  K105: {
    pounds: 10,
    kilograms: 4.54,
  },
  K106: {
    pounds: 1,
    kilograms: 0.454,
  },
  K107: {
    pounds: 10,
    kilograms: 4.54,
  },
  K108: {
    pounds: 10,
    kilograms: 4.54,
  },
  K109: {
    pounds: 10,
    kilograms: 4.54,
  },
  K110: {
    pounds: 10,
    kilograms: 4.54,
  },
  K111: {
    pounds: 10,
    kilograms: 4.54,
  },
  K112: {
    pounds: 10,
    kilograms: 4.54,
  },
  K113: {
    pounds: 10,
    kilograms: 4.54,
  },
  K114: {
    pounds: 10,
    kilograms: 4.54,
  },
  K115: {
    pounds: 10,
    kilograms: 4.54,
  },
  K116: {
    pounds: 10,
    kilograms: 4.54,
  },
  K117: {
    pounds: 1,
    kilograms: 0.454,
  },
  K118: {
    pounds: 1,
    kilograms: 0.454,
  },
  K123: {
    pounds: 10,
    kilograms: 4.54,
  },
  K124: {
    pounds: 10,
    kilograms: 4.54,
  },
  K125: {
    pounds: 10,
    kilograms: 4.54,
  },
  K126: {
    pounds: 10,
    kilograms: 4.54,
  },
  K131: {
    pounds: 100,
    kilograms: 45.4,
  },
  K132: {
    pounds: 1000,
    kilograms: 454,
  },
  K136: {
    pounds: 1,
    kilograms: 0.454,
  },
  K141: {
    pounds: 1,
    kilograms: 0.454,
  },
  K142: {
    pounds: 1,
    kilograms: 0.454,
  },
  K143: {
    pounds: 1,
    kilograms: 0.454,
  },
  K144: {
    pounds: 1,
    kilograms: 0.454,
  },
  K145: {
    pounds: 1,
    kilograms: 0.454,
  },
  K147: {
    pounds: 1,
    kilograms: 0.454,
  },
  K148: {
    pounds: 1,
    kilograms: 0.454,
  },
  K149: {
    pounds: 10,
    kilograms: 4.54,
  },
  K150: {
    pounds: 10,
    kilograms: 4.54,
  },
  K151: {
    pounds: 10,
    kilograms: 4.54,
  },
  K156: {
    pounds: 10,
    kilograms: 4.54,
  },
  K157: {
    pounds: 10,
    kilograms: 4.54,
  },
  K158: {
    pounds: 10,
    kilograms: 4.54,
  },
  K159: {
    pounds: 10,
    kilograms: 4.54,
  },
  K161: {
    pounds: 1,
    kilograms: 0.454,
  },
  K169: {
    pounds: 10,
    kilograms: 4.54,
  },
  K170: {
    pounds: 1,
    kilograms: 0.454,
  },
  K171: {
    pounds: 1,
    kilograms: 0.454,
  },
  K172: {
    pounds: 1,
    kilograms: 0.454,
  },
  K174: {
    pounds: 1,
    kilograms: 0.454,
  },
  K175: {
    pounds: 1,
    kilograms: 0.454,
  },
  K176: {
    pounds: 1,
    kilograms: 0.454,
  },
  K177: {
    pounds: 5000,
    kilograms: 2270,
  },
  K178: {
    pounds: 1000,
    kilograms: 454,
  },
  K181: {
    pounds: 1,
    kilograms: 0.454,
  },
};
