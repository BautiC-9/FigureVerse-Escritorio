// Modelo de Género
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "Genero"
const Genero = sequelize.define(
  "genero",
  {
    // Atributo de identificacion y auto incremento.
    id_genero: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Nombre del género, debe ser único y no nulo
    nombre_genero: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "genero",
  }
);

module.exports = Genero;
