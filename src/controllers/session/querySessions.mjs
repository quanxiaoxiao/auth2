import { getQuery, isValidObjectId } from '@quanxiaoxiao/mongo';
import { escapeString } from '@quanxiaoxiao/utils';
import mongoose from 'mongoose';

import { Session as SessionModel } from '../../models/index.mjs';

export default async ({
  keywords,
  skip,
  order,
  orderBy,
  limit,
  ...args
}) => {
  const query = getQuery(args);
  query.invalid = {
    $ne: true,
  };
  if (keywords) {
    query.description = RegExp(escapeString(keywords));
  }
  if (query.account) {
    if (!isValidObjectId(query.account)) {
      return {
        count: 0,
        list: [],
      };
    }
    query.account = new mongoose.Types.ObjectId(query.account);
  }
  const sort = {};
  if (orderBy === 'dateTimeCreate') {
    sort[orderBy] = order;
  } else {
    sort[orderBy] = order;
    sort.dateTimeCreate = -1;
  }
  const [count, list] = await Promise.all([
    SessionModel.countDocuments(query),
    SessionModel.aggregate([
      {
        $sort: sort,
      },
      {
        $match: {
          ...query,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'accounts',
          localField: 'account',
          foreignField: '_id',
          as: 'account',
          pipeline: [
            {
              $limit: 1,
            },
          ],
        },
      },
      {
        $unwind: {
          path: '$account',
          preserveNullAndEmptyArrays: false,
        },
      },
    ]),
  ]);

  return {
    count,
    list,
  };
};
