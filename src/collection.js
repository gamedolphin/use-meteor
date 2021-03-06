import { useContext, useState, useEffect } from 'react';
import { MeteorContext } from './context';
import cloneDeep from 'lodash.clonedeep';

const noFilter = () => true;

export const useCollection = (name, filter = noFilter) => {

  const [data, setData] = useState([]);
  const server = useContext(MeteorContext);

  useEffect(() => {
    if (!server) {
      return () => { };
    }

    let reactiveCursor = server.collection(name).filter(filter).reactive();
    reactiveCursor.onChange(newData => setData(cloneDeep(newData)));

    setData(cloneDeep(reactiveCursor.data()));

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

    const reactiveList = server.collection(name).filter(filter).reactive();
    const reactiveCursor = reactiveList.one();

    reactiveCursor.onChange(newData => {
      if (reactiveList.count().result > 0) {
        setData(cloneDeep(newData));
      }
    });

    if (reactiveList.count().result > 0) {
      setData(cloneDeep(reactiveCursor.data()));
    }

    return () => reactiveCursor.stop();

  }, [server, name, filter]);

  return data;
};
