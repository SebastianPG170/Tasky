// 'en-CA' da AAAA-MM-DD en hora local; toISOString() usa UTC y de noche devolvería el día siguiente
export function hoy() {
  return new Date().toLocaleDateString('en-CA');
}

// Días que faltan para una fecha (negativo = ya pasó)
export function diasHasta(fecha) {
  const objetivo = new Date(fecha + 'T00:00:00');
  const actual = new Date(hoy() + 'T00:00:00');
  return Math.round((objetivo - actual) / 86400000); // 86 400 000 ms = 1 día
}


// Texto para el margen de cada tarea
export function textoVencimiento(fecha) {
  const dias = diasHasta(fecha);
  if (dias === 0) return 'vence hoy';
  if (dias === 1) return 'vence mañana';
  if (dias > 1) return `faltan ${dias} días`;
  return dias === -1 ? 'atrasada 1 día' : `atrasada ${-dias} días`;
}

// XP de una tarea: 20 si se entregó a tiempo, 5 si se entregó tarde
export function xpDeTarea(tarea) {
  if (tarea.estado !== 'entregada') return 0;
  return tarea.fecha_completada <= tarea.fecha_entrega ? 20 : 5;
}

export function calcularXP(tareas) {
  return tareas.reduce((total, tarea) => total + xpDeTarea(tarea), 0);
}

// Racha: días seguidos (hasta hoy o ayer) en los que entregaste algo
export function calcularRacha(tareas) {
  const diasConEntrega = new Set(
    tareas.filter((t) => t.fecha_completada).map((t) => t.fecha_completada)
  );

  const fecha = new Date();
  // Si hoy aún no entregas nada, la racha sigue viva desde ayer
  if (!diasConEntrega.has(fecha.toLocaleDateString('en-CA'))) {
    fecha.setDate(fecha.getDate() - 1);
  }

  let racha = 0;
  while (diasConEntrega.has(fecha.toLocaleDateString('en-CA'))) {
    racha++;
    fecha.setDate(fecha.getDate() - 1);
  }
  return racha;
}