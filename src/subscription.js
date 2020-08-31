import { useContext, useState, useEffect } from 'react';
import { MeteorContext } from './context';

const subMap = {};

const getSub = (server, subName, args) => {
  let sub = subMap[subName];
  if (sub) {
    return [sub, false];
  }

  sub = server.subscribe(subName, ...args);
  subMap[subName] = sub;
  return [sub, true];
};

export const useSubscription = (subName, args = []) => {

  const [ready, setReady] = useState(false);
  const server = useContext(MeteorContext);

  useEffect(() => {
    if (!server) {
      return () => { };
    }

    const [sub, started] = getSub(server, subName, args);

    const fn = async () => {
      if (!started) {
        await sub.restart(args);
      }
      await sub.ready();
      setReady(true);
    };

    fn();

    return () => sub.stop();

  }, [server, subName, ...args]);

  return ready;
};
