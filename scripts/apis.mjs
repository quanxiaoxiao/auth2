import assert from 'node:assert';
import request from '@quanxiaoxiao/http-request';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';
import { ACCOUNT_TYPE_TEST } from '../src/constants.mjs';

const port = 4037;
const hostname = '127.0.0.1';

const httpRequest = async (options) => {
  const ret = await request(
    options,
    {
      hostname,
      port,
    },
  );
  return ret;
};

export const createAccount = async ({
  username,
  password,
  ...other
}) => {
  const requestRet = await httpRequest({
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
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const updateAccount = async ({
  account,
  data,
}) => {
  const requestRet = await httpRequest({
    method: 'PUT',
    path: `/authapi/account/${account}`,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
    }),
  });
  if (requestRet.statusCode === 200) {
    const ret = decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

export const createSession = async ({
  username,
  password,
}) => {
  const requestRet = await httpRequest({
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
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const createSessionByAccount = async ({
  account,
}) => {
  const requestRet = await httpRequest({
    method: 'POST',
    path: '/authapi/session',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      account,
    }),
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getSession = async (session) => {
  const requestRet = await httpRequest({
    method: 'GET',
    path: `/authapi/session/${session}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const ret = decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

export const updateSession = async ({
  session,
  data,
}) => {
  const requestRet = await httpRequest({
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
  const ret = decodeContentToJSON(requestRet.body, requestRet.headers);
  return ret;
};

export const getSessionByToken = async (token) => {
  const requestRet = await httpRequest({
    method: 'GET',
    path: '/api/session',
    headers: {
      'x-auth': token,
    },
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const ret = decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

export const getSessionValid = async (token) => {
  const requestRet = await httpRequest({
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
  const requestRet = await httpRequest({
    method: 'GET',
    path: `/api/account?username=${username}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const removeAccount = async (account) => {
  const requestRet = await httpRequest({
    method: 'DELETE',
    path: `/authapi/account/${account}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getAccountSessions = async (account) => {
  const requestRet = await httpRequest({
    method: 'GET',
    path: `/authapi/sessions?account=${account}`,
    body: null,
  });
  assert(requestRet.statusCode === 200);
  const data = decodeContentToJSON(requestRet.body, requestRet.headers);
  return data.list;
};

export const getRouteMatch = async (routeMatch) => {
  const requestRet = await httpRequest({
    path: `/authapi/routematch/${routeMatch}`,
    method: 'GET',
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const createRouteMatch = async ({
  path,
  value = 15,
}) => {
  const requestRet = await httpRequest({
    path: '/authapi/routematch',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      path,
      value,
    }),
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const removeRouteMatch = async (routeMatch) => {
  const requestRet = await httpRequest({
    path: `/authapi/routematch/${routeMatch}`,
    method: 'DELETE',
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getRouteMatches = async () => {
  const requestRet = await httpRequest({
    path: '/authapi/routematches',
    method: 'GET',
  });
  assert(requestRet.statusCode === 200);
  const data = decodeContentToJSON(requestRet.body, requestRet.headers);
  return data;
};

export const createRouteMatchGroup = async ({
  name,
  isSetDefault = false,
  routeMatches = [],
}) => {
  const requestRet = await httpRequest({
    path: '/authapi/routematchgroup',
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      name,
      isSetDefault,
      routeMatches,
    }),
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const updateRouteMatchGroup = async ({
  routeMatchGroup,
  data,
}) => {
  const requestRet = await httpRequest({
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (requestRet.statusCode === 200) {
    const ret = decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

export const getRouteMatchGroup = async (routeMatchGroup) => {
  const requestRet = await httpRequest({
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'GET',
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getRouteMatchGroups = async () => {
  const requestRet = await httpRequest({
    path: '/authapi/routematchgroups',
    method: 'GET',
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const removeRouteMatchGroup = async (routeMatchGroup) => {
  const requestRet = await httpRequest({
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'DELETE',
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getAccount = async (account) => {
  const requestRet = await httpRequest({
    method: 'GET',
    path: `/authapi/account/${account}`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

export const getAccountRouteMatches = async (account) => {
  const requestRet = await httpRequest({
    method: 'GET',
    path: `/authapi/account/${account}/routematches`,
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};
