import routeMatchType from '../../types/routeMatch.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';

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
};
