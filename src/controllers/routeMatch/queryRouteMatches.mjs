import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';

export default async () => {
  const routeMatchList = await RouteMatchModel
    .find({
      invalid: true,
    })
    .sort({
      order: -1,
      dateTimeCreate: 1,
    })
    .lean();
  return routeMatchList;
};
