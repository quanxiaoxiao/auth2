import createError from 'http-errors';
import logger from '../../logger.mjs';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import checkRouteMatches from './checkRouteMatches.mjs';

export default async (routeMatchGroupItem, input) => {
  await checkRouteMatches(input.routeMatches);
  const routeMatchGroupItemNext = await RouteMatchGroupModel.findOneAndUpdate(
    {
      _id: routeMatchGroupItem._id,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        ...input,
      },
    },
    {
      new: true,
    },
  );

  if (!routeMatchGroupItemNext) {
    throw createError(404);
  }

  logger.warn(`\`${routeMatchGroupItem._id}\` updateRouteMatchGroup \`${JSON.stringify(input)}\``);

  return routeMatchGroupItemNext;
};
