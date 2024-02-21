import createError from 'http-errors';
import _ from 'lodash';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatchGroup as RouteMatchGroupModel,
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (input) => {
  if (input.name.trim() === '') {
    throw createError(400);
  }
  if (!_.isEmpty(input.routeMatches)) {
    if (input.routeMatches.length !== Array.from(new Set(input.routeMatches)).length) {
      throw createError(400);
    }
    if (!input.routeMatches.every((d) => isValidObjectId(d))) {
      throw createError(400);
    }
    const count = await RouteMatchModel.countDocuments({
      invalid: {
        $ne: true,
      },
      _id: {
        $in: input.routeMatches,
      },
    });
    if (count !== input.routeMatches.length) {
      throw createError(400);
    }
  }
  const routeMatchGroup = new RouteMatchGroupModel({
    ...input,
  });
  await routeMatchGroup.save();

  return routeMatchGroup;
};
