<script>
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';

  // Estado del formulario
  let username = $state('');
  let password = $state('');
  let error = $state('');
  let enviando = $state(false);

  async function iniciarSesion(evento) {
    evento.preventDefault(); // evita que el navegador recargue la página
    error = '';
    enviando = true;

    try {
      auth.usuario = await api('/auth/login', {
        method: 'POST',
        body: { username, password },
      });
      location.hash = '#/tareas';
    } catch (e) {
      error = e.message; // "Usuario o contraseña incorrectos"
    } finally {
      enviando = false;
    }
  }
</script>

<main class="contenedor-login">
  <form class="tarjeta" onsubmit={iniciarSesion}>
    <h1>📚 Tasky</h1>
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
  .subtitulo {
    margin: -8px 0 8px;
    text-align: center;
    color: var(--texto-suave);
  }
</style>