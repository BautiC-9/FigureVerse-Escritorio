// Middleware de autenticación y autorización por rol

// Este middleware verifica si el usuario está autenticado y si tiene el rol adecuado
module.exports = {
  // Verifica que el usuario esté autenticado
  verificarAuth: (req, res, next) => {
    // Suponemos que req.user se establece en algún middleware de autenticación previo
    // El if (!req.user) verifica si el usuario está autenticado
    if (!req.user) {
      // Si no está autenticado, respondemos con 401 Unauthorized y un mensaje JSON
      return res
        .status(401)
        .json({ message: "No autorizado. Inicia sesión primero." });
    }

    // Si está autenticado, llamamos a next() para pasar al siguiente middleware o ruta
    next();
  },

  // Verifica que el usuario tenga rol admin o super_admin
  soloAdmins: (req, res, next) => {
    // En el If verificamos si el usuario tiene el rol adecuado
    if (!req.user || !["admin", "super_admin"].includes(req.user.rol)) {
      // Si no tiene el rol adecuado, respondemos con 403 Forbidden y un mensaje JSON
      return res.status(403).json({
        message:
          "Acceso denegado. Solo administradores pueden realizar esta acción.",
      });
    }
    // Si está autenticado, llamamos a next() para pasar al siguiente middleware o ruta
    next();
  },
};
