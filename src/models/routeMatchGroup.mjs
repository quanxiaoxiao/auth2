import mongoose from 'mongoose';

const { Schema } = mongoose;

const routeMatchGroupSchema = new Schema({
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
  dateTimeCreate: {
    type: Number,
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

export default routeMatchGroupSchema;
