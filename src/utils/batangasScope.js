import { isWithinBatangasCoordinateBounds, normalizeCoordinates } from './coordinates'

export const BATANGAS_MUNICIPALITIES = [
    'Agoncillo', 'Alitagtag', 'Balayan', 'Balete', 'Batangas City', 'Bauan',
    'Calaca', 'Calatagan', 'Cuenca', 'Ibaan', 'Laurel', 'Lemery', 'Lian',
    'Lipa City', 'Lobo', 'Mabini', 'Malvar', 'Mataas na Kahoy', 'Nasugbu',
    'Padre Garcia', 'Rosario', 'San Jose', 'San Juan', 'San Luis',
    'San Nicolas', 'San Pascual', 'Santa Teresita', 'Santo Tomas', 'Taal',
    'Talisay', 'Tanauan City', 'Taysan', 'Tingloy', 'Tuy'
]

const normalize = value => String(value || '')
    .toLowerCase()
    .replace(/\bcity\b/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()

const municipalityNames = new Set(BATANGAS_MUNICIPALITIES.map(normalize))

export const isBatangasMunicipality = value => {
    const normalized = normalize(value)
    return municipalityNames.has(normalized) ||
        normalized === 'lipa' ||
        normalized === 'tanauan' ||
        normalized === 'sto tomas'
}

export const isWithinBatangasScope = place => {
    const coordinates = normalizeCoordinates(place)
    if (!coordinates || !isWithinBatangasCoordinateBounds(coordinates)) return false

    const province = String(place?.province || '').toLowerCase()
    if (province && !province.includes('batangas')) return false

    const municipality = place?.municipality || place?.city || place?.town || ''
    return municipality
        ? isBatangasMunicipality(municipality)
        : province.includes('batangas')
}

export const BATANGAS_SCOPE_MESSAGE =
    'BiyaHero currently supports transportation routes within Batangas Province.'
