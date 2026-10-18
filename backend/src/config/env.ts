import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  API_PREFIX: z.string().default('/api/v1'),
  LOG_LEVEL: z.string().default('info'),

  CORS_ORIGINS: z.string().default('http://localhost:5173'),

  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_STORAGE_BUCKET: z.string().optional(),

  IP_HASH_SALT: z.string().min(16),

  CONTACT_RATE_LIMIT_MAX: z.coerce.number().default(5),
  CONTACT_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(60),
  GLOBAL_RATE_LIMIT_MAX: z.coerce.number().default(300),
  GLOBAL_RATE_LIMIT_WINDOW_MINUTES: z.coerce.number().default(15),

  MAIL_ENABLED: z.enum(['true', 'false']).default('false'),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().default(587),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_NOTIFY_TO: z.string().optional(),
});

const parsed = schema.safeParse(process.env);
if (!parsed.success) {
  console.error('❌ Invalid environment configuration:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  corsOrigins: parsed.data.CORS_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean),
  mailEnabled: parsed.data.MAIL_ENABLED === 'true',
  isProd: parsed.data.NODE_ENV === 'production',
};
