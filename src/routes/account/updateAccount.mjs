import createError from 'http-errors';
import hmac from '../../providers/hmac.mjs';
import {
  Account as AccountModel,
  Session as SessionModel,
} from '../../models/index.mjs';

export default async (accountItem, input) => {
  const now = Date.now();
  const data = {
    ...input,
    timeUpdate: now,
  };
  const query = {
    _id: accountItem._id,
    invalid: {
      $ne: true,
    },
  };

  if (data.password) {
    data.password = hmac(data.password);
    data.timeUpdateWithPassword = now;
  }

  const accountItemNext = await AccountModel.findOneAndUpdate(
    query,
    {
      $set: data,
    },
    {
      new: true,
    },
  );

  if (!accountItemNext) {
    throw createError(404);
  }

  if (accountItemNext.timeExpired != null) {
    if (accountItemNext.timeExpired < now) {
      await SessionModel.updateMany(
        {
          account: accountItem._id,
          invalid: {
            $ne: true,
          },
          timeExpired: {
            $gt: now,
          },
        },
        {
          $set: {
            timeExpired: accountItemNext.timeExpired,
          },
        },
      );
    } else {
      await SessionModel.updateMany(
        {
          account: accountItem._id,
          invalid: {
            $ne: true,
          },
          timeExpired: {
            $gt: accountItemNext.timeExpired,
          },
        },
        {
          $set: {
            timeExpired: accountItemNext.timeExpired,
          },
        },
      );
    }
  }

  return accountItemNext;
};
