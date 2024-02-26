import createError from 'http-errors';
import updateRouteMatchGroupsToStore from '../../providers/updateRouteMatchGroupsToStore.mjs';
import routeMatchType from '../../types/routeMatch.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';
import createRouteMatch from './createRouteMatch.mjs';
import findRouteMatch from './findRouteMatch.mjs';
import updateRouteMatch from './updateRouteMatch.mjs';
import removeRouteMatch from './removeRouteMatch.mjs';
import sortRouteMatches from './sortRouteMatches.mjs';
import getAccountRouteMatches from './getAccountRouteMatches.mjs';

export default {
  '/authapi/routematches': {
    select: {
      type: 'array',
      properties: routeMatchType,
    },
    get: async (ctx) => {
      const routeMatchList = await queryRouteMatches({});
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
      const routeMatchList = await getAccountRouteMatches(ctx.request.params.account);
      ctx.response = {
        data: routeMatchList,
      };
    },
  },
  '/authapi/routematches/sort': {
    select: {
      type: 'array',
      properties: ['_id', { type: 'string' }],
    },
    put: {
      validate: {
        type: 'array',
        items: {
          type: 'string',
        },
        minItems: 1,
      },
      fn: async (ctx) => {
        const routeMatchList = await sortRouteMatches(ctx.request.data);
        ctx.response = {
          data: routeMatchList,
        };
      },
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
            pattern: '^/',
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
  '/authapi/routematch/:_id': {
    select: {
      type: 'object',
      properties: routeMatchType,
    },
    onPre: async (ctx) => {
      const routeMatchItem = await findRouteMatch(ctx.request.params._id);
      if (!routeMatchItem) {
        throw createError(404);
      }
      ctx.routeMatchItem = routeMatchItem;
    },
    onPost: (ctx) => {
      if (ctx.response.data && ['PUT', 'DELETE'].includes(ctx.request.method)) {
        updateRouteMatchGroupsToStore();
      }
    },
    get: (ctx) => {
      ctx.response = {
        data: ctx.routeMatchItem,
      };
    },
    put: {
      validate: {
        type: 'object',
        properties: {
          path: {
            type: 'string',
            pattern: '^/',
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
          ctx.routeMatchItem,
          ctx.request.data,
        );
        ctx.response = {
          data: routeMatchItem,
        };
      },
    },
    delete: async (ctx) => {
      await removeRouteMatch(ctx.routeMatchItem);
      ctx.response = {
        data: ctx.routeMatchItem,
      };
    },
  },
};
