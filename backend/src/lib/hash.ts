import { createHash } from 'node:crypto';
import { env } from '../config/env.js';

export const hashIp = (ip: string | undefined): string | null =>
  ip ? createHash('sha256').update(`${env.IP_HASH_SALT}:${ip}`).digest('hex') : null;
