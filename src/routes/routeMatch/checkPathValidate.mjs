import { pathToRegexp } from 'path-to-regexp';
import createError from 'http-errors';

export default (path) => {
  try {
    pathToRegexp(path);
  } catch (error) { // eslint-disable-line
    throw createError(400, `\`${path}\` path invalid`);
  }
};
