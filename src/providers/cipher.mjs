import {
  createCipheriv,
  createDecipheriv,
} from 'node:crypto';
import store from '../store/store.mjs';

const { getState } = store;

export const encode = (str) => {
  const cipher = createCipheriv(
    getState().cipher.algorithm,
    getState().cipher.key,
    getState().cipher.iv,
  );
  const encrypted = cipher.update(str, 'utf8', 'base64');
  return encrypted + cipher.final('base64');
};

export const decode = (str) => {
  const decipher = createDecipheriv(
    getState().cipher.algorithm,
    getState().cipher.key,
    getState().cipher.iv,
  );
  const decrypted = decipher.update(str, 'base64', 'utf8');
  return decrypted + decipher.final('utf8');
};
