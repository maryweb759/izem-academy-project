exports.successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    status: "success",
    message,
    data,
  });
};

exports.errorResponse = (res, statusCode, message) => {
  return res.status(statusCode).json({
    status: "error",
    message,
  });
};
