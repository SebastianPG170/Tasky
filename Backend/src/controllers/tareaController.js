import * as Tarea from '../models/tareaModel.js';

// TEMPORAL: mientras no hay login, todo se hace como el usuario 1 (demo).
// Cuando hagamos el login, esto vendrá de la sesión.
const USUARIO_TEMPORAL = 1;

const PRIORIDADES = ['baja', 'media', 'alta'];
const ESTADOS = ['pendiente', 'entregada'];

// Fecha de hoy en formato AAAA-MM-DD, usando la hora de Ecuador (no la de Londres)
function hoy() {
  return new Date().toLocaleDateString('en-CA');
}
// GET /api/tareas
export function listar(req, res) {
  const tareas = Tarea.listarPorUsuario(USUARIO_TEMPORAL);
  res.json(tareas);
}

// POST /api/tareas
export function crear(req, res) {
  const { materia, titulo, fecha_entrega, prioridad } = req.body ?? {};

  // Validaciones: el controlador revisa que el pedido tenga sentido
  if (!materia || !titulo || !fecha_entrega) {
    return res.status(400).json({ error: 'materia, titulo y fecha_entrega son obligatorios' });
  }
  if (prioridad && !PRIORIDADES.includes(prioridad)) {
    return res.status(400).json({ error: 'prioridad debe ser baja, media o alta' });
  }

  const nueva = Tarea.crear(USUARIO_TEMPORAL, { materia, titulo, fecha_entrega, prioridad });
  res.status(201).json(nueva);
}
// PUT /api/tareas/:id
export function actualizar(req, res) {
  const id = Number(req.params.id);
  const actual = Tarea.buscarPorId(USUARIO_TEMPORAL, id);

  if (!actual) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }

  // Si un campo no viene en el body, se mantiene el valor actual
  const cambios = req.body ?? {};
  const tarea = {
    materia: cambios.materia ?? actual.materia,
    titulo: cambios.titulo ?? actual.titulo,
    fecha_entrega: cambios.fecha_entrega ?? actual.fecha_entrega,
    prioridad: cambios.prioridad ?? actual.prioridad,
    estado: cambios.estado ?? actual.estado,
  };

  if (!tarea.materia || !tarea.titulo || !tarea.fecha_entrega) {
    return res.status(400).json({ error: 'materia, titulo y fecha_entrega no pueden quedar vacíos' });
  }
  if (!PRIORIDADES.includes(tarea.prioridad)) {
    return res.status(400).json({ error: 'prioridad debe ser baja, media o alta' });
  }
  if (!ESTADOS.includes(tarea.estado)) {
    return res.status(400).json({ error: 'estado debe ser pendiente o entregada' });
  }

  // Para XP y racha: guardamos el día en que se entregó
  if (tarea.estado === 'entregada') {
    tarea.fecha_completada = actual.fecha_completada ?? hoy();
  } else {
    tarea.fecha_completada = null;
  }

  const actualizada = Tarea.actualizar(USUARIO_TEMPORAL, id, tarea);
  res.json(actualizada);
}

// DELETE /api/tareas/:id
export function eliminar(req, res) {
  const id = Number(req.params.id);
  const borrada = Tarea.eliminar(USUARIO_TEMPORAL, id);

  if (!borrada) {
    return res.status(404).json({ error: 'Tarea no encontrada' });
  }
  res.status(204).end();
}