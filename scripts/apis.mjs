import assert from 'node:assert';
import { http } from '@quanxiaoxiao/about-net';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';
import { ACCOUNT_TYPE_TEST } from '../src/constants.mjs';

const port = 4037;
const hostname = '127.0.0.1';

export const createAccount = async ({
  username,
  password,
  ...other
}) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const updateAccount = async ({
  account,
  data,
}) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const createSession = async ({
  username,
  password,
}) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const getSession = async (session) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    method: 'GET',
    path: `/authapi/session/${session}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const ret = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

export const updateSession = async ({
  session,
  data,
}) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    method: 'PUT',
    path: `/authapi/session/${session}`,
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

export const getSessionValid = async (token) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const getAccountByUsername = async (username) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const removeAccount = async (account) => {
  const requestRet = await http.httpRequest({
    hostname,
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

export const getAccountSessions = async (account) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    method: 'GET',
    path: `/authapi/sessions?account=${account}`,
    body: null,
  });
  assert(requestRet.statusCode === 200);
  const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
  return data.list;
};
