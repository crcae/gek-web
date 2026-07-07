export interface ProductSpec {
  id: string;
  nombre: string;
  nombreEn: string;
  nombreDe: string;
  tamano: string;
  tamanoEn: string;
  tamanoDe: string;
  empaque: string;
  empaqueEn: string;
  empaqueDe: string;
  pallet: string;
  palletEn: string;
  palletDe: string;
  origen: string;
  origenEn: string;
  origenDe: string;
  vida: string;
  vidaEn: string;
  vidaDe: string;
  temperatura: string;
  temperaturaEn: string;
  temperaturaDe: string;
  presentacion: string;
  presentacionEn: string;
  presentacionDe: string;
  disponibilidad: string;
  disponibilidadEn: string;
  disponibilidadDe: string;
  imagen: string;
}

export const premiumProducts: ProductSpec[] = [
  {
    id: 'chile-jalapeno',
    nombre: 'Chile Jalapeño',
    nombreEn: 'Jalapeño Pepper',
    nombreDe: 'Jalapeño-Chili',
    tamano: 'Grande / Extra Grande (3.5" - 4.5")',
    tamanoEn: 'Large / Extra Large (3.5" - 4.5")',
    tamanoDe: 'Groß / Extra Groß (3.5" - 4.5")',
    empaque: 'Caja de plástico RPC o cartón (35-40 lbs)',
    empaqueEn: 'Plastic RPC or Cardboard Box (35-40 lbs)',
    empaqueDe: 'RPC-Kunststoff- oder Kartonkiste (35-40 lbs)',
    pallet: '60 a 80 cajas por pallet',
    palletEn: '60 to 80 boxes per pallet',
    palletDe: '60 bis 80 Kisten pro Palette',
    origen: 'Zacatecas / Sinaloa, México',
    origenEn: 'Zacatecas / Sinaloa, Mexico',
    origenDe: 'Zacatecas / Sinaloa, Mexiko',
    vida: '14 - 21 días',
    vidaEn: '14 - 21 days',
    vidaDe: '14 - 21 Tage',
    temperatura: '7.5°C - 10°C (45°F - 50°F)',
    temperaturaEn: '7.5°C - 10°C (45°F - 50°F)',
    temperaturaDe: '7.5°C - 10°C (45°F - 50°F)',
    presentacion: 'Granel en caja / Enmallado personalizado',
    presentacionEn: 'Bulk in box / Custom mesh netting',
    presentacionDe: 'Lose im Karton / Kundenspezifische Netztüten',
    disponibilidad: 'Todo el año (Producción rotativa)',
    disponibilidadEn: 'Year-round (Rotating production)',
    disponibilidadDe: 'Ganzjährig (Rotierende Produktion)',
    imagen: '/images/holding/premium/jalapeno.jpg'
  },
  {
    id: 'chile-serrano',
    nombre: 'Chile Serrano',
    nombreEn: 'Serrano Pepper',
    nombreDe: 'Serrano-Chili',
    tamano: 'Mediano / Grande (2.5" - 3.5")',
    tamanoEn: 'Medium / Large (2.5" - 3.5")',
    tamanoDe: 'Mittel / Groß (2.5" - 3.5")',
    empaque: 'Caja de plástico RPC o cartón (35 lbs)',
    empaqueEn: 'Plastic RPC or Cardboard Box (35 lbs)',
    empaqueDe: 'RPC-Kunststoff- oder Kartonkiste (35 lbs)',
    pallet: '60 a 80 cajas por pallet',
    palletEn: '60 to 80 boxes per pallet',
    palletDe: '60 bis 80 Kisten pro Palette',
    origen: 'Zacatecas / San Luis Potosí, México',
    origenEn: 'Zacatecas / San Luis Potosí, Mexico',
    origenDe: 'Zacatecas / San Luis Potosí, Mexiko',
    vida: '14 - 18 días',
    vidaEn: '14 - 18 days',
    vidaDe: '14 - 18 Tage',
    temperatura: '7.5°C - 10°C (45°F - 50°F)',
    temperaturaEn: '7.5°C - 10°C (45°F - 50°F)',
    temperaturaDe: '7.5°C - 10°C (45°F - 50°F)',
    presentacion: 'A granel en caja',
    presentacionEn: 'Bulk in box',
    presentacionDe: 'Lose im Karton',
    disponibilidad: 'Todo el año',
    disponibilidadEn: 'Year-round',
    disponibilidadDe: 'Ganzjährig',
    imagen: '/images/holding/premium/serrano.jpg'
  },
  {
    id: 'cebollas',
    nombre: 'Cebolla Blanca / Amarilla',
    nombreEn: 'White / Yellow Onion',
    nombreDe: 'Weiße / Gelbe Zwiebel',
    tamano: 'Jumbo (3" - 3.75") / Colosal (3.75"+)',
    tamanoEn: 'Jumbo (3" - 3.75") / Colossal (3.75"+)',
    tamanoDe: 'Jumbo (3" - 3.75") / Kolossal (3.75"+)',
    empaque: 'Sacos de malla (25 / 50 lbs)',
    empaqueEn: 'Mesh sacks (25 / 50 lbs)',
    empaqueDe: 'Netzsäcke (25 / 50 lbs)',
    pallet: '50 a 60 sacos por pallet',
    palletEn: '50 to 60 sacks per pallet',
    palletDe: '50 bis 60 Säcke pro Palette',
    origen: 'Zacatecas / Guanajuato, México',
    origenEn: 'Zacatecas / Guanajuato, Mexico',
    origenDe: 'Zacatecas / Guanajuato, Mexiko',
    vida: '30 - 45 días',
    vidaEn: '30 - 45 days',
    vidaDe: '30 - 45 Tage',
    temperatura: '0°C - 4°C (32°F - 40°F)',
    temperaturaEn: '0°C - 4°C (32°F - 40°F)',
    temperaturaDe: '0°C - 4°C (32°F - 40°F)',
    presentacion: 'Saco a granel / Enmallado personalizado',
    presentacionEn: 'Bulk sack / Custom mesh netting',
    presentacionDe: 'Lose im Sack / Kundenspezifische Netztüten',
    disponibilidad: 'Estacional (Marzo - Octubre)',
    disponibilidadEn: 'Seasonal (March - October)',
    disponibilidadDe: 'Saisonal (März - Oktober)',
    imagen: '/images/holding/premium/cebolla.jpg'
  }
];
