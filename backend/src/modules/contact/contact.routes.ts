import { Router } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { validate } from '../../middleware/validate.js';
import { contactLimiter } from '../../middleware/rateLimiters.js';
import { createContactSchema } from './contact.schema.js';
import { createContact } from './contact.controller.js';

export const contactRouter = Router();
contactRouter.post('/', contactLimiter, validate(createContactSchema), asyncHandler(createContact));
