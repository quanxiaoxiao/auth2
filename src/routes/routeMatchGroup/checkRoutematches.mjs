import createError from 'http-errors';
import _ from 'lodash';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (arr) => {
  if (!_.isEmpty(arr)) {
    if (arr.length !== Array.from(new Set(arr)).length) {
      throw createError(400, 'routeMatches invalid');
    }
    if (!arr.every((d) => isValidObjectId(d))) {
      throw createError(400, 'routeMatches invalid');
    }
    const count = await RouteMatchModel.countDocuments({
      invalid: {
        $ne: true,
      },
      _id: {
        $in: arr,
      },
    });
    if (count !== arr.length) {
      throw createError(400, 'routeMatches invalid');
    }
  }
};
