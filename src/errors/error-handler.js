const { StatusCodes } = require("http-status-codes");

class customAPIError extends Error {
  constructor(message, path = null) {
    super(message);
    this.path = path;
    this.status = false;
  }
}
class BadRequestError extends customAPIError {
  constructor(message, path) {
    super(message, path);
    this.statusCode = StatusCodes.BAD_REQUEST;
  }
}
class InternalServerError extends customAPIError {
  constructor(message, path) {
    super(message, path);
    this.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

class NotFoundError extends customAPIError {
  constructor(message, path) {
    super(message, path);
    this.statusCode = StatusCodes.NOT_FOUND;
  }
}

class UnauthenticatedError extends customAPIError {
  constructor(message, path) {
    super(message, path);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

class UnauthorizedError extends customAPIError {
  constructor(message, path) {
    super(message, path);
    this.statusCode = StatusCodes.FORBIDDEN;
  }
}

module.exports = {
  UnauthenticatedError,
  InternalServerError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
};
