// Modelo para la tabla de favoritos de películas por usuario
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "Favorito"
const Favorito = sequelize.define(
  "favorito",
  {
    // Identificador único del favorito, con auto incremento.
    id_favorito: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Identificadores del usuario y la película asociada al favorito
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Identificador de la película marcada como favorita por el usuario
    id_pelicula: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    // Fecha en que se agregó la película a favoritos, por defecto es la fecha actual
    fecha_agregado: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "favorito",
  }
);

module.exports = Favorito;
