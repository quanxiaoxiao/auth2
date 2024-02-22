import {
  RouteMatchGroup as RouteMatchGroupModel,
  Account as AccountModel,
} from '../../models/index.mjs';

export default async (routeMatchGroupItem) => {
  await Promise.all([
    RouteMatchGroupModel.updateOne(
      {
        _id: routeMatchGroupItem._id,
        invalid: {
          $ne: true,
        },
      },
      {
        $set: {
          invalid: true,
          timeInvalid: Date.now(),
        },
      },
    ),

    AccountModel.updateMany(
      {},
      {
        $pull: {
          routeMatchGroups: routeMatchGroupItem._id,
        },
      },
    ),
  ]);
};
