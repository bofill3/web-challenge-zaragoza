const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verificarJWT = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_defecto';

// Usuario hardcoded para demo
const usuario = {
  username: 'admin',
  password: 'pilar123'  // En producción usarías hash con bcrypt
};

router.get('/login', (req, res) => {
  res.render('login', { title: "Inicia sesión | SmartCity Zaragoza" , error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === usuario.username && password === usuario.password) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true });
    res.redirect('/dashboard');  // o donde tú quieras
  } else {
    res.render('login', { error: 'Credenciales incorrectas' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


router.get('/auth-test',(req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: 'No se ha proporcionado un token' });
  }

  // Mostrar contenido del token ( no hace falta verificarlo aquí, ya que el middleware lo hace)
  // Continuar por aquí, ver la forma de hacer vulnerable el token
});

module.exports = router;
