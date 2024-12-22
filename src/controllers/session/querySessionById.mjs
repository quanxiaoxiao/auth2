import { isValidObjectId } from '@quanxiaoxiao/mongo';
import mongoose from 'mongoose';

import { Session as SessionModel } from '../../models/index.mjs';

export default async (session) => {
  if (!isValidObjectId(session)) {
    return null;
  }
  const [sessionItem] = await SessionModel.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(session),
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
        from: 'accounts',
        localField: 'account',
        foreignField: '_id',
        as: 'account',
        pipeline: [
          {
            $match: {
              invalid: {
                $ne: true,
              },
            },
          },
          {
            $limit: 1,
          },
        ],
      },
    },
    {
      $unwind: {
        path: '$account',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]);
  return sessionItem;
};
