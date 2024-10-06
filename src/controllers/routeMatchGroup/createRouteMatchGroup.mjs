import createError from 'http-errors';
import { sort } from '@quanxiaoxiao/list';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import logger from '../../logger.mjs';
import store from '../../store/store.mjs';
import getRouteMatchById from '../routeMatch/getRouteMatchById.mjs';

const { dispatch } = store;

export default async (input) => {
  if (Array.isArray(input.routeMatches)) {
    for (let i = 0; i < input.routeMatches.length; i++) {
      const routeMatch = input.routeMatches[i];
      if (!getRouteMatchById(routeMatch)) {
        logger.warn(`create routeMatchGroup fail, routeMatch \`${routeMatch}\` not found`);
        throw createError(403);
      }
    }
  }
  const routeMatchGroupItem = new RouteMatchGroupModel({
    ...input,
  });
  logger.warn(`createRouteMatchGroup \`${JSON.stringify(input)}\``);
  await routeMatchGroupItem.save();

  const data = {
    _id: routeMatchGroupItem._id.toString(),
    name: routeMatchGroupItem.name,
    dateTimeCreate: routeMatchGroupItem.dateTimeCreate,
    isSetDefault: routeMatchGroupItem.isSetDefault,
    routeMatches: routeMatchGroupItem.routeMatches.map((routeMatch) => routeMatch.toString()),
  };

  dispatch('data.routeMatchGroupList', (pre) => sort([...pre, data]));

  return data;
};
