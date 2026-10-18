import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { listServices } from './services.controller.js';

export const servicesRouter = Router();
servicesRouter.get('/', asyncHandler(listServices));
