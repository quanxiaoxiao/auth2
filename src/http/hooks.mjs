import createError from 'http-errors';
import { filterRoutesOfPathname } from '@quanxiaoxiao/http-router';
import { selectRouteMatchList } from '../store/selector.mjs';

const getRequestHandler = (routeList, request) => {
  const method = request.method.toLowerCase();
  for (let i = 0; i < routeList.length; i++) {
    const routeItem = routeList[i];
    const fn = routeItem[method];
    if (typeof fn !== 'function') {
      continue;
    }
    const pathnameMatched = routeItem.urlMatch(request.pathname);
    if (!pathnameMatched) {
      continue;
    }
    const { params } = pathnameMatched;
    const query = routeItem.query ? routeItem.query(request.query) : request.query;
    if (!routeItem.match) {
      return {
        params,
        query,
        handler: fn,
        select: routeItem.select,
        onPre: routeItem.onPre,
      };
    }
    if (routeItem.match({
      ...request,
      params,
      query,
    })) {
      return {
        params,
        query,
        handler: fn,
        select: routeItem.select,
        onPre: routeItem.onPre,
      };
    }
  }
  return null;
};

export default {
  onHttpRequest: () => {},
  onHttpRequestStartLine: (ctx) => {
    const routeMatchList = selectRouteMatchList();
    const routeMatchedList = filterRoutesOfPathname(routeMatchList, ctx.request.pathname);
    if (routeMatchedList.length === 0) {
      throw createError(404);
    }
    ctx.routeMatchedList = routeMatchedList;
  },
  onHttpRequestHeader: async (ctx) => {
    const requestHandler = getRequestHandler(ctx.routeMatchedList, ctx.request);
    if (!requestHandler) {
      throw createError(405);
    }
    ctx.request.params = requestHandler.params;
    ctx.request.query = requestHandler.query;
    if (requestHandler.onPre) {
      await requestHandler.onPre(ctx);
    }
    ctx.onRequest = requestHandler.handler;
    if (requestHandler.select) {
      ctx.onResponse = (_ctx) => {
        _ctx.response.data = requestHandler.select(_ctx.response.data);
      };
    }
  },
  onHttpError: (ctx) => {
    console.log(`${ctx.request.method} ${ctx.request.path} ${ctx.error.message}`);
  },
};
