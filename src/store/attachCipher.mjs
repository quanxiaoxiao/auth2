import crypto from 'node:crypto';
import assert from 'node:assert';
import { Buffer } from 'node:buffer';
import { select } from '@quanxiaoxiao/datav';

export default (state) => {
  return ({
    secret,
    key,
    iv,
    algorithm,
  }) => {
    assert(typeof key === 'string');
    assert(typeof iv === 'string');
    assert(typeof algorithm === 'string');
    assert(typeof secret === 'string');
    assert(secret.length >= 1);
    assert(crypto.getCiphers().includes(algorithm));
    const keyBuf = Buffer.from(key, 'hex');
    const ivBuf = Buffer.from(iv, 'hex');
    assert(ivBuf.length === 16);

    const size = select({ type: 'integer' })(algorithm.split('-')[1]);
    assert(size !== null && size % 8 === 0);
    assert(keyBuf.length * 8 === size);
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
};
