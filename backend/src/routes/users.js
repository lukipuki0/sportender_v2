// backend/src/routes/users.js
import express from 'express';
import db from '../../models/index.js';

const router = express.Router();

/**
 * GET /api/users
 * Devuelve todos los usuarios (sin el campo password).
 */
router.get('/users', async (req, res) => {
  try {
    const allUsers = await db.User.findAll({
      attributes: ['id', 'username', 'email', 'role', 'createdAt', 'updatedAt']
    });
    return res.json(allUsers);
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
  const { id } = req.params;
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
 */
router.post('/users', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    const newUser = await db.User.create({
      username,
      email,
      password,
      role: role || 'user'
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
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    // Actualizamos solo los campos que vengan en el body
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
  const { id } = req.params;
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
