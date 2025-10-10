// Modelo intermedio para la relación muchos a muchos entre Película y Género
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "PeliculaGenero"
const PeliculaGenero = sequelize.define(
  "pelicula_genero",
  {
    // Identificadores compuestos para la relación de película y género
    id_pelicula: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },

    // Identificador del género, clave primaria compuesta junto con id_pelicula
    id_genero: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "pelicula_genero",
    // Desactivar timestamps automáticos, para que funcione como tabla intermedia simple.
    timestamps: false,
  }
);

module.exports = PeliculaGenero;
