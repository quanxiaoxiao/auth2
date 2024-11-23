import createError from 'http-errors';
import { update } from '@quanxiaoxiao/list';
import logger from '../../logger.mjs';
import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';
import checkPathValidate from './checkPathValidate.mjs';
import { getState, dispatch } from '../../store/store.mjs';

export default (routeMatch, input) => {
  if (Object.hasOwnProperty.call(input, 'path')) {
    checkPathValidate(input.path);
  }
  const ret = update(getState().data.routeMatchList)(routeMatch, () => input);
  if (!ret) {
    throw createError(404);
  }
  RouteMatchModel.updateOne(
    {
      _id: routeMatch,
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
        logger.warn(`\`routeMatch:${routeMatch}\` update \`${JSON.stringify(input)}\``);
      },
      () => {},
    );
  dispatch('data.routeMatchList', ret[2]);
  return ret[0];
};
