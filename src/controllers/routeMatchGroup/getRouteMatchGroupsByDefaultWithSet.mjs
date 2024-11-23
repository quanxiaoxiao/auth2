import { getState } from '../../store/store.mjs';

export default () => {
  const { routeMatchGroupList } = getState().data;
  return routeMatchGroupList.filter((routeMatchGroupItem) => routeMatchGroupItem.isSetDefault);
};
