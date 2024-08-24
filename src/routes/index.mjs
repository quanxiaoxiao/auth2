import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { toDataify } from '@quanxiaoxiao/node-utils';
import store from '../store/store.mjs';
import account from './account/index.mjs';
import session from './session/index.mjs';
import routeMatch from './routeMatch/index.mjs';
import routeMatchGroup from './routeMatchGroup/index.mjs';

const { getState } = store;

export default {
  '/api/state': {
    put: (ctx) => {
      fs.writeFileSync(path.resolve(process.cwd(), '.state.json'), toDataify(getState()));
      ctx.response = {
        data: Date.now(),
      };
    },
  },
  ...account,
  ...session,
  ...routeMatch,
  ...routeMatchGroup,
};
