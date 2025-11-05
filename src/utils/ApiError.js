class ApiError extends Error {
  constructor(
    statusCode,
    error = "Something went wrong!",
    message = "Something went wrong!",
    data = null,
    stack = ""
  ) {
    super(message);

    this.statusCode = statusCode;
    this.error = error;
    this.message = error;
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
