import { prisma } from '../db';

export async function getUnidadesNegocio() {
  try {
    const unidades = await prisma.unidadNegocio.findMany({
      include: {
        division: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (unidades.length === 0) {
      // Fallback data
      return [
        { id: '1', nameEs: 'Campos de Producción', nameEn: 'Production Fields', nameDe: 'Produktionsfelder', location: 'Loreto, Zacatecas' },
        { id: '2', nameEs: 'Planta de Pre-enfriamiento', nameEn: 'Pre-cooling Plant', nameDe: 'Vorkühlanlage', location: 'Loreto, Zacatecas' },
        { id: '3', nameEs: 'Centro de Distribución', nameEn: 'Distribution Center', nameDe: 'Vertriebszentrum', location: 'San Nicolás de los Garza, NL' },
        { id: '4', nameEs: 'Bodega Mercado Abastos Estrella No.124', nameEn: 'Warehouse Abastos Estrella No.124', nameDe: 'Lagerhaus Abastos Estrella Nr.124', location: 'San Nicolás de los Garza, NL' },
      ];
    }

    return unidades;
  } catch (error) {
    console.error('Error fetching unidades de negocio:', error);
    return [];
  }
}

export async function getDivisiones() {
  try {
    const divisiones = await prisma.division.findMany({
      orderBy: {
        createdAt: 'asc',
      },
    });

    if (divisiones.length === 0) {
      // Fallback data
      return [
        { id: 'hortalizas', nameEs: "Vizcaíno Fruit's", nameEn: "Vizcaíno Fruit's", nameDe: "Vizcaíno Fruit's", descriptionEs: "Hortalizas", descriptionEn: "Vegetables", descriptionDe: "Gemüse" },
        { id: 'chiles', nameEs: "Vizcaíno Premium", nameEn: "Vizcaíno Premium", nameDe: "Vizcaíno Premium", descriptionEs: "Chiles Picosos", descriptionEn: "Spicy Peppers", descriptionDe: "Scharfe Chilis" },
        { id: 'servicios', nameEs: "Vizcaíno Services", nameEn: "Vizcaíno Services", nameDe: "Vizcaíno Services", descriptionEs: "Servicios logísticos", descriptionEn: "Logistics services", descriptionDe: "Logistikdienstleistungen" },
      ];
    }

    return divisiones;
  } catch (error) {
    console.error('Error fetching divisiones:', error);
    return [];
  }
}
