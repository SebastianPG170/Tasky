import { auth } from './auth.svelte.js';

// Envía una petición al backend y devuelve la respuesta ya convertida
export async function api(ruta, opciones = {}) {
  const respuesta = await fetch('/api' + ruta, {
    method: opciones.method ?? 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: opciones.body ? JSON.stringify(opciones.body) : undefined,
  });

  // Sesión expirada durante el uso: volver al login (en /auth/login y /auth/me el 401 es esperado)
  if (respuesta.status === 401 && ruta !== '/auth/login' && ruta !== '/auth/me') {
    auth.usuario = null;
    location.hash = '#/login';
  }

  // 204 no trae cuerpo: respuesta.json() fallaría
  if (respuesta.status === 204) return null;

  const datos = await respuesta.json();

  if (!respuesta.ok) {
    throw new Error(datos.error ?? 'Ocurrió un error inesperado');
  }
  return datos;
}