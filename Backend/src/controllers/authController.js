import * as Usuario from '../models/usuarioModel.js';
import { md5 } from '../utils/hash.js';

// regenerate() asigna un id de sesión nuevo al autenticarse para evitar la fijación de sesión
function iniciarSesion(req, res, usuario, codigo = 200) {
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'No se pudo iniciar sesión' });

    req.session.usuarioId = usuario.id;
    req.session.username = usuario.username;
    res.status(codigo).json({ id: usuario.id, username: usuario.username });
  });
}

// POST /api/auth/registro
export function registro(req, res) {
  const { username, password } = req.body ?? {};
  const nombre = username?.trim().toLowerCase();

  if (!nombre || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }
  if (!/^[a-z0-9_]{3,20}$/.test(nombre)) {
    return res.status(400).json({ error: 'El usuario debe tener de 3 a 20 letras, números o guion bajo' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener al menos 6 caracteres' });
  }
  if (Usuario.buscarPorUsername(nombre)) {
    return res.status(409).json({ error: 'Ese usuario ya existe. Prueba con otro nombre.' });
  }

  const usuario = Usuario.crear(nombre, md5(password));
  iniciarSesion(req, res, usuario, 201);
}

// POST /api/auth/login
export function login(req, res) {
  const { username, password } = req.body ?? {};
  const nombre = username?.trim().toLowerCase();

  if (!nombre || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const usuario = Usuario.buscarPorUsername(nombre);

  if (!usuario || usuario.password !== md5(password)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  iniciarSesion(req, res, usuario);
}

// POST /api/auth/logout
export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
}

// GET /api/auth/me
export function me(req, res) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ error: 'No has iniciado sesión' });
  }
  res.json({ id: req.session.usuarioId, username: req.session.username });
}