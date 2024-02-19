import process from 'node:process';
import shelljs from 'shelljs';
import store from './store/store.mjs';
import './models/index.mjs';
import createServer from './http/createServer.mjs';

const { getState } = store;

createServer();

process.on('exit', () => {
  if (shelljs.test('-f', getState().configPathnames.state)) {
    shelljs.rm(getState().configPathnames.state);
  }
});

process.on('SIGINT', () => {
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  console.log('boooooooom');
  console.log(error);
  process.exit(1);
});
