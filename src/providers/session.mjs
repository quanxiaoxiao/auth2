import mongoose from 'mongoose';
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
    timeExpired = Number(timeExpired);
    session = mongoose.Types.ObjectId(session);
    if (Number.isNaN(timeExpired) || timeExpired < now) {
      return null;
    }
    return session;
  } catch (error) {
    return null;
  }
};
