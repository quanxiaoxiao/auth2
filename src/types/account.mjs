export default {
  _id: {
    type: 'string',
  },
  username: {
    type: 'string',
  },
  type: {
    type: 'integer',
  },
  description: {
    type: 'string',
  },
  timeExpired: {
    type: 'number',
  },
  avatar: {
    type: 'string',
  },
  info: {
    type: 'string',
  },
  timeCreate: {
    type: 'number',
  },
  timeUpdateWithPassword: {
    type: 'number',
  },
  routeMatchGroups: {
    type: 'array',
    properties: ['.', { type: 'string' }],
  },
};
