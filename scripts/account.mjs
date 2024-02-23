import assert from 'node:assert';
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

const checkSessionValid = async (token) => {
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

const getAccountSessionCount = async (account) => {
  const requestRet = await http.httpRequest({
    hostname: '127.0.0.1',
    port,
    method: 'GET',
    path: `/authapi/sessions?account=${account}`,
    body: null,
  });
  assert(requestRet.statusCode === 200);
  const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
  return data.count;
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
  const sessionValid = await checkSessionValid(sessionItem.token);
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
  password,
}) => {
  console.log(`\`${username}\` will remove account`);
  const accountItem = await removeAccount(account);
  assert(accountItem);
  console.log(`\`${username}\` remove account success`);
  await testSessionUnableCreate({
    username,
    password,
  });
  const sessionCount = await getAccountSessionCount(accountItem._id);
  assert(sessionCount === 0);
};

const pipeline = async (username) => {
  console.log(`will create account \`${username}\``);
  const accountMatched = await getAccountByUsername(username);
  if (accountMatched) {
    console.log(`\`${username}\` already exit will remove`);
    const data = await removeAccount(accountMatched._id);
    assert(data);
  }
  const password = '123';
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

  await testAccountRemove({
    account: accountItem._id,
    username,
    password,
  });
  console.log(8888);
};

await pipeline('test_2');
