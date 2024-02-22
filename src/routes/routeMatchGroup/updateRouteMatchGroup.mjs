import createError from 'http-errors';
import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';
import checkRoutematches from './checkRoutematches.mjs';

export default async (routeMatchGroupItem, input) => {
  if (Object.hasOwnProperty.call(input, 'name')) {
    if (input.name.trim() === '') {
      throw createError(400);
    }
  }
  await checkRoutematches(input.routeMatches);
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

  return routeMatchGroupItemNext;
};
