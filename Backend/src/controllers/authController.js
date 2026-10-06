import * as Usuario from '../models/usuarioModel.js';
import { md5 } from '../utils/hash.js';

// POST /api/auth/login
export function login(req, res) {
  const { username, password } = req.body ?? {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const usuario = Usuario.buscarPorUsername(username);

  // Comparamos el MD5 de lo que escribió con el MD5 guardado
  if (!usuario || usuario.password !== md5(password)) {
    return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
  }

  // Creamos una sesión nueva y guardamos quién es
  req.session.regenerate((err) => {
    if (err) return res.status(500).json({ error: 'No se pudo iniciar sesión' });

    req.session.usuarioId = usuario.id;
    req.session.username = usuario.username;
    res.json({ id: usuario.id, username: usuario.username });
  });
}

// POST /api/auth/logout
export function logout(req, res) {
  req.session.destroy(() => {
    res.clearCookie('connect.sid');
    res.status(204).end();
  });
}

// GET /api/auth/me  → ¿quién soy? (el frontend lo usará al abrir la app)
export function me(req, res) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ error: 'No has iniciado sesión' });
  }
  res.json({ id: req.session.usuarioId, username: req.session.username });
}