import { getQuery } from '@quanxiaoxiao/mongo';
import { escapeString } from '@quanxiaoxiao/utils';
import _ from 'lodash';
import mongoose from 'mongoose';

import { Account as AccountModel } from '../../models/index.mjs';
import getRouteMatchesByPathWithMatch from '../routeMatch/getRouteMatchesByPathWithMatch.mjs';
import getRouteMatchGroupsByRouteMatchWithInclude from '../routeMatchGroup/getRouteMatchGroupsByRouteMatchWithInclude.mjs';

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
      const routeMatchList = getRouteMatchesByPathWithMatch(keywords);
      if (_.isEmpty(routeMatchList)) {
        return [];
      }
      const routeMatchGroupList = Array.from(new Set(routeMatchList.reduce((acc, routeMatchItem) => [
        ...acc,
        ...getRouteMatchGroupsByRouteMatchWithInclude(routeMatchItem._id).map((routeMatchGroupItem) => routeMatchGroupItem._id),
      ], [])))
        .map((routeMatchGroup) => new mongoose.Types.ObjectId(routeMatchGroup));
      if (_.isEmpty(routeMatchGroupList)) {
        return [];
      }
      query.routeMatchGroups = {
        $in: routeMatchGroupList,
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
