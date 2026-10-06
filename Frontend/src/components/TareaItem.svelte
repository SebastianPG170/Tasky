<script>
  import { textoVencimiento, diasHasta, xpDeTarea } from '../lib/progreso.js';
  import { alternarEstado, eliminarTarea } from '../lib/tareas.svelte.js';

  // oneditar es opcional: en la pestaña Entregadas no se edita
  let { tarea, oneditar } = $props();

  let entregada = $derived(tarea.estado === 'entregada');
  let urgente = $derived(!entregada && diasHasta(tarea.fecha_entrega) <= 1);
</script>

<li class="tarea" class:entregada>
  <button
    class="casilla"
    onclick={() => alternarEstado(tarea)}
    aria-pressed={entregada}
    aria-label={entregada
      ? `Marcar "${tarea.titulo}" como pendiente`
      : `Marcar "${tarea.titulo}" como entregada`}
  >
    {#if entregada}✓{/if}
  </button>

  <div class="info">
    <span class="materia">{tarea.materia}</span>
    <span class="titulo">{tarea.titulo}</span>
  </div>

  <span class="anotacion" class:urgente>
    {entregada ? `+${xpDeTarea(tarea)} XP` : textoVencimiento(tarea.fecha_entrega)}
  </span>

  <span class="prioridad {tarea.prioridad}">{tarea.prioridad}</span>

  <div class="acciones">
    {#if oneditar}
      <button class="texto" onclick={() => oneditar(tarea)}>Editar</button>
    {/if}
    <button class="texto peligro" onclick={() => eliminarTarea(tarea)}>Borrar</button>
  </div>
</li>

<style>
  .tarea {
    display: grid;
    grid-template-columns: auto 1fr auto auto;
    align-items: center;
    gap: 2px 14px;
    padding: 12px 0 8px;
    border-bottom: 1px dashed var(--tinta-suave);
  }
  .casilla {
    width: 26px;
    height: 26px;
    padding: 0;
    display: grid;
    place-items: center;
    background: transparent;
    color: var(--tinta);
    border: 2px solid var(--tinta);
    border-radius: 3px;
    font-family: var(--mano);
    font-size: 1.6rem;
    line-height: 1;
  }
  .info {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  .materia {
    font-size: 0.8rem;
    color: var(--tinta-suave);
  }
  .titulo {
    font-weight: 700;
    overflow-wrap: anywhere;
  }
  .entregada .titulo {
    color: var(--tinta-suave);
    text-decoration: line-through;
    text-decoration-color: var(--margen);
    text-decoration-thickness: 2px;
  }
  .anotacion {
    font-family: var(--mano);
    font-size: 1.45rem;
    color: var(--tinta-suave);
    white-space: nowrap;
  }
  .anotacion.urgente { color: var(--margen); }
  .entregada .anotacion { color: var(--exito); }
  .prioridad {
    font-size: 0.8rem;
    font-weight: 700;
    padding: 1px 8px;
    border: 1.5px solid currentColor;
    border-radius: 99px;
  }
  .prioridad.alta { color: var(--margen); }
  .prioridad.media { color: var(--tinta); }
  .prioridad.baja { color: var(--tinta-suave); }
  .acciones {
    grid-column: 2 / -1;
    display: flex;
    gap: 4px;
    margin-left: -6px;
  }
  @media (max-width: 600px) {
    .tarea { grid-template-columns: auto 1fr; }
    .anotacion, .prioridad, .acciones { grid-column: 2; justify-self: start; }
  }
</style>