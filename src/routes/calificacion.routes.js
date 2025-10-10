const router = require("express").Router();
const calificacionController = require("../controllers/calificacion.controller");

// GET /api/calificaciones
router.get("/", calificacionController.resumenPorPelicula);

// POST /api/calificaciones
router.post("/", calificacionController.crearOActualizarCalificacion);

module.exports = router;
