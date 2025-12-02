# Figureverse Admin Escritorio ⚡🛍️

| 📝 Descripción |
| --- |
| Aplicación de escritorio para administración integral de la tienda Figureverse. Incluye paneles de productos, pedidos, pagos, envíos, facturas, informes, reseñas, carritos y soporte. Construida con Electron + React para escritorio y un backend local en Express que valida y orquesta operaciones contra la API oficial. |

## 🚀 Introducción

| 🔍 Aspecto | 📋 Detalle |
| --- | --- |
| 🎯 Objetivo | Centralizar la gestión administrativa con desempeño y seguridad |
| 🧰 Tecnologías | `Electron`, `React`, `Express`, `Axios`, `lucide-react`, `sonner`, `date-fns` |
| 🔒 Seguridad | `contextIsolation`, `preload` seguro (public/preload.js:3–19), token `Authorization` desde `sessionStorage` |

## 🔗 Repositorios y Conexiones

| 📦 Módulo | 🔗 Repositorio | 🧭 Rol en el ecosistema |
| --- | --- | --- |
| 🌐 Web de productos | `https://github.com/Arhiell/FigureVerse_Web.git` | Catálogo, compras y experiencia cliente |
| ⚡ Escritorio (este repo) | `https://github.com/BautiC-9/FigureVerse-Escritorio.git` | Administración: paneles y operaciones |
| 🟩 API en Node | `https://github.com/Arhiell/FigureVerse-API.git` | Núcleo de datos y endpoints oficiales |
| 🐍 API en Django | `https://github.com/Arhiell/FigureVerse_API_Python.git` | Integración Cloud Functions y Gemini |

| 🔌 Relación | 📋 Detalle |
| --- | --- |
| Frontend a API | Consume `REACT_APP_API_URL`; valida/compatibiliza mediante Express local |
| Electron y Renderer | `preload` expone API mínima segura; main define ventana/menú/devtools |

## 🧱 Arquitectura

| 🧩 Capa | 📁 Ubicación | 🔌 Responsabilidad |
| --- | --- | --- |
| Frontend | `src/modules/*` | Ruteo protegido y `AuthContext` (src/App.js:25, 63–81) |
| Backend local | `escritorio/backend/*` | Routers por dominio y cliente HTTP central |
| Electron | `public/electron.js` | `BrowserWindow`, menú, carga dev/prod, IPC |
| Integración | `src/services/*` | Validaciones y normalización de respuestas |

| 🧩 Capa           | 📁 Ubicación           | 🔌 Responsabilidad                        |
| ----------------- | ---------------------- | ----------------------------------------- |
| Proceso principal | `public/electron.js`   | Ventana, menú, carga dev/prod, IPC        |
| Preload seguro    | `public/preload.js`    | API limitada `electronAPI` hacia renderer |
| Interfaz (UI)     | `src/modules/*`        | Páginas y paneles por dominio             |
| Ruteo y auth      | `src/App.js`           | Protección, sesión en `sessionStorage`    |
| Servicios HTTP    | `src/services/*`       | Llamadas a API y validaciones locales     |
| Backend Express   | `escritorio/backend/*` | Routers, validadores y compatibilidad     |

## 🧭 Modelo de diseño

| 🧠 Capa | 🏗️ Patrón | 📋 Detalle |
| --- | --- | --- |
| Backend | MVC + Service Layer | `routes/`, `controllers/`, `services/`, `models/` |
| Frontend | Modular por dominio | Servicios desacoplados (`axios`), `AuthContext` mínimo |
| Electron | Main/Renderer aislados | `contextIsolation: true` y `preload` seguro |

## 🖥️ Frontend (React)

| 🔍 Aspecto | 📋 Detalle |
| --- | --- |
| Rutas y protección | `src/App.js` con redirecciones y protección (60–81) |
| Módulos | productos, pedidos, pagos, envíos, facturas, informes, carritos, soporte, reseñas, usuarios |
| UX | `sonner` para notificaciones |

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

| 🔍 Aspecto | 📋 Detalle |
| --- | --- |
| Routers por dominio | Ver montaje en servidor (35–46, 69–101) |
| Salud/utilidades | `/health` (110–123) y validación positiva (102–108) |
| Autenticación | Presencia de token (middleware 11–24) |

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

| 🔍 Aspecto | 📋 Detalle |
| --- | --- |
| Ventana y menú | `BrowserWindow`, menú y carga dev/prod (21–31, 44–83) |
| IPC | Versión de app por IPC (108–111); API segura en `preload` (3–19) |

## 🔧 Variables de entorno

| 🔑 Variable | 📝 Descripción | 🔁 Valor por defecto |
| --- | --- | --- |
| `REACT_APP_API_URL` | Base URL de la API oficial consumida por el frontend | `http://localhost:3000/api` |
| `REACT_APP_LOCAL_BACKEND_URL` | URL del backend local Express usado por servicios | `http://localhost:4001` |
| `API_BASE` | Base URL usada por el backend local para proxyear | `http://localhost:3000/api` |
| `PORT` | Puerto del backend local | `4001` |
| `ELECTRON_START_URL` | URL del frontend en dev para Electron | `http://localhost:3101` (según script) |
| `TEST_BEARER` | Token opcional para el script de test | Vacío |

## 📜 Scripts de ejecución

| ▶️ Script | 🛠️ Acción |
| --- | --- |
| `npm run start` | Inicia React en modo desarrollo |
| `npm run backend` | Levanta Express local (`http://localhost:4001`) |
| `npm run electron` | Ejecuta Electron apuntando a `build/` |
| `npm run electron-dev` | Arranca backend + frontend dev y abre Electron |
| `npm run electron-prod` | Construye frontend y abre Electron en producción |
| `npm run electron-pack` | Build + empaquetado con `electron-builder` |
| `npm run dist` / `dist-win` / `dist-mac` / `dist-linux` | Genera instaladores por OS |
| `npm run test-flow` | Prueba integral de flujo de producto |

## 📦 Dependencias principales

| 📛 Paquete | 🔢 Versión | 🧰 Uso |
| --- | --- | --- |
| ⚛️ `react` | `^18.3.1` | UI y manejo de estado |
| 🖥️ `react-dom` | `^18.3.1` | Render en DOM |
| 🧭 `react-router-dom` | `^6.30.2` | Ruteo protegido |
| 🚀 `axios` | `^1.13.2` | Cliente HTTP |
| 🚂 `express` | `^4.19.2` | Backend local |
| 🗂️ `multer` | `^1.4.5-lts.1` | Subida de archivos |
| 🗓️ `date-fns` | `^2.29.3` | Utilidades de fecha |
| 🧾 `jspdf` | `^3.0.4` | Generación de PDFs |
| 📊 `jspdf-autotable` | `^5.0.2` | Tablas en PDF |
| 🖼️ `lucide-react` | `^0.263.1` | Iconos en UI |
| 🔔 `sonner` | `^0.4.0` | Notificaciones |

### 🧪 DevDependencies

| 📛 Paquete | 🔢 Versión | 🧰 Uso |
| --- | --- | --- |
| ⚡ `electron` | `^22.0.0` | Runtime de escritorio |
| 🧱 `electron-builder` | `^24.0.0` | Empaquetado y distribución |
| 🔁 `concurrently` | `^7.6.0` | Orquestar procesos en dev |
| 🌍 `cross-env` | `^10.1.0` | Variables de entorno cross-OS |
| ⏳ `wait-on` | `^7.2.0` | Espera de recursos HTTP |
| ⚙️ `react-scripts` | `^5.0.1` | Tooling CRA |

## 🗂️ Estructura de carpetas

| 📁 Carpeta | 📍 Ruta | 🧭 Descripción |
| --- | --- | --- |
| Proceso principal | `public/` | `electron.js`, `preload.js` |
| Interfaz | `src/` | `App.js`, módulos y servicios |
| Backend local | `escritorio/backend/` | Routers, controllers, models, services |
| Scripts | `scripts/` | `testProductoFlow.js` |
| Distribución | `build/`, `dist/` | Artefactos de build y instaladores |

## 🔐 Autenticación y seguridad

| 🔍 Aspecto | 📋 Detalle |
| --- | --- |
| Token `Bearer` | `sessionStorage` → cabecera `Authorization` en servicios |
| Middleware | Verificación de token antes de proxyear |
| Electron | `contextIsolation: true` y API limitada en `preload` |

## 🧪 Prueba integral del flujo de producto

| 🔍 Elemento | 📋 Detalle |
| --- | --- |
| Script | `scripts/testProductoFlow.js` valida producto, variantes e imágenes |
| Comando | `npm run test-flow` |
| Referencias | 11–22 (producto), 23–30 (variantes), 33–41 (imágenes) |

## 🧭 Instalación y ejecución

| ⚙️ Entorno | 🪜 Paso | ▶️ Comando |
| --- | --- | --- |
| Requisitos | Instalación | Node.js y npm |
| Desarrollo | Dependencias | `npm install` |
| Desarrollo | Ejecutar | `npm run electron-dev` |
| Producción | Ejecutar | `npm run electron-prod` |
| Producción | Instalador (opcional) | `npm run dist` |

## 👥 Créditos

| 🎓 Institución | 🏫 Facultad | 🎯 Carrera |
| --- | --- | --- |
| Universidad Tecnológica Nacional (UTN) | Facultad Regional Resistencia | Técnico Universitario en Programación |

| 🧑‍💻 Autor | 🔗 GitHub |
| --- | --- |
| Ayala, Ariel | `https://github.com/Arhiell` |
| Capovilla, Bautista | `https://github.com/BautiC-9` |

| 👨‍🏫 Cátedra | 👤 Profesor |
| --- | --- |
| Python | Goya, Juan Manuel |
| JavaScript | Puljiz, Emilio |
