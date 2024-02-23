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

const testSessionCreate = async ({
  username,
  password,
}) => {
  console.log(`\`${username}\` will create session`);
  const sessionItem = await createSession({
    username,
    password,
  });
  assert(sessionItem);
  console.log(`\`${username}\` will check session valid`);
  const sessionValid = await getSessionValid(sessionItem.token);
  assert(sessionValid);
};

const testSessionUnableCreate = async ({
  username,
  password,
}) => {
  console.log(`\`${username}\` will test session unable create`);
  const sessionItem = await createSession({
    username,
    password,
  });
  assert(!sessionItem);
};

const testAccountRemove = async ({
  account,
  username,
}) => {
  console.log(`\`${username}\` will remove account`);
  const accountItem = await removeAccount(account);
  assert(accountItem);
  console.log(`\`${username}\` remove account success`);
  const sessionList = await getAccountSessions(accountItem._id);
  assert(sessionList.length === 0);
};

const testAccountSessionsExpired = async (account) => {
  const sessionList = await getAccountSessions(account);
  const now = Date.now();
  assert(sessionList.length > 0);
  assert(sessionList.every((d) => d.timeExpired < now));
};

const testAccountSessionsAllInvalid = async (account) => {
  const sessionList = await getAccountSessions(account);
  assert(sessionList.length > 0);
  await sessionList.reduce(async (acc, cur) => {
    await acc;
    const ret = await getSessionValid(cur.token);
    assert(!ret);
  }, Promise.resolve);
};

const pipeline = async (username) => {
  console.log(`will create account \`${username}\``);
  const password = '123';
  const newPassword = '456';
  const accountMatched = await getAccountByUsername(username);
  if (accountMatched) {
    console.log(`\`${username}\` already exit will remove`);
    const data = await removeAccount(accountMatched._id);
    assert(data);
  }
  const accountItem = await createAccount({
    username,
    password,
  });
  assert(accountItem);
  console.log(`account \`${username}\` create success`);
  await testSessionCreate({
    username,
    password,
  });

  await testSessionCreate({
    username,
    password,
  });

  await testSessionCreate({
    username,
    password,
  });

  await updateAccount({
    account: accountItem._id,
    data: {
      timeExpired: dayjs().subtract(1, 'day').valueOf(),
    },
  });

  await testAccountSessionsExpired(accountItem._id);

  await testAccountSessionsAllInvalid(accountItem._id);

  await testSessionUnableCreate({
    username,
    password,
  });

  await updateAccount({
    account: accountItem._id,
    data: {
      timeExpired: dayjs().add(2, 'day').valueOf(),
    },
  });

  await testSessionCreate({
    username,
    password,
  });

  await updateAccount({
    account: accountItem._id,
    data: {
      password: newPassword,
    },
  });

  await testAccountSessionsAllInvalid(accountItem._id);

  const sessionEmpty = await createSession({
    username,
    password,
  });

  assert(sessionEmpty === null);

  await testSessionCreate({
    username,
    password: newPassword,
  });

  await testAccountRemove({
    account: accountItem._id,
    username,
  });

  await testSessionUnableCreate({
    username,
    password: newPassword,
  });
};

await pipeline('test_2');
