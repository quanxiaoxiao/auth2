import createError from 'http-errors';

import logger from '../../logger.mjs';
import {
  Account as AccountModel,
  Session as SessionModel,
} from '../../models/index.mjs';
import querySessionById from './querySessionById.mjs';

export default async (sessionItem, input) => {
  const data = {
    ...input,
  };
  const accountItem = await AccountModel.findOne({
    _id: sessionItem.account,
    invalid: {
      $ne: true,
    },
  });
  if (!accountItem) {
    throw createError(403);
  }
  if (data.dateTimeExpired != null
    && accountItem.dateTimeExpired != null
    && data.dateTimeExpired > accountItem.dateTimeExpired
  ) {
    data.dateTimeExpired = accountItem.dateTimeExpired;
  }
  await SessionModel.updateOne(
    {
      _id: sessionItem._id,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        ...data,
      },
    },
  );
  const sessionItemNext = await querySessionById(sessionItem._id);
  if (!sessionItemNext || !sessionItemNext.account) {
    throw createError(403);
  }
  logger.warn(`\`session:${sessionItem._id}\` update \`${JSON.stringify(input)}\``);
  return sessionItemNext;
};
