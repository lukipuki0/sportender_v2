// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

// Se recomienda usar variables de entorno para la clave secreta de JWT
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // ¡Debe ser la misma que en auth.js!

const auth = (req, res, next) => {
  // 1. Obtener el token del header
  // El token usualmente viene en el formato 'Bearer TOKEN'
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Split para obtener solo el TOKEN después de 'Bearer'

  // 2. Verificar si no hay token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  // 3. Verificar el token
  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // 4. Adjuntar la información del usuario del token a la solicitud
    // Esto asume que el payload del token tiene una propiedad 'user'
    req.user = decoded.user; // { id: user.id, role: user.role }
    
    // 5. Continuar al siguiente middleware o ruta
    next();

  } catch (err) {
    // Si la verificación falla (token inválido o expirado)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;