const express = require("express");
const usuarioRoutes = require("./usuario.routes");
const peliculaRoutes = require("./peliculas.routes");
const generoRoutes = require("./genero.routes");
const calificacionRoutes = require("./calificacion.routes");
const favoritoRoutes = require("./favorito.routes");

const router = express.Router();

router.use("/usuarios", usuarioRoutes);
router.use("/peliculas", peliculaRoutes);
router.use("/generos", generoRoutes);
router.use("/calificaciones", calificacionRoutes);
router.use("/favoritos", favoritoRoutes);

module.exports = router;
