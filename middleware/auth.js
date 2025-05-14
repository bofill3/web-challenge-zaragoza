const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_defecto';

function verificarJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.decode(token)
    req.user = decoded.username;
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

function verificarAdminJWT(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect('/login');

  try {
    const decoded = jwt.decode(token)
    req.user = decoded.username;
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado' });
    }
    next();
  } catch (err) {
    return res.redirect('/login');
  }
}

module.exports = verificarJWT, verificarAdminJWT;
