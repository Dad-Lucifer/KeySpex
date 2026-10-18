import { z } from 'zod';

export const SERVICE_INTEREST = [
  'website-development',
  'custom-digital-solutions',
  'digital-growth-optimization',
  'other',
] as const;

const clean = (max: number, min = 0) => z.string().trim().min(min).max(max);

export const createContactSchema = z.object({
  name: clean(100, 2),
  email: z.string().trim().toLowerCase().email('Enter a valid email address').max(254),
  company: clean(120).optional().or(z.literal('')),
  serviceInterest: z.enum(SERVICE_INTEREST),
  message: clean(3000, 10),
  consent: z.literal(true, { errorMap: () => ({ message: 'Consent is required' }) }),
  source: clean(60).default('landing-contact-section'),
  website: z.string().max(200).optional().default(''), // honeypot
});

export type CreateContactInput = z.infer<typeof createContactSchema>;

export const updateContactSchema = z
  .object({
    status: z.enum(['new', 'in_progress', 'replied', 'archived', 'spam']).optional(),
    internalNotes: clean(2000).optional(),
  })
  .refine((v) => v.status !== undefined || v.internalNotes !== undefined, {
    message: 'Provide at least one field to update',
  });

export type UpdateContactInput = z.infer<typeof updateContactSchema>;
