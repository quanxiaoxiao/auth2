import createError from 'http-errors';
import sessionType from '../../types/session.mjs';
import findSession from './findSession.mjs';
import createSessionByUsernameAndPassword from './createSessionByUsernameAndPassword.mjs';
import checkSession from './checkSession.mjs';
import getSessionByRequest from './getSessionByRequest.mjs';
import removeSession from './removeSession.mjs';
import updateSession from './updateSession.mjs';

export default {
  '/api/session': {
    select: {
      type: 'object',
      properties: sessionType,
    },
    onPre: async (ctx) => {
      if (ctx.request.method !== 'POST') {
        const session = getSessionByRequest(ctx.request);
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
    delete: async (ctx) => {
      await removeSession(ctx.sessionItem);
      ctx.response = {
        data: ctx.sessionItem,
      };
    },
    post: {
      validate: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 1,
          },
          password: {
            type: 'string',
            minLength: 1,
          },
        },
        required: ['username', 'password'],
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const sessionItem = await createSessionByUsernameAndPassword({
          ...ctx.request.data,
          userAgent: ctx.request.headers['user-agent'],
        });
        if (!sessionItem) {
          throw createError(404);
        }
        ctx.response = {
          data: sessionItem,
        };
      },
    },
  },
  '/authapi/session/:_id': {
    select: {
      type: 'object',
      properties: sessionType,
    },
    onPre: async (ctx) => {
      const sessionItem = await findSession(ctx.request.params._id);
      if (!sessionItem) {
        throw createError(404);
      }
      ctx.sessionItem = sessionItem;
    },
    get: (ctx) => {
      ctx.response = {
        data: ctx.sessionItem,
      };
    },
    put: {
      validate: {
        type: 'object',
        properties: {
          description: {
            type: 'string',
            nullable: true,
          },
          timeExpired: {
            type: 'number',
            nullable: false,
          },
        },
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const sessionItem = await updateSession(ctx.sessionItem, ctx.request.data);
        ctx.response = {
          data: sessionItem,
        };
      },
    },
    delete: async (ctx) => {
      await removeSession(ctx.sessionItem);
      ctx.response = {
        data: ctx.sessionItem,
      };
    },
  },
};
