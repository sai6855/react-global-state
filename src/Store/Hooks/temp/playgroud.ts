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

//declare function get<T, P extends Path<T>>(obj: T, path: P): PathValue<T, P>;

const object = {
  firstName: 'Diego',
  lastName: 'Haz',
  age: 30,
  a: {
    b: {
      c: {},
    },
  },
  projects: [
    { name: 'Reakit', contributors: 68 },
    { name: 'Constate', contributors: 12 },
  ],
} as const;

function get<T, P extends Path<T>>(obj: T, path: P) {}

get(object, 'a.b.c');
