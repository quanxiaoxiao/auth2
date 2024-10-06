import process from 'node:process';
import * as dotenv from 'dotenv';
import { select } from '@quanxiaoxiao/datav';

dotenv.config();

const initialState = {
  dateTimeCreate: Date.now(),
  server: {
    port: select({ type: 'integer' })(process.env.SERVER_PORT),
  },
  routeMatchGroups: {},
  data: {
    routeMatchGroupList: [],
    routeMatchList: [],
  },
  cipher: null,
  session: {
    dateTimeExpired: select({ type: 'integer' })(process.env.SESSION_TIME_EXPIRED) || 1000 * 60 * 20,
    key: process.env.SESSION_KEY,
    authKey: process.env.SESSION_AUTH_KEY,
  },
  mongo: {
    connect: false,
    dateTimeConnect: null,
    hostname: process.env.MONGO_HOSTNAME || '127.0.0.1',
    port: select({ type: 'integer' })(process.env.MONGO_PORT),
    database: process.env.MONGO_DATABASE,
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
  },
  routeMatchList: [],
};

export default initialState;
