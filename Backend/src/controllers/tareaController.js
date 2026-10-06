import * as Tarea from '../models/tareaModel.js';

// TEMPORAL: mientras no hay login, todo se hace como el usuario 1 (demo).
// Cuando hagamos el login, esto vendrá de la sesión.
const USUARIO_TEMPORAL = 1;

const PRIORIDADES = ['baja', 'media', 'alta'];

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