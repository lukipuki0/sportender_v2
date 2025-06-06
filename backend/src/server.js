// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Sportender v2 OK' });
});

// Rutas de Users
app.use('/api', usersRouter);

// Rutas de Events
app.use('/api', eventsRouter);

// Si en el futuro agregas más routers (p. ej. authRouter), harías algo parecido:
// import authRouter from './routes/auth.js';
// app.use('/api', authRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
