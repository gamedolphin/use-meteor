import { useContext, useCallback } from 'react';
import { MeteorContext } from './context';

export const useMethod = () => {
  const server = useContext(MeteorContext);
  const callMemo = useCallback((name, ...args) => server.call(name, ...args), [server]);

  console.log(callMemo);
  if (server) {
    return callMemo;
  }

  return () => { console.warn("server not ready yet") };
};
