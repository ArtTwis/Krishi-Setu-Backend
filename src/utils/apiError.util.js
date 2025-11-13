class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong!",
    errors = null,
    data = null,
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors ?? message;
    this.data = data;
    this.success = false;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
