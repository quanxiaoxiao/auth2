import createError from 'http-errors';

import logger from '../../logger.mjs';
import {
  Account as AccountModel,
  Session as SessionModel,
} from '../../models/index.mjs';

export default async (accountItem) => {
  const now = Date.now();

  const result = await AccountModel.updateOne(
    {
      _id: accountItem._id,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        invalid: true,
        dateTimeInvalid: now,
      },
    },
  );

  if (result.modifiedCount === 0) {
    throw createError(404);
  }

  await SessionModel.updateMany(
    {
      account: accountItem._id,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        invalid: true,
        dateTimeInvalid: now,
      },
    },
  );

  logger.warn(`\`account:${accountItem._id}\` remove`);
};
