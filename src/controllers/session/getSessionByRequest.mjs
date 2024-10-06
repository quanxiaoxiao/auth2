import { parseCookie } from '@quanxiaoxiao/http-utils';
import { decodeSession } from '../../providers/session.mjs';
import store from '../../store/store.mjs';

const { getState } = store;

const getToken = (request) => {
  const sessionAuthKey = getState().session.authKey;
  if (Object.hasOwnProperty.call(request.headers, sessionAuthKey)) {
    return request.headers[sessionAuthKey];
  }
  return parseCookie(request.headers.cookie)[sessionAuthKey];
};

export default (request) => {
  const token = getToken(request);
  if (!token) {
    return null;
  }
  const session = decodeSession(token);
  return session;
};
