import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { Account as AccountModel } from '../../models/index.mjs';

export default async (account) => {
  if (!isValidObjectId(account)) {
    return null;
  }
  const accountItem = await AccountModel.findOne({
    invalid: {
      $ne: true,
    },
    _id: account,
  });

  return accountItem;
};
