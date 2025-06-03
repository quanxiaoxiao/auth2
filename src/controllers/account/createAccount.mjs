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
  const accountItem = new AccountModel({
    ...input,
    username: input.username,
    password: input.password ? hmac(input.password) : null,
    type: input.type == null ? ACCOUNT_TYPE_MANUAL : input.type,
  });

  try {
    await accountItem.validate();
  } catch (error) {
    throw createError(400, JSON.stringify(error.errors));
  }

  const matched = await AccountModel.findOne({
    username: accountItem.username,
    invalid: {
      $ne: true,
    },
  });

  if (matched) {
    logger.warn(`createAccount fail, username \`${accountItem.username}\` alreay exist`);
    throw createError(403, `username \`${accountItem.username}\` alreay exist`);
  }

  if (accountItem.routeMatchGroups) {
    for (let i = 0; i < accountItem.routeMatchGroups.length; i++) {
      const routeMatchGroup = accountItem.routeMatchGroups[i];
      if (!getRouteMatchGroupById(routeMatchGroup)) {
        logger.warn(`createAccount fail, routeMatchGroup \`${routeMatchGroup}\` is not exist`);
        throw createError(403);
      }
    }
    if (accountItem.routeMatchGroups.length !== Array.from(new Set(accountItem.routeMatchGroups)).length) {
      logger.warn(`createAccount fail, routeMatchGroups \`${accountItem.routeMatchGroups}\` is repeat`);
      throw createError(403);
    }
  } else {
    const routeMatchGroupList = getRouteMatchGroupsByDefaultWithSet();
    accountItem.routeMatchGroups = routeMatchGroupList.map((d) => new mongoose.Types.ObjectId(d._id));
  }

  if (!accountItem.nickName) {
    accountItem.nickName = accountItem.username;
  }

  await accountItem.save();
  logger.warn(`createAccount \`${JSON.stringify(_.omit(input, ['password']))}\``);
  return accountItem;
};
