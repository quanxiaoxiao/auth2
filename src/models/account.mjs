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
  nickName: {
    type: String,
    default: '',
  },
  password: {
    type: String,
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
  dateTimeUpdate: {
    type: Number,
    default: Date.now,
  },
  dateTimeUpdateWithPassword: {
    type: Number,
    default: null,
  },
  dateTimeExpired: {
    type: Number,
    index: true,
  },
  description: {
    type: String,
    default: '',
  },
  dateTimeCreate: {
    type: Number,
    index: true,
    default: Date.now,
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
