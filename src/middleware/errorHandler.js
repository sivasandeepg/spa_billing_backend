// src/middleware/errorHandler.js

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    status: 'error',
    message: 'An unexpected error occurred.',
    data: {
      details: err.message
    }
  });
};

export { errorHandler }; 