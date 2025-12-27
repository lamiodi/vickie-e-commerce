import { env } from '../config/env.js';

export const errorHandler = (err, req, res, _next) => {
  let statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle specific error types that might lose their status code (e.g. from multer)
  if (message.includes('Invalid file type')) {
    statusCode = 400;
  }

  // Log the error for debugging
  console.error(`[Error] ${req.method} ${req.url}:`, err);
  
  res.status(statusCode).json({
    success: false,
    error: {
      message,
      ...(env.nodeEnv === 'development' && { stack: err.stack }),
    },
  });
};
