<script>
  import { datos, crearTarea, editarTarea } from '../lib/tareas.svelte.js';
  import TareaItem from '../components/TareaItem.svelte';

  const FORMULARIO_VACIO = { materia: '', titulo: '', fecha_entrega: '', prioridad: 'media' };

  let form = $state({ ...FORMULARIO_VACIO });
  let editandoId = $state(null);
  let error = $state('');
  let guardando = $state(false);

  let pendientes = $derived(datos.tareas.filter((t) => t.estado === 'pendiente'));

  async function guardar(evento) {
    evento.preventDefault();
    error = '';
    guardando = true;
    try {
      if (editandoId) {
        await editarTarea(editandoId, form);
      } else {
        await crearTarea(form);
      }
      cancelar();
    } catch (e) {
      error = e.message;
    } finally {
      guardando = false;
    }
  }

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

  function cancelar() {
    editandoId = null;
    form = { ...FORMULARIO_VACIO };
  }
</script>

<section>
  <h2>{editandoId ? 'Editar tarea' : 'Nueva tarea'}</h2>

  <form class="formulario" onsubmit={guardar}>
    <label>
      Materia
      <input bind:value={form.materia} placeholder="Ingeniería Web" required />
    </label>
    <label>
      Título
      <input bind:value={form.titulo} placeholder="CRUD y login con MVC" required />
    </label>
    <label>
      Fecha de entrega
      <input type="date" bind:value={form.fecha_entrega} required />
    </label>
    <label>
      Prioridad
      <select bind:value={form.prioridad}>
        <option value="baja">Baja</option>
        <option value="media">Media</option>
        <option value="alta">Alta</option>
      </select>
    </label>

    <div class="botones">
      <button type="submit" disabled={guardando}>
        {editandoId ? 'Guardar cambios' : 'Agregar tarea'}
      </button>
      {#if editandoId}
        <button type="button" class="secundario" onclick={cancelar}>Cancelar</button>
      {/if}
    </div>
  </form>

  {#if error}
    <p class="error">{error}</p>
  {/if}
</section>

<section>
  <h2>Por entregar <span class="cuenta">({pendientes.length})</span></h2>

  {#if datos.cargando}
    <p class="vacio">Cargando tus tareas…</p>
  {:else}
    <ul class="lista">
      {#each pendientes as tarea (tarea.id)}
        <TareaItem {tarea} oneditar={editar} />
      {:else}
        <li class="vacio">Nada pendiente. Agrega tu próximo deber arriba.</li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .formulario {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 18px 24px;
  }
  .botones {
    grid-column: 1 / -1;
    display: flex;
    gap: 12px;
  }
  .cuenta {
    color: var(--tinta-suave);
    font-size: 1.6rem;
  }
</style>