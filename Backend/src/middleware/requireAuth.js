// Se ejecuta ANTES del controlador. Si no hay sesión, corta la petición aquí.
export function requireAuth(req, res, next) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ error: 'Debes iniciar sesión' });
  }
  next(); // tiene pulsera: puede pasar al controlador
}