import assert from 'node:assert';
import createError from 'http-errors';
import hmac from '../../providers/hmac.mjs';

export default (sessionItem) => {
  assert(typeof sessionItem.timeExpired === 'number');
  const now = Date.now();
  if (sessionItem.timeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.account.timeExpired != null && sessionItem.account.timeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.hash !== hmac(`${sessionItem.account.username}:${sessionItem.account.password}`)) {
    throw createError(404);
  }
};
