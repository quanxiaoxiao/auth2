import hmac from './hmac';

export default (accountItem) => hmac(`${accountItem.username}:${accountItem.password}`);
