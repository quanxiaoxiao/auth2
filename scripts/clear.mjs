import assert from 'node:assert';
import {
  getRouteMatchGroups,
  removeRouteMatchGroup,
} from './apis.mjs';

const routeMatchGroupList = await getRouteMatchGroups();

await routeMatchGroupList.reduce(async (acc, cur) => {
  await acc;
  await removeRouteMatchGroup(cur._id);
}, Promise.resolve);

const routeMatchGroupList2 = await getRouteMatchGroups();

assert.equal(routeMatchGroupList2.length, 0);
