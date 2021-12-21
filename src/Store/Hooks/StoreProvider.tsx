import React, { useCallback } from 'react';

type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type Path<T> = PathImpl<T, keyof T> | keyof T;

// type PathValue<T, P extends Path<T>> = P extends `${infer Key}.${infer Rest}`
//   ? Key extends keyof T
//     ? Rest extends Path<T[Key]>
//       ? PathValue<T[Key], Rest>
//       : never
//     : never
//   : P extends keyof T
//   ? T[P]
//   : never;

type SetState<State> = <P extends Path<State>>(
  callback: any,
  keyPaths: P
) => void;

type Callback<State> = () => (arg: SetState<State>) => void;

type AsyncSetState<State> = (callBack: Callback<State>) => void;
export interface IContext<State> {
  state: State;
  setState: SetState<State>;
  asyncSetState: AsyncSetState<State>;
}

export function useProvider<StoreType>(store: StoreType) {
  const [state, change] = React.useState<StoreType>(store);

  type CallBack = () => (arg: typeof setState) => void;

  const asyncSetState = useCallback((callback: CallBack) => {
    const call = callback();
    call(setState);
  }, []);

  const setState = useCallback(
    <P extends Path<StoreType>>(callback: any, keyPaths?: P) => {
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
          throw new Error(
            "Functions shouldn't be returned from callback, use asyncSetState to handle async state"
          );
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
        return paths.length > 0 ? obj : newState;
      });
    },
    //eslint-disable-next-line
    []
  );

  return {
    state,
    setState,
    asyncSetState,
  };
}
//**************************JUNK*******************************
// const object = {
//   firstName: 'Diego',
//   lastName: 'Haz',
//   age: 30,
//   projects: [
//     { name: 'Reakit', contributors: 68 },
//     { name: 'Constate', contributors: 12 },
//   ],
// };

// const { getState } = useProvider(object);

// const val = getState('age');

// const Ctx = createContext(object);
// const { getState, setState, state } = useProvider(object);

// <Ctx.Provider value={{ state, setState, getState }}>s</Ctx.Provider>;
// **************************JUNK*******************************

export function createContext<T>(state: T) {
  return React.createContext({
    state,
    setState: () => {},
    asyncSetState: () => {},
  } as unknown as IContext<T>);
}
