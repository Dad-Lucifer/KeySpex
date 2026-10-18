import { z } from 'zod';

export const slug = z
  .string()
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Use lowercase letters, numbers, and hyphens')
  .max(80);

export const projectCategory = z.enum([
  'website-development',
  'custom-digital-solutions',
  'digital-growth-optimization',
]);

const httpsUrl = z.string().url().refine((u) => u.startsWith('https://'), 'URL must use HTTPS');

export const createProjectSchema = z.object({
  slug,
  title: z.string().trim().min(2).max(120),
  category: projectCategory,
  summary: z.string().trim().min(10).max(220),
  description: z.string().trim().max(5000).optional(),
  coverImageUrl: httpsUrl.nullable().default(null),
  coverImageAlt: z.string().trim().min(5).max(200),
  gallery: z
    .array(z.object({ url: httpsUrl, alt: z.string().trim().min(5).max(200) }))
    .max(12)
    .default([]),
  projectUrl: httpsUrl.nullable().default(null),
  isPlaceholder: z.boolean().default(false),
  published: z.boolean().default(false),
  order: z.number().int().min(0).max(1000).default(100),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;

export const updateProjectSchema = createProjectSchema.omit({ slug: true }).partial();
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;

export const listProjectsQuery = z.object({
  category: projectCategory.optional(),
  limit: z.coerce.number().int().min(1).max(12).default(6),
});

export type ListProjectsQuery = z.infer<typeof listProjectsQuery>;

export const imageUploadSchema = z.object({
  contentType: z.enum(['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  fileName: z.string().min(1).max(200),
});
