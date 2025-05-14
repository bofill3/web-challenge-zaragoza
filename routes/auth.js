const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const verificarJWT = require('../middleware/auth');
const JWT_SECRET = process.env.JWT_SECRET || 'clave_defecto';

// Usuario hardcoded para demo
const usuario = {
  username: 'aaron',
  password: 'YWFyb24mc2FyYTwz'
};

router.get('/login', (req, res) => {
  res.render('login', { title: "Inicia sesión | SmartCity Zaragoza" , error: null });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === usuario.username && password === usuario.password) {
    const token = jwt.sign({ username, role:"worker" }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: false });
    res.redirect('/logs');  // o donde tú quieras
  } else {
    res.render('login', { error: 'Credenciales incorrectas' });
  }
});

router.get('/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/');
});


module.exports = router;
