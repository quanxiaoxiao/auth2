import createError from 'http-errors';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import checkRouteMatches from './checkRouteMatches.mjs';

export default async (input) => {
  if (input.name.trim() === '') {
    throw createError(400);
  }
  await checkRouteMatches(input.routeMatches);
  const routeMatchGroup = new RouteMatchGroupModel({
    ...input,
  });
  await routeMatchGroup.save();

  return routeMatchGroup;
};
