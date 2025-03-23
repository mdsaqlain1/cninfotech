import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET 

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the token is provided
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing or invalid' });
  }

  const token = authHeader.split(' ')[1];

  console.log('token', token);

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    if (!decoded.id) {
      return res.status(403).json({ message: 'Access denied. Admins only.' });
    }

    req.user = decoded; // Attach decoded token to request
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token', error: error.message });
  }
};

export default adminAuth;
