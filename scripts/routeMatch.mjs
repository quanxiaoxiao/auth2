import assert from 'node:assert';
import { http } from '@quanxiaoxiao/about-net';
import { decodeContentToJSON } from '@quanxiaoxiao/http-utils';

const port = 4037;
const hostname = '127.0.0.1';

const getRouteMatch = async (routeMatch) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: `/authapi/routematch/${routeMatch}`,
    method: 'GET',
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const createRouteMatch = async ({
  path,
  value = 15,
}) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
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
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const removeRouteMatch = async (routeMatch) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: `/authapi/routematch/${routeMatch}`,
    method: 'DELETE',
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const getRouteMatches = async () => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: '/authapi/routematches',
    method: 'GET',
  });
  assert(requestRet.statusCode === 200);
  const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
  return data;
};

const createRouteMatchGroup = async ({
  name,
  isSetDefault = false,
  routeMatches = [],
}) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
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
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const updateRouteMatchGroup = async ({
  routeMatchGroup,
  data,
}) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'PUT',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (requestRet.statusCode === 200) {
    const ret = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return ret;
  }
  return null;
};

const getRouteMatchGroup = async (routeMatchGroup) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'GET',
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

const removeRouteMatchGroup = async (routeMatchGroup) => {
  const requestRet = await http.httpRequest({
    hostname,
    port,
    path: `/authapi/routematchgroup/${routeMatchGroup}`,
    method: 'DELETE',
    body: null,
  });
  if (requestRet.statusCode === 200) {
    const data = await decodeContentToJSON(requestRet.body, requestRet.headers);
    return data;
  }
  return null;
};

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

  routeMatchGroupItem = await removeRouteMatchGroup(routeMatchGroupItem._id);
  assert(routeMatchGroupItem);
  routeMatchItem = await removeRouteMatch(routeMatchItem._id);
  assert(routeMatchItem);
};

await pipeline();
