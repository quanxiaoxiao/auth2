import mongoose from 'mongoose';

import accountSchema from './account.mjs';
import routeMatchSchema from './routeMatch.mjs';
import routeMatchGroupSchema from './routeMatchGroup.mjs';
import sessionSchema from './session.mjs';

export const Account = mongoose.model('Account', accountSchema);
export const Session = mongoose.model('Session', sessionSchema);
export const RouteMatch = mongoose.model('RouteMatch', routeMatchSchema);
export const RouteMatchGroup = mongoose.model('RouteMatchGroup', routeMatchGroupSchema);
