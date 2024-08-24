import createError from 'http-errors';
import logger from '../../logger.mjs';
import {
  Session as SessionModel,
  Account as AccountModel,
} from '../../models/index.mjs';
import findSession from './findSession.mjs';

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
  const sessionItemNext = await findSession(sessionItem._id);
  if (!sessionItemNext || !sessionItemNext.account) {
    throw createError(403);
  }
  logger.warn(`\`${sessionItem._id}\` updateSession \`${JSON.stringify(input)}\``);
  return sessionItemNext;
};
