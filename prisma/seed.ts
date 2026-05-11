import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Admin user
  const email = process.env.ADMIN_EMAIL || 'admin@grupoexportadordelcampo.com'
  const rawPassword = process.env.ADMIN_PASSWORD || 'GEK2026admin!'
  const hash = await bcrypt.hash(rawPassword, 10)

  await prisma.adminUser.upsert({
    where: { email },
    update: {},
    create: {
      email,
      password: hash,
      nombre: 'Administrador GEK',
    },
  })
  console.log(`✅ AdminUser creado: ${email}`)

  // Divisiones principales
  const divisionHortalizas = await prisma.division.upsert({
    where: { id: 'div-hortalizas' },
    update: {},
    create: {
      id: 'div-hortalizas',
      nameEs: "Vizcaíno Fruit's",
      nameEn: "Vizcaíno Fruit's",
      nameDe: "Vizcaíno Fruit's",
      descriptionEs: 'Producción y exportación de hortalizas de calidad',
      descriptionEn: 'Production and export of quality vegetables',
      descriptionDe: 'Produktion und Export von Qualitätsgemüse',
    },
  })

  const divisionChiles = await prisma.division.upsert({
    where: { id: 'div-chiles' },
    update: {},
    create: {
      id: 'div-chiles',
      nameEs: 'Vizcaíno Premium',
      nameEn: 'Vizcaíno Premium',
      nameDe: 'Vizcaíno Premium',
      descriptionEs: 'Chiles picosos de alta calidad para mercados nacionales e internacionales',
      descriptionEn: 'High quality spicy peppers for domestic and international markets',
      descriptionDe: 'Hochwertige scharfe Chilis für nationale und internationale Märkte',
    },
  })

  const divisionServicios = await prisma.division.upsert({
    where: { id: 'div-servicios' },
    update: {},
    create: {
      id: 'div-servicios',
      nameEs: 'Vizcaíno Services',
      nameEn: 'Vizcaíno Services',
      nameDe: 'Vizcaíno Services',
      descriptionEs: 'Servicios de maquilado, refrigeración y logística',
      descriptionEn: 'Processing, refrigeration and logistics services',
      descriptionDe: 'Verarbeitungs-, Kühl- und Logistikdienstleistungen',
    },
  })
  console.log('✅ Divisiones creadas')

  // Unidades de negocio
  const unidades = [
    { id: 'un-001', nameEs: 'Campos de Producción', nameEn: 'Production Fields', nameDe: 'Produktionsfelder', location: 'Loreto, Zacatecas', orden: 1, divisionId: divisionHortalizas.id },
    { id: 'un-002', nameEs: 'Planta de Pre-enfriamiento', nameEn: 'Pre-cooling Plant', nameDe: 'Vorkühlanlage', location: 'Loreto, Zacatecas', orden: 2, divisionId: divisionHortalizas.id },
    { id: 'un-003', nameEs: 'Centro de Distribución', nameEn: 'Distribution Center', nameDe: 'Vertriebszentrum', location: 'San Nicolás de los Garza, NL', orden: 3, divisionId: divisionServicios.id },
    { id: 'un-004', nameEs: 'Bodega Mercado Abastos Estrella No.124', nameEn: 'Warehouse Abastos Estrella No.124', nameDe: 'Lagerhaus Abastos Estrella Nr.124', location: 'San Nicolás de los Garza, NL', orden: 4, divisionId: divisionServicios.id },
  ]

  for (const u of unidades) {
    await prisma.unidadNegocio.upsert({
      where: { id: u.id },
      update: {},
      create: u,
    })
  }
  console.log('✅ Unidades de negocio creadas')

  // Contenido del sitio
  const contenidos = [
    // HOME
    { id: 'home.hero.tagline', seccion: 'home', campo: 'Tagline del Hero', valor_es: 'Volumen que cumple, calidad que respalda.', valor_en: 'Volume that delivers, quality that backs it up.', valor_de: 'Volumen, der liefert – Qualität, die überzeugt.' },
    { id: 'home.hero.sub', seccion: 'home', campo: 'Subtítulo del Hero', valor_es: 'Grupo Exportador del Campo: Tradición, Calidad y Excelencia Agrícola', valor_en: 'Grupo Exportador del Campo: Tradition, Quality and Agricultural Excellence', valor_de: 'Grupo Exportador del Campo: Tradition, Qualität und landwirtschaftliche Exzellenz' },
    // QUIÉNES SOMOS
    { id: 'quienes.intro', seccion: 'quienes', campo: 'Texto de introducción', valor_es: 'Grupo Exportador del Campo nace a partir del modelo de negocio desarrollado por el Sr. Ramiro Vizcaíno para producir y comercializar hortalizas desde Loreto, Zacatecas. Desde hace más de 50 años, nos hemos comprometido contigo para ofrecerte lo mejor del campo a través de diversos servicios y productos. Estamos comprometidos de inicio a fin a brindar un soporte integral en cada una de nuestras unidades de negocio.', valor_en: 'Grupo Exportador del Campo was born from the business model developed by Mr. Ramiro Vizcaíno to produce and market vegetables from Loreto, Zacatecas. For more than 50 years, we have been committed to you to offer you the best of the field through various services and products. We are committed from start to finish to provide comprehensive support in each of our business units.', valor_de: null },
    { id: 'quienes.mision', seccion: 'quienes', campo: 'Misión', valor_es: 'Seguir la tradición de más de 3 generaciones de poner al alcance de los consumidores chiles y hortalizas de calidad, con alto valor agregado garantizando la máxima calidad del mercado.', valor_en: 'To continue the tradition of over 3 generations by providing consumers with quality peppers and vegetables, with high added value guaranteeing the highest quality in the market.', valor_de: null },
    { id: 'quienes.vision', seccion: 'quienes', campo: 'Visión', valor_es: 'Empresa de producción y comercialización de altos volúmenes en mercados nacionales y extranjeros, con calidad sanitaria certificada y con una trazabilidad que dé confianza al cliente final.', valor_en: 'A high-volume production and marketing company in domestic and foreign markets, with certified sanitary quality and traceability that gives confidence to the end customer.', valor_de: null },
    // VALORES
    { id: 'quienes.valor.honestidad', seccion: 'quienes', campo: 'Valor: Honestidad', valor_es: 'Siempre entregando lo mejor para nuestros clientes', valor_en: 'Always delivering the best to our clients', valor_de: null },
    { id: 'quienes.valor.compromiso', seccion: 'quienes', campo: 'Valor: Compromiso', valor_es: 'Dar lo mejor y cumplir para nuestros clientes', valor_en: 'Giving our best and fulfilling our clients needs', valor_de: null },
    { id: 'quienes.valor.humildad', seccion: 'quienes', campo: 'Valor: Humildad', valor_es: 'Siempre con respeto y humildad para atender a nuestros clientes', valor_en: 'Always serving our clients with respect and humility', valor_de: null },
    { id: 'quienes.valor.profesionalismo', seccion: 'quienes', campo: 'Valor: Profesionalismo', valor_es: 'Equipo de trabajo responsable en dar lo mejor', valor_en: 'A responsible team dedicated to giving its best', valor_de: null },
    { id: 'quienes.valor.lealtad', seccion: 'quienes', campo: 'Valor: Lealtad', valor_es: 'Respetando a nuestros clientes y el compromiso de entregar lo mejor', valor_en: 'Respecting our clients and our commitment to deliver the best', valor_de: null },
    { id: 'quienes.valor.transparencia', seccion: 'quienes', campo: 'Valor: Transparencia', valor_es: 'Cuentas claras, con un servicio completo de principio a fin', valor_en: 'Clear accounts, with comprehensive service from start to finish', valor_de: null },
    // HISTORIA
    { id: 'historia.origen.titulo', seccion: 'historia', campo: 'Título — sección origen', valor_es: 'El Origen', valor_en: 'The Origin', valor_de: null },
    { id: 'historia.origen.texto', seccion: 'historia', campo: 'Texto narrativo de origen', valor_es: 'Hace más de 50 años, el Sr. Ramiro Vizcaíno inició la producción en Loreto, Zacatecas. Desde entonces, hemos crecido expandiendo nuestros horizontes a mercados en todo México y Estados Unidos, marcando el camino para las siguientes generaciones.', valor_en: 'More than 50 years ago, Mr. Ramiro Vizcaíno started production in Loreto, Zacatecas. Since then, we have grown by expanding our horizons to markets throughout Mexico and the United States, paving the way for future generations.', valor_de: null },
    { id: 'historia.fundadores.texto', seccion: 'historia', campo: 'Texto sobre los fundadores', valor_es: 'Su legado es el cimiento de lo que hoy es Grupo Exportador del Campo', valor_en: 'Their legacy is the foundation of what Grupo Exportador del Campo is today', valor_de: null },
    // HOLDING
    { id: 'holding.intro', seccion: 'holding', campo: 'Introducción corporativa', valor_es: 'Grupo Exportador del Campo opera bajo una estructura corporativa sólida (similar a la estructura de FEMSA), organizada en unidades de negocio y divisiones estratégicas enfocadas en la excelencia, dirigida a instituciones y aliados comerciales.', valor_en: 'Grupo Exportador del Campo operates under a solid corporate structure (similar to FEMSA\'s structure), organized into business units and strategic divisions focused on excellence, aimed at institutions and commercial allies.', valor_de: null },
    { id: 'holding.organigrama.placeholder', seccion: 'holding', campo: 'Texto placeholder organigrama', valor_es: 'Estructura corporativa completa — En actualización', valor_en: 'Full corporate structure — Being updated', valor_de: null },
    // NUEVAS SECCIONES PASO 8
    { id: 'home.metrica1.numero', seccion: 'home', campo: 'Métrica 1: Número', valor_es: '+50', valor_en: null, valor_de: null },
    { id: 'home.metrica1.label', seccion: 'home', campo: 'Métrica 1: Label', valor_es: 'Años de experiencia', valor_en: null, valor_de: null },
    { id: 'home.metrica1.descripcion', seccion: 'home', campo: 'Métrica 1: Descripción', valor_es: 'Produciendo y exportando desde Zacatecas', valor_en: null, valor_de: null },
    { id: 'home.metrica2.numero', seccion: 'home', campo: 'Métrica 2: Número', valor_es: '25,000', valor_en: null, valor_de: null },
    { id: 'home.metrica2.label', seccion: 'home', campo: 'Métrica 2: Label', valor_es: 'Toneladas exportadas', valor_en: null, valor_de: null },
    { id: 'home.metrica2.descripcion', seccion: 'home', campo: 'Métrica 2: Descripción', valor_es: 'En mercados de México y Estados Unidos', valor_en: null, valor_de: null },
    { id: 'home.metrica3.numero', seccion: 'home', campo: 'Métrica 3: Número', valor_es: '+120', valor_en: null, valor_de: null },
    { id: 'home.metrica3.label', seccion: 'home', campo: 'Métrica 3: Label', valor_es: 'Colaboradores', valor_en: null, valor_de: null },
    { id: 'home.metrica3.descripcion', seccion: 'home', campo: 'Métrica 3: Descripción', valor_es: 'En nuestras unidades de negocio', valor_en: null, valor_de: null },
    { id: 'quienes.cadena.titulo', seccion: 'quienes', campo: 'Título cadena de suministro', valor_es: 'Control sobre la cadena de suministro completa', valor_en: null, valor_de: null },
    { id: 'quienes.cadena.subtitulo', seccion: 'quienes', campo: 'Subtítulo cadena de suministro', valor_es: '3 generaciones amando el campo', valor_en: null, valor_de: null },
    { id: 'holding.marca1.nombre', seccion: 'holding', campo: 'Marca 1: Nombre', valor_es: "Vizcaíno Fruit's", valor_en: null, valor_de: null },
    { id: 'holding.marca1.descripcion', seccion: 'holding', campo: 'Marca 1: Descripción', valor_es: 'Enfocada en la producción, comercialización y exportación de variedad de productos del campo, tanto frutas como verduras. Atendiendo mercado de México y Estados Unidos con más de 50 años de experiencia.', valor_en: null, valor_de: null },
    { id: 'holding.marca1.productos', seccion: 'holding', campo: 'Marca 1: Productos', valor_es: 'Lechugas: iceberg, italiana, orejona, sangría', valor_en: null, valor_de: null },
    { id: 'holding.marca2.nombre', seccion: 'holding', campo: 'Marca 2: Nombre', valor_es: 'Vizcaíno Premium', valor_en: null, valor_de: null },
    { id: 'holding.marca2.descripcion', seccion: 'holding', campo: 'Marca 2: Descripción', valor_es: 'Enfocada en la producción, comercialización y exportación de variedad de chiles: jalapeño, serrano, poblano, anaheim, húngaro y cebollas. Ofreciendo los productos en empacado a granel en caja plástica o enmallado.', valor_en: null, valor_de: null },
    { id: 'holding.marca2.productos', seccion: 'holding', campo: 'Marca 2: Productos', valor_es: 'Chiles: jalapeño, serrano, poblano, anaheim, húngaro y cebollas', valor_en: null, valor_de: null },
    { id: 'holding.marca3.nombre', seccion: 'holding', campo: 'Marca 3: Nombre', valor_es: 'Vizcaíno Services', valor_en: null, valor_de: null },
    { id: 'holding.marca3.descripcion', seccion: 'holding', campo: 'Marca 3: Descripción', valor_es: 'División dedicada al negocio de maquila de productos, refrigeración, almacenamiento y servicios logísticos para traslados de diferentes productos del campo.', valor_en: null, valor_de: null },
    { id: 'holding.marca3.productos', seccion: 'holding', campo: 'Marca 3: Productos', valor_es: 'Maquila, refrigeración, almacenamiento, logística', valor_en: null, valor_de: null },
  ]

  for (const c of contenidos) {
    await prisma.contenidoSitio.upsert({
      where: { id: c.id },
      update: { valor_es: c.valor_es, valor_en: c.valor_en ?? null, valor_de: c.valor_de ?? null },
      create: { id: c.id, seccion: c.seccion, campo: c.campo, valor_es: c.valor_es, valor_en: c.valor_en ?? null, valor_de: c.valor_de ?? null },
    })
  }
  console.log('✅ Contenido del sitio sembrado')

  console.log('\n✅ Seed completado — GEK CMS listo')
}

main().catch(console.error).finally(() => prisma.$disconnect())
