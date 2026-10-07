// Protección real de las rutas privadas: sin sesión, la petición no llega al controlador
export function requireAuth(req, res, next) {
  if (!req.session.usuarioId) {
    return res.status(401).json({ error: 'Debes iniciar sesión' });
  }
  next();
}