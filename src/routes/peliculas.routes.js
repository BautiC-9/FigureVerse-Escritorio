const router = require("express").Router();
const peliculaController = require("../controllers/pelicula.controller");

// GET /api/peliculas
router.get("/", peliculaController.obtenerPelicula);

// GET /api/peliculas/listado
router.get("/listado", peliculaController.listarPeliculas);

// POST /api/peliculas
router.post("/", peliculaController.crearPelicula);

// PUT /api/peliculas/:id
router.put("/:id", peliculaController.actualizarPelicula);

// DELETE /api/peliculas/:id
router.delete("/:id", peliculaController.eliminarPelicula);

// POST /api/peliculas/:id/generos
router.post("/:id/generos", peliculaController.asignarGeneros);

// DELETE /api/peliculas/:id/generos/:generoId
router.delete("/:id/generos/:generoId", peliculaController.quitarGenero);

module.exports = router;
