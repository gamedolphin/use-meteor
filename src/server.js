import simpleddp from 'simpleddp';
import { simpleDDPLogin } from 'simpleddp-plugin-login';

export const createServer = (endpoint) => {
  const opts = {
    endpoint,
    SocketConstructor: WebSocket,
    reconnectInterval: 5000
  };

  return new simpleddp(opts, [simpleDDPLogin]);
};
