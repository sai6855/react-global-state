type PathImpl<T, Key extends keyof T> = Key extends string
  ? T[Key] extends Record<string, any>
    ?
        | `${Key}.${PathImpl<T[Key], keyof T[Key]>}`
        | `${Key}.${Exclude<keyof T[Key], keyof any[]> & string}`
    : never
  : never;
type Path<T> = PathImpl<T, keyof T> | keyof T;

function StoreProvider<StoreType>({
  store,
}: {
  store: StoreType;
}): <P extends Path<StoreType>>(keyPaths: P) => void {
  const setState = <P extends Path<StoreType>>(keyPaths: P) => {
    let paths: string[];

    if (typeof keyPaths === 'string') {
      paths = keyPaths.split('.');
    }

    //eslint-disable-next-line
  };

  return setState;
}

export default StoreProvider;
