import assert from 'node:assert';

import createError from 'http-errors';

import calcAccountHash from '../../providers/calcAccountHash.mjs';

export default (sessionItem) => {
  assert(typeof sessionItem.dateTimeExpired === 'number');
  const now = Date.now();
  if (sessionItem.dateTimeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.account.dateTimeExpired != null && sessionItem.account.dateTimeExpired < now) {
    throw createError(404);
  }
  if (sessionItem.hash !== calcAccountHash(sessionItem.account)) {
    throw createError(404);
  }
};
