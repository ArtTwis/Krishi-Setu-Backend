export const statusCodes = {
  success: {
    ok: 200,
    created: 201,
    accepted: 202,
    noContent: 204,
    partialContent: 206,
  },
  error: {
    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    methodNotAllowed: 405,
    notAcceptable: 406,
    requestTimeout: 408,
    conflicts: 409,
    gone: 410,
    validationError: 422,
    rateLimitExeeded: 429,
  },
  serverError: {
    internalServerError: 500,
    notImplemented: 501,
    badGateway: 502,
    serviceUnavailble: 503,
    gatewayTimeout: 504,
  },
};
