<script>
  import { api } from '../lib/api.js';
  import { auth } from '../lib/auth.svelte.js';

  async function cerrarSesion() {
    await api('/auth/logout', { method: 'POST' });
    auth.usuario = null;
    location.hash = '#/login';
  }
</script>

<main class="pagina">
  <header class="barra">
    <h1>📚 Tasky</h1>
    <div class="usuario">
      <span>Hola, <strong>{auth.usuario.username}</strong> 👋</span>
      <button class="secundario" onclick={cerrarSesion}>Cerrar sesión</button>
    </div>
  </header>

  <p>Aquí irán tus tareas 🚧</p>
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
</style>