import _ from 'lodash';
import createError from 'http-errors';
import logger from '../../logger.mjs';
import {
  Account as AccountModel,
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';
import hmac from '../../providers/hmac.mjs';
import { ACCOUNT_TYPE_MANUAL } from '../../constants.mjs';
import checkRouteMatchGroups from './checkRouteMatchGroups.mjs';

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
    throw createError(403, `username \`${data.username}\` alreay exist`);
  }

  if (Object.hasOwnProperty.call(data, 'routeMatchGroups')) {
    await checkRouteMatchGroups(data.routeMatchGroups);
  } else {
    const routeMatchGroups = await RouteMatchGroupModel
      .find({
        isSetDefault: true,
        invalid: {
          $ne: true,
        },
      });
    data.routeMatchGroups = routeMatchGroups.map((d) => d._id);
  }

  const accountItem = new AccountModel(data);

  await accountItem.save();
  logger.warn(`createAccount \`${JSON.stringify(_.omit(input, ['password']))}\``);
  return accountItem;
};
