import createError from 'http-errors';
import _ from 'lodash';
import mongoose from 'mongoose';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import {
  Account as AccountModel,
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (account) => {
  if (!isValidObjectId(account)) {
    throw createError(404);
  }
  const [accountItem] = await AccountModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(account),
        invalid: {
          $ne: true,
        },
      },
    },
    {
      $limit: 1,
    },
    {
      $lookup: {
        from: 'routematchgroups',
        as: 'routeMatchGroupList',
        localField: 'routeMatchGroups',
        foreignField: '_id',
        pipeline: [
          {
            $match: {
              invalid: {
                $ne: true,
              },
            },
          },
        ],
      },
    },
    {
      $project: {
        result: {
          $reduce: {
            input: '$routeMatchGroupList',
            initialValue: [],
            in: {
              $concatArrays: ['$$value', '$$this.routeMatches'],
            },
          },
        },
      },
    },
    {
      $project: {
        result: {
          $setUnion: '$result',
        },
      },
    },
  ]);

  if (!accountItem) {
    throw createError(404);
  }

  if (_.isEmpty(accountItem.result)) {
    return [];
  }

  const routeMatchList = await RouteMatchModel
    .find({
      _id: {
        $in: accountItem.result,
      },
      invalid: {
        $ne: true,
      },
    })
    .lean();

  return routeMatchList;
};
