import routeMatchType from '../../types/routeMatch.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';
import createRouteMatch from './createRouteMatch.mjs';

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
      },
      fn: async (ctx) => {
        const routeMatchItem = await createRouteMatch(ctx.request.data);
        ctx.response = {
          data: routeMatchItem,
        };
      },
    },
  },
};
