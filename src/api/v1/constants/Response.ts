class ResponseConstants {
  static readonly OK = 200;

  static readonly OK_MSG = 'Success';

  static readonly BAD_REQUEST = 400;

  static readonly BAD_REQUEST_MSG = 'Please check request requirements';

  static readonly UNAUTHORIZED = 401;

  static readonly UNAUTHORIZED_MSG = 'Invalid creds';

  static readonly FORBIDDEN = 403;

  static readonly FORBIDDEN_MSG = 'Unable to process request';

  static readonly NOT_FOUND = 404;

  static readonly NOT_FOUND_MSG = 'Cannot find requested resource';

  static readonly CONFLICT = 409;

  static readonly CONFLICT_MSG = 'This resource already exists';

  static readonly INTERNAL_SERVER_ERROR = 500;

  static readonly INTERNAL_SERVER_ERROR_MSG = 'Server error';

  static readonly DATABASE_ERROR_MSG = 'Database error, please try again later';

  static readonly FAILURE = 'Failure';

  static readonly USER_CREATION_SUCCESS = 'User has been created successfully';

  static readonly USER_CREATION_FAILED = 'User has not been created';
}

export { ResponseConstants };
