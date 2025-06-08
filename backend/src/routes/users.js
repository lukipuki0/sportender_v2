// backend/src/routes/users.js
import express from 'express';
import db from '../../models/index.js';

const router = express.Router();

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
    const { id, username: u, email: e, role: r, createdAt, updatedAt } = newUser;
    return res.status(201).json({ id, username: u, email: e, role: r, createdAt, updatedAt });
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'El email o username ya existe' });
    }
    return res.status(500).json({ error: 'Error al crear usuario' });
  }
});

router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const user = await db.User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    await user.update(updates);
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
