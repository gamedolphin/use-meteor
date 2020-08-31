import { useState, useEffect } from 'react';
import { createServer } from './server';
import { getBindUser } from './user';
import useStore from './state.js';

export const bindConnect = async (server, setConnection) => {
  server.on('connected', () => setConnection(true));
  server.on('disconnected', () => setConnection(false));

  await server.connect();
};

export const useConnect = (endpoint) => {
  const [server, setServer] = useState(null);
  const setConnected = useStore(state => state.setConnected);

  const bindUser = getBindUser();

  useEffect(() => {
    const server = createServer(endpoint);

    const connect = async () => {
      await bindConnect(server, setConnected);
      await bindUser(server);
    };

    setServer(server);
    connect();
  }, []);

  return server;
};

export const useConnectionState = () => {
  const connectionState = useStore(state => state.connected);
  return connectionState;
};
