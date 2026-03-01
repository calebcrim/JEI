#!/usr/bin/env node
/**
 * Forensic Finance Submodule Integration Script
 * Reads from data/forensic-finance/ (read-only submodule) and enriches
 * our src/data/ JSON files with verified financial data.
 *
 * Data source: randallscott25-star/epstein-forensic-finance (CC BY 4.0)
 */

const fs = require('fs');
const path = require('path');

// ============================================================
// PATHS
// ============================================================
const DATA = path.join(__dirname, '..', 'src', 'data');
const SUBMODULE = path.join(__dirname, '..', 'data', 'forensic-finance');

const timeline = JSON.parse(fs.readFileSync(path.join(DATA, 'timeline.json'), 'utf8'));
const people = JSON.parse(fs.readFileSync(path.join(DATA, 'people.json'), 'utf8'));
const connections = JSON.parse(fs.readFileSync(path.join(DATA, 'connections.json'), 'utf8'));
const themes = JSON.parse(fs.readFileSync(path.join(DATA, 'themes.json'), 'utf8'));

// Wire ledger — 481 audited records with full metadata
const wireLedger = JSON.parse(
  fs.readFileSync(path.join(SUBMODULE, 'data', 'master_wire_ledger_phase5j_flat.json'), 'utf8')
);

console.log(`\nForensic Finance Integration`);
console.log(`Wire ledger: ${wireLedger.length} records`);
console.log(`Existing people: ${people.length}, connections: ${connections.length}, events: ${timeline.length}\n`);

// ============================================================
// ENTITY NAME → PERSON ID MAPPING
// ============================================================
const ENTITY_TO_PERSON = {
  // Epstein
  'Jeffrey Epstein': 'jeffrey-epstein',
  'Jeffrey Epstein NOW/SuperNow Account': 'jeffrey-epstein',
  'Jeffrey Epstein (Checking)': 'jeffrey-epstein',
  'Jeffrey Epstein (Non-DB Account)': 'jeffrey-epstein',
  'JEFFREY EPSTEIN': 'jeffrey-epstein',
  'JEFFERY EPSTEIN': 'jeffrey-epstein',
  'JEFFREY E EPSTEIN': 'jeffrey-epstein',
  'MR EPSTEIN': 'jeffrey-epstein',
  'Jeffrey Epstein c/o HBRK Associates': 'jeffrey-epstein',
  // Leon Black
  'Leon & Debra Black': 'leon-black',
  'Leon & Debra Black c/o Apollo Management': 'leon-black',
  'Black Family Partners LP': 'leon-black',
  'Black Family Partners LP c/o Apollo Management': 'leon-black',
  'LEON_BLACK': 'leon-black',
  'DEBRA R. BLACK': 'leon-black',
  'DEBRA_BLACK': 'leon-black',
  // Maxwell
  'GHISLAINE MAXWELL': 'ghislaine-maxwell',
  'MAXWELL': 'ghislaine-maxwell',
  // Indyke
  'INDYKE': 'darren-indyke',
  'Michelle Saipher / Darren Indyke': 'darren-indyke',
  // Kahn
  'KAHN': 'richard-kahn',
  // Alexanderson
  'ALEXANDERSON': 'eileen-alexanderson',
  // Casriel
  'CASRIEL': 'lyle-casriel',
  // Rothschild
  'Benjamin Edmond de Rothschild': 'benjamin-de-rothschild',
  'Edmond de Rothschild (Suisse) SA': 'benjamin-de-rothschild',
  // Shell entities (map to new person IDs)
  'Southern Trust Company Inc.': 'southern-trust-company',
  'Southern Trust Company Inc. (Checking)': 'southern-trust-company',
  'SOUTHERN_TRUST': 'southern-trust-company',
  'The Haze Trust (DBAGNY)': 'haze-trust',
  'The Haze Trust (Brokerage)': 'haze-trust',
  'The Haze Trust (Checking)': 'haze-trust',
  'HAZE_TRUST': 'haze-trust',
  'Southern Financial LLC': 'southern-financial-llc',
  'Southern Financial LLC (Checking)': 'southern-financial-llc',
  'Southern Financial LLC (DBAGNY)': 'southern-financial-llc',
  'SOUTHERN_FINANCIAL': 'southern-financial-llc',
  'SOUTHERN FINANCIAL, LLC ACCT.': 'southern-financial-llc',
  'Jeepers Inc.': 'jeepers-inc',
  'Jeepers Inc. (DB Brokerage)': 'jeepers-inc',
  'Plan D LLC': 'plan-d-llc',
  'PLAN D LLC': 'plan-d-llc',
  'NES LLC': 'nes-llc',
  'Gratitude America MMDA': 'gratitude-america',
  'Gratitude America Ltd.': 'gratitude-america',
  'Gratitude America (Checking)': 'gratitude-america',
  'Gratitude America Ltd. (First Bank PR)': 'gratitude-america',
  'Gratitude America Ltd. (Morgan Stanley/Citibank)': 'gratitude-america',
  'GRATITUDE_AMERICA': 'gratitude-america',
  'The 2017 Caterpillar Trust': 'caterpillar-trust-2017',
  'BV70 LLC': 'bv70-llc',
  // Investment entities
  'Boothbay Absolute Return Strategies LP': 'boothbay-fund',
  'Boothbay Absolute Strategies Fund LP': 'boothbay-fund',
  'Boothbay Multi Strategy Fund LP': 'boothbay-fund',
  'Honeycomb Partners LP': 'honeycomb-partners',
  'Honeycomb Ventures I LP': 'honeycomb-partners',
  'Honeycomb Ventures IV LP': 'honeycomb-partners',
  // Other known people
  'GROFF': 'lesley-groff',
  'SHULIAK': 'karyna-shuliak',
  'Adam Bly': 'adam-bly',
  'ADAM BLY': 'adam-bly',
  'Joichi Ito': 'joichi-ito',
  'ITO': 'joichi-ito',
  'Barry Jay Josephson': 'barry-jay-josephson',
  'PAUL_MORRIS': 'paul-morris',
  'TAZIA SMITH': 'tazia-smith',
  'JEAN-LUC BRUNEL': 'jean-luc-brunel',
  'Narrow Holdings LLC c/o Elysium Management': 'narrow-holdings-llc',
  'ALFREDO RODRIGUEZ': 'alfredo-rodriguez',
  'ROY BLACK': 'roy-black',
  'PEGGY SIEGAL': 'peggy-siegal',
  'VISOSKI': 'larry-visoski',
  'HALPERIN': 'mark-halperin',
  'Sultan Bin Sulayem': 'sultan-bin-sulayem',
  'KATHY RUEMMLER': 'kathy-ruemmler',
  'Tudor Futures Fund': 'tudor-futures-fund',
  'Kellerhals Ferguson Kroblin PLLC': 'kellerhals-ferguson',
  'Blockchain Capital IV LP': 'blockchain-capital',
  'Blockchain Capital III Digital Liquid Venture Fund LP': 'blockchain-capital',
  'Blockchain Capital Parallel Fund IV LP': 'blockchain-capital',
  'Coatue Enterprises LLC': 'coatue-enterprises',
  'Neoteny 3 LP': 'neoteny-3',
  'Seed Media Group': 'seed-media-group',
  "Sotheby's": 'sothebys',
  "Christie's Inc.": 'christies',
  // HBRK entities
  'HBRK ASSOCIATES INC': 'hbrk-associates',
  'HBRK ASSOCIATES, INC': 'hbrk-associates',
  'HBRKASS': 'hbrk-associates',
};

// Validation tier → our verification status + connection strength
function tierToVerification(tier) {
  switch (tier) {
    case 'VERIFIED':
    case 'PROVEN':
      return { verificationStatus: 'verified', strength: 3 };
    case 'STRONG':
    case 'FINCEN_VALIDATED':
    case 'FINCEN_AMOUNT_MATCH':
      return { verificationStatus: 'unverified', strength: 2 };
    default: // MODERATE, FINCEN_RANGE_MATCH, STATEMENT_ONLY
      return { verificationStatus: 'unverified', strength: 1 };
  }
}

// Determine era from date string
function determineEra(dateStr) {
  if (!dateStr) return '2008-2018';
  const year = parseInt(dateStr.substring(0, 4), 10) || parseInt(dateStr.split('/').pop(), 10);
  if (!year || isNaN(year)) return '2008-2018';
  if (year < 1990) return 'pre-1990';
  if (year <= 2000) return '1990-2000';
  if (year <= 2007) return '2001-2007';
  if (year <= 2018) return '2008-2018';
  if (year === 2019) return '2019';
  return '2020-present';
}

// Normalize date to ISO format
function normalizeDate(dateStr) {
  if (!dateStr) return '';
  // Already ISO format (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{4}-\d{2}$/.test(dateStr)) return dateStr;
  // MM/DD/YYYY format
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const [m, d, y] = parts;
    return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  }
  return dateStr;
}

function formatDateDisplay(dateStr) {
  const iso = normalizeDate(dateStr);
  if (!iso) return 'Undated';
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const parts = iso.split('-');
  if (parts.length === 3) {
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    return `${months[m - 1]} ${d}, ${parts[0]}`;
  }
  if (parts.length === 2) {
    const m = parseInt(parts[1], 10);
    return `${months[m - 1]} ${parts[0]}`;
  }
  return iso;
}

function formatAmount(amount) {
  if (!amount) return '$0';
  return '$' + amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// ============================================================
// HELPER FUNCTIONS (same pattern as integrate-trump-misconduct.js)
// ============================================================

function findPersonById(id) {
  return people.find(p => p.id === id);
}

function findTimelineById(id) {
  return timeline.find(e => e.id === id);
}

function findConnectionById(id) {
  return connections.find(c => c.id === id);
}

function findThemeById(id) {
  return themes.find(t => t.id === id);
}

function addPerson(person) {
  if (findPersonById(person.id)) {
    console.log(`  SKIP person (exists): ${person.id}`);
    return false;
  }
  people.push(person);
  console.log(`  ADD person: ${person.id}`);
  return true;
}

function addTimelineEvent(event) {
  if (findTimelineById(event.id)) {
    console.log(`  SKIP event (exists): ${event.id}`);
    return false;
  }
  timeline.push(event);
  console.log(`  ADD event: ${event.id}`);
  return true;
}

function addConnection(conn) {
  if (findConnectionById(conn.id)) {
    console.log(`  SKIP connection (exists): ${conn.id}`);
    return false;
  }
  // Check for existing financial connection between same pair
  const existing = connections.find(c =>
    c.relationshipType === 'financial' &&
    ((c.sourcePersonId === conn.sourcePersonId && c.targetPersonId === conn.targetPersonId) ||
     (c.sourcePersonId === conn.targetPersonId && c.targetPersonId === conn.sourcePersonId))
  );
  if (existing) {
    // Merge: append wire detail to existing description
    existing.description += ' | ' + conn.description;
    if (conn.verificationStatus === 'verified' && existing.verificationStatus !== 'verified') {
      existing.verificationStatus = 'verified';
    }
    if (conn.strength > existing.strength) {
      existing.strength = conn.strength;
    }
    if (!existing.sources.includes('ForensicFinance')) {
      existing.sources.push('ForensicFinance');
    }
    console.log(`  MERGE connection: ${conn.sourcePersonId} → ${conn.targetPersonId}`);
    return false;
  }
  connections.push(conn);
  console.log(`  ADD connection: ${conn.id}`);
  return true;
}

function makeTimelineEvent(opts) {
  return {
    id: opts.id,
    date: opts.date,
    dateDisplay: opts.dateDisplay,
    era: opts.era,
    title: opts.title,
    body: opts.body + '\n\n---',
    peopleIds: opts.peopleIds || [],
    themeIds: opts.themeIds || ['financial-crimes-money-laundering'],
    sources: opts.sources || ['ForensicFinance'],
    tags: opts.tags || ['financial'],
    summary: opts.summary || opts.body.split('\n')[0].substring(0, 300),
    eftaLinks: opts.eftaLinks || [],
    relatedEventIds: opts.relatedEventIds || [],
    relatedThemeIds: opts.relatedThemeIds || ['financial-crimes-money-laundering'],
    discrepancies: opts.discrepancies || [],
    verificationStatus: opts.verificationStatus || undefined,
    efta: opts.efta || []
  };
}

// ============================================================
// PHASE 1: AGGREGATE WIRE DATA BY ENTITY PAIR
// ============================================================
console.log('=== PHASE 1: Aggregate wire data ===\n');

// Group wires by entity pair (mapped to person IDs)
const pairAggregates = {};  // key: "fromId::toId" → { wires: [], totalAmount, ... }

let mapped = 0, unmapped = 0;
wireLedger.forEach(wire => {
  const fromId = ENTITY_TO_PERSON[wire.entity_from];
  const toId = ENTITY_TO_PERSON[wire.entity_to];
  if (!fromId || !toId) {
    unmapped++;
    return;
  }
  if (fromId === toId) return; // skip self-transfers
  mapped++;
  const key = `${fromId}::${toId}`;
  if (!pairAggregates[key]) {
    pairAggregates[key] = {
      fromId, toId,
      wires: [],
      totalAmount: 0,
      batesNumbers: [],
      bestTier: 'STATEMENT_ONLY',
      dates: []
    };
  }
  const agg = pairAggregates[key];
  agg.wires.push(wire);
  agg.totalAmount += wire.amount || 0;
  if (wire.bates && wire.bates.length > 0 && !agg.batesNumbers.includes(wire.bates)) {
    agg.batesNumbers.push(wire.bates);
  }
  if (wire.date) agg.dates.push(wire.date);
  // Track best validation tier
  const tierRank = { VERIFIED: 5, PROVEN: 4, FINCEN_VALIDATED: 3, STRONG: 3, FINCEN_AMOUNT_MATCH: 2, FINCEN_RANGE_MATCH: 1, MODERATE: 1, STATEMENT_ONLY: 0 };
  if ((tierRank[wire.validation_tier] || 0) > (tierRank[agg.bestTier] || 0)) {
    agg.bestTier = wire.validation_tier;
  }
});

console.log(`Mapped: ${mapped} wires, Unmapped: ${unmapped} wires`);
console.log(`Unique entity pairs: ${Object.keys(pairAggregates).length}\n`);

// ============================================================
// PHASE 2: CREATE SHELL ENTITY PEOPLE
// ============================================================
console.log('=== PHASE 2: Shell entities ===\n');

const SHELL_ENTITIES = [
  {
    id: 'southern-trust-company',
    name: 'Southern Trust Company Inc.',
    tier: 1,
    summary: 'Tier 1 holding trust in Epstein\'s 4-tier shell hierarchy. Received $151.5M (Unverified) from 7 external sources including Black Family ($36M+), Rothschild ($15M), and Narrow Holdings ($20M). Primary custodian: Deutsche Bank.',
    content: 'Southern Trust Company Inc. operated as the principal Tier 1 holding entity in the Epstein financial network. It received external investor funds and redistributed them through the shell hierarchy.\n\n**Inflows (Unverified):** $151.5M from 7 identified sources — Leon & Debra Black ($15M, DB-SDNY-0003819), Black Family Partners LP ($13M + $10M + $10M, DB-SDNY-0003484/DB-SDNY-0004172/DB-SDNY-0005122), Narrow Holdings LLC ($20M, DB-SDNY-0004009), Benjamin Edmond de Rothschild ($15M, DB-SDNY-0005122), Edmond de Rothschild (Suisse) SA ($10M, DB-SDNY-0005122).\n\n**Outflows:** Funds redistributed to Tier 2 and Tier 3 entities including Honeycomb Partners LP.\n\nAll amounts are automated extractions and have not been independently verified. Appearance does not imply wrongdoing.'
  },
  {
    id: 'haze-trust',
    name: 'The Haze Trust',
    tier: 2,
    summary: 'Tier 2 distribution trust. Distributed $49.7M (Unverified) internally. Received art auction proceeds: Sotheby\'s ($11.2M), Christie\'s ($7.7M). Custodied at Deutsche Bank (DBAGNY) and HSBC Bank Bermuda.',
    content: 'The Haze Trust operated as a Tier 2 distribution entity, redistributing funds between Epstein-controlled accounts. It maintained both brokerage and checking accounts at Deutsche Bank (DBAGNY).\n\n**Internal movements (Unverified):** $36M brokerage→checking (DB-SDNY-0006153), $12.6M brokerage→checking (DB-SDNY-0008064), $24.6M checking→Southern Financial LLC (DB-SDNY-0008063).\n\n**Art market inflows (Unverified):** Sotheby\'s $11,249,417 (DB-SDNY-0006646), Christie\'s Inc. $7,725,000 — art sales functioning as a liquidity conversion mechanism.\n\n**Direct disbursements:** $20M to Jeffrey Epstein NOW/SuperNow Account (DB-SDNY-0005135).\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'southern-financial-llc',
    name: 'Southern Financial LLC',
    tier: 2,
    summary: 'Tier 2 distribution shell. Received $14M (Unverified) from Tudor Futures ($13.5M) and $24.6M from Haze Trust. Disbursed to Coatue Enterprises, Joichi Ito, and Boothbay funds.',
    content: 'Southern Financial LLC functioned as a Tier 2 distribution entity, receiving funds from both external sources and Tier 2 redistribution, then deploying to investment vehicles.\n\n**Inflows (Unverified):** Tudor Futures Fund $12,826,541 (DB-SDNY-0004032), Haze Trust Checking $24,564,037 (DB-SDNY-0008063), Haze Trust DBAGNY $9M.\n\n**Outflows (Unverified):** Coatue Enterprises $2M, Boothbay funds $10M+, Joichi Ito/Neoteny $1M.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'jeepers-inc',
    name: 'Jeepers Inc.',
    tier: 3,
    summary: 'Tier 3 operating shell. Transferred $51.9M (Unverified) to Epstein\'s personal NOW/SuperNow account across 21 wires. Amounts followed a pattern: 3x $3M, 8x $2M, plus smaller amounts.',
    content: 'Jeepers Inc. operated as a Tier 3 operating shell, serving as the primary funding conduit to Epstein\'s personal Deutsche Bank accounts. It maintained both a standard account and a Deutsche Bank brokerage account.\n\n**Pipeline to Epstein personal (Unverified):** $51,876,640 across 21 wires from Jeepers Inc. (DB Brokerage) to Jeffrey Epstein NOW/SuperNow Account. Wire pattern: 3 wires at $3M, 8 wires at $2M, and multiple smaller amounts.\n\n**Internal shell-to-shell:** Jeepers Inc. (non-brokerage) transferred $6M to Jeepers Inc. (DB Brokerage) — a shell funding a shell funding a personal account.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'plan-d-llc',
    name: 'Plan D LLC',
    tier: 3,
    summary: 'Tier 3 operating shell. Disbursed $18M (Unverified) to Leon Black across 4 wires ($8M, $5M, $3M, $2M). Near-zero inflows ($1,125) — funding source outside EFTA corpus.',
    content: 'Plan D LLC operated as a Tier 3 operating shell with a distinctive anomaly: near-zero inflows against $18M in outflows. Only $1,125 in recorded inflows (from a remittance advice), suggesting its funding came from sources outside the EFTA corpus.\n\n**Outflows to Leon Black (Unverified):** $18,000,000 across 4 wires — $8M, $5M, $3M, $2M. Also received $22.5M from BV70 LLC (DB-SDNY-0006113) and sent $10M to BV70 LLC (DB-SDNY-0007669).\n\n**Investigative significance:** The near-zero inflow against massive outflow indicates Plan D LLC\'s funding came from earlier wires, inter-trust transfers not captured in audited tables, or direct bank deposits not visible in the EFTA corpus.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'gratitude-america',
    name: 'Gratitude America',
    tier: 3,
    summary: 'Tier 3 operating shell disguised as charitable entity. Disbursed $6.3M (Unverified) — 88% to investment accounts (Morgan Stanley/Citibank), only 7% to actual charities.',
    content: 'Gratitude America maintained MMDA and checking accounts and projected a charitable mission while primarily functioning as an investment vehicle.\n\n**Disbursements (Unverified):** $6,253,493 total — Morgan Stanley/Citibank $5,500,000 (88%), First Bank PR $300,000 (5%), Medical charities $425,000 (7%: Melanoma Research Alliance, Cancer Research Wellness Institute, Bruce & Marsha Moskowitz Foundation), Other small disbursements $28,493 (<1%).\n\n**Also received:** $10M from BV70 LLC (DB-SDNY-0004999).\n\nThe entity name projected a charitable mission while primarily functioning as an investment vehicle — 88% of outflow went to investment/banking accounts.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'nes-llc',
    name: 'NES LLC',
    tier: 3,
    summary: 'Tier 3 operating shell functioning as Maxwell personal expense account. Disbursed $554K (Unverified) — 97% ($539K) directly to Ghislaine Maxwell.',
    content: 'NES LLC disbursed $553,536 (Unverified), of which $538,617 (97%) went directly to Ghislaine Maxwell. Remaining disbursements: $13,940 to Pottery Barn, $979 to Visa Card.\n\nConsistent with NES LLC functioning as a personal expense shell for Maxwell.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'caterpillar-trust-2017',
    name: 'The 2017 Caterpillar Trust',
    tier: 1,
    summary: 'Tier 1 holding trust. Received $15M (Unverified) from Blockchain Capital entities. Disbursed $10M to Honeycomb Ventures IV LP.',
    content: 'The 2017 Caterpillar Trust operated as a Tier 1 holding entity, receiving cryptocurrency-adjacent investment fund capital.\n\n**Inflows (Unverified):** Blockchain Capital IV LP $10,500,000 (DB-SDNY-0006982), Blockchain Capital III Digital Liquid Venture Fund LP, Blockchain Capital Parallel Fund IV LP.\n\n**Outflows (Unverified):** $10,000,000 to Honeycomb Ventures IV LP (DB-SDNY-0008151).\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'bv70-llc',
    name: 'BV70 LLC',
    tier: 3,
    summary: 'Tier 3 pass-through shell. Sent $22.5M to Plan D LLC (DB-SDNY-0006113) and $10M to Gratitude America (DB-SDNY-0004999). Received $10M from Plan D LLC.',
    content: 'BV70 LLC operated as a pass-through entity connecting Plan D LLC and Gratitude America.\n\n**Key flows (Unverified):** $22,500,000 to Plan D LLC (DB-SDNY-0006113, March 2017), $10,000,000 to Gratitude America Ltd. (DB-SDNY-0004999, October 2015), $10,000,000 received from Plan D LLC (DB-SDNY-0007669, October 2018).\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'honeycomb-partners',
    name: 'Honeycomb Partners LP',
    tier: 3,
    summary: 'Tier 3 investment vehicle. Received $30M+ (Unverified) from Southern Trust Company Inc. across multiple wires. Multiple sub-funds: Ventures I, Ventures IV.',
    content: 'Honeycomb Partners LP and related Honeycomb Ventures entities received substantial inflows from Tier 1 holding trusts.\n\n**Inflows (Unverified):** $20,000,000 from Southern Trust Company Inc. (DB-SDNY-0005457, May 2016), $10,000,000 from Southern Trust Company Inc. (DB-SDNY-0008154, March 2019), $10,000,000 from 2017 Caterpillar Trust to Honeycomb Ventures IV LP (DB-SDNY-0008151, March 2019).\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'boothbay-fund',
    name: 'Boothbay Fund (Multi-Strategy)',
    tier: 3,
    summary: 'Tier 3 investment fund. Bidirectional flows with Southern Financial LLC totaling $20M+ (Unverified). Multiple sub-funds: Absolute Return Strategies, Absolute Strategies, Multi Strategy.',
    content: 'Boothbay fund entities maintained bidirectional financial relationships with Southern Financial LLC.\n\n**Flows (Unverified):** $10,000,000 from Boothbay Absolute Return Strategies LP to Southern Financial LLC (DB-SDNY-0005951), $10,000,000 from Southern Financial LLC to Boothbay Absolute Strategies Fund LP (DB-SDNY-0005280), $10,000,000 from Southern Financial LLC to Boothbay Multi Strategy Fund LP (DB-SDNY-0003845).\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'narrow-holdings-llc',
    name: 'Narrow Holdings LLC',
    tier: 0,
    summary: 'External entity c/o Elysium Management. Sent $20M (Unverified) to Southern Trust Company Inc. (DB-SDNY-0004009).',
    content: 'Narrow Holdings LLC, administered c/o Elysium Management, sent $20,000,000 to Southern Trust Company Inc. on July 15, 2014 (Bates: DB-SDNY-0004009). This was one of the largest single external deposits into the Tier 1 holding trust.\n\nAll amounts are automated extractions and have not been independently verified.'
  },
  {
    id: 'hbrk-associates',
    name: 'HBRK Associates Inc.',
    tier: 0,
    summary: 'Communication hub entity routing 13,146 emails across the Epstein network. Not in wire ledger but appears in 13,389 total files across the EFTA corpus.',
    content: 'HBRK Associates Inc. functioned primarily as a communication routing hub within the Epstein network, appearing in 13,389 files — more than any other non-banking entity. While not present in the wire ledger, it processed 13,146 emails across the network.\n\nJeffrey Epstein c/o HBRK Associates also appears as a financial entity in some records, suggesting it served dual communication and administrative purposes.\n\nAll information derived from automated EFTA corpus analysis and has not been independently verified.'
  }
];

SHELL_ENTITIES.forEach(shell => {
  addPerson({
    id: shell.id,
    name: shell.name,
    category: 'financial',
    subcategory: 'shell-entity',
    summary: shell.summary,
    sections: [
      {
        title: 'Entity Classification',
        content: shell.tier > 0
          ? `Tier ${shell.tier} entity in Epstein's 4-tier shell trust hierarchy as identified by the epstein-forensic-finance repository.`
          : `Entity identified in the EFTA corpus by the epstein-forensic-finance repository.`,
        sources: ['ForensicFinance'],
        verificationStatus: 'unverified'
      },
      {
        title: 'Financial Analysis',
        content: shell.content,
        sources: ['ForensicFinance'],
        verificationStatus: 'unverified',
        efta: []  // populated below
      }
    ],
    timelineEventIds: [],
    themeIds: ['financial-crimes-money-laundering'],
    connectionIds: [],
    sources: ['ForensicFinance']
  });
});

// Populate Bates numbers for shell entities from wire data
Object.values(pairAggregates).forEach(agg => {
  [agg.fromId, agg.toId].forEach(id => {
    const person = findPersonById(id);
    if (person && person.subcategory === 'shell-entity') {
      const financialSection = person.sections.find(s => s.title === 'Financial Analysis');
      if (financialSection && agg.batesNumbers.length > 0) {
        if (!financialSection.efta) financialSection.efta = [];
        agg.batesNumbers.forEach(b => {
          if (!financialSection.efta.includes(b)) {
            financialSection.efta.push(b);
          }
        });
      }
    }
  });
});

// ============================================================
// PHASE 3: ENRICH EXISTING PEOPLE WITH FINANCIAL DATA
// ============================================================
console.log('\n=== PHASE 3: Enrich existing people ===\n');

const PEOPLE_TO_ENRICH = [
  'jeffrey-epstein', 'leon-black', 'ghislaine-maxwell',
  'darren-indyke', 'richard-kahn', 'eileen-alexanderson', 'lyle-casriel'
];

PEOPLE_TO_ENRICH.forEach(personId => {
  const person = findPersonById(personId);
  if (!person) {
    console.log(`  WARN: ${personId} not found`);
    return;
  }

  // Check if already has ForensicFinance section
  if (person.sections.some(s => s.title === 'Forensic Financial Analysis (Wire Ledger)')) {
    console.log(`  SKIP enrichment (exists): ${personId}`);
    return;
  }

  // Find all wires involving this person
  const relatedPairs = Object.values(pairAggregates).filter(
    agg => agg.fromId === personId || agg.toId === personId
  );

  if (relatedPairs.length === 0) {
    console.log(`  SKIP enrichment (no wire data): ${personId}`);
    return;
  }

  // Build section content
  const inflows = relatedPairs.filter(p => p.toId === personId);
  const outflows = relatedPairs.filter(p => p.fromId === personId);

  let content = '';
  const allBates = [];

  if (inflows.length > 0) {
    const totalIn = inflows.reduce((s, p) => s + p.totalAmount, 0);
    content += `**Inflows (Unverified):** ${formatAmount(totalIn)} across ${inflows.reduce((s, p) => s + p.wires.length, 0)} wires from ${inflows.length} source(s).\n\n`;
    inflows.forEach(p => {
      const counterparty = findPersonById(p.fromId);
      const name = counterparty ? counterparty.name : p.fromId;
      content += `- ${name}: ${formatAmount(p.totalAmount)} (${p.wires.length} wire${p.wires.length > 1 ? 's' : ''})`;
      if (p.batesNumbers.length > 0) {
        content += ` — Bates: ${p.batesNumbers.slice(0, 3).join(', ')}`;
        allBates.push(...p.batesNumbers);
      }
      content += '\n';
    });
    content += '\n';
  }

  if (outflows.length > 0) {
    const totalOut = outflows.reduce((s, p) => s + p.totalAmount, 0);
    content += `**Outflows (Unverified):** ${formatAmount(totalOut)} across ${outflows.reduce((s, p) => s + p.wires.length, 0)} wires to ${outflows.length} destination(s).\n\n`;
    outflows.forEach(p => {
      const counterparty = findPersonById(p.toId);
      const name = counterparty ? counterparty.name : p.toId;
      content += `- ${name}: ${formatAmount(p.totalAmount)} (${p.wires.length} wire${p.wires.length > 1 ? 's' : ''})`;
      if (p.batesNumbers.length > 0) {
        content += ` — Bates: ${p.batesNumbers.slice(0, 3).join(', ')}`;
        allBates.push(...p.batesNumbers);
      }
      content += '\n';
    });
    content += '\n';
  }

  content += 'All amounts are automated extractions from the epstein-forensic-finance repository (CC BY 4.0) and have not been independently verified. Appearance does not imply wrongdoing.';

  // Determine best verification status across all related wires
  let bestTierRank = 0;
  const tierRank = { VERIFIED: 5, PROVEN: 4, FINCEN_VALIDATED: 3, STRONG: 3, FINCEN_AMOUNT_MATCH: 2, FINCEN_RANGE_MATCH: 1, MODERATE: 1, STATEMENT_ONLY: 0 };
  relatedPairs.forEach(p => {
    const rank = tierRank[p.bestTier] || 0;
    if (rank > bestTierRank) bestTierRank = rank;
  });
  const sectionVerification = bestTierRank >= 4 ? 'verified' : 'unverified';

  person.sections.push({
    title: 'Forensic Financial Analysis (Wire Ledger)',
    content: content,
    sources: ['ForensicFinance'],
    verificationStatus: sectionVerification,
    efta: [...new Set(allBates)]
  });

  if (!person.sources.includes('ForensicFinance')) {
    person.sources.push('ForensicFinance');
  }

  console.log(`  ENRICH: ${personId} — ${relatedPairs.length} counterparty pair(s)`);
});

// ============================================================
// PHASE 4: CREATE FINANCIAL CONNECTIONS
// ============================================================
console.log('\n=== PHASE 4: Financial connections ===\n');

let connAdded = 0, connMerged = 0;
Object.values(pairAggregates).forEach(agg => {
  // Only create connections where both entities exist as people
  if (!findPersonById(agg.fromId) || !findPersonById(agg.toId)) return;

  const { verificationStatus, strength } = tierToVerification(agg.bestTier);
  const wireCount = agg.wires.length;
  const batesStr = agg.batesNumbers.length > 0
    ? ` Bates: ${agg.batesNumbers.slice(0, 3).join(', ')}${agg.batesNumbers.length > 3 ? ` (+${agg.batesNumbers.length - 3} more)` : ''}.`
    : '';
  const dateRange = agg.dates.length > 0
    ? ` (${agg.dates.sort()[0]} to ${agg.dates.sort().pop()})`
    : '';

  const description = `${formatAmount(agg.totalAmount)} across ${wireCount} wire transfer${wireCount > 1 ? 's' : ''}${dateRange}.${batesStr}${verificationStatus === 'unverified' ? ' (Unverified — automated extraction)' : ''}`;

  const connId = `ff-wire-${agg.fromId}-${agg.toId}`;
  const result = addConnection({
    id: connId,
    sourcePersonId: agg.fromId,
    targetPersonId: agg.toId,
    relationshipType: 'financial',
    strength: strength,
    description: description,
    sources: ['ForensicFinance'],
    verificationStatus: verificationStatus
  });

  if (result) connAdded++;
  else connMerged++;
});

console.log(`\nConnections added: ${connAdded}, merged: ${connMerged}\n`);

// Update connectionIds on all people
people.forEach(person => {
  const relatedConns = connections.filter(
    c => c.sourcePersonId === person.id || c.targetPersonId === person.id
  );
  const connIds = relatedConns.map(c => c.id);
  connIds.forEach(cid => {
    if (!person.connectionIds.includes(cid)) {
      person.connectionIds.push(cid);
    }
  });
});

// ============================================================
// PHASE 5: TIMELINE EVENTS — TOP WIRE TRANSFERS
// ============================================================
console.log('=== PHASE 5: Timeline events ===\n');

// Select top ~20 most significant wire transfers
const significantWires = wireLedger
  .filter(w => {
    const fromId = ENTITY_TO_PERSON[w.entity_from];
    const toId = ENTITY_TO_PERSON[w.entity_to];
    return fromId && toId && fromId !== toId && w.amount >= 10000000 &&
           (w.validation_tier === 'VERIFIED' || w.validation_tier === 'PROVEN' || w.validation_tier === 'FINCEN_AMOUNT_MATCH');
  })
  .sort((a, b) => b.amount - a.amount)
  .slice(0, 20);

significantWires.forEach(wire => {
  const fromId = ENTITY_TO_PERSON[wire.entity_from];
  const toId = ENTITY_TO_PERSON[wire.entity_to];
  const isoDate = normalizeDate(wire.date);
  const fromPerson = findPersonById(fromId);
  const toPerson = findPersonById(toId);
  const fromName = fromPerson ? fromPerson.name : wire.entity_from;
  const toName = toPerson ? toPerson.name : wire.entity_to;

  const eventId = `ff-wire-${isoDate}-${fromId}-${toId}`.substring(0, 60);

  addTimelineEvent(makeTimelineEvent({
    id: eventId,
    date: isoDate,
    dateDisplay: formatDateDisplay(wire.date),
    era: determineEra(isoDate),
    title: `${formatAmount(wire.amount)} Wire: ${fromName} → ${toName}`,
    body: `Verified wire transfer of ${formatAmount(wire.amount)} from ${fromName} to ${toName}.${wire.bates ? ` Bates stamp: ${wire.bates}.` : ''} Flow direction: ${wire.flow_direction || 'unknown'}. Bank: ${wire.bank || 'Deutsche Bank'}. Validation tier: ${wire.validation_tier}.\n\nAll amounts are automated extractions from the epstein-forensic-finance repository (CC BY 4.0) and have not been independently verified. Appearance does not imply wrongdoing.`,
    summary: `Wire transfer of ${formatAmount(wire.amount)} from ${fromName} to ${toName}. ${wire.bates ? `Bates: ${wire.bates}.` : ''} Validated as ${wire.validation_tier}.`,
    peopleIds: [fromId, toId].filter(Boolean),
    themeIds: ['financial-crimes-money-laundering'],
    sources: ['ForensicFinance'],
    tags: ['financial'],
    efta: wire.bates ? [wire.bates] : [],
    verificationStatus: wire.validation_tier === 'VERIFIED' || wire.validation_tier === 'PROVEN' ? 'verified' : 'unverified'
  }));
});

// Add the repo publication milestone event
addTimelineEvent(makeTimelineEvent({
  id: '2026-02-forensic-finance-repo-published',
  date: '2026-02',
  dateDisplay: 'February 2026',
  era: '2020-present',
  title: 'Forensic Finance Repository Published — $1.96B in Financial Activity Reconstructed',
  body: 'Randall Scott Taylor published the epstein-forensic-finance GitHub repository containing the first systematic computational forensic accounting of the EFTA corpus. Processed 1.48M documents across 28+ relational database tables. Identified $2,146,000,000 (Unverified) in total financial activity across the publication ledger (6,310 transactions). The auditable T1–T3 subtotal of $1,960,600,000 represents 104.4% of the $1.878B FinCEN SAR benchmark. Mapped a 4-tier shell trust hierarchy with 481 audited wire transfers across 14 shell entities and 8+ banking institutions.\n\nKey finding: The "Verification Wall" — only Bates-stamped bank documents constitute verified evidence. 94.8% of NLP-extracted entity-financial associations are low-confidence noise. Celebrity names produce $0 verified bank documents despite large claimed NLP amounts.\n\nAll amounts are automated extractions and have not been independently verified.',
  summary: 'Publication of the epstein-forensic-finance repository — the first systematic computational forensic accounting of the EFTA corpus. Identified $2.15B in total financial activity across 6,310 transactions, mapped a 4-tier shell trust hierarchy.',
  peopleIds: ['jeffrey-epstein', 'leon-black', 'darren-indyke', 'ghislaine-maxwell'],
  themeIds: ['financial-crimes-money-laundering', 'community-research-tools-architecture'],
  sources: ['ForensicFinance'],
  tags: ['financial', 'media'],
  relatedThemeIds: ['financial-crimes-money-laundering', 'community-research-tools-architecture']
}));

// Update timelineEventIds on people
timeline.forEach(event => {
  if (!event.id.startsWith('ff-wire-') && event.id !== '2026-02-forensic-finance-repo-published') return;
  (event.peopleIds || []).forEach(pid => {
    const person = findPersonById(pid);
    if (person && !person.timelineEventIds.includes(event.id)) {
      person.timelineEventIds.push(event.id);
    }
  });
});

// ============================================================
// PHASE 6: ENRICH THEMES
// ============================================================
console.log('\n=== PHASE 6: Enrich themes ===\n');

// 6A. Financial Crimes & Money Laundering theme
const financialTheme = findThemeById('financial-crimes-money-laundering');
if (financialTheme) {
  const fullMarker = '4-Tier Shell Trust Hierarchy';
  if (!financialTheme.content.includes(fullMarker)) {
    financialTheme.content += `\n\n### Forensic Finance Repository (February 2026)\n\nThe randallscott25-star/epstein-forensic-finance GitHub repository is the first systematic computational forensic accounting of the EFTA corpus. Built from 1.48M DOJ documents across 28+ relational database tables.\n\n**Headline figures:** $2,146,000,000 (Unverified) total financial activity extracted across the publication ledger (6,310 transactions). The auditable T1–T3 subtotal of $1,960,600,000 represents 104.4% of the $1.878B FinCEN SAR benchmark. The excess is expected — SARs capture only suspicious transactions while the EFTA corpus contains complete financial records including legitimate transactions.\n\n**4-Tier Shell Trust Hierarchy:**\n- **Tier 1 (Holding):** Southern Trust Company Inc. ($151.5M in from Black, Rothschild, Narrow Holdings). 2017 Caterpillar Trust ($15M from Blockchain Capital).\n- **Tier 2 (Distribution):** Haze Trust ($49.7M out, $21.8M in from Sotheby\'s/Christie\'s). Southern Financial LLC ($14M in from Tudor Futures, $24.6M from Haze Trust).\n- **Tier 3 (Operating):** Jeepers Inc. ($51.9M out to Epstein personal, 21 wires). Plan D LLC ($18M to Leon Black, 4 wires). Gratitude America ($6.3M — 88% to investment accounts). NES LLC ($554K to Maxwell). BV70 LLC ($22.5M to Plan D).\n- **Tier 4 (Personal):** Jeffrey Epstein NOW/SuperNow ($83.4M in). Darren Indyke ($6.4M in from Deutsche Bank).\n\n**Operator-level flows:** Darren Indyke $320.1M, Eileen Alexanderson $294M ($285M gap), Lyle Casriel $92.5M to Maxwell (176 payments).\n\n**Verification standard:** 94.8% of NLP-extracted fund flows are low-confidence noise. Only Bates-stamped bank documents constitute verified evidence. Celebrity names produce $0 verified bank documents despite large claimed amounts.\n\n**Key Bates numbers:** DB-SDNY-0002962 through DB-SDNY-0006113 (Leon Black wires), EFTA01075607 ($50M Oct 2008 wire), DB-SDNY-0005003 (Kellerhals $23M), DB-SDNY-0006153 (Haze Trust $36M internal), DB-SDNY-0008063 (Haze→Southern Financial $24.6M).\n\nAll amounts are automated extractions and have not been independently verified. Appearance does not imply wrongdoing. Financial analysis data from epstein-forensic-finance by Randall Scott Taylor (CC BY 4.0).`;

    // Add shell entity IDs to theme
    const shellIds = SHELL_ENTITIES.map(s => s.id);
    shellIds.forEach(sid => {
      if (!financialTheme.peopleIds.includes(sid)) {
        financialTheme.peopleIds.push(sid);
      }
    });

    if (!financialTheme.sources.includes('ForensicFinance')) {
      financialTheme.sources.push('ForensicFinance');
    }

    console.log('  ENRICH: financial-crimes-money-laundering');
  } else {
    console.log('  SKIP (already enriched): financial-crimes-money-laundering');
  }
}

// 6B. Community Research Tools & Architecture theme
const communityTheme = findThemeById('community-research-tools-architecture');
if (communityTheme) {
  const marker = '### epstein-forensic-finance Repository';
  if (!communityTheme.content.includes(marker)) {
    communityTheme.content += `\n\n${marker}\n\nThe randallscott25-star/epstein-forensic-finance GitHub repository (February 2026) represents the first systematic computational forensic accounting of the EFTA corpus. The project processed 1.48M DOJ documents through a 25+ phase extraction pipeline, building an 8GB SQLite relational database with 36 tables.\n\n**Database architecture:** Corpus layer (1.48M files), Entity intelligence layer (11.4M extracted entities), Financial analysis layer (105,000+ records including 481 audited wires), Redaction analysis layer, and External cross-reference layer (FAA aircraft registry, ICIJ offshore leaks).\n\n**The Verification Wall:** The project's most important methodological contribution. A 5-axis confidence scoring system classifies financial data into tiers: PROVEN (court-exhibit authenticated), STRONG (corroborated across sources), MODERATE (single-source extraction), WEAK/VERY_WEAK (NLP-only). This system demonstrated that 94.8% of NLP-extracted fund flows are low-confidence noise — establishing that only Bates-stamped bank documents constitute verified evidence.\n\n**Extraction pipeline:** OCR text extraction → keyword matching → spaCy NLP entity extraction → 5-axis scoring → 25+ phase deduplication, entity classification, chain-hop removal, custodian audit → master wire ledger (481 records) → publication ledger (6,310 transactions).\n\nLicensed under CC BY 4.0. Financial analysis data from epstein-forensic-finance by Randall Scott Taylor.`;

    if (!communityTheme.sources.includes('ForensicFinance')) {
      communityTheme.sources.push('ForensicFinance');
    }

    console.log('  ENRICH: community-research-tools-architecture');
  } else {
    console.log('  SKIP (already enriched): community-research-tools-architecture');
  }
}

// ============================================================
// PHASE 7: ADD ForensicFinance TO SOURCE TAG LEGEND
// ============================================================
// (handled in SourceTag.tsx component — no JSON update needed)

// ============================================================
// WRITE ALL FILES
// ============================================================
console.log('\n=== Writing files ===\n');

fs.writeFileSync(path.join(DATA, 'people.json'), JSON.stringify(people, null, 2));
console.log(`  people.json: ${people.length} entries`);

fs.writeFileSync(path.join(DATA, 'connections.json'), JSON.stringify(connections, null, 2));
console.log(`  connections.json: ${connections.length} entries`);

fs.writeFileSync(path.join(DATA, 'timeline.json'), JSON.stringify(timeline, null, 2));
console.log(`  timeline.json: ${timeline.length} entries`);

fs.writeFileSync(path.join(DATA, 'themes.json'), JSON.stringify(themes, null, 2));
console.log(`  themes.json: ${themes.length} entries`);

console.log('\nForensic Finance integration complete.\n');
