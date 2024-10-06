import { RouteMatchGroup as RouteMatchGroupModel } from '../../models/index.mjs';

export default async () => {
  const routeMatchGroupList = await RouteMatchGroupModel
    .find({
      invalid: {
        $ne: true,
      },
    })
    .sort({
      order: -1,
      dateTimeCreate: 1,
    })
    .lean();
  return routeMatchGroupList;
};
