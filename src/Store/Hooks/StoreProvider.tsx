import React, { useCallback } from 'react';

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Path<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

type SetState<State> = <P extends Path<State>>(
  callback:
    | PathValue<State, P>
    | ((
        pathState: P extends string ? PathValue<State, P> : State,
        store: State
      ) => P extends string ? PathValue<State, P> : State),
  keyPaths?: P
) => void;

interface IContext<State> {
  state: State;
  setState: SetState<State>;
}

export function useProvider<StoreType>(store: StoreType) {
  const [state, change] = React.useState<StoreType>(store);

  const setState = useCallback(
    <P extends Path<StoreType>>(
      callback:
        | ((
            pathState: P extends string ? PathValue<StoreType, P> : StoreType,
            store: StoreType
          ) => P extends string ? PathValue<StoreType, P> : StoreType)
        | PathValue<StoreType, P>,
      keyPaths?: P
    ) => {
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

          return paths.length > 0 ? obj : (callback as StoreType);
        }

        const newCallback = callback as (
          pathState: PathValue<StoreType, P>,
          store: StoreType
        ) => PathValue<StoreType, P>;

        const newState = newCallback(
          paths.reduce((acc: any, path: string) => acc[path], prevStore),
          prevStore
        );

        if (typeof newState === 'function') {
          throw new Error("Functions shouldn't be returned from callback");
          // newState(setState);
          // return prevStore;
        }

        let obj = {};
        if (paths.length > 0) {
          obj = { ...prevStore };
          paths.reduce((acc: any, path: string) => {
            if (typeof acc[path] === 'undefined') {
              throw new Error(
                `We can't find value for path ${paths.join(
                  '--> '
                )}, Add ${path} value in default store and try again`
              );
            }

            if (path === paths[paths.length - 1]) {
              acc[path] = newState;
            }
            return acc[path];
          }, obj);
        }
        return paths.length > 0 ? (obj as StoreType) : (newState as StoreType);
      });
    },
    []
  );

  return {
    state,
    setState,
  };
}
//**************************JUNK*******************************
const object = {
  //firstName: 'Diego',
  age: 30,
  projects: [
    { name: 'Reakit', contributors: 68 },
    { name: 'Constate', contributors: 12 },
  ],
};

const { setState, state } = useProvider(object);

setState((a, b) => a);

// // // const Ctx = createContext(object);
// <Ctx.Provider value={{ state, setState, getState }}>s</Ctx.Provider>;
// **************************JUNK*******************************

export function createContext<T>(state: T) {
  return React.createContext({
    state,
    setState: () => {},
  } as IContext<T>);
}
