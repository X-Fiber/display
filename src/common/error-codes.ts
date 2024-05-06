export const ErrorCode = {
  handshake: {
    INVALID_STRINGIFY_OBJECT: '0000.0001',
    INVALID_EVENT_STRUCTURE: '0000.0002',
    UNKNOWN_EVENT: '0000.0003',
  },
  type: {
    UNKNOWN_SERVICE: '1000.0001',
    UNKNOWN_DOMAIN: '1000.0002',
    UNKNOWN_EVENT: '1000.0003',
    UNKNOWN_LISTENER: '1000.0004',
  },
  auth: {
    USER_FORBIDDEN: '2000.0001',
    ORGANIZATION_FORBIDDEN: '2000.0002',
  },
  session: {
    toSession: {
      INVALID_EVENT_STRUCTURE: '3000.0001',
    },
  },
} as const;
