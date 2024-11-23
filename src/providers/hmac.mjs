import { createHmac } from 'node:crypto';
import { getState } from '../store/store.mjs';

export default (str) => createHmac('sha256', getState().cipher.secret)
  .update(str)
  .digest('hex');
