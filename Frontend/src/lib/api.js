import { auth } from './auth.svelte.js';

// Envía una petición al backend y devuelve la respuesta ya convertida
export async function api(ruta, opciones = {}) {
  const respuesta = await fetch('/api' + ruta, {
    method: opciones.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  });

  // Si la sesión expiró mientras usábamos la app, volvemos al login
  if (respuesta.status === 401 && ruta !== '/auth/login' && ruta !== '/auth/me') {
    auth.usuario = null;
    location.hash = '#/login';
  }

  // 204 = "no hay contenido" (por ejemplo, al borrar o cerrar sesión)
  if (respuesta.status === 204) return null;

  const datos = await respuesta.json();

  // Si el backend respondió con error (400, 401, 404...), lo lanzamos
  if (!respuesta.ok) {
    throw new Error(datos.error ?? 'Ocurrió un error inesperado');
  }
  return datos;
}