import mongoose from 'mongoose';

const { Schema } = mongoose;

export default new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
  },
  isSetDefault: {
    type: Boolean,
    default: false,
  },
  routeMatches: [{
    type: Schema.Types.ObjectId,
    ref: 'RouteMatch',
  }],
  description: {
    type: String,
  },
  timeCreate: {
    type: Number,
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
