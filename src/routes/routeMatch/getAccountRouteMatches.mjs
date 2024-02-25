import createError from 'http-errors';
import mongoose from 'mongoose';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { Account as AccountModel } from '../../models/index.mjs';

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
        as: 'routeMatchGroups',
        localField: 'routeMatchGroups',
        foreignField: '_id',
      },
    },
  ]);

  if (!accountItem) {
    throw createError(404);
  }

  console.log(accountItem);

  return accountItem.routeMatches;
};
