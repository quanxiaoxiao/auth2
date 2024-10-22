export default {
  _id: {
    type: 'string',
  },
  username: {
    type: 'string',
  },
  nickName: {
    type: 'string',
  },
  type: {
    type: 'integer',
  },
  description: {
    type: 'string',
  },
  dateTimeExpired: {
    type: 'number',
  },
  avatar: {
    type: 'string',
  },
  info: {
    type: 'string',
  },
  dateTimeCreate: {
    type: 'number',
  },
  dateTimeUpdateWithPassword: {
    type: 'number',
  },
  routeMatchGroups: {
    type: 'array',
    properties: ['.', { type: 'string' }],
  },
};
