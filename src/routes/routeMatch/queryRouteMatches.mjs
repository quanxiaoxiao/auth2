import { getQuery } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';

export default async (args) => {
  const query = getQuery(args);
  query.invalid = {
    $ne: true,
  };
  const routeMatchList = await RouteMatchModel
    .find(query)
    .sort({
      order: -1,
      dateTimeCreate: 1,
    })
    .lean();
  return routeMatchList;
};
