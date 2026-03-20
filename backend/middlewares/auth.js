import jwt from 'jsonwebtoken';

export const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer token

  if (!token) {
    return res.status(401).json({ 
      success: false,
      error: 'Access token required' 
    });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ 
        success: false,
        error: 'Invalid or expired token' 
      });
    }
    
    if (decoded.role === 'admin') {
      req.user = decoded;
      req.isAdmin = true;
    } else if (decoded.role === 'farmer') {
      req.walletAddress = decoded.walletAddress;
      req.user = decoded;
    }
    
    next();
  });
};