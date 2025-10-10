const router = require('express').Router();
const favoritoController = require("../controllers/favorito.controller");

// GET /api/favoritos
router.get("/usuarios/:id_usuario/favoritos", favoritoController.listarFavoritosUsuario);

// POST /api/favoritos
router.post("/", favoritoController.agregarFavorito);

// DELETE /api/favoritos/usuario/:id_usuario/pelicula/:id_pelicula
router.delete("/usuario/:id_usuario/pelicula/:id_pelicula", favoritoController.quitarFavorito);

module.exports = router;
