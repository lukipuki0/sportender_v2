// backend/src/routes/email.js
import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración de Nodemailer (usando variables de entorno)
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // Ej: 'gmail'
  auth: {
    user: process.env.EMAIL_USER,    // Tu dirección de correo electrónico
    pass: process.env.EMAIL_PASSWORD // Tu contraseña o App Password (si usas Gmail)
  },
});

// Ruta para enviar correos electrónicos
router.post('/email/send', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER, // Tu dirección de correo electrónico
    to: to,                         // Dirección del destinatario
    subject: subject,               // Asunto del correo
    text: text                      // Cuerpo del correo (texto plano)
  };

  try {
    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado correctamente a:', to);
    return res.status(200).send('Correo electrónico enviado correctamente.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    return res.status(500).send('Error al enviar el correo electrónico.');
  }
});

export default router;