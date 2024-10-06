import _ from 'lodash';
import mongoose from 'mongoose';
import createError from 'http-errors';
import logger from '../../logger.mjs';
import { Account as AccountModel } from '../../models/index.mjs';
import hmac from '../../providers/hmac.mjs';
import { ACCOUNT_TYPE_MANUAL } from '../../constants.mjs';
import getRouteMatchGroupsByDefaultWithSet from '../routeMatchGroup/getRouteMatchGroupsByDefaultWithSet.mjs';
import getRouteMatchGroupById from '../routeMatchGroup/getRouteMatchGroupById.mjs';

export default async (input) => {
  const data = {
    ...input,
    username: input.username.trim(),
    password: hmac(input.password),
    type: input.type == null ? ACCOUNT_TYPE_MANUAL : input.type,
  };
  const matched = await AccountModel.findOne({
    username: data.username,
    invalid: {
      $ne: true,
    },
  });

  if (matched) {
    logger.warn(`createAccount fail, username \`${data.username}\` alreay exist`);
    throw createError(403, `username \`${data.username}\` alreay exist`);
  }

  if (Object.hasOwnProperty.call(data, 'routeMatchGroups')) {
    for (let i = 0; i < data.routeMatchGroups.length; i++) {
      const routeMatchGroup = data.routeMatchGroups[i];
      if (!getRouteMatchGroupById(routeMatchGroup)) {
        logger.warn(`createAccount fail, routeMatchGroup \`${routeMatchGroup}\` is not exist`);
        throw createError(403);
      }
    }
  } else {
    const routeMatchGroupList = getRouteMatchGroupsByDefaultWithSet();
    data.routeMatchGroups = routeMatchGroupList.map((d) => new mongoose.Types.ObjectId(d._id));
  }

  const accountItem = new AccountModel(data);

  await accountItem.save();
  logger.warn(`createAccount \`${JSON.stringify(_.omit(input, ['password']))}\``);
  return accountItem;
};
