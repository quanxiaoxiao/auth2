import assert from 'node:assert';
import createError from 'http-errors';
import _ from 'lodash';
import logger from '../../logger.mjs';
import { SESSION_TYPE_LOGIN } from '../../constants.mjs';
import hmac from '../../providers/hmac.mjs';
import { Account as AccountModel } from '../../models/index.mjs';
import createSession from './createSession.mjs';

export default async (input) => {
  const {
    username,
    password,
    userAgent,
  } = input;
  assert(password);
  const mac = hmac(password);
  const accountItem = await AccountModel.findOne({
    username,
    password: mac,
    invalid: {
      $ne: true,
    },
  });

  if (!accountItem) {
    throw createError(403, 'username or password is not match');
  }

  const sessionItem = await createSession(accountItem, {
    userAgent,
    type: SESSION_TYPE_LOGIN,
  });

  logger.warn(`create session by password \`${JSON.stringify(_.omit(input, ['password']))}\``);

  return sessionItem;
};
