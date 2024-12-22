import assert from 'node:assert';
import crypto from 'node:crypto';

import { select } from '@quanxiaoxiao/datav';

export default (state) => ({
  secret,
  algorithm,
}) => {
  assert(typeof secret === 'string');
  assert(secret.length >= 1);
  assert(typeof algorithm === 'string');
  assert(crypto.getCiphers().includes(algorithm));
  const size = select({ type: 'integer' })(algorithm.split('-')[1]);
  assert(size !== null && size % 8 === 0);
  assert(size <= 256);
  const mac = crypto.createHmac('sha256', secret).update(secret).digest('buf');
  const ivBuf = mac.slice(-16);
  const keyBuf = mac.slice(0, size / 8);

  const cipher = crypto.createCipheriv(
    algorithm,
    keyBuf,
    ivBuf,
  );
  const content = crypto.randomBytes(20).toString('utf8');
  const encrypted = cipher.update(content, 'utf8', 'base64') + cipher.final('base64');
  const decipher = crypto.createDecipheriv(
    algorithm,
    keyBuf,
    ivBuf,
  );
  const decrypted = decipher.update(encrypted, 'base64', 'utf8') + decipher.final('utf8');
  assert(decrypted === content);

  state.cipher = {
    secret,
    iv: ivBuf,
    algorithm,
    key: keyBuf,
  };

  return state;
};
