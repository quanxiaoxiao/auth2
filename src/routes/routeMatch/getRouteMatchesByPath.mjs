import { pathToRegexp } from 'path-to-regexp';
import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';

export default async (pathname) => {
  if (!pathname || pathname[0] !== '/') {
    return [];
  }
  const routeMatchList = await RouteMatchModel
    .find({
      invalid: {
        $ne: true,
      },
    })
    .lean();
  return routeMatchList.filter((item) => {
    const regexp = pathToRegexp(item.path);
    return !!regexp.exec(pathname);
  });
};
