import net from 'node:net';
import process from 'node:process';
import handleSocket from '@quanxiaoxiao/httttp';
import {
  createHttpRequestHooks,
  generateRouteMatchList,
} from '@quanxiaoxiao/http-router';
import store from './store/store.mjs';
import './models/index.mjs';
import logger from './logger.mjs';
import connectMongo from './connectMongo.mjs';
import routes from './routes/index.mjs';

process.nextTick(async () => {
  const { getState, dispatch } = store;
  await connectMongo();

  dispatch('routeMatchList', generateRouteMatchList(routes));

  const httpRequestHooks = createHttpRequestHooks({
    getRouteMatches: () => getState().routeMatchList,
    logger,
  });

  const server = net.createServer((socket) => handleSocket({
    ...httpRequestHooks,
    socket,
  }));
  const { port } = getState().server;
  server.listen(port, () => {
    console.log(`server listen at \`${port}\``);
  });
});

process.on('uncaughtException', (error) => {
  console.error('boooooooom');
  console.error(error);
  logger.error(`boooooooom ${error.message}`);
  process.exit(1);
});
