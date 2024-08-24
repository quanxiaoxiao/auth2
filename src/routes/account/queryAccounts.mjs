import _ from 'lodash';
import { getQuery } from '@quanxiaoxiao/mongo';
import { escapeString } from '@quanxiaoxiao/utils';
import {
  Account as AccountModel,
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';
import getRouteMatchesByPath from '../routeMatch/getRouteMatchesByPath.mjs';

export default async ({
  keywords,
  limit,
  order,
  orderBy,
  skip,
  ...args
}) => {
  const query = getQuery(args);
  query.invalid = {
    $ne: true,
  };
  if (keywords) {
    if (keywords[0] === '/') {
      const routeMatchList = await getRouteMatchesByPath(keywords);
      if (_.isEmpty(routeMatchList)) {
        return [];
      }
      const routeMatchGroupList = await RouteMatchGroupModel.find({
        invalid: {
          $ne: true,
        },
        routeMatches: {
          $in: routeMatchList.map((d) => d._id),
        },
      });
      if (_.isEmpty(routeMatchGroupList)) {
        return [];
      }
      query.routeMatchGroups = {
        $in: routeMatchGroupList.map((d) => d._id),
      };
    } else {
      query.$or = [
        {
          username: keywords,
        },
        {
          description: RegExp(escapeString(keywords)),
        },
      ];
    }
  }
  const sort = {};
  if (orderBy === 'dateTimeCreate') {
    sort[orderBy] = order;
  } else {
    sort[orderBy] = order;
    sort.dateTimeCreate = -1;
  }
  const [count, list] = await Promise.all([
    AccountModel.countDocuments(query),
    AccountModel.aggregate([
      {
        $match: {
          ...query,
        },
      },
      {
        $sort: sort,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
    ]),
  ]);

  return {
    count,
    list,
  };
};
