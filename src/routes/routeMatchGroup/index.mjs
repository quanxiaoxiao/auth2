import routeMatchGroupType from '../../types/routeMatchGroup.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';
import createRouteMatchGroup from './createRouteMatchGroup.mjs';

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
  '/authapi/routematchgroup': {
    select: {
      type: 'object',
      properties: routeMatchGroupType,
    },
    post: {
      validate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
          },
          description: {
            type: 'string',
            nullable: true,
          },
          isSetDefault: {
            type: 'boolean',
            nullable: true,
          },
          routeMatches: {
            type: 'array',
            nullable: true,
            items: {
              type: 'string',
            },
          },
        },
        required: ['name'],
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const routeMatchGroupItem = await createRouteMatchGroup(ctx.request.data);
        ctx.response = {
          data: routeMatchGroupItem,
        };
      },
    },
  },
};
