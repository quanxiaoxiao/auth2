import createError from 'http-errors';
import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';
import checkPathValidate from './checkPathValidate.mjs';

export default async (routeMatchItem, input) => {
  if (Object.hasOwnProperty.call(input, 'path')) {
    checkPathValidate(input.path);
  }
  const routeMatchItemNext = await RouteMatchModel.findOneAndUpdate(
    {
      _id: routeMatchItem._id,
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
  if (!routeMatchItemNext) {
    throw createError(404);
  }
  return routeMatchItemNext;
};
