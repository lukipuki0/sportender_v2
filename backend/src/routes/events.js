// backend/src/routes/events.js
import express from 'express';
import db from '../../models/index.js';

const router = express.Router();

/**
 * GET /api/events
 * Devuelve todos los eventos (con información básica de creador).
 */
router.get('/events', async (req, res) => {
  try {
    const allEvents = await db.Event.findAll({
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    return res.json(allEvents);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al listar eventos' });
  }
});

/**
 * GET /api/events/:id
 * Devuelve un evento por su ID (con datos de creador).
 */
router.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await db.Event.findByPk(id, {
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ]
    });
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al obtener evento' });
  }
});

/**
 * POST /api/events
 * Crea un nuevo evento.
 * Body: { title, description?, location, sportType, dateTime, capacity, creatorId }
 */
router.post('/events', async (req, res) => {
  const { title, description, location, sportType, dateTime, capacity, creatorId } = req.body;
  if (!title || !location || !sportType || !dateTime || !capacity || !creatorId) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  try {
    // Validar que el creatorId existe
    const user = await db.User.findByPk(creatorId);
    if (!user) {
      return res.status(404).json({ error: 'Usuario creador no existe' });
    }

    const newEvent = await db.Event.create({
      title,
      description: description || null,
      location,
      sportType,
      dateTime,   // Debe ser formato ISO (ej. "2025-06-15T18:30:00Z")
      capacity,
      creatorId
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear evento' });
  }
});

/**
 * PUT /api/events/:id
 * Actualiza un evento existente (todos o algunos campos).
 * Body: { title?, description?, location?, sportType?, dateTime?, capacity?, creatorId? }
 */
router.put('/events/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    // Si vienen cambios en creatorId, validar que exista
    if (updates.creatorId) {
      const user = await db.User.findByPk(updates.creatorId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario creador no existe' });
      }
    }
    await event.update(updates);
    return res.json(event);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

/**
 * DELETE /api/events/:id
 * Elimina un evento por su ID.
 */
router.delete('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const rowsDeleted = await db.Event.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    return res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
