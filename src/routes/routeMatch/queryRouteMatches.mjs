import { getQuery } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (args) => {
  const query = getQuery(args);
  const routeMatchList = await RouteMatchModel
    .find(query)
    .sort({
      order: -1,
      timeCreate: 1,
    });
  return routeMatchList;
};
