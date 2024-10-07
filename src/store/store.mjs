import { createStore } from '@quanxiaoxiao/store';
import initialState from './initialState.mjs';
import attachCipher from './attachCipher.mjs';

const store = createStore({
  initialState: attachCipher(initialState)({
    secret: process.env.CIPHER_SECRET,
    algorithm: process.env.CIPHER_ALGORITHM,
  }),
  schemas: {
    'server.port': {
      type: 'integer',
      maximum: 65535,
      minimum: 1,
    },
    'mongo.port': {
      type: 'integer',
      maximum: 65535,
      minimum: 1,
    },
    'session.dateTimeExpired': {
      type: 'integer',
      minimum: 1000 * 60 * 20,
    },
    'session.authKey': {
      type: 'string',
      minLength: 1,
    },
  },
  middlewares: [],
});

export default store;
