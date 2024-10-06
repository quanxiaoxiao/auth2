import { find } from '@quanxiaoxiao/list';
import store from '../../store/store.mjs';

const { getState } = store;

export default (routeMatchGroup) => {
  const routeMatchGroupItem = find(getState().data.routeMatchGroupList)(routeMatchGroup);
  return routeMatchGroupItem;
};
