import dayjs from 'dayjs';
import createError from 'http-errors';
import store from '../../store/store.mjs';
import { Session as SessionModel } from '../../models/index.mjs';
import hmac from '../../providers/hmac.mjs';
import findSession from './findSession.mjs';

const { getState } = store;

export default async (accountItem, {
  remoteAddress,
  userAgent,
  timeExpired,
  description,
  type,
}) => {
  const now = Date.now();
  timeExpired = timeExpired == null
    ? dayjs().add(getState().session.timeExpired, 'millisecond').valueOf()
    : timeExpired;
  if (accountItem.timeExpired != null) {
    if (accountItem.timeExpired < now) {
      throw createError(403, 'timeExpired is less now');
    }
    timeExpired = Math.min(accountItem.timeExpired, timeExpired);
  }
  const sessionItem = new SessionModel({
    account: accountItem._id,
    remoteAddress,
    userAgent,
    description,
    timeExpired,
    type,
    hash: hmac(`${accountItem.username}:${accountItem.password}`),
  });
  await sessionItem.save();
  const result = await findSession(sessionItem._id);
  if (!result || !result.account) {
    throw createError(403);
  }
  return result;
};
