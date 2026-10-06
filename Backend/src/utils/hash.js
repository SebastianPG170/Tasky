import { createHash } from 'node:crypto';

// Convierte un texto en su hash MD5 (32 caracteres hexadecimales)
export function md5(texto) {
  return createHash('md5').update(texto).digest('hex');
}