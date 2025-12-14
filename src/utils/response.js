// Create src/utils/response.js
export const successResponse = (data, message = 'Success') => ({
  status: 'success',
  message,
  data
});

export const errorResponse = (message, details = null) => ({
  status: 'error',
  message,
  ...(details && { details })
});

