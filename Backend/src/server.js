import express from 'express';
import session from 'express-session';
import authRoutes from './routes/authRoutes.js';
import tareaRoutes from './routes/tareaRoutes.js';
import { requireAuth } from './middleware/requireAuth.js';

const app = express();
const PUERTO = 3000;

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,  // firma la cookie (viene del .env)
  resave: false,                       // no guardar la sesión si no cambió
  saveUninitialized: false,            // no crear sesiones vacías a visitantes
  cookie: {
    httpOnly: true,                    // JavaScript del navegador no puede leerla
    sameSite: 'lax',                   // protege contra peticiones de otros sitios
    maxAge: 1000 * 60 * 60 * 2,        // dura 2 horas (en milisegundos)
  },
}));

app.get('/', (req, res) => {
  res.send('API de Tasky funcionando 🚀');
});

// Rutas públicas: no requieren sesión
app.use('/api/auth', authRoutes);

// Rutas protegidas: requireAuth exige sesión antes de llegar al router
app.use('/api/tareas', requireAuth, tareaRoutes);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});