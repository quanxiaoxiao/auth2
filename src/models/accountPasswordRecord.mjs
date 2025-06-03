import mongoose from 'mongoose';

const { Schema } = mongoose;

const accountPasswordRecordSchema = new Schema({
  dateTimeCreate: {
    type: Number,
    default: Date.now,
    index: true,
  },
  account: {
    type: Schema.Types.ObjectId,
    ref: 'Account',
    index: true,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  invalid: {
    type: Boolean,
    index: true,
    default: false,
  },
  dateTimeInvalid: {
    type: Number,
  },
});

export default accountPasswordRecordSchema;
