import type { Request, Response } from 'express';
import {
  listPublicProjects,
  getPublicProject,
  listAllProjects,
  createProject,
  updateProject,
  deleteProject,
  getSignedImageUploadUrl,
} from './projects.service.js';
import { ok } from '../../lib/response.js';
import { ApiError } from '../../lib/ApiError.js';
import type { CreateProjectInput, UpdateProjectInput, ListProjectsQuery } from './projects.schema.js';

export async function listProjects(req: Request, res: Response) {
  const query = req.query as unknown as ListProjectsQuery;
  const projects = await listPublicProjects(query);
  res
    .set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300')
    .status(200)
    .json({ success: true, data: projects });
}

export async function getProject(req: Request, res: Response) {
  const project = await getPublicProject(String(req.params['slug'] ?? ''));
  if (!project) throw ApiError.notFound('Project not found');
  ok(res, project);
}

export async function adminListProjects(_req: Request, res: Response) {
  const projects = await listAllProjects();
  ok(res, projects);
}

export async function adminCreateProject(req: Request, res: Response) {
  const input = req.body as CreateProjectInput;
  const result = await createProject(input, req.user!, req.id as string);
  if (result.conflict) throw ApiError.conflict('A project with this slug already exists');
  ok(res, { slug: result.slug }, 201);
}

export async function adminUpdateProject(req: Request, res: Response) {
  const slug = String(req.params['slug'] ?? '');
  const result = await updateProject(slug, req.body as UpdateProjectInput, req.user!, req.id as string);
  if (!result) throw ApiError.notFound('Project not found');
  ok(res, { slug });
}

export async function adminDeleteProject(req: Request, res: Response) {
  const slug = String(req.params['slug'] ?? '');
  const result = await deleteProject(slug, req.user!, req.id as string);
  if (!result) throw ApiError.notFound('Project not found');
  ok(res, { slug });
}

export async function adminGetImageUploadUrl(req: Request, res: Response) {
  const slug = String(req.params['slug'] ?? '');
  const { contentType, fileName } = req.body as { contentType: string; fileName: string };
  const result = await getSignedImageUploadUrl(slug, contentType, fileName);
  ok(res, result, 200);
}
