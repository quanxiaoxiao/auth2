import mongoose from 'mongoose';
import {
  SESSION_TYPE_UNSET,
  SESSION_TYPE_LOGIN,
  SESSION_TYPE_MANUAL,
} from '../constants.mjs';

const { Schema } = mongoose;

export default new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    required: true,
  },
  type: {
    type: Number,
    enum: [
      SESSION_TYPE_UNSET,
      SESSION_TYPE_LOGIN,
      SESSION_TYPE_MANUAL,
    ],
    index: true,
  },
  userAgent: {
    type: String,
  },
  remoteAddress: {
    type: String,
  },
  timeExpired: {
    type: Number,
    required: true,
    index: true,
  },
  description: {
    type: String,
  },
  hash: {
    type: String,
    index: true,
  },
  timeCreate: {
    type: Number,
    default: Date.now,
    index: true,
  },
  invalid: {
    type: Boolean,
    index: true,
    default: false,
  },
  timeInvalid: {
    type: Number,
  },
});
