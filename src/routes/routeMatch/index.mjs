import createError from 'http-errors';
import routeMatchType from '../../types/routeMatch.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';
import createRouteMatch from './createRouteMatch.mjs';
import findRouteMatch from './findRouteMatch.mjs';
import updateRouteMatch from './updateRouteMatch.mjs';
import removeRouteMatch from './removeRouteMatch.mjs';

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
