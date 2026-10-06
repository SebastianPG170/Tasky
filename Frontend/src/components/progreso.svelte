<script>
  import { calcularXP, calcularRacha } from '../lib/progreso.js';

  // Recibe las tareas desde la página que lo use
  let { tareas } = $props();

  // Valores derivados: se recalculan solos cuando cambian las tareas
  let xp = $derived(calcularXP(tareas));
  let nivel = $derived(Math.floor(xp / 100) + 1);
  let xpEnNivel = $derived(xp % 100);
  let racha = $derived(calcularRacha(tareas));
</script>

<section class="progreso">
  <div class="dato">
    <span class="icono">🔥</span>
    <strong>{racha}</strong>
    <span>día{racha === 1 ? '' : 's'} de racha</span>
  </div>

  <div class="dato">
    <span class="icono">⭐</span>
    <strong>{xp}</strong>
    <span>XP total</span>
  </div>

  <div class="nivel">
    <div class="nivel-texto">
      <strong>Nivel {nivel}</strong>
      <span>{xpEnNivel}/100 XP</span>
    </div>
    <div class="barra-progreso">
      <div class="relleno" style="width: {xpEnNivel}%"></div>
    </div>
  </div>
</section>

<style>
  .progreso {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 12px;
    margin: 20px 0;
  }
  .dato, .nivel {
    background: var(--tarjeta);
    border: 2px solid var(--borde);
    border-radius: 16px;
    padding: 14px;
  }
  .dato {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .dato strong {
    font-size: 1.8rem;
  }
  .dato span:last-child {
    color: var(--texto-suave);
    font-size: 0.85rem;
  }
  .icono {
    font-size: 1.5rem;
  }
  .nivel {
    grid-column: 1 / -1;
  }
  .nivel-texto {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  .barra-progreso {
    height: 14px;
    background: var(--borde);
    border-radius: 99px;
    overflow: hidden;
  }
  .relleno {
    height: 100%;
    background: var(--fuego);
    border-radius: 99px;
    transition: width 0.4s ease;
  }
</style>