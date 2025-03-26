export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  FOUND: 302,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  REQUEST_TIMEOUT: 408,
  GONE: 410,
  TOO_MANY_REQUEST: 429,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
};

export const MESSAGE = {
  ERROR: {
    INVALID_EMAIL_FORMAT: "Email format is wrong!",
    SHORT_PASSWORD: "Password must be at least 6 characters",
    UNKNOWN_ERROR: "Unknown error had occured. Please try again!",
    SERVER_ERROR: "An unknown error had occured at server side.",
  },
  SUCCESS: {
    LOGGED_IN: "Logged-in successfully!",
    CREATED: "created successfully!",
    UPDATED: "updated successfully!",
    DELETED: "deleted successfully!",
  },
};
