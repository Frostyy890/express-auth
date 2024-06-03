import { CustomError } from "../CustomError";
import { HttpStatus } from "./status_codes";

export default class NOT_FOUND_ERROR extends CustomError {
  private static readonly _statusCode = HttpStatus.NOT_FOUND;
  private readonly _code: number;
  private readonly _logging: boolean;
  private readonly _context: { [key: string]: any };

  constructor(params?: {
    code?: number;
    message?: string;
    logging?: boolean;
    context?: { [key: string]: any };
  }) {
    const { code, message, logging } = params || {};

    super(message || "Not found");
    this._code = code || NOT_FOUND_ERROR._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, NOT_FOUND_ERROR.prototype);
  }

  get errors() {
    return [{ message: this.message, context: this._context }];
  }

  get statusCode() {
    return this._code;
  }

  get logging() {
    return this._logging;
  }
}
