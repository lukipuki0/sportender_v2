// backend/src/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import admin from 'firebase-admin'; // Import Firebase Admin

import usersRouter from './routes/users.js';
import eventsRouter from './routes/events.js';
import authRouter from './routes/auth.js'; // Importar el nuevo router de autenticación
import storageRouter from './routes/storage.js'; // Importar el router de Storage
import emailRouter from './routes/email.js'; // Importar el router de Email

dotenv.config();

// Initialize Firebase Admin (asegúrate de tener la variable de entorno GOOGLE_APPLICATION_CREDENTIALS configurada)
const serviceAccount = process.env.GOOGLE_APPLICATION_CREDENTIALS ? require(process.env.GOOGLE_APPLICATION_CREDENTIALS) : null;

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET // Opcional: si vas a usar Cloud Storage
  });
  console.log('Firebase Admin SDK inicializado correctamente');
} else {
  console.warn('No se encontró la variable de entorno GOOGLE_APPLICATION_CREDENTIALS. Firebase Admin SDK no se inicializará.');
}


const app = express();

// Configuración segura de CORS
//const allowedOrigins = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.split(',') : ['http://localhost:4200']; // Permite múltiples orígenes separados por coma

//const corsOptions = {
//  origin: function (origin, callback) {
//    // Permitir solicitudes sin origen (como apps móviles o herramientas como Postman) en desarrollo,
//    // pero es mejor ser estricto en producción.
//    if (!origin || allowedOrigins.includes(origin)) {
//      callback(null, true);
//    } else {
//      callback(new Error('Not allowed by CORS'));
//    }
//  },
//  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Métodos permitidos
//  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
//  credentials: true // Permite el envío de cookies o encabezados de autorización con la solicitud cross-origin
//};

//app.use(cors(corsOptions));

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

// Rutas de Autenticación
app.use('/api', authRouter); // Usar el router de autenticación
// Rutas de Storage
app.use('/api', storageRouter); // Usar el router de Storage

// Rutas de Email
app.use('/api', emailRouter); // Usar el router de Email

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
