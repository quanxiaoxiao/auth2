import store from '../../store/store.mjs';

const { getState } = store;

export default (name) => {
  const routeMatchGroupItem = getState().data.routeMatchGroupList.find((d) => d.name === name);
  return routeMatchGroupItem;
};
