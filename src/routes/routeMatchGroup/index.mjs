import routeMatchGroupType from '../../types/routeMatchGroup.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';

export default {
  '/authapi/routematchgroups': {
    select: {
      type: 'array',
      properties: routeMatchGroupType,
    },
    get: async (ctx) => {
      const routematchgroupList = await queryRouteMatchGroups({});
      ctx.response = {
        data: routematchgroupList,
      };
    },
  },
};
