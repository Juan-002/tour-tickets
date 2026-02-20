#  TourTix

Plataforma de venta de tiquetes para tours. Permite a los usuarios explorar tours disponibles, comprar tiquetes y gestionar sus compras. Incluye un panel de administración completo para gestionar tours y ventas.

---

##  Cómo levantar el proyecto

### Requisitos previos

- Node.js 18+
- PostgreSQL (local o en la nube)
- npm o yarn

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd tour-tickets
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/tourtix"

# JWT — genera una clave segura con el siguiente comando:
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET="tu-clave-secreta-de-64-caracteres"
```

### 4. Configurar la base de datos

```bash
# Ejecutar migraciones
npx prisma migrate dev

# Poblar la base de datos con datos de prueba
npm run seed
```

### 5. Levantar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000).

---

##  Credenciales de prueba

| Rol    | Email                  | Contraseña   |
|--------|------------------------|--------------|
| Admin  | admin@tourtix.co       | admin123     |
| Usuario | juan@example.com      | password123  |
| Usuario | maria@example.com     | password123  |

---

##  Estructura del proyecto

```
src/
├── app/
│   ├── (public)/          # Páginas públicas (tours, checkout, mis tiquetes)
│   ├── (auth)/            # Páginas de autenticación (login, registro)
│   ├── (admin)/           # Panel de administración
│   └── api/               # API Routes (tours, tickets, auth)
├── components/
│   ├── layout/            # Navbar, layouts compartidos
│   ├── tours/             # TourCard y componentes de tours
│   ├── checkout/          # Formulario de compra
│   └── ui/                # Botones de acción reutilizables
├── lib/
│   ├── auth.ts            # JWT, sesiones, cookies
│   └── prisma.ts          # Cliente de Prisma
├── services/
│   ├── tourService.ts     # Lógica de negocio de tours
│   └── ticketService.ts   # Lógica de negocio de tiquetes
└── types/
    └── index.ts           # Interfaces y tipos TypeScript
```

---

## 🏗️ Stack tecnológico

| Tecnología     | Uso                                  |
|----------------|--------------------------------------|
| Next.js 14     | Framework principal (App Router)     |
| TypeScript     | Tipado estático                      |
| Prisma         | ORM para base de datos               |
| PostgreSQL     | Base de datos relacional             |
| Tailwind CSS   | Estilos utilitarios                  |
| bcryptjs       | Hash de contraseñas                  |
| jose           | Manejo de JWT                        |

---

##  Decisiones técnicas

### Autenticación con JWT sobre Sessions

Se optó por **JWT stateless** en lugar de sesiones con base de datos por dos razones: compatibilidad con el modelo serverless de Vercel (sin estado entre peticiones) y eliminación de una tabla de sesiones en la base de datos. El token se almacena en una cookie `httpOnly` con expiración de 7 días, protegida contra XSS.

### Route Groups en Next.js

Se usaron **route groups** `(public)`, `(auth)` y `(admin)` para separar los layouts sin afectar las rutas. Esto permite que:
- Las páginas públicas tengan navbar y footer con sesión.
- Login y registro no tengan ningún chrome de navegación.
- El admin tenga su propio sidebar sin heredar el navbar público.

### bcrypt con 10 rondas

Se eligieron **10 rondas de bcrypt** como balance estándar entre seguridad y rendimiento. Menos rondas sacrifican seguridad; más rondas aumentan la latencia en login sin beneficio práctico para este tipo de aplicación.

### Prisma como ORM

**Prisma** ofrece tipado automático desde el schema, migraciones versionadas y un cliente con autocompletado. Se prefirió sobre consultas SQL directas para reducir errores y acelerar el desarrollo.

### Server Components + Client Components

Las páginas que requieren datos de sesión o base de datos son **Server Components** para evitar waterfalls de red. Los componentes interactivos (formularios, menús, cards expandibles) son **Client Components** con `"use client"`. Esta separación mejora el tiempo de carga inicial y el SEO.

### Diseño responsivo: cards en móvil, tablas en desktop

Para las vistas de administración se implementó un patrón de **doble layout**: tablas en desktop (`hidden md:block`) y cards apiladas en móvil (`md:hidden`). Las tablas en pantallas pequeñas siempre generan overflow horizontal — las cards son más legibles y táctiles.

### Campos de detalle en el Tour

Se agregaron campos adicionales al modelo `Tour` (`petsAllowed`, `kidsAllowed`, `hasTransport`, `hasLodging`, `lodgingType`, `nights`) para enriquecer la página de detalle sin requerir tablas relacionales adicionales. Son booleanos simples que el admin activa/desactiva desde el formulario.

### Truncado de texto por caracteres vs CSS clamp

Para las TourCards se usó **truncado por caracteres en JavaScript** (`slice`) en lugar de `-webkit-line-clamp` de CSS. El clamp de CSS afecta el layout del grid porque colapsa elementos de altura variable de forma impredecible. El truncado en JS garantiza cards de altura uniforme con un botón "Ver más" consistente.

---

##  Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción
npm run start      # Servidor de producción
npm run seed       # Poblar base de datos con datos de prueba
npx prisma studio  # Interfaz visual de la base de datos
```

---

##  Seguridad

- Contraseñas hasheadas con bcrypt (10 rondas).
- JWT firmado con HS256 y clave de 64 bytes.
- Cookie `httpOnly` — inaccesible desde JavaScript del cliente.
- Cookie `secure` en producción — solo HTTPS.
- Rutas de admin protegidas verificando el rol `ADMIN` en cada carga.
- Validación de inputs con Zod en todos los endpoints de la API.

---

##  Deploy en Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Agrega las variables de entorno `DATABASE_URL` y `JWT_SECRET` en el panel de Vercel.
3. Asegúrate de que tu base de datos PostgreSQL sea accesible desde internet (recomendado: [Neon](https://neon.tech) o [Supabase](https://supabase.com)).
4. Vercel detecta Next.js automáticamente y configura el build.

```bash
# Si usas Neon o Supabase, el DATABASE_URL tiene este formato:
postgresql://usuario:contraseña@host.neon.tech/tourtix?sslmode=require
```