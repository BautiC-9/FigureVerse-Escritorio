const router = require('express').Router();
const generoController = require("../controllers/genero.controller");

// GET /api/generos
router.get("/", generoController.obtenerGenero);

// GET /api/generos/listado
router.get("/listado", generoController.listarGeneros);

// POST /api/generos
router.post("/", generoController.crearGenero);

// PUT /api/generos/:id
router.put("/:id", generoController.actualizarGenero);

// DELETE /api/generos/:id
router.delete("/:id", generoController.eliminarGenero);

module.exports = router;
