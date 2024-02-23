import createError from 'http-errors';
import { SESSION_TYPE_LOGIN } from '../../constants.mjs';
import hmac from '../../providers/hmac.mjs';
import { Account as AccountModel } from '../../models/index.mjs';
import createSession from './createSession.mjs';

export default async ({
  username,
  password,
  userAgent,
}) => {
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

  return sessionItem;
};
