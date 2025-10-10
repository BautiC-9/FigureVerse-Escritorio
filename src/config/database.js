//NOTA: ES UN MODELADO NO AUN EL FINAL
// Configuración de Sequelize para MySQL usando CommonJS.
// Lee variables de entorno si existen; caso contrario usa valores por defecto.

const { Sequelize } = require("sequelize");

// Configuración de Sequelize para MySQL usando CommonJS.
const sequelize = new Sequelize(
  // Lee variables de entorno para la conexion a la DB.
  process.env.DB_NAME || "filmTribe", // nombre BD
  process.env.DB_USER || "root", // usuario

  // Si no hay contraseña en entorno, asume cadena vacía
  process.env.DB_PASS || "", // contraseña
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: false, // ponlo en true para ver SQL en consola
    define: {
      // Mantener nombres EXACTOS de tablas (sin pluralizar)
      freezeTableName: true,
      // Sin timestamps automáticos (createdAt/updatedAt) porque el SQL ya los define
      timestamps: false,
    },
  }
);

// Esto es solo un modelado como hacer la conexiones corespondiente esta a modificaciones.

module.exports = { sequelize };
