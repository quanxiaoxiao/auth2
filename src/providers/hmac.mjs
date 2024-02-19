import { createHmac } from 'node:crypto';
import store from '../store/store.mjs';

const { getState } = store;

export default (str) => createHmac('sha256', getState().cipher.secret)
  .update(str)
  .digest('hex');
