import { Account as AccountModel } from '../../models/index.mjs';

export default async () => {
  const accountList = await AccountModel
    .find({
      invalid: {
        $ne: true,
      },
    })
    .sort({
      timeCreate: 1,
    });
  return accountList;
};
