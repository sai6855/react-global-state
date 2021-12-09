// eslint-disable-next-line no-use-before-define
import React, { ReactChild, useCallback, useState } from 'react';

type context = {
  state: object;
  setState: (value: any, paths?: string[]) => void;
};

export const Context = React.createContext<context>({
  state: {},
  setState: () => {},
});

type Props = {
  children: ReactChild;
  store: object;
};

const StoreProvider = ({ store, children }: Props): any => {
  const [state, change] = useState(store);

  const setState = useCallback((callback: any, paths: string[] = []) => {
    change((prevStore) => {
      if (typeof callback !== 'function') {
        let obj = { ...prevStore };
        paths.reduce((acc: any, path: string) => {
          if (path === paths[paths.length - 1]) {
            acc[path] = callback;
          }
          return acc[path];
        }, obj);

        return paths.length > 0 ? obj : callback;
      }

      const newState = callback(
        [...paths].reduce((acc: any, path: string) => acc[path], prevStore),
        prevStore
      );

      if (typeof newState === 'function') {
        newState(setState);
        return prevStore;
      }

      let obj = {};
      if (paths.length > 0) {
        obj = { ...prevStore };
        paths.reduce((acc: any, path: string) => {
          if (path === paths[paths.length - 1]) {
            acc[path] = newState;
          }
          return acc[path];
        }, obj);
      }
      return paths.length > 0 ? obj : newState;
    });
    //eslint-disable-next-line
  }, []);

  // console.log(state)

  return (
    <Context.Provider
      value={{
        state,
        setState,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default StoreProvider;
