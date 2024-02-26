import assert from 'node:assert';
import {
  createAccount,
  updateAccount,
  getAccountByUsername,
  removeAccount,
  createRouteMatch,
  createRouteMatchGroup,
  getAccountRouteMatches,
  removeRouteMatchGroup,
  getAccount,
  removeRouteMatch,
  updateRouteMatchGroup,
} from './apis.mjs';

const createRouteMatches = async (arr) => {
  const result = [];
  await arr.reduce(async (acc, cur) => {
    await acc;
    const routeMatchItem = await createRouteMatch({
      path: cur,
      value: 15,
    });
    assert(routeMatchItem);
    result.push(routeMatchItem);
  }, Promise.resolve);
  return result;
};

const pipeline = async () => {
  const username = 'test_cccc';
  const password = '456j';
  const accountMatched = await getAccountByUsername(username);
  if (accountMatched) {
    const data = await removeAccount(accountMatched._id);
    assert(data);
  }
  const routeMatchList = await createRouteMatches([
    '/aa',
    '/bb',
    '/cc',
    '/aa/bb',
    '/aa/cc',
  ]);
  let routeMatchGroupItem = await createRouteMatchGroup({
    name: 'bbccddee',
    routeMatches: routeMatchList.map((d) => d._id),
  });
  assert(routeMatchGroupItem);

  const routeMatchGroupItem2 = await createRouteMatchGroup({
    name: 'bbccddee',
    routeMatches: routeMatchList.slice(0, 2).map((d) => d._id),
  });

  assert(routeMatchGroupItem2);

  const routeMatchGroupItem3 = await createRouteMatchGroup({
    name: 'bbccddee',
    routeMatches: [...routeMatchList.map((d) => d._id), routeMatchList[0]._id],
  });

  assert(!routeMatchGroupItem3);

  let accountItem = await createAccount({
    username,
    password,
  });
  assert(accountItem);

  assert(!accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem2._id));
  assert(!accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));

  accountItem = await updateAccount({
    account: accountItem._id,
    data: {
      routeMatchGroups: [routeMatchGroupItem._id, routeMatchGroupItem2._id],
    },
  });
  assert(accountItem);
  const accountRouteMatchList = await getAccountRouteMatches(accountItem._id);
  assert(routeMatchList.every((d) => accountRouteMatchList.find((dd) => dd._id === d._id)));

  const accountItemEmpty = await updateAccount({
    account: accountItem._id,
    data: {
      routeMatchGroups: [routeMatchGroupItem._id, routeMatchGroupItem._id],
    },
  });

  assert(!accountItemEmpty);

  await removeRouteMatchGroup(routeMatchGroupItem2._id);

  accountItem = await getAccount(accountItem._id);
  assert(accountItem);

  assert(!accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem2._id));
  assert(accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));

  await removeAccount(accountItem._id);

  await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      isSetDefault: true,
    },
  });
  accountItem = await createAccount({
    username,
    password,
  });
  assert(accountItem);
  assert(accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));

  await updateRouteMatchGroup({
    routeMatchGroup: routeMatchGroupItem._id,
    data: {
      isSetDefault: false,
    },
  });

  assert(accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));

  const accountItem2 = await createAccount({
    username: `${username}_1`,
    password,
  });

  assert(accountItem2);
  assert(!accountItem2.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));

  routeMatchGroupItem = await removeRouteMatchGroup(routeMatchGroupItem._id);
  assert(routeMatchGroupItem);

  accountItem = await removeAccount(accountItem._id);
  assert(!accountItem.routeMatchGroups.some((routeMatchGroup) => routeMatchGroup === routeMatchGroupItem._id));
  assert(accountItem);
  await removeAccount(accountItem2._id);
  await routeMatchList.reduce(async (acc, cur) => {
    await acc;
    await removeRouteMatch(cur._id);
  }, Promise.resolve);
};

await pipeline();
