import createError from 'http-errors';
import { pathToRegexp } from 'path-to-regexp';

export default (path) => {
  try {
    pathToRegexp(path);
  } catch (error) {
    throw createError(400, `\`${path}\` path invalid`);
  }
};
