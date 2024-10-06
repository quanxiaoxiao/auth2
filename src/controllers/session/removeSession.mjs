import logger from '../../logger.mjs';
import { Session as SessionModel } from '../../models/index.mjs';

export default async (sessionItem) => {
  await SessionModel.updateOne(
    {
      _id: sessionItem._id,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        invalid: true,
        dateTimeInvalid: Date.now(),
      },
    },
  );
  logger.warn(`\`session:${sessionItem._id}\` remove`);
};
