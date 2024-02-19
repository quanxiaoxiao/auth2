import mongoose from 'mongoose';

const { Schema } = mongoose;

export default new Schema({
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    required: true,
    index: true,
  },
  key: {
    type: String,
    required: true,
    trim: true,
    index: true,
  },
  value: {
    type: String,
    default: '',
  },
  timeCreate: {
    type: Number,
    default: Date.now,
  },
  timeUpdate: {
    type: Number,
    default: Date.now,
  },
});
