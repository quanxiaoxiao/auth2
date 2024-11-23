import { getState } from '../../store/store.mjs';

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
