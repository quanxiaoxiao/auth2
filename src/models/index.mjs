import mongoose from 'mongoose';
import { connectDb } from '@quanxiaoxiao/mongo';
import { getCurrentDateTime } from '@quanxiaoxiao/utils';
import accountSchema from './account.mjs';
import sessionSchema from './session.mjs';
import storageSchema from './storage.mjs';
import routeMatchSchema from './routeMatch.mjs';
import routeMatchGroupSchema from './routeMatchGroup.mjs';
import store from '../store/store.mjs';

const { getState, dispatch } = store;

const config = getState().mongo;

await connectDb({
  database: config.database,
  port: config.port,
  hostname: config.hostname,
  username: config.username,
  password: config.password,
  onRequest: (uri) => {
    console.log(`mongo connect -> ${uri}`);
  },
  onConnect: () => {
    console.warn('mongodb connect success');
    dispatch('mongo', (pre) => ({
      ...pre,
      dateTimeConnect: getCurrentDateTime(),
      connect: true,
    }));
  },
});

export const Account = mongoose.model('Account', accountSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const Storage = mongoose.model('Storage', storageSchema);
export const RouteMatch = mongoose.model('RouteMatch', routeMatchSchema);
export const RouteMatchGroup = mongoose.model('RouteMatchGroup', routeMatchGroupSchema);
