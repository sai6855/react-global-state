// eslint-disable-next-line no-use-before-define
import React, { createContext, ReactChild, useCallback, useState } from 'react';

interface Value<StoreType, SetState> {
  state: StoreType;
  setState: SetState;
}

export const Context = createContext<Value>({
  state: {},
  setState: () => {},
});

function StoreProvider<StoreType>({
  store,
  children,
}: {
  store: StoreType;
  children: ReactChild;
}): any {
  const [state, change] = useState<StoreType>(store);

  type PathImpl<T, Key extends keyof T> = Key extends string
    ? T[Key] extends Record<string, any>
      ?
          | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
          | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
      : never
    : never;

  type Path<T> = PathImpl<T, keyof T> | keyof T;

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

  // console.log(state)

  const value: Value<StoreType, typeof setState> = {
    state,
    setState,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export default StoreProvider;
