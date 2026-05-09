// =============================================================================
// AURORA OSI — Connected Platforms / Commercial Intelligence Backbone
// =============================================================================
// This module powers Aurora Opportunity Radar (AOR), the Country Permit
// Intelligence Agent, and the disruptive/adaptive scouting layers used across
// the /radar/* surfaces.
//
// EVERY claim shipped through this module ships with a SourceCitation so that
// operators, regulators, and clients can verify and validate the basis of any
// finding. The verification rule is: if it is not in `sources`, it is a
// hypothesis - not a finding.
// =============================================================================

// -----------------------------------------------------------------------------
// Verifiability primitives
// -----------------------------------------------------------------------------

export type SourceClass =
  | 'exchange_filing'
  | 'government_portal'
  | 'mining_cadastre'
  | 'petroleum_commission'
  | 'gazette'
  | 'tender_portal'
  | 'multilateral'
  | 'geological_survey'
  | 'corporate_disclosure'
  | 'deal_room'
  | 'court_filing'
  | 'regulator_register'
  | 'press_release'
  | 'rss_news'
  | 'industry_database'
  | 'satellite_open_data'
  | 'sovereign_wealth'
  | 'sanction_list'

export type SourceCitation = {
  /** Human-readable publisher / portal / authority name. */
  publisher: string
  /** A clickable URL the user can open to verify the claim. */
  url: string
  /** Optional title or document name. */
  title?: string
  /** Source class - drives confidence weighting in AOR scoring. */
  className: SourceClass
  /** ISO date the source was retrieved or last validated (YYYY-MM-DD). */
  retrieved?: string
  /** Optional jurisdiction tag, useful for cross-border filings. */
  jurisdiction?: string
  /** Confidence weight from 0-100. Aligns with confidenceSources table. */
  confidence?: number
  /** Free-text note explaining what this source proves. */
  note?: string
}

export type Opportunity = {
  company: string
  country: string
  commodity: string
  signal: string
  category: string
  source: string
  score: number
  urgency: 'Low' | 'Moderate' | 'High' | 'Critical'
  auroraFit: string
  action: string
  /** New: verifiable basis for the signal. */
  sources?: SourceCitation[]
  /** New: which adaptive trigger surfaced this opportunity. */
  triggerTag?: string
  /** New: time horizon of the opportunity window. */
  horizon?: '0-30d' | '30-90d' | '90-180d' | '180d+'
}

export type PromptTemplate = {
  name: string
  focus: string
  cadence: string
  /** New: the upstream sources this prompt should consult. */
  sources?: SourceCitation[]
}

export type ParentOreSystem = {
  parent: string
  targets: string[]
  priority: string
  thesis: string
  sources?: SourceCitation[]
}

export type RefineryOpportunity = {
  country: string
  focus: string
  infrastructure: number
  strategicFit: number
  nextStep: string
  sources?: SourceCitation[]
}

// -----------------------------------------------------------------------------
// Source confidence model
// -----------------------------------------------------------------------------

export const confidenceSources: Array<{
  source: string
  confidence: number
  className: string
  examples?: SourceCitation[]
}> = [
  {
    source: 'Exchange filing',
    confidence: 95,
    className: 'Very high',
    examples: [
      { publisher: 'SEDAR+ (CSA)', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA' },
      { publisher: 'ASX Announcements', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements.htm', className: 'exchange_filing', jurisdiction: 'AU' },
      { publisher: 'LSE RNS', url: 'https://www.londonstockexchange.com/news?tab=news-explorer', className: 'exchange_filing', jurisdiction: 'UK' },
      { publisher: 'SEC EDGAR', url: 'https://www.sec.gov/edgar/search/', className: 'exchange_filing', jurisdiction: 'US' },
      { publisher: 'JSE SENS', url: 'https://www.jse.co.za/news-and-results', className: 'exchange_filing', jurisdiction: 'ZA' },
      { publisher: 'TSX Venture Disclosures', url: 'https://money.tmx.com/en/quote', className: 'exchange_filing', jurisdiction: 'CA' },
    ],
  },
  {
    source: 'Government portal',
    confidence: 92,
    className: 'Very high',
    examples: [
      { publisher: 'USGS National Minerals Info Center', url: 'https://www.usgs.gov/centers/national-minerals-information-center', className: 'geological_survey', jurisdiction: 'US' },
      { publisher: 'Geoscience Australia', url: 'https://www.ga.gov.au', className: 'geological_survey', jurisdiction: 'AU' },
      { publisher: 'British Geological Survey', url: 'https://www.bgs.ac.uk', className: 'geological_survey', jurisdiction: 'UK' },
      { publisher: 'BRGM France', url: 'https://www.brgm.fr', className: 'geological_survey', jurisdiction: 'FR' },
    ],
  },
  {
    source: 'Mining cadastre',
    confidence: 90,
    className: 'Very high',
    examples: [
      { publisher: 'DRC CAMI Cadastre', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD' },
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH' },
      { publisher: 'Brazil ANM', url: 'https://www.gov.br/anm/pt-br', className: 'mining_cadastre', jurisdiction: 'BR' },
      { publisher: 'Chile SERNAGEOMIN', url: 'https://www.sernageomin.cl', className: 'mining_cadastre', jurisdiction: 'CL' },
      { publisher: 'Peru INGEMMET / GEOCATMIN', url: 'https://geocatmin.ingemmet.gob.pe', className: 'mining_cadastre', jurisdiction: 'PE' },
      { publisher: 'Indian Bureau of Mines', url: 'https://ibm.gov.in', className: 'mining_cadastre', jurisdiction: 'IN' },
    ],
  },
  {
    source: 'Petroleum commission',
    confidence: 90,
    className: 'Very high',
    examples: [
      { publisher: 'Norwegian Offshore Directorate (NPD/Sodir)', url: 'https://www.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO' },
      { publisher: 'UK NSTA', url: 'https://www.nstauthority.co.uk', className: 'petroleum_commission', jurisdiction: 'UK' },
      { publisher: 'BOEM (US offshore)', url: 'https://www.boem.gov', className: 'petroleum_commission', jurisdiction: 'US' },
      { publisher: 'Brazil ANP', url: 'https://www.gov.br/anp/pt-br', className: 'petroleum_commission', jurisdiction: 'BR' },
      { publisher: 'Ghana Petroleum Commission', url: 'https://www.petrocom.gov.gh', className: 'petroleum_commission', jurisdiction: 'GH' },
      { publisher: 'Senegal MEPM', url: 'https://www.energie.gouv.sn', className: 'petroleum_commission', jurisdiction: 'SN' },
    ],
  },
  { source: 'Tender portal', confidence: 84, className: 'High', examples: [
    { publisher: 'EU TED', url: 'https://ted.europa.eu', className: 'tender_portal', jurisdiction: 'EU' },
    { publisher: 'World Bank Projects & Procurement', url: 'https://projects.worldbank.org', className: 'multilateral' },
    { publisher: 'AfDB Procurement', url: 'https://www.afdb.org/en/projects-and-operations/procurement', className: 'multilateral' },
    { publisher: 'UNDP Procurement', url: 'https://procurement-notices.undp.org', className: 'multilateral' },
  ]},
  { source: 'Deal room', confidence: 78, className: 'High' },
  { source: 'Multilateral / DFI', confidence: 86, className: 'High', examples: [
    { publisher: 'IFC Disclosure Portal', url: 'https://disclosures.ifc.org', className: 'multilateral' },
    { publisher: 'EBRD Project Summaries', url: 'https://www.ebrd.com/work-with-us/projects.html', className: 'multilateral' },
  ]},
  { source: 'Sanctions / regulator', confidence: 88, className: 'High', examples: [
    { publisher: 'OFAC SDN', url: 'https://sanctionssearch.ofac.treas.gov', className: 'sanction_list', jurisdiction: 'US' },
    { publisher: 'UK OFSI', url: 'https://www.gov.uk/government/organisations/office-of-financial-sanctions-implementation', className: 'sanction_list', jurisdiction: 'UK' },
    { publisher: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu', className: 'sanction_list', jurisdiction: 'EU' },
  ]},
  { source: 'RSS / news wire', confidence: 64, className: 'Medium', examples: [
    { publisher: 'Reuters Commodities', url: 'https://www.reuters.com/markets/commodities/', className: 'rss_news' },
    { publisher: 'Mining.com', url: 'https://www.mining.com', className: 'rss_news' },
    { publisher: 'S&P Global Commodity Insights', url: 'https://www.spglobal.com/commodityinsights', className: 'rss_news' },
  ]},
  { source: 'Open Earth / satellite', confidence: 80, className: 'High', examples: [
    { publisher: 'Copernicus Open Access', url: 'https://dataspace.copernicus.eu', className: 'satellite_open_data' },
    { publisher: 'NASA Earthdata', url: 'https://www.earthdata.nasa.gov', className: 'satellite_open_data' },
    { publisher: 'USGS EarthExplorer', url: 'https://earthexplorer.usgs.gov', className: 'satellite_open_data' },
  ]},
]

// -----------------------------------------------------------------------------
// Relationship intelligence - the entity graph seed, with citations
// -----------------------------------------------------------------------------

export const relationshipSignals: Array<{
  entity: string
  relation: string
  target: string
  confidence: number
  sources?: SourceCitation[]
}> = [
  {
    entity: 'Frontier Uranium Corp',
    relation: 'raised capital for',
    target: 'Athabasca district-scale targeting',
    confidence: 92,
    sources: [
      { publisher: 'SEDAR+ (CSA)', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA', note: 'Verify private-placement / financing announcements via issuer profile.' },
    ],
  },
  {
    entity: 'Ghana Minerals Commission',
    relation: 'sovereign link to',
    target: 'bauxite beneficiation and critical minerals',
    confidence: 88,
    sources: [
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH' },
      { publisher: 'GIADEC (Ghana Integrated Aluminium Development Corp.)', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH' },
    ],
  },
  {
    entity: 'Copper Ridge Exploration',
    relation: 'seeking',
    target: 'JV/farm-in partner',
    confidence: 76,
    sources: [
      { publisher: 'TSX Venture issuer disclosures', url: 'https://money.tmx.com/en/quote', className: 'exchange_filing', jurisdiction: 'CA' },
    ],
  },
  {
    entity: 'Atlantic Energy Authority',
    relation: 'preparing',
    target: 'offshore licensing data room',
    confidence: 81,
    sources: [
      { publisher: 'Senegal MEPM', url: 'https://www.energie.gouv.sn', className: 'petroleum_commission', jurisdiction: 'SN' },
    ],
  },
  {
    entity: 'Saudi Ma\'aden',
    relation: 'expanding',
    target: 'phosphate, copper, REE platform via 2030 strategy',
    confidence: 90,
    sources: [
      { publisher: "Ma'aden Investor Relations", url: 'https://www.maaden.com.sa/en/investors', className: 'corporate_disclosure', jurisdiction: 'SA' },
      { publisher: 'Saudi Geological Survey', url: 'https://www.sgs.org.sa', className: 'geological_survey', jurisdiction: 'SA' },
    ],
  },
  {
    entity: 'DRC Ministry of Mines',
    relation: 'reviewing',
    target: 'cobalt royalty and concession reallocation',
    confidence: 78,
    sources: [
      { publisher: 'DRC Cadastre Minier (CAMI)', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD' },
      { publisher: 'EITI DRC', url: 'https://eiti.org/countries/democratic-republic-congo', className: 'multilateral', jurisdiction: 'CD' },
    ],
  },
  {
    entity: 'Indonesia Ministry of ESDM',
    relation: 'tightening',
    target: 'nickel export and downstream rules',
    confidence: 85,
    sources: [
      { publisher: 'Ministry of ESDM Indonesia', url: 'https://www.esdm.go.id', className: 'government_portal', jurisdiction: 'ID' },
    ],
  },
  {
    entity: 'Greenland MLSA',
    relation: 'opening',
    target: 'critical minerals license rounds',
    confidence: 82,
    sources: [
      { publisher: 'Greenland Mineral Licence and Safety Authority', url: 'https://www.govmin.gl', className: 'mining_cadastre', jurisdiction: 'GL' },
    ],
  },
]

// -----------------------------------------------------------------------------
// Exploration timeline - lifecycle of a tracked AOR signal
// -----------------------------------------------------------------------------

export const explorationTimeline: Array<{
  stage: string
  entity: string
  evidence: string
  timing: string
  sources?: SourceCitation[]
}> = [
  {
    stage: 'Funding',
    entity: 'Frontier Uranium Corp',
    evidence: 'Private placement closed',
    timing: '0-30 days',
    sources: [
      { publisher: 'SEDAR+', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA' },
    ],
  },
  {
    stage: 'Permits',
    entity: 'Helios Helium Ltd',
    evidence: 'License application language',
    timing: '30-60 days',
    sources: [
      { publisher: 'Tanzania Mining Commission', url: 'https://www.tumemadini.go.tz', className: 'mining_cadastre', jurisdiction: 'TZ' },
    ],
  },
  {
    stage: 'Drilling',
    entity: 'Oil & gas operators',
    evidence: 'Rig additions and active field cycle',
    timing: 'live',
    sources: [
      { publisher: 'Baker Hughes Rig Count', url: 'https://rigcount.bakerhughes.com', className: 'industry_database' },
      { publisher: 'Norwegian Offshore Directorate Wells', url: 'https://factpages.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO' },
    ],
  },
  {
    stage: 'Outreach',
    entity: 'Ghana Minerals Commission',
    evidence: 'Sovereign industrial policy window',
    timing: 'immediate',
    sources: [
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH' },
      { publisher: 'GIADEC', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH' },
    ],
  },
  {
    stage: 'Licensing round',
    entity: 'Brazil ANP',
    evidence: 'Permanent Offer cycle (oferta permanente) updates',
    timing: 'rolling',
    sources: [
      { publisher: 'ANP Permanent Offer', url: 'https://www.gov.br/anp/pt-br/assuntos/exploracao-e-producao-de-oleo-e-gas/rodadas-de-licitacao', className: 'petroleum_commission', jurisdiction: 'BR' },
    ],
  },
  {
    stage: 'Distress / restructuring',
    entity: 'Junior copper / lithium portfolio',
    evidence: 'Court protection filings, NOIs, asset sales',
    timing: '0-90 days',
    sources: [
      { publisher: 'Insolvency Insider Canada', url: 'https://insolvencyinsider.ca', className: 'court_filing', jurisdiction: 'CA' },
      { publisher: 'UK Companies House', url: 'https://www.gov.uk/government/organisations/companies-house', className: 'regulator_register', jurisdiction: 'UK' },
    ],
  },
]

// -----------------------------------------------------------------------------
// Conversion loop telemetry
// -----------------------------------------------------------------------------

export const conversionLoop = [
  { step: 'Signals', count: 142 },
  { step: 'Triaged', count: 71 },
  { step: 'Outreach', count: 38 },
  { step: 'Replies', count: 17 },
  { step: 'Scan requests', count: 9 },
  { step: 'Proposals', count: 5 },
  { step: 'Converted', count: 2 },
]

// -----------------------------------------------------------------------------
// Permit Country Watchlist - global, all-encompassing, source-cited
// -----------------------------------------------------------------------------

export type PermitCountry = {
  country: string
  sources: number
  focus: string
  readiness: number
  evidence: string
  why: string
  /** New: list of verifiable cadastre / commission / survey URLs. */
  sourceCitations?: SourceCitation[]
  /** New: continent / region tag for global filtering. */
  region?: 'Africa' | 'Americas' | 'Europe' | 'Middle East' | 'Asia-Pacific' | 'Eurasia' | 'Arctic' | 'Oceania'
  status?: 'active' | 'seeded' | 'adapter_needed' | 'monitor'
}

export const permitCountries: PermitCountry[] = [
  // -------------------- AFRICA --------------------
  {
    country: 'Ghana', sources: 5, region: 'Africa', status: 'active',
    focus: 'Bauxite, gold, Voltaian petroleum, sovereign mapping',
    readiness: 92,
    evidence: 'ghana_bauxite_deposits.json, ghana_gold_deposits.json, volta_basin_seismic_surveys.json',
    why: 'Connects ASMI bauxite co-products, gold, and Voltaian petroleum into a sovereign intelligence package.',
    sourceCitations: [
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH', confidence: 90 },
      { publisher: 'Ghana Petroleum Commission', url: 'https://www.petrocom.gov.gh', className: 'petroleum_commission', jurisdiction: 'GH', confidence: 90 },
      { publisher: 'GIADEC', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH', confidence: 86 },
      { publisher: 'EITI Ghana', url: 'https://eiti.org/countries/ghana', className: 'multilateral', jurisdiction: 'GH', confidence: 84 },
      { publisher: 'Ghana Geological Survey Authority', url: 'https://www.ggsa.gov.gh', className: 'geological_survey', jurisdiction: 'GH', confidence: 88 },
    ],
  },
  {
    country: 'Guinea', sources: 4, region: 'Africa', status: 'active',
    focus: 'Bauxite, gold, gallium, titanium, scandium',
    readiness: 88,
    evidence: 'guinea_bauxite_deposits.json, guinea_gold_deposits.json',
    why: 'Priority ASMI bauxite country where hidden co-products may be leaving inside raw ore exports.',
    sourceCitations: [
      { publisher: 'Centre de Promotion et de Développement Miniers', url: 'https://mines.gov.gn', className: 'mining_cadastre', jurisdiction: 'GN', confidence: 86 },
      { publisher: 'EITI Guinea', url: 'https://eiti.org/countries/guinea', className: 'multilateral', jurisdiction: 'GN', confidence: 82 },
      { publisher: 'Reuters Africa Mining Wire', url: 'https://www.reuters.com/world/africa/', className: 'rss_news', confidence: 64 },
    ],
  },
  {
    country: 'Senegal', sources: 4, region: 'Africa', status: 'active',
    focus: 'Phosphates, hydrocarbons, hydrogen, REEs',
    readiness: 74,
    evidence: 'Senegal-Onshore/, natural hydrogen / petroleum-adjacent AOI coverage',
    why: 'Combines phosphate/REE ASMI logic with petroleum and hydrogen fairway screening.',
    sourceCitations: [
      { publisher: 'Senegal MEPM', url: 'https://www.energie.gouv.sn', className: 'petroleum_commission', jurisdiction: 'SN', confidence: 88 },
      { publisher: 'PETROSEN Holding', url: 'https://www.petrosenholding.sn', className: 'corporate_disclosure', jurisdiction: 'SN', confidence: 80 },
      { publisher: 'Ministère des Mines et Géologie Sénégal', url: 'https://www.mines.gouv.sn', className: 'mining_cadastre', jurisdiction: 'SN', confidence: 82 },
    ],
  },
  {
    country: 'Namibia', sources: 4, region: 'Africa', status: 'active',
    focus: 'Hydrogen, helium, uranium, copper',
    readiness: 76,
    evidence: 'Natural hydrogen fairway strategic seed, Namibia permit watch AOI',
    why: 'Frontier fairway where early entrant signals can become high-value outreach.',
    sourceCitations: [
      { publisher: 'Namibia Ministry of Mines & Energy', url: 'https://www.mme.gov.na', className: 'mining_cadastre', jurisdiction: 'NA', confidence: 86 },
      { publisher: 'Geological Survey of Namibia', url: 'https://www.mme.gov.na/directorates/geosurvey/', className: 'geological_survey', jurisdiction: 'NA', confidence: 84 },
      { publisher: 'Namibia Green Hydrogen Programme', url: 'https://gh2namibia.com', className: 'government_portal', jurisdiction: 'NA', confidence: 78 },
    ],
  },
  {
    country: 'Zambia', sources: 4, region: 'Africa', status: 'active',
    focus: 'Copper, cobalt, nickel, manganese',
    readiness: 78,
    evidence: 'AOR copper/JV seed, Zambia cadastre target',
    why: 'Copper-belt concession changes and JV notices can quickly become scan opportunities.',
    sourceCitations: [
      { publisher: 'Zambia Mining Cadastre', url: 'https://portals.flexicadastre.com/zambia/', className: 'mining_cadastre', jurisdiction: 'ZM', confidence: 86 },
      { publisher: 'Ministry of Mines and Minerals Development', url: 'https://www.mmmd.gov.zm', className: 'government_portal', jurisdiction: 'ZM', confidence: 82 },
    ],
  },
  {
    country: 'DRC', sources: 4, region: 'Africa', status: 'active',
    focus: 'Cobalt, copper, lithium (Manono), tin, tantalum',
    readiness: 80,
    evidence: 'Cadastre Minier portal, EITI cobalt disclosures',
    why: 'Critical to global EV supply; concession reshuffles + sovereign reviews open partnerable windows.',
    sourceCitations: [
      { publisher: 'DRC CAMI Cadastre', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD', confidence: 88 },
      { publisher: 'EITI DRC', url: 'https://eiti.org/countries/democratic-republic-congo', className: 'multilateral', jurisdiction: 'CD', confidence: 84 },
      { publisher: 'IPIS DRC mining map', url: 'https://www.ipisresearch.be/mapping/webmapping/drcongo/', className: 'industry_database', jurisdiction: 'CD', confidence: 78 },
    ],
  },
  {
    country: 'South Africa', sources: 4, region: 'Africa', status: 'active',
    focus: 'PGMs, manganese, vanadium, coal, REEs',
    readiness: 84,
    evidence: 'DMRE cadastre, Council for Geoscience datasets',
    why: 'Strong filing regime; PGM/manganese majors create predictable JV windows.',
    sourceCitations: [
      { publisher: 'South African DMRE', url: 'https://www.dmre.gov.za', className: 'mining_cadastre', jurisdiction: 'ZA', confidence: 88 },
      { publisher: 'Council for Geoscience', url: 'https://www.geoscience.org.za', className: 'geological_survey', jurisdiction: 'ZA', confidence: 86 },
      { publisher: 'JSE SENS', url: 'https://www.jse.co.za/news-and-results', className: 'exchange_filing', jurisdiction: 'ZA', confidence: 92 },
    ],
  },
  {
    country: 'Tanzania', sources: 3, region: 'Africa', status: 'active',
    focus: 'Helium, gold, REEs, nickel',
    readiness: 72,
    evidence: 'Helium fairway adjacency, gold cadastre activity',
    why: 'Helium tenders + REE reform create asymmetric early-mover positioning.',
    sourceCitations: [
      { publisher: 'Tanzania Mining Commission', url: 'https://www.tumemadini.go.tz', className: 'mining_cadastre', jurisdiction: 'TZ', confidence: 84 },
      { publisher: 'Geological Survey of Tanzania', url: 'https://www.gst.go.tz', className: 'geological_survey', jurisdiction: 'TZ', confidence: 78 },
    ],
  },
  {
    country: 'Botswana', sources: 3, region: 'Africa', status: 'active',
    focus: 'Diamonds, copper, manganese, coal-bed methane',
    readiness: 78,
    evidence: 'Botswana mineral deeds register, Kalahari Copper Belt activity',
    why: 'Stable jurisdiction + Kalahari Copper Belt churn = high-quality JV deal flow.',
    sourceCitations: [
      { publisher: 'Botswana Ministry of Minerals & Energy', url: 'https://www.gov.bw/ministries/ministry-minerals-energy', className: 'government_portal', jurisdiction: 'BW', confidence: 82 },
      { publisher: 'Botswana Geoscience Institute', url: 'https://www.bgi.org.bw', className: 'geological_survey', jurisdiction: 'BW', confidence: 80 },
    ],
  },
  {
    country: 'Mozambique', sources: 3, region: 'Africa', status: 'seeded',
    focus: 'LNG, graphite, heavy mineral sands, REEs',
    readiness: 68,
    evidence: 'INP gas blocks, Balama graphite reference',
    why: 'LNG restart + graphite anode shortages keep this high in EV-supply scouting.',
    sourceCitations: [
      { publisher: 'INP Mozambique', url: 'https://www.inp.gov.mz', className: 'petroleum_commission', jurisdiction: 'MZ', confidence: 82 },
      { publisher: 'INAMI Mozambique', url: 'https://www.inami.gov.mz', className: 'mining_cadastre', jurisdiction: 'MZ', confidence: 76 },
    ],
  },
  {
    country: 'Mali', sources: 3, region: 'Africa', status: 'monitor',
    focus: 'Gold, lithium, frontier minerals',
    readiness: 62,
    evidence: 'mali_gold_deposits.json, distressed asset opportunities',
    why: 'Sovereign mining-code rewrites repeatedly create distressed and renegotiation windows.',
    sourceCitations: [
      { publisher: 'Direction Nationale de la Géologie et des Mines', url: 'https://dngm.gouv.ml', className: 'mining_cadastre', jurisdiction: 'ML', confidence: 70 },
      { publisher: 'Reuters Africa Mining Wire', url: 'https://www.reuters.com/world/africa/', className: 'rss_news', confidence: 64 },
    ],
  },
  {
    country: 'Gambia', sources: 2, region: 'Africa', status: 'seeded',
    focus: 'Hydrocarbons, heavy minerals, frontier basin screening',
    readiness: 66, evidence: 'Gambia-Onshore/',
    why: 'Small-market licensing changes can create fast sovereign intelligence windows.',
    sourceCitations: [
      { publisher: 'Gambia Ministry of Petroleum & Energy', url: 'https://www.mope.gov.gm', className: 'petroleum_commission', jurisdiction: 'GM', confidence: 70 },
    ],
  },
  {
    country: 'Morocco', sources: 3, region: 'Africa', status: 'active',
    focus: 'Phosphates, REEs, cobalt, copper, hydrogen',
    readiness: 80,
    evidence: 'OCP Group disclosures, ONHYM acreage portal',
    why: 'OCP REE thesis + green-hydrogen plays make Morocco a tier-1 ASMI lab.',
    sourceCitations: [
      { publisher: 'ONHYM', url: 'https://www.onhym.com', className: 'petroleum_commission', jurisdiction: 'MA', confidence: 86 },
      { publisher: 'OCP Group IR', url: 'https://www.ocpgroup.ma/investor', className: 'corporate_disclosure', jurisdiction: 'MA', confidence: 84 },
    ],
  },
  {
    country: 'Egypt', sources: 3, region: 'Africa', status: 'seeded',
    focus: 'Hydrocarbons, gold, phosphate, hydrogen',
    readiness: 70,
    evidence: 'EGAS / EGPC bid round portals, Red Sea gold belt activity',
    why: 'Routine bid rounds + Eastern Desert gold reform = fast deal-flow lane.',
    sourceCitations: [
      { publisher: 'EGAS', url: 'https://egas.com.eg', className: 'petroleum_commission', jurisdiction: 'EG', confidence: 80 },
      { publisher: 'Egyptian Mineral Resources Authority', url: 'https://www.emra.gov.eg', className: 'mining_cadastre', jurisdiction: 'EG', confidence: 76 },
    ],
  },
  {
    country: 'Nigeria', sources: 3, region: 'Africa', status: 'active',
    focus: 'Lithium, lead-zinc, gold, hydrocarbons',
    readiness: 68,
    evidence: 'NUPRC bid round portal, Mining Cadastre Office (MCO) tenement search',
    why: 'Solid minerals reform + recurring oil rounds keep scouting cadence high.',
    sourceCitations: [
      { publisher: 'Nigerian Upstream Petroleum Regulatory Commission', url: 'https://www.nuprc.gov.ng', className: 'petroleum_commission', jurisdiction: 'NG', confidence: 82 },
      { publisher: 'Mining Cadastre Office (MCO)', url: 'https://miningcadastre.gov.ng', className: 'mining_cadastre', jurisdiction: 'NG', confidence: 80 },
    ],
  },
  // -------------------- AMERICAS --------------------
  {
    country: 'Canada', sources: 5, region: 'Americas', status: 'active',
    focus: 'Lithium brines, hydrogen, uranium, Ring of Fire',
    readiness: 90,
    evidence: 'canada_oilfield_brine_lithium.json, canadian_basin_brines.kml, canadian_h2_provinces.kml',
    why: 'High-quality public geoscience + claim registers make Canada a strong permit-to-scan testbed.',
    sourceCitations: [
      { publisher: 'Natural Resources Canada (NRCan)', url: 'https://www.nrcan.gc.ca', className: 'geological_survey', jurisdiction: 'CA', confidence: 90 },
      { publisher: 'SEDAR+', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA', confidence: 95 },
      { publisher: 'Saskatchewan Mineral Administration Registry System', url: 'https://www.economy.gov.sk.ca/MARS/', className: 'mining_cadastre', jurisdiction: 'CA-SK', confidence: 88 },
      { publisher: 'Ontario MLAS', url: 'https://www.mlas.mndm.gov.on.ca', className: 'mining_cadastre', jurisdiction: 'CA-ON', confidence: 88 },
    ],
  },
  {
    country: 'United States', sources: 5, region: 'Americas', status: 'active',
    focus: 'Helium, hydrogen, lithium, uranium, REEs',
    readiness: 86,
    evidence: 'hugoton_open_windows_launches.json, lithium brine AOIs, uranium priority AOIs',
    why: 'Federal/state data can power fast tests across helium, lithium brines, uranium, and REEs.',
    sourceCitations: [
      { publisher: 'USGS', url: 'https://www.usgs.gov', className: 'geological_survey', jurisdiction: 'US', confidence: 92 },
      { publisher: 'BLM Mining Claims (LR2000)', url: 'https://reports.blm.gov/reports/LR2000', className: 'mining_cadastre', jurisdiction: 'US', confidence: 88 },
      { publisher: 'BOEM Lease Maps', url: 'https://www.boem.gov/oil-gas-energy/mapping-and-data', className: 'petroleum_commission', jurisdiction: 'US', confidence: 90 },
      { publisher: 'SEC EDGAR', url: 'https://www.sec.gov/edgar/search/', className: 'exchange_filing', jurisdiction: 'US', confidence: 95 },
      { publisher: 'DOE Loan Programs Office', url: 'https://www.energy.gov/lpo/loan-programs-office', className: 'government_portal', jurisdiction: 'US', confidence: 86 },
    ],
  },
  {
    country: 'Brazil', sources: 4, region: 'Americas', status: 'active',
    focus: 'Bauxite, lithium, REEs, iron ore, niobium, oil & gas',
    readiness: 84,
    evidence: 'brazil_bauxite_deposits.json, bauxite coordinate scans',
    why: 'Major ASMI and critical-minerals jurisdiction with large parent-ore systems.',
    sourceCitations: [
      { publisher: 'ANM Brazil', url: 'https://www.gov.br/anm/pt-br', className: 'mining_cadastre', jurisdiction: 'BR', confidence: 88 },
      { publisher: 'CPRM / SGB (Geological Survey of Brazil)', url: 'https://www.sgb.gov.br', className: 'geological_survey', jurisdiction: 'BR', confidence: 86 },
      { publisher: 'ANP Brazil (oil & gas)', url: 'https://www.gov.br/anp/pt-br', className: 'petroleum_commission', jurisdiction: 'BR', confidence: 90 },
      { publisher: 'B3 Listed Companies', url: 'https://www.b3.com.br/en_us/', className: 'exchange_filing', jurisdiction: 'BR', confidence: 92 },
    ],
  },
  {
    country: 'Chile', sources: 3, region: 'Americas', status: 'active',
    focus: 'Lithium brines, copper, potash',
    readiness: 80,
    evidence: 'salars_americas.kml, lithium brine AOI coverage',
    why: 'Salar reform + national lithium strategy create repeat opportunity windows.',
    sourceCitations: [
      { publisher: 'SERNAGEOMIN', url: 'https://www.sernageomin.cl', className: 'geological_survey', jurisdiction: 'CL', confidence: 88 },
      { publisher: 'COCHILCO (Copper Commission)', url: 'https://www.cochilco.cl', className: 'government_portal', jurisdiction: 'CL', confidence: 84 },
      { publisher: 'Codelco IR', url: 'https://www.codelco.com/investors', className: 'corporate_disclosure', jurisdiction: 'CL', confidence: 86 },
    ],
  },
  {
    country: 'Argentina', sources: 4, region: 'Americas', status: 'active',
    focus: 'Lithium triangle, copper, shale gas (Vaca Muerta), REEs',
    readiness: 82,
    evidence: 'Lithium triangle salar AOIs, Catamarca/Salta/Jujuy permit churn',
    why: 'RIGI investment incentive + lithium frontier = compounding entry windows.',
    sourceCitations: [
      { publisher: 'SEGEMAR', url: 'https://www.segemar.gov.ar', className: 'geological_survey', jurisdiction: 'AR', confidence: 86 },
      { publisher: 'Secretaría de Minería de la Nación', url: 'https://www.argentina.gob.ar/economia/mineria', className: 'mining_cadastre', jurisdiction: 'AR', confidence: 82 },
      { publisher: 'Bolsas y Mercados Argentinos', url: 'https://www.byma.com.ar', className: 'exchange_filing', jurisdiction: 'AR', confidence: 84 },
    ],
  },
  {
    country: 'Peru', sources: 3, region: 'Americas', status: 'active',
    focus: 'Copper, gold, silver, polymetallic, lithium',
    readiness: 80,
    evidence: 'GEOCATMIN tenement coverage, INGEMMET datasets',
    why: 'World-class porphyry pipeline + Macusani uranium/lithium make Peru a recurring scouting lane.',
    sourceCitations: [
      { publisher: 'GEOCATMIN (INGEMMET)', url: 'https://geocatmin.ingemmet.gob.pe', className: 'mining_cadastre', jurisdiction: 'PE', confidence: 88 },
      { publisher: 'MINEM Peru', url: 'https://www.gob.pe/minem', className: 'government_portal', jurisdiction: 'PE', confidence: 84 },
    ],
  },
  {
    country: 'Mexico', sources: 3, region: 'Americas', status: 'monitor',
    focus: 'Silver, copper, lithium (sovereign), fluorspar',
    readiness: 64,
    evidence: 'Servicio Geológico Mexicano datasets, Sonora lithium nationalisation context',
    why: 'Lithium nationalisation + permit moratoria create distressed and partner-of-state opportunities.',
    sourceCitations: [
      { publisher: 'Servicio Geológico Mexicano', url: 'https://www.gob.mx/sgm', className: 'geological_survey', jurisdiction: 'MX', confidence: 80 },
      { publisher: 'Secretaría de Economía – Minería', url: 'https://www.gob.mx/se/acciones-y-programas/mineria', className: 'mining_cadastre', jurisdiction: 'MX', confidence: 76 },
    ],
  },
  {
    country: 'Colombia', sources: 3, region: 'Americas', status: 'seeded',
    focus: 'Copper, gold, coal transition, REEs',
    readiness: 66,
    evidence: 'ANM Colombia portal, Servicio Geológico Colombiano datasets',
    why: 'Energy-transition policy creates coal-to-critical pivot opportunities.',
    sourceCitations: [
      { publisher: 'Agencia Nacional de Minería Colombia', url: 'https://www.anm.gov.co', className: 'mining_cadastre', jurisdiction: 'CO', confidence: 80 },
      { publisher: 'SGC Colombia', url: 'https://www.sgc.gov.co', className: 'geological_survey', jurisdiction: 'CO', confidence: 82 },
    ],
  },
  {
    country: 'Guyana', sources: 3, region: 'Americas', status: 'active',
    focus: 'Offshore oil (Stabroek), gold, bauxite',
    readiness: 76,
    evidence: 'GGMC permit data, Stabroek block disclosures',
    why: 'Highest per-capita oil discovery growth globally; supply-chain & onshore minerals pull-through.',
    sourceCitations: [
      { publisher: 'Guyana Geology and Mines Commission', url: 'https://ggmc.gov.gy', className: 'mining_cadastre', jurisdiction: 'GY', confidence: 80 },
      { publisher: 'Ministry of Natural Resources Guyana', url: 'https://nre.gov.gy', className: 'government_portal', jurisdiction: 'GY', confidence: 78 },
    ],
  },
  {
    country: 'Suriname', sources: 2, region: 'Americas', status: 'seeded',
    focus: 'Offshore oil (Block 58/52), gold, bauxite',
    readiness: 70,
    evidence: 'Staatsolie disclosures, Block 58 appraisal updates',
    why: 'Following Guyana playbook; FID windows trigger sovereign content + supply-chain demand.',
    sourceCitations: [
      { publisher: 'Staatsolie Suriname', url: 'https://www.staatsolie.com', className: 'corporate_disclosure', jurisdiction: 'SR', confidence: 80 },
    ],
  },
  // -------------------- EUROPE / EURASIA / ARCTIC --------------------
  {
    country: 'Norway', sources: 4, region: 'Europe', status: 'active',
    focus: 'Offshore oil, gas, deep-sea minerals, hydrogen',
    readiness: 88,
    evidence: 'NPD/Sodir factpages, deep-sea mining licensing roadmap',
    why: 'Mature transparency + new deep-sea minerals + CCS + hydrogen = strategic content backbone.',
    sourceCitations: [
      { publisher: 'Sodir / Norwegian Offshore Directorate', url: 'https://www.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO', confidence: 92 },
      { publisher: 'NPD FactPages (wells, fields, licences)', url: 'https://factpages.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO', confidence: 90 },
      { publisher: 'Norwegian Directorate of Mining', url: 'https://www.dirmin.no', className: 'mining_cadastre', jurisdiction: 'NO', confidence: 86 },
    ],
  },
  {
    country: 'United Kingdom', sources: 3, region: 'Europe', status: 'active',
    focus: 'North Sea oil/gas, lithium (Cornwall), CCS, REEs',
    readiness: 82,
    evidence: 'NSTA round notices, Cornish Lithium / Imerys disclosures',
    why: 'Critical Minerals Strategy + CCS clusters = repeating procurement & policy windows.',
    sourceCitations: [
      { publisher: 'NSTA (UK)', url: 'https://www.nstauthority.co.uk', className: 'petroleum_commission', jurisdiction: 'UK', confidence: 90 },
      { publisher: 'British Geological Survey', url: 'https://www.bgs.ac.uk', className: 'geological_survey', jurisdiction: 'UK', confidence: 90 },
      { publisher: 'LSE RNS', url: 'https://www.londonstockexchange.com/news?tab=news-explorer', className: 'exchange_filing', jurisdiction: 'UK', confidence: 95 },
    ],
  },
  {
    country: 'Greenland', sources: 3, region: 'Arctic', status: 'active',
    focus: 'REEs, copper, nickel, graphite, hydrogen',
    readiness: 74,
    evidence: 'MLSA license register, Tanbreez/Kvanefjeld context',
    why: 'New EU/US strategic supply deals + sovereign opening = early-mover REE/Cu plays.',
    sourceCitations: [
      { publisher: 'Greenland MLSA', url: 'https://www.govmin.gl', className: 'mining_cadastre', jurisdiction: 'GL', confidence: 84 },
      { publisher: 'GEUS (Geological Survey of Denmark and Greenland)', url: 'https://www.geus.dk', className: 'geological_survey', jurisdiction: 'DK-GL', confidence: 86 },
    ],
  },
  {
    country: 'Sweden', sources: 3, region: 'Europe', status: 'active',
    focus: 'Iron ore, REEs (Per Geijer), copper, vanadium',
    readiness: 80,
    evidence: 'SGU exploration permits, LKAB disclosures',
    why: 'EU Critical Raw Materials Act target jurisdiction; LKAB Per Geijer reframes supply.',
    sourceCitations: [
      { publisher: 'Bergsstaten (Mining Inspectorate)', url: 'https://www.sgu.se/en/mining-inspectorate', className: 'mining_cadastre', jurisdiction: 'SE', confidence: 88 },
      { publisher: 'SGU Geological Survey of Sweden', url: 'https://www.sgu.se/en/', className: 'geological_survey', jurisdiction: 'SE', confidence: 86 },
    ],
  },
  {
    country: 'Finland', sources: 3, region: 'Europe', status: 'active',
    focus: 'Battery metals (Ni, Co, Li), graphite, gold',
    readiness: 78,
    evidence: 'Tukes mining register, GTK datasets, Talvivaara/Terrafame context',
    why: 'EU battery cluster + open data make Finland a model permit-to-scan jurisdiction.',
    sourceCitations: [
      { publisher: 'Tukes Mining Register', url: 'https://tukes.fi/en/mining', className: 'mining_cadastre', jurisdiction: 'FI', confidence: 88 },
      { publisher: 'GTK (Geological Survey of Finland)', url: 'https://www.gtk.fi/en/', className: 'geological_survey', jurisdiction: 'FI', confidence: 86 },
    ],
  },
  {
    country: 'Portugal', sources: 2, region: 'Europe', status: 'seeded',
    focus: 'Lithium, copper-zinc (Iberian Pyrite Belt), REEs',
    readiness: 70,
    evidence: 'DGEG awards portal, Barroso lithium project context',
    why: 'EU lithium pivot + IPB poly-metallic make Portugal a focused critical-minerals lane.',
    sourceCitations: [
      { publisher: 'DGEG Portugal', url: 'https://www.dgeg.gov.pt', className: 'mining_cadastre', jurisdiction: 'PT', confidence: 80 },
    ],
  },
  {
    country: 'Spain', sources: 2, region: 'Europe', status: 'seeded',
    focus: 'Tungsten, REEs, copper, lithium',
    readiness: 66,
    evidence: 'IGME-CSIC datasets, regional cadastres',
    why: 'EU CRMA priorities + tungsten/REE renaissance = growing scout window.',
    sourceCitations: [
      { publisher: 'IGME (Geological Survey of Spain)', url: 'https://www.igme.es', className: 'geological_survey', jurisdiction: 'ES', confidence: 82 },
    ],
  },
  {
    country: 'Kazakhstan', sources: 3, region: 'Eurasia', status: 'active',
    focus: 'Uranium, copper, REEs, oil & gas',
    readiness: 76,
    evidence: 'Kazatomprom disclosures, Ministry of Industry & Construction portals',
    why: 'World #1 uranium producer + REE diversification make this a sovereign scouting must.',
    sourceCitations: [
      { publisher: 'Ministry of Industry & Construction Kazakhstan', url: 'https://www.gov.kz/memleket/entities/industry?lang=en', className: 'government_portal', jurisdiction: 'KZ', confidence: 80 },
      { publisher: 'Kazatomprom IR', url: 'https://www.kazatomprom.kz/en/page/investors', className: 'corporate_disclosure', jurisdiction: 'KZ', confidence: 88 },
    ],
  },
  {
    country: 'Ukraine', sources: 2, region: 'Europe', status: 'monitor',
    focus: 'Lithium, titanium, REEs, gas, recovery minerals',
    readiness: 60,
    evidence: 'State Service of Geology and Subsoil licensing, EU/US recovery deal context',
    why: 'Recovery & supply-deal pipelines create high-impact long-horizon plays.',
    sourceCitations: [
      { publisher: 'State Service of Geology and Subsoil of Ukraine', url: 'https://www.geo.gov.ua', className: 'mining_cadastre', jurisdiction: 'UA', confidence: 70 },
    ],
  },
  // -------------------- MIDDLE EAST --------------------
  {
    country: 'Saudi Arabia', sources: 4, region: 'Middle East', status: 'active',
    focus: 'Phosphates, copper, gold, REEs, niobium, hydrogen',
    readiness: 86,
    evidence: 'Ta\'adeen cadastre, Saudi Geological Survey datasets, Future Minerals Forum pipeline',
    why: 'Vision 2030 + $2.5T mineral hypothesis = sovereign-scale partner & advisory windows.',
    sourceCitations: [
      { publisher: "Ministry of Industry and Mineral Resources (MIM)", url: 'https://mim.gov.sa', className: 'government_portal', jurisdiction: 'SA', confidence: 88 },
      { publisher: 'Ta\'adeen mining licensing portal', url: 'https://taadeen.sa', className: 'mining_cadastre', jurisdiction: 'SA', confidence: 86 },
      { publisher: 'Saudi Geological Survey', url: 'https://www.sgs.org.sa', className: 'geological_survey', jurisdiction: 'SA', confidence: 86 },
      { publisher: "Ma'aden IR", url: 'https://www.maaden.com.sa/en/investors', className: 'corporate_disclosure', jurisdiction: 'SA', confidence: 90 },
    ],
  },
  {
    country: 'United Arab Emirates', sources: 3, region: 'Middle East', status: 'active',
    focus: 'Refining hub capital, REE separation, copper, hydrogen',
    readiness: 82,
    evidence: 'MOIAT industrial strategy, ADNOC critical mineral interest',
    why: 'Sovereign capital + refining ambition = ideal critical-minerals downstream financier.',
    sourceCitations: [
      { publisher: 'UAE MOIAT', url: 'https://www.moiat.gov.ae', className: 'government_portal', jurisdiction: 'AE', confidence: 84 },
      { publisher: 'ADNOC', url: 'https://www.adnoc.ae', className: 'corporate_disclosure', jurisdiction: 'AE', confidence: 86 },
      { publisher: 'Mubadala', url: 'https://www.mubadala.com', className: 'sovereign_wealth', jurisdiction: 'AE', confidence: 84 },
    ],
  },
  {
    country: 'Oman', sources: 2, region: 'Middle East', status: 'seeded',
    focus: 'Copper, chromite, hydrogen, gypsum',
    readiness: 70,
    evidence: 'Hydrom hydrogen tenders, Ministry of Energy & Minerals concession map',
    why: 'Hydrogen auctions + ophiolite copper-chromite revival.',
    sourceCitations: [
      { publisher: 'Hydrom Oman', url: 'https://hydrom.com', className: 'tender_portal', jurisdiction: 'OM', confidence: 84 },
      { publisher: 'Ministry of Energy and Minerals Oman', url: 'https://mem.gov.om', className: 'government_portal', jurisdiction: 'OM', confidence: 78 },
    ],
  },
  // -------------------- ASIA-PACIFIC --------------------
  {
    country: 'Australia', sources: 4, region: 'Oceania', status: 'active',
    focus: 'Bauxite, lithium, uranium, REEs, nickel, copper',
    readiness: 86,
    evidence: 'australia_bauxite_deposits.json + state cadastres',
    why: 'State cadastres plus ASX disclosures create unmatched source confidence.',
    sourceCitations: [
      { publisher: 'Geoscience Australia', url: 'https://www.ga.gov.au', className: 'geological_survey', jurisdiction: 'AU', confidence: 92 },
      { publisher: 'WA DMIRS Tengraph', url: 'https://www.dmirs.wa.gov.au', className: 'mining_cadastre', jurisdiction: 'AU-WA', confidence: 90 },
      { publisher: 'NT Department of Industry, Tourism and Trade', url: 'https://industry.nt.gov.au', className: 'mining_cadastre', jurisdiction: 'AU-NT', confidence: 86 },
      { publisher: 'ASX Announcements', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements.htm', className: 'exchange_filing', jurisdiction: 'AU', confidence: 95 },
    ],
  },
  {
    country: 'Indonesia', sources: 3, region: 'Asia-Pacific', status: 'active',
    focus: 'Nickel, cobalt, copper, gold, downstream HPAL',
    readiness: 80,
    evidence: 'Ministry of ESDM Mineral One Map, MIND ID disclosures',
    why: 'Downstreaming policy + HPAL FIDs = strategic supply-side scouting.',
    sourceCitations: [
      { publisher: 'Ministry of ESDM Indonesia', url: 'https://www.esdm.go.id', className: 'government_portal', jurisdiction: 'ID', confidence: 86 },
      { publisher: 'MIND ID Holding', url: 'https://www.mind.id', className: 'corporate_disclosure', jurisdiction: 'ID', confidence: 80 },
    ],
  },
  {
    country: 'India', sources: 3, region: 'Asia-Pacific', status: 'active',
    focus: 'Bauxite, titanium, gallium, REEs, lithium',
    readiness: 72,
    evidence: 'IBM auction notifications, KABIL critical minerals mandate',
    why: 'Critical-mineral auctions + KABIL/Coal India mandates = large procurement pipeline.',
    sourceCitations: [
      { publisher: 'Indian Bureau of Mines', url: 'https://ibm.gov.in', className: 'mining_cadastre', jurisdiction: 'IN', confidence: 84 },
      { publisher: 'Ministry of Mines', url: 'https://mines.gov.in', className: 'government_portal', jurisdiction: 'IN', confidence: 82 },
      { publisher: 'NSE Corporate Filings', url: 'https://www.nseindia.com/companies-listing/corporate-filings-announcements', className: 'exchange_filing', jurisdiction: 'IN', confidence: 90 },
    ],
  },
  {
    country: 'Pakistan', sources: 3, region: 'Asia-Pacific', status: 'active',
    focus: 'REEs, copper-gold (Reko Diq), critical minerals',
    readiness: 70,
    evidence: 'pakistan_ree_deposits.json + Pakistan REE scan package',
    why: 'Reko Diq + national mining vision attract sovereign capital and partners.',
    sourceCitations: [
      { publisher: 'Geological Survey of Pakistan', url: 'https://www.gsp.gov.pk', className: 'geological_survey', jurisdiction: 'PK', confidence: 80 },
      { publisher: 'Special Investment Facilitation Council', url: 'https://sifc.gov.pk', className: 'government_portal', jurisdiction: 'PK', confidence: 76 },
    ],
  },
  {
    country: 'Mongolia', sources: 3, region: 'Asia-Pacific', status: 'active',
    focus: 'Copper-gold (Oyu Tolgoi), uranium, coal, REEs',
    readiness: 76,
    evidence: 'MRPAM tenement registry, Erdenes Mongol disclosures',
    why: 'Massive porphyry pipeline + uranium revival = repeat strategic windows.',
    sourceCitations: [
      { publisher: 'Mineral Resources & Petroleum Authority of Mongolia', url: 'https://mrpam.gov.mn', className: 'mining_cadastre', jurisdiction: 'MN', confidence: 84 },
    ],
  },
  {
    country: 'Vietnam', sources: 2, region: 'Asia-Pacific', status: 'seeded',
    focus: 'REEs, tungsten, bauxite, titanium',
    readiness: 64,
    evidence: 'Ministry of Natural Resources & Environment data, Dong Pao REE context',
    why: 'Largest REE reserve outside China; opening to non-China processing partners.',
    sourceCitations: [
      { publisher: 'MONRE Vietnam', url: 'https://english.monre.gov.vn', className: 'government_portal', jurisdiction: 'VN', confidence: 76 },
    ],
  },
  {
    country: 'Philippines', sources: 2, region: 'Asia-Pacific', status: 'seeded',
    focus: 'Nickel, copper, gold, REEs',
    readiness: 64,
    evidence: 'MGB tenement portal, Mining Industry Coordinating Council updates',
    why: 'Open-pit lift-off + EV nickel demand = recurring approval windows.',
    sourceCitations: [
      { publisher: 'Mines and Geosciences Bureau (MGB)', url: 'https://mgb.gov.ph', className: 'mining_cadastre', jurisdiction: 'PH', confidence: 78 },
    ],
  },
  {
    country: 'Papua New Guinea', sources: 2, region: 'Oceania', status: 'monitor',
    focus: 'Copper, gold, nickel, LNG',
    readiness: 60,
    evidence: 'MRA tenement portal, Wafi-Golpu, Frieda River context',
    why: 'Sovereign equity stakes + recurring legal/permit shifts create partnerable windows.',
    sourceCitations: [
      { publisher: 'PNG Mineral Resources Authority', url: 'https://www.mra.gov.pg', className: 'mining_cadastre', jurisdiction: 'PG', confidence: 76 },
    ],
  },
]

// -----------------------------------------------------------------------------
// Permit AOIs - illustrative AOR scaffolds with research basis + citations
// -----------------------------------------------------------------------------

export type PermitAoi = {
  id: string
  country: string
  license: string
  holder: string
  commodity: string
  status: string
  score: number
  confidence: number
  aoiHint: string
  action: string
  selectionReason?: string
  researchBasis?: string[]
  commercialThesis?: string
  qualificationCriteria?: string[]
  clarification?: string
  /** New: every AOI now ships with verifiable sources. */
  sourceCitations?: SourceCitation[]
}

export const permitAois: PermitAoi[] = [
  {
    id: 'permit_ghana_nyinahin_bauxite',
    country: 'Ghana',
    license: 'Nyinahin bauxite belt intelligence AOI',
    holder: 'Sovereign / GIADEC-linked ecosystem',
    commodity: 'bauxite-secondary-minerals',
    status: 'active',
    score: 86,
    confidence: 72,
    aoiHint: 'Nyinahin bauxite belt',
    action: 'ASMI enrichment + Aurora scan',
    selectionReason: 'Chosen because Ghana bauxite licensing, cadastre, and sovereign industrial channels may expose acquirable or partnerable ground in a high-value bauxite corridor.',
    researchBasis: [
      'Mining cadastre / mineral-rights source class identified for Ghana',
      'Sovereign bauxite industrial channels can indicate license changes, partner mandates, or infrastructure-linked opportunities',
      'Candidate remains unverified until official tenure geometry, holder, date, and status are extracted',
    ],
    commercialThesis: 'If tenure is open, partnerable, distressed, or adjacent to industrial bauxite demand, it may support acquisition, JV packaging, ASMI co-product diligence, and resale-oriented intelligence.',
    qualificationCriteria: ['Open, pending, relinquished, distressed, or partnerable tenure', 'Clear acquisition/JV path', 'Potential for 10x-100x resale or flip economics', 'Official coordinates or credible AOI boundaries'],
    clarification: 'Do not treat this as Aurora-derived. It is a permit/tenure research candidate until official boundaries, holder, and commercial availability are verified.',
    sourceCitations: [
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH', confidence: 90, note: 'Use cadastre search to extract tenement geometry, holder, and status.' },
      { publisher: 'GIADEC', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH', confidence: 86, note: 'GIADEC publications and partner notices around integrated bauxite-aluminium development.' },
      { publisher: 'EITI Ghana', url: 'https://eiti.org/countries/ghana', className: 'multilateral', jurisdiction: 'GH', confidence: 84 },
    ],
  },
  {
    id: 'permit_ghana_voltaian_petroleum',
    country: 'Ghana',
    license: 'Voltaian onshore petroleum screening AOI',
    holder: 'Sovereign petroleum licensing ecosystem',
    commodity: 'hydrocarbons',
    status: 'open',
    score: 78,
    confidence: 68,
    aoiHint: 'Ghana Voltaian Basin onshore petroleum fairway',
    action: 'Petroleum basin screening',
    selectionReason: 'Open acreage, block licensing, farm-in, or data-room activity in the Voltaian Basin could create a scan-and-package opportunity.',
    researchBasis: [
      'Petroleum commission / open acreage source class identified for Ghana',
      'Basin-scale AOI is a placeholder until official block maps, notices, or data-room material are extracted',
      'Commercial trigger would be an open block, farm-in process, licensing round, distressed operator, or sovereign tender',
    ],
    commercialThesis: 'A verified open or partnerable block can be screened, summarized, and sold as a targeted petroleum intelligence package before expensive technical commitments.',
    qualificationCriteria: ['Open acreage, licensing round, farm-in, or tender notice', 'Block geometry or official map extract', 'Acquire/partner/develop/resell path', 'Time-sensitive decision window'],
    clarification: 'Not selected because Aurora scanned it. Stay as tenure/open-acreage research until official block status and source dates are confirmed.',
    sourceCitations: [
      { publisher: 'Ghana Petroleum Commission', url: 'https://www.petrocom.gov.gh', className: 'petroleum_commission', jurisdiction: 'GH', confidence: 90 },
      { publisher: 'Ministry of Energy Ghana', url: 'https://energymin.gov.gh', className: 'government_portal', jurisdiction: 'GH', confidence: 80 },
    ],
  },
  {
    id: 'permit_namibia_hydrogen_fairway',
    country: 'Namibia',
    license: 'Namibia hydrogen and helium fairway watch AOI',
    holder: 'Multiple emerging entrants',
    commodity: 'hydrogen-helium',
    status: 'pending',
    score: 72,
    confidence: 60,
    aoiHint: 'Namibia hydrogen and helium exploration fairway',
    action: 'Hydrogen/helium fairway review',
    selectionReason: 'Namibia permit changes, entrant activity, and open acreage signals may create early acquisition or JV opportunities.',
    researchBasis: [
      'Mining cadastre source class identified for Namibia',
      'Fairway remains a watch AOI until specific permits, blocks, applicants, or relinquishments are extracted',
      'Commercial trigger would be an open, pending, relinquished, or partnerable hydrogen/helium/mineral position',
    ],
    commercialThesis: 'Early frontier tenure can be valuable if it is cheap to secure, technically differentiable, and can be packaged for strategic buyers or operators.',
    qualificationCriteria: ['Specific license, block, concession, or applicant identified', 'Open, pending, relinquished, distressed, or farm-in status', 'Differentiated technical story', 'Visible buyer/operator/investor universe'],
    clarification: 'Treat this as tenure intelligence first. Extract official permit polygons and commercial availability before any client-grade scan report.',
    sourceCitations: [
      { publisher: 'Namibia Ministry of Mines & Energy', url: 'https://www.mme.gov.na', className: 'mining_cadastre', jurisdiction: 'NA', confidence: 86 },
      { publisher: 'Namibia Green Hydrogen Programme', url: 'https://gh2namibia.com', className: 'government_portal', jurisdiction: 'NA', confidence: 78 },
    ],
  },
  {
    id: 'permit_dr_congo_copper_cobalt',
    country: 'DRC',
    license: 'Lualaba/Haut-Katanga Cu-Co concession churn watch',
    holder: 'Multiple state and private holders',
    commodity: 'copper-cobalt',
    status: 'monitor',
    score: 84,
    confidence: 70,
    aoiHint: 'Copperbelt extension – Lualaba & Haut-Katanga',
    action: 'Concession reallocation + JV partner screen',
    selectionReason: 'CAMI cadastre churn, sovereign royalty review, and cobalt buffer-stock policy create recurring distressed/partnerable windows.',
    researchBasis: [
      'CAMI cadastre review identifies expiring/relinquished tenements',
      'Sovereign Cobalt Buffer Stock + Entreprise Générale du Cobalt actions can reset commercial balance',
      'EITI publishes contracts/payments useful for partner mapping',
    ],
    commercialThesis: 'Acquire reallocation rights early; package distressed concessions for non-Chinese strategics priced out elsewhere.',
    qualificationCriteria: ['Tenement officially extracted from CAMI', 'Holder traceable to ultimate beneficial owner', 'Sanctions screen clean', 'Commercial path: JV, royalty, off-take, or full acquisition'],
    sourceCitations: [
      { publisher: 'CAMI Cadastre Minier DRC', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD', confidence: 88 },
      { publisher: 'EITI DRC contracts', url: 'https://eiti.org/countries/democratic-republic-congo', className: 'multilateral', jurisdiction: 'CD', confidence: 84 },
      { publisher: 'OFAC SDN', url: 'https://sanctionssearch.ofac.treas.gov', className: 'sanction_list', jurisdiction: 'US', confidence: 92 },
    ],
  },
  {
    id: 'permit_argentina_lithium_triangle',
    country: 'Argentina',
    license: 'Salta-Catamarca-Jujuy lithium permit window',
    holder: 'Multiple junior + major operators',
    commodity: 'lithium-brines',
    status: 'open',
    score: 82,
    confidence: 74,
    aoiHint: 'Lithium Triangle salars',
    action: 'RIGI-incentivised packaging for strategic offtakers',
    selectionReason: 'RIGI incentive + provincial cadastre transparency create a compounding entry window for brine concessions.',
    researchBasis: [
      'Provincial cadastres expose application status and geometry',
      'SEGEMAR datasets allow third-party verification',
      'Public juniors disclose option, JV, and capex commitments via SEDAR/ASX',
    ],
    commercialThesis: 'Move fast on adjacency to producing salars; use ASMI co-products (Mg, K) for underwriting upside.',
    qualificationCriteria: ['Concession status confirmed via provincial cadastre', 'Brine chemistry data accessible', 'Offtake/strategic interest visible', 'RIGI eligibility plausible'],
    sourceCitations: [
      { publisher: 'SEGEMAR', url: 'https://www.segemar.gov.ar', className: 'geological_survey', jurisdiction: 'AR', confidence: 86 },
      { publisher: 'Catamarca Mining Authority', url: 'https://mineria.catamarca.gob.ar', className: 'mining_cadastre', jurisdiction: 'AR-K', confidence: 82 },
      { publisher: 'Salta Mining Secretariat', url: 'https://mineria.salta.gob.ar', className: 'mining_cadastre', jurisdiction: 'AR-A', confidence: 82 },
    ],
  },
  {
    id: 'permit_saudi_arabia_critical_belt',
    country: 'Saudi Arabia',
    license: 'Arabian Shield critical-minerals exploration belt',
    holder: 'Open exploration license holders',
    commodity: 'copper-gold-REE',
    status: 'open',
    score: 80,
    confidence: 72,
    aoiHint: 'Arabian Shield – Khnaiguiyah / Wadi Bidah corridor',
    action: 'Exploration license bid + Future Minerals Forum partnership packaging',
    selectionReason: 'Vision 2030 mineral hypothesis + Ta\'adeen licensing reform + Future Minerals Forum capital create a sovereign-scale entry window.',
    researchBasis: [
      'Ta\'adeen licensing portal exposes open exploration blocks',
      'Saudi Geological Survey publishes belt-scale data',
      'Ma\'aden + sovereign capital pipeline visible through MIM and PIF disclosures',
    ],
    commercialThesis: 'Package belt-scale exploration positions for sovereign-aligned strategics with downstream UAE refining route.',
    qualificationCriteria: ['Open exploration block confirmed via Ta\'adeen', 'Geoscience data accessible', 'Sovereign or partner capital visible', 'Downstream offtake or refining route plausible'],
    sourceCitations: [
      { publisher: 'Ta\'adeen mining licensing portal', url: 'https://taadeen.sa', className: 'mining_cadastre', jurisdiction: 'SA', confidence: 86 },
      { publisher: 'Saudi Geological Survey', url: 'https://www.sgs.org.sa', className: 'geological_survey', jurisdiction: 'SA', confidence: 86 },
      { publisher: "Ma'aden IR", url: 'https://www.maaden.com.sa/en/investors', className: 'corporate_disclosure', jurisdiction: 'SA', confidence: 90 },
    ],
  },
  {
    id: 'permit_greenland_ree_open_round',
    country: 'Greenland',
    license: 'South Greenland REE-Cu mineral exploration window',
    holder: 'Active applicants under MLSA',
    commodity: 'REE-copper',
    status: 'pending',
    score: 76,
    confidence: 66,
    aoiHint: 'South Greenland alkaline province + Disko-Nuussuaq nickel-copper-PGE',
    action: 'EU/US strategic-supply packaging',
    selectionReason: 'EU CRMA + US strategic-supply MoUs + sovereign opening = early-mover REE/Cu plays.',
    researchBasis: [
      'MLSA license register exposes applications, grants and refusals',
      'GEUS publishes high-quality belt and basin data',
      'Public juniors disclose under TSX/ASX',
    ],
    commercialThesis: 'Lock differentiated belt position; package directly into EU CRMA strategic project pipeline.',
    qualificationCriteria: ['Application/grant verified via MLSA', 'GEUS background data accessible', 'EU/US strategic alignment plausible', 'Local-stakeholder licence to operate documented'],
    sourceCitations: [
      { publisher: 'Greenland MLSA', url: 'https://www.govmin.gl', className: 'mining_cadastre', jurisdiction: 'GL', confidence: 84 },
      { publisher: 'GEUS', url: 'https://www.geus.dk', className: 'geological_survey', jurisdiction: 'DK-GL', confidence: 86 },
    ],
  },
]

// -----------------------------------------------------------------------------
// Scan queue + reports - now hyperlinked
// -----------------------------------------------------------------------------

export const scanQueueItems = [
  { aoi: 'Nyinahin bauxite belt', queue: 'aurora_scan', status: 'ready for handoff', report: 'not started' },
  { aoi: 'Voltaian Basin onshore', queue: 'aurora_scan', status: 'ready for handoff', report: 'not started' },
  { aoi: 'Namibia H2/He fairway', queue: 'aurora_scan', status: 'ready for handoff', report: 'not started' },
  { aoi: 'DRC Lualaba Cu-Co churn', queue: 'aurora_scan', status: 'awaiting cadastre extract', report: 'not started' },
  { aoi: 'Argentina Salta-Catamarca brines', queue: 'aurora_scan', status: 'awaiting RIGI confirmation', report: 'not started' },
  { aoi: 'Arabian Shield critical belt', queue: 'aurora_scan', status: 'awaiting Ta\'adeen extract', report: 'not started' },
  { aoi: 'South Greenland REE-Cu window', queue: 'aurora_scan', status: 'awaiting MLSA confirmation', report: 'not started' },
]

export const reportsReady = [
  { title: 'Ghana bauxite hidden mineral permit dossier', type: 'mini dossier', status: 'template ready' },
  { title: 'Voltaian petroleum block screening note', type: 'technical summary', status: 'template ready' },
  { title: 'DRC cobalt concession reallocation watch', type: 'distressed-asset note', status: 'draft' },
  { title: 'Lithium Triangle RIGI packaging brief', type: 'investor brief', status: 'draft' },
  { title: 'Arabian Shield Cu-Au-REE belt thesis', type: 'sovereign brief', status: 'draft' },
]

// -----------------------------------------------------------------------------
// Live opportunities - all source-cited, globally diverse, urgency-tagged
// -----------------------------------------------------------------------------

export const opportunities: Opportunity[] = [
  {
    company: 'Frontier Uranium Corp',
    country: 'Canada',
    commodity: 'Uranium',
    signal: 'Private placement closed for district-scale Athabasca targeting',
    category: 'Funding',
    source: 'Exchange filing',
    score: 88,
    urgency: 'Critical',
    auroraFit: 'High - rapid target-screening and hidden structure package',
    action: 'Generate uranium dossier and founder outreach',
    triggerTag: 'Funding-event',
    horizon: '0-30d',
    sources: [
      { publisher: 'SEDAR+ (CSA)', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA', confidence: 95, note: 'Search issuer profile for the exact news release & financing terms.' },
      { publisher: 'TSX Venture Disclosures', url: 'https://money.tmx.com/en/quote', className: 'exchange_filing', jurisdiction: 'CA', confidence: 92 },
    ],
  },
  {
    company: 'Ghana Minerals Commission',
    country: 'Ghana',
    commodity: 'Bauxite / critical minerals',
    signal: 'Industrial minerals beneficiation policy window',
    category: 'Government Initiative',
    source: 'Sovereign monitor',
    score: 84,
    urgency: 'Critical',
    auroraFit: 'High - sovereign ASMI report plus bauxite co-product scan',
    action: 'Route through ASMI enrichment before sovereign brief',
    triggerTag: 'Sovereign-policy',
    horizon: '30-90d',
    sources: [
      { publisher: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre', jurisdiction: 'GH', confidence: 90 },
      { publisher: 'GIADEC', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH', confidence: 86 },
    ],
  },
  {
    company: 'Helios Helium Ltd',
    country: 'Tanzania',
    commodity: 'Helium',
    signal: 'New license application and seismic tender language',
    category: 'Exploration',
    source: 'Government portal',
    score: 76,
    urgency: 'High',
    auroraFit: 'Medium - basin screening and prospect ranking',
    action: 'Prepare helium prompt run and service map',
    triggerTag: 'Permit-application',
    horizon: '30-90d',
    sources: [
      { publisher: 'Tanzania Mining Commission', url: 'https://www.tumemadini.go.tz', className: 'mining_cadastre', jurisdiction: 'TZ', confidence: 84 },
    ],
  },
  {
    company: 'Copper Ridge Exploration',
    country: 'Zambia',
    commodity: 'Copper',
    signal: 'Seeking JV partner for underexplored permit package',
    category: 'JV/Farm-In',
    source: 'Deal room',
    score: 72,
    urgency: 'High',
    auroraFit: 'High - copper porphyry and structural corridor scan',
    action: 'Create farm-in mini dossier',
    triggerTag: 'JV-mandate',
    horizon: '30-90d',
    sources: [
      { publisher: 'Zambia Mining Cadastre', url: 'https://portals.flexicadastre.com/zambia/', className: 'mining_cadastre', jurisdiction: 'ZM', confidence: 86 },
    ],
  },
  {
    company: 'Atlantic Energy Authority',
    country: 'Senegal',
    commodity: 'Offshore hydrocarbons',
    signal: 'Licensing round preparation and data-room refresh',
    category: 'Licensing',
    source: 'Petroleum commission',
    score: 68,
    urgency: 'High',
    auroraFit: 'Medium - offshore basin intelligence and block ranking',
    action: 'Track round launch and build sovereign note',
    triggerTag: 'Licensing-round',
    horizon: '90-180d',
    sources: [
      { publisher: 'Senegal MEPM', url: 'https://www.energie.gouv.sn', className: 'petroleum_commission', jurisdiction: 'SN', confidence: 88 },
      { publisher: 'PETROSEN Holding', url: 'https://www.petrosenholding.sn', className: 'corporate_disclosure', jurisdiction: 'SN', confidence: 80 },
    ],
  },
  {
    company: 'LKAB',
    country: 'Sweden',
    commodity: 'REE / Iron ore',
    signal: 'Per Geijer REE-iron deposit progressing toward EU CRMA strategic project status',
    category: 'Strategic Project',
    source: 'Corporate disclosure',
    score: 86,
    urgency: 'Critical',
    auroraFit: 'High - downstream + Iberian/UAE refining linkage',
    action: 'Prepare EU CRMA partnership packaging',
    triggerTag: 'Policy-window',
    horizon: '30-90d',
    sources: [
      { publisher: 'LKAB Press Releases', url: 'https://lkab.com/en/press/', className: 'corporate_disclosure', jurisdiction: 'SE', confidence: 90 },
      { publisher: 'EU Critical Raw Materials Act portal', url: 'https://single-market-economy.ec.europa.eu/sectors/raw-materials/areas-specific-interest/critical-raw-materials_en', className: 'government_portal', jurisdiction: 'EU', confidence: 92 },
    ],
  },
  {
    company: 'KoBold Metals (private)',
    country: 'Zambia',
    commodity: 'Copper',
    signal: 'Mingomba project moving from discovery into development financing window',
    category: 'Financing / Development',
    source: 'Press release + multilateral',
    score: 82,
    urgency: 'High',
    auroraFit: 'High - structural targeting + sovereign packaging',
    action: 'Engage sovereign + IFC route; map feeder JVs',
    triggerTag: 'AI-discovery',
    horizon: '30-90d',
    sources: [
      { publisher: 'KoBold Metals press', url: 'https://www.koboldmetals.com', className: 'press_release', confidence: 78 },
      { publisher: 'IFC Disclosure Portal', url: 'https://disclosures.ifc.org', className: 'multilateral', confidence: 86 },
    ],
  },
  {
    company: 'Indonesia ESDM',
    country: 'Indonesia',
    commodity: 'Nickel',
    signal: 'New downstreaming rules tighten Class 1 nickel offtake routes',
    category: 'Policy / Sovereign',
    source: 'Government portal',
    score: 84,
    urgency: 'Critical',
    auroraFit: 'High - HPAL fit + alternate-supply scouting',
    action: 'Brief Korean/Japanese/EU offtakers on alternative supply geometries',
    triggerTag: 'Policy-shock',
    horizon: '0-30d',
    sources: [
      { publisher: 'Ministry of ESDM Indonesia', url: 'https://www.esdm.go.id', className: 'government_portal', jurisdiction: 'ID', confidence: 86 },
    ],
  },
  {
    company: 'CAMI / DRC Ministry of Mines',
    country: 'DRC',
    commodity: 'Cobalt / Copper',
    signal: 'Concession reallocation review + Cobalt Buffer Stock activity',
    category: 'Distressed / Sovereign',
    source: 'Mining cadastre',
    score: 80,
    urgency: 'High',
    auroraFit: 'High - acquisition of reallocated tenements',
    action: 'Pre-position bidders before reallocation announcements',
    triggerTag: 'Distressed-tenure',
    horizon: '30-90d',
    sources: [
      { publisher: 'DRC CAMI Cadastre', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD', confidence: 88 },
      { publisher: 'EITI DRC', url: 'https://eiti.org/countries/democratic-republic-congo', className: 'multilateral', jurisdiction: 'CD', confidence: 84 },
    ],
  },
  {
    company: 'Saudi Future Minerals Forum / Ma\'aden',
    country: 'Saudi Arabia',
    commodity: 'Critical minerals platform',
    signal: 'Annual Future Minerals Forum signals new exploration tranches and PIF-aligned partnerships',
    category: 'Sovereign Capital',
    source: 'Government portal',
    score: 86,
    urgency: 'High',
    auroraFit: 'High - belt-scale exploration packaging',
    action: 'Compile FMF outreach with belt-position thesis',
    triggerTag: 'Sovereign-capital',
    horizon: '30-90d',
    sources: [
      { publisher: 'Future Minerals Forum', url: 'https://www.futuremineralsforum.com', className: 'government_portal', jurisdiction: 'SA', confidence: 84 },
      { publisher: "Ma'aden IR", url: 'https://www.maaden.com.sa/en/investors', className: 'corporate_disclosure', jurisdiction: 'SA', confidence: 90 },
    ],
  },
  {
    company: 'Norwegian Offshore Directorate',
    country: 'Norway',
    commodity: 'Deep-sea minerals',
    signal: 'Deep-sea mineral licensing roadmap and acreage opening (Mid-Atlantic Ridge / Mohns)',
    category: 'New Frontier',
    source: 'Petroleum commission',
    score: 78,
    urgency: 'High',
    auroraFit: 'Medium - frontier geological intelligence + ESG framing',
    action: 'Position dual narrative: technical readiness + ESG alignment',
    triggerTag: 'Frontier-opening',
    horizon: '90-180d',
    sources: [
      { publisher: 'Sodir / Norwegian Offshore Directorate', url: 'https://www.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO', confidence: 90 },
    ],
  },
  {
    company: 'Indian Bureau of Mines',
    country: 'India',
    commodity: 'Critical minerals (Li, REE, Co)',
    signal: 'New rounds of critical-mineral block auctions and KABIL acquisition mandate',
    category: 'Auction',
    source: 'Government portal',
    score: 80,
    urgency: 'High',
    auroraFit: 'High - bid-package geological diligence',
    action: 'Build bidder dossiers + sovereign-investor matchmaking',
    triggerTag: 'Auction-window',
    horizon: '30-90d',
    sources: [
      { publisher: 'Indian Bureau of Mines', url: 'https://ibm.gov.in', className: 'mining_cadastre', jurisdiction: 'IN', confidence: 84 },
      { publisher: 'Ministry of Mines (India) – Auctions', url: 'https://mines.gov.in', className: 'government_portal', jurisdiction: 'IN', confidence: 82 },
    ],
  },
  {
    company: 'Petrobras',
    country: 'Brazil',
    commodity: 'Equatorial-margin oil',
    signal: 'Continued ANP permanent-offer cycles around equatorial margin and pre-salt extensions',
    category: 'Licensing',
    source: 'Petroleum commission',
    score: 76,
    urgency: 'High',
    auroraFit: 'Medium - basin intelligence + offset operator scouting',
    action: 'Track block awards; map offset operator pipeline',
    triggerTag: 'Licensing-round',
    horizon: '90-180d',
    sources: [
      { publisher: 'ANP Brazil', url: 'https://www.gov.br/anp/pt-br', className: 'petroleum_commission', jurisdiction: 'BR', confidence: 90 },
      { publisher: 'Petrobras IR', url: 'https://www.investidorpetrobras.com.br', className: 'corporate_disclosure', jurisdiction: 'BR', confidence: 90 },
    ],
  },
  {
    company: 'Cornish Lithium / Imerys British Lithium',
    country: 'United Kingdom',
    commodity: 'Lithium',
    signal: 'UK Critical Minerals Strategy refresh + DOE / EU strategic project alignment',
    category: 'Strategic Project',
    source: 'Government portal',
    score: 74,
    urgency: 'High',
    auroraFit: 'Medium - downstream conversion + capital matchmaking',
    action: 'Map UK + EU + US public capital alignment paths',
    triggerTag: 'Policy-window',
    horizon: '90-180d',
    sources: [
      { publisher: 'UK Critical Minerals Intelligence Centre', url: 'https://www.ukcmic.org', className: 'government_portal', jurisdiction: 'UK', confidence: 86 },
      { publisher: 'BGS', url: 'https://www.bgs.ac.uk', className: 'geological_survey', jurisdiction: 'UK', confidence: 90 },
    ],
  },
  {
    company: 'Greenland MLSA',
    country: 'Greenland',
    commodity: 'REE / Cu / Ni',
    signal: 'Active license rounds aligned with US/EU strategic supply MoUs',
    category: 'Licensing',
    source: 'Mining cadastre',
    score: 78,
    urgency: 'High',
    auroraFit: 'High - early-mover frontier packaging',
    action: 'Pair belt thesis with EU CRMA strategic project filing',
    triggerTag: 'Frontier-opening',
    horizon: '30-90d',
    sources: [
      { publisher: 'Greenland MLSA', url: 'https://www.govmin.gl', className: 'mining_cadastre', jurisdiction: 'GL', confidence: 84 },
    ],
  },
  {
    company: 'Mongolia MRPAM',
    country: 'Mongolia',
    commodity: 'Copper / Uranium',
    signal: 'Tenement reallocations + uranium concession revival',
    category: 'Licensing / Sovereign',
    source: 'Mining cadastre',
    score: 72,
    urgency: 'High',
    auroraFit: 'Medium - porphyry + uranium packaging',
    action: 'Pre-brief sovereign-aligned strategics on belt windows',
    triggerTag: 'Licensing-window',
    horizon: '90-180d',
    sources: [
      { publisher: 'MRPAM Mongolia', url: 'https://mrpam.gov.mn', className: 'mining_cadastre', jurisdiction: 'MN', confidence: 84 },
    ],
  },
]

// -----------------------------------------------------------------------------
// Disruptive opportunity engine - high-asymmetry shocks worth scouting
// -----------------------------------------------------------------------------

export type DisruptiveSignal = {
  theme: string
  category:
    | 'M&A'
    | 'Distressed'
    | 'IPO/Spin-off'
    | 'Policy shock'
    | 'Sanction'
    | 'Resource nationalism'
    | 'Tech displacement'
    | 'Sovereign capital'
    | 'Frontier opening'
  trigger: string
  asymmetryScore: number
  whyItMatters: string
  sources: SourceCitation[]
}

export const disruptiveSignals: DisruptiveSignal[] = [
  {
    theme: 'Indonesia nickel downstreaming reset',
    category: 'Policy shock',
    trigger: 'Class 1 nickel export reclassification + HPAL ESG scrutiny',
    asymmetryScore: 88,
    whyItMatters: 'Forces Korean/Japanese/EU offtakers to seek non-Indonesian Class 1 supply; opens window for Australia, PNG, New Caledonia, Tanzania, Brazil.',
    sources: [
      { publisher: 'Ministry of ESDM Indonesia', url: 'https://www.esdm.go.id', className: 'government_portal', jurisdiction: 'ID', confidence: 86 },
      { publisher: 'S&P Global Commodity Insights – Nickel', url: 'https://www.spglobal.com/commodityinsights/en/market-insights/topics/nickel', className: 'rss_news', confidence: 64 },
    ],
  },
  {
    theme: 'EU Critical Raw Materials Act strategic project pipeline',
    category: 'Policy shock',
    trigger: 'Annual strategic-project lists prioritise REE/Li/Cu/Ni/Co/PGM',
    asymmetryScore: 84,
    whyItMatters: 'Selected projects gain accelerated permitting + state-aid eligibility; pre-positioning belt theses unlocks sovereign capital.',
    sources: [
      { publisher: 'EU CRMA Portal', url: 'https://single-market-economy.ec.europa.eu/sectors/raw-materials/areas-specific-interest/critical-raw-materials_en', className: 'government_portal', jurisdiction: 'EU', confidence: 92 },
    ],
  },
  {
    theme: 'US Defense Production Act + DOE LPO critical-mineral lending',
    category: 'Sovereign capital',
    trigger: 'DPA Title III grants + DOE Loan Programs Office portfolio expansion',
    asymmetryScore: 86,
    whyItMatters: 'Concessional capital can re-rate uneconomic projects; Aurora can shorten the diligence cycle for awardees.',
    sources: [
      { publisher: 'DOE Loan Programs Office', url: 'https://www.energy.gov/lpo/loan-programs-office', className: 'government_portal', jurisdiction: 'US', confidence: 88 },
      { publisher: 'US DOD Industrial Base Policy', url: 'https://www.businessdefense.gov', className: 'government_portal', jurisdiction: 'US', confidence: 84 },
    ],
  },
  {
    theme: 'DRC cobalt buffer stock + concession reshuffle',
    category: 'Resource nationalism',
    trigger: 'Sovereign Cobalt Buffer Stock + Entreprise Générale du Cobalt mandates',
    asymmetryScore: 82,
    whyItMatters: 'Reshapes ASM cobalt routes; opens reallocated tenements to non-Chinese strategics.',
    sources: [
      { publisher: 'EITI DRC', url: 'https://eiti.org/countries/democratic-republic-congo', className: 'multilateral', jurisdiction: 'CD', confidence: 84 },
      { publisher: 'CAMI DRC', url: 'https://www.cami.cd', className: 'mining_cadastre', jurisdiction: 'CD', confidence: 88 },
    ],
  },
  {
    theme: 'Saudi Vision 2030 mineral platform',
    category: 'Sovereign capital',
    trigger: 'Future Minerals Forum + PIF-aligned investments + Manara Minerals deals',
    asymmetryScore: 86,
    whyItMatters: 'Deep, patient capital chasing global asset positions creates a lateral acquirer for everything from Africa to LatAm.',
    sources: [
      { publisher: 'Future Minerals Forum', url: 'https://www.futuremineralsforum.com', className: 'government_portal', jurisdiction: 'SA', confidence: 84 },
      { publisher: "Ma'aden IR", url: 'https://www.maaden.com.sa/en/investors', className: 'corporate_disclosure', jurisdiction: 'SA', confidence: 90 },
    ],
  },
  {
    theme: 'Mexico lithium nationalisation aftermath',
    category: 'Resource nationalism',
    trigger: 'LitioMx / sovereign-only lithium framework reshapes investor landscape',
    asymmetryScore: 70,
    whyItMatters: 'Forces partner-of-state model for lithium; potential overflow demand routes to Chile / Argentina.',
    sources: [
      { publisher: 'Secretaría de Economía Mexico - Mining', url: 'https://www.gob.mx/se/acciones-y-programas/mineria', className: 'government_portal', jurisdiction: 'MX', confidence: 80 },
    ],
  },
  {
    theme: 'AI-discovery majors (KoBold-style) reshape exploration competition',
    category: 'Tech displacement',
    trigger: 'AI-discovery firms attracting Tier-1 capital + sovereign LP backing',
    asymmetryScore: 78,
    whyItMatters: 'Aurora-style intelligence can either compete head-on or supply downstream packaging once discoveries land.',
    sources: [
      { publisher: 'KoBold Metals', url: 'https://www.koboldmetals.com', className: 'press_release', confidence: 78 },
    ],
  },
  {
    theme: 'Russia-related sanction expansion across metals',
    category: 'Sanction',
    trigger: 'OFAC / OFSI / EU expansions across Cu, Ni, Al, gold logistics',
    asymmetryScore: 76,
    whyItMatters: 'Forces re-routing of refined-metal flows; opens Africa/Latin America offtake premium windows.',
    sources: [
      { publisher: 'OFAC SDN', url: 'https://sanctionssearch.ofac.treas.gov', className: 'sanction_list', jurisdiction: 'US', confidence: 92 },
      { publisher: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu', className: 'sanction_list', jurisdiction: 'EU', confidence: 90 },
    ],
  },
  {
    theme: 'Junior-explorer distress cycle',
    category: 'Distressed',
    trigger: 'Sustained equity drought driving sub-$10m juniors into NCIBs, NOIs, asset sales',
    asymmetryScore: 80,
    whyItMatters: 'Aurora can pre-screen and package distressed permit portfolios for re-vehicling.',
    sources: [
      { publisher: 'Insolvency Insider Canada', url: 'https://insolvencyinsider.ca', className: 'court_filing', jurisdiction: 'CA', confidence: 78 },
      { publisher: 'SEDAR+', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA', confidence: 95 },
    ],
  },
  {
    theme: 'Deep-sea minerals frontier opening',
    category: 'Frontier opening',
    trigger: 'Norway licensing roadmap + ISA negotiations + sponsoring-state activity',
    asymmetryScore: 74,
    whyItMatters: 'Sets precedent for governance + creates licensable acreage outside terrestrial cadastre constraints.',
    sources: [
      { publisher: 'Sodir / Norwegian Offshore Directorate', url: 'https://www.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO', confidence: 90 },
      { publisher: 'International Seabed Authority', url: 'https://www.isa.org.jm', className: 'multilateral', confidence: 84 },
    ],
  },
]

// -----------------------------------------------------------------------------
// Adaptive triggers - rules the radar self-rebalances against
// -----------------------------------------------------------------------------

export type AdaptiveTrigger = {
  name: string
  condition: string
  reweights: string
  sources: SourceCitation[]
}

export const adaptiveTriggers: AdaptiveTrigger[] = [
  {
    name: 'Battery chemistry shift (LFP ↔ NMC ↔ Na-ion)',
    condition: 'OEM/cell-maker disclosures change cathode mix forecasts',
    reweights: 'Up-weights Li-iron-phosphate (LFP) supply chains, Mn-rich nickel oxides, sodium feedstocks; down-weights Co-heavy chemistries.',
    sources: [
      { publisher: 'BloombergNEF Lithium-Ion Battery Price Survey', url: 'https://about.bnef.com', className: 'industry_database', confidence: 78 },
      { publisher: 'IEA Critical Minerals Outlook', url: 'https://www.iea.org/topics/critical-minerals', className: 'multilateral', confidence: 86 },
    ],
  },
  {
    name: 'Sanctions delta',
    condition: 'New OFAC/OFSI/EU listings touch metal producers, refiners, traders, or beneficial owners',
    reweights: 'Re-scores affected counterparties to zero; promotes alt-supply jurisdictions one tier.',
    sources: [
      { publisher: 'OFAC Recent Actions', url: 'https://ofac.treasury.gov/recent-actions', className: 'sanction_list', jurisdiction: 'US', confidence: 92 },
      { publisher: 'UK Sanctions List', url: 'https://www.gov.uk/government/publications/the-uk-sanctions-list', className: 'sanction_list', jurisdiction: 'UK', confidence: 92 },
    ],
  },
  {
    name: 'Sovereign capital rotation',
    condition: 'Sovereign wealth fund (PIF, ADIA, Mubadala, Temasek, GIC) discloses critical-mineral allocation',
    reweights: 'Promotes assets where stated mandate matches commodity + jurisdiction; surfaces matchmaking opportunities.',
    sources: [
      { publisher: 'Public Investment Fund (PIF)', url: 'https://www.pif.gov.sa', className: 'sovereign_wealth', jurisdiction: 'SA', confidence: 84 },
      { publisher: 'Mubadala', url: 'https://www.mubadala.com', className: 'sovereign_wealth', jurisdiction: 'AE', confidence: 84 },
      { publisher: 'Temasek', url: 'https://www.temasek.com.sg', className: 'sovereign_wealth', jurisdiction: 'SG', confidence: 84 },
    ],
  },
  {
    name: 'Drilling cycle inflection',
    condition: 'Baker Hughes rig count + sovereign rig adds shift by ≥10% region-on-region',
    reweights: 'Promotes service/intelligence opportunities, especially in basins with concurrent licensing rounds.',
    sources: [
      { publisher: 'Baker Hughes Rig Count', url: 'https://rigcount.bakerhughes.com', className: 'industry_database', confidence: 86 },
    ],
  },
  {
    name: 'Permit/auction calendar surge',
    condition: '≥2 cadastre or licensing rounds open in a single quarter for the same commodity',
    reweights: 'Surfaces cross-border arbitrage; flags as a sovereign packaging campaign.',
    sources: [
      { publisher: 'CIRDI Mining Cadastre Diagnostic Hub', url: 'https://cirdi.ca', className: 'industry_database', confidence: 76 },
    ],
  },
  {
    name: 'Distressed equity drought',
    condition: 'TSXV/ASX small-cap mineral index down ≥20% over 90d with ≥10 NOIs/CCAA filings',
    reweights: 'Activates the distressed-permit-portfolio packaging engine.',
    sources: [
      { publisher: 'TSX Venture Composite', url: 'https://www.tsx.com/listings/current-market-statistics', className: 'industry_database', jurisdiction: 'CA', confidence: 84 },
      { publisher: 'Insolvency Insider Canada', url: 'https://insolvencyinsider.ca', className: 'court_filing', jurisdiction: 'CA', confidence: 78 },
    ],
  },
  {
    name: 'Climate / carbon-border policy',
    condition: 'CBAM-style instruments expand or non-OECD carbon-intensity disclosures sharpen',
    reweights: 'Up-weights low-carbon producers + value-add jurisdictions (Norway, Sweden, Quebec, Saudi green hubs).',
    sources: [
      { publisher: 'EU CBAM', url: 'https://taxation-customs.ec.europa.eu/carbon-border-adjustment-mechanism_en', className: 'government_portal', jurisdiction: 'EU', confidence: 90 },
    ],
  },
]

// -----------------------------------------------------------------------------
// Global scouting feeds - the source registry behind the radar
// -----------------------------------------------------------------------------

export type ScoutingFeed = {
  region: string
  feed: string
  url: string
  className: SourceClass
  notes?: string
}

export const globalScoutingFeeds: ScoutingFeed[] = [
  // Multilateral & strategic
  { region: 'Global', feed: 'IEA Critical Minerals Outlook', url: 'https://www.iea.org/topics/critical-minerals', className: 'multilateral', notes: 'Demand-side calibration for LFP/NMC/Na-ion shifts.' },
  { region: 'Global', feed: 'World Bank Projects', url: 'https://projects.worldbank.org', className: 'multilateral' },
  { region: 'Global', feed: 'IFC Disclosures', url: 'https://disclosures.ifc.org', className: 'multilateral' },
  { region: 'Global', feed: 'AfDB Procurement', url: 'https://www.afdb.org/en/projects-and-operations/procurement', className: 'multilateral' },
  { region: 'Global', feed: 'EBRD Projects', url: 'https://www.ebrd.com/work-with-us/projects.html', className: 'multilateral' },
  { region: 'Global', feed: 'EITI Country Hubs', url: 'https://eiti.org/countries', className: 'multilateral' },
  { region: 'Global', feed: 'OECD MNE Guidelines & Conduct', url: 'https://mneguidelines.oecd.org', className: 'multilateral' },
  // Exchange filings
  { region: 'North America', feed: 'SEDAR+', url: 'https://www.sedarplus.ca', className: 'exchange_filing' },
  { region: 'North America', feed: 'SEC EDGAR', url: 'https://www.sec.gov/edgar/search/', className: 'exchange_filing' },
  { region: 'North America', feed: 'TSX / TSX Venture', url: 'https://money.tmx.com/en/quote', className: 'exchange_filing' },
  { region: 'Europe', feed: 'LSE RNS', url: 'https://www.londonstockexchange.com/news?tab=news-explorer', className: 'exchange_filing' },
  { region: 'Europe', feed: 'Euronext Live News', url: 'https://live.euronext.com/en/products/equities/company-news', className: 'exchange_filing' },
  { region: 'Africa', feed: 'JSE SENS', url: 'https://www.jse.co.za/news-and-results', className: 'exchange_filing' },
  { region: 'Asia-Pacific', feed: 'ASX Announcements', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements.htm', className: 'exchange_filing' },
  { region: 'Asia-Pacific', feed: 'NSE Corporate Filings (India)', url: 'https://www.nseindia.com/companies-listing/corporate-filings-announcements', className: 'exchange_filing' },
  { region: 'Asia-Pacific', feed: 'HKEX HKEXnews', url: 'https://www.hkexnews.hk', className: 'exchange_filing' },
  { region: 'Latin America', feed: 'B3 Listed Companies', url: 'https://www.b3.com.br/en_us/', className: 'exchange_filing' },
  // Cadastres & commissions
  { region: 'Africa', feed: 'Ghana Minerals Commission', url: 'https://www.mincom.gov.gh', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'DRC CAMI', url: 'https://www.cami.cd', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'Zambia Cadastre', url: 'https://portals.flexicadastre.com/zambia/', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'Namibia MME', url: 'https://www.mme.gov.na', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'Botswana Ministry of Minerals & Energy', url: 'https://www.gov.bw/ministries/ministry-minerals-energy', className: 'government_portal' },
  { region: 'Africa', feed: 'South Africa DMRE', url: 'https://www.dmre.gov.za', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'Tanzania Mining Commission', url: 'https://www.tumemadini.go.tz', className: 'mining_cadastre' },
  { region: 'Africa', feed: 'ONHYM Morocco', url: 'https://www.onhym.com', className: 'petroleum_commission' },
  { region: 'Africa', feed: 'Senegal MEPM', url: 'https://www.energie.gouv.sn', className: 'petroleum_commission' },
  { region: 'Africa', feed: 'NUPRC Nigeria', url: 'https://www.nuprc.gov.ng', className: 'petroleum_commission' },
  { region: 'Africa', feed: 'INP Mozambique', url: 'https://www.inp.gov.mz', className: 'petroleum_commission' },
  { region: 'Americas', feed: 'BLM LR2000 (US)', url: 'https://reports.blm.gov/reports/LR2000', className: 'mining_cadastre' },
  { region: 'Americas', feed: 'BOEM Lease Maps', url: 'https://www.boem.gov/oil-gas-energy/mapping-and-data', className: 'petroleum_commission' },
  { region: 'Americas', feed: 'ANM Brazil', url: 'https://www.gov.br/anm/pt-br', className: 'mining_cadastre' },
  { region: 'Americas', feed: 'ANP Brazil', url: 'https://www.gov.br/anp/pt-br', className: 'petroleum_commission' },
  { region: 'Americas', feed: 'INGEMMET / GEOCATMIN', url: 'https://geocatmin.ingemmet.gob.pe', className: 'mining_cadastre' },
  { region: 'Americas', feed: 'SEGEMAR Argentina', url: 'https://www.segemar.gov.ar', className: 'geological_survey' },
  { region: 'Americas', feed: 'SERNAGEOMIN Chile', url: 'https://www.sernageomin.cl', className: 'geological_survey' },
  { region: 'Americas', feed: 'Servicio Geológico Mexicano', url: 'https://www.gob.mx/sgm', className: 'geological_survey' },
  { region: 'Europe', feed: 'NSTA UK', url: 'https://www.nstauthority.co.uk', className: 'petroleum_commission' },
  { region: 'Europe', feed: 'Sodir / NPD', url: 'https://www.sodir.no', className: 'petroleum_commission' },
  { region: 'Europe', feed: 'Bergsstaten Sweden', url: 'https://www.sgu.se/en/mining-inspectorate', className: 'mining_cadastre' },
  { region: 'Europe', feed: 'Tukes Finland', url: 'https://tukes.fi/en/mining', className: 'mining_cadastre' },
  { region: 'Arctic', feed: 'Greenland MLSA', url: 'https://www.govmin.gl', className: 'mining_cadastre' },
  { region: 'Middle East', feed: 'Ta\'adeen Saudi Arabia', url: 'https://taadeen.sa', className: 'mining_cadastre' },
  { region: 'Middle East', feed: 'Hydrom Oman', url: 'https://hydrom.com', className: 'tender_portal' },
  { region: 'Asia-Pacific', feed: 'WA DMIRS Tengraph', url: 'https://www.dmirs.wa.gov.au', className: 'mining_cadastre' },
  { region: 'Asia-Pacific', feed: 'Geoscience Australia', url: 'https://www.ga.gov.au', className: 'geological_survey' },
  { region: 'Asia-Pacific', feed: 'Ministry of ESDM Indonesia', url: 'https://www.esdm.go.id', className: 'government_portal' },
  { region: 'Asia-Pacific', feed: 'IBM India', url: 'https://ibm.gov.in', className: 'mining_cadastre' },
  { region: 'Asia-Pacific', feed: 'MRPAM Mongolia', url: 'https://mrpam.gov.mn', className: 'mining_cadastre' },
  { region: 'Asia-Pacific', feed: 'MGB Philippines', url: 'https://mgb.gov.ph', className: 'mining_cadastre' },
  // News / RSS
  { region: 'Global', feed: 'Reuters Commodities', url: 'https://www.reuters.com/markets/commodities/', className: 'rss_news' },
  { region: 'Global', feed: 'Mining.com', url: 'https://www.mining.com', className: 'rss_news' },
  { region: 'Global', feed: 'S&P Global Commodity Insights', url: 'https://www.spglobal.com/commodityinsights', className: 'rss_news' },
  { region: 'Global', feed: 'Argus Media', url: 'https://www.argusmedia.com', className: 'rss_news' },
  { region: 'Global', feed: 'Fastmarkets', url: 'https://www.fastmarkets.com', className: 'rss_news' },
  // Sanctions & registers
  { region: 'Global', feed: 'OFAC SDN', url: 'https://sanctionssearch.ofac.treas.gov', className: 'sanction_list' },
  { region: 'Global', feed: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu', className: 'sanction_list' },
  { region: 'Global', feed: 'UK OFSI', url: 'https://www.gov.uk/government/organisations/office-of-financial-sanctions-implementation', className: 'sanction_list' },
  // Open Earth
  { region: 'Global', feed: 'Copernicus Open Access', url: 'https://dataspace.copernicus.eu', className: 'satellite_open_data' },
  { region: 'Global', feed: 'NASA Earthdata', url: 'https://www.earthdata.nasa.gov', className: 'satellite_open_data' },
  { region: 'Global', feed: 'USGS EarthExplorer', url: 'https://earthexplorer.usgs.gov', className: 'satellite_open_data' },
]

// -----------------------------------------------------------------------------
// Verification protocol - what every claim must reference
// -----------------------------------------------------------------------------

export const verificationProtocol = [
  { step: 'Source class', requirement: 'Every signal must list at least one SourceCitation tagged with className.' },
  { step: 'Authoritative tier', requirement: 'Promote to Critical/High urgency only when at least one source is exchange_filing, government_portal, mining_cadastre, or petroleum_commission.' },
  { step: 'Verification URL', requirement: 'Every SourceCitation must have a clickable url that an analyst can open in a new tab.' },
  { step: 'Sanctions screen', requirement: 'Cross-check holders / counterparties against OFAC, OFSI, EU Sanctions Map before any client-grade claim.' },
  { step: 'Date stamp', requirement: 'Annotate retrieved date for time-sensitive triggers (auctions, rounds, financings, distressed actions).' },
  { step: 'Re-verification cadence', requirement: 'Re-test cadastre + exchange-filing sources weekly; multilateral + RSS daily.' },
]

// -----------------------------------------------------------------------------
// Prompt workspace + scoring bands + commodity heat
// -----------------------------------------------------------------------------

export const promptTemplates: PromptTemplate[] = [
  {
    name: 'Uranium financing intercept',
    focus: 'Funding, drilling, strategic alternatives',
    cadence: 'Daily',
    sources: [
      { publisher: 'SEDAR+', url: 'https://www.sedarplus.ca', className: 'exchange_filing', jurisdiction: 'CA' },
      { publisher: 'ASX Announcements', url: 'https://www.asx.com.au/markets/trade-our-cash-market/announcements.htm', className: 'exchange_filing', jurisdiction: 'AU' },
    ],
  },
  {
    name: 'Sovereign licensing monitor',
    focus: 'Mining ministries, geological surveys, petroleum commissions',
    cadence: 'Daily',
    sources: [
      { publisher: 'Sodir', url: 'https://www.sodir.no', className: 'petroleum_commission', jurisdiction: 'NO' },
      { publisher: 'BOEM', url: 'https://www.boem.gov', className: 'petroleum_commission', jurisdiction: 'US' },
      { publisher: 'Ta\'adeen', url: 'https://taadeen.sa', className: 'mining_cadastre', jurisdiction: 'SA' },
    ],
  },
  {
    name: 'Helium and hydrogen demand scan',
    focus: 'New entrants, permits, offtake, procurement',
    cadence: 'Twice weekly',
    sources: [
      { publisher: 'Hydrom Oman', url: 'https://hydrom.com', className: 'tender_portal', jurisdiction: 'OM' },
      { publisher: 'Namibia Green Hydrogen', url: 'https://gh2namibia.com', className: 'government_portal', jurisdiction: 'NA' },
    ],
  },
  {
    name: 'Deal-room distressed asset screen',
    focus: 'Farm-ins, concession sales, expiring licenses',
    cadence: 'Weekly',
    sources: [
      { publisher: 'Insolvency Insider Canada', url: 'https://insolvencyinsider.ca', className: 'court_filing', jurisdiction: 'CA' },
      { publisher: 'Companies House UK', url: 'https://www.gov.uk/government/organisations/companies-house', className: 'regulator_register', jurisdiction: 'UK' },
    ],
  },
  {
    name: 'Sovereign capital matchmaking',
    focus: 'PIF / ADIA / Mubadala / Temasek / Manara critical-mineral mandates',
    cadence: 'Weekly',
    sources: [
      { publisher: 'PIF', url: 'https://www.pif.gov.sa', className: 'sovereign_wealth', jurisdiction: 'SA' },
      { publisher: 'Mubadala', url: 'https://www.mubadala.com', className: 'sovereign_wealth', jurisdiction: 'AE' },
    ],
  },
  {
    name: 'Sanctions-rerouting opportunity scan',
    focus: 'OFAC/OFSI/EU updates rerouting Cu, Ni, Al, Au logistics',
    cadence: 'Daily',
    sources: [
      { publisher: 'OFAC Recent Actions', url: 'https://ofac.treasury.gov/recent-actions', className: 'sanction_list', jurisdiction: 'US' },
      { publisher: 'EU Sanctions Map', url: 'https://www.sanctionsmap.eu', className: 'sanction_list', jurisdiction: 'EU' },
    ],
  },
]

export const aorScoreBands = [
  { name: 'Critical', value: 5, color: '#ef4444' },
  { name: 'High', value: 8, color: '#f59e0b' },
  { name: 'Moderate', value: 3, color: '#22c55e' },
]

export const commodityHeat = [
  { commodity: 'Uranium', heat: 92 },
  { commodity: 'Copper', heat: 90 },
  { commodity: 'Bauxite co-products', heat: 88 },
  { commodity: 'REE', heat: 87 },
  { commodity: 'Lithium brines', heat: 85 },
  { commodity: 'Nickel (Class 1)', heat: 82 },
  { commodity: 'Helium', heat: 78 },
  { commodity: 'Cobalt', heat: 76 },
  { commodity: 'Hydrogen', heat: 72 },
  { commodity: 'Phosphate / REE chains', heat: 70 },
  { commodity: 'Deep-sea polymetallic', heat: 64 },
]

export const parentOreSystems: ParentOreSystem[] = [
  {
    parent: 'Bauxite',
    targets: ['Titanium', 'Gallium', 'Scandium', 'REEs', 'Vanadium'],
    priority: 'Tier 1',
    thesis: 'Bauxite may be a hidden critical-minerals business, not only an aluminum feedstock.',
    sources: [
      { publisher: 'USGS Mineral Commodity Summaries – Bauxite/Alumina', url: 'https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-bauxite-alumina.pdf', className: 'geological_survey', jurisdiction: 'US' },
    ],
  },
  {
    parent: 'Iron ore',
    targets: ['Vanadium', 'Titanium'],
    priority: 'Tier 2',
    thesis: 'Large known systems can carry overlooked alloy and battery-metal credits.',
    sources: [
      { publisher: 'Geoscience Australia – Iron Ore', url: 'https://www.ga.gov.au/scientific-topics/minerals/mineral-resources-and-advice/aimr/iron-ore', className: 'geological_survey', jurisdiction: 'AU' },
    ],
  },
  {
    parent: 'Nickel laterites',
    targets: ['Cobalt', 'Scandium'],
    priority: 'Tier 2',
    thesis: 'Laterite systems can support strategic co-product recovery and downstream processing.',
    sources: [
      { publisher: 'IEA Critical Minerals Outlook', url: 'https://www.iea.org/topics/critical-minerals', className: 'multilateral' },
    ],
  },
  {
    parent: 'Phosphates',
    targets: ['REEs'],
    priority: 'Tier 3',
    thesis: 'Fertilizer feedstock chains can become rare-earth feedstock chains with the right recovery route.',
    sources: [
      { publisher: 'OCP Group IR', url: 'https://www.ocpgroup.ma/investor', className: 'corporate_disclosure', jurisdiction: 'MA' },
    ],
  },
  {
    parent: 'Copper porphyries',
    targets: ['Rhenium', 'Tellurium', 'Molybdenum'],
    priority: 'Tier 3',
    thesis: 'Existing copper systems may contain critical industrial by-products with acquisition relevance.',
    sources: [
      { publisher: 'USGS Mineral Commodity Summaries – Copper', url: 'https://pubs.usgs.gov/periodicals/mcs2024/mcs2024-copper.pdf', className: 'geological_survey', jurisdiction: 'US' },
    ],
  },
]

export const secondaryMatrix = [
  { country: 'Ghana', parent: 'Bauxite', titanium: 82, gallium: 76, scandium: 62, ree: 58, index: 81 },
  { country: 'Guinea', parent: 'Bauxite', titanium: 86, gallium: 84, scandium: 68, ree: 61, index: 84 },
  { country: 'Brazil', parent: 'Bauxite', titanium: 74, gallium: 72, scandium: 55, ree: 49, index: 70 },
  { country: 'Australia', parent: 'Bauxite', titanium: 71, gallium: 69, scandium: 64, ree: 52, index: 73 },
  { country: 'India', parent: 'Bauxite', titanium: 78, gallium: 75, scandium: 59, ree: 57, index: 76 },
]

export const refineryOpportunities: RefineryOpportunity[] = [
  {
    country: 'Ghana',
    focus: 'Titanium concentrate, gallium recovery, alumina-chain integration',
    infrastructure: 86,
    strategicFit: 91,
    nextStep: 'Build Ghana hidden-mineral economy report and pilot recovery thesis',
    sources: [
      { publisher: 'GIADEC', url: 'https://giadec.com', className: 'government_portal', jurisdiction: 'GH', confidence: 86 },
    ],
  },
  {
    country: 'Guinea',
    focus: 'Bauxite co-product screening and export-value leakage analysis',
    infrastructure: 61,
    strategicFit: 88,
    nextStep: 'Frame sovereign report around raw ore exports and missed critical minerals',
    sources: [
      { publisher: 'EITI Guinea', url: 'https://eiti.org/countries/guinea', className: 'multilateral', jurisdiction: 'GN', confidence: 82 },
    ],
  },
  {
    country: 'UAE',
    focus: 'Critical minerals refining hub and strategic capital platform',
    infrastructure: 92,
    strategicFit: 84,
    nextStep: 'Assess imported feedstock model for gallium, TiO2, and REE separation',
    sources: [
      { publisher: 'UAE MOIAT', url: 'https://www.moiat.gov.ae', className: 'government_portal', jurisdiction: 'AE', confidence: 84 },
      { publisher: 'Mubadala', url: 'https://www.mubadala.com', className: 'sovereign_wealth', jurisdiction: 'AE', confidence: 84 },
    ],
  },
]
