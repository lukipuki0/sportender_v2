// backend/src/routes/storage.js
import express from 'express';
import multer from 'multer';
import admin from 'firebase-admin';
import { v4 as uuidv4 } from 'uuid'; // Para generar nombres de archivo únicos

const router = express.Router();

// Configuración de Multer para el almacenamiento en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Ruta para subir archivos (ejemplo: imágenes de perfil)
router.post('/storage/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }

    // 1. Generar un nombre de archivo único
    const bucket = admin.storage().bucket();
    const filename = `${uuidv4()}-${req.file.originalname}`;
    const file = bucket.file(filename);

    // 2. Crear un stream para subir el archivo a Cloud Storage
    const stream = file.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
      },
    });

    // 3. Manejar los eventos del stream
    stream.on('error', (err) => {
      console.error('Error uploading to Firebase Storage:', err);
      return res.status(500).send('Failed to upload file.');
    });

    stream.on('finish', async () => {
      // 4. Hacer que el archivo sea público (opcional, pero útil para servir directamente)
      await file.makePublic();

      // 5. Obtener la URL pública del archivo
      const url = file.publicUrl();

      console.log('File uploaded successfully:', url);
      return res.status(200).send({ url: url });
    });

    // 6. Escribir el buffer del archivo al stream
    stream.end(req.file.buffer);
  } catch (error) {
    console.error('Error processing file upload:', error);
    return res.status(500).send('Failed to upload file.');
  }
});

export default router;