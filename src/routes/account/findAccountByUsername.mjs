import createError from 'http-errors';
import { Account as AccountModel } from '../../models/index.mjs';

export default async (username) => {
  const [accountItem] = await AccountModel.aggregate([
    {
      $match: {
        invalid: {
          $ne: null,
        },
        username,
      },
    },
    {
      $limit: 1,
    },
  ]);

  if (!accountItem) {
    throw createError(404);
  }

  return accountItem;
};
