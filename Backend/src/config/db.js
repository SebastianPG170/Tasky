import { DatabaseSync } from 'node:sqlite';
import { md5 } from '../utils/hash.js';

// 1. Abre (o crea, si no existe) el archivo de la base de datos
const db = new DatabaseSync('tasky.db');

// 2. Crea las tablas si todavía no existen
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

// 3. Crea un usuario de prueba si no existe (contraseña guardada en MD5)
const existe = db.prepare('SELECT id FROM usuarios WHERE username = ?').get('demo');
if (!existe) {
const passwordMd5 = md5('demo123');
  db.prepare('INSERT INTO usuarios (username, password) VALUES (?, ?)').run('demo', passwordMd5);
}

// 4. Exportamos la conexión para que el Modelo la use
export default db;