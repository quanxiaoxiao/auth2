import { parseCookie } from '@quanxiaoxiao/http-utils';
import { decodeSession } from '../../providers/session.mjs';
import store from '../../store/store.mjs';

const { getState } = store;

const getToken = (request) => {
  if (Object.hasOwnProperty.call(request.headers, getState().session.authKey)) {
    return request.headers[getState().session.authKey];
  }
  return parseCookie(request.headers.cookie)[getState().session.key];
};

export default (request) => {
  const token = getToken(request);
  if (!token) {
    return null;
  }
  const session = decodeSession(token);
  return session;
};
