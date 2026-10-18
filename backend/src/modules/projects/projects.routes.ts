import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { listProjectsQuery } from './projects.schema.js';
import { listProjects, getProject } from './projects.controller.js';

export const projectsRouter = Router();

projectsRouter.get('/', validate(listProjectsQuery, 'query'), asyncHandler(listProjects));
projectsRouter.get('/:slug', asyncHandler(getProject));
