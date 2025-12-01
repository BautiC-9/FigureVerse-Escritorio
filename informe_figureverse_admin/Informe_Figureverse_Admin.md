# Informe Técnico – Figureverse Admin Desktop

## Resumen Ejecutivo
App de escritorio para administración Figureverse construida con Electron + React y un backend local Express. El frontend está modularizado por dominios (productos, pedidos, pagos, facturas, envíos, informes, soporte, reseñas, usuarios, carrito). El backend local orquesta routers y actúa como validador/proxy hacia la API remota (`API_BASE`). Empaquetado con `electron-builder` y arranque en desarrollo con backend local y React en paralelo.

## Arquitectura
- Electron main: crea ventana, menú y carga dev/prod en `public/electron.js:7–52` y tolera fallos `public/electron.js:85–91`.
- Preload seguro: expone `electronAPI` y handlers IPC en `public/preload.js:3–19`.
- Backend Express: servidor y montaje de routers en `escritorio/backend/server.js:17–125`; estáticos `/uploads` y healthcheck.
- Cliente HTTP central: `axios` con `API_BASE` en `escritorio/backend/lib/apiClient.js:4–13`.
- Frontend CRA: punto de entrada `src/index.js:1–7`; rutas protegidas y contexto de auth en `src/App.js:28–85`.

## Ejecución y Build
Scripts (`package.json:7–21`):
- `backend`: levanta Express local `http://localhost:4001`.
- `electron-dev`: corre backend (4001), React (3101) y abre Electron apuntando a `ELECTRON_START_URL`.
- `electron-prod`: build de React y ejecuta Electron con `file://`.
- `dist-*`: empaquetado multiplataforma con `electron-builder` (`package.json:43–58`).

## Autenticación
- Sesión en `sessionStorage` (`src/App.js:41–50`).
- Servicios leen token y lo envían en `Authorization: Bearer ...` (ej. `src/services/productosService.js:15–18`, `src/services/pagosService.js:23–27`).
- Perfil y contraseña desde `Layout` a endpoints de `API_BASE` (`src/modules/core/Layout.jsx:21–45`, `47–97`, `99–123`).

## Backend Local – Routers
- Pedidos (`escritorio/backend/routes/pedidos.js`):
  - Lista con filtros y normalización (`9–59`).
  - Historial tolerante a rutas alternativas (`104–118`).
  - Cambio de estado por número o texto (`120–133`).
- Productos (`escritorio/backend/routes/productos.js`): validadores crear/editar con checks numéricos positivos (`6–21`, `23–41`).
- Variantes (`escritorio/backend/routes/variantes.js`): tolera esquemas alternativos/`API_BASE_ALT` (`8–39`, `41–71`).
- Imágenes locales (`escritorio/backend/routes/localImages.js`): subida única/múltiple con límite de 3 y borrado físico (`26–59`, `61–79`, `81–110`).
- Pagos (`escritorio/backend/routes/pagos.js`):
  - Crear validado (`17–32`).
  - Consulta con enriquecimiento de cliente (`34–83`).
  - Listado admin con orden por fecha y enriquecimiento (`85–127`).
  - Simular aprobación: obtiene `code` y actualiza estado del pedido (`129–163`).
  - Aprobar pago: crea factura, genera PDF, envía email y marca enviada; deriva datos faltantes (`166–232`). Punto de interés: `escritorio/backend/routes/pagos.js:205` (`let pedidoResp = null`).
- Facturas (`escritorio/backend/routes/facturas.js`): estadísticas, listado, detalle, crear, marcar enviada, enviar email, generar PDF, búsqueda (`10–96`).
- Carrito (`escritorio/backend/routes/carrito.js`): rutas usuario/admin; Controller/Model/Service separados.
  - Controller: `escritorio/backend/controllers/carrito.controller.js:17–68`.
  - Modelo validaciones: `escritorio/backend/models/carrito.model.js:15–55`.
  - Servicio HTTP: `escritorio/backend/services/carrito.service.js:12–22`.

## Frontend – Módulos
- Layout: sidebar y gestión de perfil/contraseña (`src/modules/core/Layout.jsx:125–210`).
- Dashboard: estadísticas combinadas/fallback por período (`src/modules/core/Dashboard.jsx:26–81`).
- Productos:
  - Página: filtros, orden, paginación, stats, CRUD y categorías (`src/modules/productos/ProductosPage.jsx:36–55`, `65–92`, `93–107`, `108–143`, paneles/modales `145–261`).
  - Servicio: lista/obtener/crear/actualizar/eliminar con validador local (`src/services/productosService.js:21–88`).
- Pedidos:
  - Listado con filtros y “mis pedidos”; enriquecimiento usuario y método de pago (`src/modules/pedidos/PedidosPage.jsx:21–33`, `36–63`).
  - Servicio: listar, del usuario, obtener, historial, actualizar estado (`src/services/pedidosService.js:3–61`).
- Pagos:
  - Consulta y admin list; simular/aprobar pagos (`src/modules/pagos/PagosPage.jsx:16–33`, `35–45`, UI `50–156`).
  - Servicio: crear, simular, admin, consulta, aprobar (`src/services/pagosService.js:1–54`).
- Facturas:
  - Estadísticas, búsqueda y acciones: detalle, enviar email, marcar enviada, generar/descargar PDF/HTML (`src/modules/facturas/FacturasPage.jsx:23–44`, `45–77`, `85–115`, `116–151`, `560–644`).

## Flujos Destacados
- Aprobación de pago y post-procesamiento:
  1. Aprobar pago y derivar IDs/monto (`escritorio/backend/routes/pagos.js:166–204`).
  2. Obtener pedido y totales (`205–214`).
  3. Crear factura, generar PDF, enviar email, marcar enviada (`216–225`).
- Subida de imágenes: límite 3 por producto; posiciones libres y guardado físico (`escritorio/backend/routes/localImages.js:81–110`).
- Dashboard mensual: completa ingresos sumando facturas si falta (`src/modules/core/Dashboard.jsx:31–78`).

## Configuración y Entornos
- `API_BASE` backend remoto (`escritorio/backend/lib/apiClient.js:4`).
- `REACT_APP_API_URL` frontend API base (`src/App.js:22`).
- `REACT_APP_LOCAL_BACKEND_URL` backend local (`src/services/pedidosService.js:1`, `pagosService.js:1`).
- `API_BASE_ALT` variantes (`escritorio/backend/routes/variantes.js:6`).
- Estáticos: `uploads/productos/{id}/archivo` servidos en `/uploads` (`escritorio/backend/server.js:29–33`).
- Menú Electron: recarga/devtools/zoom/fullscreen (`public/electron.js:54–83`).

## Seguridad
- Tokens no se guardan en código; lectura dinámica desde `sessionStorage`.
- Validación de inputs positivos en backend local (productos, variantes, pagos).
- Sanitización de nombres de archivo de imágenes (`escritorio/backend/routes/localImages.js:19–22`).
- Normalización tolerante para APIs heterogéneas (`escritorio/backend/lib/utils.js:3–18`, `lib/pedidos.js:21–30`).

## Pruebas y Soporte
- Script de prueba de flujo de producto valida creación, rechazos, variantes, restricción de imágenes (`scripts/testProductoFlow.js:8–47`).
- Healthcheck backend local: `GET /health` (`escritorio/backend/server.js:110–113`).

## Operación en Desarrollo
- Iniciar backend local: `npm run backend`.
- Iniciar escritorio dev: `npm run electron-dev`.
- Empaquetar app: `npm run dist-win` (Windows), `dist-mac`, `dist-linux`.

## Referencias Rápidas
- Main Electron: `public/electron.js:7–19`.
- Preload/IPC: `public/preload.js:4–12`.
- Server Express (montaje): `escritorio/backend/server.js:69–101`.
- Pagos (simulación/aprobación): `escritorio/backend/routes/pagos.js:129–163`, `166–232` (punto clave `205`).
- Pedidos (estado): `escritorio/backend/routes/pedidos.js:120–133`.
- Imágenes locales: `escritorio/backend/routes/localImages.js:26–59`, `81–110`.
- Productos (servicio): `src/services/productosService.js:21–88`.
- Dashboard: `src/modules/core/Dashboard.jsx:26–81`.

## Anexo Detallado

### Electron
- Arranque y candidatos dev: detección de `ELECTRON_START_URL` y fallback a puertos comunes (`public/electron.js:14–27`).
- Estrategia de carga: intenta candidatos y si falla, usa `file://` (`public/electron.js:28–52`).
- Menú de aplicación: acciones de recarga, devtools, zoom y pantalla completa (`public/electron.js:54–83`).
- Tolerancia a errores: captura errores de carga y muestra ventana aunque falle (`public/electron.js:85–91`).
- IPC: canales registrados en preload y `ipcMain` para impresiones y operaciones críticas (si presentes) (`public/preload.js:3–19`).

### Backend Express
- Montaje de routers y documentación inline de endpoints (`escritorio/backend/server.js:61–101`).
- Estáticos de uploads: sirve imágenes locales de productos en `/uploads` con rutas físicas en `uploads/productos` (`escritorio/backend/server.js:29–33`).
- Healthcheck: respuesta de estado para monitoreo (`escritorio/backend/server.js:110–113`).
- Middleware de auth mínimo: asegura presencia de token y deja validación de rol al backend oficial (`escritorio/backend/middleware/auth.js:11–24`).

#### Pedidos
- Listado con filtros y normalización flexible: acepta esquemas alternativos (`escritorio/backend/routes/pedidos.js:9–59`).
- Detalle/Historial: rutas alternativas y agregación de estados (`104–118`).
- Cambio de estado: tanto por código numérico como por texto (`120–133`).
- Panel de detalle frontend: perfil del cliente, información de envío y opciones de estado (`src/modules/pedidos/PedidoDetailPanel.jsx:8–55`).

#### Productos
- Validación de creación/edición: precios/stock positivos y nombres requeridos (`escritorio/backend/routes/productos.js:6–41`).
- Servicio frontend: métodos CRUD con normalización (`src/services/productosService.js:21–88`).
- Estadísticas de productos: activos/inactivos, críticos, top categorías, variantes e imágenes por producto (`src/services/productoService.js:139–169`).

#### Variantes
- Ruta de validación con doble intento: `variantes_productos` y `variantes` (API alternativa) (`escritorio/backend/routes/variantes.js:1–39`, `27–71`).
- Servicio frontend con clientes alternativos y autenticación (`src/services/variantesService.js:1–33`).

#### Imágenes Locales
- Subida única y múltiple con límite de 3 por producto (`escritorio/backend/routes/localImages.js:61–79`, `81–110`).
- Borrado físico seguro (sanitización de nombres) (`19–22`, `26–59`).

#### Pagos
- Validador de creación con vinculación a pedido (`escritorio/backend/routes/pagos.js:17–32`).
- Consulta con enriquecimiento del nombre del cliente (`34–83`, enriquecimiento `67–83`).
- Admin listado paginado y ordenado por fecha (`85–127`).
- Simulación de aprobación: marca pago y actualiza estado del pedido (`129–163`).
- Aprobación real: deriva `id_pedido`, `id_pago`, `monto`, recupera pedido (`205`) y ejecuta pipeline de factura (crear → PDF → email → marcar enviada) (`166–232`).

#### Facturas
- Endpoints admin: estadísticas, listado, detalle, creación, marcar enviada, enviar email, generar PDF y búsqueda (`escritorio/backend/routes/facturas.js:10–96`).
- UI de facturas: acciones y descarga de PDF/HTML (`src/modules/facturas/FacturasPage.jsx:85–151`, `560–644`).

#### Carrito
- Patrón Controller/Model/Service separado:
  - Controller (`escritorio/backend/controllers/carrito.controller.js:17–68`).
  - Modelo (`escritorio/backend/models/carrito.model.js:15–55`).
  - Servicio (`escritorio/backend/services/carrito.service.js:12–22`).
- Rutas usuario y admin (`escritorio/backend/routes/carrito.js`, ver montaje `server.js:96–101`).

#### Envíos
- Router admin protegido (`escritorio/backend/routes/envio.routes.js:11–24`).
- Controller con CRUD, cambio de estado y generación para pedidos existentes (`escritorio/backend/controllers/envio.controller.js:8–96`).
- Servicio con validaciones y generación de envíos en lote (`escritorio/backend/services/envio.service.js:12–137`).
- Página de Envios: listado, cambio de estado con requerimiento de tracking, edición de dirección, impresión de etiquetas y historial (`src/modules/envios/EnviosPage.jsx:26–137`, tabla `141–211`, acciones `200–206`, modales `223–291`).
- Servicio frontend (`src/services/enviosService.js:1–46`).

#### Informes
- Router agrupado `/api/informe/*` (`escritorio/backend/routes/informe.routes.js:11–15`).
- Controller delega en servicio (`escritorio/backend/controllers/informe.controller.js:8–46`).
- Servicio: agregaciones por ventas/ganancias, logística, usuarios, productos y reseñas/soporte (`escritorio/backend/services/informe.service.js:31–220`).
- Modelo: obtención de datos crudos desde API oficial (`escritorio/backend/models/informe.model.js:10–50`).
- UI: panel de informes con fallbacks inteligentes cuando faltan métricas (`src/modules/informes/InformesPage.jsx:316–338`, continúa `338–...`).

#### Soporte
- Rutas de soporte con protección y mapeo (`escritorio/backend/routes/soporte.routes.js:11–26`).
- Controller: creación, listado con filtros, mis tickets, obtención, estadísticas con fallback, responder, prioridad y cerrar (`escritorio/backend/controllers/soporte.controller.js:10–58`).
- Servicio: encapsula llamadas al backend oficial (`escritorio/backend/services/soporte.service.js:14–37`).
- Servicio frontend (`src/services/soporteService.js:40–49`).

#### Reseñas
- Controller: crear, listar todas, por producto, obtener y actualizar (`escritorio/backend/controllers/resena.controller.js:10–34`).
- Servicio: centraliza HTTP (`escritorio/backend/services/resena.service.js:10–16`).
- Modelo: validaciones de creación/actualización (`escritorio/backend/models/resena.model.js:7–28`).
- UI: página de reseñas con enriquecimiento de nombre de producto y filtros (ver `src/modules/resenas/ResenasPage.jsx:58–73`).

### Frontend – Autenticación y Rutas
- Contexto de auth y protección de rutas (`src/App.js:28–85`).
- Tokens en `sessionStorage`, lectura segura en servicios (`src/services/*`).
- Perfil y contraseña en `Layout` (`src/modules/core/Layout.jsx:21–123`, UI `125–210`).

### Estilo y UX
- Íconos `lucide-react` para acciones (ej. `EnviosPage.jsx:3`).
- Notificaciones `sonner` para feedback (`EnviosPage.jsx:4`).
- Modales y tablas con estilos inline y clases reutilizadas (`EnviosPage.jsx:141–211`, `223–291`).

### Variables y Entornos
- `API_BASE` para backend oficial (`escritorio/backend/lib/apiClient.js:4`).
- `REACT_APP_API_URL` para frontend (`src/App.js:22`).
- `REACT_APP_LOCAL_BACKEND_URL` para servicios locales (`src/services/*`: pedidos/pagos/envíos).
- `API_BASE_ALT` para variantes (`escritorio/backend/routes/variantes.js:6`).
- `ELECTRON_START_URL` para dev (`public/electron.js:14–27`).

### Seguridad y Buenas Prácticas
- No se hardcodean tokens; se leen en tiempo de ejecución.
- Validaciones de números y requeridos en rutas de validación (productos, variantes, envíos, pagos).
- Sanitización de nombres de archivos de imágenes y límites de cantidad.
- Normalizaciones y tolerancia a esquemas heterogéneos en servicios y utils (`escritorio/backend/lib/utils.js:3–18`).

### Pruebas y Herramientas
- Flujo de prueba de producto (`scripts/testProductoFlow.js:8–47`).
- Healthcheck (`escritorio/backend/server.js:110–113`).
- Estadísticas y dashboards con fallbacks cuando la API no devuelve datos suficientes (`src/modules/core/Dashboard.jsx:26–81`, `src/modules/informes/InformesPage.jsx:316–338`).

### Operación
- Desarrollo: `npm run backend`, `npm run electron-dev`.
- Producción local: `npm run electron-prod`.
- Distribución: `npm run dist-win`, `dist-mac`, `dist-linux`.

### Puntos de Integración Clave
- Aprobación de pagos → creación/envío de factura (`escritorio/backend/routes/pagos.js:166–232`).
- Estado de pedidos y su interacción con envíos (`escritorio/backend/routes/pedidos.js:120–133`, `src/modules/pedidos/PedidoDetailPanel.jsx:55`).
- Generación y gestión de etiquetas de envío desde UI (`src/modules/envios/EnviosPage.jsx:114–126`, `254–263`).

### Riesgos y Mejoras Potenciales
- Unificación de esquemas: crear una capa de mapeo común para `id`/`id_*` y campos como `total_final`/`monto_total`.
- Manejo robusto de errores: centralizar formatos `{ ok, message, data }` en frontend y backend.
- Cache y memoización: evitar múltiples llamadas redundantes para estadísticas y listados.
- Paginación consistente: estandarizar `page`/`limit` en todos los servicios y UI.
- Pruebas E2E: agregar pruebas de integración para flujos de pago y envío.

## Panorama del Proyecto

### Estructura General
- Entradas: `public/electron.js`, `src/index.js`, `src/App.js`.
- Backend local: `escritorio/backend` con `server.js`, `routes/`, `controllers/`, `services/`, `models/`, `lib/`.
- Frontend: `src/modules/*` por dominio; `styles/` y `components` base.
- Cargas estáticas: `uploads/productos/{id}/{archivo}` servidas en `/uploads` (`escritorio/backend/server.js:29–33`).

### Scripts y Start-up
- `electron-dev`: levanta backend en `:4001`, frontend en `:3101`, espera ambos (`wait-on`) y arranca Electron con `ELECTRON_START_URL` (`package.json:14`).
- `electron-prod`: construye React y abre Electron con `file://` (`package.json:15`).
- `electron-pack`/`dist-*`: empaquetado con `electron-builder` (`package.json:16–20`).
- `test-flow`: prueba integral de producto y variantes (`package.json:21`, `scripts/testProductoFlow.js:8–47`).

### Dependencias
- Producción: `axios`, `express`, `cors`, `multer`, `react`, `react-router-dom`, `lucide-react`, `sonner`, `jspdf`, `jspdf-autotable` (`package.json:23–35`).
- Desarrollo: `electron`, `electron-builder`, `react-scripts`, `concurrently`, `wait-on` (`package.json:36–42`).

### Distribución
- Config de `electron-builder`: `appId`, `productName`, `output`, `files` y target `nsis` para Windows (`package.json:43–58`).
- Archivos incluidos: `build/**/*`, `node_modules/**/*`, `public/electron.js`, `public/preload.js` (`package.json:49–54`).

### Ruteo Completo Backend
- Pedidos: listar, detalle, historial, estado (`escritorio/backend/server.js:48–52`, montaje `69`).
- Validadores: productos y variantes (`server.js:53–57`, montaje `71–73`).
- Imágenes: upload, upload-multiple, delete (`server.js:58–61`, montaje `75–76`).
- Pagos: validator, consulta, admin, simular (`server.js:62–67`, montaje `78–79`).
- Envios: administrativo (`server.js:81–83`).
- Informe: `/api/informe/*` (`server.js:84–85`).
- Facturas: admin y acciones (`server.js:87–88`).
- Soporte: tickets y acciones (`server.js:90–91`).
- Reseñas: CRUD básico (`server.js:93–94`).
- Carrito: usuario/admin (`server.js:99–100`).
- Health: `GET /health` (`server.js:110–113`).
- 404: handler default (`server.js:115–118`).

### Frontend – Mapa de Rutas
- Protegidas dentro de `Layout`: `/` (Dashboard), `/productos`, `/facturas`, `/pedidos`, `/pagos`, `/envios`, `/informes`, `/carritos-admin`, `/carrito`, `/soporte`, `/resenas`, `/usuarios` (`src/App.js:63–78`).
- Login público: `/login` (`src/App.js:60–61`).

### Electron y Preload
- Candidatos dev y fallback a `file://` (`public/electron.js:21–34`, `31–44`).
- Menú con recarga/devtools/zoom/fullscreen (`public/electron.js:54–83`).
- Recuperación ante `did-fail-load` (`public/electron.js:85–91`).
- IPC: `get-app-version` manejado en main (`public/electron.js:108–111`); expuesto en `preload` junto con canales `app-update` y `auth-status` (`public/preload.js:4–12`, `15–18`).

### Normalización de Datos
- Utilidad `extractArray`: tolera múltiples esquemas (`escritorio/backend/lib/utils.js:3–18`).
- Dashboard e Informes: uso extensivo de normalización y fallbacks (`src/modules/core/Dashboard.jsx:83–101`, `102–107`, `109–139`; `escritorio/backend/services/informe.service.js:31–220`).

### Variables de Entorno
- `API_BASE`: backend oficial (`escritorio/backend/lib/apiClient.js:4`).
- `PORT`: puerto backend local (`escritorio/backend/server.js:19–22`).
- `REACT_APP_API_URL`: base de API en frontend (`src/App.js:22`).
- `REACT_APP_LOCAL_BACKEND_URL`: backend local para servicios (`src/services/*`).
- `API_BASE_ALT`: variantes alternativa (`escritorio/backend/routes/variantes.js:6`).
- `ELECTRON_START_URL`: URL dev para Electron (`public/electron.js:22–27`).
- `TEST_BEARER`: token para tests (`scripts/testProductoFlow.js:5–7`).

### Manejo de Errores
- Backend: respuestas `{ error }` uniformes y try/catch en routers y controllers (ej. `localImages.js:57–58`, `envio.controller.js:14–16`, `soporte.controller.js:31–43`).
- Frontend: UI muestra `error-box` y toasts (`src/modules/envios/EnviosPage.jsx:150–152`, `200–206`; `src/modules/core/Dashboard.jsx:160–171`).

### Estilos y UI
- Estilos base: `src/index.css` y módulos (ej. `src/styles/productos.css`, importado en `src/App.js:4`).
- Íconos `lucide-react` para accesibilidad y acciones (`EnviosPage.jsx:3`, `Layout.jsx:3`).
- `sonner` para notificaciones (`EnviosPage.jsx:4`).

### Pruebas
- `scripts/testProductoFlow.js`: valida creación de producto, rechazos por números negativos, creación de variante, límite de imágenes (3) (`8–47`).
- Salida y fallos controlados: `process.exit(1)` en error (`scripts/testProductoFlow.js:43–46`).

### Seguridad
- Tokens sólo en `sessionStorage`/headers; nunca hardcodeados.
- Validación de inputs numéricos y sanitización de nombres de archivo (`localImages.js:19–22`, validadores en `productos.js` y `variantes.js`).
- Middleware mínimo de auth (token requerido) (`escritorio/backend/middleware/auth.js:11–24`).

### Flujos UI Adicionales
- Pagos: consulta, listado admin, simulación y aprobación desde UI (`src/modules/pagos/PagosPage.jsx:16–45`, tablas `78–106`, `114–142`).
- Servicios de pagos: validator, simulación, admin list, consulta y aprobación (`src/services/pagosService.js:3–54`).
- Perfil y contraseña: edición desde `Layout` con validación de campos (`src/modules/core/Layout.jsx:21–45`, `99–123`, UI `125–210`).
