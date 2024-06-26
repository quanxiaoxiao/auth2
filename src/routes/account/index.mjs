import createError from 'http-errors';
import accountType from '../../types/account.mjs';
import queryAccounts from './queryAccounts.mjs';
import findAccountByUsername from './findAccountByUsername.mjs';
import findAccount from './findAccount.mjs';
import removeAccount from './removeAccount.mjs';
import createAccount from './createAccount.mjs';
import updateAccount from './updateAccount.mjs';

export default {
  '/api/account': {
    select: {
      type: 'object',
      properties: {
        _id: {
          type: 'string',
        },
        username: {
          type: 'string',
        },
      },
    },
    query: {
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
  '/authapi/account': {
    select: {
      type: 'object',
      properties: accountType,
    },
    post: {
      validate: {
        type: 'object',
        properties: {
          username: {
            type: 'string',
            minLength: 2,
            maxLength: 500,
            not: {
              pattern: '^\\s+$',
            },
          },
          password: {
            type: 'string',
          },
          type: {
            type: 'integer',
            nullable: true,
            minimum: 1,
            maximum: 99,
          },
          description: {
            type: 'string',
            nullable: true,
          },
          avatar: {
            type: 'string',
            nullable: true,
          },
          timeExpired: {
            type: 'number',
            nullable: true,
          },
          routeMatchGroups: {
            type: 'array',
            items: {
              type: 'string',
            },
            nullable: true,
          },
          info: {
            type: 'string',
            nullable: true,
          },
        },
        required: ['username', 'password'],
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const accountItem = await createAccount(ctx.request.data);
        ctx.response = {
          data: accountItem,
        };
      },
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
  '/authapi/account/:_id': {
    select: {
      type: 'object',
      properties: accountType,
    },
    onPre: async (ctx) => {
      const accountItem = await findAccount(ctx.request.params._id);
      if (!accountItem) {
        throw createError(404);
      }
      ctx.accountItem = accountItem;
    },
    get: (ctx) => {
      ctx.response = {
        data: ctx.accountItem,
      };
    },
    delete: async (ctx) => {
      await removeAccount(ctx.accountItem);
      ctx.response = {
        data: ctx.accountItem,
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
          password: {
            type: 'string',
            minLength: 1,
          },
          avatar: {
            type: 'string',
            nullable: true,
          },
          type: {
            type: 'integer',
            minimum: 1,
            maximum: 99,
          },
          timeExpired: {
            type: 'number',
            nullable: true,
          },
          info: {
            type: 'string',
            nullable: true,
          },
          routeMatchGroups: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const accountItem = await updateAccount(ctx.accountItem, ctx.request.data);
        if (!accountItem) {
          throw createError(404);
        }
        ctx.response = {
          data: accountItem,
        };
      },
    },
  },
};
