import { find } from '@quanxiaoxiao/list';
import { getState } from '../../store/store.mjs';

export default (routeMatch) => {
  const routeMatchItem = find(getState().data.routeMatchList)(routeMatch);
  return routeMatchItem;
};
