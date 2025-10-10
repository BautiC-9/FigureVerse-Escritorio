// Calificaciones: crear/actualizar (upsert) y recalcular promedio/total.
// Recalcular promedio/total en la tabla pelicula para reportes rápidos.

const { fn, col } = require("sequelize");
const { Calificacion, Pelicula } = require("../models");

// Crear o actualizar calificación
exports.crearOActualizarCalificacion = async (req, res) => {
  try {
    // id_usuario, id_pelicula y puntuacion vienen en el body
    const { id_usuario, id_pelicula, puntuacion } = req.body;

    // Validar que puntuacion esté entre 1 y 5
    if (puntuacion < 1 || puntuacion > 5) {
      // Si no es válido, retornar 400 con mensaje
      return res
        .status(400)
        .json({ message: "puntuacion debe estar entre 1 y 5" });
    }

    // UPSERT manual por la restricción UNIQUE (id_usuario, id_pelicula)
    const existente = await Calificacion.findOne({
      // Buscar la calificación existente
      where: { id_usuario, id_pelicula },
    });
    // Si existe, actualizar; si no, crear
    if (existente) {
      // Actualizar la puntuación
      existente.puntuacion = puntuacion;
      // Guardar cambios
      await existente.save();
    } else {
      // Crear nueva calificación
      await Calificacion.create({ id_usuario, id_pelicula, puntuacion });
    }

    // Recalcular promedio y total en la tabla pelicula
    const agg = await Calificacion.findAll({
      // Buca por id_pelicula
      where: { id_pelicula },
      // Usar funciones de agregación AVG y COUNT
      attributes: [
        // Calcular puntacion con promedio y total
        [fn("AVG", col("puntuacion")), "promedio"],
        [fn("COUNT", col("*")), "total"],
      ],
      // Solo un resultado, sin paginación
      raw: true,
    });

    // Actualizar la tabla Pelicula con los nuevos valores
    // Parsear los valores a números
    const promedio = parseFloat(agg[0].promedio || 0).toFixed(2);
    const total = parseInt(agg[0].total || 0, 10);

    // Actualizar la película
    await Pelicula.update(
      { calificacion_promedio: promedio, total_calificaciones: total },
      { where: { id_pelicula } }
    );

    // Retornar 201 con mensaje y datos
    return res.status(201).json({
      message: "Calificación registrada/actualizada",
      data: {
        id_usuario,
        id_pelicula,
        puntuacion,
        calificacion_promedio: promedio,
        total_calificaciones: total,
      },
    });
  } catch (error) {
    // Capturar el error y retornar 500 con mensaje
    return res
      .status(500)
      .json({ message: "Error al calificar", error: error.message });
  }
};

// Obtener resumen de calificaciones para una película
exports.resumenPorPelicula = async (req, res) => {
  try {
    const { id_pelicula } = req.params;

    // Leer valores ya materializados en 'pelicula'
    const pelicula = await Pelicula.findByPk(id_pelicula, {
      attributes: [
        "id_pelicula",
        "titulo",
        "calificacion_promedio",
        "total_calificaciones",
      ],
    });

    // Si no existe la película, retornar 404
    if (!pelicula)
      return res.status(404).json({ message: "Película no encontrada" });

    // Retornar el resumen
    return res.json({ data: pelicula });
  } catch (error) {
    // Capturar el error y retornar 500 con mensaje
    return res
      .status(500)
      .json({ message: "Error al obtener resumen", error: error.message });
  }
};
