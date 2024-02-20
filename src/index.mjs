import process from 'node:process';
import shelljs from 'shelljs';
import { select } from '@quanxiaoxiao/datav';
import { generateRouteList } from '@quanxiaoxiao/http-router';
import store from './store/store.mjs';
import './models/index.mjs';
import createServer from './http/createServer.mjs';
import routes from './routes/index.mjs';

const { getState, dispatch } = store;

createServer();

process.on('exit', () => {
  if (shelljs.test('-f', getState().configPathnames.state)) {
    shelljs.rm(getState().configPathnames.state);
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.log('boooooooom');
  console.log(error);
  process.exit(1);
});

process.nextTick(() => {
  const routeList = generateRouteList(routes);
  dispatch('routeMatchList', routeList.map((d) => {
    const routeItem = {
      match: d.match,
      pathname: d.pathname,
      urlMatch: d.urlMatch,
    };
    if (d.select) {
      routeItem.select = select(d.select);
      routeItem.select.toJSON = () => d.select;
    }
    if (d.query) {
      routeItem.query = select(d.query);
      routeItem.query.toJSON = () => d.query;
    }
    if (d.onPre) {
      routeItem.onPre = d.onPre;
    }
    const methodList = ['get', 'post', 'put', 'delete'];
    for (let i = 0; i < methodList.length; i++) {
      const method = methodList[i];
      if (d[method]) {
        routeItem[method] = d[method];
      }
    }
    return routeItem;
  }));
});
