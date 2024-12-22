import getRouteMatchGroupById from '../routeMatchGroup/getRouteMatchGroupById.mjs';
import getRouteMatchById from './getRouteMatchById.mjs';

export default (accountItem) => {
  const routeMatchList = Array.from(new Set(accountItem
    .routeMatchGroups
    .map((routeMatchGroup) => {
      const routeMatchGroupItem = getRouteMatchGroupById(routeMatchGroup.toString());
      if (!routeMatchGroupItem) {
        return [];
      }
      return routeMatchGroupItem.routeMatches;
    })
    .reduce((acc, cur) => [...acc, ...cur], [])));

  const result = [];

  for (let i = 0; i < routeMatchList.length; i++) {
    const routeMatch = routeMatchList[i];
    const routeMatchItem = getRouteMatchById(routeMatch);
    if (routeMatchItem) {
      result.push(routeMatchItem);
    }
  }

  return result;
};
