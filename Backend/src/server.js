import express from 'express';
import tareaRoutes from './routes/tareaRoutes.js';

const app = express();
const PUERTO = 3000;

// Permite leer datos en formato JSON que llegan en req.body
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API de Tasky funcionando 🚀');
});

// Todas las rutas de tareas empiezan con /api/tareas
app.use('/api/tareas', tareaRoutes);

app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});