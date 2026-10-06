import db from '../config/db.js';

// Busca un usuario por su nombre (devuelve undefined si no existe)
export function buscarPorUsername(username) {
  return db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
}