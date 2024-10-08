import assert from 'node:assert';
import _ from 'lodash';
import createError from 'http-errors';
import logger from '../../logger.mjs';
import hmac from '../../providers/hmac.mjs';
import {
  Account as AccountModel,
  Session as SessionModel,
} from '../../models/index.mjs';
import getRouteMatchGroupById from '../routeMatchGroup/getRouteMatchGroupById.mjs';

export default async (accountItem, input) => {
  const now = Date.now();
  const data = {
    ...input,
    dateTimeUpdate: now,
  };
  const query = {
    _id: accountItem._id,
    invalid: {
      $ne: true,
    },
  };

  if (Object.hasOwnProperty.call(data, 'password')) {
    assert(!!data.password);
    data.password = hmac(data.password);
    data.dateTimeUpdateWithPassword = now;
  }

  if (data.routeMatchGroups) {
    for (let i = 0; i < data.routeMatchGroups.length; i++) {
      const routeMatchGroup = data.routeMatchGroups[i];
      if (!getRouteMatchGroupById(routeMatchGroup)) {
        logger.warn(`\`account:${accountItem._id}\` update fail, routeMatchGroup \`${routeMatchGroup}\` is not exist`);
        throw createError(403);
      }
    }
    if (data.routeMatchGroups.length !== Array.from(new Set(data.routeMatchGroups)).length) {
      logger.warn(`\`account:${accountItem._id}\` update fail, routeMatchGroups \`${data.routeMatchGroups}\` is repeat`);
      throw createError(403);
    }
  }

  const accountItemNext = await AccountModel.findOneAndUpdate(
    query,
    {
      $set: data,
    },
    {
      new: true,
    },
  );

  if (!accountItemNext) {
    throw createError(404);
  }

  if (accountItemNext.dateTimeExpired != null) {
    if (accountItemNext.dateTimeExpired < now) {
      await SessionModel.updateMany(
        {
          account: accountItem._id,
          invalid: {
            $ne: true,
          },
          dateTimeExpired: {
            $gt: now,
          },
        },
        {
          $set: {
            dateTimeExpired: accountItemNext.dateTimeExpired,
          },
        },
      );
    } else {
      await SessionModel.updateMany(
        {
          account: accountItem._id,
          invalid: {
            $ne: true,
          },
          dateTimeExpired: {
            $gt: accountItemNext.dateTimeExpired,
          },
        },
        {
          $set: {
            dateTimeExpired: accountItemNext.dateTimeExpired,
          },
        },
      );
    }
  }

  logger.warn(`\`account:${accountItem._id}\` update \`${JSON.stringify(_.omit(input, ['password']))}\``);

  return accountItemNext;
};
