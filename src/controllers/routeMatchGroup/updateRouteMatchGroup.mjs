import createError from 'http-errors';
import { update } from '@quanxiaoxiao/list';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import logger from '../../logger.mjs';
import { getState, dispatch } from '../../store/store.mjs';
import getRouteMatchById from '../routeMatch/getRouteMatchById.mjs';

export default (routeMatchGroup, input) => {
  if (input.routeMatches) {
    for (let i = 0; i < input.routeMatches.length; i++) {
      const routeMatch = input.routeMatches[i];
      if (!getRouteMatchById(routeMatch)) {
        logger.warn(`\`routeMatchGroup:${routeMatchGroup}\` update fail, routeMatch \`${routeMatch}\` not found`);
        throw createError(403);
      }
    }
  }

  const ret = update(getState().data.routeMatchGroupList)(routeMatchGroup, () => input);

  RouteMatchGroupModel.updateOne(
    {
      _id: routeMatchGroup,
      invalid: {
        $ne: true,
      },
    },
    {
      $set: {
        ...input,
      },
    },
  )
    .then(
      () => {
        logger.warn(`\`routeMatchGroup:${routeMatchGroup}\` update \`${JSON.stringify(input)}\``);
      },
      () => {},
    );

  if (!ret) {
    throw createError(404);
  }

  dispatch('data.routeMatchGroupList', ret[2]);

  return ret[0];
};
