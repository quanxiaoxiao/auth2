import createError from 'http-errors';
import { parseCookie } from '@quanxiaoxiao/http-utils';
import sessionType from '../../types/session.mjs';
import store from '../../store/store.mjs';
import hmac from '../../providers/hmac.mjs';
import { decodeSession } from '../../providers/session.mjs';
import findSession from './findSession.mjs';

const { getState } = store;

const getToken = (request) => {
  if (request.headers[getState().session.authKey]) {
    return request.headers[getState().session.authKey];
  }
  return parseCookie(request.headers.cookie)[getState().session.key];
};

const checkoutSession = (request) => {
  const token = getToken(request);
  if (!token) {
    return null;
  }
  const session = decodeSession(token);
  return session;
};

const checkSession = (sessionItem) => {
  const now = Date.now();
  if (sessionItem.timeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.account.timeExpired != null && sessionItem.account.timeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.hash !== hmac(`${sessionItem.account.username}:${sessionItem.account.password}`)) {
    throw createError(404);
  }
};

export default {
  '/api/session': {
    select: {
      type: 'object',
      properties: sessionType,
    },
    onPre: async (ctx) => {
      if (ctx.request.method !== 'POST') {
        const session = checkoutSession(ctx.request);
        if (!session) {
          throw createError(404);
        }
        const sessionItem = await findSession(session);
        if (!sessionItem || !sessionItem.account) {
          throw createError(404);
        }
        checkSession(sessionItem);
        ctx.sessionItem = sessionItem;
      }
    },
    get: (ctx) => {
      ctx.response = {
        data: ctx.sessionItem,
      };
    },
  },
};
