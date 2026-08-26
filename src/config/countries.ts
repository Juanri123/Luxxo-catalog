export interface CountryConfig {
    id: string; // url slug (e.g., 'co')
    name: string;
    currencyCode: string;
    currencySymbol: string;
    locale: string;
    active: boolean; // if false, display "Coming Soon"
}

export const countries: CountryConfig[] = [
    {
        id: 'co',
        name: 'Colombia',
        currencyCode: 'COP',
        currencySymbol: '$',
        locale: 'es-CO',
        active: true,
    },
    {
        id: 'ec',
        name: 'Ecuador',
        currencyCode: 'USD',
        currencySymbol: '$',
        locale: 'en-US',
        active: false,
    },
    {
        id: 'pe',
        name: 'Perú',
        currencyCode: 'PEN',
        currencySymbol: 'S/',
        locale: 'es-PE',
        active: false,
    },
    {
        id: 'cr',
        name: 'Costa Rica',
        currencyCode: 'CRC',
        currencySymbol: '₡',
        locale: 'es-CR',
        active: false,
    },
    {
        id: 'gt',
        name: 'Guatemala',
        currencyCode: 'GTQ',
        currencySymbol: 'Q',
        locale: 'es-GT',
        active: false,
    }
];

export function getCountryConfig(id: string): CountryConfig | undefined {
    return countries.find(c => c.id === id);
}
