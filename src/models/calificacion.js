// Modelo para la tabla de calificaciones de películas por usuario
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "Calificacion"
const Calificacion = sequelize.define(
  "calificacion",
  {
    // Identificador único de la calificación, con auto incremento.
    id_calificacion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Identificadores del usuario y la película asociada a la calificación
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Identificador de la película calificada por el usuario
    id_pelicula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Puntuación dada por el usuario, entre 1 y 5
    puntuacion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { min: 1, max: 5 },
    },

    // Fecha de la calificación, por defecto es la fecha actual
    fecha: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "calificacion",
    // Índices para optimizar consultas y asegurar unicidad
    indexes: [
      // Índice único para evitar duplicados
      { unique: true, fields: ["id_usuario", "id_pelicula"] }, // UNIQUE compuesto
    ],
  }
);

module.exports = Calificacion;
