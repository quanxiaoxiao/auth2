import { RouteMatch as RouteMatchModel } from '../../models/index.mjs';
import checkPathValidate from './checkPathValidate.mjs';

export default async (input) => {
  checkPathValidate(input.path);
  const routeMatchItem = new RouteMatchModel({
    ...input,
  });
  await routeMatchItem.save();
  return routeMatchItem;
};
