import mongoose from 'mongoose';
import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { Session as SessionModel } from '../../models/index.mjs';

export default async (session) => {
  if (!isValidObjectId(session)) {
    throw createError(404);
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
  if (!sessionItem) {
    throw createError(404);
  }
  return sessionItem;
};
