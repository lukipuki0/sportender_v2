// backend/src/routes/auth.js
import express from 'express';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs'; // Importar bcryptjs
import jwt from 'jsonwebtoken'; // Importar jsonwebtoken
import xss from 'xss'; // Importar xss
import rateLimit from 'express-rate-limit'; // Importar express-rate-limit

const router = express.Router();

// Se recomienda usar variables de entorno para la clave secreta de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // ¡Cambia esto en producción!
const JWT_EXPIRES_IN = '1h'; // Define la expiración del token

// Configuración del límite de tasa para la ruta de login
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  message: { error: 'Demasiados intentos de inicio de sesión. Inténtalo de nuevo más tarde.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


/**
 * POST /api/auth/register
 * Registro de nuevo usuario.
 * Body: { username, email, password }
 */
router.post('/auth/register', async (req, res) => {
  // Sanitizar las entradas
  const username = xss(req.body.username);
  const email = xss(req.body.email);
  const password = req.body.password; // Las contraseñas no se sanitizan con xss, se hashean

  // 1. Validar campos obligatorios
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (username, email, password)' });
  }

  try {
    // 2. Hashear la contraseña
    const salt = await bcrypt.genSalt(10); // Genera un salt (costo 10)
    const hashedPassword = await bcrypt.hash(password, salt); // Hashea la contraseña con el salt

    // 3. Crear el nuevo usuario en la base de datos
    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword, // Guardar la contraseña hasheada
      role: 'user' // Rol por defecto
    });

    // 4. Responder con el usuario creado (sin la contraseña)
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };

    return res.status(201).json(userResponse);

  } catch (error) {
    console.error(error);

    // 5. Manejar errores de clave única duplicada
    if (error.name === 'SequelizeUniqueConstraintError') {
      // Puedes verificar si el error es por username o email si quieres ser más específico
      const field = error.errors[0].path === 'username' ? 'username' : 'email';
      return res.status(409).json({ error: `El ${field} ya está registrado.` });
    }

    // 6. Manejar otros errores del servidor
    return res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});

/**
 * POST /api/auth/login
 * Inicio de sesión de usuario.
 * Body: { email, password }
 */
router.post('/auth/login', loginLimiter, async (req, res) => { // Aplica el middleware loginLimiter aquí
  // Sanitizar las entradas
  const email = xss(req.body.email);
  const password = req.body.password; // Las contraseñas no se sanitizan con xss

  console.log('Login attempt for email:', email);

  // 1. Validar campos obligatorios
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (email, password)' });
  }

  try {
    // 2. Buscar el usuario por email
    const user = await db.User.findOne({ where: { email } });

    console.log('User found:', user ? user.email : 'None');

    // 3. Verificar si el usuario existe y si la contraseña es correcta
    if (!user) {
      // Usamos un mensaje genérico para no dar pistas sobre si el usuario existe o no
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch);

    if (!passwordMatch) {
      // Usamos un mensaje genérico para no dar pistas sobre si el usuario existe o no
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    // 4. Si las credenciales son correctas, generar un JWT
    // Incluimos solo información no sensible en el payload del token
    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }, // Token expira en 1 hora (puedes ajustar esto)
      (err, token) => {
        if (err) throw err;
        // 5. Enviar el token JWT al cliente
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error);
    // 6. Manejar errores del servidor
    return res.status(500).json({ error: 'Error en el servidor durante el inicio de sesión.' });
  }
});

export default router;