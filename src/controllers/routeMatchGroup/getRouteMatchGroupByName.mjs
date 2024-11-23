import { getState } from '../../store/store.mjs';

export default (name) => {
  const routeMatchGroupItem = getState().data.routeMatchGroupList.find((d) => d.name === name);
  return routeMatchGroupItem;
};
