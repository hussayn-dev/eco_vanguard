const { StatusCodes } = require("http-status-codes");
exports.notFound = (req, res) => {
  res.status(StatusCodes.NOT_FOUND).json({
    message: "Route not found",
    status: false,
  });
};
exports.errorHandler = (error, req, res, next) => {
  console.error(error);
  let customError = {
    message: error.message || "Something went wrong, try again later",
    status: error.status || false,
    statusCode: error.statusCode || 500,
    reason: error.reason || null,
  };
  if (error.name === "ValidationError") {
    customError.message = Object.values(error.errors)
      .map((item) => item.message)
      .join(",");

    customError.statusCode = 400;
    customError.status = false;
  }
  if (error.code && error.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(
      error.keyValue
    )} field, please choose another value`;
    customError.statusCode = 400;
    customError.status = false;
  }
  if (error.name === "CastError") {
    customError.message = `No item found with id : ${error.value}`;
    customError.statusCode = 404;
    customError.status = false;
  }
  res.status(customError.statusCode).json({
    message: customError.message,
    reason: customError.reason,
    status: customError.status,
  });
};
