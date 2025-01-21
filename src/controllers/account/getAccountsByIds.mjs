import { isValidObjectId } from '@quanxiaoxiao/mongo';
import createError from 'http-errors';

import { Account as AccountModel } from '../../models/index.mjs';

export default async (_ids) => {
  if (_ids.length === 0) {
    return [];
  }
  if (!_ids.some(isValidObjectId)) {
    throw createError(400);
  }
  const accountList = await AccountModel.find({
    invalid: {
      $ne: true,
    },
    _id: {
      $in: _ids,
    },
  })
    .lean();

  if (_ids.length !== accountList.length) {
    throw createError(400);
  }
  return accountList;
};
