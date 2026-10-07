<script>
  import { onMount } from 'svelte';
  import { api } from './lib/api.js';
  import { auth } from './lib/auth.svelte.js';
  import { datos, cargarTareas, limpiarTareas } from './lib/tareas.svelte.js';
  import Login from './pages/Login.svelte';
  import Registro from './pages/Registro.svelte';
  import Encabezado from './components/Encabezado.svelte';
  import Tareas from './pages/Tareas.svelte';
  import Entregadas from './pages/Entregadas.svelte';
  import Progreso from './pages/Progreso.svelte';

  const RUTAS_PUBLICAS = ['/login', '/registro'];
  const RUTAS_PRIVADAS = ['/tareas', '/entregadas', '/progreso'];

  let ruta = $state(leerRuta());

  function leerRuta() {
    return location.hash.slice(1) || '/';
  }

  // Al cargar la app, recupera la sesión si la cookie sigue vigente
  onMount(async () => {
    try {
      auth.usuario = await api('/auth/me');
    } catch {
      auth.usuario = null;
    } finally {
      auth.cargando = false;
    }
  });

  // Guardia de navegación: solo mejora la experiencia; la protección real está en el backend (requireAuth)
  $effect(() => {
    if (auth.cargando) return;

    if (!auth.usuario && !RUTAS_PUBLICAS.includes(ruta)) {
      location.hash = '#/login';
    } else if (auth.usuario && !RUTAS_PRIVADAS.includes(ruta)) {
      location.hash = '#/tareas';
    }
  });

  // Carga las tareas cuando alguien entra; las borra de memoria cuando sale
  $effect(() => {
    if (auth.usuario) {
      cargarTareas();
    } else {
      limpiarTareas();
    }
  });
</script>

<svelte:window onhashchange={() => (ruta = leerRuta())} />

{#if auth.cargando}
  <p class="cargando">Abriendo tu cuaderno…</p>
{:else if !auth.usuario}
  {#if ruta === '/registro'}
    <Registro />
  {:else}
    <Login />
  {/if}
{:else}
  <div class="pagina">
    <Encabezado {ruta} />
    <main>
      {#if ruta === '/entregadas'}
        <Entregadas />
      {:else if ruta === '/progreso'}
        <Progreso />
      {:else}
        <Tareas />
      {/if}
    </main>
  </div>
{/if}

{#if datos.mensaje}
  <div class="nota" role="status">{datos.mensaje}</div>
{/if}

<style>
  .cargando {
    margin-top: 40vh;
    text-align: center;
    font-family: var(--mano);
    font-size: 2rem;
  }
</style>