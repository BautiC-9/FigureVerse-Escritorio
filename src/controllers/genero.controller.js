const { Genero } = require("../models");

// Crear nuevo género
exports.crearGenero = async (req, res) => {
  try {
    // Crear género en BD y devolver respuesta que todo fue OK
    const genero = await Genero.create(req.body);
    return res.status(201).json({ message: "Género creado", data: genero });
  } catch (error) {
    // Captura de errores y respuesta de error de erroGenero.middleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al crear", error: error.message });
  }
};

// Listar todos los géneros
exports.listarGeneros = async (req, res) => {
  try {
    // Listar géneros ordenados por nombre ascendente y devolver resultado de la consulta
    const generos = await Genero.findAll({ order: [["nombre_genero", "ASC"]] });
    return res.json({ data: generos });
  } catch (error) {
    // Captura de errores y respuesta de error de erroGenero.middleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al listar", error: error.message });
  }
};

// Obtener un género por ID
exports.obtenerGenero = async (req, res) => {
  try {
    // Buscar género por PK (ID)
    const { id } = req.params;

    // Si no existe, responder con 404 y mensaje de no encontrado
    const genero = await Genero.findByPk(id);
    if (!genero)
      return res.status(404).json({ message: "Género no encontrado" });
    // Devolver resultado de la consulta data de género
    return res.json({ data: genero });
  } catch (error) {
    // Captura de errores y respuesta de error de erroGenero.middleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al obtener", error: error.message });
  }
};

// Actualizar un género por ID
exports.actualizarGenero = async (req, res) => {
  try {
    // Extraer ID de los parámetros de la ruta
    const { id } = req.params;
    // Actualizar género por ID con los datos del body
    const [afectadas] = await Genero.update(req.body, {
      // Devolver número de filas afectadas
      where: { id_genero: id },
    });

    // Si no se actualizó ninguna fila, responder con 404 y mensaje de no encontrado
    if (!afectadas)
      return res.status(404).json({ message: "Género no encontrado" });

    // Buscar el género actualizado para devolverlo en la respuesta
    const genero = await Genero.findByPk(id);

    // Devolver respuesta que todo fue OK y el género actualizado
    return res.json({ message: "Género actualizado", data: genero });
  } catch (error) {
    // Captura de errores y respuesta de error de erroGenero.middleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// Eliminar un género por ID
exports.eliminarGenero = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminar género por ID
    const borradas = await Genero.destroy({ where: { id_genero: id } });

    // Si no se eliminó ninguna fila, responder con 404 y mensaje de no encontrado
    if (!borradas)
      return res.status(404).json({ message: "Género no encontrado" });
    return res.json({ message: "Género eliminado" });
  } catch (error) {
    // Captura de errores y respuesta de error de erroGenero.middleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al eliminar", error: error.message });
  }
};
