import logger from '../../logger.mjs';
import {
  RouteMatch as RouteMatchModel,
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';

export default async (routeMatchItem) => {
  await Promise.all([
    RouteMatchModel.updateOne(
      {
        _id: routeMatchItem._id,
        invalid: {
          $ne: true,
        },
      },
      {
        $set: {
          invalid: true,
          dateTimeInvalid: Date.now(),
        },
      },
    ),
    RouteMatchGroupModel.updateMany(
      {},
      {
        $pull: {
          routeMatches: routeMatchItem._id,
        },
      },
    ),
  ]);
  logger.warn(`\`${routeMatchItem._id}\` removeRouteMatch`);
};
