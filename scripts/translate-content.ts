import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const traducciones: Record<string, { en: string; de: string }> = {

  // ── HOME ──────────────────────────────────────────────────

  'home.hero.tagline': {
    en: 'Volume that delivers, quality that backs it up.',
    de: 'Volumen, der liefert – Qualität, die überzeugt.',
  },
  'home.hero.sub': {
    en: 'For over 50 years, bringing the best of the field to the world.',
    de: 'Seit über 50 Jahren bringen wir das Beste vom Feld in die Welt.',
  },
  'home.metrica1.numero': { en: '+50', de: '+50' },
  'home.metrica1.label': { en: 'Years of experience', de: 'Jahre Erfahrung' },
  'home.metrica1.descripcion': {
    en: 'Producing and exporting from Zacatecas',
    de: 'Produktion und Export aus Zacatecas',
  },
  'home.metrica2.numero': { en: '25,000', de: '25.000' },
  'home.metrica2.label': { en: 'Exported tons', de: 'Exportierte Tonnen' },
  'home.metrica2.descripcion': {
    en: 'In markets across Mexico and the United States',
    de: 'Auf Märkten in Mexiko und den Vereinigten Staaten',
  },
  'home.metrica3.numero': { en: '+120', de: '+120' },
  'home.metrica3.label': { en: 'Collaborators', de: 'Mitarbeiter' },
  'home.metrica3.descripcion': {
    en: 'Across our business units',
    de: 'In unseren Geschäftseinheiten',
  },

  // ── QUIÉNES SOMOS ─────────────────────────────────────────

  'quienes.intro': {
    en: 'Grupo Exportador del Campo was born from the business model developed by Mr. Ramiro Vizcaíno to produce and market vegetables from Loreto, Zacatecas. For over 50 years, we have been committed to offering you the best of the field through various services and products. We are committed from start to finish to providing comprehensive support across each of our business units.',
    de: 'Grupo Exportador del Campo entstand aus dem Geschäftsmodell, das von Herrn Ramiro Vizcaíno entwickelt wurde, um Gemüse aus Loreto, Zacatecas, zu produzieren und zu vermarkten. Seit über 50 Jahren sind wir bestrebt, Ihnen das Beste vom Feld durch verschiedene Dienstleistungen und Produkte anzubieten. Wir sind von Anfang bis Ende verpflichtet, umfassende Unterstützung in jeder unserer Geschäftseinheiten zu leisten.',
  },
  'quienes.cadena.titulo': {
    en: 'Complete supply chain control',
    de: 'Vollständige Kontrolle der Lieferkette',
  },
  'quienes.cadena.subtitulo': {
    en: '3 generations loving the field',
    de: '3 Generationen mit Leidenschaft für das Feld',
  },
  'quienes.mision': {
    en: 'To continue the tradition of over 3 generations of making quality chiles and vegetables available to consumers, with high added value, guaranteeing the highest market quality.',
    de: 'Die Tradition von über 3 Generationen fortzuführen, Verbrauchern qualitativ hochwertige Chilis und Gemüse mit hohem Mehrwert bereitzustellen und dabei höchste Marktqualität zu garantieren.',
  },
  'quienes.vision': {
    en: 'To be a company for the production and commercialization of high volumes in national and foreign markets, offering a variety of fresh field products, mainly chiles and vegetables, with certified sanitary quality and traceability that instills confidence in the end customer.',
    de: 'Ein Unternehmen für die Produktion und Vermarktung hoher Mengen auf nationalen und ausländischen Märkten zu sein, das eine Vielzahl frischer Feldprodukte, hauptsächlich Chilis und Gemüse, mit zertifizierter Hygienequalität und Rückverfolgbarkeit anbietet, die dem Endkunden Vertrauen einflößt.',
  },
  'quienes.valor.honestidad': {
    en: 'Always delivering the best for our clients.',
    de: 'Stets das Beste für unsere Kunden liefern.',
  },
  'quienes.valor.compromiso': {
    en: 'Giving our best and fulfilling our commitments to our clients.',
    de: 'Unser Bestes geben und unsere Verpflichtungen gegenüber unseren Kunden erfüllen.',
  },
  'quienes.valor.humildad': {
    en: 'Always with respect and humility in serving our clients.',
    de: 'Stets mit Respekt und Bescheidenheit unseren Kunden gegenüber.',
  },
  'quienes.valor.profesionalismo': {
    en: 'A responsible work team dedicated to delivering the best for our clients.',
    de: 'Ein verantwortungsvolles Arbeitsteam, das sich dem Besten für unsere Kunden widmet.',
  },
  'quienes.valor.lealtad': {
    en: 'Respecting our clients and honoring our commitment to always deliver the best.',
    de: 'Unsere Kunden respektieren und unser Engagement für das Beste aufrechterhalten.',
  },
  'quienes.valor.transparencia': {
    en: 'Clear accounts, with complete service from start to finish.',
    de: 'Klare Abrechnungen mit vollständigem Service von Anfang bis Ende.',
  },

  // ── HISTORIA ──────────────────────────────────────────────

  'historia.origen.titulo': {
    en: 'Our Origins',
    de: 'Unsere Ursprünge',
  },
  'historia.origen.texto': {
    en: 'Grupo Exportador del Campo was born from the business model developed by Mr. Ramiro Vizcaíno to produce and market vegetables from Loreto, Zacatecas, over 50 years ago.',
    de: 'Grupo Exportador del Campo entstand aus dem Geschäftsmodell, das von Herrn Ramiro Vizcaíno vor über 50 Jahren entwickelt wurde, um Gemüse aus Loreto, Zacatecas zu produzieren und zu vermarkten.',
  },
  'historia.fundadores.texto': {
    en: 'Their legacy is the foundation of what Grupo Exportador del Campo is today.',
    de: 'Ihr Vermächtnis ist das Fundament dessen, was Grupo Exportador del Campo heute ist.',
  },

  // ── HOLDING ───────────────────────────────────────────────

  'holding.intro': {
    en: 'Grupo Exportador del Campo is structured as a holding company with specialized business units, designed to provide comprehensive coverage of the agri-food supply chain. Our corporate structure is oriented toward institutional boards and strategic alliances.',
    de: 'Grupo Exportador del Campo ist als Holdinggesellschaft mit spezialisierten Geschäftseinheiten strukturiert und bietet eine umfassende Abdeckung der agrarischen Lieferkette. Unsere Unternehmensstruktur ist auf institutionelle Vorstände und strategische Allianzen ausgerichtet.',
  },
  'holding.organigrama.placeholder': {
    en: 'Complete corporate structure — Being updated',
    de: 'Vollständige Unternehmensstruktur — Wird aktualisiert',
  },
  'holding.marca1.nombre': { en: "Vizcaíno Fruit's", de: "Vizcaíno Fruit's" },
  'holding.marca1.descripcion': {
    en: 'Focused on the production, commercialization and export of a variety of field products, including fruits and vegetables. Serving markets in Mexico and the United States with over 50 years of experience.',
    de: 'Schwerpunkt auf Produktion, Vermarktung und Export einer Vielzahl von Feldprodukten, einschließlich Obst und Gemüse. Mit über 50 Jahren Erfahrung bedienen wir Märkte in Mexiko und den Vereinigten Staaten.',
  },
  'holding.marca1.productos': {
    en: 'Lettuces: iceberg, Italian, romaine, red leaf',
    de: 'Salate: Eisberg, Italienisch, Romana, Roter Lollo',
  },
  'holding.marca2.nombre': { en: 'Vizcaíno Premium', de: 'Vizcaíno Premium' },
  'holding.marca2.descripcion': {
    en: 'Focused on the production, commercialization and export of a variety of chiles: jalapeño, serrano, poblano, anaheim, Hungarian and onions. Offering products in bulk packaging in plastic boxes or mesh bags.',
    de: 'Schwerpunkt auf Produktion, Vermarktung und Export verschiedener Chilisorten: Jalapeño, Serrano, Poblano, Anaheim, Ungarisch und Zwiebeln. Angebot der Produkte in Großverpackungen in Kunststoffboxen oder Netzsäcken.',
  },
  'holding.marca2.productos': {
    en: 'Chiles: jalapeño, serrano, poblano, anaheim, Hungarian and onions',
    de: 'Chilis: Jalapeño, Serrano, Poblano, Anaheim, Ungarisch und Zwiebeln',
  },
  'holding.marca3.nombre': { en: 'Vizcaíno Services', de: 'Vizcaíno Services' },
  'holding.marca3.descripcion': {
    en: 'Division dedicated to product maquiladora services, refrigeration, storage and logistics services for the transport of various field products.',
    de: 'Abteilung für Maquiladora-Dienstleistungen, Kühlung, Lagerung und Logistikdienstleistungen für den Transport verschiedener Feldprodukte.',
  },
  'holding.marca3.productos': {
    en: 'Maquiladora, refrigeration, storage, logistics',
    de: 'Maquiladora, Kühlung, Lagerung, Logistik',
  },

  // ── CONTACTO ──────────────────────────────────────────────

  'contacto.bienvenida': {
    en: 'Whether you are a supplier, client, or seeking a strategic alliance, we are here to listen to you.',
    de: 'Ob Sie Lieferant, Kunde oder auf der Suche nach einer strategischen Allianz sind – wir sind hier, um Ihnen zuzuhören.',
  },
}

async function main() {
  console.log('🌍 Actualizando traducciones EN y DE...\n')

  for (const [id, { en, de }] of Object.entries(traducciones)) {
    try {
      const exists = await prisma.contenidoSitio.findUnique({ where: { id } });
      if (exists) {
        await prisma.contenidoSitio.update({
          where: { id },
          data: { valor_en: en, valor_de: de },
        })
        console.log(`✅ ${id}`)
      } else {
        console.log(`⚠️  ${id} — no encontrado, omitiendo`)
      }
    } catch (err: any) {
      console.log(`❌ Error en ${id}: ${err.message}`)
    }
  }

  console.log('\n✅ Traducciones completadas')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
