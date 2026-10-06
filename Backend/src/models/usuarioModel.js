import db from '../config/db.js';

// Busca un usuario por su nombre (devuelve undefined si no existe)
export function buscarPorUsername(username) {
  return db.prepare('SELECT * FROM usuarios WHERE username = ?').get(username);
}
// Crea un usuario nuevo y devuelve sus datos (sin la contraseña)
export function crear(username, passwordHash) {
  const resultado = db
    .prepare('INSERT INTO usuarios (username, password) VALUES (?, ?)')
    .run(username, passwordHash);

  return { id: resultado.lastInsertRowid, username };
}