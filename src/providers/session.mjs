import mongoose from 'mongoose';
import { select } from '@quanxiaoxiao/datav';
import { isValidObjectId } from '@quanxiaoxiao/mongo';
import { encode, decode } from './cipher.mjs';

export const encodeSession = ({
  dateTimeExpired,
  session,
  type,
}) => encode(`${Date.now()}:${dateTimeExpired}:${session.toString()}:${type}`);

export const decodeSession = (str) => {
  if (!str) {
    return null;
  }
  try {
    const text = decode(str);
    let [, dateTimeExpired, session] = text.split(':');
    if (!session || !isValidObjectId(session)) {
      return null;
    }
    const now = Date.now();
    dateTimeExpired = select({ type: 'number' })(dateTimeExpired);
    session = new mongoose.Types.ObjectId(session);
    if (dateTimeExpired == null || dateTimeExpired < now) {
      return null;
    }
    return session;
  } catch (error) { // eslint-disable-line
    return null;
  }
};
