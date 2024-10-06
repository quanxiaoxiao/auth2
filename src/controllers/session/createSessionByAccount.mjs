import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import logger from '../../logger.mjs';
import { SESSION_TYPE_MANUAL } from '../../constants.mjs';
import { Account as AccountModel } from '../../models/index.mjs';
import createSession from './createSession.mjs';

export default async (input) => {
  const { account, dateTimeExpired } = input;
  if (!isValidObjectId(account)) {
    throw createError(404);
  }
  const accountItem = await AccountModel.findOne({
    _id: account,
    invalid: {
      $ne: true,
    },
  });
  if (!accountItem) {
    throw createError(404);
  }
  const sessionItem = await createSession(accountItem, {
    type: SESSION_TYPE_MANUAL,
    dateTimeExpired,
  });

  logger.warn(`create session by account \`${JSON.stringify(input)}\``);

  return sessionItem;
};
