<script>
  import { datos } from '../lib/tareas.svelte.js';
  import { calcularXP, calcularRacha } from '../lib/progreso.js';

  let xp = $derived(calcularXP(datos.tareas));
  let nivel = $derived(Math.floor(xp / 100) + 1);
  let xpEnNivel = $derived(xp % 100);
  let cuadritosLlenos = $derived(Math.floor(xpEnNivel / 10));
  let racha = $derived(calcularRacha(datos.tareas));
  let porMateria = $derived(resumirPorMateria(datos.tareas));

  // Cuenta cuántas tareas hay y cuántas se entregaron en cada materia
  function resumirPorMateria(tareas) {
    const materias = {};
    for (const tarea of tareas) {
      materias[tarea.materia] ??= { nombre: tarea.materia, total: 0, entregadas: 0 };
      materias[tarea.materia].total++;
      if (tarea.estado === 'entregada') materias[tarea.materia].entregadas++;
    }
    return Object.values(materias).sort((a, b) => b.total - a.total);
  }
</script>

<section class="racha">
  <p class="numero"><span class="resaltado"><span class="cifra">{racha}</span></span></p>
  <p>
    {#if racha === 0}
      Entrega una tarea hoy para empezar tu racha.
    {:else}
      {racha === 1 ? 'día seguido' : 'días seguidos'} entregando deberes.
    {/if}
  </p>
</section>

<section>
  <h2>Nivel {nivel}</h2>
  <div class="cuadritos" role="img" aria-label="{xpEnNivel} de 100 XP para el nivel {nivel + 1}">
    {#each { length: 10 } as _, i}
      <span class:lleno={i < cuadritosLlenos}></span>
    {/each}
  </div>
  <p>Llevas {xp} XP. Te faltan {100 - xpEnNivel} para el nivel {nivel + 1}.</p>
  <p class="vacio">Cada tarea entregada a tiempo vale 20 XP; si la entregas tarde, 5.</p>
</section>

<section>
  <h2>Por materia</h2>
  <ul class="lista">
    {#each porMateria as materia (materia.nombre)}
      <li class="materia">
        <span>{materia.nombre}</span>
        <span class="conteo">{materia.entregadas} de {materia.total} entregadas</span>
      </li>
    {:else}
      <li class="vacio">Agrega tareas para ver cómo vas en cada materia.</li>
    {/each}
  </ul>
</section>

<style>
  .racha { text-align: center; }
  .racha p { margin: 0; }
    .racha .numero {
    font-family: var(--mano);
    font-size: 7rem;
    font-weight: 700;
    line-height: 1;
    margin-bottom: 12px;
  }
    .numero .resaltado {
        
    display: inline-grid;
    place-items: center;
    min-width: 1.3em;
    height: 1.3em;
    padding: 0 0.2em;
    line-height: 1;
    background: none;
    border: 4px solid var(--margen);
    border-radius: 50% 45% 55% 48% / 55% 50% 48% 52%;
    transform: rotate(-4deg);
  }
  /* Centrado óptico: Caveat dibuja los números desplazados hacia la derecha y abajo */
  .cifra {
    transform: translate(-0.1em, -0.05em);
  }
  .cuadritos {
    display: grid;
    grid-template-columns: repeat(10, 24px);
    margin-bottom: 8px;
  }
  .cuadritos span {
    height: 24px;
    border: 2px solid var(--tinta);
    margin-right: -2px;
  }
  .cuadritos span.lleno { background: var(--tinta); }
  .materia {
    display: flex;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 0;
    border-bottom: 1px dashed var(--tinta-suave);
    font-weight: 700;
  }
  .conteo {
    font-family: var(--mano);
    font-size: 1.4rem;
    font-weight: 500;
    color: var(--tinta-suave);
    white-space: nowrap;
  }
</style>