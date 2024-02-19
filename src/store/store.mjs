import createStore from '@quanxiaoxiao/store';
import initialState from './initialState.mjs';
import mapStateOutputMiddelware from './middlewares/mapStateOutput.mjs';

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
  },
  middlewares: [mapStateOutputMiddelware],
});

export default store;
