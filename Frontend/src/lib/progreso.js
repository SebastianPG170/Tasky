// Fecha de hoy en formato AAAA-MM-DD (hora local de Ecuador)
export function hoy() {
  return new Date().toLocaleDateString('en-CA');
}

// Días que faltan para una fecha (negativo = ya pasó)
export function diasHasta(fecha) {
  const objetivo = new Date(fecha + 'T00:00:00');
  const actual = new Date(hoy() + 'T00:00:00');
  return Math.round((objetivo - actual) / 86400000); // 86 400 000 ms = 1 día
}

// Texto amigable para mostrar en cada tarea
export function textoVencimiento(fecha) {
  const dias = diasHasta(fecha);
  if (dias === 0) return '⏰ Vence hoy';
  if (dias === 1) return '📅 Vence mañana';
  if (dias > 1) return `📅 Faltan ${dias} días`;
  return `⚠️ Atrasada ${-dias} día${dias === -1 ? '' : 's'}`;
}

// XP de una tarea: 20 si se entregó a tiempo, 5 si se entregó tarde
export function xpDeTarea(tarea) {
  if (tarea.estado !== 'entregada') return 0;
  return tarea.fecha_completada <= tarea.fecha_entrega ? 20 : 5;
}

// XP total: suma los XP de todas las tareas
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
    fecha.setDate(fecha.getDate() - 1); // retrocede un día
  }
  return racha;
}