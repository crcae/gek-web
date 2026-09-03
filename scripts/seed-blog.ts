import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.blogPost.count();
  if (count > 0) {
    console.log(`Already have ${count} blog posts in DB.`);
    return;
  }

  const posts = [
    {
      slug: 'innovacion-agricola-zacatecas-tres-generaciones',
      titulo_es: 'Innovación Agrícola en Loreto, Zacatecas: El Legado de Tres Generaciones',
      titulo_en: 'Agricultural Innovation in Loreto, Zacatecas: The Legacy of Three Generations',
      titulo_de: 'Landwirtschaftliche Innovation in Loreto, Zacatecas: Das Erbe von drei Generationen',
      resumen_es: 'Descubre cómo Grupo Exportador del Campo ha transformado las técnicas de cultivo, preenfriamiento y exportación para llevar productos mexicanos de la más alta calidad a los mercados internacionales.',
      resumen_en: 'Discover how Grupo Exportador del Campo has transformed cultivation, pre-cooling, and export techniques to deliver the highest quality Mexican produce to international markets.',
      resumen_de: 'Erfahren Sie, wie Grupo Exportador del Campo Anbau-, Vorkühl- und Exporttechniken transformiert hat, um mexikanische Produkte höchster Qualität auf internationale Märkte zu bringen.',
      portadaUrl: '/images/features/quienes.jpg',
      categoria: 'Innovación',
      autor: 'Joaquín Vizcaíno',
      autorCargo: 'Director General — GEC',
      autorAvatar: '/images/quienes/ceo.jpg',
      destacado: true,
      publicado: true,
      vistas: 342,
      contenido_es: JSON.stringify([
        {
          type: 'paragraph',
          content: 'Durante más de cinco décadas, el compromiso de Grupo Exportador del Campo ha sido claro: honrar la tierra que nos vio nacer mientras miramos hacia el futuro con tecnología de punta y procesos agrícolas sostenibles. Desde nuestros orígenes en Loreto, Zacatecas, hemos evolucionado de una operación local a una red agroexportadora de escala internacional.'
        },
        {
          type: 'quote',
          text: 'La agricultura moderna no se trata solo de cosechar, sino de garantizar que cada fruto conserve su frescura, sabor y valor nutricional desde el surco hasta la mesa del consumidor.',
          author: 'Joaquín Vizcaíno Torres, CEO'
        },
        {
          type: 'image',
          url: '/images/zacatecas/_DSC3592.jpg',
          caption: 'Campos agrícolas de cultivo tecnificado en las fértiles tierras de Loreto, Zacatecas.'
        },
        {
          type: 'heading',
          content: 'Tecnología en Preenfriamiento y Cadena de Frío'
        },
        {
          type: 'paragraph',
          content: 'Uno de los pilares fundamentales que nos distingue en el mercado internacional es nuestra infraestructura de frío de última generación. A través de Vizcaino Services y nuestras instalaciones especializadas, logramos reducir drásticamente el tiempo entre la cosecha y el preenfriamiento, extendiendo la vida de anaquel de nuestras hortalizas y frutas.'
        },
        {
          type: 'gallery',
          images: [
            { url: '/images/sedis/sedis1.jpg', caption: 'Centro de Distribución y preenfriamiento' },
            { url: '/images/features/historia.jpg', caption: 'Cosecha seleccionada a mano' },
            { url: '/images/features/contacto.jpg', caption: 'Flotilla de transporte refrigerado' }
          ]
        },
        {
          type: 'heading',
          content: 'Certificaciones Internacionales de Calidad'
        },
        {
          type: 'paragraph',
          content: 'Nuestras operaciones cumplen con los más rigurosos estándares globales de inocuidad alimentaria y responsabilidad social. Respaldados por certificaciones de clase mundial como PrimusGFS y nuestra membresía activa en IFPA (International Fresh Produce Association).'
        },
        {
          type: 'logos',
          logos: [
            { url: '/images/logos/PrimusGFS_Logo_web.png', name: 'PrimusGFS Inocuidad' },
            { url: '/images/eventos/ifpa-proud-member.png', name: 'IFPA Member' },
            { url: '/images/logos/VizcainoFruits_Logo.png', name: 'Vizcaino Fruits' },
            { url: '/images/logos/VizcainoPremium_Logo_web.png', name: 'Vizcaino Premium' }
          ]
        }
      ]),
    },
    {
      slug: 'sustentabilidad-y-responsabilidad-social-en-el-campo',
      titulo_es: 'Sustentabilidad y Cuidado del Agua en la Agroexportación Moderna',
      titulo_en: 'Sustainability and Water Care in Modern Agro-exporting',
      titulo_de: 'Nachhaltigkeit und Wasserschutz im modernen Agrarexport',
      resumen_es: 'Conoce las iniciativas de riego por goteo tecnificado, paneles solares y programas de bienestar comunitario implementadas en todas nuestras unidades de producción.',
      resumen_en: 'Learn about the technified drip irrigation initiatives, solar panels, and community welfare programs implemented across all our production units.',
      resumen_de: 'Erfahren Sie mehr über die technisierten Tropfbewässerungsinitiativen, Solarmodule und Programme für das Wohlergehen der Gemeinschaft, die in allen unseren Produktionseinheiten umgesetzt werden.',
      portadaUrl: '/images/features/historia.jpg',
      categoria: 'Sostenibilidad',
      autor: 'Comité de Sustentabilidad GEC',
      autorCargo: 'Dirección Agrícola',
      destacado: false,
      publicado: true,
      vistas: 215,
      contenido_es: JSON.stringify([
        {
          type: 'paragraph',
          content: 'El cambio climático y la gestión eficiente de los recursos naturales exigen respuestas concretas y audaces. En Grupo Exportador del Campo hemos implementado sistemas de riego por goteo automatizado con sensores de humedad en suelo, reduciendo el consumo hídrico en más de un 35%.'
        },
        {
          type: 'quote',
          text: 'Cuidar la tierra hoy es la única garantía de que las futuras generaciones sigan cosechando prosperidad.',
          author: 'Filosofía Grupo Exportador del Campo'
        },
        {
          type: 'image',
          url: '/images/quienes/ceo.jpg',
          caption: 'Supervisión directa en campo con los más altos estándares ecológicos.'
        },
        {
          type: 'paragraph',
          content: 'Además del eje ambiental, el bienestar de nuestros colaboradores y sus familias es el corazón de nuestra operación. Ofrecemos condiciones laborales dignas, capacitación continua y acceso a servicios de salud para todo el equipo agrícola.'
        }
      ]),
    },
    {
      slug: 'expansion-mercados-norteamerica-ifpa-global-show',
      titulo_es: 'Presencia Internacional: GEC en la Feria Global de Productos Frescos (IFPA)',
      titulo_en: 'International Presence: GEC at the Global Produce & Floral Show (IFPA)',
      titulo_de: 'Internationale Präsenz: GEC auf der Global Produce & Floral Show (IFPA)',
      resumen_es: 'Grupo Exportador del Campo consolida su presencia comercial en Estados Unidos y Canadá con nuevas alianzas estratégicas para la temporada 2026.',
      resumen_en: 'Grupo Exportador del Campo consolidates its commercial presence in the United States and Canada with new strategic alliances for the 2026 season.',
      resumen_de: 'Grupo Exportador del Campo festigt seine kommerzielle Präsenz in den Vereinigten Staaten und Kanada mit neuen strategischen Allianzen für die Saison 2026.',
      portadaUrl: '/images/eventos/ifpa-proud-member.png',
      categoria: 'Eventos',
      autor: 'Equipo Comercial',
      autorCargo: 'Comercialización Internacional',
      destacado: false,
      publicado: true,
      vistas: 189,
      contenido_es: JSON.stringify([
        {
          type: 'paragraph',
          content: 'Como orgullosos miembros de la International Fresh Produce Association (IFPA), participamos activamente en los encuentros más relevantes de la industria hortofrutícola mundial, conectando directamente con compradores de retail y mayoristas en Norteamérica.'
        },
        {
          type: 'image',
          url: '/images/features/contacto.jpg',
          caption: 'Logística de exportación con entregas puntuales y trazabilidad total.'
        },
        {
          type: 'heading',
          content: 'Capacidad de Abasto Todo el Año'
        },
        {
          type: 'paragraph',
          content: 'Gracias a nuestras múltiples zonas de producción y centros de consolidación en Zacatecas, San Luis Potosí y la zona centro del país, garantizamos un abasto ininterrumpido con estándares de calidad prémium.'
        }
      ]),
    }
  ];

  for (const p of posts) {
    await prisma.blogPost.create({
      data: p
    });
  }

  console.log(`Successfully seeded ${posts.length} initial blog posts!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
