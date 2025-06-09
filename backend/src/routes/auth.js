// backend/src/routes/auth.js
import express from 'express';
import db from '../../models/index.js';
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; 
const JWT_EXPIRES_IN = '1h'; 

router.post('/auth/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (username, email, password)' });
  }

  try {
    const salt = await bcrypt.genSalt(10); 
    const hashedPassword = await bcrypt.hash(password, salt); 

    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword, 
      role: 'user' 
    });

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

    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path === 'username' ? 'username' : 'email';
      return res.status(409).json({ error: `El ${field} ya está registrado.` });
    }

    return res.status(500).json({ error: 'Error al registrar el usuario.' });
  }
});


router.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt for email:', email); 

  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (email, password)' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    console.log('User found:', user ? user.email : 'None'); // Log if user found

    if (!user) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', passwordMatch); // Log password comparison result

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas.' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }, 
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Error en el servidor durante el inicio de sesión.' });
  }
});

export default router;