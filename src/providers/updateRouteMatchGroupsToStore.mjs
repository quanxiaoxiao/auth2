import store from '../store/store.mjs';
import {
  RouteMatchGroup as RouteMatchGroupModel,
  RouteMatch as RouteMatchModel,
} from '../models/index.mjs';

const { dispatch } = store;

export default async () => {
  const [routeMatchList, routeMatchGroupList] = await Promise.all([
    RouteMatchModel.find({
      invalid: {
        $ne: true,
      },
    })
      .lean(),
    RouteMatchGroupModel.find(
      {
        invalid: {
          $ne: true,
        },
      },
    )
      .lean(),
  ]);
  const routeMatches = {};
  for (let i = 0; i < routeMatchList.length; i++) {
    const routeMatchItem = routeMatchList[i];
    routeMatches[routeMatchItem._id.toString()] = routeMatchItem;
  }
  const groups = {};

  for (let i = 0; i < routeMatchGroupList.length; i++) {
    const routeMatchGroupItem = routeMatchGroupList[i];
    groups[routeMatchGroupItem._id] = routeMatchGroupItem.routeMatches.map((routeMatch) => routeMatches[routeMatch]);
  }

  dispatch('routeMatchGroups', groups);
};
