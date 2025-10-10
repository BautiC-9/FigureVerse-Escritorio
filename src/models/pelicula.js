// Modelo "pelicula" (nota: anio_estreno se mapea a INTEGER para representar YEAR)
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "Pelicula"
const Pelicula = sequelize.define(
  "pelicula",
  {
    // Atributos de identificación y detalles de la película
    id_pelicula: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Atributo de título, no puede ser nulo
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    // Atributo de la sinopsis o resumen de la película
    sinopsis: {
      type: DataTypes.TEXT,
    },

    // Atributo de año de estreno de la película
    anio_estreno: {
      type: DataTypes.INTEGER,
    },

    // Duración en minutos de la película
    duracion_min: {
      type: DataTypes.INTEGER,
    },

    // Atributo de director
    director: {
      type: DataTypes.STRING(100),
    },

    // Atributo de clasificación por edad
    clasificacion_edad: {
      type: DataTypes.STRING(10),
    },

    // Atributo de país de origen
    pais_origen: {
      type: DataTypes.STRING(50),
    },

    // Atributo de idioma original
    idioma_original: {
      type: DataTypes.STRING(50),
    },

    // Imagen de portada o póster de la película
    imagen_url: {
      type: DataTypes.STRING(255),
    },

    // Url del tráiler de la película
    trailer_url: {
      type: DataTypes.STRING(255),
    },

    // Promedio de calificaciones y total de calificaciones recibidas
    calificacion_promedio: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    // Total de calificaciones recibidas
    total_calificaciones: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    // Estado de la película y metadatos adicionales
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    // Estado de la película con valores predefinidos y valor por defecto
    estado: {
      type: DataTypes.ENUM("publicada", "pendiente", "oculta", "eliminada"),
      defaultValue: "publicada",
    },

    // Metadatos para auditoría y quien la agregó
    agregada_por: { type: DataTypes.INTEGER },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "pelicula",
  }
);

module.exports = Pelicula;
