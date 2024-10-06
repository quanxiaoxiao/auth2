import { find } from '@quanxiaoxiao/list';
import store from '../../store/store.mjs';

const { getState } = store;

export default (routeMatch) => {
  const routeMatchItem = find(getState().data.routeMatchList)(routeMatch);
  return routeMatchItem;
};
