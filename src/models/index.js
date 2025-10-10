// Definición de modelos y sus relaciones

const { sequelize } = require("../config/database");
const Usuario = require("./usuario");
const Pelicula = require("./pelicula");
const Genero = require("./genero");
const PeliculaGenero = require("./pelicula_genero");
const Favorito = require("./favorito");
const Calificacion = require("./calificacion");

// -------- Usuario y Película --------

// Un usuario (admin/super_admin) puede agregar muchas películas
Pelicula.belongsTo(Usuario, {
  // La clave foránea en Pelicula que referencia a Usuario
  foreignKey: "agregada_por",
  // El usuario (admin/super_admin) que agregó la película
  as: "agregador",
  // Si se elimina el usuario, mantenemos el registro
  onDelete: "SET NULL",
  // Si se actualiza el id del usuario, actualizamos en cascada
  onUpdate: "CASCADE",
});

// Identificamos que administrador agregó qué película
Usuario.hasMany(Pelicula, {
  foreignKey: "agregada_por",
  as: "peliculas_agregadas",
});

// -------- Película y  Género --------
// Relación muchos a muchos entre Película y Género a través de la tabla intermedia PeliculaGenero
Pelicula.belongsToMany(Genero, {
  // La tabla intermedia es PeliculaGenero
  through: PeliculaGenero,
  foreignKey: "id_pelicula",
  otherKey: "id_genero",
  as: "generos",
  // Si se elimina una película, eliminamos sus asociaciones
  onDelete: "CASCADE",
  // Si se actualiza el id de la película, actualizamos en cascada
  onUpdate: "CASCADE",
});

// Género puede estar en muchas películas
Genero.belongsToMany(Pelicula, {
  through: PeliculaGenero,
  foreignKey: "id_genero",
  otherKey: "id_pelicula",
  as: "peliculas",
  // Si se elimina un género, eliminamos sus asociaciones
  onDelete: "CASCADE",
  // Si se actualiza el id del género, actualizamos en cascada
  onUpdate: "CASCADE",
});

// -------- Favoritos (Usuario y Película) --------
// Relación muchos a muchos entre Usuario y Película a través de la tabla intermedia Favorito
Usuario.belongsToMany(Pelicula, {
  through: Favorito,
  foreignKey: "id_usuario",
  otherKey: "id_pelicula",
  as: "favoritos",
  // Si se elimina un usuario, eliminamos sus favoritos
  onDelete: "CASCADE",
});

// Una película puede ser favorita de muchos usuarios
Pelicula.belongsToMany(Usuario, {
  through: Favorito,
  foreignKey: "id_pelicula",
  otherKey: "id_usuario",
  // Los usuarios que marcaron esta película como favorita
  as: "seguidores",
  // Si se elimina una película, eliminamos sus favoritos
  onDelete: "CASCADE",
});

// Relaciones directas para consultas más limpias y eficientes en Favorito
Favorito.belongsTo(
  // El usuario que marcó la película como favorita
  Usuario,
  {
    foreignKey: "id_usuario",
    as: "usuario",
  }
);
Favorito.belongsTo(
  // La película marcada como favorita
  Pelicula,
  {
    foreignKey: "id_pelicula",
    as: "pelicula",
  }
);

// -------- Calificaciones (Usuario y Película) --------
// Un usuario puede hacer muchas calificaciones
Usuario.hasMany(Calificacion, {
  foreignKey: "id_usuario",
  as: "calificaciones",
  onDelete: "CASCADE",
});

// Cada calificación pertenece a un usuario
Calificacion.belongsTo(Usuario, {
  foreignKey: "id_usuario",
  as: "usuario",
});

// Una película puede tener muchas calificaciones
Pelicula.hasMany(Calificacion, {
  foreignKey: "id_pelicula",
  as: "calificaciones",
  onDelete: "CASCADE",
});

// Cada calificación pertenece a una película
Calificacion.belongsTo(Pelicula, {
  foreignKey: "id_pelicula",
  as: "pelicula",
});

syncModels = async () => {
  await sequelize.sync({ alter: true });
}

// Exportamos los modelos y la instancia de Sequelize
module.exports = {
  sequelize,
  Usuario,
  Pelicula,
  Genero,
  PeliculaGenero,
  Favorito,
  Calificacion,
  syncModels
};
