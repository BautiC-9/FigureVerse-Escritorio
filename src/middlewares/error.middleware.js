// NOTA: Esto caso de errores de ejemplo después estar todo completo la API
// nos enfocaremos a resolver bien los puntos centrales

// Cosos de Errores comunes y manejo centralizado
const { ValidationError } = require("sequelize");

function errorHandler(err, req, res, next) {
  console.error("Error detectado:", err);

  // Caso de Errores de Validaciones.
  // En ella se capturan los errores de validación de los modelos y se responde con un 400 Bad Request

  // El if verifica si el error es una instancia de ValidationError
  if (err instanceof ValidationError) {
    // Mapeamos los errores para extraer solo los errores de validación
    const errores = err.errors.map((e) => e.message);

    // Respondemos con un 400 Bad Request y un objeto JSON con los detalles del error
    return res.status(400).json({
      status: "error",
      message: "Error de validación de datos",
      // El array de mensajes de error.
      errors: errores,
    });
  }

  // CASO: Errores de autenticación (JWT inválido o expirado)

  // En el if verificamos si el error es un error de JWT
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    // Respondemos con un 401 Unauthorized y un mensaje JSON
    return res.status(401).json({
      status: "error",
      message: "Token inválido o expirado. Inicia sesión nuevamente.",
    });
  }

  // CASO: Errores de autorización (403 Forbidden) y permisos insuficientes
  // En el if verificamos si el error tiene un status 403
  if (err.status === 403) {
    // En caso de ser 403, respondemos con 403 Forbidden y un mensaje JSON
    return res.status(403).json({
      status: "error",

      // Mensaje del error o un mensaje por defecto
      message: err.message || "Acceso denegado.",
    });
  }

  // CASO: Los recursos no encontrasodos (404 Not Found)
  // En el if verificamos si el error tiene un status 404
  if (err.status === 404) {
    // Respondemos con un 404 Not Found y un mensaje JSON
    return res.status(404).json({
      status: "error",
      // Mensaje del error o un mensaje por defecto
      message: err.message || "Recurso no encontrado.",
    });
  }

  // CASO: Erores de Servidores o de Base de Datos (500 Internal Server Error)
  // En este caso, respondemos con un 500 Internal Server Error y un mensaje JSON
  return res.status(500).json({
    status: "error",
    message: "Error interno del servidor. Intenta nuevamente.",
    // Si estamos en desarrollo, incluimos el detalle del error para facilitar la depuración
    detalle: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
}

module.exports = errorHandler;
