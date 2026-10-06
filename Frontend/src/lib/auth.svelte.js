// Estado compartido por toda la app: ¿quién inició sesión?
export const auth = $state({
  usuario: null,    // null = nadie ha iniciado sesión
  cargando: true,   // true mientras preguntamos al backend si hay sesión
});