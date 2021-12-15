import React, { ReactChild, useCallback } from 'react';

function useProvider<StoreType>(store: StoreType) {
  const [state, change] = React.useState<StoreType>(store);

  const setState = useCallback(
    <P extends Path<StoreType>>(callback: any, keyPaths: P) => {
      let paths: string[];

      if (typeof keyPaths === 'string') {
        paths = keyPaths.split('.');
      }

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
    },
    []
  );

  return {
    store: state,
    setState,
  };
}

export const Context = React.createContext(
  {} as ReturnType<typeof useProvider>
);

function ContextProvider<StoreType>({
  store,
  children,
}: {
  store: StoreType;
  children: ReactChild;
}) {
  return (
    <Context.Provider value={useProvider(store)}>{children}</Context.Provider>
  );
}

export default ContextProvider;
