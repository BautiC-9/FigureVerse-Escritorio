// Favoritos: agregar, quitar, listar por usuario
const { Favorito, Pelicula } = require("../models");

// Asumimos que la tabla Favorito tiene columnas id_usuario e id_pelicula
exports.agregarFavorito = async (req, res) => {
  try {
    // id_usuario e id_pelicula vienen en el body
    const { id_usuario, id_pelicula } = req.body;

    // Evitar duplicados (aunque la tabla no tenga UNIQUE)
    const [fav] = await Favorito.findOrCreate({
      // si ya existe, no hace nada
      where: { id_usuario, id_pelicula },
      defaults: { id_usuario, id_pelicula },
    });

    // Retornar 201 si se creó, 200 si ya existía
    return (
      res.status(201).json({ message: "Favorito agregado", data: fav }) ||
      res.status(200).json({ message: "Ya estaba en favoritos", data: fav })
    );
  } catch (error) {
    // Capturar el error y retornar 500 con mensaje
    return res
      .status(500)
      .json({ message: "Error al agregar favorito", error: error.message });
  }
};

// Quitar favorito por id_usuario e id_pelicula
exports.quitarFavorito = async (req, res) => {
  try {
    // id_usuario e id_pelicula vienen en los params
    const { id_usuario, id_pelicula } = req.params;
    // Eliminar el favorito
    const borradas = await Favorito.destroy({
      // Si no existe, no hace nada
      where: { id_usuario, id_pelicula },
    });

    // Si no se borró nada, retornar 404
    if (!borradas)
      return res.status(404).json({ message: "No estaba en favoritos" });
    // Sino, retornar un mensaje de éxito se quitó favorito
    return res.json({ message: "Favorito quitado" });
  } catch (error) {
    // Capturar el error y retornar 500 con mensaje
    return res
      .status(500)
      .json({ message: "Error al quitar favorito", error: error.message });
  }
};

// Listar favoritos de un usuario, con detalles de la película
exports.listarFavoritosUsuario = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    // Buscar todos los favoritos del usuario, incluyendo detalles de la película
    const favs = await Favorito.findAll({
      // El where es por id_usuario y se incluye el modelo Pelicula
      where: { id_usuario },
      include: [{ model: Pelicula, as: "pelicula" }],
    });
    // Retornar la lista de favoritos
    return res.json({ data: favs });
  } catch (error) {
    // Capturar el error y retornar 500 con mensaje
    return res
      .status(500)
      .json({ message: "Error al listar favoritos", error: error.message });
  }
};
