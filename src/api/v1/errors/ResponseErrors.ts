import { ResponseConstants } from "../constants/Response";

export class BadRequestError extends Error {
    static statusCode: number = ResponseConstants.BAD_REQUEST;

    constructor(message?: string) {
        super(message ? message : ResponseConstants.BAD_REQUEST_MSG);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ForbiddenError extends Error {
    static statusCode: number = ResponseConstants.FORBIDDEN;;

    constructor(message?: string) {
        super(message ? message : ResponseConstants.FORBIDDEN_MSG);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class ConflictError extends Error {
    static statusCode: number = ResponseConstants.CONFLICT;

    constructor(message?: string) {
        super(message ? message : ResponseConstants.CONFLICT_MSG)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class DatabaseError extends Error {
    static statusCode: number = ResponseConstants.INTERNAL_SERVER_ERROR

    constructor(message?: string) {
        super(message ? message : ResponseConstants.DATABASE_ERROR_MSG)
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class InternalServerError extends Error {
    static statusCode: number = ResponseConstants.INTERNAL_SERVER_ERROR;

    constructor(message?: string) {
        super(message? message : ResponseConstants.INTERNAL_SERVER_ERROR_MSG );
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class NotFoundError extends Error {
    static statusCode: number = ResponseConstants.NOT_FOUND;

    constructor(message?: string) {
        super(message ? message : ResponseConstants.NOT_FOUND_MSG);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

export class UnauthorizedError extends Error {
    static statusCode: number = ResponseConstants.UNAUTHORIZED;

    constructor(message?: string) {
        super(message ? message : ResponseConstants.UNAUTHORIZED_MSG);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

