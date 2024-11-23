import { decodeSession } from '../../providers/session.mjs';
import { getState } from '../../store/store.mjs';

const getToken = (request) => {
  const sessionAuthKey = getState().session.authKey;
  if (Object.hasOwnProperty.call(request.headers, sessionAuthKey)) {
    return request.headers[sessionAuthKey];
  }
  return null;
};

export default (request) => {
  const token = getToken(request);
  if (!token) {
    return null;
  }
  const session = decodeSession(token);
  return session;
};
