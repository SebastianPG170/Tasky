<script>
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';

  let username = $state('');
  let password = $state('');
  let confirmacion = $state('');
  let error = $state('');
  let enviando = $state(false);

  async function crearCuenta(evento) {
    evento.preventDefault();
    error = '';

    // Validación solo de frontend: la confirmación no se envía al backend
    if (password !== confirmacion) {
      error = 'Las contraseñas no coinciden';
      return;
    }

    enviando = true;
    try {
      auth.usuario = await api('/auth/registro', {
        method: 'POST',
        body: { username, password },
      });
      location.hash = '#/tareas';
    } catch (e) {
      error = e.message;
    } finally {
      enviando = false;
    }
  }
</script>

<main class="contenedor-login">
  <form class="tarjeta" onsubmit={crearCuenta}>
    <h1>📚 Tasky</h1>
    <p class="subtitulo">Crea tu cuenta y empieza tu racha.</p>

    <label>
      Usuario
      <input bind:value={username} autocomplete="username" placeholder="juan_perez" required />
    </label>

    <label>
      Contraseña
      <input type="password" bind:value={password} autocomplete="new-password" minlength="6" required />
    </label>

    <label>
      Repite la contraseña
      <input type="password" bind:value={confirmacion} autocomplete="new-password" required />
    </label>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={enviando}>
      {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
    </button>

    <p class="cambiar">¿Ya tienes cuenta? <a href="#/login">Inicia sesión</a></p>
  </form>
</main>

<style>
  .contenedor-login {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 16px;
  }
  .tarjeta {
    width: 100%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  h1 {
    margin: 0;
    text-align: center;
  }
  .subtitulo, .cambiar {
    margin: 0;
    text-align: center;
    color: var(--texto-suave);
  }
</style>