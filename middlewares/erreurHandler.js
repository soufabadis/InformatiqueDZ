const notFound = (req, res, next) => {
    const error = new Error('Not Found: ' + req.originalUrl);
    error.status = 404;
    next(error);
  };
  
  const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
      error: err?.message || 'Internal Server Error',
      stack: err?.stack,
    });
  };
  
  module.exports = {errorHandler,notFound};
