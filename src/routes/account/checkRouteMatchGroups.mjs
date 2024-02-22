import createError from 'http-errors';
import _ from 'lodash';
import { isValidUniqueObjectIds } from '@quanxiaoxiao/mongo';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';

export default async (arr) => {
  if (!_.isEmpty(arr)) {
    if (!isValidUniqueObjectIds(arr)) {
      throw createError(400, 'routeMatchGroups invalid');
    }
    const count = await RouteMatchGroupModel.countDocuments({
      invalid: {
        $ne: true,
      },
      _id: {
        $in: arr,
      },
    });
    if (count !== arr.length) {
      throw createError(400, 'routeMatchGroups invalid');
    }
  }
};
