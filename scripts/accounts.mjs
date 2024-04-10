import assert from 'node:assert';
import _ from 'lodash';
import {
  createAccount,
  createSession,
  getAccountByUsername,
  removeAccount,
} from './apis.mjs';

const accountList = _.times(100).map((i) => ({
  username: `test_aaa_${i}`,
  password: `aaabbb_${i}__cc_${i}`,
}));

const createAccounts = async (arr) => {
  await arr.reduce(async (acc, cur) => {
    await acc;
    const accountMatched = await getAccountByUsername(cur.username);
    if (accountMatched) {
      const data = await removeAccount(accountMatched._id);
      assert(data);
    }
  }, Promise.resolve);
  const ret = await Promise.all(arr.map(async (d) => {
    const accountItem = await createAccount({
      username: d.username,
      password: d.password,
    });
    assert(accountItem);
    return accountItem;
  }));
  return ret;
};

const removeAccounts = async (arr) => {
  const ret = await Promise.all(arr.map(async (d) => {
    const data = await removeAccount(d._id);
    assert(data);
    return data;
  }));
  return ret;
};

const createSessions = async (arr) => {
  const ret = await Promise.all(arr.map(async (d) => {
    const sessionItem = await createSession({
      username: d.username,
      password: d.password,
    });
    return sessionItem;
  }));
  return ret;
};

const list1 = await createAccounts(accountList);

const sessionList1 = await createSessions(accountList);

sessionList1.forEach((sessionItem, i) => {
  const accountItem = list1[i];

  assert(accountItem.username === sessionItem.account.username);
  assert(accountItem._id === sessionItem.account._id);
});

const list2 = await removeAccounts(list1);

const sessionList2 = await createSessions(accountList);

assert(sessionList2.every((sessionItem) => !sessionItem));

assert(JSON.stringify(list1) === JSON.stringify(list2));
