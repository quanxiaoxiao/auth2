import logger from '../../logger.mjs';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import checkRouteMatches from './checkRouteMatches.mjs';

export default async (input) => {
  await checkRouteMatches(input.routeMatches);
  const routeMatchGroup = new RouteMatchGroupModel({
    ...input,
  });
  await routeMatchGroup.save();

  logger.warn(`createRouteMatchGroup \`${JSON.stringify(input)}\``);
  return routeMatchGroup;
};
