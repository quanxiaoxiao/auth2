import createError from 'http-errors';
import routeMatchType from '../../types/routeMatch.mjs';
import queryAccountById from '../../controllers/account/queryAccountById.mjs';
import updateRouteMatch from '../../controllers/routeMatch/updateRouteMatch.mjs';
import removeRouteMatch from '../../controllers/routeMatch/removeRouteMatch.mjs';
import getRouteMatchesByAccount from '../../controllers/routeMatch/getRouteMatchesByAccount.mjs';
import getRouteMatchById from '../../controllers/routeMatch/getRouteMatchById.mjs';
import createRouteMatch from '../../controllers/routeMatch/createRouteMatch.mjs';
import getRouteMatches from '../../controllers/routeMatch/getRouteMatches.mjs';

export default {
  '/authapi/routematches': {
    select: {
      type: 'array',
      properties: routeMatchType,
    },
    get: async (ctx) => {
      const routeMatchList = await getRouteMatches();
      ctx.response = {
        data: routeMatchList,
      };
    },
  },
  '/authapi/account/:account/routematches': {
    select: {
      type: 'array',
      properties: routeMatchType,
    },
    get: async (ctx) => {
      const accountItem = await queryAccountById(ctx.request.params.account);
      if (!accountItem) {
        throw createError(404);
      }
      const routeMatchList = getRouteMatchesByAccount(accountItem);
      ctx.response = {
        data: routeMatchList,
      };
    },
  },
  '/authapi/routematch': {
    select: {
      type: 'object',
      properties: routeMatchType,
    },
    post: {
      validate: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
          },
          value: {
            type: 'integer',
            minimum: 0,
            maximum: 15,
          },
          category: {
            type: 'string',
            nullable: true,
          },
          description: {
            type: 'string',
            nullable: true,
          },
        },
        required: ['path', 'value'],
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const routeMatchItem = await createRouteMatch(ctx.request.data);
        ctx.response = {
          data: routeMatchItem,
        };
      },
    },
  },
  '/authapi/routematch/:routeMatch': {
    select: {
      type: 'object',
      properties: routeMatchType,
    },
    get: async (ctx) => {
      const routeMatchItem = await getRouteMatchById(ctx.request.params.routeMatch);
      if (!routeMatchItem) {
        throw createError(404);
      }
      ctx.response = {
        data: routeMatchItem,
      };
    },
    put: {
      validate: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
          },
          value: {
            type: 'integer',
            minimum: 0,
            maximum: 15,
          },
          category: {
            type: 'string',
            nullable: true,
          },
          description: {
            type: 'string',
            nullable: true,
          },
        },
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const routeMatchItem = await updateRouteMatch(
          ctx.request.params.routeMatch,
          ctx.request.data,
        );
        if (!routeMatchItem) {
          throw createError(404);
        }
        ctx.response = {
          data: routeMatchItem,
        };
      },
    },
    delete: async (ctx) => {
      const routeMatchItem = await removeRouteMatch(ctx.request.params.routeMatch);
      if (!routeMatchItem) {
        throw createError(404);
      }
      ctx.response = {
        data: routeMatchItem,
      };
    },
  },
};
