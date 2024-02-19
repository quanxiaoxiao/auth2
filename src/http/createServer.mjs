import net from 'node:net';
import { handleSocketHttp } from '@quanxiaoxiao/httttp';
import store from '../store/store.mjs';
import hooks from './hooks.mjs';

const { getState } = store;

export default () => {
  const server = net.createServer(handleSocketHttp(hooks));

  server.listen(getState().server.port);
};
