import { generateSortDataUpdates } from '@quanxiaoxiao/mongo';
import {
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';
import queryRouteMatchGroups from './queryRouteMatchGroups.mjs';

export default async (input) => {
  const routeMatchGroupList = await queryRouteMatchGroups({});
  const updates = generateSortDataUpdates(routeMatchGroupList, input);
  await RouteMatchGroupModel.updateMany(
    {},
    {
      $set: {
        order: null,
      },
    },
  );

  await RouteMatchGroupModel.bulkWrite(updates);
  return queryRouteMatchGroups({});
};
