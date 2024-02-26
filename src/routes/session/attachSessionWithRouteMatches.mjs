import store from '../../store/store.mjs';

const { getState } = store;

export default (sessionItem) => {
  const { routeMatchGroups } = getState();
  const routeMatchList = [];
  const set = new Set();

  for (let i = 0; i < sessionItem.account.routeMatchGroups.length; i++) {
    const routeMatchGroup = sessionItem.account.routeMatchGroups[i];
    const arr = routeMatchGroups[routeMatchGroup];
    for (let j = 0; j < arr.length; j++) {
      const routeMatchItem = arr[j];
      const _id = routeMatchItem._id.toString();
      if (!set.has(_id)) {
        set.add(_id);
        routeMatchList.push(routeMatchItem);
      }
    }
  }
  sessionItem.routeMatches = routeMatchList;
  return sessionItem;
};
