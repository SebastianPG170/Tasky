<script>
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';
  import { datos } from '../lib/tareas.svelte.js';
  import { calcularRacha } from '../lib/progreso.js';

  let { ruta } = $props();

  let racha = $derived(calcularRacha(datos.tareas));

  const PESTANAS = [
    { ruta: '/tareas', nombre: 'Tareas' },
    { ruta: '/entregadas', nombre: 'Entregadas' },
    { ruta: '/progreso', nombre: 'Progreso' },
  ];

  async function cerrarSesion() {
    await api('/auth/logout', { method: 'POST' });
    auth.usuario = null;
    location.hash = '#/login';
  }
</script>

<header>
  <div class="fila">
    <h1>Tasky</h1>
    <div class="usuario">
      <span><span class="resaltado">{racha} {racha === 1 ? 'día' : 'días'}</span> de racha</span>
      <strong>{auth.usuario.username}</strong>
      <button class="texto" onclick={cerrarSesion}>Cerrar sesión</button>
    </div>
  </div>

  <nav aria-label="Secciones">
    {#each PESTANAS as pestana (pestana.ruta)}
      <a
        href={'#' + pestana.ruta}
        class:activa={ruta === pestana.ruta}
        aria-current={ruta === pestana.ruta ? 'page' : undefined}
      >
        {pestana.nombre}
      </a>
    {/each}
  </nav>
</header>

<style>
  header { margin-bottom: 32px; }
  .fila {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px 16px;
  }
  .usuario {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    font-size: 0.95rem;
  }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 22px;
    margin-top: 16px;
    border-bottom: 2px solid var(--tinta);
  }
  nav a {
    font-family: var(--mano);
    font-size: 1.8rem;
    font-weight: 700;
    text-decoration: none;
    color: var(--tinta-suave);
    padding: 0 6px;
  }
  nav a:hover { color: var(--tinta); }
   nav a.activa {
    color: var(--tinta);
    background: linear-gradient(
      to bottom,
      transparent 50%,
      var(--resaltador) 50%,
      var(--resaltador) 85%,
      transparent 85%
    );
  }
</style>