// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import authRouter from './routes/auth.js'; 

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API Sportender v2 OK' });
});

app.use('/api', usersRouter);

app.use('/api', eventsRouter);

app.use('/api', authRouter); 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
