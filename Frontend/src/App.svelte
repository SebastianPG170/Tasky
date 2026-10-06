<script>
  import { onMount } from 'svelte';
  import { api } from './lib/api.js';
  import { auth } from './lib/auth.svelte.js';
  import Login from './pages/Login.svelte';
  import Tareas from './pages/Tareas.svelte';
  import Registro from './pages/Registro.svelte';

  // La ruta actual: lo que está después del # en la URL
  let ruta = $state(leerRuta());

  function leerRuta() {
    return location.hash.slice(1) || '/';
  }

  // Al abrir la app, preguntamos al backend si ya hay una sesión activa
  onMount(async () => {
    try {
      auth.usuario = await api('/auth/me');
    } catch {
      auth.usuario = null;
    } finally {
      auth.cargando = false;
    }
  });
  // Rutas que se pueden ver SIN sesión
  const RUTAS_PUBLICAS = ['/login', '/registro'];

  // GUARDIA: se vuelve a ejecutar cada vez que cambia la ruta o la sesión
  $effect(() => {
    if (auth.cargando) return;

    if (!auth.usuario && !RUTAS_PUBLICAS.includes(ruta)) {
      location.hash = '#/login';   // sin sesión → al login
    } else if (auth.usuario && ruta !== '/tareas') {
      location.hash = '#/tareas';  // con sesión → a sus tareas
    }
  });
</script>

<!-- Escucha cuando cambia el # de la URL -->
<svelte:window onhashchange={() => (ruta = leerRuta())} />

{#if auth.cargando}
  <p class="cargando">Cargando...</p>
{:else if ruta === '/login' && !auth.usuario}
  <Login />
{:else if ruta === '/registro' && !auth.usuario}
  <Registro />
{:else if ruta === '/tareas' && auth.usuario}
  <Tareas />
{/if}

<style>
  .cargando {
    text-align: center;
    margin-top: 40vh;
  }
</style>