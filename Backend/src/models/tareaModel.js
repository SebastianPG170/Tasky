import db from '../config/db.js';

// LEER: todas las tareas de un usuario, ordenadas por fecha de entrega
export function listarPorUsuario(usuarioId) {
  return db
    .prepare('SELECT * FROM tareas WHERE usuario_id = ? ORDER BY fecha_entrega')
    .all(usuarioId);
}

// LEER: una sola tarea (solo si pertenece a ese usuario)
export function buscarPorId(usuarioId, id) {
  return db
    .prepare('SELECT * FROM tareas WHERE id = ? AND usuario_id = ?')
    .get(id, usuarioId);
}

// CREAR: inserta una tarea nueva y la devuelve completa
export function crear(usuarioId, datos) {
  const resultado = db
    .prepare(`
      INSERT INTO tareas (usuario_id, materia, titulo, fecha_entrega, prioridad)
      VALUES (?, ?, ?, ?, ?)
    `)
    .run(usuarioId, datos.materia, datos.titulo, datos.fecha_entrega, datos.prioridad ?? 'media');

  return buscarPorId(usuarioId, resultado.lastInsertRowid);
  
}
// ACTUALIZAR: cambia los datos de una tarea (solo si es del usuario)
export function actualizar(usuarioId, id, datos) {
  const resultado = db
    .prepare(`
      UPDATE tareas
      SET materia = ?, titulo = ?, fecha_entrega = ?, prioridad = ?, estado = ?, fecha_completada = ?
      WHERE id = ? AND usuario_id = ?
    `)
    .run(
      datos.materia, datos.titulo, datos.fecha_entrega,
      datos.prioridad, datos.estado, datos.fecha_completada,
      id, usuarioId
    );

  if (resultado.changes === 0) return undefined; // no existía
  return buscarPorId(usuarioId, id);
}

// ELIMINAR: borra una tarea. Devuelve true si borró algo
export function eliminar(usuarioId, id) {
  const resultado = db
    .prepare('DELETE FROM tareas WHERE id = ? AND usuario_id = ?')
    .run(id, usuarioId);

  return resultado.changes > 0;
}