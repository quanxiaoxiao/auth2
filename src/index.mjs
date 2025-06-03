import './store/store.mjs';
import './models/index.mjs';

import net from 'node:net';
import process from 'node:process';

import {
  createHttpRequestHandler,
  generateRouteMatchList,
  handleSocketRequest,
} from '@quanxiaoxiao/httttp';
import { sort } from '@quanxiaoxiao/list';

import connectMongo from './connectMongo.mjs';
import queryRouteMatches from './controllers/routeMatch/queryRouteMatches.mjs';
import queryRouteMatchGroups from './controllers/routeMatchGroup/queryRouteMatchGroups.mjs';
import logger from './logger.mjs';
import routes from './routes/index.mjs';
import { selectRouteMatchList } from './store/selector.mjs';
import { dispatch, getValue } from './store/store.mjs'; // eslint-disable-line

process.nextTick(async () => {
  await connectMongo();

  dispatch('routeMatchList', generateRouteMatchList(routes));

  const routeMatchGroupList = await queryRouteMatchGroups();
  const routeMatchList = await queryRouteMatches();

  dispatch('data.routeMatchGroupList', sort(routeMatchGroupList.map((routeMatchGroupItem) => ({
    _id: routeMatchGroupItem._id.toString(),
    name: routeMatchGroupItem.name,
    dateTimeCreate: routeMatchGroupItem.dateTimeCreate,
    isSetDefault: routeMatchGroupItem.isSetDefault,
    routeMatches: routeMatchGroupItem.routeMatches.map((routeMatch) => routeMatch.toString()),
  }))));

  dispatch('data.routeMatchList', sort(routeMatchList.map((routeMatchItem) => ({
    _id: routeMatchItem._id.toString(),
    path: routeMatchItem.path,
    value: routeMatchItem.value,
    description: routeMatchItem.description,
    dateTimeCreate: routeMatchItem.dateTimeCreate,
  }))));

  const server = net.createServer((socket) => handleSocketRequest({
    socket,
    ...createHttpRequestHandler({
      list: selectRouteMatchList(),
      logger,
    }),
  }));

  const port = getValue('server.port');
  server.listen(port, () => {
    console.log(`server listen at \`${port}\``);
  });
});

process.on('uncaughtException', (error) => {
  console.error('boooooooom');
  console.error(error);
  logger.error(`boooooooom ${error.message}`);
});
