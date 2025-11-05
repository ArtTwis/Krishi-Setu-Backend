import { statusCodes } from "../constants/statusCodes";

class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < statusCodes.error.badRequest;
  }
}

export default ApiResponse;
