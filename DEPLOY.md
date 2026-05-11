# Guía de Deploy — Grupo Exportador del Campo

## Servicios necesarios (todos gratis)

| Servicio | Uso | URL |
|---|---|---|
| GitHub | Repositorio del código | github.com |
| Supabase | Base de datos PostgreSQL | supabase.com |
| Resend | Envío de emails | resend.com |
| Vercel | Hosting + almacenamiento de imágenes | vercel.com |

---

## 1. Supabase — Base de datos PostgreSQL

1. Ir a [supabase.com](https://supabase.com) → **New Project**
2. Nombre del proyecto: `gek-web`
3. Región: `us-east-1` (más cercana a México)
4. Crear un password seguro y guardarlo
5. Ir a **Settings → Database → Connection string**
6. Seleccionar modo **"Transaction"** (puerto 6543)
7. Copiar la URL — será tu `DATABASE_URL`

> Formato esperado: `postgresql://postgres.[ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`

---

## 2. Resend — Emails del formulario de contacto

1. Ir a [resend.com](https://resend.com) → Sign up gratis
2. **API Keys → Create API Key** → copiar la clave
3. **Domains → Add Domain** → agregar `grupoexportadordelcampo.com`
4. Seguir instrucciones para agregar los registros DNS en tu proveedor de dominio
5. Verificar el dominio (puede tardar unos minutos)

> **Temporal:** Si el dominio aún no está verificado, usa `onboarding@resend.dev` como `from` en `app/api/contacto/route.ts`

---

## 3. GitHub — Repositorio del código

```bash
# En la carpeta del proyecto
git init
git add .
git commit -m "Initial commit — GEK Web"

# Crear repositorio en github.com (privado) y luego:
git remote add origin https://github.com/[tu-usuario]/gek-web.git
git push -u origin main
```

---

## 4. Vercel — Deploy principal

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. **Import desde GitHub** → seleccionar `gek-web`
3. Framework: Next.js (auto-detectado)
4. Agregar las siguientes variables de entorno (una por una):

| Variable | Valor |
|---|---|
| `DATABASE_URL` | URL de Supabase (modo Transaction, puerto 6543) |
| `NEXTAUTH_SECRET` | Resultado de `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://www.grupoexportadordelcampo.com` |
| `RESEND_API_KEY` | Clave de Resend |
| `EMAIL_DESTINO` | `contacto@grupoexportadordelcampo.com` |
| `ADMIN_EMAIL` | Email del administrador del CMS |
| `ADMIN_PASSWORD` | Password inicial del admin |

5. Clic en **Deploy** → esperar ~2 minutos

### Activar Vercel Blob Storage (para imágenes del admin):
1. En el proyecto de Vercel → **Storage → Create Database → Blob**
2. El token `BLOB_READ_WRITE_TOKEN` se agrega automáticamente a las variables de entorno

---

## 5. Post-deploy — Correr migraciones y seed

Después del primer deploy exitoso, desde tu terminal local:

```bash
# Generar secret para NEXTAUTH_SECRET
openssl rand -base64 32

# Apuntar tu terminal a la BD de producción
export DATABASE_URL="tu-url-de-supabase"

# Correr migraciones de la BD
npx prisma migrate deploy

# Correr seed (crea admin y contenido inicial)
npm run db:seed
```

---

## 6. Dominio personalizado en Vercel

1. Vercel → proyecto → **Settings → Domains**
2. Agregar: `grupoexportadordelcampo.com` y `www.grupoexportadordelcampo.com`
3. Seguir instrucciones para apuntar los registros DNS
4. HTTPS se configura automáticamente por Vercel

---

## 7. Checklist post-deploy

### Funcionalidad
- [ ] Sitio carga en `https://grupoexportadordelcampo.com`
- [ ] Selector de idioma funciona (ES / EN / DE)
- [ ] Formulario de contacto envía email y guarda en BD
- [ ] Panel admin accesible en `/admin`
- [ ] Login del admin funciona
- [ ] Subir imagen desde `/admin/imagenes` funciona
- [ ] Imagen subida persiste tras un nuevo deploy (Vercel Blob)
- [ ] Noticias de LinkedIn se muestran correctamente

### Visual
- [ ] Logo GEK aparece en navbar y footer
- [ ] Navbar sticky funciona al hacer scroll
- [ ] Animaciones de entrada funcionan
- [ ] Sitio se ve bien en mobile

### Seguridad
- [ ] **Cambiar password del admin** tras el primer login
- [ ] `/admin` redirige a login si no hay sesión activa
- [ ] HTTPS activo (candado en el navegador)

---

## 8. Flujo de trabajo diario para el cliente

### 📰 Publicar una noticia de LinkedIn
1. Publicar el post en la página corporativa de LinkedIn
2. En el post: clic en `...` → **Embed this post**
3. Copiar **solo la URL** dentro del atributo `src="..."`
4. Ir a `/admin/noticias` → **Nueva noticia**
5. Pegar la URL de embed y dar un título descriptivo
6. Activar "Publicar en el sitio" → Guardar

### 🖼️ Subir fotografías
1. Ir a `/admin/imagenes`
2. Seleccionar la carpeta (Zacatecas, Holding, etc.)
3. Drag & drop o seleccionar archivos (JPG, PNG, WebP — máx 5MB)
4. Las fotos quedan guardadas en Vercel Blob (no se pierden con deploys)

### ✏️ Editar textos del sitio
1. Ir a `/admin/contenido`
2. Seleccionar la sección a editar
3. Modificar el texto en ES / EN / DE
4. Guardar campo por campo
