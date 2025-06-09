// backend/src/middleware/auth.js
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // ¡Debe ser la misma que en auth.js!

const auth = (req, res, next) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1]; // Split para obtener solo el TOKEN después de 'Bearer'

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    req.user = decoded.user; // { id: user.id, role: user.role }
    
    next();

  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default auth;