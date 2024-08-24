import { getQuery } from '@quanxiaoxiao/mongo';
import {
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';

export default async (args) => {
  const query = getQuery(args);
  query.invalid = {
    $ne: true,
  };
  const routeMatchGroupList = await RouteMatchGroupModel
    .find(query)
    .sort({
      order: -1,
      dateTimeCreate: 1,
    });
  return routeMatchGroupList;
};
