<script>
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';

  let username = $state('');
  let password = $state('');
  let error = $state('');
  let enviando = $state(false);

  async function iniciarSesion(evento) {
    evento.preventDefault();
    error = '';
    enviando = true;

    try {
      auth.usuario = await api('/auth/login', {
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

<main class="portada">
  <form class="tarjeta" onsubmit={iniciarSesion}>
   <h1>Tasky</h1>
    <p class="subtitulo">Tus deberes, tu racha.</p>

    <label>
      Usuario
      <input bind:value={username} autocomplete="username" required />
    </label>

    <label>
      Contraseña
      <input type="password" bind:value={password} autocomplete="current-password" required />
    </label>

    {#if error}
      <p class="error">{error}</p>
    {/if}

    <button type="submit" disabled={enviando}>
      {enviando ? 'Entrando...' : 'Iniciar sesión'}
    </button>
    <p class="cambiar">¿No tienes cuenta? <a href="#/registro">Créala aquí</a></p>
  </form>
</main>

