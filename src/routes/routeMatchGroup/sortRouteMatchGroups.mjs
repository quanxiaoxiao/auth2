import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';

export default async (input) => {
  const routeMatchGroupList = await queryRouteMatchGroups({});
  const len = input.length;
  if (len !== routeMatchGroupList.length) {
    throw createError(400);
  }
  if (len !== Array.from(new Set(input)).length) {
    throw createError(400);
  }
  const updates = [];
  for (let i = 0; i < len; i++) {
    const routeMatchGroup = input[i];
    if (!isValidObjectId(routeMatchGroup)) {
      throw createError(400);
    }
    if (!routeMatchGroupList.some((d) => d._id.toString() === routeMatchGroup)) {
      throw createError(400);
    }
    updates.push({
      updateOne: {
        filter: {
          _id: routeMatchGroup,
          invalid: {
            $ne: true,
          },
        },
        update: {
          $set: {
            order: len - i,
          },
        },
      },
    });
  }

  await RouteMatchGroupModel.updateMany(
    {},
    {
      $set: {
        order: null,
      },
    },
  );

  await RouteMatchGroupModel.bulkWrite(updates);
  return queryRouteMatchGroups({});
};
