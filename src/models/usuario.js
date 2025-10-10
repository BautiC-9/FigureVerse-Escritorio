// Modelo "usuario" (respeta la tabla del script SQL)
const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

// Definición del modelo "Usuario"
const Usuario = sequelize.define(
  "usuario",
  {
    // Atributos del modelo
    // id_usuario es la clave primaria y se autoincrementa
    id_usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // Atributo de nombre de usuario, debe ser único y no nulo
    nombre_usuario: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },

    // Atributo de nombre, no puede ser nulo
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // Atributo de apellido, no puede ser nulo
    apellido: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    // Atributo de email, debe ser único y no nulo
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },

    // Atributo de contraseña, no puede ser nulo
    contrasena: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    // Atributo de edad, debe ser mayor o igual a 15
    edad: {
      type: DataTypes.INTEGER,
      validate: { min: 15 },
    },

    // Atributo de nacionalidad
    nacionalidad: {
      type: DataTypes.STRING(50),
    },

    // Atributo de región o ciudad
    region: {
      type: DataTypes.STRING(50),
    },

    // Atributo de rol, con valores predefinidos y valor por defecto
    rol: {
      type: DataTypes.ENUM("super_admin", "admin", "usuario"),
      defaultValue: "usuario",
    },

    // Atributo de foto de perfil
    foto_perfil: {
      type: DataTypes.STRING(255),
    },

    // Atributo de biografía
    biografia: {
      type: DataTypes.TEXT,
    },
    // Atributo de fecha de registro, con valor por defecto la fecha actual
    fecha_registro: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    // Atributo de estado de cuenta, con valores predefinidos y valor por defecto
    estado_cuenta: {
      type: DataTypes.ENUM("activo", "suspendido", "baneado"),
      defaultValue: "activo",
    },

    // Atributo de último login
    ultimo_login: {
      type: DataTypes.DATE,
    },

    // Atributos para recuperación de contraseña
    token_recuperacion: {
      type: DataTypes.STRING(255),
    },

    // Fecha de expiración del token de recuperación
    token_expira: { type: DataTypes.DATE },
  },
  {
    // Nombre de la tabla en la base de datos
    tableName: "usuario",
  }
);

module.exports = Usuario;
