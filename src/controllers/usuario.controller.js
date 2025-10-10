// Controlador de Usuario: CRUD con hash de contraseña.
// Requiere instalar: npm i bcryptjs para hashing de contraseñas.

const bcrypt = require("bcryptjs");
const { Usuario } = require("../models");

// Campos sensibles que NO queremos exponer en listados
const EXCLUDE_FIELDS = ["contrasena", "token_recuperacion", "token_expira"];

// Crear un nuevo usuario con hash de contraseña
exports.crearUsuario = async (req, res) => {
  // try/catch para manejo de errores
  try {
    // Extraer contraseña del body
    const { contrasena, ...resto } = req.body;

    // Hash de contraseña (cost 10 por defecto)
    const hash = await bcrypt.hash(contrasena, 10);

    // Crear usuario en BD con la contraseña hasheada
    const usuario = await Usuario.create({ ...resto, contrasena: hash });

    // Evitar devolver contraseña
    const plain = usuario.get({ plain: true });
    // Eliminar campos sensibles para no exponerlos
    EXCLUDE_FIELDS.forEach((k) => delete plain[k]);

    // Devolver respuesta que todo fue OK
    return res.status(201).json({
      // Mensaje y datos del usuario creado
      message: "Usuario creado",
      data: plain,
    });
    // Captura de errores
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error al crear usuario", error: error.message });
  }
};

// Listar todos los usuarios sin campos sensibles
exports.listarUsuarios = async (req, res) => {
  try {
    // Buscar todos los usuarios excluyendo campos sensibles
    const usuarios = await Usuario.findAll({
      // Excluir campos sensibles
      attributes: { exclude: EXCLUDE_FIELDS },
    });
    // Devolver resultado de la consulta data de usuarios
    return res.json({ data: usuarios });
  } catch (error) {
    //capturamos el error y mediante un return devolvemos el error, y con error.middleware.js lo gestionamos
    return res
      .status(500)
      .json({ message: "Error al listar", error: error.message });
  }
};

// Obtener un usuario por ID sin campos sensibles
exports.obtenerUsuario = async (req, res) => {
  try {
    // Extraer ID de los parámetros de la ruta
    const { id } = req.params;
    // Buscar usuario por PK excluyendo campos sensibles
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: EXCLUDE_FIELDS },
    });
    // Si no existe, devolver 404 y mensaje de no encontrado
    if (!usuario)
      return res.status(404).json({ message: "Usuario no encontrado" });
    return res.json({ data: usuario });
  } catch (error) {
    // Captura el error y mediante un return lo devolvemos y con error.middleware.js lo gestionamos
    return res
      .status(500)
      .json({ message: "Error al obtener", error: error.message });
  }
};

// Actualizar usuario por ID, si envían nueva contraseña, la hasheamos
exports.actualizarUsuario = async (req, res) => {
  try {
    // Extraer ID de los parámetros de la ruta
    const { id } = req.params;
    // Clonar body para no modificar req.body directamente
    const payload = { ...req.body };

    // Si envían una nueva contraseña, la hasheamos
    if (payload.contrasena) {
      // Hashear nueva contraseña
      payload.contrasena = await bcrypt.hash(payload.contrasena, 10);
    }

    // Actualizar usuario en BD con los datos del payload
    const [afectadas] = await Usuario.update(payload, {
      // Solo actualizar el usuario con el ID dado
      where: { id_usuario: id },
    });
    // Si no se actualizó ningún registro, devolver 404
    if (!afectadas)
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Buscar el usuario actualizado para devolverlo en la respuesta
    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: EXCLUDE_FIELDS },
    });
    return res.json({ message: "Usuario actualizado", data: usuario });
  } catch (error) {
    // Captura el error y mediante un return lo devolvemos y con error.middleware.js lo gestionamos
    return res
      .status(500)
      .json({ message: "Error al actualizar", error: error.message });
  }
};

// Eliminar usuario por ID
exports.eliminarUsuario = async (req, res) => {
  try {
    // Extraer ID de los parámetros de la ruta
    const { id } = req.params;

    // Eliminar usuario en BD por ID
    const borradas = await Usuario.destroy({ where: { id_usuario: id } });

    // Si no se eliminó ningún registro, devolver 404
    if (!borradas)
      // Mensaje de no encontrado
      return res.status(404).json({ message: "Usuario no encontrado" });

    // Si fue exitoso, devolver mensaje de éxito
    return res.json({ message: "Usuario eliminado" });
  } catch (error) {
    // Captura el error y mediante un return lo devolvemos y con error.middleware.js lo gestionamos
    return res
      .status(500)
      .json({ message: "Error al eliminar", error: error.message });
  }
};
