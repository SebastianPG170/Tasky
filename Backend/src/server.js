// 1. Traemos la librería Express
import express from 'express';

// 2. Creamos la aplicación (nuestro servidor)
const app = express();

// 3. El "puerto" es como el número de puerta por donde entran las peticiones
const PUERTO = 3000;

// 4. Una RUTA: cuando alguien visite "/", respondemos con un texto
app.get('/', (req, res) => {
  res.send('¡Hola! Mi servidor funciona jeje');
});

// 5. Otra ruta, pero esta responde en formato JSON (así hablan las APIs)
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde la API', app: 'TareaRacha' });
});

// 6. Encendemos el servidor y lo ponemos a escuchar en el puerto 3000
app.listen(PUERTO, () => {
  console.log(`Servidor escuchando en http://localhost:${PUERTO}`);
});