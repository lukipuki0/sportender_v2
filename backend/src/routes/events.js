// backend/src/routes/events.js
import express from 'express';
import db from '../../models/index.js';
import auth from '../middleware/auth.js'; // Importar el middleware de autenticación

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
 * Crea un nuevo evento. REQUIERE AUTENTICACIÓN.
 * Body: { title, description?, location, sportType, dateTime, capacity }
 * El creatorId se obtiene del token del usuario autenticado.
 */
router.post('/events', auth, async (req, res) => { // <- Aplicar middleware 'auth' aquí
  // Ahora podemos acceder a req.user.id porque el middleware de autenticación lo añadió
  const creatorId = req.user.id; 
  const { title, description, location, sportType, dateTime, capacity } = req.body;

  // Validar campos obligatorios (sin creatorId, ya que viene del token)
  if (!title || !location || !sportType || !dateTime || !capacity) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (title, location, sportType, dateTime, capacity)' });
  }

  try {
    // Ya no necesitamos buscar el usuario creador aquí, ya que sabemos que está autenticado
    // y tenemos su ID del token (req.user.id).

    const newEvent = await db.Event.create({
      title,
      description: description || null,
      location,
      sportType,
      dateTime,   // Debe ser formato ISO (ej. "2025-06-15T18:30:00Z")
      capacity,
      creatorId   // Usamos el ID del usuario autenticado
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear evento' });
  }
});

/**
 * PUT /api/events/:id
 * Actualiza un evento existente (todos o algunos campos). REQUIERE AUTENTICACIÓN.
 * Body: { title?, description?, location?, sportType?, dateTime?, capacity? }
 * Solo el creador del evento o un admin debería poder actualizarlo (lógica a añadir si es necesario).
 */
router.put('/events/:id', auth, async (req, res) => { // <- Aplicar middleware 'auth' aquí
  const { id } = req.params;
  const updates = req.body;
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Opcional: Verificar si el usuario autenticado es el creador del evento
    // if (event.creatorId !== userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'No autorizado para actualizar este evento' });
    // }

    // Eliminar creatorId de updates si se intenta modificar, ya que debe venir del token
    if (updates.creatorId) {
      delete updates.creatorId;
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
 * Elimina un evento por su ID. REQUIERE AUTENTICACIÓN.
 * Solo el creador del evento o un admin debería poder eliminarlo (lógica a añadir si es necesario).
 */
router.delete('/events/:id', auth, async (req, res) => { // <- Aplicar middleware 'auth' aquí
  const { id } = req.params;
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

     // Opcional: Verificar si el usuario autenticado es el creador del evento
    // if (event.creatorId !== userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'No autorizado para eliminar este evento' });
    // }

    const rowsDeleted = await db.Event.destroy({ where: { id } });
    if (rowsDeleted === 0) {
      // Aunque ya verificamos si existe, esta es otra capa por si acaso
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    return res.json({ message: 'Evento eliminado correctamente' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al eliminar evento' });
  }
});

export default router;
