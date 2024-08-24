export default {
  _id: {
    type: 'string',
  },
  name: {
    type: 'string',
  },
  description: {
    type: 'string',
  },
  dateTimeCreate: {
    type: 'number',
  },
  isSetDefault: {
    type: 'boolean',
  },
  routeMatches: {
    type: 'array',
    properties: ['.', { type: 'string' }],
  },
};
