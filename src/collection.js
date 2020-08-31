import { useContext, useState, useEffect } from 'react';
import { MeteorContext } from './context';

const noFilter = () => true;

export const useCollection = (name, filter = noFilter) => {

  const [data, setData] = useState([]);
  const server = useContext(MeteorContext);

  useEffect(() => {
    if (!server) {
      return () => { };
    }

    let reactiveCursor = server.collection(name).filter(filter).reactive();
    reactiveCursor.onChange(newData => setData(newData));

    setData(reactiveCursor.data());

    return () => reactiveCursor.stop();

  }, [server, name, filter]);

  return data;
};

export const useCollectionOne = (name, filter = noFilter) => {
  const [data, setData] = useState(null);
  const server = useContext(MeteorContext);

  useEffect(() => {
    if (!server) {
      return () => { };
    }

    let reactiveCursor = server.collection(name).filter(filter).reactive().one();
    reactiveCursor.onChange(newData => setData(newData));

    setData(reactiveCursor.data());

    return () => reactiveCursor.stop();

  }, [server, name, filter]);

  return data;
};
