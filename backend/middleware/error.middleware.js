// Global error handling middleware
export const errorHandler = (err, req, res, next) => {
  console.error("Error caught in middleware:", err);

  // Use provided status code or default to 500
  const statusCode = err.statusCode || 500;

  const response = {
    success: false,
    message: err.message || "Internal Server Error",
  };

  // Show stack trace only in development mode
  if (process.env.NODE_ENV !== "production") {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};