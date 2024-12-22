import createError from 'http-errors';
import _ from 'lodash';
import mongoose from 'mongoose';

import { ACCOUNT_TYPE_MANUAL } from '../../constants.mjs';
import logger from '../../logger.mjs';
import { Account as AccountModel } from '../../models/index.mjs';
import hmac from '../../providers/hmac.mjs';
import getRouteMatchGroupById from '../routeMatchGroup/getRouteMatchGroupById.mjs';
import getRouteMatchGroupsByDefaultWithSet from '../routeMatchGroup/getRouteMatchGroupsByDefaultWithSet.mjs';

export default async (input) => {
  const data = {
    ...input,
    username: input.username.trim(),
    password: input.password ? hmac(input.password) : null,
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
    if (data.routeMatchGroups.length !== Array.from(new Set(data.routeMatchGroups)).length) {
      logger.warn(`createAccount fail, routeMatchGroups \`${data.routeMatchGroups}\` is repeat`);
      throw createError(403);
    }
  } else {
    const routeMatchGroupList = getRouteMatchGroupsByDefaultWithSet();
    data.routeMatchGroups = routeMatchGroupList.map((d) => new mongoose.Types.ObjectId(d._id));
  }

  if (!data.nickName) {
    data.nickName = data.username;
  }

  const accountItem = new AccountModel(data);

  await accountItem.save();
  logger.warn(`createAccount \`${JSON.stringify(_.omit(input, ['password']))}\``);
  return accountItem;
};
