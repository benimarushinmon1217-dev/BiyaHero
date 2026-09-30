import { isWithinBatangasCoordinateBounds, normalizeCoordinates } from '../utils/coordinates.js';

export const BATANGAS_MUNICIPALITIES = [
    'Agoncillo', 'Alitagtag', 'Balayan', 'Balete', 'Batangas City', 'Bauan',
    'Calaca', 'Calatagan', 'Cuenca', 'Ibaan', 'Laurel', 'Lemery', 'Lian',
    'Lipa City', 'Lobo', 'Mabini', 'Malvar', 'Mataas na Kahoy', 'Nasugbu',
    'Padre Garcia', 'Rosario', 'San Jose', 'San Juan', 'San Luis',
    'San Nicolas', 'San Pascual', 'Santa Teresita', 'Santo Tomas', 'Taal',
    'Talisay', 'Tanauan City', 'Taysan', 'Tingloy', 'Tuy'
];

const normalize = (value = '') => String(value || '')
    .toLowerCase()
    .replace(/\bcity\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

const municipalityNames = new Set(BATANGAS_MUNICIPALITIES.map(normalize));

export const isValidCoordinate = (latitude, longitude) => {
    return normalizeCoordinates({ latitude, longitude }) !== null;
};

export const isBatangasMunicipality = (municipality = '') => {
    const normalized = normalize(municipality);
    if (municipalityNames.has(normalized)) return true;
    if (normalized === 'sto tomas' || normalized === 'santo tomas') return true;
    if (normalized === 'lipa') return true;
    if (normalized === 'tanauan') return true;
    return false;
};

export const isWithinBatangasScope = (place = {}) => {
    const coordinates = normalizeCoordinates(place);
    if (!coordinates || !isWithinBatangasCoordinateBounds(coordinates)) return false;

    const province = String(place.province || '').toLowerCase();
    if (province && !province.includes('batangas')) return false;

    const municipality = place.municipality || place.city || place.town || '';
    if (municipality) return isBatangasMunicipality(municipality);

    return !province || province.includes('batangas');
};

export const getBatangasScopeMessage = () =>
    'BiyaHero currently supports transportation routes within Batangas Province.';

export default {
    BATANGAS_MUNICIPALITIES,
    isValidCoordinate,
    isBatangasMunicipality,
    isWithinBatangasScope,
    getBatangasScopeMessage
};
