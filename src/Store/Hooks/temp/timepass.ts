type PathImpls<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpls<T[Key], keyof T[Key]>}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;

type Paths<T> = PathImpls<T, keyof T> | keyof T;

type PathValue<T, P extends Paths<T>> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? Rest extends Paths<T[Key]>
      ? PathValue<T[Key], Rest>
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never;

const store = {
  firstName: 'Diego',
  age: 30,
  projects: [
    { name: 'Reakit', contributors: 68 },
    { name: 'Constate', contributors: 12 },
  ],
} ;

type StoreType = typeof store;

type K<O, P, S> = O extends string ? P : S;

const setState = <P extends Paths<StoreType>>(
  callback:
    | ((
        pathState: PathValue<StoreType, P>,
        store: StoreType
      ) => PathValue<StoreType, P>)
    | PathValue<StoreType, P>,
  keyPaths?: P
) => {};

setState((a, b) => a, 'projects');
setState((a, b) => a);
