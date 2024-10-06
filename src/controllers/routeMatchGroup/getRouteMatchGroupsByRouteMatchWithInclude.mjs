import store from '../../store/store.mjs';

const { getState } = store;

export default (routeMatch) => {
  const { routeMatchGroupList } = getState().data;
  const result = [];
  for (let i = 0; i < routeMatchGroupList.length; i++) {
    const routeMatchGroupItem = routeMatchGroupList[i];
    if (routeMatchGroupItem.routeMatches.includes(routeMatch)) {
      result.push(routeMatchGroupItem);
    }
  }
  return result;
};
