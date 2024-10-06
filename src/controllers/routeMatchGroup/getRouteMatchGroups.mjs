import store from '../../store/store.mjs';

const { getState } = store;

export default () => {
  const { routeMatchGroupList } = getState().data;
  return [...routeMatchGroupList].sort((a, b) => {
    if (a.dateTimeCreate === b.dateTimeCreate) {
      return 0;
    }
    if (a.dateTimeCreate > b.dateTimeCreate) {
      return -1;
    }
    return 1;
  });
};
