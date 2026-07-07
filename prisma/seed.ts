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
    { id: 'historia.slideshow.titulo', seccion: 'historia', campo: 'Título de la presentación', valor_es: 'Nuestro Legado', valor_en: 'Our Legacy', valor_de: 'Unser Erbe' },
    { id: 'historia.slide1.subtitulo', seccion: 'historia', campo: 'Slide 1: Subtítulo', valor_es: 'Primera Generación', valor_en: 'First Generation', valor_de: 'Erste Generation' },
    { id: 'historia.slide1.pie', seccion: 'historia', campo: 'Slide 1: Pie de imagen', valor_es: 'Nacidos en Zacatecas', valor_en: 'Born in Zacatecas', valor_de: 'Geboren in Zacatecas' },
    { id: 'historia.slide1.texto', seccion: 'historia', campo: 'Slide 1: Texto', valor_es: 'Hace más de 50 años, en las fértiles tierras de Zacatecas, nuestro fundador Don Ramiro Vizcaíno tomó las riendas de un proyecto que marcaría el camino de tres generaciones comprometidas a trabajar el campo.\n\nY la historia comenzó desde el municipio de Loreto.', valor_en: 'More than 50 years ago, in the fertile lands of Zacatecas, our founder Don Ramiro Vizcaíno took the reins of a project that would mark the path of three generations committed to working the fields.\n\nAnd the story began in the municipality of Loreto.', valor_de: 'Vor mehr als 50 Jahren übernahm unser Gründer Don Ramiro Vizcaíno in den fruchtbaren Böden von Zacatecas die Zügel eines Projekts, das den Weg dreier Generationen prägen sollte, die sich der Arbeit auf den Feldern verschrieben haben.\n\nUnd die Geschichte begann in der Gemeinde Loreto.' },
    { id: 'historia.slide1.imagen', seccion: 'historia', campo: 'Slide 1: Imagen', valor_es: '/images/zacatecas/_DSC3592.jpg', valor_en: '/images/zacatecas/_DSC3592.jpg', valor_de: '/images/zacatecas/_DSC3592.jpg' },
    { id: 'historia.slide2.subtitulo', seccion: 'historia', campo: 'Slide 2: Subtítulo', valor_es: 'Segunda Generación', valor_en: 'Second Generation', valor_de: 'Zweite Generation' },
    { id: 'historia.slide2.pie', seccion: 'historia', campo: 'Slide 2: Pie de imagen', valor_es: 'Crecidos en México', valor_en: 'Grown in Mexico', valor_de: 'Aufgewachsen in Mexiko' },
    { id: 'historia.slide2.texto', seccion: 'historia', campo: 'Slide 2: Texto', valor_es: 'La segunda generación llevó la operation fuera de Zacatecas, a expandir nuestras operaciones y puntos de venta por el país. Entrando a cadenas de retail y realizando nuestras primeras exportaciones.', valor_en: 'The second generation took the operation outside Zacatecas, expanding our operations and points of sale throughout the country. Entering retail chains and making our first exports.', valor_de: 'Die zweite Generation führte den Betrieb über Zacatecas hinaus und weitete unsere Aktivitäten und Verkaufsstellen im ganzen Land aus. Eintritt in Einzelhandelsketten und Durchführung unserer ersten Exporte.' },
    { id: 'historia.slide2.imagen', seccion: 'historia', campo: 'Slide 2: Imagen', valor_es: '/images/sedis/sedis1.jpg', valor_en: '/images/sedis/sedis1.jpg', valor_de: '/images/sedis/sedis1.jpg' },
    { id: 'historia.slide3.subtitulo', seccion: 'historia', campo: 'Slide 3: Subtítulo', valor_es: 'Tercera Generación', valor_en: 'Third Generation', valor_de: 'Dritte Generation' },
    { id: 'historia.slide3.pie', seccion: 'historia', campo: 'Slide 3: Pie de imagen', valor_es: 'Listos para el Mundo', valor_en: 'Ready for the World', valor_de: 'Bereit für die Welt' },
    { id: 'historia.slide3.texto', seccion: 'historia', campo: 'Slide 3: Texto', valor_es: 'En la actualidad, la tercera generación ha incursionado en un proceso de institucionalización; instaurando procesos, estructuración sólida, nuevas unidades de negocio y mayor responsabilidad social.\n\nPara seguir llevando una probadita de México al mundo entero.', valor_en: 'Today, the third generation has entered a process of institutionalization; establishing processes, solid structuring, new business units and greater social responsibility.\n\nTo continue bringing a taste of Mexico to the entire world.', valor_de: 'Heute hat die dritte Generation einen Prozess der Institutionalisierung eingeleitet; Etablierung von Prozessen, solide Strukturierung, neue Geschäftsbereiche und stärkere soziale Verantwortung.\n\nUm weiterhin ein Stück Mexiko in die ganze Welt zu tragen.' },
    { id: 'historia.slide3.imagen', seccion: 'historia', campo: 'Slide 3: Imagen', valor_es: '/images/features/quienes.jpg', valor_en: '/images/features/quienes.jpg', valor_de: '/images/features/quienes.jpg' },
    { id: 'historia.fundadores.titulo', seccion: 'historia', campo: 'Fundadores: Título principal', valor_es: 'Fundadores', valor_en: 'Founders', valor_de: 'Gründer' },
    { id: 'historia.fundadores.subtitulo', seccion: 'historia', campo: 'Fundadores: Subtítulo', valor_es: 'Tres generaciones después', valor_en: 'Three generations later', valor_de: 'Drei Generationen später' },
    { id: 'historia.fundadores.texto', seccion: 'historia', campo: 'Fundadores: Descripción', valor_es: 'Lo que comenzó como un proyecto familiar dedicado al transporte y comercialización agrícola, hoy integra producción, preenfriamiento, distribución y exportación. Cada paso de este camino tiene su origen en los valores y la visión de quienes iniciaron esta historia.', valor_en: 'What started as a family project dedicated to agricultural transport and commercialization, today integrates production, pre-cooling, distribution and export. Each step of this road has its origin in the values and vision of those who started this story.', valor_de: 'Was als Familienprojekt begann, das dem landwirtschaftlichen Transport und der Vermarktung gewidmet war, integriert heute Produktion, Vorkühlung, Vertrieb und Export. Jeder Schritt auf diesem Weg hat seinen Ursprung in den Werten und der Vision derer, die diese Geschichte begonnen haben.' },
    { id: 'historia.fundadores.imagen', seccion: 'historia', campo: 'Fundadores: Imagen principal', valor_es: '/images/fundadores/fundadores.jpg', valor_en: '/images/fundadores/fundadores.jpg', valor_de: '/images/fundadores/fundadores.jpg' },
    { id: 'historia.fundadores2.imagen', seccion: 'historia', campo: 'Fundadores: Imagen Hover (Fundadores 2)', valor_es: '/images/fundadores/fundadores2.jpg', valor_en: '/images/fundadores/fundadores2.jpg', valor_de: '/images/fundadores/fundadores2.jpg' },
    
    // HOLDING
    // HOLDING
    { id: 'holding.intro', seccion: 'holding', campo: 'Introducción corporativa', valor_es: 'Grupo Exportador del Campo integra marcas y unidades de negocio especializadas que operan bajo una misma filosofía: calidad, trazabilidad y compromiso con el campo. Desde la producción agrícola hasta la transformación, logística y comercialización, cada división cumple una función estratégica dentro de un sistema diseñado para llevar productos frescos y soluciones agroalimentarias a mercados nacionales e internacionales.', valor_en: 'Grupo Exportador del Campo integrates specialized brands and business units operating under a single philosophy: quality, traceability, and field commitment. From agricultural production to processing, logistics, and marketing, each division plays a strategic role within a system designed to deliver fresh produce and food solutions to national and international markets.', valor_de: 'Grupo Exportador del Campo integriert spezialisierte Marken und Geschäftsbereiche unter einer einzigen Philosophie: Qualität, Rückverfolgbarkeit und Engagement für das Feld. Von der landwirtschaftlichen Produktion über die Verarbeitung, Logistik und Vermarktung spielt jede Abteilung eine strategische Rolle in einem System, das darauf ausgelegt ist, frische Produkte und Lebensmittellösungen auf nationale und internationale Märkte zu liefern.' },
    { id: 'holding.organigrama.placeholder', seccion: 'holding', campo: 'Texto placeholder organigrama', valor_es: 'Estructura corporativa completa — En actualización', valor_en: 'Complete corporate structure — Being updated', valor_de: 'Vollständige Unternehmensstruktur — Wird aktualisiert' },
    
    { id: 'holding.marca1.nombre', seccion: 'holding', campo: 'Marca 1: Nombre', valor_es: "Vizcaíno Fruits", valor_en: "Vizcaíno Fruits", valor_de: "Vizcaíno Fruits" },
    { id: 'holding.marca1.subtitulo', seccion: 'holding', campo: 'Marca 1: Subtítulo', valor_es: 'Origen agrícola con visión global', valor_en: 'Agricultural origin with global vision', valor_de: 'Landwirtschaftlicher Ursprung mit globaler Vision' },
    { id: 'holding.marca1.texto', seccion: 'holding', campo: 'Marca 1: Descripción corta', valor_es: 'Producimos y comercializamos hortalizas frescas y enfriadas respaldadas por décadas de experiencia agrícola, llevando la calidad del campo mexicano a mercados nacionales e internacionales.', valor_en: 'We produce and commercialize fresh and cooled vegetables backed by decades of agricultural experience, bringing Mexican field quality to national and international markets.', valor_de: 'Wir produzieren und vermarkten frisches und gekühltes Gemüse, gestützt auf jahrzehntelange landwirtschaftliche Erfahrung, und bringen die Qualität des mexikanischen Feldes auf nationale und internationale Märkte.' },
    { id: 'holding.marca1.pie', seccion: 'holding', campo: 'Marca 1: Pie de tarjeta', valor_es: 'Cultivamos', valor_en: 'We cultivate', valor_de: 'Wir kultivieren' },
    { id: 'holding.marca1.imagen', seccion: 'holding', campo: 'Marca 1: Imagen de Fondo', valor_es: '/images/holding/brands/fruits-bg.jpg', valor_en: '/images/holding/brands/fruits-bg.jpg', valor_de: '/images/holding/brands/fruits-bg.jpg' },
    { id: 'holding.marca1.logo', seccion: 'holding', campo: 'Marca 1: Logotipo', valor_es: '/images/logos/VizcainoFruits_Logo.png', valor_en: '/images/logos/VizcainoFruits_Logo.png', valor_de: '/images/logos/VizcainoFruits_Logo.png' },

    { id: 'holding.marca2.nombre', seccion: 'holding', campo: 'Marca 2: Nombre', valor_es: 'Vizcaíno Premium', valor_en: 'Vizcaíno Premium', valor_de: 'Vizcaíno Premium' },
    { id: 'holding.marca2.subtitulo', seccion: 'holding', campo: 'Marca 2: Subtítulo', valor_es: 'Valor agregado para el campo y sus mercados', valor_en: 'Value added for the field and its markets', valor_de: 'Mehrwert für das Feld und seine Märkte' },
    { id: 'holding.marca2.texto', seccion: 'holding', campo: 'Marca 2: Descripción corta', valor_es: 'Especialistas en chiles, cebollas y soluciones de empaque que elevan el valor de cada producto mediante selección, procesamiento y comercialización especializada.', valor_en: 'Specialists in chiles, onions and packaging solutions that elevate each product value through specialized selection, processing and commercialization.', valor_de: 'Spezialisten für Chilis, Zwiebeln und Verpackungslösungen, die den Wert jedes Produkts durch spezialisierte Auswahl, Verarbeitung und Vermarktung steigern.' },
    { id: 'holding.marca2.pie', seccion: 'holding', campo: 'Marca 2: Pie de tarjeta', valor_es: 'Transformamos', valor_en: 'We transform', valor_de: 'Wir transformieren' },
    { id: 'holding.marca2.imagen', seccion: 'holding', campo: 'Marca 2: Imagen de Fondo', valor_es: '/images/holding/brands/premium-bg.jpg', valor_en: '/images/holding/brands/premium-bg.jpg', valor_de: '/images/holding/brands/premium-bg.jpg' },
    { id: 'holding.marca2.logo', seccion: 'holding', campo: 'Marca 2: Logotipo', valor_es: '/images/logos/VizcainoPremium_Logo_web.png', valor_en: '/images/logos/VizcainoPremium_Logo_web.png', valor_de: '/images/logos/VizcainoPremium_Logo_web.png' },

    { id: 'holding.marca3.nombre', seccion: 'holding', campo: 'Marca 3: Nombre', valor_es: 'Vizcaíno Services', valor_en: 'Vizcaíno Services', valor_de: 'Vizcaíno Services' },
    { id: 'holding.marca3.subtitulo', seccion: 'holding', campo: 'Marca 3: Subtítulo', valor_es: 'La infraestructura que impulsa al campo', valor_en: 'The infrastructure that powers the field', valor_de: 'Die Infrastruktur, die das Feld antreibt' },
    { id: 'holding.marca3.texto', seccion: 'holding', campo: 'Marca 3: Descripción corta', valor_es: 'Integramos servicios de logística, refrigeración, enmallado, almacenamiento y maquila para conectar productos frescos con sus destinos de forma eficiente y confiable.', valor_en: 'We integrate logistics, pre-cooling, netting packaging, storage and maquila services to connect fresh produce with their destinations efficiently and reliably.', valor_de: 'Wir integrieren Logistik-, Vorkühlungs-, Netzverpackungs-, Lagerungs- und Maquila-Dienstleistungen, um frische Produkte effizient und zuverlässig mit ihren Bestimmungsorten zu verbinden.' },
    { id: 'holding.marca3.pie', seccion: 'holding', campo: 'Marca 3: Pie de tarjeta', valor_es: 'Movemos', valor_en: 'We move', valor_de: 'Wir bewegen' },
    { id: 'holding.marca3.imagen', seccion: 'holding', campo: 'Marca 3: Imagen de Fondo', valor_es: '/images/holding/brands/services-bg.jpg', valor_en: '/images/holding/brands/services-bg.jpg', valor_de: '/images/holding/brands/services-bg.jpg' },
    { id: 'holding.marca3.logo', seccion: 'holding', campo: 'Marca 3: Logotipo', valor_es: '/images/logos/VizcainoServices_Logo_web.png', valor_en: '/images/logos/VizcainoServices_Logo_web.png', valor_de: '/images/logos/VizcainoServices_Logo_web.png' },

    // HERO IMAGES FOR PAGES
    { id: 'quienes.hero.imagen', seccion: 'quienes', campo: 'Hero Imagen', valor_es: '/images/quienes/franja-inicio.jpg', valor_en: '/images/quienes/franja-inicio.jpg', valor_de: '/images/quienes/franja-inicio.jpg' },
    { id: 'historia.hero.imagen', seccion: 'historia', campo: 'Hero Imagen', valor_es: '/images/historia/franja-inicio.jpg', valor_en: '/images/historia/franja-inicio.jpg', valor_de: '/images/historia/franja-inicio.jpg' },
    { id: 'holding.hero.imagen', seccion: 'holding', campo: 'Hero Imagen', valor_es: '/images/features/holding.jpg', valor_en: '/images/features/holding.jpg', valor_de: '/images/features/holding.jpg' },
    { id: 'contacto.hero.imagen', seccion: 'contacto', campo: 'Hero Imagen', valor_es: '/images/features/contacto.jpg', valor_en: '/images/features/contacto.jpg', valor_de: '/images/features/contacto.jpg' },

    // TIMELINE SECTION
    { id: 'timeline.titulo', seccion: 'timeline', campo: 'Título de la línea de tiempo', valor_es: 'Línea de Tiempo GEC', valor_en: 'GEC Timeline', valor_de: 'GEC Zeitleiste' },
    
    // Slide 1
    { id: 'timeline.hito1.anio', seccion: 'timeline', campo: 'Hito 1: Año', valor_es: '1965', valor_en: '1965', valor_de: '1965' },
    { id: 'timeline.hito1.titulo', seccion: 'timeline', campo: 'Hito 1: Título', valor_es: 'Los primeros kilómetros', valor_en: 'The first kilometers', valor_de: 'Die ersten Kilometer' },
    { id: 'timeline.hito1.desc', seccion: 'timeline', campo: 'Hito 1: Descripción', valor_es: 'Don Ramiro Vizcaíno inicia operaciones de transporte de carga para agricultores de la región, junto con Dña Zeferina Torres. Donde conocen gran parte de la república y del negocio del campo.', valor_en: 'Don Ramiro Vizcaíno starts cargo transport operations for farmers in the region, together with Mrs. Zeferina Torres. Where they know a large part of the country and the field business.', valor_de: 'Don Ramiro Vizcaíno beginnt zusammen mit Frau Zeferina Torres mit Frachttransporten für Landwirte in der Region. Wo sie einen großen Teil des Landes und des landwirtschaftlichen Sektors kennenlernen.' },
    { id: 'timeline.hito1.imagen', seccion: 'timeline', campo: 'Hito 1: Imagen', valor_es: '/images/timeline/1965.png', valor_en: '/images/timeline/1965.png', valor_de: '/images/timeline/1965.png' },
    { id: 'timeline.hito1.generacion', seccion: 'timeline', campo: 'Hito 1: Generación (1, 2, 3 o futuro)', valor_es: '1', valor_en: '1', valor_de: '1' },

    // Slide 2
    { id: 'timeline.hito2.anio', seccion: 'timeline', campo: 'Hito 2: Año', valor_es: '1969', valor_en: '1969', valor_de: '1969' },
    { id: 'timeline.hito2.titulo', seccion: 'timeline', campo: 'Hito 2: Título', valor_es: 'Primer punto de venta en el mercado municipal', valor_en: 'First point of sale in the municipal market', valor_de: 'Erste Verkaufsstelle auf dem städtischen Markt' },
    { id: 'timeline.hito2.desc', seccion: 'timeline', campo: 'Hito 2: Descripción', valor_es: 'Apertura del primer punto de venta en el mercado municipal, marcando el inicio de la comercialización directa de hortalizas.', valor_en: 'Opening of the first point of sale in the municipal market, marking the beginning of direct commercialization of vegetables.', valor_de: 'Eröffnung der ersten Verkaufsstelle auf dem städtischen Markt, die den Beginn der direkten Vermarktung von Gemüse markiert.' },
    { id: 'timeline.hito2.imagen', seccion: 'timeline', campo: 'Hito 2: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito2.generacion', seccion: 'timeline', campo: 'Hito 2: Generación (1, 2, 3 o futuro)', valor_es: '1', valor_en: '1', valor_de: '1' },

    // Slide 3
    { id: 'timeline.hito3.anio', seccion: 'timeline', campo: 'Hito 3: Año', valor_es: '1972', valor_en: '1972', valor_de: '1972' },
    { id: 'timeline.hito3.titulo', seccion: 'timeline', campo: 'Hito 3: Título', valor_es: 'Incursión en el negocio ganadero', valor_en: 'Incursion into the livestock business', valor_de: 'Einstieg in das Viehgeschäft' },
    { id: 'timeline.hito3.desc', seccion: 'timeline', campo: 'Hito 3: Descripción', valor_es: 'Incursión en el negocio ganadero, ampliando las actividades productivas que engloba el campo.', valor_en: 'Incursion into the livestock business, expanding the productive activities that encompass the field.', valor_de: 'Einstieg in das Viehgeschäft zur Erweiterung der produktiven Aktivitäten, die das Land umfasst.' },
    { id: 'timeline.hito3.imagen', seccion: 'timeline', campo: 'Hito 3: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito3.generacion', seccion: 'timeline', campo: 'Hito 3: Generación (1, 2, 3 o futuro)', valor_es: '1', valor_en: '1', valor_de: '1' },

    // Slide 4
    { id: 'timeline.hito4.anio', seccion: 'timeline', campo: 'Hito 4: Año', valor_es: '1985', valor_en: '1985', valor_de: '1985' },
    { id: 'timeline.hito4.titulo', seccion: 'timeline', campo: 'Hito 4: Título', valor_es: 'Inicio distribución mayorista', valor_en: 'Wholesale distribution starts', valor_de: 'Beginn des Großhandelsvertriebs' },
    { id: 'timeline.hito4.desc', seccion: 'timeline', campo: 'Hito 4: Descripción', valor_es: 'Inicio de operaciones de mayoreo en norte, centro y sur del país. Se expande el alcance comercial con la primera flotilla de transporte.', valor_en: 'Start of wholesale operations in the north, center and south of the country. Commercial reach expands with the first transport fleet.', valor_de: 'Start des Großhandelsbetriebs im Norden, Zentrum und Süden des Landes. Die kommerzielle Reichweite wird mit der ersten Transportflotte erweitert.' },
    { id: 'timeline.hito4.imagen', seccion: 'timeline', campo: 'Hito 4: Imagen', valor_es: '/images/timeline/1985.png', valor_en: '/images/timeline/1985.png', valor_de: '/images/timeline/1985.png' },
    { id: 'timeline.hito4.generacion', seccion: 'timeline', campo: 'Hito 4: Generación (1, 2, 3 o futuro)', valor_es: '1', valor_en: '1', valor_de: '1' },

    // Slide 5
    { id: 'timeline.hito5.anio', seccion: 'timeline', campo: 'Hito 5: Año', valor_es: '1990', valor_en: '1990', valor_de: '1990' },
    { id: 'timeline.hito5.titulo', seccion: 'timeline', campo: 'Hito 5: Título', valor_es: 'Primera exportación de hortalizas', valor_en: 'First vegetable export', valor_de: 'Erster Gemüseexport' },
    { id: 'timeline.hito5.desc', seccion: 'timeline', campo: 'Hito 5: Descripción', valor_es: 'Primera exportación de repollo, iniciando la proyección internacional de la empresa.', valor_en: 'First cabbage export, initiating the international projection of the company.', valor_de: 'Erster Kohlexport, der die internationale Ausrichtung des Unternehmens einleitet.' },
    { id: 'timeline.hito5.imagen', seccion: 'timeline', campo: 'Hito 5: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito5.generacion', seccion: 'timeline', campo: 'Hito 5: Generación (1, 2, 3 o futuro)', valor_es: '1', valor_en: '1', valor_de: '1' },

    // Slide 6
    { id: 'timeline.hito6.anio', seccion: 'timeline', campo: 'Hito 6: Año', valor_es: '1992', valor_en: '1992', valor_de: '1992' },
    { id: 'timeline.hito6.titulo', seccion: 'timeline', campo: 'Hito 6: Título', valor_es: 'Fundación de Vizcaíno Fruits', valor_en: 'Foundation of Vizcaíno Fruits', valor_de: 'Gründung von Vizcaíno Fruits' },
    { id: 'timeline.hito6.desc', seccion: 'timeline', campo: 'Hito 6: Descripción', valor_es: 'La imagen de la empresa se consolida con su primer logotipo y marca comercial formal. Compuesta por el apellido del fundador y el eslogan “Simplemente… lo Mejor en Hortalizas”', valor_en: 'The company image is consolidated with its first logo and formal trademark. Composed of the founder surname and the slogan “Simply… the Best in Vegetables”', valor_de: 'Das Image des Unternehmens festigt sich mit seinem ersten Logo und der formellen Marke. Bestehend aus dem Nachnamen des Gründers und dem Slogan „Simply… the Best in Vegetables“' },
    { id: 'timeline.hito6.imagen', seccion: 'timeline', campo: 'Hito 6: Imagen', valor_es: '/images/timeline/1992.png', valor_en: '/images/timeline/1992.png', valor_de: '/images/timeline/1992.png' },
    { id: 'timeline.hito6.generacion', seccion: 'timeline', campo: 'Hito 6: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 7
    { id: 'timeline.hito7.anio', seccion: 'timeline', campo: 'Hito 7: Año', valor_es: '1993', valor_en: '1993', valor_de: '1993' },
    { id: 'timeline.hito7.titulo', seccion: 'timeline', campo: 'Hito 7: Título', valor_es: 'Expansión a Guadalajara', valor_en: 'Expansion to Guadalajara', valor_de: 'Expansion nach Guadalajara' },
    { id: 'timeline.hito7.desc', seccion: 'timeline', campo: 'Hito 7: Descripción', valor_es: 'Apertura del punto de venta en Guadalajara, consolidando presencia en mercados del occidente de México.', valor_en: 'Opening of the point of sale in Guadalajara, consolidating presence in western Mexico markets.', valor_de: 'Eröffnung der Verkaufsstelle in Guadalajara zur Festigung der Präsenz auf den Märkten Westmexikos.' },
    { id: 'timeline.hito7.imagen', seccion: 'timeline', campo: 'Hito 7: Imagen', valor_es: '/images/timeline/1993.png', valor_en: '/images/timeline/1993.png', valor_de: '/images/timeline/1993.png' },
    { id: 'timeline.hito7.generacion', seccion: 'timeline', campo: 'Hito 7: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 8
    { id: 'timeline.hito8.anio', seccion: 'timeline', campo: 'Hito 8: Año', valor_es: '1995', valor_en: '1995', valor_de: '1995' },
    { id: 'timeline.hito8.titulo', seccion: 'timeline', campo: 'Hito 8: Título', valor_es: 'Planta enfriadora', valor_en: 'Cooling plant', valor_de: 'Kühlanlage' },
    { id: 'timeline.hito8.desc', seccion: 'timeline', campo: 'Hito 8: Descripción', valor_es: 'Se inaugura la primera planta enfriadora en Zacatecas, permitiendo un mayor control sobre la cadena y calidad de nuestros productos.', valor_en: 'The first cooling plant is inaugurated in Zacatecas, allowing greater control over the chain and quality of our products.', valor_de: 'Die erste Kühlanlage in Zacatecas wird eingeweiht, was eine größere Kontrolle über die Kette und die Qualität unserer Produkte ermöglicht.' },
    { id: 'timeline.hito8.imagen', seccion: 'timeline', campo: 'Hito 8: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito8.generacion', seccion: 'timeline', campo: 'Hito 8: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 9
    { id: 'timeline.hito9.anio', seccion: 'timeline', campo: 'Hito 9: Año', valor_es: '1998', valor_en: '1998', valor_de: '1998' },
    { id: 'timeline.hito9.titulo', seccion: 'timeline', campo: 'Hito 9: Título', valor_es: 'Adquisición primer rancho de producción', valor_en: 'Acquisition of the first production ranch', valor_de: 'Erwerb der ersten Produktionsranch' },
    { id: 'timeline.hito9.desc', seccion: 'timeline', campo: 'Hito 9: Descripción', valor_es: 'Compra del primer rancho agrícola, consolidando el control directo sobre la producción.', valor_en: 'Purchase of the first agricultural ranch, consolidating direct control over production.', valor_de: 'Kauf der ersten Landwirtschaftsranch zur Festigung der direkten Produktionskontrolle.' },
    { id: 'timeline.hito9.imagen', seccion: 'timeline', campo: 'Hito 9: Imagen', valor_es: '/images/timeline/1998.png', valor_en: '/images/timeline/1998.png', valor_de: '/images/timeline/1998.png' },
    { id: 'timeline.hito9.generacion', seccion: 'timeline', campo: 'Hito 9: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 10
    { id: 'timeline.hito10.anio', seccion: 'timeline', campo: 'Hito 10: Año', valor_es: '2005', valor_en: '2005', valor_de: '2005' },
    { id: 'timeline.hito10.titulo', seccion: 'timeline', campo: 'Hito 10: Título', valor_es: 'Expansión a Monterrey', valor_en: 'Expansion to Monterrey', valor_de: 'Expansion nach Monterrey' },
    { id: 'timeline.hito10.desc', seccion: 'timeline', campo: 'Hito 10: Descripción', valor_es: 'Apertura del punto de venta en Monterrey, fortaleciendo la presencia en el norte del país y como puente directo a la exportación hacia Estados Unidos.', valor_en: 'Opening of the point of sale in Monterrey, strengthening the presence in the north of the country and as a direct bridge for exports to the United States.', valor_de: 'Eröffnung der Verkaufsstelle in Monterrey zur Stärkung der Präsenz im Norden des Landes und als direkte Brücke für Exporte in die USA.' },
    { id: 'timeline.hito10.imagen', seccion: 'timeline', campo: 'Hito 10: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito10.generacion', seccion: 'timeline', campo: 'Hito 10: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 11
    { id: 'timeline.hito11.anio', seccion: 'timeline', campo: 'Hito 11: Año', valor_es: '2006', valor_en: '2006', valor_de: '2006' },
    { id: 'timeline.hito11.titulo', seccion: 'timeline', campo: 'Hito 11: Título', valor_es: 'Segunda planta enfriadora', valor_en: 'Second cooling plant', valor_de: 'Zweite Kühlanlage' },
    { id: 'timeline.hito11.desc', seccion: 'timeline', campo: 'Hito 11: Descripción', valor_es: 'Inauguración de la segunda planta de preenfriamiento, duplicando la capacidad y convirtiéndonos en un referente operativo en Zacatecas.', valor_en: 'Inauguration of the second pre-cooling plant, doubling capacity and becoming an operational reference in Zacatecas.', valor_de: 'Einweihung der zweiten Vorkühlanlage, wodurch die Kapazität verdoppelt und eine operative Referenz in Zacatecas geschaffen wird.' },
    { id: 'timeline.hito11.imagen', seccion: 'timeline', campo: 'Hito 11: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito11.generacion', seccion: 'timeline', campo: 'Hito 11: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 12
    { id: 'timeline.hito12.anio', seccion: 'timeline', campo: 'Hito 12: Año', valor_es: '2011', valor_en: '2011', valor_de: '2011' },
    { id: 'timeline.hito12.titulo', seccion: 'timeline', campo: 'Hito 12: Título', valor_es: 'Adquisición segundo rancho de producción', valor_en: 'Acquisition of the second production ranch', valor_de: 'Erwerb der zweiten Produktionsranch' },
    { id: 'timeline.hito12.desc', seccion: 'timeline', campo: 'Hito 12: Descripción', valor_es: 'Adquisición del segundo rancho, ampliando la capacidad productiva de la empresa.', valor_en: 'Acquisition of the second ranch, expanding the company\'s productive capacity.', valor_de: 'Erwerb der zweiten Ranch zur Erweiterung der Produktionskapazität des Unternehmens.' },
    { id: 'timeline.hito12.imagen', seccion: 'timeline', campo: 'Hito 12: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito12.generacion', seccion: 'timeline', campo: 'Hito 12: Generación (1, 2, 3 o futuro)', valor_es: '2', valor_en: '2', valor_de: '2' },

    // Slide 13
    { id: 'timeline.hito13.anio', seccion: 'timeline', campo: 'Hito 13: Año', valor_es: '2021', valor_en: '2021', valor_de: '2021' },
    { id: 'timeline.hito13.titulo', seccion: 'timeline', campo: 'Hito 13: Título', valor_es: 'Constitución de Grupo Exportador del Campo', valor_en: 'Constitution of Grupo Exportador del Campo', valor_de: 'Gründung der Grupo Exportador del Campo' },
    { id: 'timeline.hito13.desc', seccion: 'timeline', campo: 'Hito 13: Descripción', valor_es: 'Como resultado de la evolución, una reorganización de las actividades de la empresa culminó formalmente con el nacimiento de Grupo Exportador del Campo, marcando el inicio de una nueva etapa enfocada en la profesionalización, la expansión comercial y la proyección internacional.', valor_en: 'As a result of the evolution, a reorganization of the company\'s activities formally culminated in the birth of Grupo Exportador del Campo, marking the start of a new stage focused on professionalization, commercial expansion and international projection.', valor_de: 'Als Ergebnis der Evolution gipfelte eine Reorganisation der Unternehmensaktivitäten formell in der Gründung der Grupo Exportador del Campo, was den Beginn einer neuen Phase markiert, die auf Professionalisierung, kommerzielle Expansion und internationale Ausrichtung ausgerichtet ist.' },
    { id: 'timeline.hito13.imagen', seccion: 'timeline', campo: 'Hito 13: Imagen', valor_es: '/images/timeline/2021.png', valor_en: '/images/timeline/2021.png', valor_de: '/images/timeline/2021.png' },
    { id: 'timeline.hito13.generacion', seccion: 'timeline', campo: 'Hito 13: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 14
    { id: 'timeline.hito14.anio', seccion: 'timeline', campo: 'Hito 14: Año', valor_es: '2022', valor_en: '2022', valor_de: '2022' },
    { id: 'timeline.hito14.titulo', seccion: 'timeline', campo: 'Hito 14: Título', valor_es: 'Primera exportación como GEC', valor_en: 'First GEC export', valor_de: 'Erster GEC-Export' },
    { id: 'timeline.hito14.desc', seccion: 'timeline', campo: 'Hito 14: Descripción', valor_es: 'Se realiza la primera exportación bajo la razón social de Grupo Exportador del Campo, consolidando una nueva etapa de crecimiento y fortaleciendo nuestra presencia en mercados internacionales.', valor_en: 'The first export is made under the corporate name of Grupo Exportador del Campo, consolidating a new growth phase and strengthening our international markets presence.', valor_de: 'Der erste Export erfolgt unter der Firma Grupo Exportador del Campo, was eine neue Wachstumsphase festigt und unsere Präsenz auf internationalen Märkten stärkt.' },
    { id: 'timeline.hito14.imagen', seccion: 'timeline', campo: 'Hito 14: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito14.generacion', seccion: 'timeline', campo: 'Hito 14: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 15
    { id: 'timeline.hito15.anio', seccion: 'timeline', campo: 'Hito 15: Año', valor_es: '2019', valor_en: '2019', valor_de: '2019' },
    { id: 'timeline.hito15.titulo', seccion: 'timeline', campo: 'Hito 15: Título', valor_es: 'Unidad de Negocio CEDIS Monterrey', valor_en: 'CEDIS Monterrey Business Unit', valor_de: 'Geschäftsbereich CEDIS Monterrey' },
    { id: 'timeline.hito15.desc', seccion: 'timeline', campo: 'Hito 15: Descripción', valor_es: 'Se inaugura el primer Centro de Distribución de la empresa, fortaleciendo la capacidad logística, el servicio a clientes y la conexión eficiente entre el campo y los principales mercados del país.', valor_en: 'The first Distribution Center is inaugurated, strengthening logistics capacity, customer service and efficient connection between the field and main country markets.', valor_de: 'Das erste Vertriebszentrum wird eingeweiht, was die logistische Kapazität, den Kundenservice und die effiziente Verbindung zwischen dem Feld und den Hauptmärkten des Landes stärkt.' },
    { id: 'timeline.hito15.imagen', seccion: 'timeline', campo: 'Hito 15: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito15.generacion', seccion: 'timeline', campo: 'Hito 15: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 16
    { id: 'timeline.hito16.anio', seccion: 'timeline', campo: 'Hito 16: Año', valor_es: '2024', valor_en: '2024', valor_de: '2024' },
    { id: 'timeline.hito16.titulo', seccion: 'timeline', campo: 'Hito 16: Título', valor_es: 'Unidad de Negocio: Plantas de preenfriamiento', valor_en: 'Business Unit: Pre-cooling plants', valor_de: 'Geschäftsbereich: Vorkühlanlagen' },
    { id: 'timeline.hito16.desc', seccion: 'timeline', campo: 'Hito 16: Descripción', valor_es: 'La operación de preenfriamiento se consolida como una unidad de negocio estratégica dentro de GEC, fortaleciendo el control de la cadena de frío y garantizando la calidad de los productos desde su origen hasta su destino.', valor_en: 'Pre-cooling operation is consolidated as a strategic GEC business unit, strengthening cold chain control and guaranteeing products quality from origin to destination.', valor_de: 'Der Vorkühlbetrieb wird als strategischer Geschäftsbereich von GEC konsolidiert, was die Kontrolle der Kühlkette stärkt und die Produktqualität von der Herkunft bis zum Bestimmungsort garantiert.' },
    { id: 'timeline.hito16.imagen', seccion: 'timeline', campo: 'Hito 16: Imagen', valor_es: '/images/timeline/FRIO.png', valor_en: '/images/timeline/FRIO.png', valor_de: '/images/timeline/FRIO.png' },
    { id: 'timeline.hito16.generacion', seccion: 'timeline', campo: 'Hito 16: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 17
    { id: 'timeline.hito17.anio', seccion: 'timeline', campo: 'Hito 17: Año', valor_es: '2024', valor_en: '2024', valor_de: '2024' },
    { id: 'timeline.hito17.titulo', seccion: 'timeline', campo: 'Hito 17: Título', valor_es: 'Unidad de Negocio: Ranchos de producción', valor_en: 'Business Unit: Production ranches', valor_de: 'Geschäftsbereich: Produktionsranches' },
    { id: 'timeline.hito17.desc', seccion: 'timeline', campo: 'Hito 17: Descripción', valor_es: 'La integración de las unidades productivas bajo una misma visión operativa fortalece el control sobre el suministro agrícola, consolidando una estructura capaz de responder con mayor eficiencia, trazabilidad y consistencia a las necesidades del mercado', valor_en: 'Integration of productive units under a single operational vision strengthens control over agricultural supply, consolidating a structure capable of responding with greater efficiency, traceability and consistency to market needs', valor_de: 'Die Integration der Produktionseinheiten unter einer einheitlichen operativen Vision stärkt die Kontrolle über die landwirtschaftliche Versorgung und festigt eine Struktur, die mit größerer Effizienz, Rückverfolgbarkeit und Beständigkeit auf Marktbedürfnisse reagieren kann' },
    { id: 'timeline.hito17.imagen', seccion: 'timeline', campo: 'Hito 17: Imagen', valor_es: '/images/timeline/RANCHO.png', valor_en: '/images/timeline/RANCHO.png', valor_de: '/images/timeline/RANCHO.png' },
    { id: 'timeline.hito17.generacion', seccion: 'timeline', campo: 'Hito 17: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 18
    { id: 'timeline.hito18.anio', seccion: 'timeline', campo: 'Hito 18: Año', valor_es: '2026', valor_en: '2026', valor_de: '2026' },
    { id: 'timeline.hito18.titulo', seccion: 'timeline', campo: 'Hito 18: Título', valor_es: 'Unidad de Negocio CEDIS Tijuana', valor_en: 'CEDIS Tijuana Business Unit', valor_de: 'Geschäftsbereich CEDIS Tijuana' },
    { id: 'timeline.hito18.desc', seccion: 'timeline', campo: 'Hito 18: Descripción', valor_es: 'Mediante una alianza estratégica, se incorpora la operación de un Centro de Distribución en Tijuana como una nueva unidad de negocio, ampliando el alcance logístico de la empresa a la costa oeste.', valor_en: 'Through a strategic alliance, the operation of a Distribution Center in Tijuana is incorporated as a new business unit, expanding the company\'s logistics reach to the west coast.', valor_de: 'Im Rahmen einer strategischen Allianz wird der Betrieb eines Vertriebszentrums in Tijuana als neuer Geschäftsbereich integriert, was die logistische Reichweite des Unternehmens auf die Westküste ausdehnt.' },
    { id: 'timeline.hito18.imagen', seccion: 'timeline', campo: 'Hito 18: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito18.generacion', seccion: 'timeline', campo: 'Hito 18: Generación (1, 2, 3 o futuro)', valor_es: '3', valor_en: '3', valor_de: '3' },

    // Slide 19
    { id: 'timeline.hito19.anio', seccion: 'timeline', campo: 'Hito 19: Año', valor_es: 'Futuro', valor_en: 'Future', valor_de: 'Zukunft' },
    { id: 'timeline.hito19.titulo', seccion: 'timeline', campo: 'Hito 19: Título', valor_es: 'Y seguimos apuntando alto…', valor_en: 'And we keep aiming high...', valor_de: 'Und wir setzen uns weiterhin hohe Ziele...' },
    { id: 'timeline.hito19.desc', seccion: 'timeline', campo: 'Hito 19: Descripción', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito19.imagen', seccion: 'timeline', campo: 'Hito 19: Imagen', valor_es: '', valor_en: '', valor_de: '' },
    { id: 'timeline.hito19.generacion', seccion: 'timeline', campo: 'Hito 19: Generación (1, 2, 3 o futuro)', valor_es: 'futuro', valor_en: 'futuro', valor_de: 'futuro' },

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
