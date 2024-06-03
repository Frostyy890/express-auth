import { CustomError } from "../CustomError";
import { HttpStatus } from "./status_codes";

export default class CONFLICT_ERROR extends CustomError {
  private static readonly _statusCode = HttpStatus.CONFLICT;
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

    super(message || "Conflict");
    this._code = code || CONFLICT_ERROR._statusCode;
    this._logging = logging || false;
    this._context = params?.context || {};

    // Only because we are extending a built in class
    Object.setPrototypeOf(this, CONFLICT_ERROR.prototype);
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
