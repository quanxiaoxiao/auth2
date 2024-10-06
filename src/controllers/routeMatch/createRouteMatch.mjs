import { sort } from '@quanxiaoxiao/list';
import logger from '../../logger.mjs';
import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';
import store from '../../store/store.mjs';
import checkPathValidate from './checkPathValidate.mjs';

const { dispatch } = store;

export default async (input) => {
  checkPathValidate(input.path);
  const routeMatchItem = new RouteMatchModel({
    ...input,
  });
  await routeMatchItem.save();
  logger.warn(`createRouteMatch \`${JSON.stringify(input)}\``);
  const data = {
    _id: routeMatchItem._id.toString(),
    path: routeMatchItem.path,
    value: routeMatchItem.value,
    description: routeMatchItem.description,
    dateTimeCreate: routeMatchItem.dateTimeCreate,
  };
  dispatch('data.routeMatchList', (pre) => sort([...pre, data]));
  return data;
};
