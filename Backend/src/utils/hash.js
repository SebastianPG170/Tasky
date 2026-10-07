import { createHash } from 'node:crypto';

export function md5(texto) {
  return createHash('md5').update(texto).digest('hex');
}