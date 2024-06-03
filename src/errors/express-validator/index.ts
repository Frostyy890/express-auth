import { CustomError } from "../CustomError";
import { ValidationError } from "express-validator";
import { HttpStatus } from "../common/status_codes";

export default class REQUEST_VALIDATION_ERROR extends CustomError {
  private static readonly _statusCode = HttpStatus.BAD_REQUEST;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _validationErrors: ValidationError[];
  private readonly _context: { [key: string]: any };

  constructor(params: {
    validationErrors: ValidationError[];
    logging?: boolean;
    context?: { [key: string]: any };
  }) {
    const { validationErrors, logging, context } = params;
    super("Bad request");
    this._code = REQUEST_VALIDATION_ERROR._statusCode;
    this._logging = logging || false;
    this._validationErrors = validationErrors || [];
    this._context = context || {};

    Object.setPrototypeOf(this, REQUEST_VALIDATION_ERROR.prototype);
  }

  get errors() {
    return this._validationErrors.map((err) => ({
      message: err.type === "field" ? err.path + " " + err.msg : err.msg,
      context: this._context,
    }));
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}
