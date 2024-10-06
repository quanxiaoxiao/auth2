import createError from 'http-errors';
import sessionType, { routeMatchesSession as routeMatchesSessionType } from '../../types/session.mjs';
import getRouteMatchesByAccount from '../../controllers/routeMatch/getRouteMatchesByAccount.mjs';
import querySessionById from '../../controllers/session/querySessionById.mjs';
import createSessionByUsernameAndPassword from '../../controllers/session/createSessionByUsernameAndPassword.mjs';
import checkSessionValid from '../../controllers/session/checkSessionValid.mjs';
import getSessionByRequest from '../../controllers/session/getSessionByRequest.mjs';
import removeSession from '../../controllers/session/removeSession.mjs';
import updateSession from '../../controllers/session/updateSession.mjs';
import querySessions from '../../controllers/session/querySessions.mjs';
import createSessionByAccount from '../../controllers/session/createSessionByAccount.mjs';

export default {
  '/api/session': {
    select: {
      type: 'object',
      properties: routeMatchesSessionType,
    },
    onPre: async (ctx) => {
      if (ctx.request.method !== 'POST') {
        const session = getSessionByRequest(ctx.request);
        if (!session) {
          throw createError(404);
        }
        const sessionItem = await querySessionById(session);
        if (!sessionItem || !sessionItem.account) {
          throw createError(404);
        }
        checkSessionValid(sessionItem);
        ctx.sessionItem = sessionItem;
      }
    },
    get: (ctx) => {
      const routeMatchList = getRouteMatchesByAccount(ctx.sessionItem.account);
      ctx.sessionItem.routeMatches = routeMatchList;
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
        const routeMatchList = getRouteMatchesByAccount(sessionItem.account);
        sessionItem.routeMatches = routeMatchList;
        ctx.response = {
          data: sessionItem,
        };
      },
    },
  },
  '/authapi/sessions': {
    select: {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
        },
        list: {
          type: 'array',
          properties: sessionType,
        },
      },
    },
    query: {
      order: {
        type: 'integer',
        resolve: (v) => {
          if (!v) {
            return -1;
          }
          return v;
        },
      },
      orderBy: {
        type: 'string',
        resolve: (v) => {
          if (!v) {
            return 'dateTimeCreate';
          }
          return v;
        },
      },
      limit: {
        type: 'integer',
        resolve: (v) => {
          if (!v) {
            return 30;
          }
          return v;
        },
      },
      skip: {
        type: 'integer',
        resolve: (v) => {
          if (!v) {
            return 0;
          }
          return v;
        },
      },
      account: {
        type: 'string',
      },
      dateTimeCreateStart: {
        type: 'number',
      },
      dateTimeCreateEnd: {
        type: 'number',
      },
      type: {
        type: 'integer',
      },
      keywords: {
        type: 'string',
      },
    },
    match: {
      'query.order': { $in: [-1, 1] },
      'query.orderBy': {
        $in: ['type', 'dateTimeCreate', 'dateTimeExpired', 'account'],
      },
      'query.limit': { $gt: 0 },
      'query.skip': { $gte: 0 },
    },
    get: async (ctx) => {
      const ret = await querySessions(ctx.request.query);
      ctx.response = {
        data: {
          count: ret.count,
          list: ret.list,
        },
      };
    },
  },
  '/authapi/session': {
    select: {
      type: 'object',
      properties: sessionType,
    },
    post: {
      validate: {
        type: 'object',
        properties: {
          account: {
            type: 'string',
            minLength: 1,
          },
          dateTimeExpired: {
            type: 'number',
            nullable: true,
          },
        },
        required: ['account'],
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const sessionItem = await createSessionByAccount(ctx.request.data);
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
      const sessionItem = await querySessionById(ctx.request.params._id);
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
          dateTimeExpired: {
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
