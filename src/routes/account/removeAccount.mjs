import {
  Account as AccountModel,
  Session as SessionModel,
} from '../../models/index.mjs';
import logger from '../../logger.mjs';

export default async (accountItem) => {
  const now = Date.now();

  await Promise.all([
    AccountModel.updateOne(
      {
        _id: accountItem._id,
        invalid: {
          $ne: true,
        },
      },
      {
        $set: {
          invalid: true,
          timeInvalid: now,
        },
      },
    ),
    SessionModel.updateMany(
      {
        account: accountItem._id,
        invalid: {
          $ne: true,
        },
      },
      {
        $set: {
          invalid: true,
          timeInvalid: now,
        },
      },
    ),
  ]);
  logger.warn(`\`${accountItem._id}\` removeAccount`);
};
