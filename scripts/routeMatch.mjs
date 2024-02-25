import assert from 'node:assert';
import {
  createRouteMatch,
  getRouteMatches,
  createAccount,
  removeAccount,
  createRouteMatchGroup,
  removeRouteMatch,
  getAccount,
  getRouteMatch,
  updateRouteMatchGroup,
  getRouteMatchGroup,
  removeRouteMatchGroup,
} from './apis.mjs';

const pipeline = async () => {
  let routeMatchItem = await createRouteMatch({
    path: 'aaa',
  });

  assert(!routeMatchItem);

  routeMatchItem = await createRouteMatch({
    path: '/aaa',
  });

  assert(routeMatchItem);

  let routeMatchList = await getRouteMatches();

  assert(routeMatchList.some((d) => d._id === routeMatchItem._id));

  let routeMatchGroupItem = await createRouteMatchGroup({
    name: 'bbb',
    routeMatches: [routeMatchItem._id],
  });

  assert(routeMatchGroupItem);
  assert(routeMatchGroupItem.routeMatches[0] === routeMatchItem._id);

  routeMatchItem = await removeRouteMatch(routeMatchItem._id);

  assert(routeMatchItem);

  routeMatchList = await getRouteMatches();

  assert(!routeMatchList.some((d) => d._id === routeMatchItem._id));

  routeMatchGroupItem = await getRouteMatchGroup(routeMatchGroupItem._id);

  assert(routeMatchGroupItem.routeMatches.length === 0);

  const routeMatchGroupEmpty = await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      routeMatches: [routeMatchItem._id],
    },
  });

  assert(!routeMatchGroupEmpty);

  routeMatchItem = await getRouteMatch(routeMatchItem._id);

  assert(!routeMatchItem);

  routeMatchItem = await createRouteMatch({
    path: '/bbb',
  });

  routeMatchGroupItem = await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      routeMatches: [routeMatchItem._id],
    },
  });
  assert(routeMatchGroupItem);
  assert(routeMatchGroupItem.routeMatches[0] === routeMatchItem._id);

  let accountItem = await createAccount({
    username: 'test_aaa',
    password: '123',
  });

  assert(accountItem);
  assert(!accountItem.routeMatchGroups.includes(routeMatchGroupItem._id));

  await removeAccount(accountItem._id);

  routeMatchGroupItem = await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      isSetDefault: true,
    },
  });

  assert(routeMatchGroupItem);

  accountItem = await createAccount({
    username: 'test_aaa',
    password: '123',
  });

  assert(accountItem);
  assert(accountItem.routeMatchGroups.includes(routeMatchGroupItem._id));

  routeMatchGroupItem = await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      isSetDefault: false,
    },
  });
  assert(routeMatchGroupItem);

  accountItem = await getAccount(accountItem._id);

  assert(accountItem);

  assert(accountItem.routeMatchGroups.includes(routeMatchGroupItem._id));

  let accountItem2 = await createAccount({
    username: 'test_aaa2',
    password: '123',
  });

  assert(accountItem2);
  assert(!accountItem2.routeMatchGroups.includes(routeMatchGroupItem._id));

  routeMatchGroupItem = await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      isSetDefault: true,
    },
  });
  assert(routeMatchGroupItem);

  accountItem2 = await getAccount(accountItem2._id);

  assert(accountItem2);
  assert(!accountItem2.routeMatchGroups.includes(routeMatchGroupItem._id));

  await removeAccount(accountItem2._id);

  routeMatchGroupItem = await removeRouteMatchGroup(routeMatchGroupItem._id);
  assert(routeMatchGroupItem);
  accountItem = await getAccount(accountItem._id);
  assert(accountItem);

  assert(!accountItem.routeMatchGroups.includes(routeMatchGroupItem._id));

  routeMatchItem = await removeRouteMatch(routeMatchItem._id);
  assert(routeMatchItem);

  await removeAccount(accountItem._id);
};

await pipeline();
