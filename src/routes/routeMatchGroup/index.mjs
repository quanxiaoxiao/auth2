import createError from 'http-errors';

import createRouteMatchGroup from '../../controllers/routeMatchGroup/createRouteMatchGroup.mjs';
import getRouteMatchGroupById from '../../controllers/routeMatchGroup/getRouteMatchGroupById.mjs';
import getRouteMatchGroups from '../../controllers/routeMatchGroup/getRouteMatchGroups.mjs';
import removeRouteMatchGroup from '../../controllers/routeMatchGroup/removeRouteMatchGroup.mjs';
import updateRouteMatchGroup from '../../controllers/routeMatchGroup/updateRouteMatchGroup.mjs';
import routeMatchGroupType from '../../types/routeMatchGroup.mjs';

export default {
  '/authapi/routematchgroups': {
    select: {
      type: 'array',
      properties: routeMatchGroupType,
    },
    get: (ctx) => {
      const routematchgroupList = getRouteMatchGroups();
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
            not: {
              pattern: '^\\s+$',
            },
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
  '/authapi/routematchgroup/:routeMatchGroup': {
    select: {
      type: 'object',
      properties: routeMatchGroupType,
    },
    get: (ctx) => {
      const routeMatchGroupItem = getRouteMatchGroupById(ctx.request.params.routeMatchGroup);
      if (!routeMatchGroupItem) {
        throw createError(404);
      }
      ctx.response = {
        data: routeMatchGroupItem,
      };
    },
    delete: async (ctx) => {
      const routeMatchGroupItem = await removeRouteMatchGroup(ctx.request.params.routeMatchGroup);
      if (!routeMatchGroupItem) {
        throw createError(404);
      }
      ctx.response = {
        data: routeMatchGroupItem,
      };
    },
    put: {
      validate: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
            minLength: 1,
            not: {
              pattern: '^\\s+$',
            },
          },
          description: {
            type: 'string',
            nullable: true,
          },
          isSetDefault: {
            type: 'boolean',
          },
          routeMatches: {
            type: 'array',
            items: {
              type: 'string',
            },
          },
        },
        additionalProperties: false,
      },
      fn: async (ctx) => {
        const routeMatchGroupItem = await updateRouteMatchGroup(
          ctx.request.params.routeMatchGroup,
          ctx.request.data,
        );
        if (!routeMatchGroupItem) {
          throw createError(404);
        }
        ctx.response = {
          data: routeMatchGroupItem,
        };
      },
    },
  },
};
