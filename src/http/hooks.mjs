import createError from 'http-errors';
import { selectRouteMatchList } from '../store/selector.mjs';

export default {
  onHttpRequest: () => {},
  onHttpRequestStartLine: (ctx) => {
    const routeMatchList = selectRouteMatchList();
    const routeMatched = routeMatchList.find((routeItem) => routeItem.urlMatch(ctx.request.pathname));
    if (!routeMatched) {
      throw createError(404);
    }
    ctx.routeMatched = routeMatched;
  },
  onHttpRequestHeader: async (ctx) => {
    const requestHandler = ctx.routeMatched[ctx.request.method.toLowerCase()];
    if (!requestHandler) {
      throw createError(405);
    }
    ctx.request.params = ctx.routeMatched.urlMatch(ctx.request.pathname);
    if (ctx.routeMatched.query) {
      ctx.request.query = ctx.routeMatched.query(ctx.request.query);
    }
    if (ctx.routeMatched.match) {
      if (!ctx.routeMatched.match(ctx.request)) {
        throw createError(400);
      }
    }
    if (ctx.routeMatched.onPre) {
      await ctx.routeMatched.onPre(ctx);
    }
    ctx.onRequest = requestHandler;
    if (ctx.routeMatched.select) {
      ctx.onResponse = (_ctx) => {
        _ctx.response.data = ctx.routeMatched.select(_ctx.response.data);
      };
    }
  },
  onHttpError: (ctx) => {
    console.log(`${ctx.request.method} ${ctx.request.path} ${ctx.error.message}`);
  },
};
