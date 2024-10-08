import hmac from './hmac.mjs';

export default (accountItem) => {
  if (!accountItem.password) {
    return hmac(`${accountItem._id.toString()}:${accountItem.username}:`);
  }
  return hmac(`${accountItem._id.toString()}:${accountItem.username}:${accountItem.password}`);
};
