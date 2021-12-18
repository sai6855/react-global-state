import React, { useCallback } from 'react';

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

export interface IContext<State> {
  state: State;
  setState<P extends Path<State>>(callback: any, keyPaths: P): void;
  getState<P extends Path<State>>(keyPaths: P): any;
}

export function useProvider<StoreType>(store: StoreType) {
  const [state, change] = React.useState<StoreType>(store);

  const setState = useCallback(
    <P extends Path<StoreType>>(callback: any, keyPaths: P) => {
      let paths: string[] = [];

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
          paths.reduce((acc: any, path: string) => acc[path], prevStore),
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

  const getState = useCallback(
    <P extends Path<StoreType>>(keyPaths: P) => {
      let paths: string[] = [];

      if (typeof keyPaths === 'string') {
        paths = keyPaths.split('.');
      }

      return paths.length === 0
        ? state
        : paths.reduce((acc: any, path: string) => acc[path], state);
    },
    [state]
  );

  return {
    state,
    setState,
    getState,
  };
}

export function createContext<T>(state: T) {
  return React.createContext({
    state,
    setState: () => {},
    getState: () => {},
  } as IContext<T>);
}
