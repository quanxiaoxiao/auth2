import mongoose from 'mongoose';

const { Schema } = mongoose;

export default new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    match: /^\w{2,500}$/,
    index: true,
  },
  password: {
    type: String,
    required: true,
    index: true,
  },
  avatar: {
    type: String,
  },
  info: {
    type: String,
  },
  routeMatchGroups: [{
    type: Schema.Types.ObjectId,
    ref: 'RouteMatchGroup',
  }],
  type: {
    type: Number,
    required: true,
    validate: {
      validator: Number.isInteger,
      message: (props) => `${props.value} is not an integer value`,
    },
    index: true,
  },
  timeUpdate: {
    type: Number,
    default: Date.now,
  },
  timeUpdateWithPassword: {
    type: Number,
    default: Date.now,
  },
  timeExpired: {
    type: Number,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  timeCreate: {
    type: Number,
    index: true,
    default: Date.now,
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
