import store from '../../store/store.mjs';

const { getState } = store;

export default () => {
  const { routeMatchGroupList } = getState().data;
  return routeMatchGroupList.filter((routeMatchGroupItem) => routeMatchGroupItem.isSetDefault);
};
