import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (routeMatch) => {
  if (!isValidObjectId(routeMatch)) {
    throw createError(404);
  }
  const routeMatchItem = await RouteMatchModel.findOne({
    _id: routeMatch,
    invalid: {
      $ne: true,
    },
  });
  if (!routeMatchItem) {
    throw createError(404);
  }
  return routeMatchItem;
};
