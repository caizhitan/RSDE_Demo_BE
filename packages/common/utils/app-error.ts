export class AppError extends Error {
  public readonly name: string;
  public readonly httpCode: number;
  public readonly isOperational: boolean;

  constructor(
    commonError: CommonError,
    description: string,
    isOperational: boolean // operational errors refer to known cases where the error impact is fully understood and can be handled thoughtfully.
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

    this.name = commonError.name;
    this.httpCode = commonError.httpCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this);
  }
}

// Please refer to https://cloud.google.com/apis/design/errors#handling_errors
export const commonErrors = {
  InvalidArgument: {
    httpCode: 400,
    name: "INVALID_ARGUMENT",
  },
  Unauthenticated: {
    httpCode: 401,
    name: "UNAUTHENTICATED",
  },
  PermissionDenied: {
    httpCode: 403,
    name: "PERMISSION_DENIED",
  },
  NotFound: {
    httpCode: 404,
    name: "NOT_FOUND",
  },
  ServerError: {
    httpCode: 500,
    name: "INTERNAL",
  },
};

interface CommonError {
  httpCode: number;
  name: string;
}
