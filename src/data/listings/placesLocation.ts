export type PlacesSelectedLocation = {
  location: string;
  pincode: string;
  district: string;
  state: string;
  cityTaluka?: string;
};

export type PlacesUrlState = {
  selectedLocation: PlacesSelectedLocation | null;
  query: string;
  legacyLocationInQ: boolean;
};

function trimParam(params: URLSearchParams, key: string): string {
  return params.get(key)?.trim() ?? '';
}

const MIN_TOKEN_LENGTH = 3;

const LOCALITY_ALIAS_GROUPS: readonly (readonly string[])[] = [['hinjawadi', 'hinjewadi']];

const BROAD_GEO_TERMS = new Set([
  'andaman and nicobar islands',
  'andhra pradesh',
  'arunachal pradesh',
  'assam',
  'bihar',
  'chandigarh',
  'chhattisgarh',
  'dadra and nagar haveli and daman and diu',
  'delhi',
  'goa',
  'gujarat',
  'haryana',
  'himachal pradesh',
  'jammu and kashmir',
  'jharkhand',
  'karnataka',
  'kerala',
  'ladakh',
  'lakshadweep',
  'madhya pradesh',
  'maharashtra',
  'manipur',
  'meghalaya',
  'mizoram',
  'nagaland',
  'nct of delhi',
  'odisha',
  'orissa',
  'puducherry',
  'pondicherry',
  'punjab',
  'rajasthan',
  'sikkim',
  'tamil nadu',
  'telangana',
  'tripura',
  'uttar pradesh',
  'uttarakhand',
  'west bengal',
  'india',
  'bharat',
  'pune',
  'mumbai',
  'bombay',
  'bengaluru',
  'bangalore',
  'hyderabad',
  'chennai',
  'madras',
  'kolkata',
  'calcutta',
  'ahmedabad',
  'jaipur',
  'surat',
  'lucknow',
  'kanpur',
  'nagpur',
  'indore',
  'thane',
  'bhopal',
  'new delhi',
  'noida',
  'gurugram',
  'gurgaon',
  'navi mumbai',
]);

export type LocationFilterContext = {
  district?: string;
  state?: string;
};

function normalizeForMatch(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]+/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function expandLocalityAliases(term: string): string[] {
  const expanded = new Set<string>([term]);
  for (const group of LOCALITY_ALIAS_GROUPS) {
    for (const alias of group) {
      if (term === alias) {
        for (const other of group) {
          expanded.add(other);
        }
        continue;
      }
      const parts = term.split(' ');
      if (parts.includes(alias)) {
        for (const other of group) {
          expanded.add(parts.map((part) => (part === alias ? other : part)).join(' '));
        }
      }
    }
  }
  return [...expanded];
}

function extractLocationTerms(location: string): string[] {
  const terms: string[] = [];
  const outer = normalizeForMatch(location.replace(/\([^)]*\)/g, ' '));
  if (outer.length >= MIN_TOKEN_LENGTH) {
    terms.push(outer);
  }
  for (const match of location.matchAll(/\(([^)]+)\)/g)) {
    const inner = normalizeForMatch(match[1]);
    if (inner.length >= MIN_TOKEN_LENGTH) {
      terms.push(inner);
    }
  }
  if (terms.length === 0) {
    const normalized = normalizeForMatch(location);
    if (normalized.length >= MIN_TOKEN_LENGTH) {
      terms.push(normalized);
    }
  }
  return terms;
}

export function locationFilterNeedles(
  location: string,
  context: LocationFilterContext = {},
): string[] {
  const extracted = extractLocationTerms(location);
  const broad = new Set(BROAD_GEO_TERMS);
  const district = normalizeForMatch(context.district ?? '');
  const state = normalizeForMatch(context.state ?? '');
  if (district.length >= MIN_TOKEN_LENGTH) {
    broad.add(district);
  }
  if (state.length >= MIN_TOKEN_LENGTH) {
    broad.add(state);
  }
  const hasSpecific = extracted.some((term) => !broad.has(term));
  const tokens = new Set<string>();
  for (const term of extracted) {
    if (hasSpecific && broad.has(term)) {
      continue;
    }
    for (const expanded of expandLocalityAliases(term)) {
      if (expanded.length >= MIN_TOKEN_LENGTH) {
        tokens.add(expanded);
      }
    }
  }
  if (tokens.size === 0) {
    const fallback = normalizeForMatch(location.replace(/\([^)]*\)/g, ' '));
    if (fallback.length >= MIN_TOKEN_LENGTH) {
      for (const expanded of expandLocalityAliases(fallback)) {
        tokens.add(expanded);
      }
    }
  }
  return [...tokens];
}

export function addressContainsLocation(
  address: string,
  location: string,
  context: LocationFilterContext = {},
): boolean {
  const needles = locationFilterNeedles(location, context);
  if (needles.length === 0) {
    return !location.trim();
  }
  const haystack = normalizeForMatch(address);
  return needles.some((needle) => haystack.includes(needle));
}

function titleCaseState(state: string): string {
  return state
    .toLowerCase()
    .replace(/\b([a-z])/g, (letter) => letter.toUpperCase());
}

export function formatPlacesLocationLabel(selected: PlacesSelectedLocation): string {
  const location = selected.location.trim();
  const district = selected.district.trim();
  const state = selected.state.trim();
  if (location && district && location.toLowerCase() !== district.toLowerCase()) {
    return `${location}, ${district}`;
  }
  if (location && district && state) {
    return `${location} · ${district} · ${titleCaseState(state)}`;
  }
  if (location && state && location.toLowerCase() !== state.toLowerCase()) {
    return `${location} · ${titleCaseState(state)}`;
  }
  return location;
}

export function parsePlacesUrlState(params: URLSearchParams): PlacesUrlState {
  const location = trimParam(params, 'location');
  const pincode = trimParam(params, 'pincode');
  const district = trimParam(params, 'district');
  const state = trimParam(params, 'state');
  const cityTaluka = trimParam(params, 'taluk');
  const q = trimParam(params, 'q');

  if (location) {
    return {
      selectedLocation: { location, pincode, district, state, cityTaluka },
      query: q,
      legacyLocationInQ: false,
    };
  }

  // Home previously sent ?q=Aundh&pincode=411007 — treat q as location, not search.
  if (pincode && q) {
    return {
      selectedLocation: { location: q, pincode, district, state, cityTaluka },
      query: '',
      legacyLocationInQ: true,
    };
  }

  return {
    selectedLocation: null,
    query: q,
    legacyLocationInQ: false,
  };
}

export function buildPlacesSearchParams(input: {
  selectedLocation: PlacesSelectedLocation | null;
  query: string;
}): URLSearchParams {
  const next = new URLSearchParams();
  const selected = input.selectedLocation;
  if (selected?.location.trim()) {
    next.set('location', selected.location.trim());
    if (selected.pincode.trim()) {
      next.set('pincode', selected.pincode.trim());
    }
    if (selected.district.trim()) {
      next.set('district', selected.district.trim());
    }
    if (selected.state.trim()) {
      next.set('state', selected.state.trim());
    }
    if (selected.cityTaluka?.trim()) {
      next.set('taluk', selected.cityTaluka.trim());
    }
  }
  const query = input.query.trim();
  if (query) {
    next.set('q', query);
  }
  return next;
}

export function toPlacesSelectedLocation(input: {
  location: string;
  pincode: string;
  district: string;
  state: string;
  cityTaluka?: string;
}): PlacesSelectedLocation {
  return {
    location: input.location.trim(),
    pincode: input.pincode.trim(),
    district: input.district.trim(),
    state: input.state.trim(),
    cityTaluka: input.cityTaluka?.trim() ?? '',
  };
}
