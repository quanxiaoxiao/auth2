import createError from 'http-errors';
import getAccounts from './getAccounts.mjs';
import accountType from '../../types/account.mjs';
import queryAccounts from './queryAccounts.mjs';
import findAccountByUsername from './findAccountByUsername.mjs';

export default {
  '/api/accounts': {
    select: {
      type: 'array',
      properties: {
        _id: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
      },
    },
    get: async (ctx) => {
      const accountList = await getAccounts();
      ctx.response = {
        data: accountList,
      };
    },
  },
  '/authapi/accounts': {
    select: {
      type: 'object',
      properties: {
        count: {
          type: 'integer',
        },
        list: {
          type: 'array',
          properties: accountType,
        },
      },
    },
    query: {
      type: 'object',
      properties: {
        type: {
          type: 'integer',
        },
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
              return 'timeCreate';
            }
            return v;
          },
        },
        timeCreateStart: {
          type: 'number',
        },
        timeCreateEnd: {
          type: 'number',
        },
        keywords: {
          type: 'string',
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
      },
    },
    match: {
      'query.order': { $in: [-1, 1] },
      'query.orderBy': {
        $in: ['type', 'timeCreate', 'timeExpired'],
      },
      'query.limit': { $gt: 0 },
      'query.skip': { $gte: 0 },
    },
    get: async (ctx) => {
      const accountList = await queryAccounts(ctx.request.query);
      ctx.response = {
        data: accountList,
      };
    },
  },
  '/authapi/account': {
    select: {
      type: 'object',
      properties: accountType,
    },
    query: {
      type: 'object',
      properties: {
        username: {
          type: 'string',
          resolve: (v) => {
            if (!v) {
              return '';
            }
            return v.trim();
          },
        },
      },
    },
    match: {
      'query.username': {
        $nin: [null, ''],
      },
    },
    get: async (ctx) => {
      const accountItem = await findAccountByUsername(ctx.request.query.username);
      if (!accountItem) {
        throw createError(404);
      }
      ctx.response = {
        data: accountItem,
      };
    },
  },
};
