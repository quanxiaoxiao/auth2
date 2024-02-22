import createError from 'http-errors';
import routeMatchGroupType from '../../types/routeMatchGroup.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';
import createRouteMatchGroup from './createRouteMatchGroup.mjs';
import findRouteMatchGroup from './findRouteMatchGroup.mjs';
import updateRouteMatchGroup from './updateRouteMatchGroup.mjs';

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
    get: (ctx) => {
      ctx.response = {
        data: ctx.routeMatchGroupItem,
      };
    },
    delete: () => {
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
