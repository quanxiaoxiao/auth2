import { find } from '@quanxiaoxiao/list';

import { getState } from '../../store/store.mjs';

export default (routeMatchGroup) => {
  const routeMatchGroupItem = find(getState().data.routeMatchGroupList)(routeMatchGroup);
  return routeMatchGroupItem;
};
