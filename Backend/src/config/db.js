import { DatabaseSync } from 'node:sqlite';
import { md5 } from '../utils/hash.js';

const db = new DatabaseSync('tasky.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id       INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tareas (
    id               INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id       INTEGER NOT NULL,
    materia          TEXT NOT NULL,
    titulo           TEXT NOT NULL,
    fecha_entrega    TEXT NOT NULL,
    prioridad        TEXT NOT NULL DEFAULT 'media',
    estado           TEXT NOT NULL DEFAULT 'pendiente',
    fecha_completada TEXT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
  );
`);

// Usuario de prueba que se crea en el primer arranque
const existe = db.prepare('SELECT id FROM usuarios WHERE username = ?').get('demo');
if (!existe) {
const passwordMd5 = md5('demo123');
  db.prepare('INSERT INTO usuarios (username, password) VALUES (?, ?)').run('demo', passwordMd5);
}

export default db;