// Controlador de Película: CRUD + asignar/quitar géneros.

// Requiere instalar: npm i sequelize para operaciones con BD.
// se intlaod y tiene npm no solo instala Sequelize, sino todas sus dependencias internas, es decir:
// drivers de bases de datos (MySQL, SQLite, PostgreSQL, etc.),
// librerías de validación, promesas, manejo de errores, etc.

const { Op, fn, col } = require("sequelize");
const { Pelicula, Genero, PeliculaGenero, Usuario } = require("../models");

// Crear nueva película
exports.crearPelicula = async (req, res) => {
  try {
    // Crear película en BD
    const pelicula = await Pelicula.create(req.body);
    // Devolver respuesta que todo fue OK con los datos de la película creada
    return res.status(201).json({ message: "Película creada", data: pelicula });
  } catch (error) {
    // Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al crear", error: error.message });
  }
};

// Listar con filtros opcionales: titulo, estado, genero_id
exports.listarPeliculas = async (req, res) => {
  try {
    // Filtros opcionales con query params (title, estado, genero_id).
    const { q, estado, genero_id } = req.query;

    // Construcción dinámica del objeto 'where' para los filtros
    const where = {};
    // Filtro por título (LIKE %q%)
    if (q) where.titulo = { [Op.like]: `%${q}%` };
    // Filtro por estado (true/false)
    if (estado) where.estado = estado;

    // Incluimos los modelos relacionados: Géneros y Usuario que agregó la película
    // through: { attributes: [] } para no traer datos de la tabla puente
    const include = [
      {
        model: Genero,
        as: "generos",
        through: { attributes: [] },
      },
      // Datos del usuario (admin o super_admin) que agregó la película
      {
        model: Usuario,
        as: "agregador",
        attributes: ["id_usuario", "nombre_usuario", "email"],
      },
    ];

    // Filtro por género (join)
    if (genero_id) {
      include[0].where = { id_genero: genero_id };
    }

    // Consulta con filtros y relaciones incluidas
    // Ordenado por fecha de registro descendente (más recientes primero)
    const lista = await Pelicula.findAll({
      where,
      include,
      order: [["fecha_registro", "DESC"]],
    });

    // Devolver resultado de la consulta data de películas
    return res.json({ data: lista });
  } catch (error) {
    //Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al listar", error: error.message });
  }
};

// Obtener por ID una película con sus géneros y usuario que la agregó
exports.obtenerPelicula = async (req, res) => {
  try {
    // Extraer ID de los parámetros de la ruta
    const { id } = req.params;
    // Buscar película por PK incluyendo géneros y usuario que la agregó
    const pelicula = await Pelicula.findByPk(id, {
      include: [
        {
          // Géneros de la película
          model: Genero,
          as: "generos",
          // No traer datos de la tabla puente
          through: { attributes: [] },
        },
        {
          // Datos del usuario (admin o super_admin) que agregó la película
          model: Usuario,
          as: "agregador",
          // Solo campos no sensibles del usuario (admin o super_admin)
          attributes: ["id_usuario", "nombre_usuario", "email"],
        },
      ],
    });

    // Si no existe, devolver 404 y mensaje de no encontrado
    if (!pelicula)
      return res.status(404).json({ message: "Película no encontrada" });

    // Devolver resultado de la consulta data de película
    return res.json({ data: pelicula });
  } catch (error) {
    //Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al obtener", error: error.message });
  }
};

// Actualizar de los datos de una película por ID
exports.actualizarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    // Actualizar película por ID con los datos del body
    // update devuelve un array con [número de filas afectadas, ...]
    const [afectadas] = await Pelicula.update(req.body, {
      // Solo actualizar la película con el ID dado
      where: { id_pelicula: id },
    });

    // Si no se actualizó ningún registro, devolver 404
    if (!afectadas)
      return res.status(404).json({ message: "Película no encontrada" });

    // Buscar la película actualizada para devolverla en la respuesta
    const pelicula = await Pelicula.findByPk(id);

    // Devolver respuesta que todo fue OK con los datos de la película actualizada
    return res.json({ message: "Película actualizada", data: pelicula });
  } catch (error) {
    // Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// Eliminar película por ID
exports.eliminarPelicula = async (req, res) => {
  try {
    const { id } = req.params;
    // Eliminar película por ID
    const borradas = await Pelicula.destroy({ where: { id_pelicula: id } });

    // Si no se eliminó ningún registro, devolver 404
    if (!borradas)
      return res.status(404).json({ message: "Película no encontrada" });
    return res.json({ message: "Película eliminada" });
  } catch (error) {
    // Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al eliminar", error: error.message });
  }
};

// Asignar género(s) a película (acepta array o id único)
exports.asignarGeneros = async (req, res) => {
  try {
    const { id } = req.params; // id_pelicula
    let { generos } = req.body; // puede ser [1,2,3] o 1

    // Asegurar que generos es un array
    if (!Array.isArray(generos)) generos = [generos];

    // Evitar duplicados insertando manualmente en la tabla puente
    const ops = generos.map((id_gen) =>
      // Buscar o crear la relación en la tabla puente
      PeliculaGenero.findOrCreate({
        // El where asegura que no se creen duplicados
        where: {
          id_pelicula: id,
          id_genero: id_gen,
        },
        // Si no existe, se crea con estos valores por defecto
        defaults: {
          id_pelicula: id,
          id_genero: id_gen,
        },
      })
    );

    // Esperar a que todas las operaciones se completen
    await Promise.all(ops);

    // Buscar la película con sus géneros actualizados para devolverlos
    const pelicula = await Pelicula.findByPk(id, {
      // Incluir géneros relacionados
      include: [
        {
          model: Genero,
          as: "generos",
          // Incluir atributos de la tabla puente
          through: { attributes: [] },
        },
      ],
    });

    // Devolver respuesta que todo fue OK con los datos de la película y sus géneros
    return res.json({ message: "Géneros asignados", data: pelicula });
  } catch (error) {
    // Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al asignar géneros", error: error.message });
  }
};

// Quitar género de una película
exports.quitarGenero = async (req, res) => {
  try {
    const { id, id_genero } = req.params;
    // Eliminar la relación en la tabla puente

    const borradas = await PeliculaGenero.destroy({
      // El where asegura que se borre la relación correcta
      where: { id_pelicula: id, id_genero },
    });

    // Si no se eliminó ningún registro, devolver 404
    if (!borradas)
      return res.status(404).json({ message: "Relación no encontrada" });

    // Buscar la película con sus géneros actualizados para devolverlos
    const pelicula = await Pelicula.findByPk(id, {
      include: [
        {
          model: Genero,
          as: "generos",
          through: { attributes: [] },
        },
      ],
    });

    // Devolver respuesta que todo fue OK con los datos de la película y sus géneros
    return res.json({ message: "Género quitado", data: pelicula });
  } catch (error) {
    // Captura de errores y respuesta de error de erroPeicula.meddleware.js si crea una.
    return res
      .status(500)
      .json({ message: "Error al quitar género", error: error.message });
  }
};
