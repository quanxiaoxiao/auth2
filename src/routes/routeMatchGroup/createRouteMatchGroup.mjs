import createError from 'http-errors';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import checkRoutematches from './checkRoutematches.mjs';

export default async (input) => {
  if (input.name.trim() === '') {
    throw createError(400);
  }
  await checkRoutematches(input.routeMatches);
  const routeMatchGroup = new RouteMatchGroupModel({
    ...input,
  });
  await routeMatchGroup.save();

  return routeMatchGroup;
};
