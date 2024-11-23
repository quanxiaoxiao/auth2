import mongoose from 'mongoose';
import { remove } from '@quanxiaoxiao/list';
import createError from 'http-errors';
import {
  RouteMatchGroup as RouteMatchGroupModel,
  RouteMatch as RouteMatchModel,
} from '../../models/index.mjs';
import logger from '../../logger.mjs';
import { getState, dispatch } from '../../store/store.mjs';

export default (routeMatch) => {
  const ret = remove(getState().data.routeMatchList)(routeMatch);
  if (!ret) {
    throw createError(404);
  }

  RouteMatchModel
    .updateOne(
      {
        _id: routeMatch,
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
    )
    .then(
      () => {
        logger.warn(`\`routeMatch:${routeMatch}\` remove`);
      },
      () => {},
    );

  RouteMatchGroupModel.updateMany(
    {},
    {
      $pull: {
        routeMatches: new mongoose.Types.ObjectId(routeMatch),
      },
    },
  )
    .then(
      () => {},
      () => {},
    );

  dispatch('data.routeMatchList', ret[1]);
  dispatch('data.routeMatchGroupList', (pre) => pre.map((routeMatchGroupItem) => ({
    ...routeMatchGroupItem,
    routeMatches: routeMatchGroupItem.routeMatches.filter((_id) => _id !== routeMatch),
  })));

  return ret[0];
};
