<script>
  import { onMount } from 'svelte';
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';
  import { hoy, textoVencimiento } from '../lib/progreso.js';
  import Progreso from '../components/Progreso.svelte';

  const FORMULARIO_VACIO = { materia: '', titulo: '', fecha_entrega: '', prioridad: 'media' };

  // ----- Estado -----
  let tareas = $state([]);
  let cargando = $state(true);
  let error = $state('');
  let mensaje = $state('');
  let form = $state({ ...FORMULARIO_VACIO });
  let editandoId = $state(null); // null = creando; un número = editando esa tarea

  // ----- Derivados -----
  let pendientes = $derived(tareas.filter((t) => t.estado === 'pendiente'));
  let entregadas = $derived(tareas.filter((t) => t.estado === 'entregada'));

  onMount(cargarTareas);

  // LEER
  async function cargarTareas() {
    try {
      tareas = await api('/tareas');
    } catch (e) {
      error = e.message;
    } finally {
      cargando = false;
    }
  }

  // CREAR o ACTUALIZAR (el mismo formulario sirve para las dos cosas)
  async function guardar(evento) {
    evento.preventDefault();
    error = '';
    try {
      if (editandoId) {
        await api(`/tareas/${editandoId}`, { method: 'PUT', body: form });
        mostrarMensaje('✏️ Tarea actualizada');
      } else {
        await api('/tareas', { method: 'POST', body: form });
        mostrarMensaje('✅ Tarea agregada');
      }
      cancelarEdicion();
      await cargarTareas();
    } catch (e) {
      error = e.message;
    }
  }

  // Pasa los datos de una tarea al formulario para editarla
  function editar(tarea) {
    editandoId = tarea.id;
    form = {
      materia: tarea.materia,
      titulo: tarea.titulo,
      fecha_entrega: tarea.fecha_entrega,
      prioridad: tarea.prioridad,
    };
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function cancelarEdicion() {
    editandoId = null;
    form = { ...FORMULARIO_VACIO };
  }

  // Marcar como entregada / pendiente (también es ACTUALIZAR)
  async function alternarEstado(tarea) {
    const estado = tarea.estado === 'pendiente' ? 'entregada' : 'pendiente';
    try {
      await api(`/tareas/${tarea.id}`, { method: 'PUT', body: { estado } });
      if (estado === 'entregada') {
        const xp = hoy() <= tarea.fecha_entrega ? 20 : 5;
        mostrarMensaje(`🎉 ¡+${xp} XP!`);
      }
      await cargarTareas();
    } catch (e) {
      error = e.message;
    }
  }

  // ELIMINAR
  async function eliminar(tarea) {
    if (!confirm(`¿Eliminar "${tarea.titulo}"?`)) return;
    try {
      await api(`/tareas/${tarea.id}`, { method: 'DELETE' });
      if (editandoId === tarea.id) cancelarEdicion();
      mostrarMensaje('🗑️ Tarea eliminada');
      await cargarTareas();
    } catch (e) {
      error = e.message;
    }
  }

  // Mensaje flotante que desaparece solo después de 2,5 segundos
  function mostrarMensaje(texto) {
    mensaje = texto;
    setTimeout(() => (mensaje = ''), 2500);
  }

  async function cerrarSesion() {
    await api('/auth/logout', { method: 'POST' });
    auth.usuario = null;
    location.hash = '#/login';
  }
</script>

<!-- Plantilla reutilizable para dibujar una tarea (la usamos en las dos listas) -->
{#snippet filaTarea(tarea)}
  <article class="tarea" class:entregada={tarea.estado === 'entregada'}>
    <button
      class="check"
      onclick={() => alternarEstado(tarea)}
      aria-label={tarea.estado === 'entregada' ? 'Marcar como pendiente' : 'Marcar como entregada'}
    >
      {tarea.estado === 'entregada' ? '✓' : ''}
    </button>

    <div class="info">
      <span class="materia">{tarea.materia}</span>
      <strong class="titulo">{tarea.titulo}</strong>
      <span class="fecha">
        {tarea.estado === 'entregada'
          ? `Entregada el ${tarea.fecha_completada}`
          : textoVencimiento(tarea.fecha_entrega)}
      </span>
    </div>

    <span class="prioridad {tarea.prioridad}">{tarea.prioridad}</span>

    <div class="botones">
      <button class="secundario" onclick={() => editar(tarea)}>Editar</button>
      <button class="peligro" onclick={() => eliminar(tarea)}>Eliminar</button>
    </div>
  </article>
{/snippet}

<main class="pagina">
  <header class="barra">
    <h1>📚 Tasky</h1>
    <div class="usuario">
      <span>Hola, <strong>{auth.usuario.username}</strong> 👋</span>
      <button class="secundario" onclick={cerrarSesion}>Cerrar sesión</button>
    </div>
  </header>

  <Progreso {tareas} />

  {#if mensaje}
    <div class="toast">{mensaje}</div>
  {/if}

  <!-- Formulario: CREAR / EDITAR -->
  <section class="tarjeta">
    <h2>{editandoId ? '✏️ Editar tarea' : '➕ Nueva tarea'}</h2>

    <form class="formulario" onsubmit={guardar}>
      <label>
        Materia
        <input bind:value={form.materia} placeholder="Ej: Ingeniería Web" required />
      </label>
      <label>
        Título
        <input bind:value={form.titulo} placeholder="Ej: CRUD con MVC" required />
      </label>
      <label>
        Fecha de entrega
        <input type="date" bind:value={form.fecha_entrega} required />
      </label>
      <label>
        Prioridad
        <select bind:value={form.prioridad}>
          <option value="baja">🟢 Baja</option>
          <option value="media">🟡 Media</option>
          <option value="alta">🔴 Alta</option>
        </select>
      </label>

      <div class="acciones">
        <button type="submit">{editandoId ? 'Guardar cambios' : 'Agregar tarea'}</button>
        {#if editandoId}
          <button type="button" class="secundario" onclick={cancelarEdicion}>Cancelar</button>
        {/if}
      </div>
    </form>

    {#if error}
      <p class="error">{error}</p>
    {/if}
  </section>

  <!-- Listas: LEER -->
  {#if cargando}
    <p class="vacio">Cargando tareas...</p>
  {:else}
    <section>
      <h2>📌 Pendientes ({pendientes.length})</h2>
      {#each pendientes as tarea (tarea.id)}
        {@render filaTarea(tarea)}
      {:else}
        <p class="vacio">¡No tienes tareas pendientes! 🎉</p>
      {/each}
    </section>

    <section>
      <h2>✅ Entregadas ({entregadas.length})</h2>
      {#each entregadas as tarea (tarea.id)}
        {@render filaTarea(tarea)}
      {:else}
        <p class="vacio">Aún no has entregado tareas. ¡Tú puedes! 💪</p>
      {/each}
    </section>
  {/if}
</main>

<style>
  .pagina {
    max-width: 900px;
    margin: 0 auto;
    padding: 16px;
  }
  .barra {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }
  .barra h1 {
    margin: 0;
  }
  .usuario {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .tarjeta {
    background: var(--tarjeta);
    border: 2px solid var(--borde);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 24px;
  }
  .tarjeta h2 {
    margin-top: 0;
  }
  .formulario {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }
  .acciones {
    grid-column: 1 / -1;
    display: flex;
    gap: 8px;
  }
  .tarea {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    background: var(--tarjeta);
    border: 2px solid var(--borde);
    border-radius: 14px;
    padding: 12px;
    margin-bottom: 10px;
  }
  .tarea.entregada .titulo {
    text-decoration: line-through;
    opacity: 0.6;
  }
  .check {
    width: 32px;
    height: 32px;
    padding: 0;
    border-radius: 50%;
    background: transparent;
    border: 3px solid var(--borde);
    color: white;
    box-shadow: none;
    flex-shrink: 0;
  }
  .tarea.entregada .check {
    background: var(--exito);
    border-color: var(--exito);
  }
  .info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 160px;
  }
  .materia {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--primario);
  }
  .fecha {
    font-size: 0.85rem;
    color: var(--texto-suave);
  }
  .prioridad {
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 99px;
  }
  .prioridad.alta { background: #ffe0e0; color: #c0392b; }
  .prioridad.media { background: #fff3cd; color: #9a6b00; }
  .prioridad.baja { background: #d8f5e8; color: #1e8a5a; }
  .botones {
    display: flex;
    gap: 6px;
  }
  .botones button {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
  button.peligro {
    background: var(--error);
    box-shadow: 0 4px 0 #a52020;
  }
  .vacio {
    color: var(--texto-suave);
  }
  .toast {
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--texto);
    color: var(--fondo);
    padding: 12px 20px;
    border-radius: 12px;
    font-weight: 700;
    z-index: 10;
  }
</style>