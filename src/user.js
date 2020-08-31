import { MeteorContext } from './context';
import { useContext, useCallback } from 'react';
import useStore from './state.js';

const DEFAULT_USER_TOKEN = "user-token";

const saveToken = (key, token) => localStorage.setItem(key, token);
const getToken = (key) => localStorage.getItem(key, null);
const clearToken = (key) => localStorage.removeItem(key);

export const bindUserInfo = (server, userId, setUser) => {

  let userCursor = server.userReactiveCursor ? server.userReactiveCursor : server.collection('users').filter(user => user.id == userId).reactive().one();

  userCursor.onChange((newData) => setUser(newData));

  setUser(userCursor.data());

  userCursor.start();
  server.userReactiveCursor = userCursor;
};

export const stopUserInfo = (server) => {
  if (server.userReactiveCursor) {
    server.userReactiveCursor.stop();
  }
};

export const getBindUser = () => {
  const setUserId = useStore(state => state.setUserId);
  const setUser = useStore(state => state.setUser);
  const setLoggingIn = useStore(state => state.setLoggingIn);

  return async (server, tokenKey = DEFAULT_USER_TOKEN) => await bindUser(server, setUserId, setUser, setLoggingIn, tokenKey);
};

export const bindUser = async (server, setUserId, setUser, setLoggingIn, tokenKey = DEFAULT_USER_TOKEN) => {
  server.on('login', (m) => {
    setUserId(m.id, m.token);
    saveToken(tokenKey, m.token);
    bindUserInfo(server, m.id, setUser);
  });
  server.on('logout', () => {
    setUserId(null, null);
    setUser(null);
    clearToken(tokenKey);
    stopUserInfo(server);
  });
  server.on('loginResume', (m) => {
    setUserId(m.id, m.token);
    saveToken(tokenKey, m.token);
    bindUserInfo(server, m.id, setUser);
  });

  const resume = getToken(tokenKey);
  if (resume) {
    setLoggingIn(true);
    try {
      await server.login({ resume });
    }
    catch (ex) {
      console.log(ex);
    }
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  setLoggingIn(false);
};

export const useLogin = () => {
  const server = useContext(MeteorContext);
  const setLoggingIn = useStore(state => state.setLoggingIn);

  const login = async (email, password) => {
    setLoggingIn(true);
    await server.login({ password, user: { email } });
    setLoggingIn(false);
  };

  const memoLogin = useCallback(login, [server]);

  if (server) {
    return memoLogin;
  }

  return () => { console.warn("server not ready yet") };
};

export const useLogout = () => {
  const server = useContext(MeteorContext);

  if (server) {
    return server.logout;
  }

  return () => { console.warn("server not ready yet") };
};

export const useCurrentUser = () => {
  const user = useStore(state => state.user);
  const loggingIn = useStore(state => state.loggingIn);
  return [user, loggingIn];
};
