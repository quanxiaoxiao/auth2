import { pathToRegexp } from 'path-to-regexp';
import store from '../../store/store.mjs';

const { getState } = store;

export default (pathname) => {
  const { routeMatchList } = getState().data;
  const result = [];
  for (let i = 0; i < routeMatchList.length; i++) {
    const routeMatchItem = routeMatchList[i];
    const regexp = pathToRegexp(routeMatchItem.path);
    if (regexp.exec(pathname)) {
      result.push(routeMatchItem);
    }
  }
  return result;
};