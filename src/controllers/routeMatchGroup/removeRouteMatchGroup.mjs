import { remove } from '@quanxiaoxiao/list';
import createError from 'http-errors';
import mongoose from 'mongoose';

import logger from '../../logger.mjs';
import {
  Account as AccountModel,
  RouteMatchGroup as RouteMatchGroupModel,
} from '../../models/index.mjs';
import { dispatch, getState } from '../../store/store.mjs';

export default (routeMatchGroup) => {
  const ret = remove(getState().data.routeMatchGroupList)(routeMatchGroup);
  if (!ret) {
    throw createError(404);
  }
  RouteMatchGroupModel.updateOne(
    {
      _id: routeMatchGroup,
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
        logger.warn(`\`routeMatchGroup:${routeMatchGroup}\` remove`);
      },
      () => {},
    );
  AccountModel.updateMany(
    {},
    {
      $pull: {
        routeMatchGroups: new mongoose.Types.ObjectId(routeMatchGroup),
      },
    },
  )
    .then(
      () => {
      },
      (error) => {
        console.warn(error);
      },
    );

  dispatch('data.routeMatchGroupList', ret[1]);
  return ret[0];
};
