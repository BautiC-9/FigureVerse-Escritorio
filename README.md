# Figureverse Admin Escritorio ⚡🛍️

Aplicación de escritorio para administración integral de la tienda Figureverse. Incluye paneles de productos, pedidos, pagos, envíos, facturas, informes, reseñas, carritos y soporte. Construida con Electron + React para escritorio y un backend local en Express que valida y orquesta operaciones contra la API oficial.

## 🚀 Introducción

- Objetivo: centralizar la gestión administrativa en una app de escritorio con experiencia rápida y segura.
- Tecnologías clave: `Electron` (proceso principal), `React` (interfaz), `Express` (backend local), `Axios` (HTTP), `lucide-react` (iconos), `sonner` (notificaciones), `date-fns` (fechas).
- Seguridad: `contextIsolation` y `preload` para exponer API segura (public/preload.js:3–19), token en `sessionStorage` reenviado como `Authorization` hacia la API oficial.

## 🔗 Repositorios y Conexiones

Los siguientes enlaces son los oficiales provistos por el proyecto:

| 📦 Módulo                 | 🔗 Repositorio                                           | 🧭 Rol en el ecosistema                 |
| ------------------------- | -------------------------------------------------------- | --------------------------------------- |
| 🌐 Web de productos       | `https://github.com/Arhiell/FigureVerse_Web.git`         | Catálogo, compras y experiencia cliente |
| ⚡ Escritorio (este repo) | `https://github.com/BautiC-9/FigureVerse-Escritorio.git` | Administración: paneles y operaciones   |
| 🟩 API en Node            | `https://github.com/Arhiell/FigureVerse-API.git`         | Núcleo de datos y endpoints oficiales   |
| 🐍 API en Django          | `https://github.com/Arhiell/FigureVerse_API_Python.git`  | Integración Cloud Functions y Gemini    |

Conexión entre módulos:

- La app de escritorio consume la API oficial (`REACT_APP_API_URL`) y utiliza un backend local en `Express` para validaciones y compatibilidad (escritorio/backend/server.js:13–23, 69–101).
- El `preload` expone una API mínima segura para el renderer (public/preload.js:3–19) y el proceso principal define ventana, menú y devtools (public/electron.js:7–52).

## 🧱 Arquitectura

- Frontend: React modular por dominios (`src/modules/*`) con ruteo protegido y `AuthContext` (src/App.js:25, 63–81).
- Backend local: Express con routers por dominio (escritorio/backend/server.js:35–46) y cliente HTTP centralizado (escritorio/backend/lib/apiClient.js:4–12).
- Electron: proceso principal crea `BrowserWindow`, carga URL dev o `build`, menú y comunicación IPC (public/electron.js:7–52, 108–111).
- Integración: capa de servicios en el frontend que valida y normaliza respuestas (src/services/productosService.js:21–88).

| 🧩 Capa           | 📁 Ubicación           | 🔌 Responsabilidad                        |
| ----------------- | ---------------------- | ----------------------------------------- |
| Proceso principal | `public/electron.js`   | Ventana, menú, carga dev/prod, IPC        |
| Preload seguro    | `public/preload.js`    | API limitada `electronAPI` hacia renderer |
| Interfaz (UI)     | `src/modules/*`        | Páginas y paneles por dominio             |
| Ruteo y auth      | `src/App.js`           | Protección, sesión en `sessionStorage`    |
| Servicios HTTP    | `src/services/*`       | Llamadas a API y validaciones locales     |
| Backend Express   | `escritorio/backend/*` | Routers, validadores y compatibilidad     |

## 🧭 Modelo de diseño

- Backend: patrón MVC + Service Layer.
  - `routes/` exponen endpoints (ej: escritorio/backend/routes/pedidos.js:9–59, 120–133).
  - `controllers/` orquestan casos de uso.
  - `services/` encapsulan lógica de negocio y validaciones.
  - `models/` definen entidades utilizadas por los controladores.
- Frontend: composición modular por página, servicios desacoplados (`axios`) y contexto de autenticación mínimo (`AuthContext`).
- Electron: separación estricta `main`/`renderer` con `contextIsolation: true` y `preload`.

## 🖥️ Frontend (React)

- Rutas principales en `src/App.js` con protección de acceso y redirecciones (src/App.js:60–81).
- Módulos disponibles: productos, pedidos, pagos, envíos, facturas, informes, carritos, soporte, reseñas, usuarios.
- Notificaciones y UX: `sonner` para feedback (src/App.js:57).

| 📄 Página        | 📁 Archivo                                  |
| ---------------- | ------------------------------------------- |
| Dashboard        | `src/modules/core/Dashboard.jsx`            |
| Login            | `src/modules/core/Login.jsx`                |
| Productos        | `src/modules/productos/ProductosPage.jsx`   |
| Pedidos          | `src/modules/pedidos/PedidosPage.jsx`       |
| Pagos            | `src/modules/pagos/PagosPage.jsx`           |
| Facturas         | `src/modules/facturas/FacturasPage.jsx`     |
| Informes         | `src/modules/informes/InformesPage.jsx`     |
| Envios           | `src/modules/envios/EnviosPage.jsx`         |
| Carritos (admin) | `src/modules/carrito/CarritosAdminPage.jsx` |
| Reseñas          | `src/modules/resenas/ResenasPage.jsx`       |
| Soporte          | `src/modules/soporte/SoportePage.jsx`       |
| Usuarios         | `src/modules/usuarios/UsuariosPage.jsx`     |

## 🛠️ Backend local (Express)

- Servidor modular con routers por dominio (escritorio/backend/server.js:35–46, 69–101).
- Endpoints de salud y utilidades (escritorio/backend/server.js:110–123, 102–108).
- Middleware de autenticación mínimo para presencia de token (escritorio/backend/middleware/auth.js:11–24).

| 🧪 Dominio            | 📁 Router                                     | 🔎 Resumen                                    |
| --------------------- | --------------------------------------------- | --------------------------------------------- |
| Pedidos               | `escritorio/backend/routes/pedidos.js`        | Listado, detalle, historial, cambio de estado |
| Productos (validator) | `escritorio/backend/routes/productos.js`      | Alta/edición con validaciones                 |
| Variantes (validator) | `escritorio/backend/routes/variantes.js`      | Alta/edición de variantes                     |
| Imágenes locales      | `escritorio/backend/routes/localImages.js`    | Subida única/múltiple y borrado               |
| Pagos                 | `escritorio/backend/routes/pagos.js`          | Consulta, listado admin, simulación           |
| Envios                | `escritorio/backend/routes/envio.routes.js`   | Administración de envíos                      |
| Informes              | `escritorio/backend/routes/informe.routes.js` | Endpoints bajo `/api/informe`                 |
| Facturas              | `escritorio/backend/routes/facturas.js`       | Listado y acciones de facturas                |
| Soporte               | `escritorio/backend/routes/soporte.routes.js` | Tickets y acciones de admin                   |
| Reseñas               | `escritorio/backend/routes/resena.routes.js`  | CRUD de reseñas                               |
| Carrito               | `escritorio/backend/routes/carrito.js`        | Operaciones de carrito                        |

## ⚡ Electron

- Ventana principal, menú y carga condicionada por entorno (public/electron.js:21–31, 44–52, 54–83).
- IPC seguro para exponer versión de la app (public/electron.js:108–111) y API en `preload` (public/preload.js:3–19).

## 🔧 Variables de entorno

| 🔑 Variable                   | 📝 Descripción                                       | 🔁 Valor por defecto                   |
| ----------------------------- | ---------------------------------------------------- | -------------------------------------- |
| `REACT_APP_API_URL`           | Base URL de la API oficial consumida por el frontend | `http://localhost:3000/api`            |
| `REACT_APP_LOCAL_BACKEND_URL` | URL del backend local Express usado por servicios    | `http://localhost:4001`                |
| `API_BASE`                    | Base URL usada por el backend local para proxyear    | `http://localhost:3000/api`            |
| `PORT`                        | Puerto del backend local                             | `4001`                                 |
| `ELECTRON_START_URL`          | URL del frontend en dev para Electron                | `http://localhost:3101` (según script) |
| `TEST_BEARER`                 | Token opcional para el script de test                | Vacío                                  |

## 📜 Scripts de ejecución

| ▶️ Script                                               | 🛠️ Acción                                        |
| ------------------------------------------------------- | ------------------------------------------------ |
| `npm run start`                                         | Inicia React en modo desarrollo                  |
| `npm run backend`                                       | Levanta Express local (`http://localhost:4001`)  |
| `npm run electron`                                      | Ejecuta Electron apuntando a `build/`            |
| `npm run electron-dev`                                  | Arranca backend + frontend dev y abre Electron   |
| `npm run electron-prod`                                 | Construye frontend y abre Electron en producción |
| `npm run electron-pack`                                 | Build + empaquetado con `electron-builder`       |
| `npm run dist` / `dist-win` / `dist-mac` / `dist-linux` | Genera instaladores por OS                       |
| `npm run test-flow`                                     | Ejecuta prueba integral de flujo de producto     |

## 📦 Dependencias principales

| 📛 Paquete            | 🔢 Versión     | 🧰 Uso                |
| --------------------- | -------------- | --------------------- |
| ⚛️ `react`            | `^18.3.1`      | UI y manejo de estado |
| 🖥️ `react-dom`        | `^18.3.1`      | Render en DOM         |
| 🧭 `react-router-dom` | `^6.30.2`      | Ruteo protegido       |
| 🚀 `axios`            | `^1.13.2`      | Cliente HTTP          |
| 🚂 `express`          | `^4.19.2`      | Backend local         |
| 🗂️ `multer`           | `^1.4.5-lts.1` | Subida de archivos    |
| 🗓️ `date-fns`         | `^2.29.3`      | Utilidades de fecha   |
| 🧾 `jspdf`            | `^3.0.4`       | Generación de PDFs    |
| 📊 `jspdf-autotable`  | `^5.0.2`       | Tablas en PDF         |
| 🖼️ `lucide-react`     | `^0.263.1`     | Iconos en UI          |
| 🔔 `sonner`           | `^0.4.0`       | Notificaciones        |

### 🧪 DevDependencies

| 📛 Paquete            | 🔢 Versión | 🧰 Uso                        |
| --------------------- | ---------- | ----------------------------- |
| ⚡ `electron`         | `^22.0.0`  | Runtime de escritorio         |
| 🧱 `electron-builder` | `^24.0.0`  | Empaquetado y distribución    |
| 🔁 `concurrently`     | `^7.6.0`   | Orquestar procesos en dev     |
| 🌍 `cross-env`        | `^10.1.0`  | Variables de entorno cross-OS |
| ⏳ `wait-on`          | `^7.2.0`   | Espera de recursos HTTP       |
| ⚙️ `react-scripts`    | `^5.0.1`   | Tooling CRA                   |

## 🗂️ Estructura de carpetas

| 📁 Carpeta        | 📍 Ruta               | 🧭 Descripción                         |
| ----------------- | --------------------- | -------------------------------------- |
| Proceso principal | `public/`             | `electron.js`, `preload.js`            |
| Interfaz          | `src/`                | `App.js`, módulos y servicios          |
| Backend local     | `escritorio/backend/` | Routers, controllers, models, services |
| Scripts           | `scripts/`            | `testProductoFlow.js`                  |
| Distribución      | `build/`, `dist/`     | Artefactos de build y instaladores     |

## 🔐 Autenticación y seguridad

- Token `Bearer` leído desde `sessionStorage` en frontend y reenviado como `Authorization` (src/services/productosService.js:15–19, 59–67, 72–80).
- Middleware mínimo garantiza presencia de token antes de proxyear (escritorio/backend/middleware/auth.js:11–24).
- Electron con `contextIsolation: true` y `preload` expone solo funciones permitidas (public/electron.js:13–17, public/preload.js:3–19).

## 🧪 Prueba integral del flujo de producto

- Script: `scripts/testProductoFlow.js` valida creación de producto, variantes e imágenes y rechazos esperados.
- Comando: `npm run test-flow`
- Referencias: scripts/testProductoFlow.js:11–22, 23–30, 33–41.

## 🧭 Instalación y ejecución

- Requisitos: Node.js, npm.
- Desarrollo en escritorio:
  1. `npm install`
  2. `npm run electron-dev`
- Producción local:
  1. `npm run electron-prod`
  2. Opcional: `npm run dist` para generar instalador.

## 👥 Créditos

Universidad Tecnológica Nacional (UTN) — Facultad Regional Resistencia

Carrera: Técnico Universitario en Programación

Autores:

- Ayala, Ariel: `https://github.com/Arhiell`
- Capovilla, Bautista: `https://github.com/BautiC-9`

Profesores de la cátedra:

- Python: Goya, Juan Manuel.
- JavaScript: Puljiz, Emilio.
