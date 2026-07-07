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
    update: {
      nameEs: "Vizcaíno Fruit's",
      nameEn: "Vizcaíno Fruit's",
      nameDe: "Vizcaíno Fruit's",
      descriptionEs: 'Producción y exportación de hortalizas de calidad',
      descriptionEn: 'Production and export of quality vegetables',
      descriptionDe: 'Produktion und Export von Qualitätsgemüse',
    },
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
    update: {
      nameEs: 'Vizcaíno Premium',
      nameEn: 'Vizcaíno Premium',
      nameDe: 'Vizcaíno Premium',
      descriptionEs: 'Chiles picosos de alta calidad para mercados nacionales e internacionales',
      descriptionEn: 'High quality spicy peppers for domestic and international markets',
      descriptionDe: 'Hochwertige scharfe Chilis für nationale und internationale Märkte',
    },
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
    update: {
      nameEs: 'Vizcaíno Services',
      nameEn: 'Vizcaíno Services',
      nameDe: 'Vizcaíno Services',
      descriptionEs: 'Servicios de maquilado, refrigeración y logística',
      descriptionEn: 'Processing, refrigeration and logistics services',
      descriptionDe: 'Verarbeitungs-, Kühl- und Logistikdienstleistungen',
    },
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
      update: { nameEs: u.nameEs, nameEn: u.nameEn, nameDe: u.nameDe, location: u.location, orden: u.orden, divisionId: u.divisionId },
      create: u,
    })
  }
  console.log('✅ Unidades de negocio creadas')

  // Contenido del sitio
  const contenidos = [
    // HOME
    { id: 'home.hero.tagline', seccion: 'home', campo: 'Tagline del Hero', valor_es: 'Porque aunque los tiempos cambien, somos y seremos GEC', valor_en: 'Because even if times change, we are and will be GEC', valor_de: 'Denn auch wenn sich die Zeiten ändern, wir sind und bleiben GEC' },
    { id: 'home.hero.sub', seccion: 'home', campo: 'Subtítulo del Hero', valor_es: 'Grupo Exportador del Campo: Tradición, Calidad y Excelencia Agrícola', valor_en: 'Grupo Exportador del Campo: Tradition, Quality and Agricultural Excellence', valor_de: 'Grupo Exportador del Campo: Tradition, Qualität und landwirtschaftliche Exzellenz' },
    { id: 'home.marcas_titulo', seccion: 'home', campo: 'Título Marcas', valor_es: 'Las Marcas que nos Representan', valor_en: 'The Brands That Represent Us', valor_de: 'Die Marken, die uns repräsentieren' },
    { id: 'home.metrica1.numero', seccion: 'home', campo: 'Métrica 1: Número', valor_es: '+50', valor_en: '+50', valor_de: '+50' },
    { id: 'home.metrica1.label', seccion: 'home', campo: 'Métrica 1: Label', valor_es: 'Años de experiencia', valor_en: 'Years of experience', valor_de: 'Jahre Erfahrung' },
    { id: 'home.metrica1.descripcion', seccion: 'home', campo: 'Métrica 1: Descripción', valor_es: 'En producción y comercialización del campo.', valor_en: 'In field production and marketing.', valor_de: 'In der landwirtschaftlichen Produktion und Vermarktung.' },
    { id: 'home.metrica2.numero', seccion: 'home', campo: 'Métrica 2: Número', valor_es: '+30,000', valor_en: '+30,000', valor_de: '+30.000' },
    { id: 'home.metrica2.label', seccion: 'home', campo: 'Métrica 2: Label', valor_es: 'Toneladas exportadas al año', valor_en: 'Tons exported per year', valor_de: 'Exportierte Tonnen pro Jahr' },
    { id: 'home.metrica2.descripcion', seccion: 'home', campo: 'Métrica 2: Descripción', valor_es: 'En mercados alrededor del mundo', valor_en: 'In markets around the world', valor_de: 'In Märkten auf der ganzen Welt' },
    { id: 'home.metrica3.numero', seccion: 'home', campo: 'Métrica 3: Número', valor_es: '+200', valor_en: '+200', valor_de: '+200' },
    { id: 'home.metrica3.label', seccion: 'home', campo: 'Métrica 3: Label', valor_es: 'Colaboradores', valor_en: 'Collaborators', valor_de: 'Mitarbeiter' },
    { id: 'home.metrica3.descripcion', seccion: 'home', campo: 'Métrica 3: Descripción', valor_es: 'Repartidos en nuestras unidades de negocio.', valor_en: 'Spread across our business units.', valor_de: 'Verteilt auf unsere Geschäftseinheiten.' },
    { id: 'home.metrica4.numero', seccion: 'home', campo: 'Métrica 4: Número', valor_es: '+400', valor_en: '+400', valor_de: '+400' },
    { id: 'home.metrica4.label', seccion: 'home', campo: 'Métrica 4: Label', valor_es: 'Hectáreas de superficie', valor_en: 'Hectares of surface area', valor_de: 'Hektar Anbaufläche' },
    { id: 'home.metrica4.descripcion', seccion: 'home', campo: 'Métrica 4: Descripción', valor_es: 'Listas para la producción bajo normativas de inocuidad', valor_en: 'Ready for production under safety regulations', valor_de: 'Bereit für die Produktion unter Sicherheitsvorschriften' },

    { id: 'features.quienes.imagen', seccion: 'home', campo: 'Imagen: Quiénes Somos', valor_es: '/images/features/quienes.jpg', valor_en: '/images/features/quienes.jpg', valor_de: '/images/features/quienes.jpg' },
    { id: 'features.quienes.label', seccion: 'home', campo: 'Título Card: Quiénes Somos', valor_es: 'Quiénes Somos', valor_en: 'Who We Are', valor_de: 'Über Uns' },
    { id: 'features.quienes.desc', seccion: 'home', campo: 'Descripción Card: Quiénes Somos', valor_es: 'Velamos por el campo desde hace cincuenta años y seguimos apuntando alto', valor_en: 'We look after the fields for fifty years and we keep aiming high', valor_de: 'Wir kümmern uns seit fünfzig Jahren um die Felder und setzen uns weiterhin hohe Ziele' },
    
    { id: 'features.historia.imagen', seccion: 'home', campo: 'Imagen: Historia', valor_es: '/images/features/historia.jpg', valor_en: '/images/features/historia.jpg', valor_de: '/images/features/historia.jpg' },
    { id: 'features.historia.label', seccion: 'home', campo: 'Título Card: Historia', valor_es: 'Historia', valor_en: 'History', valor_de: 'Geschichte' },
    { id: 'features.historia.desc', seccion: 'home', campo: 'Descripción Card: Historia', valor_es: 'Porque somos más que una operación, somos un legado', valor_en: 'Because we are more than an operation, we are a legacy', valor_de: 'Weil wir mehr als ein Betrieb sind, sind wir ein Erbe' },
    
    { id: 'features.holding.imagen', seccion: 'home', campo: 'Imagen: Holding', valor_es: '/images/features/holding.jpg', valor_en: '/images/features/holding.jpg', valor_de: '/images/features/holding.jpg' },
    { id: 'features.holding.label', seccion: 'home', campo: 'Título Card: Holding', valor_es: 'Holding', valor_en: 'Holding', valor_de: 'Holding' },
    { id: 'features.holding.desc', seccion: 'home', campo: 'Descripción Card: Holding', valor_es: 'Nuestra estructura corporativa y unidades de negocio', valor_en: 'Our corporate structure and business units', valor_de: 'Unsere Unternehmensstruktur und Geschäftsbereiche' },
    
    { id: 'features.contacto.imagen', seccion: 'home', campo: 'Imagen: Contacto', valor_es: '/images/features/contacto.jpg', valor_en: '/images/features/contacto.jpg', valor_de: '/images/features/contacto.jpg' },
    { id: 'features.contacto.label', seccion: 'home', campo: 'Título Card: Contacto', valor_es: 'Contacto', valor_en: 'Contact', valor_de: 'Kontakt' },
    { id: 'features.contacto.desc', seccion: 'home', campo: 'Descripción Card: Contacto', valor_es: 'Proveedores, clientes y alianzas estratégicas', valor_en: 'Suppliers, clients and strategic alliances', valor_de: 'Lieferanten, Kunden und strategische Allianzen' },
    
    // QUIÉNES SOMOS
    { id: 'quienes.intro', seccion: 'quienes', campo: 'Texto de introducción', valor_es: '<strong>Grupo Exportador del Campo</strong> nace del modelo de negocio desarrollado por Don Ramiro Vizcaíno, para la <strong>producción, tratamiento, empaque y comercialización</strong> de todo tipo de productos del campo. Con más de <strong>50 años de experiencia</strong>, nos comprometemos contigo para ofrecer <strong>lo mejor del campo</strong>, brindándote un <strong>soporte integral</strong> en cada una de nuestras unidades de negocio, de inicio a fin.', valor_en: '<strong>Grupo Exportador del Campo</strong> was born from the business model developed by Don Ramiro Vizcaíno, for the <strong>production, processing, packaging and commercialization</strong> of all types of field products. With more than <strong>50 years of experience</strong>, we are committed to offering you <strong>the best of the field</strong>, providing <strong>comprehensive support</strong> across each of our business units, from start to finish.', valor_de: '<strong>Grupo Exportador del Campo</strong> entstand aus dem Geschäftsmodell von Don Ramiro Vizcaíno für die <strong>Produktion, Verarbeitung, Verpackung und Vermarktung</strong> aller Art von Feldprodukten. Mit mehr als <strong>50 Jahren Erfahrung</strong> verpflichten wir uns, Ihnen <strong>das Beste vom Feld</strong> anzubieten und <strong>umfassenden Support</strong> in jeder unserer Geschäftseinheiten zu bieten.' },
    { id: 'quienes.cadena.titulo', seccion: 'quienes', campo: 'Título cadena de suministro', valor_es: 'Control sobre la cadena de suministro completa', valor_en: 'Complete supply chain control', valor_de: 'Vollständige Kontrolle der Lieferkette' },
    { id: 'quienes.cadena.subtitulo', seccion: 'quienes', campo: 'Subtítulo cadena de suministro', valor_es: '3 generaciones amando el campo', valor_en: '3 generations loving the field', valor_de: '3 Generationen mit Leidenschaft für das Feld' },
    { id: 'quienes.divisiones.titulo', seccion: 'quienes', campo: 'Título sección divisiones', valor_es: 'Nuestras <span class="text-brand-green">divisiones</span>', valor_en: 'Our <span class="text-brand-green">divisions</span>', valor_de: 'Unsere <span class="text-brand-green">Bereiche</span>' },
    { id: 'quienes.divisiones.subtitulo', seccion: 'quienes', campo: 'Subtítulo sección divisiones', valor_es: 'Operamos desde el campo hasta el cliente final con control total de la cadena de valor.', valor_en: 'We operate from the field to the end customer with full control of the value chain.', valor_de: 'Wir operieren vom Feld bis zum Endkunden mit vollständiger Kontrolle über die Wertschöpfungskette.' },
    { id: 'quienes.division.campo', seccion: 'quienes', campo: 'Descripción División Campo', valor_es: 'Producción, tratamiento, empaque y comercialización de hortalizas y productos del campo desde Loreto, Zacatecas. Controlamos cada etapa del proceso para garantizar calidad y trazabilidad de inicio a fin.', valor_en: 'Production, processing, packaging and commercialization of vegetables and field products from Loreto, Zacatecas. We control every step of the process to ensure quality and traceability from start to finish.', valor_de: 'Produktion, Verarbeitung, Verpackung und Vermarktung von Gemüse und Feldprodukten aus Loreto, Zacatecas. Wir kontrollieren jeden Schritt des Prozesses, um Qualität und Rückverfolgbarkeit von Anfang bis Ende zu gewährleisten.' },
    { id: 'quienes.division.sedis', seccion: 'quienes', campo: 'Descripción División Sedis', valor_es: 'Centro de distribución y comercialización estratégicamente ubicado en San Nicolás de los Garza, NL. Desde aquí coordinamos la entrega de nuestros productos al cliente final con eficiencia y rapidez.', valor_en: 'Distribution and commercialization center strategically located in San Nicolás de los Garza, NL. From here we coordinate product delivery to the end customer with efficiency and speed.', valor_de: 'Distributions- und Vermarktungszentrum strategisch gelegen in San Nicolás de los Garza, NL. Von hier aus koordinieren wir die Produktlieferung an den Endkunden mit Effizienz und Schnelligkeit.' },
    { id: 'quienes.mision', seccion: 'quienes', campo: 'Misión', valor_es: 'Seguir la tradición de más de 3 generaciones de poner al alcance de los consumidores chiles y hortalizas de calidad, con alto valor agregado garantizando la máxima calidad del mercado.', valor_en: 'To continue the tradition of over 3 generations of making quality chiles and vegetables available to consumers, with high added value, guaranteeing the highest market quality.', valor_de: 'Die Tradition von über 3 Generationen fortzuführen, Verbrauchern qualitativ hochwertige Chilis und Gemüse mit hohem Mehrwert bereitzustellen und dabei höchste Marktqualität zu garantieren.' },
    { id: 'quienes.vision', seccion: 'quienes', campo: 'Visión', valor_es: 'Empresa de producción y comercialización de altos volúmenes en mercados nacionales y extranjeros, con calidad sanitaria certificada y con una trazabilidad que dé confianza al cliente final.', valor_en: 'To be a company for the production and commercialization of high volumes in national and foreign markets, offering a variety of fresh field products, mainly chiles and vegetables, with certified sanitary quality and traceability that instills confidence in the end customer.', valor_de: 'Ein Unternehmen für die Produktion und Vermarktung hoher Mengen auf nationalen und ausländischen Märkten zu sein, das eine Vielzahl frischer Feldprodukte, hauptsächlich Chilis und Gemüse, mit zertifizierter Hygienequalität und Rückverfolgbarkeit anbietet, die dem Endkunden Vertrauen einflößt.' },
    
    // VALORES
    { id: 'quienes.valor.honestidad', seccion: 'quienes', campo: 'Valor: Honestidad', valor_es: 'Siempre entregando lo mejor para nuestros clientes', valor_en: 'Always delivering the best for our clients.', valor_de: 'Stets das Beste für unsere Kunden liefern.' },
    { id: 'quienes.valor.compromiso', seccion: 'quienes', campo: 'Valor: Compromiso', valor_es: 'Dar lo mejor y cumplir para nuestros clientes', valor_en: 'Giving our best and fulfilling our commitments to our clients.', valor_de: 'Unser Bestes geben und unsere Verpflichtungen gegenüber unseren Kunden erfüllen.' },
    { id: 'quienes.valor.humildad', seccion: 'quienes', campo: 'Valor: Humildad', valor_es: 'Siempre con respeto y humildad para atender a nuestros clientes', valor_en: 'Always with respect and humility in serving our clients.', valor_de: 'Stets mit Respekt und Bescheidenheit unseren Kunden gegenüber.' },
    { id: 'quienes.valor.profesionalismo', seccion: 'quienes', campo: 'Valor: Profesionalismo', valor_es: 'Equipo de trabajo responsable en dar lo mejor', valor_en: 'A responsible work team dedicated to delivering the best for our clients.', valor_de: 'Ein verantwortungsvolles Arbeitsteam, das sich dem Besten für unsere Kunden widmet.' },
    { id: 'quienes.valor.lealtad', seccion: 'quienes', campo: 'Valor: Lealtad', valor_es: 'Respetando a nuestros clientes y el compromiso de entregar lo mejor', valor_en: 'Respecting our clients and honoring our commitment to always deliver the best.', valor_de: 'Unsere Kunden respektieren und unser Engagement für das Beste aufrechterhalten.' },
    { id: 'quienes.valor.transparencia', seccion: 'quienes', campo: 'Valor: Transparencia', valor_es: 'Cuentas claras, con un servicio completo de principio a fin', valor_en: 'Clear accounts, with complete service from start to finish.', valor_de: 'Klare Abrechnungen mit vollständigem Service von Anfang bis Ende.' },
    
    // QUIÉNES SOMOS — secciones adicionales
    { id: 'quienes.campo.titulo', seccion: 'quienes', campo: 'Título sección procesos campo', valor_es: '¿Qué nos mueve? El campo.', valor_en: 'What drives us? The field.', valor_de: 'Was treibt uns an? Das Feld.' },
    { id: 'quienes.campo.subtitulo', seccion: 'quienes', campo: 'Subtítulo sección procesos campo', valor_es: 'Un vistazo a nuestros procesos en las unidades de Ranchos de Producción y Planta de Pre Enfriamiento', valor_en: 'A look at our processes in the Production Ranches and Pre-Cooling Plant units', valor_de: 'Ein Blick auf unsere Prozesse in den Einheiten Produktionsranches und Vorkühlanlage' },
    { id: 'quienes.cedis.titulo', seccion: 'quienes', campo: 'Título sección procesos CEDIS', valor_es: '¿A dónde llegamos? A ti.', valor_en: 'Where do we arrive? To you.', valor_de: 'Wo kommen wir an? Bei Ihnen.' },
    { id: 'quienes.cedis.subtitulo', seccion: 'quienes', campo: 'Subtítulo sección procesos CEDIS', valor_es: 'Un vistazo a nuestros procesos de desinfección, clasificación, empaque y preparación logística en nuestro CEDIS.', valor_en: 'A look at our disinfection, classification, packaging and logistics preparation processes at our CEDIS.', valor_de: 'Ein Blick auf unsere Prozesse zur Desinfektion, Klassifizierung, Verpackung und logistischen Vorbereitung in unserem CEDIS.' },

    // QUIÉNES SOMOS — imágenes
    { id: 'quienes.franja.imagen', seccion: 'quienes', campo: 'Franja inicio (encabezado)', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.ceo.imagen', seccion: 'quienes', campo: 'Foto CEO — Director General', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.ecosistema.mision.imagen', seccion: 'quienes', campo: 'Ecosistema GEC — Panel Misión', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.ecosistema.vision.imagen', seccion: 'quienes', campo: 'Ecosistema GEC — Panel Visión', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.ecosistema.valores.imagen', seccion: 'quienes', campo: 'Ecosistema GEC — Panel Valores', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.cedis.ficha1.imagen', seccion: 'quienes', campo: 'CEDIS — Ficha 1: Desinfección y Clasificación', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.cedis.ficha2.imagen', seccion: 'quienes', campo: 'CEDIS — Ficha 2: Empaque', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.cedis.ficha3.imagen', seccion: 'quienes', campo: 'CEDIS — Ficha 3: Preparación Logística', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.cedis.ficha4.imagen', seccion: 'quienes', campo: 'CEDIS — Ficha 4: Distribución', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.division.campo.imagen', seccion: 'quienes', campo: 'División Campo — foto principal', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'quienes.division.sedis.imagen', seccion: 'quienes', campo: 'División Sedis — foto principal', valor_es: '', valor_en: '', valor_de: '' },
    
    // CAPITAL HUMANO STATS
    { id: 'quienes.capital.stat1.numero', seccion: 'quienes', campo: 'Capital Humano: Stat 1 Número', valor_es: '+200', valor_en: '+200', valor_de: '+200' },
    { id: 'quienes.capital.stat1.label', seccion: 'quienes', campo: 'Capital Humano: Stat 1 Etiqueta', valor_es: 'Colaboradores', valor_en: 'Collaborators', valor_de: 'Mitarbeiter' },
    { id: 'quienes.capital.stat2.numero', seccion: 'quienes', campo: 'Capital Humano: Stat 2 Número', valor_es: 'Décadas', valor_en: 'Decades', valor_de: 'Jahrzehnte' },
    { id: 'quienes.capital.stat2.label', seccion: 'quienes', campo: 'Capital Humano: Stat 2 Etiqueta', valor_es: 'De experiencia agrícola', valor_en: 'Of agricultural experience', valor_de: 'Landwirtschaftliche Erfahrung' },
    { id: 'quienes.capital.stat3.numero', seccion: 'quienes', campo: 'Capital Humano: Stat 3 Número', valor_es: 'Múltiples', valor_en: 'Multiple', valor_de: 'Mehrere' },
    { id: 'quienes.capital.stat3.label', seccion: 'quienes', campo: 'Capital Humano: Stat 3 Etiqueta', valor_es: 'Regiones de operación', valor_en: 'Regions of operation', valor_de: 'Betriebsregionen' },
    { id: 'quienes.capital.stat4.numero', seccion: 'quienes', campo: 'Capital Humano: Stat 4 Número', valor_es: 'Coordinado', valor_en: 'Coordinated', valor_de: 'Koordiniert' },
    { id: 'quienes.capital.stat4.label', seccion: 'quienes', campo: 'Capital Humano: Stat 4 Etiqueta', valor_es: 'Trabajo en cada etapa', valor_en: 'Work at every stage', valor_de: 'Arbeit in jeder Phase' },

    // HISTORIA
    { id: 'historia.origen.titulo', seccion: 'historia', campo: 'Título — sección origen', valor_es: 'El Origen', valor_en: 'Our Origins', valor_de: 'Unsere Ursprünge' },
    { id: 'historia.origen.texto', seccion: 'historia', campo: 'Texto narrativo de origen', valor_es: 'Hace más de 50 años, en las áridas pero fértiles tierras de Loreto Zacatecas, nuestro fundador Don Ramiro Vizcaíno tomó las riendas de un proyecto que marcaría el camino de tres generaciones. Desde entonces, hemos crecido expandiendo nuestros horizontes a mercados en todo México y Estados Unidos, marcando el camino para las siguientes generaciones.', valor_en: 'More than 50 years ago, in the arid but fertile lands of Loreto Zacatecas, our founder Don Ramiro Vizcaíno took the reins of a project that would mark the path of three generations. Since then, we have grown by expanding our horizons to markets throughout Mexico and the United States, paving the way for the next generations.', valor_de: 'Vor mehr als 50 Jahren, in den kargen, aber fruchtbaren Böden von Loreto Zacatecas, übernahm unser Gründer Don Ramiro Vizcaíno die Zügel eines Projekts, das den Weg dreier Generationen prägen sollte. Seitdem sind wir gewachsen und haben unsere Horizonte auf Märkte in ganz Mexiko und den USA ausgedehnt.' },
    { id: 'historia.fundadores.texto', seccion: 'historia', campo: 'Texto sobre los fundadores', valor_es: 'Su legado es el cimiento de lo que hoy es Grupo Exportador del Campo', valor_en: 'Their legacy is the foundation of what Grupo Exportador del Campo is today.', valor_de: 'Ihr Vermächtnis ist das Fundament dessen, was Grupo Exportador del Campo heute ist.' },
    
    // HOLDING
    { id: 'holding.intro', seccion: 'holding', campo: 'Introducción corporativa', valor_es: 'Grupo Exportador del Campo opera bajo una estructura corporativa sólida (similar a la estructura de FEMSA), organizada en unidades de negocio y divisiones estratégicas enfocadas en la excelencia, dirigida a instituciones y aliados comerciales.', valor_en: 'Grupo Exportador del Campo is structured as a holding company with specialized business units, designed to provide comprehensive coverage of the agri-food supply chain. Our corporate structure is oriented toward institutional boards and strategic alliances.', valor_de: 'Grupo Exportador del Campo ist als Holdinggesellschaft mit spezialisierten Geschäftseinheiten strukturiert und bietet eine umfassende Abdeckung der agrarischen Lieferkette. Unsere Unternehmensstruktur ist auf institutionelle Vorstände und strategische Allianzen ausgerichtet.' },
    { id: 'holding.organigrama.placeholder', seccion: 'holding', campo: 'Texto placeholder organigrama', valor_es: 'Estructura corporativa completa — En actualización', valor_en: 'Complete corporate structure — Being updated', valor_de: 'Vollständige Unternehmensstruktur — Wird aktualisiert' },
    { id: 'holding.marca1.nombre', seccion: 'holding', campo: 'Marca 1: Nombre', valor_es: "Vizcaíno Fruit's", valor_en: "Vizcaíno Fruit's", valor_de: "Vizcaíno Fruit's" },
    { id: 'holding.marca1.descripcion', seccion: 'holding', campo: 'Marca 1: Descripción', valor_es: 'Enfocada en la producción, comercialización y exportación de variedad de productos del campo, tanto frutas como verduras. Atendiendo mercado de México y Estados Unidos con más de 50 años de experiencia.', valor_en: 'Focused on the production, commercialization and export of a variety of field products, including fruits and vegetables. Serving markets in Mexico and the United States with over 50 years of experience.', valor_de: 'Schwerpunkt auf Produktion, Vermarktung und Export einer Vielzahl von Feldprodukten, einschließlich Obst und Gemüse. Mit über 50 Jahren Erfahrung bedienen wir Märkte in Mexiko und den Vereinigten Staaten.' },
    { id: 'holding.marca1.productos', seccion: 'holding', campo: 'Marca 1: Productos', valor_es: 'Lechugas: iceberg, italiana, orejona, sangría', valor_en: 'Lettuces: iceberg, Italian, romaine, red leaf', valor_de: 'Salate: Eisberg, Italienisch, Romana, Roter Lollo' },
    { id: 'holding.marca2.nombre', seccion: 'holding', campo: 'Marca 2: Nombre', valor_es: 'Vizcaíno Premium', valor_en: 'Vizcaíno Premium', valor_de: 'Vizcaíno Premium' },
    { id: 'holding.marca2.descripcion', seccion: 'holding', campo: 'Marca 2: Descripción', valor_es: 'Enfocada en la producción, comercialización y exportación de variedad de chiles: jalapeño, serrano, poblano, anaheim, húngaro y cebollas. Ofreciendo los productos en empacado a granel en caja plástica o enmallado.', valor_en: 'Focused on the production, commercialization and export of a variety of chiles: jalapeño, serrano, poblano, anaheim, Hungarian and onions. Offering products in bulk packaging in plastic boxes or mesh bags.', valor_de: 'Schwerpunkt auf Produktion, Vermarktung und Export verschiedener Chilisorten: Jalapeño, Serrano, Poblano, Anaheim, Ungarisch und Zwiebeln. Angebot der Produkte in Großverpackungen in Kunststoffboxen oder Netzsäcken.' },
    { id: 'holding.marca2.productos', seccion: 'holding', campo: 'Marca 2: Productos', valor_es: 'Chiles: jalapeño, serrano, poblano, anaheim, húngaro y cebollas', valor_en: 'Chiles: jalapeño, serrano, poblano, anaheim, Hungarian and onions', valor_de: 'Chilis: Jalapeño, Serrano, Poblano, Anaheim, Ungarisch und Zwiebeln' },
    { id: 'holding.marca3.nombre', seccion: 'holding', campo: 'Marca 3: Nombre', valor_es: 'Vizcaíno Services', valor_en: 'Vizcaíno Services', valor_de: 'Vizcaíno Services' },
    { id: 'holding.marca3.descripcion', seccion: 'holding', campo: 'Marca 3: Descripción', valor_es: 'División dedicada al negocio de maquila de productos, refrigeración, almacenamiento y servicios logísticos para traslados de diferentes productos del campo.', valor_en: 'Division dedicated to product maquiladora services, refrigeration, storage and logistics services for the transport of various field products.', valor_de: 'Abteilung für Maquiladora-Dienstleistungen, Kühlung, Lagerung und Logistikdienstleistungen für den Transport verschiedener Feldprodukte.' },
    { id: 'holding.marca3.productos', seccion: 'holding', campo: 'Marca 3: Productos', valor_es: 'Maquila, refrigeración, almacenamiento, logística', valor_en: 'Maquiladora, refrigeration, storage, logistics', valor_de: 'Maquiladora, Kühlung, Lagerung, Logistik' },

    // HERO IMAGES FOR PAGES
    { id: 'quienes.hero.imagen', seccion: 'quienes', campo: 'Hero Imagen', valor_es: '/images/quienes/franja-inicio.jpg', valor_en: '/images/quienes/franja-inicio.jpg', valor_de: '/images/quienes/franja-inicio.jpg' },
    { id: 'historia.hero.imagen', seccion: 'historia', campo: 'Hero Imagen', valor_es: '/images/historia/franja-inicio.jpg', valor_en: '/images/historia/franja-inicio.jpg', valor_de: '/images/historia/franja-inicio.jpg' },
    { id: 'holding.hero.imagen', seccion: 'holding', campo: 'Hero Imagen', valor_es: '/images/features/holding.jpg', valor_en: '/images/features/holding.jpg', valor_de: '/images/features/holding.jpg' },
    { id: 'contacto.hero.imagen', seccion: 'contacto', campo: 'Hero Imagen', valor_es: '/images/features/contacto.jpg', valor_en: '/images/features/contacto.jpg', valor_de: '/images/features/contacto.jpg' }
  ]

  for (const c of contenidos) {
    await prisma.contenidoSitio.upsert({
      where: { id: c.id },
      update: { valor_es: c.valor_es, valor_en: c.valor_en, valor_de: c.valor_de },
      create: { id: c.id, seccion: c.seccion, campo: c.campo, valor_es: c.valor_es, valor_en: c.valor_en, valor_de: c.valor_de },
    })
  }
  console.log('✅ Contenido del sitio sembrado')

  // Sembrar Evento de prueba
  await prisma.evento.upsert({
    where: { id: 'evt-mexico-conf' },
    update: {
      titulo: 'The Mexico Conference',
      descripcion: 'El único evento en México dedicado a toda la cadena de suministro de productos frescos.',
      fecha: 'Mayo 13-14, 2026',
      lugar: 'Guadalajara, México',
      industria: 'Produce fresco',
      url: 'https://www.freshproduce.com',
      imagenUrl: '/images/eventos/mexico-conf.png',
      activo: true,
    },
    create: {
      id: 'evt-mexico-conf',
      titulo: 'The Mexico Conference',
      descripcion: 'El único evento en México dedicado a toda la cadena de suministro de productos frescos.',
      fecha: 'Mayo 13-14, 2026',
      lugar: 'Guadalajara, México',
      industria: 'Produce fresco',
      url: 'https://www.freshproduce.com',
      imagenUrl: '/images/eventos/mexico-conf.png',
      activo: true,
    }
  })
  console.log('✅ Evento inicial sembrado')

  console.log('\n✅ Seed completado — GEK CMS listo')
}

main().catch(console.error).finally(() => prisma.$disconnect())
