import mongoose from 'mongoose';
import { select } from '@quanxiaoxiao/datav';
import { getCurrentDateTime, getDateNow } from '@quanxiaoxiao/utils';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { encode, decode } from './cipher.mjs';

export const encodeSession = ({
  timeExpired,
  session,
  type,
}) => encode(`${getDateNow()}:${timeExpired}:${session.toString()}:${type}`);

export const decodeSession = (str) => {
  if (!str) {
    return null;
  }
  try {
    const text = decode(str);
    let [
      ,
      timeExpired,
      session,
    ] = text.split(':');
    if (!isValidObjectId(session)) {
      return null;
    }
    const now = getCurrentDateTime();
    timeExpired = select({ type: 'number' })(timeExpired);
    session = new mongoose.Types.ObjectId(session);
    if (timeExpired == null || timeExpired < now) {
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
};
