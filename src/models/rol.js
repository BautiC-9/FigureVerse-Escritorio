// Nota: tu BD NO tiene tabla 'rol'; el campo está embebido en usuario.
// Dejamos esta utilidad para validar/centralizar los valores posibles. Que nos ayudara a
// validar roles en middlewares y otros lugares.

// Definición de los roles permitidos en el sistema
const ROLES = ["super_admin", "admin", "usuario"];

module.exports = { ROLES };
