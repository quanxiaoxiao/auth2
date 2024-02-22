import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';

export default async (routeMatchGroup) => {
  if (!isValidObjectId(routeMatchGroup)) {
    throw createError(404);
  }
  const routeMatchGroupItem = await RouteMatchGroupModel.findOne({
    _id: routeMatchGroup,
    invalid: {
      $ne: true,
    },
  });
  if (!routeMatchGroupItem) {
    throw createError(404);
  }
  return routeMatchGroupItem;
};
