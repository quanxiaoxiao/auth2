import dayjs from 'dayjs';
import createError from 'http-errors';
import { getState } from '../../store/store.mjs';
import { Session as SessionModel } from '../../models/index.mjs';
import calcAccountHash from '../../providers/calcAccountHash.mjs';
import querySessionById from './querySessionById.mjs';

export default async (accountItem, {
  remoteAddress,
  userAgent,
  dateTimeExpired,
  description,
  type,
}) => {
  const now = Date.now();
  const data = {
    remoteAddress,
    userAgent,
    dateTimeExpired,
    description,
    type,
    hash: calcAccountHash(accountItem),
  };
  if (data.dateTimeExpired == null) {
    data.dateTimeExpired = dayjs().add(getState().session.dateTimeExpired, 'millisecond').valueOf();
  }
  if (accountItem.dateTimeExpired != null) {
    if (accountItem.dateTimeExpired < now) {
      throw createError(403, 'dateTimeExpired is less now');
    }
    data.dateTimeExpired = Math.min(accountItem.dateTimeExpired, data.dateTimeExpired);
  }
  const sessionItem = new SessionModel({
    account: accountItem._id,
    ...data,
  });
  await sessionItem.save();
  const result = await querySessionById(sessionItem._id);
  if (!result || !result.account) {
    throw createError(403);
  }
  return result;
};
