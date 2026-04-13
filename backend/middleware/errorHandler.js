const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation Error',
      errors: err.errors
    });
  }

  if (err.code === '23505') {
    return res.status(409).json({
      message: 'Duplicate entry',
      detail: err.detail
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      message: 'Foreign key constraint violation',
      detail: err.detail
    });
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = { errorHandler };
