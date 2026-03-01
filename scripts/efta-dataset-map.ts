/**
 * efta-dataset-map.ts
 * Maps EFTA document numbers to their DOJ dataset numbers for URL construction.
 * Mappings extracted from source files where explicit dataset URLs appear.
 */

// Explicit overrides for documents confirmed in source data
const EXPLICIT_MAP: Record<string, number> = {
  'EFTA00000468': 1,
  'EFTA00027732': 8,
  'EFTA00028842': 8,
  'EFTA00029805': 8,
  'EFTA00032417': 8,
  'EFTA00032998': 8,
  'EFTA00033221': 8,
  'EFTA00056410': 9,
  'EFTA00063517': 9,
  'EFTA00064603': 9,
  'EFTA00076840': 9,
  'EFTA00077513': 9,
  'EFTA00080838': 9,
  'EFTA00087285': 9,
  'EFTA00093695': 9,
  'EFTA00093696': 9,
  'EFTA00095502': 9,
  'EFTA00102123': 9,
  'EFTA00105195': 9,
  'EFTA00130643': 9,
  'EFTA00137914': 9,
  'EFTA00152984': 9,
  'EFTA00161494': 9,
  'EFTA00261546': 9,
  'EFTA00507917': 9,
  'EFTA00508805': 9,
  'EFTA00528713': 9,
  'EFTA00673162': 9,
  'EFTA00702932': 9,
  'EFTA00736184': 9,
  'EFTA00739120': 9,
  'EFTA00800982': 9,
  'EFTA00822737': 9,
  'EFTA00822913': 9,
  'EFTA00827695': 9,
  'EFTA00865258': 9,
  'EFTA00868657': 9,
  'EFTA00869349': 9,
  'EFTA00876362': 9,
  'EFTA00964985': 9,
  'EFTA00989890': 9,
  'EFTA01005484': 9,
  'EFTA01009760': 9,
  'EFTA01010444': 9,
  'EFTA01030600': 9,
  'EFTA01056353': 9,
  'EFTA01060982': 9,
  'EFTA01060990': 9,
  'EFTA01209136': 9,
  'EFTA01211522': 9,
  'EFTA01227736': 9,
  'EFTA01244937': 9,
  'EFTA01249188': 9,
  'EFTA01249616': 9,
  'EFTA01262782': 9,
  'EFTA01414279': 10,
  'EFTA01615048': 10,
  'EFTA01615208': 10,
  'EFTA01615497': 10,
  'EFTA01615508': 10,
  'EFTA01615655': 10,
  'EFTA01615888': 10,
  'EFTA01616076': 10,
  'EFTA01616126': 10,
  'EFTA01619725': 10,
  'EFTA01619736': 10,
  'EFTA01619744': 10,
  'EFTA01660651': 10,
  'EFTA01660679': 10,
  'EFTA01683323': 10,
  'EFTA01684300': 10,
  'EFTA01688321': 10,
  'EFTA01688337': 10,
  'EFTA01688338': 10,
  'EFTA01688339': 10,
  'EFTA01688359': 10,
  'EFTA01732108': 10,
  'EFTA01744278': 10,
  'EFTA01767863': 10,
  'EFTA01777190': 10,
  'EFTA01815587': 10,
  'EFTA01837996': 10,
  'EFTA01910978': 10,
  'EFTA01916862': 10,
  'EFTA01918634': 10,
  'EFTA01918688': 10,
  'EFTA01922235': 10,
  'EFTA01967168': 10,
  'EFTA01988549': 10,
  'EFTA02225586': 11,
  'EFTA02231879': 11,
  'EFTA02240153': 11,
  'EFTA02245731': 11,
  'EFTA02302410': 11,
  'EFTA02332411': 11,
  'EFTA02333073': 11,
  'EFTA02341138': 11,
  'EFTA02365448': 11,
  'EFTA02457915': 11,
  'EFTA02459026': 11,
  'EFTA02478207': 11,
  'EFTA02478352': 11,
  'EFTA02496013': 11,
  'EFTA02501993': 11,
  'EFTA02516685': 11,
  'EFTA02548441': 11,
  'EFTA02553567': 11,
  'EFTA02561008': 11,
  'EFTA02561152': 11,
  'EFTA02591804': 11,
  'EFTA02606388': 11,
  'EFTA02624636': 11,
  'EFTA02625442': 11,
  'EFTA02629257': 11,
  'EFTA02631674': 11,
  'EFTA02634651': 11,
  'EFTA02637845': 11,
  'EFTA02640733': 11,
  'EFTA02646618': 11,
  'EFTA02647612': 11,
  'EFTA02647764': 11,
  'EFTA02647805': 11,
  'EFTA02648079': 11,
  'EFTA02651268': 11,
  'EFTA02662769': 11,
  'EFTA02665413': 11,
  'EFTA02668068': 11,
  'EFTA02669198': 11,
};

// Range-based fallback for documents not in explicit map
// Based on observed patterns in the DOJ releases
const KNOWN_RANGES: Array<[number, number, number]> = [
  [1, 26999, 1],         // Dataset 1-7 (early releases)
  [27000, 55999, 8],     // Dataset 8
  [56000, 1413999, 9],   // Dataset 9
  [1414000, 2224999, 10], // Dataset 10
  [2225000, 9999999, 11], // Dataset 11
];

export function eftaToUrl(eftaNumber: string): { url: string; approximate: boolean } {
  const clean = eftaNumber.replace(/[^A-Z0-9]/gi, '').toUpperCase();

  // Check explicit map first
  if (EXPLICIT_MAP[clean]) {
    const ds = EXPLICIT_MAP[clean];
    return {
      url: `https://www.justice.gov/epstein/files/DataSet%20${ds}/${clean}.pdf`,
      approximate: false,
    };
  }

  // Try range lookup
  const numPart = parseInt(clean.replace(/^EFTA0*/, ''), 10);
  for (const [min, max, ds] of KNOWN_RANGES) {
    if (numPart >= min && numPart <= max) {
      return {
        url: `https://www.justice.gov/epstein/files/DataSet%20${ds}/${clean}.pdf`,
        approximate: true,
      };
    }
  }

  // Fallback: link to main EFTA page
  return {
    url: 'https://www.justice.gov/epstein',
    approximate: true,
  };
}
