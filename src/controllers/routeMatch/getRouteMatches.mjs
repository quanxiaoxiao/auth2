import { getState } from '../../store/store.mjs';

export default () => {
  const { routeMatchList } = getState().data;
  return [...routeMatchList].sort((a, b) => {
    if (a.dateTimeCreate === b.dateTimeCreate) {
      return 0;
    }
    if (a.dateTimeCreate > b.dateTimeCreate) {
      return -1;
    }
    return 1;
  });
};
