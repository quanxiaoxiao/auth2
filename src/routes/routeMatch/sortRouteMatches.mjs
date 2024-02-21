import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';

export default async (input) => {
  const routeMatchList = await queryRouteMatches({});
  const len = input.length;
  if (len !== routeMatchList.length) {
    throw createError(400);
  }
  if (len !== Array.from(new Set(input)).length) {
    throw createError(400);
  }
  const updates = [];
  for (let i = 0; i < len; i++) {
    const routeMatch = input[i];
    if (!isValidObjectId(routeMatch)) {
      throw createError(400);
    }
    if (!routeMatchList.some((d) => d._id.toString() === routeMatch)) {
      throw createError(400);
    }
    updates.push({
      updateOne: {
        filter: {
          _id: routeMatch,
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

  await RouteMatchModel.updateMany(
    {},
    {
      $set: {
        order: null,
      },
    },
  );

  await RouteMatchModel.bulkWrite(updates);
  return queryRouteMatches({});
};
