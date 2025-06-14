import express from 'express';
import db from '../../models/index.js';
import xss from 'xss'; // Importar xss si planeamos sanitizar query params (opcional pero buena práctica)


const router = express.Router();

/**
 * GET /api/users
 * Devuelve una lista paginada de usuarios (sin el campo password).
 * Parámetros de consulta opcionales: limit, offset
 */
router.get('/users', async (req, res) => {
  try {
    // Obtener y sanitizar parámetros de paginación (si existen)
    const limit = req.query.limit ? parseInt(xss(req.query.limit), 10) : undefined;
    const offset = req.query.offset ? parseInt(xss(req.query.offset), 10) : undefined;

    // Opciones de consulta para Sequelize
    const queryOptions = {
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt'],
      limit: limit,
      offset: offset,
      // Puedes añadir ordenación por defecto aquí si es necesario, ej:
      // order: [['username', 'ASC']],
    };

    // Sequelize.findAndCountAll es eficiente para paginación
    const { count, rows } = await db.User.findAndCountAll(queryOptions);

    return res.json({
      totalUsers: count,
      users: rows,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al listar usuarios' });
  }
});

/**
 * GET /api/users/:id
 * Devuelve un usuario por su ID.
 */
router.get('/users/:id', async (req, res) => {
  // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
  try {
    const user = await db.User.findByPk(id, {
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

/**
 * POST /api/users
 * Crea un nuevo usuario.
 * Body esperado: { username, email, password, role? }
 * (Sanitización de body ya manejada en auth.js si se usa esa ruta,
 *  pero es buena práctica sanitizar aquí también si esta ruta se usa directamente)
 */
router.post('/users', async (req, res) => {
  // Sanitizar inputs del body (si esta ruta es un punto de entrada directo para creación)
  const username = req.body.username ? xss(req.body.username) : undefined;
  const email = req.body.email ? xss(req.body.email) : undefined;
  const password = req.body.password; // No sanitizar password con xss
  const role = req.body.role ? xss(req.body.role) : 'user';

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    // Nota: En una app real, la creación de usuarios admin por esta ruta debería estar protegida.
    // La ruta de registro en auth.js es más apropiada para usuarios normales.
    const newUser = await db.User.create({
      username,
      email,
      password,
      role
    });
    // No devolvemos password en la respuesta:
    const { id, username: u, email: e, role: r, createdAt, updatedAt } = newUser;
    return res.status(201).json({ id, username: u, email: e, role: r, createdAt, updatedAt });
  } catch (error) {
    console.error(error);
    // Si la causa es clave única duplicada (username/email), devolvemos 409
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email o username ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

/**
 * PUT /api/users/:id
 * Actualiza un usuario existente (puede modificar username, email, password o role).
 * Body: { username?, email?, password?, role? }
 */
router.put('/users/:id', async (req, res) => {
  // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
  // Sanitizar inputs del body (si es necesario permitir actualizaciones de estos campos por esta ruta)
  const updates = {};
  if (req.body.username !== undefined) updates.username = xss(req.body.username);
  if (req.body.email !== undefined) updates.email = xss(req.body.email);
  if (req.body.role !== undefined) updates.role = xss(req.body.role);
  // No sanitizar ni permitir actualización directa de password por aquí sin hashing
  // if (req.body.password !== undefined) updates.password = req.body.password;

  // Si req.body solo tenía password y ya fue filtrado, updates estará vacío.
  // También si no venían campos a actualizar.
  if (Object.keys(updates).length === 0 && req.body.password === undefined) {
     // No hay nada que actualizar o solo se intentó actualizar password de forma insegura
     // Podrías devolver un 400 o simplemente continuar si no es un error
     console.log(`No valid fields to update for user ${id}`);
     // Opcional: return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
  }


  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    // Nota: Si la contraseña se actualizara por esta ruta, DEBERÍA ser hasheada aquí
    // antes de llamar a user.update(). La ruta PUT actual no maneja password, lo cual es más seguro.
    // Si necesitas actualizar password, crea una ruta específica para eso que maneje el hashing.
    await user.update(updates);

    // Devolvemos nuevamente sin password
    const { username, email, role, createdAt, updatedAt } = user;
    return res.json({ id: user.id, username, email, role, createdAt, updatedAt });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email o username ya existe' });
    }
    return res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

/**
 * DELETE /api/users/:id
 * Elimina un usuario por su ID.
 */
router.delete('/users/:id', async (req, res) => {
   // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
  try {
    const rowsDeleted = await db.User.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    return res.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});


export default router;