import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ApiError } from '../lib/ApiError.js';
import { logger } from '../lib/logger.js';

export const notFound: RequestHandler = (_req, _res, next) => next(ApiError.notFound('Route not found'));

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
    });
  }

  // Malformed JSON from body-parser
  if ((err as any)?.type === 'entity.parse.failed') {
    return res.status(400).json({
      success: false,
      error: { code: 'BAD_JSON', message: 'Request body is not valid JSON' },
    });
  }

  logger.error({ err, requestId: req.id }, 'Unhandled error');
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Something went wrong. Please try again later.' },
  });
};
