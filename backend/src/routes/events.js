// backend/src/routes/events.js
import express from 'express';
import db from '../../models/index.js';
import auth from '../middleware/auth.js'; // Importar el middleware de autenticación
import xss from 'xss'; // Importar xss

const router = express.Router();

/**
 * GET /api/events
 * Devuelve una lista paginada de eventos (con información básica de creador).
 * Parámetros de consulta opcionales: limit, offset, sportType?, searchTerm?
 */
router.get('/events', async (req, res) => {
  try {
    // Obtener y sanitizar parámetros de paginación y filtro
    const limit = req.query.limit ? parseInt(xss(req.query.limit), 10) : undefined;
    const offset = req.query.offset ? parseInt(xss(req.query.offset), 10) : undefined;
    const sportType = req.query.sportType ? xss(req.query.sportType) : undefined;
    const searchTerm = req.query.searchTerm ? xss(req.query.searchTerm) : undefined;


    // Opciones de consulta para Sequelize
    const queryOptions = {
      include: [
        {
          model: db.User,
          as: 'creator',
          attributes: ['id', 'username', 'email']
        }
      ],
      limit: limit,
      offset: offset,
      order: [['dateTime', 'ASC']], // Opcional: ordenar por fecha/hora por defecto
      where: {} // Objeto para filtros
    };

    // Añadir filtro por sportType si está presente
    if (sportType) {
      queryOptions.where.sportType = sportType;
    }

    // Añadir filtro por término de búsqueda (en title o description) si está presente
    if (searchTerm) {
        // Usar Op.or para buscar en múltiples campos
        const { Op } = db.Sequelize;
        queryOptions.where[Op.or] = [
            { title: { [Op.iLike]: `%${searchTerm}%` } }, // Búsqueda insensible a mayúsculas
            { description: { [Op.iLike]: `%${searchTerm}%` } }
        ];
    }


    // Sequelize.findAndCountAll es eficiente para paginación
    const { count, rows } = await db.Event.findAndCountAll(queryOptions);

    return res.json({
      totalEvents: count,
      events: rows,
    });

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
  // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
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
  // Sanitizar campos del body (excepto los numéricos como capacity y date/time que validaremos formato)
  const title = xss(req.body.title);
  const description = req.body.description ? xss(req.body.description) : null;
  const location = xss(req.body.location);
  const sportType = xss(req.body.sportType);
  const dateTime = req.body.dateTime; // Validar formato si es necesario
  const capacity = req.body.capacity; // Validar que sea número

  // Validar campos obligatorios (sin creatorId, ya que viene del token)
  if (!title || !location || !sportType || !dateTime || capacity === undefined) { // capacity puede ser 0, así que verificamos undefined
    return res.status(400).json({ error: 'Faltan campos obligatorios (title, location, sportType, dateTime, capacity)' });
  }

  // Validaciones adicionales de formato (ej. para dateTime y capacity)
  if (isNaN(parseInt(capacity, 10)) || parseInt(capacity, 10) < 0) {
       return res.status(400).json({ error: 'La capacidad debe ser un número positivo.' });
  }
  // Puedes añadir validación de formato de fecha/hora si es necesario


  try {
    const newEvent = await db.Event.create({
      title,
      description,
      location,
      sportType,
      dateTime,
      capacity,
      creatorId
    });

    // --- Lógica Placeholder para Notificaciones ---
    // Aquí podríamos:
    // 1. Guardar una entrada en una tabla de Notificaciones
    // 2. Enviar a una cola de mensajes (ej. RabbitMQ, SQS) para procesamiento asíncrono
    // 3. Directamente enviar un correo electrónico o notificación push (no recomendado en la respuesta síncrona)
    //
    // Por ahora, solo generaremos un mensaje de log y lo incluiremos en la respuesta.
    const notificationMessage = `Nuevo evento creado: "${newEvent.title}" por el usuario ID ${newEvent.creatorId}`;
    console.log('NOTIFICATION EVENT:', notificationMessage); // Log en el servidor
    // --- Fin Lógica Placeholder ---


    // Incluir un mensaje de notificación en la respuesta (opcional, para feedback inmediato al cliente)
    return res.status(201).json({
      ...newEvent.toJSON(), // Devolver el objeto del evento creado
      notificationStatus: 'Notification generated (placeholder)', // Indicador de notificación
      notificationMessage: notificationMessage // El mensaje generado
    });

  } catch (error) {
    console.error(error);
     // Manejar posibles errores de validación de Sequelize u otros
    if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ error: 'Error de validación', details: messages });
    }
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
  // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
  const userId = req.user.id; // ID del usuario autenticado
  const updates = {};

  // Sanitizar y preparar campos para actualizar
  if (req.body.title !== undefined) updates.title = xss(req.body.title);
  if (req.body.description !== undefined) updates.description = req.body.description ? xss(req.body.description) : null; // Permite null
  if (req.body.location !== undefined) updates.location = xss(req.body.location);
  if (req.body.sportType !== undefined) updates.sportType = xss(req.body.sportType);
  if (req.body.dateTime !== undefined) {
       // Validar formato de fecha/hora si es necesario
       updates.dateTime = req.body.dateTime;
  }
  if (req.body.capacity !== undefined) {
      // Validar que sea número
      if (isNaN(parseInt(req.body.capacity, 10)) || parseInt(req.body.capacity, 10) < 0) {
         return res.status(400).json({ error: 'La capacidad debe ser un número positivo.' });
      }
      updates.capacity = req.body.capacity;
  }

  // Eliminar creatorId de updates si se intenta modificar, ya que debe venir del token
  if (updates.creatorId) {
    delete updates.creatorId;
  }

  // Si no hay campos válidos para actualizar
  if (Object.keys(updates).length === 0) {
      console.log(`No valid fields to update for event ${id}`);
      return res.status(400).json({ error: 'No se proporcionaron campos válidos para actualizar.' });
  }

  try {
    const event = await db.Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    // Opcional: Verificar si el usuario autenticado es el creador del evento
    // if (event.creatorId !== userId && req.user.role !== 'admin') {
    //   return res.status(403).json({ message: 'No autorizado para actualizar este evento' });
    // }

    await event.update(updates);
    return res.json(event);
  } catch (error) {
    console.error(error);
     if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message);
        return res.status(400).json({ error: 'Error de validación', details: messages });
    }
    return res.status(500).json({ error: 'Error al actualizar evento' });
  }
});

/**
 * DELETE /api/events/:id
 * Elimina un evento por su ID. REQUIERE AUTENTICACIÓN.
 * Solo el creador del evento o un admin debería poder eliminarlo (lógica a añadir si es necesario).
 */
router.delete('/events/:id', auth, async (req, res) => { // <- Aplicar middleware 'auth' aquí
  // Sanitizar el ID del parámetro de ruta
  const id = xss(req.params.id);
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