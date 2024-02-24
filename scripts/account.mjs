import assert from 'node:assert';
import dayjs from 'dayjs';
import { http } from '@quanxiaoxiao/about-net';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';
import { ACCOUNT_TYPE_TEST } from '../src/constants.mjs';

const port = 4037;

const createAccount = async ({
  username,
  password,
  ...other
}) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'POST',
    path: '/authapi/account',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      type: ACCOUNT_TYPE_TEST,
      ...other,
      username,
      password,
    }),
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const updateAccount = async ({
  account,
  data,
}) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'PUT',
    path: `/authapi/account/${account}`,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  });
  assert(requestRet.statusCode === 200);
  const ret = await decodeContentToJSON(requestRet.body, requestRet.headers);
  return ret;
};

const createSession = async ({
  username,
  password,
}) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'POST',
    path: '/api/session',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const getSessionValid = async (token) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'GET',
    path: '/api/session',
    headers: {
      'x-auth': token,
    },
    body: null,
  });
  if (requestRet.statusCode === 200) {
    return true;
  }
  return false;
};

const getAccountByUsername = async (username) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'GET',
    path: `/api/account?username=${username}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const removeAccount = async (account) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'DELETE',
    path: `/authapi/account/${account}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const getAccountSessions = async (account) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'GET',
    path: `/authapi/sessions?account=${account}`,
    body: null,
  });
  assert(requestRet.statusCode === 200);
  const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
  return data.list;
};

const testSessionUnableCreate = async ({
  username,
  password,
}) => {
  const sessionItem = await createSession({
    username,
    password,
  });
  assert(!sessionItem);
};

const testAccountRemove = async (account) => {
  const accountItem = await removeAccount(account);
  assert(accountItem);
  const sessionList = await getAccountSessions(accountItem._id);
  assert(sessionList.length === 0);
};

const testAccountSessionsExpired = async (account) => {
  const sessionList = await getAccountSessions(account);
  const now = Date.now();
  assert(sessionList.length > 0);
  assert(sessionList.every((d) => d.timeExpired < now));
};

const testSessionsCreate = async ({
  account,
  username,
  password,
  count = 1,
}) => {
  const sessionList = [];
  await new Array(count).fill(0).reduce(async (acc) => {
    await acc;
    const sessionItem = await createSession({ username, password });
    assert(sessionItem);
    sessionList.push({
      username,
      password,
      data: sessionItem,
    });
  }, Promise.resolve);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(valid);
  }, Promise.resolve);

  await updateAccount({
    account,
    data: {
      timeExpired: dayjs().subtract(1, 'day').valueOf(),
    },
  });
  await testAccountSessionsExpired(account);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(!valid);
  }, Promise.resolve);
  await updateAccount({
    account,
    data: {
      timeExpired: dayjs().add(1, 'day').valueOf(),
    },
  });
  await testAccountSessionsExpired(account);
  await sessionList.reduce(async (acc, sessionItem) => {
    await acc;
    const valid = await getSessionValid(sessionItem.data.token);
    assert(!valid);
  }, Promise.resolve);
};

const pipeline = async (username) => {
  console.log(`account \`${username}\` will test...`);
  const password = '123';
  const newPassword = '456';
  const accountMatched = await getAccountByUsername(username);
  if (accountMatched) {
    const data = await removeAccount(accountMatched._id);
    assert(data);
  }
  await testSessionUnableCreate({
    username,
    password,
  });
  const accountItem = await createAccount({
    username,
    password,
  });
  assert(accountItem);

  await testSessionsCreate({
    username,
    password,
    count: 33,
    account: accountItem._id,
  });

  const accountItemUpdateRet = await updateAccount({
    account: accountItem._id,
    data: {
      password: newPassword,
    },
  });

  assert(typeof accountItemUpdateRet.timeUpdateWithPassword === 'number');
  assert(Date.now() > accountItemUpdateRet.timeUpdateWithPassword);
  assert((Date.now() - 1000 * 5) < accountItemUpdateRet.timeUpdateWithPassword);

  await testSessionUnableCreate({
    username,
    password,
  });

  await testSessionsCreate({
    username,
    password: newPassword,
    count: 55,
    account: accountItem._id,
  });

  await testAccountRemove(accountItem._id);

  await testSessionUnableCreate({
    username,
    password: newPassword,
  });
  console.log(`account \`${username}\` test ok`);
};

await pipeline('test_2');
