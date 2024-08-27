import hmac from './hmac.mjs';

export default (accountItem) => hmac(`${accountItem.username}:${accountItem.password}`);
