# Checklist de Implementación: Edición Visual y Multilingüe Total

## Fase 1: API e Infraestructura del Editor Visual
- [x] Habilitar selectores de imágenes para Español, Inglés y Alemán en el panel `/admin/contenido`.
- [x] Crear el componente wrapper `VisualEditable.tsx` que detecta la sesión y renderiza el hover verde y modal de edición.
- [x] Crear el proveedor `SessionProvider` o configurar el layout global para habilitar NextAuth en el sitio público.
- [x] Implementar la API de guardado rápido `/api/admin/contenido/inline-update` (reutilizando PATCH / GET).

## Fase 2: Página de Inicio (Home)
- [x] Migrar el video del Hero y métricas a base de datos.
- [x] Envolver elementos de Home en `VisualEditable`.

## Fase 3: Quiénes Somos
- [ ] Migrar los textos e imágenes de los procesos de Campo/CEDIS y de la sección Capital Humano.
- [ ] Envolver los bloques en `VisualEditable`.

## Fase 4: Historia and Holding
- [x] Migrar los textos del slideshow de origen y el organigrama.
- [x] Envolver los bloques en `VisualEditable`.

## Fase 5: Elementos Globales (Header/Footer)
- [ ] Migrar la dirección, teléfono, correo y enlaces de navegación del Footer/Header.
- [ ] Envolver en `VisualEditable`.
