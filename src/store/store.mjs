import createStore from '@quanxiaoxiao/store';
import initialState from './initialState.mjs';

const store = createStore({
  initialState,
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
    'session.key': {
      type: 'string',
      minLength: 1,
    },
    'session.authKey': {
      type: 'string',
      minLength: 1,
    },
  },
  middlewares: [],
});

export default store;
