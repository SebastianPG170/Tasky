<script>
  import { datos } from '../lib/tareas.svelte.js';
  import TareaItem from '../components/TareaItem.svelte';

  // Las más recientes primero
  let entregadas = $derived(
    datos.tareas
      .filter((t) => t.estado === 'entregada')
      .sort((a, b) => b.fecha_completada.localeCompare(a.fecha_completada))
  );
</script>

<section>
  <h2>Entregadas <span class="cuenta">({entregadas.length})</span></h2>
  <p class="vacio">Si marcaste una por error, desmarca su casilla y volverá a tus tareas.</p>

  {#if datos.cargando}
    <p class="vacio">Cargando tus tareas…</p>
  {:else}
    <ul class="lista">
      {#each entregadas as tarea (tarea.id)}
        <TareaItem {tarea} />
      {:else}
        <li class="vacio">Cuando marques tu primera tarea como entregada, aparecerá aquí.</li>
      {/each}
    </ul>
  {/if}
</section>

<style>
  .cuenta {
    color: var(--tinta-suave);
    font-size: 1.6rem;
  }
</style>