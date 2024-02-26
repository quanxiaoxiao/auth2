import createError from 'http-errors';
import updateRouteMatchGroupsToStore from '../../providers/updateRouteMatchGroupsToStore.mjs';
import routeMatchGroupType from '../../types/routeMatchGroup.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';
import createRouteMatchGroup from './createRouteMatchGroup.mjs';
import findRouteMatchGroup from './findRouteMatchGroup.mjs';
import updateRouteMatchGroup from './updateRouteMatchGroup.mjs';
import removeRouteMatchGroup from './removeRouteMatchGroup.mjs';
import sortRouteMatchGroups from './sortRouteMatchGroups.mjs';

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
  '/authapi/routematchgroups/sort': {
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
        const routeMatchGroupList = await sortRouteMatchGroups(ctx.request.data);
        ctx.response = {
          data: routeMatchGroupList,
        };
      },
    },
  },
  '/authapi/routematchgroup': {
    select: {
      type: 'object',
      properties: routeMatchGroupType,
    },
    onPost: (ctx) => {
      if (ctx.response.data && ctx.request.method === 'POST') {
        updateRouteMatchGroupsToStore();
      }
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
  '/authapi/routematchgroup/:_id': {
    select: {
      type: 'object',
      properties: routeMatchGroupType,
    },
    onPre: async (ctx) => {
      const routeMatchGroupItem = await findRouteMatchGroup(ctx.request.params._id);
      if (!routeMatchGroupItem) {
        throw createError(404);
      }
      ctx.routeMatchGroupItem = routeMatchGroupItem;
    },
    onPost: (ctx) => {
      if (ctx.response.data && ['DELETE', 'PUT'].includes(ctx.request.method)) {
        updateRouteMatchGroupsToStore();
      }
    },
    get: (ctx) => {
      ctx.response = {
        data: ctx.routeMatchGroupItem,
      };
    },
    delete: async (ctx) => {
      await removeRouteMatchGroup(ctx.routeMatchGroupItem);
      ctx.response = {
        data: ctx.routeMatchGroupItem,
      };
    },
    put: {
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
        const routeMatchGroupItem = await updateRouteMatchGroup(ctx.routeMatchGroupItem, ctx.request.data);
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
