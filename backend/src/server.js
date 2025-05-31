// backend/src/server.js

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();                  // Carga variables de entorno desde .env

const app = express();

// Middleware
app.use(cors());                  // Habilita CORS para todas las rutas
app.use(express.json());          // Permite parsear JSON en el body de las peticiones

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API Sportender v2 OK' });
});

// Puedes añadir aquí más rutas (por ejemplo, rutas de autenticación, usuarios, eventos, etc.)

// Puerto de escucha (toma el valor de process.env.PORT o por defecto 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
