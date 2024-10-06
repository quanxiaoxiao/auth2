import { Account as AccountModel } from '../../models/index.mjs';

export default async (username) => {
  const [accountItem] = await AccountModel.aggregate([
    {
      $match: {
        invalid: {
          $ne: true,
        },
        username,
      },
    },
    {
      $limit: 1,
    },
  ]);

  return accountItem;
};
