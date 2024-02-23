import { generateSortDataUpdates } from '@quanxiaoxiao/mongo';
import {
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';
import queryRouteMatches from './queryRouteMatches.mjs';

export default async (input) => {
  const routeMatchList = await queryRouteMatches({});
  const updates = generateSortDataUpdates(routeMatchList, input);

  await RouteMatchModel.updateMany(
    {},
    {
      $set: {
        order: null,
      },
    },
  );

  await RouteMatchModel.bulkWrite(updates);
  return queryRouteMatches({});
};
