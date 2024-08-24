import { encodeSession } from '../providers/session.mjs';
import account from './account.mjs';

export default {
  _id: {
    type: 'string',
  },
  type: {
    type: 'integer',
  },
  token: ['.', {
    type: 'string',
    resolve: (d) => encodeSession({
      dateTimeExpired: d.dateTimeExpired,
      session: d._id,
      type: d.type,
    }),
  }],
  account: {
    type: 'object',
    properties: account,
  },
  remoteAddress: {
    type: 'string',
  },
  userAgent: {
    type: 'string',
  },
  description: {
    type: 'string',
  },
  dateTimeExpired: {
    type: 'number',
  },
  dateTimeCreate: {
    type: 'number',
  },
};

export const routeMatchesSession = {
  _id: {
    type: 'string',
  },
  token: ['.', {
    type: 'string',
    resolve: (d) => encodeSession({
      dateTimeExpired: d.dateTimeExpired,
      session: d._id,
      type: d.type,
    }),
  }],
  account: {
    type: 'object',
    properties: {
      _id: {
        type: 'string',
      },
      username: {
        type: 'string',
      },
      avatar: {
        type: 'string',
      },
    },
  },
  routeMatches: {
    type: 'array',
    properties: {
      _id: {
        type: 'string',
      },
      path: {
        type: 'string',
      },
      value: {
        type: 'integer',
      },
    },
  },
};
