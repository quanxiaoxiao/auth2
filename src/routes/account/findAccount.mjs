import createError from 'http-errors';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { Account as AccountModel } from '../../models/index.mjs';

export default async (account) => {
  if (!isValidObjectId(account)) {
    throw createError(404);
  }
  const accountItem = await AccountModel.findOne({
    invalid: {
      $ne: true,
    },
    _id: account,
  });

  if (!accountItem) {
    throw createError(404);
  }

  return accountItem;
};
