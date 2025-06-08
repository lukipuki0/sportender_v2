// backend/src/routes/events.js
import express from 'express';
import db from '../../models/index.js';
import auth from '../middleware/auth.js'; 

const router = express.Router();


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


router.post('/events', auth, async (req, res) => { 
  const { title, description, location, sportType, dateTime, capacity } = req.body;

  if (!title || !location || !sportType || !dateTime || !capacity) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (title, location, sportType, dateTime, capacity)' });
  }

  try {
  
    const newEvent = await db.Event.create({
      title,
      description: description || null,
      location,
      sportType,
      dateTime,   
      capacity,
      creatorId   
    });
    return res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error al crear evento' });
  }
});

router.put('/events/:id', auth, async (req, res) => { 
  const updates = req.body;
  const userId = req.user.id; 

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

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


router.delete('/events/:id', auth, async (req, res) => { // <- Aplicar middleware 'auth' aquí
  const { id } = req.params;
  const userId = req.user.id; // ID del usuario autenticado

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }


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
