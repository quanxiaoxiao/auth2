import mongoose from 'mongoose';

const { Schema } = mongoose;

export default new Schema({
  path: {
    type: String,
    required: true,
    trim: true,
  },
  order: {
    type: Number,
  },
  category: {
    type: String,
  },
  value: {
    type: Number,
    defaultValue: 0,
    validate: {
      validator: (v) => {
        if (v == null) {
          return false;
        }
        return v >= 0 && v <= 15;
      },
      message: (props) => `${props.value} invalid`,
    },
  },
  description: {
    type: String,
    default: '',
    trim: true,
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
