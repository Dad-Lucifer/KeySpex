import type { Request, Response } from 'express';
import {
  adminListProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetImageUploadUrl,
} from '../projects/projects.controller.js';

export { adminListProjects, adminCreateProject, adminUpdateProject, adminDeleteProject, adminGetImageUploadUrl };
