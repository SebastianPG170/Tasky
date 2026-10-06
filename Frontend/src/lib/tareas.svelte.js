import { api } from './api.js';
import { hoy } from './progreso.js';

// Estado compartido por todas las pestañas
export const datos = $state({
  tareas: [],
  cargando: true,
  mensaje: '', // texto del post-it
});

// LEER
export async function cargarTareas() {
  try {
    datos.tareas = await api('/tareas');
  } catch (e) {
    avisar(e.message);
  } finally {
    datos.cargando = false;
  }
}

// Al cerrar sesión: que el siguiente usuario no vea las tareas del anterior
export function limpiarTareas() {
  datos.tareas = [];
  datos.cargando = true;
}

// CREAR (si falla, el error llega al formulario que la llamó)
export async function crearTarea(form) {
  await api('/tareas', { method: 'POST', body: form });
  avisar('Tarea agregada');
  await cargarTareas();
}

// ACTUALIZAR
export async function editarTarea(id, form) {
  await api(`/tareas/${id}`, { method: 'PUT', body: form });
  avisar('Cambios guardados');
  await cargarTareas();
}

// ACTUALIZAR el estado: pendiente ↔ entregada
export async function alternarEstado(tarea) {
  const estado = tarea.estado === 'pendiente' ? 'entregada' : 'pendiente';
  try {
    await api(`/tareas/${tarea.id}`, { method: 'PUT', body: { estado } });
    if (estado === 'entregada') {
      avisar(`+${hoy() <= tarea.fecha_entrega ? 20 : 5} XP`);
    }
    await cargarTareas();
  } catch (e) {
    avisar(e.message);
  }
}

// ELIMINAR
export async function eliminarTarea(tarea) {
  if (!confirm(`¿Borrar "${tarea.titulo}"? No se puede deshacer.`)) return;
  try {
    await api(`/tareas/${tarea.id}`, { method: 'DELETE' });
    avisar('Tarea borrada');
    await cargarTareas();
  } catch (e) {
    avisar(e.message);
  }
}

// Muestra el post-it durante 2,5 segundos
let temporizador;
export function avisar(texto) {
  datos.mensaje = texto;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => (datos.mensaje = ''), 2500);
}