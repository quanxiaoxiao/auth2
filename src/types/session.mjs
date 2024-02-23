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
      timeExpired: d.timeExpired,
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
  timeExpired: {
    type: 'number',
  },
  timeCreate: {
    type: 'number',
  },
};
