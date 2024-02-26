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
  const data = {
    remoteAddress,
    userAgent,
    timeExpired,
    description,
    type,
    hash: hmac(`${accountItem.username}:${accountItem.password}`),
  };
  if (data.timeExpired == null) {
    data.timeExpired = dayjs().add(getState().session.timeExpired, 'millisecond').valueOf();
  }
  if (accountItem.timeExpired != null) {
    if (accountItem.timeExpired < now) {
      throw createError(403, 'timeExpired is less now');
    }
    data.timeExpired = Math.min(accountItem.timeExpired, data.timeExpired);
  }
  const sessionItem = new SessionModel({
    account: accountItem._id,
    ...data,
  });
  await sessionItem.save();
  const result = await findSession(sessionItem._id);
  if (!result || !result.account) {
    throw createError(403);
  }
  return result;
};
