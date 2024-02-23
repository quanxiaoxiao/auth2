import mongoose from 'mongoose';
import { select } from '@quanxiaoxiao/datav';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { encode, decode } from './cipher.mjs';

export const encodeSession = ({
  timeExpired,
  session,
  type,
}) => encode(`${Date.now()}:${timeExpired}:${session.toString()}:${type}`);

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
    const now = Date.now();
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
