// Uso: node scripts/cambiar-password.js <usuario> <contraseña-nueva>
import db from '../src/config/db.js';
import { md5 } from '../src/utils/hash.js';

const [usuario, nueva] = process.argv.slice(2);

if (!usuario || !nueva) {
  console.log('Uso: node scripts/cambiar-password.js <usuario> <contraseña-nueva>');
  process.exit(1);
}

const resultado = db
  .prepare('UPDATE usuarios SET password = ? WHERE username = ?')
  .run(md5(nueva), usuario.toLowerCase());

console.log(
  resultado.changes
    ? `Listo: la contraseña de "${usuario}" ahora es "${nueva}"`
    : `No existe el usuario "${usuario}"`
);