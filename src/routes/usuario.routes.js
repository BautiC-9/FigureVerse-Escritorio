const router = require('express').Router();
const { eliminarUsuario, actualizarUsuario, crearUsuario, obtenerUsuario, listarUsuarios } = require ('../controllers/usuario.controller.js');

// GET /api/usuarios
router.get("/usuarios", obtenerUsuario);

// GET /api/usuarios/listado
router.get("/listado", listarUsuarios);

// POST /api/usuarios
router.post("/usuarios", crearUsuario);

// PUT /api/usuarios/:id
router.put("/usuarios/:id", actualizarUsuario);

// DELETE /api/usuarios/:id
router.delete("/usuarios/:id", eliminarUsuario);

module.exports = router;
